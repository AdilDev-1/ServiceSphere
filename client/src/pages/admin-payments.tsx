import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Search, TrendingUp, DollarSign, CreditCard, Calendar } from "lucide-react";

export default function AdminPayments() {
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

  const { data: payments, isLoading: paymentsLoading, error } = useQuery({
    queryKey: ["/api/payments"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: requests } = useQuery({
    queryKey: ["/api/requests"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  if (!isAuthenticated || isLoading || user?.role !== "admin") {
    return null;
  }

  if (error && isUnauthorizedError(error)) {
    return null;
  }

  // Mock payment data for demonstration
  const mockPayments = [
    {
      id: 1,
      paymentId: "PAY-2024-001",
      requestId: "REQ-2024-001",
      userId: "1",
      amount: "255.00",
      paymentMethod: "credit_card",
      paymentStatus: "completed",
      transactionId: "txn_abc123",
      processedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      paymentId: "PAY-2024-002",
      requestId: "REQ-2024-002",
      userId: "2",
      amount: "150.00",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      transactionId: null,
      processedAt: null,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const allPayments = payments && payments.length > 0 ? payments : mockPayments;

  const totalRevenue = allPayments.reduce((sum, payment) => 
    sum + (payment.paymentStatus === "completed" ? parseFloat(payment.amount) : 0), 0
  );

  const completedPayments = allPayments.filter(p => p.paymentStatus === "completed").length;
  const pendingPayments = allPayments.filter(p => p.paymentStatus === "pending").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-success">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "refunded":
        return <Badge variant="secondary">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="w-4 h-4" />;
      case "paypal":
        return <span className="text-xs font-bold">PP</span>;
      case "bank_transfer":
        return <span className="text-xs font-bold">BT</span>;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ["Payment ID", "Request ID", "Amount", "Payment Method", "Status", "Date"].join(","),
      ...allPayments.map(payment => [
        payment.paymentId,
        payment.requestId,
        payment.amount,
        payment.paymentMethod,
        payment.paymentStatus,
        new Date(payment.createdAt).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Payment report exported successfully",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-3xl font-bold text-success">${totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed Payments</p>
                      <p className="text-3xl font-bold text-primary">{completedPayments}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                      <p className="text-3xl font-bold text-warning">{pendingPayments}</p>
                    </div>
                    <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-warning" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">This Month</p>
                      <p className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                      <p className="text-sm text-success">+12% from last month</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payments Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Payment History</CardTitle>
                    <p className="text-gray-600 mt-1">View and manage all payment transactions</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input placeholder="Search payments..." className="pl-10 w-64" />
                    </div>
                    <Button onClick={handleExportCSV}>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {paymentsLoading ? (
                  <p>Loading...</p>
                ) : allPayments && allPayments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Request ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium text-primary">
                            {payment.paymentId}
                          </TableCell>
                          <TableCell>{payment.requestId}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                <span className="text-xs font-medium">
                                  U{payment.userId}
                                </span>
                              </div>
                              <span>User {payment.userId}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${parseFloat(payment.amount).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getPaymentMethodIcon(payment.paymentMethod)}
                              <span className="capitalize">
                                {payment.paymentMethod.replace('_', ' ')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(payment.paymentStatus)}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {payment.transactionId || "—"}
                          </TableCell>
                          <TableCell>
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-8 text-gray-500">No payments found</p>
                )}

                {/* Pagination */}
                {allPayments && allPayments.length > 0 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t bg-gray-50 px-4 py-3">
                    <div className="text-sm text-gray-500">
                      Showing 1 to {allPayments.length} of {allPayments.length} results
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
