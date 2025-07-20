import { customAlphabet } from 'nanoid';

// Generate a unique request ID
export function generateRequestId(): string {
  const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
  return `REQ-${nanoid()}`;
}

// Generate a unique invoice number
export function generateInvoiceNumber(): string {
  const nanoid = customAlphabet('1234567890', 6);
  return `INV-${Date.now().toString().slice(-8)}-${nanoid()}`;
}

// Format currency
export function formatCurrency(amount: number | string, currency: string = 'USD'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(num);
}

// Format date
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

// Format datetime
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

// Get status color for UI
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'approved':
    case 'paid':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'in_progress':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'completed':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'rejected':
    case 'failed':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

// Get urgency color for UI
export function getUrgencyColor(urgency: string): string {
  switch (urgency.toLowerCase()) {
    case 'low':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    case 'standard':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'emergency':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (basic US format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
}

// Generate avatar initials
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// Calculate service completion percentage
export function calculateProgress(status: string): number {
  switch (status.toLowerCase()) {
    case 'pending':
      return 25;
    case 'approved':
      return 50;
    case 'in_progress':
      return 75;
    case 'completed':
      return 100;
    case 'rejected':
      return 0;
    default:
      return 0;
  }
}