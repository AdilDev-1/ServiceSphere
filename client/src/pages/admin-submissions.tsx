import { useState } from "react";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Car,
  Calendar,
  User,
  DollarSign,
  Edit
} from "lucide-react";

export default function AdminSubmissions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showResponse, setShowResponse] = useState(false);
  const [responseText, setResponseText] = useState("");

  // Mock data - replace with real API calls later
  const submissions = [
    {
      id: 1,
      requestId: "REQ-2024-001",
      user: { name: "John Smith", email: "john@email.com", phone: "555-0123" },
      service: "Brake Inspection",
      category: "Safety Inspection",
      vehicle: { make: "Toyota", model: "Camry", year: 2020, vin: "1234567890" },
      priority: "Standard",
      status: "pending",
      submittedDate: "2024-01-15",
      lastUpdated: "2024-01-15",
      description: "Vehicle making squeaking noise when braking. Need comprehensive brake system inspection.",
      documents: ["brake_photos.pdf", "maintenance_history.pdf"],
      preferredDate: "2024-01-20",
      estimatedCost: 150,
      assignedTechnician: null
    },
    {
      id: 2,
      requestId: "REQ-2024-002", 
      user: { name: "Sarah Johnson", email: "sarah@email.com", phone: "555-0456" },
      service: "Oil Change",
      category: "Maintenance",
      vehicle: { make: "Honda", model: "Civic", year: 2019, vin: "0987654321" },
      priority: "Urgent",
      status: "approved",
      submittedDate: "2024-01-14",
      lastUpdated: "2024-01-16",
      description: "Regular maintenance oil change. Vehicle has 45,000 miles.",
      documents: ["service_history.pdf"],
      preferredDate: "2024-01-18",
      estimatedCost: 75,
      assignedTechnician: "Mike Davis"
    },
    {
      id: 3,
      requestId: "REQ-2024-003",
      user: { name: "Robert Wilson", email: "robert@email.com", phone: "555-0789" },
      service: "Transmission Repair",
      category: "Repair",
      vehicle: { make: "Ford", model: "F-150", year: 2018, vin: "1122334455" },
      priority: "Urgent",
      status: "in_progress",
      submittedDate: "2024-01-12",
      lastUpdated: "2024-01-17",
      description: "Transmission slipping and making grinding noises. Needs immediate attention.",
      documents: ["diagnostic_report.pdf", "transmission_photos.jpg"],
      preferredDate: "2024-01-15",
      estimatedCost: 2500,
      assignedTechnician: "Lisa Chen"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-800";
      case "approved": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "in_progress": return <AlertTriangle className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateSubmissionStatus = (submissionId: number, newStatus: string) => {
    // API call would go here
    console.log(`Updating submission ${submissionId} to status: ${newStatus}`);
  };

  const sendResponse = (submissionId: number, message: string) => {
    // API call would go here
    console.log(`Sending response to submission ${submissionId}: ${message}`);
    setShowResponse(false);
    setResponseText("");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8 ml-64">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Submissions</h1>
          <p className="text-gray-600">Manage and review all customer service requests</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by customer name, request ID, or service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-semibold">{submission.requestId}</h3>
                      <Badge className={getStatusColor(submission.status)}>
                        {getStatusIcon(submission.status)}
                        <span className="ml-1 capitalize">{submission.status.replace('_', ' ')}</span>
                      </Badge>
                      {submission.priority === "Urgent" && (
                        <Badge variant="destructive">Urgent</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{submission.user.name}</p>
                          <p className="text-gray-500">{submission.user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{submission.service}</p>
                          <p className="text-gray-500">{submission.vehicle.year} {submission.vehicle.make} {submission.vehicle.model}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">Preferred: {submission.preferredDate}</p>
                          <p className="text-gray-500">Submitted: {submission.submittedDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">${submission.estimatedCost}</p>
                          <p className="text-gray-500">Estimated Cost</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Submission Details - {selectedSubmission?.requestId}</DialogTitle>
                          <DialogDescription>
                            Complete information about this service request
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedSubmission && (
                          <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Customer Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  <p><strong>Name:</strong> {selectedSubmission.user.name}</p>
                                  <p><strong>Email:</strong> {selectedSubmission.user.email}</p>
                                  <p><strong>Phone:</strong> {selectedSubmission.user.phone}</p>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Vehicle Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  <p><strong>Make:</strong> {selectedSubmission.vehicle.make}</p>
                                  <p><strong>Model:</strong> {selectedSubmission.vehicle.model}</p>
                                  <p><strong>Year:</strong> {selectedSubmission.vehicle.year}</p>
                                  <p><strong>VIN:</strong> {selectedSubmission.vehicle.vin}</p>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Service Details */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Service Details</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <p><strong>Service:</strong> {selectedSubmission.service}</p>
                                  <p><strong>Category:</strong> {selectedSubmission.category}</p>
                                  <p><strong>Priority:</strong> {selectedSubmission.priority}</p>
                                </div>
                                <div>
                                  <p><strong>Description:</strong></p>
                                  <p className="mt-2 p-3 bg-gray-50 rounded-lg">{selectedSubmission.description}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <p><strong>Preferred Date:</strong> {selectedSubmission.preferredDate}</p>
                                  <p><strong>Estimated Cost:</strong> ${selectedSubmission.estimatedCost}</p>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Documents */}
                            {selectedSubmission.documents.length > 0 && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    {selectedSubmission.documents.map((doc: string, index: number) => (
                                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4 text-gray-500" />
                                          <span>{doc}</span>
                                        </div>
                                        <Button variant="outline" size="sm">
                                          <Download className="h-4 w-4 mr-2" />
                                          Download
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Status Management */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Status Management</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <span>Current Status:</span>
                                  <Badge className={getStatusColor(selectedSubmission.status)}>
                                    {selectedSubmission.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateSubmissionStatus(selectedSubmission.id, "approved")}
                                    disabled={selectedSubmission.status === "approved"}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateSubmissionStatus(selectedSubmission.id, "in_progress")}
                                    disabled={selectedSubmission.status === "in_progress"}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    In Progress
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateSubmissionStatus(selectedSubmission.id, "completed")}
                                    disabled={selectedSubmission.status === "completed"}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Complete
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showResponse} onOpenChange={setShowResponse}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Respond
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send Response</DialogTitle>
                          <DialogDescription>
                            Send a message to {selectedSubmission?.user.name} about their request
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Type your response message here..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowResponse(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => sendResponse(selectedSubmission?.id, responseText)}>
                            Send Message
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSubmissions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "No service requests have been submitted yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}