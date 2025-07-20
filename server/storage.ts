import {
  users,
  serviceTypes,
  serviceRequests,
  documents,
  payments,
  messages,
  type User,
  type UpsertUser,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, or, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Service Type operations
  getServiceTypes(): Promise<ServiceType[]>;
  getServiceType(id: number): Promise<ServiceType | undefined>;
  createServiceType(serviceType: InsertServiceType): Promise<ServiceType>;
  updateServiceType(id: number, serviceType: Partial<InsertServiceType>): Promise<ServiceType>;

  // Service Request operations
  getServiceRequests(userId?: string): Promise<ServiceRequest[]>;
  getServiceRequest(id: number): Promise<ServiceRequest | undefined>;
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  updateServiceRequest(id: number, request: Partial<InsertServiceRequest>): Promise<ServiceRequest>;
  getRequestStats(userId?: string): Promise<{ pending: number; approved: number; rejected: number; total: number }>;

  // Document operations
  getDocuments(requestId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document>;

  // Payment operations
  getPayments(userId?: string): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment>;

  // Message operations
  getMessages(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Service Type operations
  async getServiceTypes(): Promise<ServiceType[]> {
    return await db
      .select()
      .from(serviceTypes)
      .where(eq(serviceTypes.isActive, true))
      .orderBy(serviceTypes.name);
  }

  async getServiceType(id: number): Promise<ServiceType | undefined> {
    const [serviceType] = await db
      .select()
      .from(serviceTypes)
      .where(eq(serviceTypes.id, id));
    return serviceType;
  }

  async createServiceType(serviceType: InsertServiceType): Promise<ServiceType> {
    const [created] = await db
      .insert(serviceTypes)
      .values(serviceType)
      .returning();
    return created;
  }

  async updateServiceType(id: number, serviceType: Partial<InsertServiceType>): Promise<ServiceType> {
    const [updated] = await db
      .update(serviceTypes)
      .set(serviceType)
      .where(eq(serviceTypes.id, id))
      .returning();
    return updated;
  }

  // Service Request operations
  async getServiceRequests(userId?: string): Promise<ServiceRequest[]> {
    const query = db
      .select()
      .from(serviceRequests)
      .orderBy(desc(serviceRequests.createdAt));

    if (userId) {
      return await query.where(eq(serviceRequests.userId, userId));
    }
    return await query;
  }

  async getServiceRequest(id: number): Promise<ServiceRequest | undefined> {
    const [request] = await db
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.id, id));
    return request;
  }

  async createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest> {
    const [created] = await db
      .insert(serviceRequests)
      .values(request)
      .returning();
    return created;
  }

  async updateServiceRequest(id: number, request: Partial<InsertServiceRequest>): Promise<ServiceRequest> {
    const [updated] = await db
      .update(serviceRequests)
      .set({
        ...request,
        updatedAt: new Date(),
      })
      .where(eq(serviceRequests.id, id))
      .returning();
    return updated;
  }

  async getRequestStats(userId?: string): Promise<{ pending: number; approved: number; rejected: number; total: number }> {
    let query = db
      .select({
        status: serviceRequests.status,
        count: count(),
      })
      .from(serviceRequests);

    if (userId) {
      query = query.where(eq(serviceRequests.userId, userId));
    }

    const results = await query.groupBy(serviceRequests.status);

    const stats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0,
    };

    results.forEach((result) => {
      const statusCount = Number(result.count);
      stats.total += statusCount;
      
      if (result.status === "pending") {
        stats.pending = statusCount;
      } else if (result.status === "approved") {
        stats.approved = statusCount;
      } else if (result.status === "rejected") {
        stats.rejected = statusCount;
      }
    });

    return stats;
  }

  // Document operations
  async getDocuments(requestId: number): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.requestId, requestId))
      .orderBy(documents.uploadedAt);
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const [created] = await db
      .insert(documents)
      .values(document)
      .returning();
    return created;
  }

  async updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document> {
    const [updated] = await db
      .update(documents)
      .set(document)
      .where(eq(documents.id, id))
      .returning();
    return updated;
  }

  // Payment operations
  async getPayments(userId?: string): Promise<Payment[]> {
    const query = db
      .select()
      .from(payments)
      .orderBy(desc(payments.createdAt));

    if (userId) {
      return await query.where(eq(payments.userId, userId));
    }
    return await query;
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, id));
    return payment;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [created] = await db
      .insert(payments)
      .values(payment)
      .returning();
    return created;
  }

  async updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment> {
    const [updated] = await db
      .update(payments)
      .set(payment)
      .where(eq(payments.id, id))
      .returning();
    return updated;
  }

  // Message operations
  async getMessages(userId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          eq(messages.fromUserId, userId),
          eq(messages.toUserId, userId)
        )
      )
      .orderBy(desc(messages.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [created] = await db
      .insert(messages)
      .values(message)
      .returning();
    return created;
  }

  async markMessageAsRead(id: number): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id));
  }
}

export const storage = new DatabaseStorage();
