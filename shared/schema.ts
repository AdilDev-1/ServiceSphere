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

// Session storage table for custom authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for automotive service platform
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  phone: varchar("phone"),
  address: text("address"),
  city: varchar("city"),
  state: varchar("state"),
  zipCode: varchar("zip_code"),
  vehicleInfo: jsonb("vehicle_info").default([]), // Array of vehicles: [{ make, model, year, vin, licensePlate }]
  role: varchar("role").default("user").notNull(), // user, admin, worker
  isActive: boolean("is_active").default(true),
  profileImageUrl: varchar("profile_image_url"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Automotive service types
export const serviceTypes = pgTable("service_types", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // maintenance, repair, inspection, custom
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  estimatedTime: varchar("estimated_time").notNull(), // e.g., "2-3 hours", "Same day", "2-3 days"
  requiredDocuments: jsonb("required_documents").default([]),
  serviceImage: varchar("service_image"),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content management for frontend
export const contentPages = pgTable("content_pages", {
  id: serial("id").primaryKey(),
  pageName: varchar("page_name").unique().notNull(), // landing, about, services, etc.
  title: varchar("title"),
  content: jsonb("content").notNull(), // Flexible content structure
  images: jsonb("images").default([]), // Array of image URLs
  isActive: boolean("is_active").default(true),
  lastEditedBy: integer("last_edited_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Worker information for CRM
export const workers = pgTable("workers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  specialization: varchar("specialization"), // brake_specialist, engine_expert, etc.
  certifications: jsonb("certifications").default([]),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  availability: jsonb("availability").default({}), // Schedule information
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  serviceTypeId: integer("service_type_id").references(() => serviceTypes.id).notNull(),
  assignedWorkerId: integer("assigned_worker_id").references(() => workers.id),
  requestId: varchar("request_id").unique().notNull(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  vehicleInfo: jsonb("vehicle_info").notNull(), // Selected vehicle details
  urgency: varchar("urgency").default("standard").notNull(), // low, standard, high, emergency
  status: varchar("status").default("pending").notNull(), // pending, approved, in_progress, completed, rejected
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  laborCost: decimal("labor_cost", { precision: 10, scale: 2 }),
  partsCost: decimal("parts_cost", { precision: 10, scale: 2 }),
  additionalServices: jsonb("additional_services").default([]),
  estimatedCompletion: timestamp("estimated_completion"),
  actualCompletion: timestamp("actual_completion"),
  workNotes: text("work_notes"), // Worker notes
  adminNotes: text("admin_notes"),
  rejectionReason: text("rejection_reason"),
  customerNotes: text("customer_notes"), // Customer feedback/requirements
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  completedAt: timestamp("completed_at"),
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
  userId: integer("user_id").references(() => users.id).notNull(),
  invoiceNumber: varchar("invoice_number").unique().notNull(),
  paymentId: varchar("payment_id").unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD").notNull(),
  paymentMethod: varchar("payment_method").notNull(), // paypal, credit_card, cash, check
  paymentStatus: varchar("payment_status").default("pending").notNull(), // pending, paid, failed, refunded, partial
  paypalOrderId: varchar("paypal_order_id"),
  transactionId: varchar("transaction_id"),
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }).default("0"),
  refundedAmount: decimal("refunded_amount", { precision: 10, scale: 2 }).default("0"),
  paymentLink: varchar("payment_link"), // Generated PayPal payment link
  dueDate: timestamp("due_date"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => serviceRequests.id),
  fromUserId: integer("from_user_id").references(() => users.id).notNull(),
  toUserId: integer("to_user_id").references(() => users.id),
  subject: varchar("subject"),
  content: text("content").notNull(),
  attachments: jsonb("attachments").default([]), // File attachments
  isRead: boolean("is_read").default(false),
  messageType: varchar("message_type").default("general").notNull(), // general, notification, update, invoice
  priority: varchar("priority").default("normal").notNull(), // low, normal, high, urgent
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications system
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(), // info, success, warning, error, payment, status_update
  relatedId: integer("related_id"), // Can reference request, payment, etc.
  relatedType: varchar("related_type"), // request, payment, message
  isRead: boolean("is_read").default(false),
  actionUrl: varchar("action_url"), // Optional link for action
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  serviceRequests: many(serviceRequests),
  payments: many(payments),
  worker: one(workers),
  notifications: many(notifications),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
  editedContent: many(contentPages),
}));

export const workersRelations = relations(workers, ({ one, many }) => ({
  user: one(users, {
    fields: [workers.userId],
    references: [users.id],
  }),
  assignedRequests: many(serviceRequests),
}));

export const serviceTypesRelations = relations(serviceTypes, ({ many }) => ({
  serviceRequests: many(serviceRequests),
}));

export const contentPagesRelations = relations(contentPages, ({ one }) => ({
  lastEditor: one(users, {
    fields: [contentPages.lastEditedBy],
    references: [users.id],
  }),
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
  assignedWorker: one(workers, {
    fields: [serviceRequests.assignedWorkerId],
    references: [workers.id],
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

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWorkerSchema = createInsertSchema(workers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertServiceTypeSchema = createInsertSchema(serviceTypes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertServiceRequestSchema = createInsertSchema(serviceRequests).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, uploadedAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertContentPageSchema = createInsertSchema(contentPages).omit({ id: true, createdAt: true, updatedAt: true });

// Auth schemas
export const registerUserSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWorker = z.infer<typeof insertWorkerSchema>;
export type Worker = typeof workers.$inferSelect;
export type InsertServiceType = z.infer<typeof insertServiceTypeSchema>;
export type ServiceType = typeof serviceTypes.$inferSelect;
export type InsertContentPage = z.infer<typeof insertContentPageSchema>;
export type ContentPage = typeof contentPages.$inferSelect;
export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;
export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
