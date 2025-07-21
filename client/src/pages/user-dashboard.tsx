import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import UserSidebar from "@/components/user-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, DollarSign } from "lucide-react";
import StatusBadge from "@/components/status-badge";

export default function UserDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/request-stats"],
    enabled: isAuthenticated,
  });

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ["/api/requests"],
    enabled: isAuthenticated,
  });

  const recentRequests = requests?.slice(0, 3) || [];

  if (!isAuthenticated || isLoading) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600">Here's an overview of your service requests and account status.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Requests Pending</p>
                    <p className="text-3xl font-bold text-warning">{statsLoading ? "..." : stats?.pending || 0}</p>
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
                    <p className="text-3xl font-bold text-success">{statsLoading ? "..." : stats?.approved || 0}</p>
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
                    <p className="text-3xl font-bold text-primary">{statsLoading ? "..." : stats?.total || 0}</p>
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
              {requestsLoading ? (
                <p>Loading...</p>
              ) : recentRequests.length > 0 ? (
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
