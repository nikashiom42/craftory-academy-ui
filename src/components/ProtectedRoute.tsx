/**
 * ProtectedRoute Component
 * 
 * Wrapper component that enforces authentication and role-based access control.
 * Checks if user is authenticated and optionally verifies they have the required role.
 * Redirects to /auth if unauthorized.
 */

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [requiredRole]);

  /**
   * Verifies user authentication and role permissions
   * Uses the has_role security definer function to bypass RLS
   */
  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      if (requiredRole) {
        const { data, error } = await supabase
          .rpc("has_role", { _user_id: session.user.id, _role: requiredRole });

        if (error) {
          console.error("Error checking role:", error);
          setAuthorized(false);
        } else {
          setAuthorized(data === true);
        }
      } else {
        setAuthorized(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

