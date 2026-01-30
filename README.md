# CampusAssist

CampusAssist is a full-stack web application designed to improve how campus
emergencies and assistance requests are handled by introducing clear
accountability, response timelines, and auditability.

This project was built as part of HackOverflow – IIT Goa.

---

## Problem Statement

On most campuses, emergencies and help requests are handled through WhatsApp,
groups, phone calls, or informal coordination. These methods fail to clearly
answer:

- Who is responsible right now?
- By when must they respond?
- What happens if there is no response?

This lack of accountability often causes delays during the most critical
initial response period.

---

## Solution Overview

CampusAssist addresses this problem by providing:

- Governed emergency declaration
- Role-based responsibility (Student, Response Officer, Supervisor)
- Time-bound acknowledgment using SLA rules
- Escalation when response deadlines are missed
- Immutable audit trail for post-incident review

The system focuses on clarity and responsibility rather than feature overload.

---

## Core Features

- Emergency and assistance request management
- Role-based dashboards
- SLA timers for emergency acknowledgment
- Escalation visibility
- Audit trail of all incident actions
- Contextual (secondary) travel information

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite

### Backend
- Node.js
- Express

### Architecture
- Full-stack web application
- REST-based communication (mock APIs for hackathon scope)

---

## How to Run the Project Locally

### Backend
cd backend
npm install
npm start

Backend runs at:
http://localhost:5000

---

### Frontend
cd frontend
npm install
npm run dev

Frontend runs at:
http://localhost:5173

---

## Hackathon Details
- Event: HackOverflow – IIT Goa
- Duration: 25 Jan – 1 Feb 2026
- Mode: Online
- Category: Product-focused hackathon
- Team Size: 1–3 members

---

## Future Improvements
- Mobile emergency trigger
- Integration with campus security and medical services
- Enhanced analytics for response performance
