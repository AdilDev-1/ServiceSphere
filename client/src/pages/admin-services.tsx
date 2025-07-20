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
import { Switch } from "@/components/ui/switch";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Plus,
  Trash2,
  Wrench,
  DollarSign,
  Clock,
  Upload,
  Settings,
  Car,
  AlertCircle
} from "lucide-react";

export default function AdminServices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateService, setShowCreateService] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    category: "",
    basePrice: "",
    estimatedTime: "",
    requiredDocuments: [],
    isActive: true,
    displayOrder: 0
  });

  // Mock data - replace with real API calls later
  const services = [
    {
      id: 1,
      name: "Brake Inspection",
      description: "Comprehensive brake system inspection including pads, rotors, fluid levels, and performance testing",
      category: "Safety Inspection",
      basePrice: 89.99,
      estimatedTime: "1-2 hours",
      requiredDocuments: ["Vehicle Registration", "Previous Inspection Report"],
      serviceImage: null,
      isActive: true,
      displayOrder: 1,
      createdAt: "2024-01-10",
      totalRequests: 24,
      avgRating: 4.8
    },
    {
      id: 2,
      name: "Oil Change Service",
      description: "Complete oil and filter change service with multi-point inspection",
      category: "Maintenance",
      basePrice: 49.99,
      estimatedTime: "30-45 minutes",
      requiredDocuments: ["Vehicle Registration"],
      serviceImage: null,
      isActive: true,
      displayOrder: 2,
      createdAt: "2024-01-10",
      totalRequests: 45,
      avgRating: 4.9
    },
    {
      id: 3,
      name: "Transmission Repair",
      description: "Diagnostic and repair services for automatic and manual transmissions",
      category: "Repair",
      basePrice: 299.99,
      estimatedTime: "4-6 hours",
      requiredDocuments: ["Vehicle Registration", "Diagnostic Report", "Warranty Information"],
      serviceImage: null,
      isActive: true,
      displayOrder: 3,
      createdAt: "2024-01-08",
      totalRequests: 12,
      avgRating: 4.7
    },
    {
      id: 4,
      name: "Annual Safety Inspection",
      description: "State-required annual vehicle safety inspection covering all major systems",
      category: "Safety Inspection",
      basePrice: 25.00,
      estimatedTime: "45 minutes",
      requiredDocuments: ["Vehicle Registration", "Insurance Card", "Previous Inspection"],
      serviceImage: null,
      isActive: true,
      displayOrder: 4,
      createdAt: "2024-01-05",
      totalRequests: 67,
      avgRating: 4.6
    },
    {
      id: 5,
      name: "Engine Diagnostic",
      description: "Advanced computer diagnostic to identify engine performance issues",
      category: "Diagnostic",
      basePrice: 129.99,
      estimatedTime: "1-2 hours",
      requiredDocuments: ["Vehicle Registration"],
      serviceImage: null,
      isActive: false,
      displayOrder: 5,
      createdAt: "2024-01-03",
      totalRequests: 8,
      avgRating: 4.5
    }
  ];

  const categories = ["Safety Inspection", "Maintenance", "Repair", "Diagnostic", "Custom"];

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && service.isActive) ||
      (statusFilter === "inactive" && !service.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const createService = () => {
    // API call would go here
    console.log("Creating service:", newService);
    setShowCreateService(false);
    setNewService({
      name: "",
      description: "",
      category: "",
      basePrice: "",
      estimatedTime: "",
      requiredDocuments: [],
      isActive: true,
      displayOrder: 0
    });
  };

  const updateService = (serviceId: number, updates: any) => {
    // API call would go here
    console.log(`Updating service ${serviceId}:`, updates);
    setShowEditService(false);
    setSelectedService(null);
  };

  const toggleServiceStatus = (serviceId: number) => {
    // API call would go here
    console.log(`Toggling status for service ${serviceId}`);
  };

  const deleteService = (serviceId: number) => {
    // API call would go here
    if (window.confirm("Are you sure you want to delete this service?")) {
      console.log(`Deleting service ${serviceId}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const addDocument = (newDoc: string) => {
    if (newDoc && !newService.requiredDocuments.includes(newDoc)) {
      setNewService(prev => ({
        ...prev,
        requiredDocuments: [...prev.requiredDocuments, newDoc]
      }));
    }
  };

  const removeDocument = (docToRemove: string) => {
    setNewService(prev => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.filter(doc => doc !== docToRemove)
    }));
  };

  const totalActiveServices = services.filter(s => s.isActive).length;
  const totalRequests = services.reduce((sum, s) => sum + s.totalRequests, 0);
  const avgPrice = services.reduce((sum, s) => sum + s.basePrice, 0) / services.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Management</h1>
          <p className="text-gray-600">Manage automotive services, pricing, and availability</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Wrench className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalActiveServices}</div>
              <p className="text-xs text-muted-foreground">
                Available to customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Car className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalRequests}</div>
              <p className="text-xs text-muted-foreground">
                All time service requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Price</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">${avgPrice.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">
                Across all services
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Settings className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{categories.length}</div>
              <p className="text-xs text-muted-foreground">
                Service categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Service Catalog</CardTitle>
              <Dialog open={showCreateService} onOpenChange={setShowCreateService}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Service</DialogTitle>
                    <DialogDescription>
                      Add a new automotive service to your catalog
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Service Name</Label>
                        <Input
                          placeholder="e.g., Brake Inspection"
                          value={newService.name}
                          onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={newService.category} onValueChange={(value) => setNewService(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        placeholder="Detailed description of the service..."
                        value={newService.description}
                        onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="basePrice">Base Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={newService.basePrice}
                          onChange={(e) => setNewService(prev => ({ ...prev, basePrice: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="estimatedTime">Estimated Time</Label>
                        <Input
                          placeholder="e.g., 1-2 hours"
                          value={newService.estimatedTime}
                          onChange={(e) => setNewService(prev => ({ ...prev, estimatedTime: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Required Documents</Label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Enter document name and press Enter"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addDocument(e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              addDocument(input.value);
                              input.value = '';
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newService.requiredDocuments.map((doc) => (
                            <Badge key={doc} variant="outline" className="flex items-center gap-1">
                              {doc}
                              <button
                                onClick={() => removeDocument(doc)}
                                className="ml-1 text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newService.isActive}
                        onCheckedChange={(checked) => setNewService(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label>Active (visible to customers)</Label>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateService(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createService}>
                      Create Service
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
                    placeholder="Search services by name, description, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <Settings className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Services Table */}
        <Card>
          <CardHeader>
            <CardTitle>Services ({filteredServices.length})</CardTitle>
            <CardDescription>
              Manage your automotive service offerings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-500 max-w-xs truncate">
                          {service.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Created: {formatDate(service.createdAt)}
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline">{service.category}</Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <p className="text-lg font-bold text-green-600">
                          ${service.basePrice.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">Base price</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{service.estimatedTime}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={service.isActive ? "default" : "destructive"}>
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <p>Requests: {service.totalRequests}</p>
                        <p>Rating: ⭐ {service.avgRating.toFixed(1)}</p>
                        <p>Documents: {service.requiredDocuments.length}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedService(service)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Service Details - {selectedService?.name}</DialogTitle>
                              <DialogDescription>
                                Complete information about this automotive service
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedService && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-3">Service Information</h4>
                                    <div className="space-y-2">
                                      <p><strong>Name:</strong> {selectedService.name}</p>
                                      <p><strong>Category:</strong> 
                                        <Badge className="ml-2" variant="outline">{selectedService.category}</Badge>
                                      </p>
                                      <p><strong>Description:</strong></p>
                                      <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedService.description}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-3">Pricing & Duration</h4>
                                    <div className="space-y-2">
                                      <p><strong>Base Price:</strong> 
                                        <span className="text-lg font-bold text-green-600 ml-2">
                                          ${selectedService.basePrice.toFixed(2)}
                                        </span>
                                      </p>
                                      <p><strong>Estimated Time:</strong> {selectedService.estimatedTime}</p>
                                      <p><strong>Status:</strong> 
                                        <Badge className="ml-2" variant={selectedService.isActive ? "default" : "destructive"}>
                                          {selectedService.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {selectedService.requiredDocuments.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-3">Required Documents</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedService.requiredDocuments.map((doc: string, index: number) => (
                                        <Badge key={index} variant="outline">{doc}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">{selectedService.totalRequests}</p>
                                    <p className="text-sm text-gray-600">Total Requests</p>
                                  </div>
                                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                    <p className="text-2xl font-bold text-yellow-600">⭐ {selectedService.avgRating.toFixed(1)}</p>
                                    <p className="text-sm text-gray-600">Average Rating</p>
                                  </div>
                                  <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{formatDate(selectedService.createdAt)}</p>
                                    <p className="text-sm text-gray-600">Created</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedService(service);
                            setShowEditService(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleServiceStatus(service.id)}
                        >
                          {service.isActive ? "Disable" : "Enable"}
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteService(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredServices.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-500">
                {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No automotive services have been created yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}