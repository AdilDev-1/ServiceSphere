import {
  users,
  serviceTypes,
  serviceRequests,
  documents,
  payments,
  messages,
  notifications,
  workers,
  contentPages,
  type User,
  type InsertUser,
  type ServiceType,
  type InsertServiceType,
  type ServiceRequest,
  type InsertServiceRequest,
  type Document,
  type InsertDocument,
  type Payment,
  type InsertPayment,
  type Message,
  type InsertMessage,
  type Notification,
  type InsertNotification,
  type Worker,
  type InsertWorker,
  type ContentPage,
  type InsertContentPage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Service Type operations
  getServiceTypes(): Promise<ServiceType[]>;
  getServiceType(id: number): Promise<ServiceType | undefined>;
  createServiceType(data: InsertServiceType): Promise<ServiceType>;
  updateServiceType(id: number, data: Partial<InsertServiceType>): Promise<ServiceType>;
  deleteServiceType(id: number): Promise<void>;
  
  // Service Request operations
  getServiceRequests(userId?: number): Promise<ServiceRequest[]>;
  getServiceRequest(id: number): Promise<ServiceRequest | undefined>;
  createServiceRequest(data: InsertServiceRequest): Promise<ServiceRequest>;
  updateServiceRequest(id: number, data: Partial<InsertServiceRequest>): Promise<ServiceRequest>;
  getRequestStats(userId?: number): Promise<any>;
  
  // Document operations
  getDocuments(requestId?: number): Promise<Document[]>;
  createDocument(data: InsertDocument): Promise<Document>;
  updateDocument(id: number, data: Partial<InsertDocument>): Promise<Document>;
  deleteDocument(id: number): Promise<void>;
  
  // Payment operations
  getPayments(userId?: number): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(data: InsertPayment): Promise<Payment>;
  updatePayment(id: number, data: Partial<InsertPayment>): Promise<Payment>;
  
  // Message operations
  getMessages(userId?: number): Promise<Message[]>;
  createMessage(data: InsertMessage): Promise<Message>;
  updateMessage(id: number, data: Partial<InsertMessage>): Promise<Message>;
  
  // Notification operations
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(data: InsertNotification): Promise<Notification>;
  markNotificationRead(id: number): Promise<void>;
  
  // Worker operations
  getWorkers(): Promise<Worker[]>;
  getWorker(id: number): Promise<Worker | undefined>;
  createWorker(data: InsertWorker): Promise<Worker>;
  updateWorker(id: number, data: Partial<InsertWorker>): Promise<Worker>;
  
  // Content management operations
  getContentPage(pageName: string): Promise<ContentPage | undefined>;
  updateContentPage(pageName: string, data: Partial<InsertContentPage>): Promise<ContentPage>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Service Type operations
  async getServiceTypes(): Promise<ServiceType[]> {
    return db.select().from(serviceTypes)
      .where(eq(serviceTypes.isActive, true))
      .orderBy(serviceTypes.displayOrder, serviceTypes.name);
  }

  async getServiceType(id: number): Promise<ServiceType | undefined> {
    const [serviceType] = await db.select().from(serviceTypes).where(eq(serviceTypes.id, id));
    return serviceType;
  }

  async createServiceType(data: InsertServiceType): Promise<ServiceType> {
    const [serviceType] = await db.insert(serviceTypes).values(data).returning();
    return serviceType;
  }

  async updateServiceType(id: number, data: Partial<InsertServiceType>): Promise<ServiceType> {
    const [serviceType] = await db
      .update(serviceTypes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(serviceTypes.id, id))
      .returning();
    return serviceType;
  }

  async deleteServiceType(id: number): Promise<void> {
    await db.update(serviceTypes)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(serviceTypes.id, id));
  }

  // Service Request operations
  async getServiceRequests(userId?: number): Promise<ServiceRequest[]> {
    let query = db.select().from(serviceRequests);
    if (userId) {
      query = query.where(eq(serviceRequests.userId, userId));
    }
    return query.orderBy(desc(serviceRequests.createdAt));
  }

  async getServiceRequest(id: number): Promise<ServiceRequest | undefined> {
    const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, id));
    return request;
  }

  async createServiceRequest(data: InsertServiceRequest): Promise<ServiceRequest> {
    const [request] = await db.insert(serviceRequests).values(data).returning();
    return request;
  }

  async updateServiceRequest(id: number, data: Partial<InsertServiceRequest>): Promise<ServiceRequest> {
    const [request] = await db
      .update(serviceRequests)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(serviceRequests.id, id))
      .returning();
    return request;
  }

  async getRequestStats(userId?: number): Promise<any> {
    let baseQuery = db.select({
      status: serviceRequests.status,
      count: count()
    }).from(serviceRequests);
    
    if (userId) {
      baseQuery = baseQuery.where(eq(serviceRequests.userId, userId));
    }
    
    const stats = await baseQuery.groupBy(serviceRequests.status);
    
    const result = stats.reduce((acc, stat) => {
      acc[stat.status] = stat.count;
      return acc;
    }, {} as Record<string, number>);

    return {
      pending: result.pending || 0,
      approved: result.approved || 0,
      in_progress: result.in_progress || 0,
      completed: result.completed || 0,
      rejected: result.rejected || 0,
      total: Object.values(result).reduce((sum, count) => sum + count, 0)
    };
  }

  // Document operations
  async getDocuments(requestId?: number): Promise<Document[]> {
    let query = db.select().from(documents);
    if (requestId) {
      query = query.where(eq(documents.requestId, requestId));
    }
    return query.orderBy(desc(documents.uploadedAt));
  }

  async createDocument(data: InsertDocument): Promise<Document> {
    const [document] = await db.insert(documents).values(data).returning();
    return document;
  }

  async updateDocument(id: number, data: Partial<InsertDocument>): Promise<Document> {
    const [document] = await db
      .update(documents)
      .set(data)
      .where(eq(documents.id, id))
      .returning();
    return document;
  }

  async deleteDocument(id: number): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  // Payment operations
  async getPayments(userId?: number): Promise<Payment[]> {
    let query = db.select().from(payments);
    if (userId) {
      query = query.where(eq(payments.userId, userId));
    }
    return query.orderBy(desc(payments.createdAt));
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async createPayment(data: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(data).returning();
    return payment;
  }

  async updatePayment(id: number, data: Partial<InsertPayment>): Promise<Payment> {
    const [payment] = await db
      .update(payments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return payment;
  }

  // Message operations
  async getMessages(userId?: number): Promise<Message[]> {
    let query = db.select().from(messages);
    if (userId) {
      query = query.where(
        sql`${messages.fromUserId} = ${userId} OR ${messages.toUserId} = ${userId}`
      );
    }
    return query.orderBy(desc(messages.createdAt));
  }

  async createMessage(data: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(data).returning();
    return message;
  }

  async updateMessage(id: number, data: Partial<InsertMessage>): Promise<Message> {
    const [message] = await db
      .update(messages)
      .set(data)
      .where(eq(messages.id, id))
      .returning();
    return message;
  }

  // Notification operations
  async getNotifications(userId: number): Promise<Notification[]> {
    return db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(data: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(data).returning();
    return notification;
  }

  async markNotificationRead(id: number): Promise<void> {
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  // Worker operations
  async getWorkers(): Promise<Worker[]> {
    return db.select().from(workers)
      .where(eq(workers.isActive, true))
      .orderBy(workers.specialization);
  }

  async getWorker(id: number): Promise<Worker | undefined> {
    const [worker] = await db.select().from(workers).where(eq(workers.id, id));
    return worker;
  }

  async createWorker(data: InsertWorker): Promise<Worker> {
    const [worker] = await db.insert(workers).values(data).returning();
    return worker;
  }

  async updateWorker(id: number, data: Partial<InsertWorker>): Promise<Worker> {
    const [worker] = await db
      .update(workers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(workers.id, id))
      .returning();
    return worker;
  }

  // Content management operations
  async getContentPage(pageName: string): Promise<ContentPage | undefined> {
    const [page] = await db.select().from(contentPages)
      .where(and(eq(contentPages.pageName, pageName), eq(contentPages.isActive, true)));
    return page;
  }

  async updateContentPage(pageName: string, data: Partial<InsertContentPage>): Promise<ContentPage> {
    const [page] = await db
      .insert(contentPages)
      .values({ ...data, pageName })
      .onConflictDoUpdate({
        target: contentPages.pageName,
        set: { ...data, updatedAt: new Date() }
      })
      .returning();
    return page;
  }
}

export const storage = new DatabaseStorage();