import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import AdminSidebar from "@/components/admin-sidebar";
import StatusBadge from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eye, Check, X } from "lucide-react";

export default function AdminSubmissions() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  
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

  const { data: requests, isLoading: requestsLoading, error } = useQuery({
    queryKey: ["/api/requests"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest("PATCH", `/api/requests/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Request updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      setSelectedRequest(null);
      setAdminNotes("");
      setRejectionReason("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update request",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated || isLoading || user?.role !== "admin") {
    return null;
  }

  if (error && isUnauthorizedError(error)) {
    return null;
  }

  const handleApprove = (request: any) => {
    updateRequestMutation.mutate({
      id: request.id,
      data: {
        status: "approved",
        adminNotes,
      },
    });
  };

  const handleReject = (request: any) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason",
        variant: "destructive",
      });
      return;
    }
    
    updateRequestMutation.mutate({
      id: request.id,
      data: {
        status: "rejected",
        rejectionReason,
        adminNotes,
      },
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              {/* Header */}
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>All Submissions</CardTitle>
                    <p className="text-gray-600 mt-1">Manage and review all service requests</p>
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
                        <TableHead>User</TableHead>
                        <TableHead>Service Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request: any) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium text-primary">
                            {request.requestId}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                <span className="text-xs font-medium">
                                  {request.userId.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">User {request.userId}</div>
                                <div className="text-sm text-gray-500">ID: {request.userId}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{request.title}</TableCell>
                          <TableCell>
                            <StatusBadge status={request.status} />
                          </TableCell>
                          <TableCell>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="capitalize">{request.priority}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedRequest(request)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Request Details - {request.requestId}</DialogTitle>
                                </DialogHeader>
                                {selectedRequest && (
                                  <div className="space-y-6">
                                    {/* Request Information */}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="font-medium">Title</Label>
                                        <p className="text-sm text-gray-600">{selectedRequest.title}</p>
                                      </div>
                                      <div>
                                        <Label className="font-medium">Status</Label>
                                        <div className="mt-1">
                                          <StatusBadge status={selectedRequest.status} />
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="font-medium">Priority</Label>
                                        <p className="text-sm text-gray-600 capitalize">{selectedRequest.priority}</p>
                                      </div>
                                      <div>
                                        <Label className="font-medium">Submitted</Label>
                                        <p className="text-sm text-gray-600">
                                          {new Date(selectedRequest.createdAt).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <Label className="font-medium">Description</Label>
                                      <p className="text-sm text-gray-600 mt-1">{selectedRequest.description}</p>
                                    </div>

                                    {/* Admin Notes */}
                                    <div>
                                      <Label htmlFor="adminNotes">Admin Notes</Label>
                                      <Textarea
                                        id="adminNotes"
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add notes about this request..."
                                        className="mt-1"
                                      />
                                    </div>

                                    {/* Rejection Reason (only show if rejecting) */}
                                    <div>
                                      <Label htmlFor="rejectionReason">Rejection Reason (if rejecting)</Label>
                                      <Textarea
                                        id="rejectionReason"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Explain why this request is being rejected..."
                                        className="mt-1"
                                      />
                                    </div>

                                    {/* Actions */}
                                    {selectedRequest.status === "pending" && (
                                      <div className="flex space-x-3">
                                        <Button 
                                          onClick={() => handleApprove(selectedRequest)}
                                          disabled={updateRequestMutation.isPending}
                                          className="bg-success hover:bg-green-700"
                                        >
                                          <Check className="w-4 h-4 mr-2" />
                                          Approve
                                        </Button>
                                        <Button 
                                          onClick={() => handleReject(selectedRequest)}
                                          disabled={updateRequestMutation.isPending}
                                          variant="destructive"
                                        >
                                          <X className="w-4 h-4 mr-2" />
                                          Reject
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            {request.status === "pending" && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    updateRequestMutation.mutate({
                                      id: request.id,
                                      data: { status: "approved" },
                                    });
                                  }}
                                  disabled={updateRequestMutation.isPending}
                                >
                                  <Check className="w-4 h-4 text-success" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    updateRequestMutation.mutate({
                                      id: request.id,
                                      data: { 
                                        status: "rejected",
                                        rejectionReason: "Administrative review required" 
                                      },
                                    });
                                  }}
                                  disabled={updateRequestMutation.isPending}
                                >
                                  <X className="w-4 h-4 text-error" />
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-8 text-gray-500">No submissions found</p>
                )}

                {/* Pagination */}
                {requests && requests.length > 0 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t bg-gray-50 px-4 py-3">
                    <div className="text-sm text-gray-500">
                      Showing 1 to {requests.length} of {requests.length} results
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" disabled>Previous</Button>
                      <Button variant="default" size="sm">1</Button>
                      <Button variant="outline" size="sm" disabled>Next</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
