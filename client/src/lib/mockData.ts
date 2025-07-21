// Mock data for client-side development
export const mockServiceTypes = [
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

export const mockRequests: any[] = [];
export const mockPayments: any[] = [];
export const mockMessages: any[] = [];
export const mockDocuments: any[] = [];

// Function to get mock data
export function getServiceTypes() {
  return mockServiceTypes;
}

export function getRequestStats(userId?: string) {
  let requests = mockRequests;
  if (userId) {
    requests = mockRequests.filter(request => request.userId === userId);
  }

  return {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };
}

export function getRequests(userId?: string) {
  if (userId) {
    return mockRequests.filter(request => request.userId === userId);
  }
  return mockRequests;
}

export function getPayments(userId?: string) {
  if (userId) {
    return mockPayments.filter(payment => payment.userId === userId);
  }
  return mockPayments;
}

export function getMessages(userId?: string) {
  if (userId) {
    return mockMessages.filter(message => 
      message.userId === userId || message.recipientId === userId
    );
  }
  return mockMessages;
}

export function getDocuments(userId?: string) {
  if (userId) {
    return mockDocuments.filter(doc => doc.userId === userId);
  }
  return mockDocuments;
}