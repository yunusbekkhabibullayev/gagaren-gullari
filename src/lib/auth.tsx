import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const isAuth = Boolean(session?.user);
  const user = session?.user ?? null;

  return { session, user, loading, isAuth };
}

export function useIsAdmin() {
  const { user, loading, isAuth } = useSession();
  return { isAdmin: isAuth, loading, user };
}

export function clearAdminSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_authenticated");
  }
  return supabase.auth.signOut();
}
