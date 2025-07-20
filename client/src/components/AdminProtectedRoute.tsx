import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // User is not logged in, redirect to admin login
        toast({
          title: "Admin Access Required",
          description: "Please sign in with admin credentials to access this area.",
          variant: "destructive",
        });
        navigate("/admin-login");
        return;
      }
      
      if (user && user.role !== "admin") {
        // User is logged in but not an admin, redirect to admin login
        toast({
          title: "Admin Access Denied",
          description: "This area requires administrator privileges.",
          variant: "destructive",
        });
        navigate("/admin-login");
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, navigate, toast]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Don't render children if user is not authenticated or not an admin
  if (!isAuthenticated || !user || user.role !== "admin") {
    return null;
  }

  // User is authenticated and is an admin, render the protected content
  return <>{children}</>;
}