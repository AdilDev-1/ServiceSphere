import type { Express } from "express";
import { createServer, type Server } from "http";
import cookieParser from 'cookie-parser';
import { authenticateUser, createSession, getSession, destroySession, isAuthenticated, isAdmin } from "./auth-memory";

// Mock data for service types
const mockServiceTypes = [
  {
    id: 1,
    name: "Oil Change Service",
    description: "Complete oil and filter change service",
    category: "maintenance",
    basePrice: "45.00",
    estimatedTime: "30 minutes",
    requiredDocuments: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Brake Inspection",
    description: "Comprehensive brake system inspection and service",
    category: "inspection",
    basePrice: "85.00",
    estimatedTime: "1 hour",
    requiredDocuments: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Engine Diagnostics",
    description: "Complete engine diagnostic scan and analysis",
    category: "repair",
    basePrice: "120.00",
    estimatedTime: "1-2 hours",
    requiredDocuments: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Tire Rotation",
    description: "Professional tire rotation and inspection",
    category: "maintenance",
    basePrice: "35.00",
    estimatedTime: "45 minutes",
    requiredDocuments: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock data stores
let mockRequests: any[] = [];
let mockPayments: any[] = [];
let mockMessages: any[] = [];
let mockDocuments: any[] = [];

export async function registerRoutes(app: Express): Promise<Server> {
  // Add cookie parser middleware
  app.use(cookieParser());

  // Authentication routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (user.role !== 'user') {
        return res.status(403).json({ message: 'Access denied. User credentials required.' });
      }

      const sessionId = createSession(user);
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json(user);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/auth/admin-login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
      }

      const sessionId = createSession(user);
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json(user);
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    const sessionId = req.cookies?.sessionId;
    if (sessionId) {
      destroySession(sessionId);
      res.clearCookie('sessionId');
    }
    res.json({ message: 'Logged out successfully' });
  });

  app.get('/api/auth/user', isAuthenticated, (req, res) => {
    res.json((req as any).user);
  });

  // Service types routes
  app.get('/api/service-types', (req, res) => {
    res.json(mockServiceTypes);
  });

  app.post('/api/service-types', isAdmin, async (req, res) => {
    try {
      const newServiceType = {
        id: mockServiceTypes.length + 1,
        ...req.body,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockServiceTypes.push(newServiceType);
      res.status(201).json(newServiceType);
    } catch (error) {
      console.error('Error creating service type:', error);
      res.status(500).json({ message: 'Failed to create service type' });
    }
  });

  // Requests routes
  app.get('/api/requests', isAuthenticated, (req, res) => {
    const user = (req as any).user;
    if (user.role === 'admin') {
      res.json(mockRequests);
    } else {
      const userRequests = mockRequests.filter(request => request.userId === user.id);
      res.json(userRequests);
    }
  });

  app.post('/api/requests', isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      const newRequest = {
        id: mockRequests.length + 1,
        userId: user.id,
        ...req.body,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockRequests.push(newRequest);
      res.status(201).json(newRequest);
    } catch (error) {
      console.error('Error creating request:', error);
      res.status(500).json({ message: 'Failed to create request' });
    }
  });

  app.get('/api/request-stats', isAuthenticated, (req, res) => {
    const user = (req as any).user;
    let requests = mockRequests;
    
    if (user.role !== 'admin') {
      requests = mockRequests.filter(request => request.userId === user.id);
    }

    const stats = {
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      in_progress: requests.filter(r => r.status === 'in_progress').length,
      completed: requests.filter(r => r.status === 'completed').length,
      rejected: requests.filter(r => r.status === 'rejected').length
    };

    res.json(stats);
  });

  // Payments routes
  app.get('/api/payments', isAuthenticated, (req, res) => {
    const user = (req as any).user;
    if (user.role === 'admin') {
      res.json(mockPayments);
    } else {
      const userPayments = mockPayments.filter(payment => payment.userId === user.id);
      res.json(userPayments);
    }
  });

  app.post('/api/payments', isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      const newPayment = {
        id: mockPayments.length + 1,
        userId: user.id,
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockPayments.push(newPayment);
      res.status(201).json(newPayment);
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ message: 'Failed to create payment' });
    }
  });

  // Messages routes
  app.get('/api/messages', isAuthenticated, (req, res) => {
    const user = (req as any).user;
    if (user.role === 'admin') {
      res.json(mockMessages);
    } else {
      const userMessages = mockMessages.filter(message => 
        message.userId === user.id || message.recipientId === user.id
      );
      res.json(userMessages);
    }
  });

  app.post('/api/messages', isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      const newMessage = {
        id: mockMessages.length + 1,
        senderId: user.id,
        ...req.body,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      mockMessages.push(newMessage);
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ message: 'Failed to create message' });
    }
  });

  // Documents routes
  app.get('/api/documents', isAuthenticated, (req, res) => {
    const user = (req as any).user;
    if (user.role === 'admin') {
      res.json(mockDocuments);
    } else {
      const userDocuments = mockDocuments.filter(doc => doc.userId === user.id);
      res.json(userDocuments);
    }
  });

  app.post('/api/documents', isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      const newDocument = {
        id: mockDocuments.length + 1,
        userId: user.id,
        ...req.body,
        uploadedAt: new Date().toISOString()
      };
      mockDocuments.push(newDocument);
      res.status(201).json(newDocument);
    } catch (error) {
      console.error('Error uploading document:', error);
      res.status(500).json({ message: 'Failed to upload document' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}