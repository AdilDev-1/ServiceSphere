import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, AlertTriangle, DollarSign, CheckCircle, FileCheck, Mail } from "lucide-react";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this area.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, user, isLoading, toast]);

  const { data: stats } = useQuery({
    queryKey: ["/api/request-stats"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: requests } = useQuery({
    queryKey: ["/api/requests"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  if (!isAuthenticated || isLoading || user?.role !== "admin") {
    return null;
  }

  const recentActivity = requests?.slice(0, 5).map((request: any) => ({
    id: request.id,
    action: `Request ${request.requestId} ${request.status}`,
    time: new Date(request.updatedAt).toLocaleDateString(),
    status: request.status,
  })) || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Overview of platform activity and pending actions.</p>
          </div>

          {/* Admin Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.total || 0}</p>
                    <p className="text-sm text-success">Platform activity</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-3xl font-bold text-warning">{stats?.pending || 0}</p>
                    <p className="text-sm text-gray-500">Requires action</p>
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
                    <p className="text-sm font-medium text-gray-600">Documents Pending</p>
                    <p className="text-3xl font-bold text-error">0</p>
                    <p className="text-sm text-gray-500">Verification needed</p>
                  </div>
                  <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-error" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved Today</p>
                    <p className="text-3xl font-bold text-success">{stats?.approved || 0}</p>
                    <p className="text-sm text-success">Successfully processed</p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  disabled={!stats?.pending}
                >
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success mr-3" />
                    <span>Approve Pending Requests</span>
                  </div>
                  {stats?.pending > 0 && (
                    <span className="bg-warning text-white text-xs px-2 py-1 rounded-full">
                      {stats.pending}
                    </span>
                  )}
                </Button>
                
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center">
                    <FileCheck className="w-5 h-5 text-primary mr-3" />
                    <span>Review Documents</span>
                  </div>
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                    0
                  </span>
                </Button>
                
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-secondary mr-3" />
                    <span>Send User Notifications</span>
                  </div>
                  <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">
                    0
                  </span>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
