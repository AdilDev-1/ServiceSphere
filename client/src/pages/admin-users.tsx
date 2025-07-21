import { useState } from "react";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Lock, 
  Unlock, 
  UserX, 
  Shield,
  Mail,
  Phone,
  Calendar,
  Activity,
  MoreHorizontal,
  User,
  Car
} from "lucide-react";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showActivityLog, setShowActivityLog] = useState(false);

  // Mock data - replace with real API calls later
  const users = [
    {
      id: 1,
      firstName: "John",
      lastName: "Smith",
      email: "john@email.com",
      phone: "555-0123",
      role: "user",
      isActive: true,
      profileImageUrl: null,
      lastLoginAt: "2024-01-18T10:30:00Z",
      createdAt: "2024-01-10T08:00:00Z",
      address: "123 Main St, City, ST 12345",
      vehicleInfo: [
        { make: "Toyota", model: "Camry", year: 2020, vin: "1234567890", licensePlate: "ABC123" }
      ],
      totalRequests: 5,
      pendingRequests: 1,
      totalPaid: 450,
      activityLog: [
        { action: "Submitted brake inspection request", timestamp: "2024-01-18T10:30:00Z" },
        { action: "Logged in", timestamp: "2024-01-18T09:15:00Z" },
        { action: "Paid invoice INV-2024-003", timestamp: "2024-01-17T14:20:00Z" }
      ]
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@email.com",
      phone: "555-0456",
      role: "user",
      isActive: true,
      profileImageUrl: null,
      lastLoginAt: "2024-01-17T15:45:00Z",
      createdAt: "2024-01-05T12:30:00Z",
      address: "456 Oak Ave, City, ST 12345",
      vehicleInfo: [
        { make: "Honda", model: "Civic", year: 2019, vin: "0987654321", licensePlate: "XYZ789" },
        { make: "Ford", model: "Escape", year: 2021, vin: "1122334455", licensePlate: "DEF456" }
      ],
      totalRequests: 8,
      pendingRequests: 0,
      totalPaid: 620,
      activityLog: [
        { action: "Completed oil change service", timestamp: "2024-01-17T15:45:00Z" },
        { action: "Submitted registration renewal", timestamp: "2024-01-16T11:00:00Z" }
      ]
    },
    {
      id: 3,
      firstName: "Mike",
      lastName: "Davis",
      email: "mike@autoservice.com",
      phone: "555-0789",
      role: "admin",
      isActive: true,
      profileImageUrl: null,
      lastLoginAt: "2024-01-18T11:00:00Z",
      createdAt: "2024-01-01T09:00:00Z",
      address: "789 Admin Blvd, City, ST 12345",
      vehicleInfo: [],
      totalRequests: 0,
      pendingRequests: 0,
      totalPaid: 0,
      activityLog: [
        { action: "Approved 3 service requests", timestamp: "2024-01-18T11:00:00Z" },
        { action: "Generated monthly reports", timestamp: "2024-01-18T10:15:00Z" }
      ]
    },
    {
      id: 4,
      firstName: "Lisa",
      lastName: "Chen",
      email: "lisa@email.com",
      phone: "555-0321",
      role: "user",
      isActive: false,
      profileImageUrl: null,
      lastLoginAt: "2024-01-10T08:30:00Z",
      createdAt: "2023-12-15T14:00:00Z",
      address: "321 Pine St, City, ST 12345",
      vehicleInfo: [
        { make: "BMW", model: "X3", year: 2022, vin: "9988776655", licensePlate: "LUX123" }
      ],
      totalRequests: 2,
      pendingRequests: 0,
      totalPaid: 150,
      activityLog: [
        { action: "Account locked due to suspicious activity", timestamp: "2024-01-12T16:00:00Z" },
        { action: "Last login attempt", timestamp: "2024-01-10T08:30:00Z" }
      ]
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const toggleUserStatus = (userId: number) => {
    // API call would go here
    console.log(`Toggling status for user ${userId}`);
  };

  const banUser = (userId: number) => {
    // API call would go here
    console.log(`Banning user ${userId}`);
  };

  const sendMessage = (userId: number, message: string) => {
    // API call would go here
    console.log(`Sending message to user ${userId}: ${message}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8 ml-64">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage user accounts, permissions, and activity</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <Shield className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="worker">Workers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Comprehensive list of all registered users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.profileImageUrl || ""} />
                          <AvatarFallback>
                            {getUserInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                        {user.role}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "destructive"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <p>Last login:</p>
                        <p className="text-gray-500">
                          {formatDate(user.lastLoginAt)}
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <p>Requests: {user.totalRequests}</p>
                        <p>Pending: {user.pendingRequests}</p>
                        <p>Paid: ${user.totalPaid}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>User Details - {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
                              <DialogDescription>
                                Complete user profile and activity information
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedUser && (
                              <div className="space-y-6">
                                {/* Personal Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Personal Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div className="flex items-center space-x-3">
                                        <Avatar className="h-16 w-16">
                                          <AvatarImage src={selectedUser.profileImageUrl || ""} />
                                          <AvatarFallback className="text-lg">
                                            {getUserInitials(selectedUser.firstName, selectedUser.lastName)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h3 className="text-lg font-semibold">
                                            {selectedUser.firstName} {selectedUser.lastName}
                                          </h3>
                                          <p className="text-gray-500">User ID: {selectedUser.id}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <p><strong>Email:</strong> {selectedUser.email}</p>
                                        <p><strong>Phone:</strong> {selectedUser.phone}</p>
                                        <p><strong>Address:</strong> {selectedUser.address}</p>
                                        <p><strong>Role:</strong> 
                                          <Badge className="ml-2" variant={selectedUser.role === "admin" ? "default" : "secondary"}>
                                            {selectedUser.role}
                                          </Badge>
                                        </p>
                                        <p><strong>Status:</strong> 
                                          <Badge className="ml-2" variant={selectedUser.isActive ? "default" : "destructive"}>
                                            {selectedUser.isActive ? "Active" : "Inactive"}
                                          </Badge>
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Account Statistics</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                          <p className="text-2xl font-bold text-blue-600">{selectedUser.totalRequests}</p>
                                          <p className="text-sm text-gray-600">Total Requests</p>
                                        </div>
                                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                                          <p className="text-2xl font-bold text-orange-600">{selectedUser.pendingRequests}</p>
                                          <p className="text-sm text-gray-600">Pending</p>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                          <p className="text-2xl font-bold text-green-600">${selectedUser.totalPaid}</p>
                                          <p className="text-sm text-gray-600">Total Paid</p>
                                        </div>
                                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                                          <p className="text-2xl font-bold text-purple-600">{selectedUser.vehicleInfo.length}</p>
                                          <p className="text-sm text-gray-600">Vehicles</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 pt-3">
                                        <p><strong>Member Since:</strong> {formatDate(selectedUser.createdAt)}</p>
                                        <p><strong>Last Login:</strong> {formatDate(selectedUser.lastLoginAt)}</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Vehicle Information */}
                                {selectedUser.vehicleInfo.length > 0 && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg flex items-center gap-2">
                                        <Car className="h-5 w-5" />
                                        Vehicle Information
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-3">
                                        {selectedUser.vehicleInfo.map((vehicle: any, index: number) => (
                                          <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                              <div>
                                                <p className="font-medium">Make</p>
                                                <p>{vehicle.make}</p>
                                              </div>
                                              <div>
                                                <p className="font-medium">Model</p>
                                                <p>{vehicle.model}</p>
                                              </div>
                                              <div>
                                                <p className="font-medium">Year</p>
                                                <p>{vehicle.year}</p>
                                              </div>
                                              <div>
                                                <p className="font-medium">VIN</p>
                                                <p className="font-mono text-xs">{vehicle.vin}</p>
                                              </div>
                                              <div>
                                                <p className="font-medium">License Plate</p>
                                                <p>{vehicle.licensePlate}</p>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Activity Log */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <Activity className="h-5 w-5" />
                                      Recent Activity
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      {selectedUser.activityLog.map((activity: any, index: number) => (
                                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                          <div className="flex-1">
                                            <p className="text-sm font-medium">{activity.action}</p>
                                            <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Admin Actions */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Admin Actions</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex flex-wrap gap-3">
                                      <Button 
                                        variant="outline" 
                                        onClick={() => toggleUserStatus(selectedUser.id)}
                                        className="flex items-center gap-2"
                                      >
                                        {selectedUser.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                        {selectedUser.isActive ? "Lock Account" : "Unlock Account"}
                                      </Button>
                                      
                                      <Button 
                                        variant="destructive" 
                                        onClick={() => banUser(selectedUser.id)}
                                        className="flex items-center gap-2"
                                      >
                                        <UserX className="h-4 w-4" />
                                        Ban User
                                      </Button>
                                      
                                      <Button 
                                        variant="outline"
                                        onClick={() => sendMessage(selectedUser.id, "Admin message")}
                                        className="flex items-center gap-2"
                                      >
                                        <Mail className="h-4 w-4" />
                                        Send Message
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all" || roleFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No users have registered yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}