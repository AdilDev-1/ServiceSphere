import { useState } from "react";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  Send, 
  Plus,
  MessageSquare,
  Mail,
  Bell,
  Eye,
  Trash2,
  Reply,
  Forward,
  Archive,
  Star,
  Clock,
  User,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function AdminMessages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showComposeMessage, setShowComposeMessage] = useState(false);
  const [showSendNotification, setShowSendNotification] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [newMessage, setNewMessage] = useState({
    recipient: "",
    subject: "",
    message: "",
    priority: "normal"
  });
  const [newNotification, setNewNotification] = useState({
    recipients: "all",
    title: "",
    message: "",
    type: "info"
  });

  // Mock data - replace with real API calls later
  const messages = [
    {
      id: 1,
      type: "inquiry",
      from: { name: "John Smith", email: "john@email.com", avatar: null },
      to: "Admin Team",
      subject: "Question about brake service pricing",
      message: "Hi, I'd like to know more details about your brake inspection service. What exactly is included in the base price of $89.99? Do you provide a detailed report after the inspection?",
      timestamp: "2024-01-18T14:30:00Z",
      status: "unread",
      priority: "normal",
      requestId: "REQ-2024-001",
      attachments: []
    },
    {
      id: 2,
      type: "complaint",
      from: { name: "Sarah Johnson", email: "sarah@email.com", avatar: null },
      to: "Admin Team",
      subject: "Unsatisfied with oil change service",
      message: "I had my oil changed last week and I'm experiencing some issues. The car is making unusual noises and I'm concerned the wrong oil type was used. Can someone please contact me to discuss this?",
      timestamp: "2024-01-17T16:45:00Z",
      status: "read",
      priority: "high",
      requestId: "REQ-2024-002",
      attachments: ["oil_receipt.pdf"]
    },
    {
      id: 3,
      type: "feedback",
      from: { name: "Robert Wilson", email: "robert@email.com", avatar: null },
      to: "Admin Team",
      subject: "Excellent transmission repair service!",
      message: "I wanted to thank your team for the excellent service on my transmission repair. Lisa Chen was very professional and explained everything clearly. The repair was completed faster than expected and my truck is running perfectly now.",
      timestamp: "2024-01-16T11:20:00Z",
      status: "replied",
      priority: "normal",
      requestId: "REQ-2024-003",
      attachments: []
    },
    {
      id: 4,
      type: "support",
      from: { name: "Emily Davis", email: "emily@email.com", avatar: null },
      to: "Admin Team",
      subject: "Payment portal not working",
      message: "I'm trying to pay my invoice INV-2024-004 but the payment page keeps showing an error. I've tried multiple browsers and cleared my cache. Can you help me complete this payment?",
      timestamp: "2024-01-15T09:15:00Z",
      status: "in_progress",
      priority: "high",
      requestId: null,
      attachments: ["error_screenshot.png"]
    }
  ];

  const notifications = [
    {
      id: 1,
      title: "System Maintenance Scheduled",
      message: "We will be performing system maintenance on Saturday from 2 AM to 6 AM EST. Service requests may be temporarily unavailable.",
      type: "warning",
      recipients: "all",
      sentAt: "2024-01-18T10:00:00Z",
      status: "sent"
    },
    {
      id: 2,
      title: "New Service Available: AC Repair",
      message: "We're excited to announce our new AC repair service! Book your appointment now for the upcoming summer season.",
      type: "info",
      recipients: "active_users",
      sentAt: "2024-01-15T14:30:00Z",
      status: "sent"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread": return "bg-blue-100 text-blue-800";
      case "read": return "bg-gray-100 text-gray-800";
      case "replied": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "normal": return "bg-blue-100 text-blue-800";
      case "low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "inquiry": return <MessageSquare className="h-4 w-4" />;
      case "complaint": return <AlertCircle className="h-4 w-4" />;
      case "feedback": return <Star className="h-4 w-4" />;
      case "support": return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || message.type === typeFilter;
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const sendMessage = () => {
    // API call would go here
    console.log("Sending message:", newMessage);
    setShowComposeMessage(false);
    setNewMessage({
      recipient: "",
      subject: "",
      message: "",
      priority: "normal"
    });
  };

  const sendNotification = () => {
    // API call would go here
    console.log("Sending notification:", newNotification);
    setShowSendNotification(false);
    setNewNotification({
      recipients: "all",
      title: "",
      message: "",
      type: "info"
    });
  };

  const updateMessageStatus = (messageId: number, newStatus: string) => {
    // API call would go here
    console.log(`Updating message ${messageId} status to: ${newStatus}`);
  };

  const deleteMessage = (messageId: number) => {
    // API call would go here
    if (window.confirm("Are you sure you want to delete this message?")) {
      console.log(`Deleting message ${messageId}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const unreadCount = messages.filter(m => m.status === "unread").length;
  const highPriorityCount = messages.filter(m => m.priority === "high").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8 ml-64">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages & CRM</h1>
          <p className="text-gray-600">Manage customer communications and send notifications</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <Mail className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
              <p className="text-xs text-muted-foreground">
                Urgent messages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{messages.length}</div>
              <p className="text-xs text-muted-foreground">
                All conversations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications Sent</CardTitle>
              <Bell className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{notifications.length}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Communication Center</CardTitle>
              <div className="flex gap-2">
                <Dialog open={showComposeMessage} onOpenChange={setShowComposeMessage}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Compose Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Compose New Message</DialogTitle>
                      <DialogDescription>
                        Send a direct message to a customer
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="recipient">Recipient</Label>
                        <Select value={newMessage.recipient} onValueChange={(value) => setNewMessage(prev => ({ ...prev, recipient: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select recipient" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="john@email.com">John Smith (john@email.com)</SelectItem>
                            <SelectItem value="sarah@email.com">Sarah Johnson (sarah@email.com)</SelectItem>
                            <SelectItem value="robert@email.com">Robert Wilson (robert@email.com)</SelectItem>
                            <SelectItem value="emily@email.com">Emily Davis (emily@email.com)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          placeholder="Message subject"
                          value={newMessage.subject}
                          onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={newMessage.priority} onValueChange={(value) => setNewMessage(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          placeholder="Type your message here..."
                          value={newMessage.message}
                          onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                          rows={5}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowComposeMessage(false)}>
                        Cancel
                      </Button>
                      <Button onClick={sendMessage}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={showSendNotification} onOpenChange={setShowSendNotification}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Send Notification
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Send Notification</DialogTitle>
                      <DialogDescription>
                        Broadcast a notification to users
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="recipients">Recipients</Label>
                        <Select value={newNotification.recipients} onValueChange={(value) => setNewNotification(prev => ({ ...prev, recipients: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="active_users">Active Users Only</SelectItem>
                            <SelectItem value="recent_customers">Recent Customers</SelectItem>
                            <SelectItem value="admins">Admin Users Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="type">Notification Type</Label>
                        <Select value={newNotification.type} onValueChange={(value) => setNewNotification(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="info">Information</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          placeholder="Notification title"
                          value={newNotification.title}
                          onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          placeholder="Notification content..."
                          value={newNotification.message}
                          onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                          rows={4}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowSendNotification(false)}>
                        Cancel
                      </Button>
                      <Button onClick={sendNotification}>
                        <Bell className="h-4 w-4 mr-2" />
                        Send Notification
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search messages by sender, subject, or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="inquiry">Inquiry</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={message.from.avatar || ""} />
                    <AvatarFallback>
                      {getUserInitials(message.from.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold truncate">{message.subject}</h3>
                        <Badge className={getStatusColor(message.status)}>
                          {message.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(message.priority)}>
                          {message.priority} priority
                        </Badge>
                        <Badge variant="outline">
                          {getTypeIcon(message.type)}
                          <span className="ml-1">{message.type}</span>
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(message.timestamp)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{message.from.name}</span>
                      <span className="text-sm text-gray-500">({message.from.email})</span>
                      {message.requestId && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-blue-600">{message.requestId}</span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-2">{message.message}</p>
                    
                    {message.attachments.length > 0 && (
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-sm text-gray-500">Attachments:</span>
                        {message.attachments.map((attachment, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            📎 {attachment}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedMessage(message)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Full
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
                            <DialogDescription>
                              From: {selectedMessage?.from.name} ({selectedMessage?.from.email})
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedMessage && (
                            <div className="space-y-4">
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                              </div>
                              
                              {selectedMessage.attachments.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Attachments</h4>
                                  <div className="space-y-2">
                                    {selectedMessage.attachments.map((attachment: string, index: number) => (
                                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="text-sm">{attachment}</span>
                                        <Button variant="outline" size="sm">Download</Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500">Status:</span>
                                  <Badge className={getStatusColor(selectedMessage.status)}>
                                    {selectedMessage.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {formatDate(selectedMessage.timestamp)}
                                </span>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateMessageStatus(message.id, "replied")}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                      </Button>

                      {message.status === "unread" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateMessageStatus(message.id, "read")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Read
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateMessageStatus(message.id, "archived")}
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMessage(message.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
              <p className="text-gray-500">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No customer messages have been received yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}