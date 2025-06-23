
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-TRIAL-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const { planId } = await req.json();
    logStep("Plan ID received", { planId });

    // Verificar se há autenticação (opcional)
    let user = null;
    let userEmail = null;
    const authHeader = req.headers.get("Authorization");
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
      if (!userError && userData.user) {
        user = userData.user;
        userEmail = user.email;
        logStep("User authenticated", { userId: user.id, email: userEmail });

        // Check if user has already used trial
        const { data: existingSubscriber } = await supabaseClient
          .from("subscribers")
          .select("has_used_trial")
          .eq("email", userEmail)
          .single();

        if (existingSubscriber?.has_used_trial) {
          throw new Error("Trial already used. Please choose a paid plan.");
        }
      }
    }

    if (!user) {
      logStep("No authenticated user - allowing guest checkout");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2023-10-16" });

    // Check for existing customer only if we have an email
    let customerId;
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    // Define pricing based on planId
    const planPricing = {
      basic: { amount: 9900, name: "Plano Básico" }, // R$ 99
      professional: { amount: 19900, name: "Plano Profissional" }, // R$ 199
      enterprise: { amount: 39900, name: "Plano Enterprise" }, // R$ 399
    };

    const selectedPlan = planPricing[planId as keyof typeof planPricing];
    if (!selectedPlan) throw new Error("Invalid plan selected");

    logStep("Creating checkout session with trial", { plan: selectedPlan });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : undefined, // Let Stripe collect email if no customer
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { 
              name: selectedPlan.name,
              description: "30 dias grátis, depois " + (selectedPlan.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + "/mês"
            },
            unit_amount: selectedPlan.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 30,
      },
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/subscription`,
      allow_promotion_codes: true,
    });

    // Update subscriber record with trial start only if we have a user
    if (user && userEmail) {
      const trialStartDate = new Date();
      const trialEndDate = new Date(trialStartDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      await supabaseClient.from("subscribers").upsert({
        email: userEmail,
        user_id: user.id,
        stripe_customer_id: customerId || null,
        trial_started_at: trialStartDate.toISOString(),
        trial_ends_at: trialEndDate.toISOString(),
        is_trial_active: true,
        has_used_trial: true,
        subscription_tier: planId,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
    }

    logStep("Trial checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
