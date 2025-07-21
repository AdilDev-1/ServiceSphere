import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Upload,
  Eye,
  ArrowUpRight
} from "lucide-react";

export default function AdminDashboard() {
  // Mock data - replace with real API calls later
  const stats = {
    totalUsers: 156,
    totalSubmissions: 89,
    pendingInvoices: 12,
    paymentsReceived: 45600,
    pendingRequests: 8,
    approvedRequests: 34,
    inProgressRequests: 15,
    completedRequests: 32
  };

  const recentActivity = [
    { id: 1, type: 'submission', user: 'John Smith', action: 'submitted brake inspection request', time: '2 minutes ago' },
    { id: 2, type: 'payment', user: 'Sarah Johnson', action: 'paid invoice #INV-2024-089', time: '15 minutes ago' },
    { id: 3, type: 'approval', user: 'Mike Davis', action: 'request approved by admin', time: '1 hour ago' },
    { id: 4, type: 'registration', user: 'Emily Wilson', action: 'registered new account', time: '2 hours ago' },
  ];

  const quickActions = [
    { title: 'Create Invoice', icon: DollarSign, href: '/admin/payments?action=create', color: 'bg-green-500' },
    { title: 'Upload Document', icon: Upload, href: '/admin/documents?action=upload', color: 'bg-blue-500' },
    { title: 'View Submissions', icon: Eye, href: '/admin/submissions', color: 'bg-purple-500' },
    { title: 'Add Service', icon: Plus, href: '/admin/services?action=create', color: 'bg-orange-500' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8 ml-64">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your automotive service platform.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8</span> this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingInvoices}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payments Received</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.paymentsReceived.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+23%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Request Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Request Status Overview</CardTitle>
              <CardDescription>Current status of all service requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Pending Approval</span>
                  </div>
                  <span className="font-bold text-orange-600">{stats.pendingRequests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Approved</span>
                  </div>
                  <span className="font-bold text-green-600">{stats.approvedRequests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">In Progress</span>
                  </div>
                  <span className="font-bold text-blue-600">{stats.inProgressRequests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="font-bold text-gray-600">{stats.completedRequests}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50"
                    onClick={() => window.location.href = action.href}
                  >
                    <div className={`p-2 rounded-full ${action.color} text-white`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium">{action.title}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions across the platform</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'submission' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'payment' ? 'bg-green-100 text-green-600' :
                    activity.type === 'approval' ? 'bg-purple-100 text-purple-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {activity.type === 'submission' && <FileText className="h-4 w-4" />}
                    {activity.type === 'payment' && <DollarSign className="h-4 w-4" />}
                    {activity.type === 'approval' && <CheckCircle2 className="h-4 w-4" />}
                    {activity.type === 'registration' && <Users className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-gray-600">{activity.action}</p>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}