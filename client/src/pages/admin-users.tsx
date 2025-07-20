import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Ban, UserCheck, Search } from "lucide-react";

export default function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  // Mock users data - in a real app this would come from an API
  const mockUsers = [
    {
      id: "1",
      email: "user1@example.com",
      firstName: "John",
      lastName: "Doe",
      profileImageUrl: null,
      role: "user",
      createdAt: new Date().toISOString(),
      requestCount: 3,
      totalSpent: 650.00,
      lastActivity: new Date().toISOString(),
      isActive: true,
    },
    {
      id: "2",
      email: "user2@example.com",
      firstName: "Jane",
      lastName: "Smith",
      profileImageUrl: null,
      role: "user",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      requestCount: 1,
      totalSpent: 255.00,
      lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    },
  ];

  const { data: requests } = useQuery({
    queryKey: ["/api/requests"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => {
      // In a real app, this would call an API endpoint to update user
      return Promise.resolve({ userId, ...data });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated || isLoading || user?.role !== "admin") {
    return null;
  }

  const getUserStats = (userId: string) => {
    const userRequests = requests?.filter((req: any) => req.userId === userId) || [];
    return {
      requestCount: userRequests.length,
      totalSpent: userRequests.reduce((sum: number, req: any) => 
        sum + (parseFloat(req.totalAmount) || 0), 0
      ),
    };
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <p className="text-gray-600 mt-1">View and manage user accounts</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Users" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input placeholder="Search users..." className="pl-10 w-64" />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Requests</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((userData) => {
                      const stats = getUserStats(userData.id);
                      return (
                        <TableRow key={userData.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={userData.profileImageUrl} />
                                <AvatarFallback>
                                  {(userData.firstName?.[0] || "") + (userData.lastName?.[0] || "")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {userData.firstName} {userData.lastName}
                                </div>
                                <div className="text-sm text-gray-500">ID: {userData.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{userData.email}</TableCell>
                          <TableCell>
                            <Badge variant={userData.role === "admin" ? "default" : "secondary"}>
                              {userData.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{stats.requestCount}</TableCell>
                          <TableCell>${stats.totalSpent.toFixed(2)}</TableCell>
                          <TableCell>
                            {new Date(userData.lastActivity).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={userData.isActive ? "default" : "secondary"}>
                              {userData.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>User Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div className="flex items-center space-x-4">
                                    <Avatar className="w-16 h-16">
                                      <AvatarImage src={userData.profileImageUrl} />
                                      <AvatarFallback className="text-lg">
                                        {(userData.firstName?.[0] || "") + (userData.lastName?.[0] || "")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="text-xl font-semibold">
                                        {userData.firstName} {userData.lastName}
                                      </h3>
                                      <p className="text-gray-600">{userData.email}</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700">User ID</label>
                                      <p className="mt-1 text-sm text-gray-900">{userData.id}</p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700">Role</label>
                                      <p className="mt-1 text-sm text-gray-900 capitalize">{userData.role}</p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700">Member Since</label>
                                      <p className="mt-1 text-sm text-gray-900">
                                        {new Date(userData.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700">Last Activity</label>
                                      <p className="mt-1 text-sm text-gray-900">
                                        {new Date(userData.lastActivity).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Activity Summary</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                      <div>
                                        <p className="text-sm text-gray-500">Total Requests</p>
                                        <p className="text-lg font-semibold">{stats.requestCount}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Total Spent</p>
                                        <p className="text-lg font-semibold">${stats.totalSpent.toFixed(2)}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <Badge variant={userData.isActive ? "default" : "secondary"}>
                                          {userData.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {userData.isActive ? (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => updateUserMutation.mutate({
                                  userId: userData.id,
                                  data: { isActive: false }
                                })}
                              >
                                <Ban className="w-4 h-4 text-error" />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => updateUserMutation.mutate({
                                  userId: userData.id,
                                  data: { isActive: true }
                                })}
                              >
                                <UserCheck className="w-4 h-4 text-success" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Summary Stats */}
                <div className="mt-8 grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold">{mockUsers.length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-success">
                        {mockUsers.filter(u => u.isActive).length}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">New This Month</p>
                      <p className="text-2xl font-bold text-primary">1</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-warning">
                        ${mockUsers.reduce((sum, u) => sum + getUserStats(u.id).totalSpent, 0).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
