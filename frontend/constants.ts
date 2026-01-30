import { Priority, Category, RequestStatus, HelpRequest, TravelIntent, UserRole } from './types';

// SLA Definitions in Milliseconds
export const SLA_CONFIG = {
  [Priority.Emergency]: 60 * 60 * 1000, // 1 Hour
  [Priority.High]: 4 * 60 * 60 * 1000,  // 4 Hours
  [Priority.Normal]: 24 * 60 * 60 * 1000 // 24 Hours
};

const MOCK_HISTORY = [
  {
    timestamp: Date.now() - 100000,
    actorName: 'Anu',
    actorRole: 'student' as UserRole,
    action: 'CREATED',
    notes: 'Initial submission'
  }
];

export const INITIAL_REQUESTS: HelpRequest[] = [
  {
    id: 'REQ-2023-001',
    studentId: 's1',
    studentName: 'Anu',
    category: Category.Medical,
    priority: Priority.Emergency,
    location: 'Block A, 2nd Floor, Room 204',
    description: 'Severe allergic reaction, need ambulance.',
    status: RequestStatus.Created, // Critical state
    escalated: false,
    createdAt: Date.now() - 100000,
    updatedAt: Date.now() - 100000,
    slaDeadline: Date.now() + SLA_CONFIG[Priority.Emergency] - 100000,
    history: MOCK_HISTORY,
  },
  {
    id: 'REQ-2023-002',
    studentId: 's2',
    studentName: 'Ravi',
    category: Category.Safety,
    priority: Priority.High,
    location: 'South Gate Parking Lot',
    description: 'Suspicious activity near the south gate.',
    status: RequestStatus.Acknowledged,
    escalated: false,
    assignedTo: 'Officer John',
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3500000,
    slaDeadline: Date.now() + SLA_CONFIG[Priority.High] - 3600000,
    history: [
      { timestamp: Date.now() - 3600000, actorName: 'Ravi', actorRole: 'student', action: 'CREATED' },
      { timestamp: Date.now() - 3500000, actorName: 'Officer John', actorRole: 'response_officer', action: 'TRANSITION: Created -> Acknowledged' }
    ]
  },
  {
    id: 'REQ-2023-003',
    studentId: 's3',
    studentName: 'Meena',
    category: Category.Assistance,
    priority: Priority.Normal,
    location: 'Central Library, Desk 5',
    description: 'Lost ID card in the library.',
    status: RequestStatus.Resolved,
    escalated: false,
    assignedTo: 'Officer Sarah',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 40000000,
    slaDeadline: Date.now() + SLA_CONFIG[Priority.Normal] - 86400000,
    resolutionNotes: 'ID card found and deposited at security desk.',
    history: [
      { timestamp: Date.now() - 86400000, actorName: 'Meena', actorRole: 'student', action: 'CREATED' },
      { timestamp: Date.now() - 80000000, actorName: 'Officer Sarah', actorRole: 'response_officer', action: 'TRANSITION: Created -> Acknowledged' },
      { timestamp: Date.now() - 40000000, actorName: 'Officer Sarah', actorRole: 'response_officer', action: 'TRANSITION: In Progress -> Resolved', notes: 'Found at desk' }
    ]
  },
];

export const INITIAL_TRAVEL_INTENTS: TravelIntent[] = [
  {
    id: '101',
    studentName: 'Rahul',
    type: 'Leaving',
    destination: 'Chennai',
    date: '2023-10-25',
    time: '18:00',
    timestamp: Date.now(),
  },
  {
    id: '102',
    studentName: 'Anu',
    type: 'Leaving',
    destination: 'City Center',
    date: '2023-10-26',
    time: '09:00',
    timestamp: Date.now(),
  },
];
