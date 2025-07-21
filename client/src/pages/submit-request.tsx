import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuthClient } from "@/hooks/useAuthClient";
import { getServiceTypes, createServiceRequest } from "@/lib/mockData";
import UserSidebar from "@/components/user-sidebar";
import RequestFormWizard from "@/components/request-form-wizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, CheckCircle, Upload, Calendar, Car } from "lucide-react";
import { z } from "zod";
import { useLocation } from "wouter";
import { useEffect } from "react";

const requestSchema = z.object({
  serviceTypeId: z.number(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["standard", "urgent"]),
  additionalServices: z.array(z.string()),
  vehicleMake: z.string().min(1, "Vehicle make is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  vehicleYear: z.number().min(1990).max(2025),
  vehicleVin: z.string().optional(),
  serviceCategory: z.string().min(1, "Service category is required"),
  preferredServiceDate: z.string().min(1, "Preferred service date is required"),
});

type RequestFormData = z.infer<typeof requestSchema>;

export default function SubmitRequest() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuthClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to submit a service request.",
        variant: "destructive",
      });
      setTimeout(() => {
        navigate("/auth");
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast, navigate]);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      additionalServices: [],
      priority: "standard",
      vehicleYear: new Date().getFullYear(),
      vehicleVin: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const serviceTypes = getServiceTypes();

  if (!isAuthenticated || isLoading) {
    return null;
  }

  const onSubmit = async (data: RequestFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const request = createServiceRequest({
        ...data,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
      });
      
      toast({
        title: "Success",
        description: "Your request has been submitted successfully!",
      });
      navigate("/my-submissions");
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar />
      
      <div className="flex-1 overflow-auto ml-64">
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    currentStep >= 1 ? "bg-success" : "bg-gray-300"
                  }`}>
                    {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : "1"}
                  </div>
                  <div className={`w-16 h-1 ${currentStep > 1 ? "bg-success" : "bg-gray-300"}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    currentStep >= 2 ? "bg-primary" : "bg-gray-300"
                  }`}>
                    {currentStep > 2 ? <CheckCircle className="w-5 h-5" /> : "2"}
                  </div>
                  <div className={`w-16 h-1 ${currentStep > 2 ? "bg-success" : "bg-gray-300"}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    currentStep >= 3 ? "bg-primary" : "bg-gray-300"
                  }`}>
                    3
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">Step {currentStep} of 3</p>
                  <p className="text-xs text-gray-500">
                    {currentStep === 1 && "Personal Information"}
                    {currentStep === 2 && "Service Details"}
                    {currentStep === 3 && "Review & Submit"}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && "Personal Information"}
                  {currentStep === 2 && "Service Details"}
                  {currentStep === 3 && "Review & Submit"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <p className="text-gray-600">Your account information will be used for this request.</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                              Auto-filled from account
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                              Auto-filled from account
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-8">
                        {/* Vehicle Information Section */}
                        <Card className="border-gray-300">
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                              <Car className="w-5 h-5 mr-2 text-blue-600" />
                              Vehicle Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="vehicleMake"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Vehicle Make *</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="e.g., Toyota, Honda, Ford"
                                        className="w-full"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="vehicleModel"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Vehicle Model *</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="e.g., Camry, Civic, F-150"
                                        className="w-full"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="vehicleYear"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Model Year *</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select year" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {Array.from({ length: 36 }, (_, i) => 2025 - i).map((year) => (
                                          <SelectItem key={year} value={year.toString()}>
                                            {year}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="vehicleVin"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>VIN (Optional)</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="17-character VIN"
                                        maxLength={17}
                                        className="w-full"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>

                        {/* Service Details Section */}
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="serviceCategory"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Service Category *</FormLabel>
                                <Select onValueChange={field.onChange}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select service category..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="inspection">Inspection</SelectItem>
                                    <SelectItem value="title_transfer">Title Transfer</SelectItem>
                                    <SelectItem value="registration_renewal">Registration Renewal</SelectItem>
                                    <SelectItem value="mechanical_repair">Mechanical Repair</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="preferredServiceDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Service Date *</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      type="date"
                                      min={new Date().toISOString().split('T')[0]}
                                      className="w-full pl-10"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Priority Level</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                  >
                                    <div className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                      <RadioGroupItem value="standard" className="mr-3" />
                                      <div>
                                        <div className="font-medium">Standard</div>
                                        <div className="text-xs text-gray-500">5-7 business days</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                      <RadioGroupItem value="urgent" className="mr-3" />
                                      <div>
                                        <div className="font-medium">Urgent</div>
                                        <div className="text-xs text-gray-500">24-48 hours</div>
                                      </div>
                                    </div>
                                  </RadioGroup>
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
                                <FormLabel>Additional Description *</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Please describe your service requirements in detail..."
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Document Upload Section */}
                          <div className="space-y-3">
                            <Label>Document Upload</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600 mb-1">
                                Drag and drop files here, or <span className="text-blue-600 font-medium cursor-pointer">browse</span>
                              </p>
                              <p className="text-xs text-gray-500">
                                Supports PDF, JPG, PNG files up to 10MB each
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <p className="text-gray-600">Please review your request details before submitting.</p>
                        
                        {/* Vehicle Information Review */}
                        <Card className="bg-gray-50">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                              <Car className="w-5 h-5 mr-2 text-blue-600" />
                              Vehicle Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <span className="text-sm font-medium text-gray-700">Vehicle Make:</span>
                                <p className="text-gray-900">{form.watch("vehicleMake") || "Not specified"}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700">Vehicle Model:</span>
                                <p className="text-gray-900">{form.watch("vehicleModel") || "Not specified"}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700">Model Year:</span>
                                <p className="text-gray-900">{form.watch("vehicleYear") || "Not specified"}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700">VIN:</span>
                                <p className="text-gray-900">{form.watch("vehicleVin") || "Not provided"}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Service Details Review */}
                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                          <div>
                            <h3 className="font-medium text-gray-900">Service Details</h3>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-gray-700">Service Category:</span>
                              <p className="text-gray-900 capitalize">{form.watch("serviceCategory")?.replace('_', ' ') || "Not specified"}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Preferred Date:</span>
                              <p className="text-gray-900">{form.watch("preferredServiceDate") || "Not specified"}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Priority:</span>
                              <p className="text-gray-900 capitalize">{form.watch("priority")}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Description:</span>
                            <p className="text-gray-900 mt-1">{form.watch("description") || "No description provided"}</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                          <div>
                            <h3 className="font-medium text-gray-900">Request Summary</h3>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Title:</span>
                            <p className="text-gray-900">{form.watch("title") || "Not specified"}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-between pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      
                      {currentStep < 3 ? (
                        <Button type="button" onClick={nextStep}>
                          Next Step <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="bg-success hover:bg-green-700"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Request"}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
