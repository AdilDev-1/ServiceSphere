import { useState } from "react";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Plus,
  DollarSign,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  FileText,
  Calendar,
  User,
  ExternalLink
} from "lucide-react";

export default function AdminPayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [newInvoice, setNewInvoice] = useState({
    userId: "",
    requestId: "",
    amount: "",
    description: "",
    dueDate: "",
    items: [{ description: "", amount: "" }]
  });

  // Mock data - replace with real API calls later
  const paymentsAndInvoices = [
    {
      id: 1,
      type: "payment",
      invoiceNumber: "INV-2024-001",
      paymentId: "PAY-2024-001",
      user: { name: "John Smith", email: "john@email.com" },
      requestId: "REQ-2024-001",
      service: "Brake Inspection",
      amount: 150.00,
      status: "paid",
      paymentMethod: "PayPal",
      transactionId: "TXN-123456789",
      createdDate: "2024-01-15",
      paidDate: "2024-01-16",
      dueDate: "2024-01-25",
      description: "Brake system inspection and minor repairs"
    },
    {
      id: 2,
      type: "invoice",
      invoiceNumber: "INV-2024-002",
      paymentId: null,
      user: { name: "Sarah Johnson", email: "sarah@email.com" },
      requestId: "REQ-2024-002", 
      service: "Oil Change",
      amount: 75.00,
      status: "pending",
      paymentMethod: null,
      transactionId: null,
      createdDate: "2024-01-16",
      paidDate: null,
      dueDate: "2024-01-26",
      description: "Standard oil change service with filter replacement"
    },
    {
      id: 3,
      type: "payment",
      invoiceNumber: "INV-2024-003",
      paymentId: "PAY-2024-003",
      user: { name: "Robert Wilson", email: "robert@email.com" },
      requestId: "REQ-2024-003",
      service: "Transmission Repair",
      amount: 2500.00,
      status: "paid",
      paymentMethod: "Credit Card",
      transactionId: "TXN-987654321",
      createdDate: "2024-01-12",
      paidDate: "2024-01-18",
      dueDate: "2024-01-22",
      description: "Complete transmission rebuild and replacement of worn components"
    },
    {
      id: 4,
      type: "invoice",
      invoiceNumber: "INV-2024-004",
      paymentId: null,
      user: { name: "Emily Davis", email: "emily@email.com" },
      requestId: "REQ-2024-004",
      service: "Engine Diagnostic",
      amount: 125.00,
      status: "overdue",
      paymentMethod: null,
      transactionId: null,
      createdDate: "2024-01-08",
      paidDate: null,
      dueDate: "2024-01-18",
      description: "Comprehensive engine diagnostic and performance analysis"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-orange-100 text-orange-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "overdue": return <AlertTriangle className="h-4 w-4" />;
      case "cancelled": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredData = paymentsAndInvoices.filter(item => {
    const matchesSearch = 
      item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalRevenue = paymentsAndInvoices
    .filter(item => item.status === "paid")
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingAmount = paymentsAndInvoices
    .filter(item => item.status === "pending")
    .reduce((sum, item) => sum + item.amount, 0);

  const overdueAmount = paymentsAndInvoices
    .filter(item => item.status === "overdue")
    .reduce((sum, item) => sum + item.amount, 0);

  const createInvoice = () => {
    // API call would go here
    console.log("Creating invoice:", newInvoice);
    setShowCreateInvoice(false);
    setNewInvoice({
      userId: "",
      requestId: "",
      amount: "",
      description: "",
      dueDate: "",
      items: [{ description: "", amount: "" }]
    });
  };

  const sendInvoice = (invoiceId: number) => {
    // API call would go here
    console.log(`Sending invoice ${invoiceId}`);
  };

  const markAsPaid = (invoiceId: number) => {
    // API call would go here
    console.log(`Marking invoice ${invoiceId} as paid`);
  };

  const downloadInvoice = (invoiceId: number) => {
    // API call would go here
    console.log(`Downloading invoice ${invoiceId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const addInvoiceItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: "", amount: "" }]
    }));
  };

  const updateInvoiceItem = (index: number, field: string, value: string) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeInvoiceItem = (index: number) => {
    if (newInvoice.items.length > 1) {
      setNewInvoice(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments & Invoices</h1>
          <p className="text-gray-600">Manage invoicing, track payments, and monitor revenue</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From completed payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">${pendingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${overdueAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Past due date
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{paymentsAndInvoices.length}</div>
              <p className="text-xs text-muted-foreground">
                Total transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Payment Management</CardTitle>
              <Dialog open={showCreateInvoice} onOpenChange={setShowCreateInvoice}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                    <DialogDescription>
                      Generate an invoice for a service request
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="userId">Customer</Label>
                        <Select value={newInvoice.userId} onValueChange={(value) => setNewInvoice(prev => ({ ...prev, userId: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">John Smith</SelectItem>
                            <SelectItem value="2">Sarah Johnson</SelectItem>
                            <SelectItem value="3">Robert Wilson</SelectItem>
                            <SelectItem value="4">Emily Davis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="requestId">Service Request</Label>
                        <Select value={newInvoice.requestId} onValueChange={(value) => setNewInvoice(prev => ({ ...prev, requestId: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select request" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="REQ-2024-001">REQ-2024-001 - Brake Inspection</SelectItem>
                            <SelectItem value="REQ-2024-002">REQ-2024-002 - Oil Change</SelectItem>
                            <SelectItem value="REQ-2024-003">REQ-2024-003 - Transmission Repair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Service Description</Label>
                      <Textarea
                        placeholder="Describe the services provided..."
                        value={newInvoice.description}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        type="date"
                        value={newInvoice.dueDate}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <Label>Invoice Items</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {newInvoice.items.map((item, index) => (
                          <div key={index} className="flex gap-3 items-end">
                            <div className="flex-1">
                              <Input
                                placeholder="Item description"
                                value={item.description}
                                onChange={(e) => updateInvoiceItem(index, "description", e.target.value)}
                              />
                            </div>
                            <div className="w-32">
                              <Input
                                type="number"
                                placeholder="Amount"
                                value={item.amount}
                                onChange={(e) => updateInvoiceItem(index, "amount", e.target.value)}
                              />
                            </div>
                            {newInvoice.items.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeInvoiceItem(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        Total: ${newInvoice.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateInvoice(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createInvoice}>
                      Create Invoice
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by customer, invoice number, or service..."
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
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <FileText className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="invoice">Invoices</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments & Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions ({filteredData.length})</CardTitle>
            <CardDescription>
              Track all invoices and payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice/Payment</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.invoiceNumber}</p>
                        {item.paymentId && (
                          <p className="text-sm text-gray-500">{item.paymentId}</p>
                        )}
                        <Badge variant="outline" className="mt-1">
                          {item.type}
                        </Badge>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.user.name}</p>
                        <p className="text-sm text-gray-500">{item.user.email}</p>
                        <p className="text-sm text-gray-500">{item.requestId}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <p className="font-medium">{item.service}</p>
                      <p className="text-sm text-gray-500 max-w-xs truncate">
                        {item.description}
                      </p>
                    </TableCell>
                    
                    <TableCell>
                      <p className="text-lg font-bold">${item.amount.toLocaleString()}</p>
                      {item.paymentMethod && (
                        <p className="text-sm text-gray-500">{item.paymentMethod}</p>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status}</span>
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <p>Created: {formatDate(item.createdDate)}</p>
                        <p>Due: {formatDate(item.dueDate)}</p>
                        {item.paidDate && (
                          <p className="text-green-600">Paid: {formatDate(item.paidDate)}</p>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedPayment(item)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{selectedPayment?.type === "payment" ? "Payment" : "Invoice"} Details</DialogTitle>
                              <DialogDescription>
                                {selectedPayment?.invoiceNumber} - {selectedPayment?.user.name}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedPayment && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Customer Information</h4>
                                    <p><strong>Name:</strong> {selectedPayment.user.name}</p>
                                    <p><strong>Email:</strong> {selectedPayment.user.email}</p>
                                    <p><strong>Request:</strong> {selectedPayment.requestId}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Payment Information</h4>
                                    <p><strong>Amount:</strong> ${selectedPayment.amount.toLocaleString()}</p>
                                    <p><strong>Status:</strong> 
                                      <Badge className={`ml-2 ${getStatusColor(selectedPayment.status)}`}>
                                        {selectedPayment.status}
                                      </Badge>
                                    </p>
                                    {selectedPayment.paymentMethod && (
                                      <p><strong>Method:</strong> {selectedPayment.paymentMethod}</p>
                                    )}
                                    {selectedPayment.transactionId && (
                                      <p><strong>Transaction:</strong> {selectedPayment.transactionId}</p>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-2">Service Details</h4>
                                  <p><strong>Service:</strong> {selectedPayment.service}</p>
                                  <p><strong>Description:</strong> {selectedPayment.description}</p>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p><strong>Created:</strong></p>
                                    <p>{formatDate(selectedPayment.createdDate)}</p>
                                  </div>
                                  <div>
                                    <p><strong>Due Date:</strong></p>
                                    <p>{formatDate(selectedPayment.dueDate)}</p>
                                  </div>
                                  {selectedPayment.paidDate && (
                                    <div>
                                      <p><strong>Paid Date:</strong></p>
                                      <p className="text-green-600">{formatDate(selectedPayment.paidDate)}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadInvoice(item.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>

                        {item.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendInvoice(item.id)}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsPaid(item.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Paid
                            </Button>
                          </>
                        )}

                        {item.status === "paid" && item.transactionId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/admin/transaction/${item.transactionId}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Transaction
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredData.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No payments or invoices have been created yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}