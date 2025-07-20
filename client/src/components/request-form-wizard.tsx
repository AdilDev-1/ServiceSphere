import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, User, FileText, CreditCard } from "lucide-react";
import { z } from "zod";

const formSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  
  // Service Details
  serviceTypeId: z.number(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["standard", "expedited", "urgent"]),
  additionalServices: z.array(z.string()),
  
  // Documents (handled separately)
  documentUploads: z.array(z.object({
    file: z.any(),
    type: z.string(),
    name: z.string(),
  })).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface RequestFormWizardProps {
  onSubmit: (data: FormData) => void;
  serviceTypes?: any[];
  isSubmitting?: boolean;
  defaultValues?: Partial<FormData>;
}

export default function RequestFormWizard({
  onSubmit,
  serviceTypes = [],
  isSubmitting = false,
  defaultValues,
}: RequestFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      additionalServices: [],
      priority: "standard",
      ...defaultValues,
    },
  });

  const steps = [
    {
      title: "Personal Information",
      icon: User,
      description: "Tell us about yourself",
    },
    {
      title: "Service Details",
      icon: FileText,
      description: "What service do you need?",
    },
    {
      title: "Review & Submit",
      icon: CreditCard,
      description: "Review your request",
    },
  ];

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ["firstName", "lastName", "email", "phone"] as const;
      case 2:
        return ["serviceTypeId", "title", "description", "priority"] as const;
      default:
        return [] as const;
    }
  };

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isActive = stepNumber === currentStep;
              const Icon = step.icon;

              return (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                      isCompleted
                        ? "bg-success"
                        : isActive
                        ? "bg-primary"
                        : "bg-gray-300"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  {stepNumber < totalSteps && (
                    <div
                      className={`w-16 h-1 ${
                        stepNumber < currentStep ? "bg-success" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          <div className="mt-2">
            <Progress value={progress} className="w-64 mx-auto" />
            <p className="text-sm text-gray-500 mt-1">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your first name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your last name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="Enter your email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your phone number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Service Details */}
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
                            {serviceTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id.toString()}>
                                {type.name} - ${parseFloat(type.basePrice).toFixed(2)}
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
                          <Input {...field} placeholder="Brief title for your request" />
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
                          <Textarea
                            {...field}
                            rows={4}
                            placeholder="Describe your requirements in detail..."
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
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                          >
                            <div className="flex items-center space-x-2 border rounded-lg p-3">
                              <RadioGroupItem value="standard" />
                              <div>
                                <div className="font-medium">Standard</div>
                                <div className="text-xs text-gray-500">5-7 business days</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-3">
                              <RadioGroupItem value="expedited" />
                              <div>
                                <div className="font-medium">Expedited</div>
                                <div className="text-xs text-gray-500">2-3 business days (+$50)</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-3">
                              <RadioGroupItem value="urgent" />
                              <div>
                                <div className="font-medium">Urgent</div>
                                <div className="text-xs text-gray-500">24-48 hours (+$100)</div>
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

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Review Your Request</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Personal Information</h4>
                        <p className="text-sm text-gray-600">
                          {form.watch("firstName")} {form.watch("lastName")}
                        </p>
                        <p className="text-sm text-gray-600">{form.watch("email")}</p>
                        <p className="text-sm text-gray-600">{form.watch("phone")}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900">Service Details</h4>
                        <p className="text-sm text-gray-600">
                          {serviceTypes.find(t => t.id === form.watch("serviceTypeId"))?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Priority: <span className="capitalize">{form.watch("priority")}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900">Description</h4>
                      <p className="text-sm text-gray-600">{form.watch("description")}</p>
                    </div>
                    
                    {form.watch("additionalServices")?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900">Additional Services</h4>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {form.watch("additionalServices").map((service, index) => (
                            <li key={index}>{service}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
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

                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep}>
                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="bg-success hover:bg-green-700">
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
