export type UserRole = 'student' | 'response_officer' | 'supervisor';

export enum Priority {
  Emergency = 'Emergency',
  High = 'High',
  Normal = 'Normal',
}

export enum Category {
  Medical = 'Medical',
  Safety = 'Safety',
  Assistance = 'Assistance',
  Facilities = 'Facilities'
}

export enum RequestStatus {
  Created = 'Created',
  Acknowledged = 'Acknowledged',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Closed = 'Closed',
}

export interface AuditLogEntry {
  timestamp: number;
  actorName: string;
  actorRole: UserRole;
  action: string;
  notes?: string;
}

export interface HelpRequest {
  id: string;
  studentId: string;
  studentName: string;
  category: Category;
  priority: Priority;
  description: string;
  location: string; // Mandatory structured input
  
  // State & Governance
  status: RequestStatus;
  assignedTo?: string; // Officer Name
  escalated: boolean; // Auto-escalation flag
  
  // Time & SLA
  createdAt: number;
  updatedAt: number;
  slaDeadline: number; // Timestamp when SLA breaches
  
  // Accountability
  history: AuditLogEntry[];
  resolutionNotes?: string;
}

export interface TravelIntent {
  id: string;
  studentName: string;
  type: 'Leaving' | 'Returning';
  destination: string;
  date: string;
  time: string;
  timestamp: number;
}

export interface User {
  email: string;
  name: string;
  role: UserRole;
  id: string;
  lastRequestTime?: number; // For rate limiting
}
