import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import UserDashboard from "@/pages/user-dashboard";
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

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          {user?.role === "admin" ? (
            <>
              <Route path="/" component={AdminDashboard} />
              <Route path="/admin/dashboard" component={AdminDashboard} />
              <Route path="/admin/submissions" component={AdminSubmissions} />
              <Route path="/admin/documents" component={AdminDocuments} />
              <Route path="/admin/services" component={AdminServices} />
              <Route path="/admin/users" component={AdminUsers} />
              <Route path="/admin/payments" component={AdminPayments} />
              <Route path="/admin/messages" component={AdminMessages} />
            </>
          ) : (
            <>
              <Route path="/" component={UserDashboard} />
              <Route path="/dashboard" component={UserDashboard} />
              <Route path="/submit-request" component={SubmitRequest} />
              <Route path="/my-submissions" component={MySubmissions} />
              <Route path="/payments" component={Payments} />
              <Route path="/profile" component={Profile} />
              <Route path="/support" component={Support} />
            </>
          )}
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
