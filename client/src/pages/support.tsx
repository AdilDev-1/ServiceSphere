import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuthClient } from "@/hooks/useAuthClient";
import { getMessages } from "@/lib/mockData";
import UserSidebar from "@/components/user-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, Phone, Mail } from "lucide-react";

export default function Support() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuthClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to access support.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const messages = user ? getMessages(user.id) : [];

  if (!isAuthenticated || isLoading) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar />
      
      <div className="flex-1 overflow-auto ml-64">
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Contact Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="Brief description of your issue"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select 
                      id="category"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      <option value="general">General Question</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing Question</option>
                      <option value="urgent">Urgent Issue</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      rows={6}
                      placeholder="Please describe your issue or question in detail..."
                      className="mt-1"
                    />
                  </div>
                  <Button className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Other Ways to Reach Us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center p-3 border rounded-lg">
                      <Phone className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-gray-600">1-800-SUPPORT (24/7)</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg">
                      <Mail className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-gray-600">support@serviceflow.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>FAQ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-b pb-3">
                      <h4 className="font-medium mb-1">How long does processing take?</h4>
                      <p className="text-sm text-gray-600">Standard requests take 5-7 business days, expedited requests take 2-3 business days.</p>
                    </div>
                    <div className="border-b pb-3">
                      <h4 className="font-medium mb-1">Can I track my request status?</h4>
                      <p className="text-sm text-gray-600">Yes, you can view all your requests and their status in the "My Submissions" section.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">What documents do I need?</h4>
                      <p className="text-sm text-gray-600">Required documents vary by service type. You'll see the specific requirements when you select a service.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Message History */}
            {messages && messages.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Message History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages.map((message: any) => (
                      <div key={message.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{message.subject || "Support Inquiry"}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{message.content}</p>
                        {!message.isRead && (
                          <span className="text-xs bg-primary text-white px-2 py-1 rounded-full mt-2 inline-block">
                            New
                          </span>
                        )}
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
