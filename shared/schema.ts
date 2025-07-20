import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceTypes = pgTable("service_types", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  processingTime: varchar("processing_time").notNull(),
  requiredDocuments: jsonb("required_documents").default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  serviceTypeId: integer("service_type_id").references(() => serviceTypes.id).notNull(),
  requestId: varchar("request_id").unique().notNull(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  priority: varchar("priority").default("standard").notNull(),
  status: varchar("status").default("pending").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  additionalServices: jsonb("additional_services").default([]),
  adminNotes: text("admin_notes"),
  rejectionReason: text("rejection_reason"),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => serviceRequests.id).notNull(),
  fileName: varchar("file_name").notNull(),
  originalName: varchar("original_name").notNull(),
  filePath: varchar("file_path").notNull(),
  fileType: varchar("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  documentType: varchar("document_type").notNull(),
  status: varchar("status").default("pending").notNull(),
  verificationNotes: text("verification_notes"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => serviceRequests.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  paymentId: varchar("payment_id").unique().notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD").notNull(),
  paymentMethod: varchar("payment_method").notNull(),
  paymentStatus: varchar("payment_status").default("pending").notNull(),
  transactionId: varchar("transaction_id"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => serviceRequests.id),
  fromUserId: varchar("from_user_id").references(() => users.id).notNull(),
  toUserId: varchar("to_user_id").references(() => users.id),
  subject: varchar("subject"),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  messageType: varchar("message_type").default("general").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  serviceRequests: many(serviceRequests),
  payments: many(payments),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
}));

export const serviceTypesRelations = relations(serviceTypes, ({ many }) => ({
  serviceRequests: many(serviceRequests),
}));

export const serviceRequestsRelations = relations(serviceRequests, ({ one, many }) => ({
  user: one(users, {
    fields: [serviceRequests.userId],
    references: [users.id],
  }),
  serviceType: one(serviceTypes, {
    fields: [serviceRequests.serviceTypeId],
    references: [serviceTypes.id],
  }),
  documents: many(documents),
  payments: many(payments),
  messages: many(messages),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  serviceRequest: one(serviceRequests, {
    fields: [documents.requestId],
    references: [serviceRequests.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  serviceRequest: one(serviceRequests, {
    fields: [payments.requestId],
    references: [serviceRequests.id],
  }),
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  serviceRequest: one(serviceRequests, {
    fields: [messages.requestId],
    references: [serviceRequests.id],
  }),
  fromUser: one(users, {
    fields: [messages.fromUserId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  toUser: one(users, {
    fields: [messages.toUserId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertServiceTypeSchema = createInsertSchema(serviceTypes);
export const insertServiceRequestSchema = createInsertSchema(serviceRequests);
export const insertDocumentSchema = createInsertSchema(documents);
export const insertPaymentSchema = createInsertSchema(payments);
export const insertMessageSchema = createInsertSchema(messages);

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertServiceType = z.infer<typeof insertServiceTypeSchema>;
export type ServiceType = typeof serviceTypes.$inferSelect;
export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;
export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
