import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, HelpRequest, TravelIntent, Priority, RequestStatus, AuditLogEntry } from '../types';
import { INITIAL_REQUESTS, INITIAL_TRAVEL_INTENTS, SLA_CONFIG } from '../constants';

interface AppContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  requests: HelpRequest[];
  createRequest: (data: Partial<HelpRequest>) => void;
  transitionRequest: (id: string, newStatus: RequestStatus, notes?: string) => void;
  travelIntents: TravelIntent[];
  addTravelIntent: (intent: TravelIntent) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<HelpRequest[]>(INITIAL_REQUESTS);
  const [travelIntents, setTravelIntents] = useState<TravelIntent[]>(INITIAL_TRAVEL_INTENTS);

  // SIMULATED RATE LIMITING: 5 Minutes between Emergency declarations
  const EMERGENCY_COOLDOWN_MS = 5 * 60 * 1000;

  const login = (email: string) => {
    if (email.includes('admin')) {
      setUser({ id: 'u_admin', email, name: 'Response Officer 1', role: 'response_officer' });
    } else if (email.includes('super')) {
      setUser({ id: 'u_super', email, name: 'Escalation Supervisor', role: 'supervisor' });
    } else {
      setUser({ id: 'u_stud', email, name: 'Student User', role: 'student' });
    }
  };

  const logout = () => setUser(null);

  // SLA MONITOR: Check for breaches periodically (Simulating backend cron)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setRequests(currentRequests => 
        currentRequests.map(req => {
          if (
            req.status !== RequestStatus.Resolved && 
            req.status !== RequestStatus.Closed && 
            !req.escalated && 
            now > req.slaDeadline
          ) {
            // AUTO-ESCALATE
            return { ...req, escalated: true };
          }
          return req;
        })
      );
    }, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const createRequest = (data: Partial<HelpRequest>) => {
    if (!user) return;

    // RATE LIMIT CHECK
    if (data.priority === Priority.Emergency && user.lastRequestTime) {
      const timeSinceLast = Date.now() - user.lastRequestTime;
      if (timeSinceLast < EMERGENCY_COOLDOWN_MS) {
        alert(`RATE LIMIT EXCEEDED: You cannot declare another emergency for ${Math.ceil((EMERGENCY_COOLDOWN_MS - timeSinceLast) / 60000)} minutes. Contact Dispatch by phone if this is critical.`);
        return;
      }
    }
    
    const now = Date.now();
    const priority = data.priority || Priority.Normal;
    const slaDeadline = now + (SLA_CONFIG[priority] || SLA_CONFIG[Priority.Normal]);

    const newRequest: HelpRequest = {
      id: `REQ-${Math.floor(Math.random() * 10000)}`,
      studentId: user.id,
      studentName: user.name,
      category: data.category!,
      priority: priority,
      description: data.description || '',
      location: data.location || 'Unknown Location',
      status: RequestStatus.Created,
      escalated: false,
      createdAt: now,
      updatedAt: now,
      slaDeadline: slaDeadline,
      history: [{
        timestamp: now,
        actorName: user.name,
        actorRole: user.role,
        action: 'CREATED',
        notes: 'Initial submission'
      }]
    };

    setRequests(prev => [newRequest, ...prev]);
    
    // Update User Rate Limit
    setUser(prev => prev ? { ...prev, lastRequestTime: now } : null);
  };

  const transitionRequest = (id: string, newStatus: RequestStatus, notes?: string) => {
    if (!user) throw new Error("Unauthorized");

    setRequests(prev => prev.map(req => {
      if (req.id !== id) return req;

      // 1. Permission Checks (Strict Governance)
      if (req.priority === Priority.Emergency && newStatus === RequestStatus.Closed) {
        if (user.role !== 'supervisor') {
           alert("GOVERNANCE VIOLATION: Only Supervisors can close Emergency tickets.");
           return req;
        }
      }

      // 2. State Transition Validation
      if ((newStatus === RequestStatus.Resolved || newStatus === RequestStatus.Closed) && !notes) {
        alert("COMPLIANCE ERROR: Resolution notes are mandatory for this state transition.");
        return req;
      }

      // 3. Update Object with Audit Trail
      const auditEntry: AuditLogEntry = {
        timestamp: Date.now(),
        actorName: user.name,
        actorRole: user.role,
        action: `TRANSITION: ${req.status} -> ${newStatus}`,
        notes: notes || ''
      };

      return {
        ...req,
        status: newStatus,
        updatedAt: Date.now(),
        assignedTo: (newStatus === RequestStatus.Acknowledged && !req.assignedTo) ? user.name : req.assignedTo,
        resolutionNotes: newStatus === RequestStatus.Resolved ? notes : req.resolutionNotes,
        history: [auditEntry, ...req.history]
      };
    }));
  };

  const addTravelIntent = (intent: TravelIntent) => {
    setTravelIntents(prev => [intent, ...prev]);
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      login, 
      logout, 
      requests, 
      createRequest, 
      transitionRequest, 
      travelIntents, 
      addTravelIntent 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
