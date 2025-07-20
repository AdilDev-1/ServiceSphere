# ServiceFlow - Service Request Management Platform

## Overview

ServiceFlow is a full-stack web application that enables users to submit service requests through structured forms, upload documents, and make payments after approval. The platform features separate user and admin interfaces with comprehensive request management, document handling, and payment processing capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

ServiceFlow follows a monorepo architecture with clear separation between frontend, backend, and shared components:

- **Frontend**: React TypeScript SPA with Vite build system
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth integration
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui design system with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with passport.js integration
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with proper error handling

### Database Schema
The application uses several core entities:
- **Users**: Authentication and profile information
- **Service Types**: Configurable service offerings with pricing
- **Service Requests**: User submissions with status tracking
- **Documents**: File attachments linked to requests
- **Payments**: Transaction records for approved requests
- **Messages**: Communication between users and admins

### User Interface Structure
- **User Portal**: Dashboard, request submission, status tracking, payments, support
- **Admin Panel**: Request management, document review, service configuration, user management
- **Responsive Design**: Mobile-first approach with Tailwind responsive utilities

## Data Flow

1. **User Registration/Authentication**: Handled by Replit Auth system
2. **Request Submission**: Multi-step wizard with form validation and document upload
3. **Admin Review**: Centralized dashboard for request approval/rejection
4. **Payment Processing**: Secure payment interface for approved requests
5. **Status Tracking**: Real-time updates throughout the request lifecycle

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: Accessible UI component primitives
- **react-hook-form**: Form handling with validation
- **zod**: Runtime type validation
- **tailwindcss**: Utility-first CSS framework

### Authentication & Security
- **openid-client**: OpenID Connect integration for Replit Auth
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **typescript**: Static type checking
- **vite**: Modern build tool and dev server
- **tsx**: TypeScript execution for development

## Deployment Strategy

The application is designed for deployment on Replit with the following configuration:

### Development Mode
- Vite dev server for frontend with HMR
- tsx for backend TypeScript execution
- Automatic database migrations with Drizzle

### Production Build
- Frontend: Vite build to static assets
- Backend: esbuild bundle for Node.js deployment
- Single-process deployment serving both API and static assets

### Environment Requirements
- **DATABASE_URL**: PostgreSQL connection string (Neon Database)
- **SESSION_SECRET**: Session encryption key
- **REPL_ID**: Replit environment identifier
- **ISSUER_URL**: OpenID Connect issuer (Replit Auth)

### Database Management
- **Migrations**: Automatic schema migrations via Drizzle Kit
- **Seeding**: Default service types created on startup
- **Sessions**: Persistent session storage in PostgreSQL

The architecture prioritizes type safety, developer experience, and scalability while maintaining simplicity for deployment and maintenance.