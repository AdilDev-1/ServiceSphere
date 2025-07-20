import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertServiceRequestSchema, insertDocumentSchema, insertPaymentSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Seed default service types
  const existingTypes = await storage.getServiceTypes();
  if (existingTypes.length === 0) {
    await storage.createServiceType({
      name: "Business License Application",
      description: "Apply for a business license",
      basePrice: "200.00",
      processingTime: "5-7 business days",
      requiredDocuments: ["Business Plan", "Identity Document", "Address Proof"],
    });
    await storage.createServiceType({
      name: "Permit Application",
      description: "Apply for various permits",
      basePrice: "150.00",
      processingTime: "3-5 business days",
      requiredDocuments: ["Application Form", "Technical Documents"],
    });
    await storage.createServiceType({
      name: "Document Verification",
      description: "Verify official documents",
      basePrice: "75.00",
      processingTime: "1-2 business days",
      requiredDocuments: ["Original Documents", "Copies"],
    });
  }

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
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

  // Service Requests routes
  app.get("/api/requests", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const isAdmin = req.user.claims.role === "admin";
      
      const requests = await storage.getServiceRequests(isAdmin ? undefined : userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.get("/api/requests/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const isAdmin = req.user.claims.role === "admin";
      
      const request = await storage.getServiceRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      if (!isAdmin && request.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(request);
    } catch (error) {
      console.error("Error fetching request:", error);
      res.status(500).json({ message: "Failed to fetch request" });
    }
  });

  app.post("/api/requests", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requestData = insertServiceRequestSchema.parse({
        ...req.body,
        userId,
        requestId: `REQ-${Date.now()}`,
      });
      
      const request = await storage.createServiceRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating request:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create request" });
    }
  });

  app.patch("/api/requests/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const isAdmin = req.user.claims.role === "admin";
      
      const request = await storage.getServiceRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      if (!isAdmin && request.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updateData = { ...req.body };
      if (updateData.status === "approved") {
        updateData.approvedAt = new Date();
      } else if (updateData.status === "rejected") {
        updateData.rejectedAt = new Date();
      }
      
      const updatedRequest = await storage.updateServiceRequest(id, updateData);
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error updating request:", error);
      res.status(500).json({ message: "Failed to update request" });
    }
  });

  // Request stats
  app.get("/api/request-stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const isAdmin = req.user.claims.role === "admin";
      
      const stats = await storage.getRequestStats(isAdmin ? undefined : userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching request stats:", error);
      res.status(500).json({ message: "Failed to fetch request stats" });
    }
  });

  // Documents routes
  app.get("/api/requests/:id/documents", isAuthenticated, async (req: any, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const isAdmin = req.user.claims.role === "admin";
      
      const request = await storage.getServiceRequest(requestId);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      if (!isAdmin && request.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const documents = await storage.getDocuments(requestId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/requests/:id/documents", isAuthenticated, async (req: any, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const request = await storage.getServiceRequest(requestId);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      if (request.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const documentData = insertDocumentSchema.parse({
        ...req.body,
        requestId,
      });
      
      const document = await storage.createDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  // Payments routes
  app.get("/api/payments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const isAdmin = req.user.claims.role === "admin";
      
      const payments = await storage.getPayments(isAdmin ? undefined : userId);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.post("/api/payments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const paymentData = insertPaymentSchema.parse({
        ...req.body,
        userId,
        paymentId: `PAY-${Date.now()}`,
      });
      
      const payment = await storage.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  // Messages routes
  app.get("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        fromUserId: userId,
      });
      
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
