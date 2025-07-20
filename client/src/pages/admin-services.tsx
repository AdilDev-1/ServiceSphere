import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { z } from "zod";

const serviceTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.string().min(1, "Base price is required"),
  processingTime: z.string().min(1, "Processing time is required"),
  requiredDocuments: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

type ServiceTypeFormData = z.infer<typeof serviceTypeSchema>;

export default function AdminServices() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [documentInput, setDocumentInput] = useState("");
  
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

  const form = useForm<ServiceTypeFormData>({
    resolver: zodResolver(serviceTypeSchema),
    defaultValues: {
      requiredDocuments: [],
      isActive: true,
    },
  });

  const { data: services, isLoading: servicesLoading, error } = useQuery({
    queryKey: ["/api/service-types"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const createServiceMutation = useMutation({
    mutationFn: async (data: ServiceTypeFormData) => {
      const response = await apiRequest("POST", "/api/service-types", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Service type created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/service-types"] });
      form.reset();
      setSelectedService(null);
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
        description: "Failed to create service type",
        variant: "destructive",
      });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ServiceTypeFormData }) => {
      const response = await apiRequest("PATCH", `/api/service-types/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Service type updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/service-types"] });
      form.reset();
      setSelectedService(null);
      setIsEditMode(false);
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
        description: "Failed to update service type",
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

  const onSubmit = (data: ServiceTypeFormData) => {
    if (isEditMode && selectedService) {
      updateServiceMutation.mutate({ id: selectedService.id, data });
    } else {
      createServiceMutation.mutate(data);
    }
  };

  const handleEdit = (service: any) => {
    setSelectedService(service);
    setIsEditMode(true);
    form.reset({
      name: service.name,
      description: service.description,
      basePrice: service.basePrice,
      processingTime: service.processingTime,
      requiredDocuments: service.requiredDocuments || [],
      isActive: service.isActive,
    });
  };

  const handleAddDocument = () => {
    if (documentInput.trim()) {
      const currentDocuments = form.getValues("requiredDocuments");
      form.setValue("requiredDocuments", [...currentDocuments, documentInput.trim()]);
      setDocumentInput("");
    }
  };

  const handleRemoveDocument = (index: number) => {
    const currentDocuments = form.getValues("requiredDocuments");
    const newDocuments = currentDocuments.filter((_, i) => i !== index);
    form.setValue("requiredDocuments", newDocuments);
  };

  const resetForm = () => {
    form.reset();
    setSelectedService(null);
    setIsEditMode(false);
    setDocumentInput("");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Manage Services</CardTitle>
                    <p className="text-gray-600 mt-1">Configure available services and their requirements</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={resetForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {isEditMode ? "Edit Service Type" : "Add New Service Type"}
                        </DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Service Name *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., Business License Application" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description *</FormLabel>
                                <FormControl>
                                  <Textarea {...field} placeholder="Describe what this service provides..." />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="basePrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Base Price (USD) *</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="200.00" type="number" step="0.01" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="processingTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Processing Time *</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="5-7 business days" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div>
                            <FormLabel>Required Documents</FormLabel>
                            <div className="mt-2 space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  value={documentInput}
                                  onChange={(e) => setDocumentInput(e.target.value)}
                                  placeholder="Add required document..."
                                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDocument())}
                                />
                                <Button type="button" onClick={handleAddDocument} variant="outline">
                                  Add
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {form.watch("requiredDocuments").map((doc, index) => (
                                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveDocument(index)}>
                                    {doc} ×
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <FormLabel>Active Service</FormLabel>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end space-x-3">
                            <Button type="button" variant="outline" onClick={resetForm}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={createServiceMutation.isPending || updateServiceMutation.isPending}>
                              {isEditMode ? "Update Service" : "Create Service"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              <CardContent>
                {servicesLoading ? (
                  <p>Loading...</p>
                ) : services && services.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Base Price</TableHead>
                        <TableHead>Processing Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service: any) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                          <TableCell>${parseFloat(service.basePrice).toFixed(2)}</TableCell>
                          <TableCell>{service.processingTime}</TableCell>
                          <TableCell>
                            <Badge variant={service.isActive ? "default" : "secondary"}>
                              {service.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    No services configured. Add your first service to get started.
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
