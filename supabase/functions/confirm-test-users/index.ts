
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    const { email } = await req.json();
    
    // Check if this is a test user
    const testUsers = ['admin.basico@teste.com', 'admin.profissional@teste.com', 'admin.enterprise@teste.com'];
    
    if (!testUsers.includes(email)) {
      return new Response(JSON.stringify({ error: "Not a test user" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Get the user by email
    const { data: users, error: getUserError } = await supabaseClient.auth.admin.listUsers();
    
    if (getUserError) {
      throw getUserError;
    }

    const user = users.users.find(u => u.email === email);
    
    if (user && !user.email_confirmed_at) {
      // Confirm the user's email
      const { error: updateError } = await supabaseClient.auth.admin.updateUserById(user.id, {
        email_confirm: true
      });
      
      if (updateError) {
        throw updateError;
      }
      
      console.log(`Confirmed test user: ${email}`);
    }

    return new Response(JSON.stringify({ success: true, confirmed: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error confirming test user:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
