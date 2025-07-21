import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import UserSidebar from "@/components/user-sidebar";
import StatusBadge from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MySubmissions() {
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

  const { data: requests, isLoading: requestsLoading, error } = useQuery({
    queryKey: ["/api/requests"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || isLoading) {
    return null;
  }

  if (error && isUnauthorizedError(error)) {
    return null; // useEffect will handle redirect
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar />
      
      <div className="flex-1 overflow-auto ml-64">
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              {/* Header */}
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>My Submissions</CardTitle>
                    <p className="text-gray-600 mt-1">Track and manage your service requests</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Search requests..." className="w-64" />
                  </div>
                </div>
              </CardHeader>

              {/* Table */}
              <CardContent>
                {requestsLoading ? (
                  <p>Loading...</p>
                ) : requests && requests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request: any) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium text-primary">
                            {request.requestId}
                          </TableCell>
                          <TableCell>{request.title}</TableCell>
                          <TableCell>
                            <StatusBadge status={request.status} />
                          </TableCell>
                          <TableCell>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="capitalize">
                            {request.priority}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    No submissions found. 
                    <a href="/submit-request" className="text-primary hover:underline ml-1">
                      Submit your first request
                    </a>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
