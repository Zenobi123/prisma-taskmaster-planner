import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

export type UserRole = "admin" | "comptable" | "assistant";

interface AuthState {
  session: Session | null;
  user: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    userRole: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const fetchUserRole = useCallback(async (userId: string): Promise<UserRole | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user role");
        return null;
      }

      return data?.role as UserRole || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Defer role fetch to avoid blocking auth state update
          const role = await fetchUserRole(session.user.id);
          setAuthState({
            session,
            user: session.user,
            userRole: role,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            session: null,
            user: null,
            userRole: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const role = await fetchUserRole(session.user.id);
        setAuthState({
          session,
          user: session.user,
          userRole: role,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          session: null,
          user: null,
          userRole: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserRole]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    // Clean up any legacy localStorage items
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
  }, []);

  return {
    ...authState,
    signOut,
  };
};
