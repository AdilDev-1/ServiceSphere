import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, requireRole, hashPassword, verifyPassword } from "./auth";
import { registerUserSchema, loginUserSchema, insertServiceRequestSchema, insertServiceTypeSchema, insertDocumentSchema, insertPaymentSchema, insertMessageSchema } from "@shared/schema";
import { generateRequestId, generateInvoiceNumber } from "@shared/utils";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Seed default automotive service types
  const existingTypes = await storage.getServiceTypes();
  if (existingTypes.length === 0) {
    await storage.createServiceType({
      name: "Oil Change Service",
      description: "Complete oil and filter change service",
      category: "maintenance",
      basePrice: "45.00",
      estimatedTime: "30 minutes",
      requiredDocuments: [],
    });
    await storage.createServiceType({
      name: "Brake Inspection",
      description: "Comprehensive brake system inspection and service",
      category: "inspection",
      basePrice: "85.00",
      estimatedTime: "1 hour",
      requiredDocuments: [],
    });
    await storage.createServiceType({
      name: "Engine Diagnostics",
      description: "Complete engine diagnostic scan and analysis",
      category: "repair",
      basePrice: "120.00",
      estimatedTime: "1-2 hours",
      requiredDocuments: [],
    });
    await storage.createServiceType({
      name: "Tire Rotation",
      description: "Professional tire rotation and inspection",
      category: "maintenance",
      basePrice: "35.00",
      estimatedTime: "45 minutes",
      requiredDocuments: [],
    });
    await storage.createServiceType({
      name: "Custom Repair",
      description: "Custom automotive repair service",
      category: "custom",
      basePrice: "100.00",
      estimatedTime: "Varies",
      requiredDocuments: ["Photos of issue", "Description"],
    });
  }

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(validatedData.password);
      const { confirmPassword, ...userData } = validatedData;
      const userWithHashedPassword = {
        ...userData,
        password: hashedPassword,
      };

      const user = await storage.createUser(userWithHashedPassword);
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Registration failed" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await verifyPassword(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ message: "Account is inactive" });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLoginAt: new Date() });

      // Set session
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Login failed" });
    }
  });

  app.post('/api/auth/admin-login', async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }

      // Verify password
      const isValidPassword = await verifyPassword(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ message: "Account is inactive" });
      }

      // Check if user has admin role
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Administrator privileges required." });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLoginAt: new Date() });

      // Set session
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(400).json({ message: "Admin login failed" });
    }
  });

  // GET route for direct logout redirect
  app.get('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      // Redirect to landing page after logout
      res.redirect('/');
    });
  });

  // POST route for programmatic logout
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const user = req.user!;
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Service Types routes
  app.get("/api/service-types", async (req, res) => {
    try {
      const serviceTypes = await storage.getServiceTypes();
      res.json(serviceTypes);
    } catch (error) {
      console.error("Error fetching service types:", error);
      res.status(500).json({ message: "Failed to fetch service types" });
    }
  });

  app.get("/api/service-types/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const serviceType = await storage.getServiceType(id);
      if (!serviceType) {
        return res.status(404).json({ message: "Service type not found" });
      }
      res.json(serviceType);
    } catch (error) {
      console.error("Error fetching service type:", error);
      res.status(500).json({ message: "Failed to fetch service type" });
    }
  });

  app.post("/api/service-types", isAuthenticated, requireRole('admin'), async (req, res) => {
    try {
      const validatedData = insertServiceTypeSchema.parse(req.body);
      const serviceType = await storage.createServiceType(validatedData);
      res.json(serviceType);
    } catch (error) {
      console.error("Error creating service type:", error);
      res.status(400).json({ message: "Failed to create service type" });
    }
  });

  app.put("/api/service-types/:id", isAuthenticated, requireRole('admin'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertServiceTypeSchema.partial().parse(req.body);
      const serviceType = await storage.updateServiceType(id, validatedData);
      res.json(serviceType);
    } catch (error) {
      console.error("Error updating service type:", error);
      res.status(400).json({ message: "Failed to update service type" });
    }
  });

  // Service Requests routes
  app.get("/api/requests", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const requests = await storage.getServiceRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.get("/api/requests/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.getServiceRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      // Check if user can access this request
      if (req.user!.role !== 'admin' && request.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(request);
    } catch (error) {
      console.error("Error fetching request:", error);
      res.status(500).json({ message: "Failed to fetch request" });
    }
  });

  app.post("/api/requests", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertServiceRequestSchema.parse(req.body);
      const requestData = {
        ...validatedData,
        userId: req.user!.id,
        requestId: generateRequestId(),
      };
      
      const request = await storage.createServiceRequest(requestData);
      res.json(request);
    } catch (error) {
      console.error("Error creating request:", error);
      res.status(400).json({ message: "Failed to create request" });
    }
  });

  app.put("/api/requests/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.getServiceRequest(id);
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      // Check permissions
      const canUpdate = req.user!.role === 'admin' || 
        (req.user!.role === 'worker' && request.assignedWorkerId === req.user!.id) ||
        (req.user!.role === 'user' && request.userId === req.user!.id && request.status === 'pending');

      if (!canUpdate) {
        return res.status(403).json({ message: "Access denied" });
      }

      const validatedData = insertServiceRequestSchema.partial().parse(req.body);
      const updatedRequest = await storage.updateServiceRequest(id, validatedData);
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error updating request:", error);
      res.status(400).json({ message: "Failed to update request" });
    }
  });

  app.get("/api/request-stats", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const stats = await storage.getRequestStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching request stats:", error);
      res.status(500).json({ message: "Failed to fetch request stats" });
    }
  });

  // Documents routes
  app.get("/api/documents", isAuthenticated, async (req, res) => {
    try {
      const requestId = req.query.requestId ? parseInt(req.query.requestId as string) : undefined;
      const documents = await storage.getDocuments(requestId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(validatedData);
      res.json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(400).json({ message: "Failed to create document" });
    }
  });

  // Payments routes
  app.get("/api/payments", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const payments = await storage.getPayments(userId);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.post("/api/payments", isAuthenticated, requireRole('admin'), async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const paymentData = {
        ...validatedData,
        invoiceNumber: generateInvoiceNumber(),
      };
      
      const payment = await storage.createPayment(paymentData);
      res.json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(400).json({ message: "Failed to create payment" });
    }
  });

  // Messages routes
  app.get("/api/messages", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const messages = await storage.getMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const messageData = {
        ...validatedData,
        fromUserId: req.user!.id,
      };
      
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: "Failed to create message" });
    }
  });

  // User management routes (admin only)
  app.get("/api/users", isAuthenticated, requireRole('admin'), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.put("/api/users/:id", isAuthenticated, requireRole('admin'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertUserSchema.partial().parse(req.body);
      
      // Don't allow password updates through this endpoint
      delete validatedData.password;
      
      const user = await storage.updateUser(id, validatedData);
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  // Content management routes (admin only)
  app.get("/api/content/:pageName", async (req, res) => {
    try {
      const content = await storage.getContentPage(req.params.pageName);
      res.json(content || { pageName: req.params.pageName, content: {}, images: [] });
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.put("/api/content/:pageName", isAuthenticated, requireRole('admin'), async (req, res) => {
    try {
      const validatedData = insertContentPageSchema.parse(req.body);
      const contentData = {
        ...validatedData,
        lastEditedBy: req.user!.id,
      };
      
      const content = await storage.updateContentPage(req.params.pageName, contentData);
      res.json(content);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(400).json({ message: "Failed to update content" });
    }
  });

  // Workers routes
  app.get("/api/workers", isAuthenticated, requireRole('admin'), async (req, res) => {
    try {
      const workers = await storage.getWorkers();
      res.json(workers);
    } catch (error) {
      console.error("Error fetching workers:", error);
      res.status(500).json({ message: "Failed to fetch workers" });
    }
  });

  app.post("/api/workers", isAuthenticated, requireRole('admin'), async (req, res) => {
    try {
      const validatedData = insertWorkerSchema.parse(req.body);
      const worker = await storage.createWorker(validatedData);
      res.json(worker);
    } catch (error) {
      console.error("Error creating worker:", error);
      res.status(400).json({ message: "Failed to create worker" });
    }
  });

  // Notifications routes
  app.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const notifications = await storage.getNotifications(req.user!.id);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.put("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markNotificationRead(id);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error updating notification:", error);
      res.status(400).json({ message: "Failed to update notification" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}