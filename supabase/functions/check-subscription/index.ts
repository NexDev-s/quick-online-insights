
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if this is a test user first
    const testUsers = ['admin.basico@teste.com', 'admin.profissional@teste.com', 'admin.enterprise@teste.com'];
    const isTestUser = testUsers.includes(user.email);
    
    if (isTestUser) {
      logStep("Test user detected", { email: user.email });
      
      // Confirm test user if not already confirmed
      if (!user.email_confirmed_at) {
        logStep("Confirming test user email");
        await supabaseClient.auth.admin.updateUserById(user.id, {
          email_confirm: true
        });
      }
      
      // Get subscriber info for test user
      const { data: subscriber } = await supabaseClient
        .from("subscribers")
        .select("*")
        .eq("email", user.email)
        .single();

      if (subscriber) {
        // Update user_id if not set
        if (!subscriber.user_id) {
          await supabaseClient.from("subscribers").update({
            user_id: user.id,
            updated_at: new Date().toISOString(),
          }).eq("email", user.email);
        }

        logStep("Test user subscription found", { 
          tier: subscriber.subscription_tier, 
          subscribed: subscriber.subscribed 
        });

        return new Response(JSON.stringify({
          subscribed: subscriber.subscribed,
          is_trial_active: subscriber.is_trial_active,
          trial_ends_at: subscriber.trial_ends_at,
          subscription_tier: subscriber.subscription_tier,
          subscription_end: subscriber.subscription_end,
          has_used_trial: subscriber.has_used_trial
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2023-10-16" });

    // Get current subscriber info
    const { data: subscriber } = await supabaseClient
      .from("subscribers")
      .select("*")
      .eq("email", user.email)
      .single();

    let isTrialActive = false;
    let subscribed = false;
    let subscriptionTier = null;
    let subscriptionEnd = null;
    let trialEndsAt = null;

    // Check trial status
    if (subscriber?.trial_ends_at) {
      const trialEndDate = new Date(subscriber.trial_ends_at);
      const now = new Date();
      isTrialActive = now < trialEndDate;
      trialEndsAt = subscriber.trial_ends_at;
      logStep("Trial status checked", { isTrialActive, trialEndDate: trialEndDate.toISOString() });
    }

    // Check Stripe subscription status
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length > 0) {
      const customerId = customers.data[0].id;
      logStep("Found Stripe customer", { customerId });

      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0];
        subscribed = true;
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        
        // Determine tier from price
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount || 0;
        
        if (amount <= 9999) {
          subscriptionTier = "basic";
        } else if (amount <= 19999) {
          subscriptionTier = "professional";
        } else {
          subscriptionTier = "enterprise";
        }
        
        // If subscription is active, trial is no longer active
        isTrialActive = false;
        
        logStep("Active subscription found", { subscriptionId: subscription.id, tier: subscriptionTier });
      }
    }

    // Update database with current status
    await supabaseClient.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customers.data.length > 0 ? customers.data[0].id : null,
      subscribed: subscribed,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      is_trial_active: isTrialActive,
      trial_ends_at: trialEndsAt,
      has_used_trial: subscriber?.has_used_trial || false,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("Updated database", { subscribed, isTrialActive, subscriptionTier });

    return new Response(JSON.stringify({
      subscribed: subscribed,
      is_trial_active: isTrialActive,
      trial_ends_at: trialEndsAt,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      has_used_trial: subscriber?.has_used_trial || false
    }), {
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
