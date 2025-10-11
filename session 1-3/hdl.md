High-Level Design (HDL)
Project Name: MediGen – AI Symptom Checker & Appointment Planner
1. Objective

Leverage GenAI and verified health data to interpret user symptoms, provide reliable guidance, and automate appointment booking — reducing misinformation and improving healthcare accessibility.

2. System Overview

MediGen is a full-stack AI-driven platform with:

LLM-based health assistant for interpreting user input.

RAG layer for pulling verified WHO/CDC information.

Function-calling system for hospital search, booking, and reporting.

API gateway connecting frontend, AI agent, and backend services.

3. Core Modules
A. Frontend (Client Layer)

Role: Collect user symptoms, display results, and manage appointment flow.

Built with React (or Next.js) and interacts via REST/GraphQL APIs.

Key Routes:

/symptom-checker – Chat interface with MediGen agent

/results – Displays probable conditions and advice

/book-appointment – Lists hospitals and available slots

/report – Downloads or emails summary report

B. Backend (Application Layer)

Handles business logic, API orchestration, and AI function calls.

Main APIs:

Endpoint	Method	Description
/api/analyze	POST	Sends symptom input to AI model for interpretation
/api/fetch-info	GET	Retrieves verified medical info from RAG layer
/api/get-hospitals	GET	Fetches nearby hospitals using maps API
/api/book-appointment	POST	Books appointment via hospital API
/api/send-report	POST	Sends consultation summary to user
C. AI Agent Layer

Prompt Engine: Formats medical context prompts.

RAG System: Retrieves verified health data (FAQs, WHO, CDC).

Function Calling:

get_nearest_hospitals(location)

book_appointment(hospital_id, time)

send_report(email)

Response Flow:

Parse user input → Query RAG → Suggest next steps → Optionally trigger booking/report.

D. Database Layer

Stores user profiles, symptom history, and booking logs.

Possible schema:

User(id, name, email, location, medical_history[])

Session(id, user_id, symptoms[], ai_response, created_at)

Appointment(id, user_id, hospital, date, status)

Secured via encryption, tokenized identifiers, and strict data access control.

4. Data Flow

User inputs symptoms on frontend.

Backend sends structured prompt to AI model.

AI interprets symptoms → queries RAG → returns verified advice.

Backend optionally calls hospital API for nearby options.

User selects slot → appointment booked → confirmation email/report sent.

5. Integrations

AI Model: OpenAI GPT (RAG + function calling).

Knowledge Base: Verified WHO/CDC data (cached locally).

External APIs: Google Maps / Healthcare Booking APIs.

Email Service: SendGrid / SMTP.

6. Security & Privacy

All data encrypted at rest and in transit.

Strict PII anonymization.

Medical disclaimer in every report (non-diagnostic AI).

Role-based access for admin/health provider endpoints.

7. Why It Wins

Real-world usability and AI responsibility.

Modular architecture for easy scaling and auditability.

Bridges symptom interpretation → verified info → actionable appointment.