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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MessageSquare, Send, Users, Bell, Plus, Reply } from "lucide-react";
import { z } from "zod";

const messageSchema = z.object({
  toUserId: z.string().min(1, "Recipient is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Message content is required"),
  messageType: z.enum(["general", "notification", "support", "announcement"]).default("general"),
});

type MessageFormData = z.infer<typeof messageSchema>;

export default function AdminMessages() {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [filter, setFilter] = useState("all");
  
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

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      messageType: "general",
    },
  });

  const { data: messages, isLoading: messagesLoading, error } = useQuery({
    queryKey: ["/api/messages"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: requests } = useQuery({
    queryKey: ["/api/requests"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: MessageFormData) => {
      const response = await apiRequest("POST", "/api/messages", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      form.reset();
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
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await apiRequest("PATCH", `/api/messages/${messageId}`, { isRead: true });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  if (!isAuthenticated || isLoading || user?.role !== "admin") {
    return null;
  }

  if (error && isUnauthorizedError(error)) {
    return null;
  }

  // Mock messages for demonstration
  const mockMessages = [
    {
      id: 1,
      fromUserId: "1",
      toUserId: user?.id,
      subject: "Question about document requirements",
      content: "Hi, I have a question about the documents required for my business license application...",
      isRead: false,
      messageType: "support",
      createdAt: new Date().toISOString(),
      requestId: 1,
    },
    {
      id: 2,
      fromUserId: "2",
      toUserId: user?.id,
      subject: "Payment confirmation needed",
      content: "I made a payment yesterday but haven't received confirmation yet. Can you help?",
      isRead: true,
      messageType: "support",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      requestId: 2,
    },
  ];

  const allMessages = messages && messages.length > 0 ? messages : mockMessages;
  
  const filteredMessages = allMessages.filter(msg => {
    if (filter === "all") return true;
    if (filter === "unread") return !msg.isRead;
    if (filter === "support") return msg.messageType === "support";
    return true;
  });

  const unreadCount = allMessages.filter(msg => !msg.isRead).length;

  const onSubmit = (data: MessageFormData) => {
    sendMessageMutation.mutate(data);
  };

  const getMessageTypeBadge = (type: string) => {
    switch (type) {
      case "support":
        return <Badge variant="secondary" className="bg-primary/10 text-primary">Support</Badge>;
      case "notification":
        return <Badge variant="secondary" className="bg-warning/10 text-warning">Notification</Badge>;
      case "announcement":
        return <Badge variant="secondary" className="bg-success/10 text-success">Announcement</Badge>;
      default:
        return <Badge variant="secondary">General</Badge>;
    }
  };

  const getUserDisplayName = (userId: string) => {
    if (userId === user?.id) return "You";
    return `User ${userId}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Messages</p>
                      <p className="text-3xl font-bold text-gray-900">{allMessages.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                      <p className="text-3xl font-bold text-warning">{unreadCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                      <Bell className="w-6 h-6 text-warning" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Conversations</p>
                      <p className="text-3xl font-bold text-success">
                        {new Set(allMessages.map(m => m.fromUserId)).size}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Messages */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Message List */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Message Center</CardTitle>
                        <p className="text-gray-600 mt-1">Communicate with users and manage support tickets</p>
                      </div>
                      <div className="flex gap-3">
                        <Select value={filter} onValueChange={setFilter}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Messages</SelectItem>
                            <SelectItem value="unread">Unread Only</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                          </SelectContent>
                        </Select>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>
                              <Plus className="w-4 h-4 mr-2" />
                              New Message
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Send New Message</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="toUserId"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>To (User ID)</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="Enter user ID" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="messageType"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Message Type</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="general">General</SelectItem>
                                          <SelectItem value="notification">Notification</SelectItem>
                                          <SelectItem value="support">Support</SelectItem>
                                          <SelectItem value="announcement">Announcement</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="subject"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Subject</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="Message subject" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="content"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Message</FormLabel>
                                      <FormControl>
                                        <Textarea {...field} rows={4} placeholder="Type your message..." />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <Button type="submit" disabled={sendMessageMutation.isPending}>
                                  <Send className="w-4 h-4 mr-2" />
                                  Send Message
                                </Button>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {messagesLoading ? (
                      <p>Loading...</p>
                    ) : filteredMessages.length > 0 ? (
                      <div className="space-y-4">
                        {filteredMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                              !message.isRead ? "bg-blue-50 border-primary/20" : ""
                            }`}
                            onClick={() => {
                              setSelectedMessage(message);
                              if (!message.isRead) {
                                markAsReadMutation.mutate(message.id);
                              }
                            }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{message.subject}</h4>
                                {!message.isRead && (
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {getMessageTypeBadge(message.messageType)}
                                <span className="text-xs text-gray-500">
                                  {new Date(message.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              From: {getUserDisplayName(message.fromUserId)}
                            </p>
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {message.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-gray-500">No messages found</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Message Detail */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Message Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedMessage ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-lg">{selectedMessage.subject}</h3>
                          <p className="text-sm text-gray-600">
                            From: {getUserDisplayName(selectedMessage.fromUserId)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(selectedMessage.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="border-t pt-4">
                          <p className="text-gray-700">{selectedMessage.content}</p>
                        </div>

                        {selectedMessage.requestId && (
                          <div className="border-t pt-4">
                            <p className="text-sm text-gray-600">
                              Related to Request: REQ-2024-{selectedMessage.requestId.toString().padStart(3, '0')}
                            </p>
                          </div>
                        )}

                        <Button className="w-full" variant="outline">
                          <Reply className="w-4 h-4 mr-2" />
                          Reply to Message
                        </Button>
                      </div>
                    ) : (
                      <p className="text-gray-500">Select a message to view details</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
