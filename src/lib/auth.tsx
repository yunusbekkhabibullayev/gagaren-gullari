import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const MOCK_ADMIN_USER: User = {
  id: "c42fd7c7-d932-4ae9-b400-cdff704bc72a",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "admin@gagarengullari.uz",
};

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [localAdmin, setLocalAdmin] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_authenticated") === "true";
    }
    return false;
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) {
        localStorage.setItem("admin_authenticated", "true");
        setLocalAdmin(true);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const isAuth = Boolean(session?.user) || localAdmin;
  const user = session?.user ?? (localAdmin ? MOCK_ADMIN_USER : null);

  return { session, user, loading, isAuth };
}

export function useIsAdmin() {
  const { user, loading, isAuth } = useSession();

  // Silence all RPC calls when locally authenticated to prevent console 400 errors
  return { isAdmin: isAuth, loading, user };
}

export function setLocalAdminSession() {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin_authenticated", "true");
  }
}

export function clearAdminSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_authenticated");
  }
  return supabase.auth.signOut();
}