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
      
      {/* Landing page - always accessible */}
      <Route path="/" component={AutomotiveLanding} />
      
      {/* Admin routes */}
      {isAuthenticated && user?.role === "admin" && (
        <>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/submissions" component={AdminSubmissions} />
          <Route path="/admin/documents" component={AdminDocuments} />
          <Route path="/admin/services" component={AdminServices} />
          <Route path="/admin/users" component={AdminUsers} />
          <Route path="/admin/payments" component={AdminPayments} />
          <Route path="/admin/messages" component={AdminMessages} />
          <Route path="/admin/settings" component={AdminSettings} />
        </>
      )}
      
      {/* User routes */}
      {isAuthenticated && user?.role !== "admin" && (
        <>
          <Route path="/dashboard" component={UserDashboard} />
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