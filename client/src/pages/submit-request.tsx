import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import UserSidebar from "@/components/user-sidebar";
import RequestFormWizard from "@/components/request-form-wizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { z } from "zod";
import { useLocation } from "wouter";
import { useEffect } from "react";

const requestSchema = z.object({
  serviceTypeId: z.number(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["standard", "expedited", "urgent"]),
  additionalServices: z.array(z.string()),
});

type RequestFormData = z.infer<typeof requestSchema>;

export default function SubmitRequest() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      additionalServices: [],
      priority: "standard",
    },
  });

  const { data: serviceTypes } = useQuery({
    queryKey: ["/api/service-types"],
    enabled: isAuthenticated,
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: RequestFormData) => {
      const response = await apiRequest("POST", "/api/requests", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your request has been submitted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      navigate("/my-submissions");
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
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated || isLoading) {
    return null;
  }

  const onSubmit = (data: RequestFormData) => {
    createRequestMutation.mutate(data);
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
      
      <div className="flex-1 overflow-auto">
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
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="serviceTypeId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Type *</FormLabel>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a service..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {serviceTypes?.map((type: any) => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                      {type.name}
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
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Request Title *</FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                  placeholder="Brief title for your request"
                                />
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
                                  className="grid grid-cols-3 gap-4"
                                >
                                  <div className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <RadioGroupItem value="standard" className="mr-3" />
                                    <div>
                                      <div className="font-medium">Standard</div>
                                      <div className="text-xs text-gray-500">5-7 business days</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <RadioGroupItem value="expedited" className="mr-3" />
                                    <div>
                                      <div className="font-medium">Expedited</div>
                                      <div className="text-xs text-gray-500">2-3 business days</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
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
                              <FormLabel>Service Description *</FormLabel>
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

                        <FormField
                          control={form.control}
                          name="additionalServices"
                          render={() => (
                            <FormItem>
                              <FormLabel>Additional Services</FormLabel>
                              <div className="space-y-2">
                                {[
                                  { id: "email", label: "Email notifications for status updates" },
                                  { id: "sms", label: "SMS notifications for urgent updates" },
                                  { id: "consultation", label: "Consultation call with specialist" },
                                ].map((item) => (
                                  <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="additionalServices"
                                    render={({ field }) => (
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, item.id])
                                                : field.onChange(
                                                    field.value?.filter((value) => value !== item.id)
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {item.label}
                                        </FormLabel>
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <p className="text-gray-600">Please review your request details before submitting.</p>
                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                          <div>
                            <h3 className="font-medium text-gray-900">Request Title</h3>
                            <p className="text-gray-600">{form.watch("title")}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Service Type</h3>
                            <p className="text-gray-600">
                              {serviceTypes?.find((t: any) => t.id === form.watch("serviceTypeId"))?.name}
                            </p>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Priority</h3>
                            <p className="text-gray-600 capitalize">{form.watch("priority")}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Description</h3>
                            <p className="text-gray-600">{form.watch("description")}</p>
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
                          disabled={createRequestMutation.isPending}
                          className="bg-success hover:bg-green-700"
                        >
                          {createRequestMutation.isPending ? "Submitting..." : "Submit Request"}
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
