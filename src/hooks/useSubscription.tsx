
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionStatus {
  subscribed: boolean;
  is_trial_active: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  trial_ends_at: string | null;
  has_used_trial: boolean;
  loading: boolean;
}

export const useSubscription = () => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    is_trial_active: false,
    subscription_tier: null,
    subscription_end: null,
    trial_ends_at: null,
    has_used_trial: false,
    loading: true,
  });

  const checkSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setStatus(prev => ({ ...prev, loading: false }));
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        setStatus(prev => ({ ...prev, loading: false }));
        return;
      }

      setStatus({
        ...data,
        loading: false,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    checkSubscription();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        checkSubscription();
      } else if (event === 'SIGNED_OUT') {
        setStatus({
          subscribed: false,
          is_trial_active: false,
          subscription_tier: null,
          subscription_end: null,
          trial_ends_at: null,
          has_used_trial: false,
          loading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { status, checkSubscription };
};
