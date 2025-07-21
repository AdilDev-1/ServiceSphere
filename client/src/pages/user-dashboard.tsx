import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuthClient } from "@/hooks/useAuthClient";
import { getRequestStats, getRequests } from "@/lib/mockData";
import UserSidebar from "@/components/user-sidebar";
import MobileHeader from "@/components/mobile-header";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, DollarSign } from "lucide-react";
import StatusBadge from "@/components/status-badge";

export default function UserDashboard() {
  const { isMobileMenuOpen, isMobile, toggleMobileMenu, closeMobileMenu } = useMobileMenu();
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuthClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to access your dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const stats = user ? getRequestStats(user.id) : { pending: 0, approved: 0, in_progress: 0, completed: 0, rejected: 0 };
  const requests = user ? getRequests(user.id) : [];
  const recentRequests = requests.slice(0, 3);

  if (!isAuthenticated || isLoading) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      
      <MobileHeader 
        title="Dashboard"
        subtitle="Welcome to AutoService Pro"
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
        variant="user"
      />
      
      {/* Main Content */}
      <div className={`flex-1 overflow-auto ${isMobile ? 'pt-20' : 'ml-64'} transition-all duration-300`}>
        <div className="p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600">Here's an overview of your service requests and account status.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Requests Pending</p>
                    <p className="text-3xl font-bold text-warning">{stats?.pending || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-3xl font-bold text-success">{stats?.approved || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    <p className="text-3xl font-bold text-primary">{(stats?.pending || 0) + (stats?.approved || 0) + (stats?.in_progress || 0) + (stats?.completed || 0) + (stats?.rejected || 0)}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Submissions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentRequests.length > 0 ? (
                <div className="space-y-4">
                  {recentRequests.map((request: any) => (
                    <div key={request.id} className="border-l-4 border-warning pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{request.title}</h3>
                          <p className="text-sm text-gray-600">
                            Submitted on {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <StatusBadge status={request.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent submissions</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
