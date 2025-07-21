import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import AutomotiveLanding from "@/pages/automotive-landing";
import AuthPage from "@/pages/auth";
import UserDashboard from "@/pages/user-dashboard";
import NotFound from "@/pages/not-found";
import SubmitRequest from "@/pages/submit-request";
import MySubmissions from "@/pages/my-submissions";
import Payments from "@/pages/payments";
import Profile from "@/pages/profile";
import Support from "@/pages/support";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminSubmissions from "@/pages/admin-submissions";
import AdminDocuments from "@/pages/admin-documents";
import AdminServices from "@/pages/admin-services";
import AdminUsers from "@/pages/admin-users";
import AdminPayments from "@/pages/admin-payments";
import AdminMessages from "@/pages/admin-messages";
import AdminSettings from "@/pages/admin-settings";
import AdminLoginPage from "@/pages/admin-login";
import { AdminProtectedRoute } from "@/components/AdminProtectedRoute";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/admin-login" component={AdminLoginPage} />
      
      {/* Landing page - always accessible */}
      <Route path="/" component={AutomotiveLanding} />
      
      {/* Admin routes - Protected */}
      <Route path="/admin">
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/dashboard">
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/submissions">
        <AdminProtectedRoute>
          <AdminSubmissions />
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/documents">
        <AdminProtectedRoute>
          <AdminDocuments />
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/services">
        <AdminProtectedRoute>
          <AdminServices />
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/users">
        <AdminProtectedRoute>
          <AdminUsers />
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/payments">
        <AdminProtectedRoute>
          <AdminPayments />
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/messages">
        <AdminProtectedRoute>
          <AdminMessages />
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/settings">
        <AdminProtectedRoute>
          <AdminSettings />
        </AdminProtectedRoute>
      </Route>
      
      {/* User routes - Only for non-admin users */}
      <Route path="/dashboard">
        {isAuthenticated && user?.role !== "admin" ? (
          <UserDashboard />
        ) : (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-4">This page is for regular users only.</p>
              {user?.role === "admin" ? (
                <p className="text-blue-600">
                  <a href="/admin" className="underline">Go to Admin Panel</a>
                </p>
              ) : (
                <p className="text-blue-600">
                  <a href="/auth" className="underline">Please log in</a>
                </p>
              )}
            </div>
          </div>
        )}
      </Route>
      
      {isAuthenticated && user?.role !== "admin" && (
        <>
          <Route path="/submit-request" component={SubmitRequest} />
          <Route path="/my-submissions" component={MySubmissions} />
          <Route path="/payments" component={Payments} />
          <Route path="/profile" component={Profile} />
          <Route path="/support" component={Support} />
        </>
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;