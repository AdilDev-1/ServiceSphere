import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuthClient } from "@/hooks/useAuthClient";
import { getPayments } from "@/lib/mockData";
import UserSidebar from "@/components/user-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Building, Shield } from "lucide-react";

export default function Payments() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuthClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to view payments.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const payments = user ? getPayments(user.id) : [];

  if (!isAuthenticated || isLoading) {
    return null;
  }

  // Mock approved request for payment demo
  const mockRequest = {
    id: "REQ-2024-001",
    serviceType: "Business License Application",
    priority: "Expedited",
    status: "Approved",
    approvedDate: "March 16, 2024",
  };

  const mockPaymentSummary = {
    serviceFee: 200.00,
    expeditedProcessing: 50.00,
    processingFee: 5.00,
    total: 255.00,
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar />
      
      <div className="flex-1 overflow-auto ml-64">
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Request Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Request ID:</span>
                    <span className="font-medium">{mockRequest.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Type:</span>
                    <span className="font-medium">{mockRequest.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                      {mockRequest.priority}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                      {mockRequest.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Approved on:</span>
                    <span className="font-medium">{mockRequest.approvedDate}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Payment Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Service Fee:</span>
                      <span className="font-medium">${mockPaymentSummary.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Expedited Processing:</span>
                      <span className="font-medium">${mockPaymentSummary.expeditedProcessing.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Processing Fee:</span>
                      <span className="font-medium">${mockPaymentSummary.processingFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-lg font-bold text-primary">${mockPaymentSummary.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">Payment Method</Label>
                    <RadioGroup defaultValue="card" className="space-y-3">
                      <div className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="card" className="mr-3" />
                        <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
                        <Label className="cursor-pointer">Credit/Debit Card</Label>
                      </div>
                      <div className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="bank" className="mr-3" />
                        <Building className="w-5 h-5 mr-2 text-gray-500" />
                        <Label className="cursor-pointer">Bank Transfer</Label>
                      </div>
                      <div className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="paypal" className="mr-3" />
                        <span className="w-5 h-5 mr-2 text-gray-500 font-bold text-xs">PP</span>
                        <Label className="cursor-pointer">PayPal</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Payment Button */}
                  <Button className="w-full bg-success hover:bg-green-700 text-lg py-3">
                    <Shield className="w-5 h-5 mr-2" />
                    Proceed to Secure Payment
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Your payment information is encrypted and secure
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Payment History */}
            {payments && payments.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payments.map((payment: any) => (
                      <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{payment.paymentId}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${parseFloat(payment.amount).toFixed(2)}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            payment.paymentStatus === "completed" ? "bg-success/10 text-success" :
                            payment.paymentStatus === "pending" ? "bg-warning/10 text-warning" :
                            "bg-error/10 text-error"
                          }`}>
                            {payment.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
