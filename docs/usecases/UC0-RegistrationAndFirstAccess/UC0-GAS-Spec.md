# 🧠 Claude Prompt — OK Colf OTP System (Free Edition)

## 🎯 Context

You are acting as a **senior backend engineer and technical writer** assisting in the implementation of a lightweight email verification system for the project **OK Colf**, an Italian PWA service.

The system must be implemented **entirely with Google Apps Script + Gmail + Google Sheets**, at **zero cost**, without external APIs or backend infrastructure.

You will generate:

1. Changes to the front end form to support the process, integrate the OTP and give the privacy notice
2. Changes to the OTP mock code to implement the real verification
3. Test code to run from the browser to check the correctness
4. **Google Apps Script code** (complete, functional, and well-commented)
5. **Google Sheets schema** (two sheets, with field names and formats)
6. **Instructions for deployment and configuration**

All comments and documentation should be in **English**, but all user-facing text (email subjects, bodies, and error messages) must be in **Italian**.

---

## 📘 Specification Summary (from the approved design)

- Frontend: a PWA sends HTTPS POST requests to two endpoints:
  - `/send_otp` — generate and send a 6-digit OTP
  - `/verify_otp` — verify the OTP and mark the email as verified
- Backend: Google Apps Script Web App, deployed with “Anyone, even anonymous” access.
- Storage: Google Sheet with two tabs:
  - `otp_log` → temporary OTPs
  - `contacts` → verified users
- Email: sent via `GmailApp.sendEmail()`, from `noreply@okcolf.it`
- OTP TTL: 5 minutes
- Rate limiting: handled client-side (the script may log IPs for anti-flood analysis)
- CORS: must only allow `okcolf.it`, `alucab.github.io`, and `localhost:5173`
- Privacy disclaimer must be shown on the frontend; no sensitive data beyond email is stored.

---

## 🧩 Required Deliverables

### 1️⃣ Google Apps Script code

Produce a **complete script** implementing both endpoints as part of a Web App:

- `doPost(e)` entry point (parse JSON, route based on path)
- `sendOtp(email)` function:
  - Generate a random 6-digit OTP
  - Compute expiration time (+5 minutes)
  - Store in Sheet `otp_log` with fields:
    ```
    email, otp, created_at, expires_at, verified, ip
    ```
  - Send email using GmailApp:
    - From: noreply@okcolf.it
    - Subject: “Il tuo codice OTP OK Colf”
    - Body: friendly message in Italian with the OTP and validity period
  - Return JSON `{ "status": "ok" }`

- `verifyOtp(email, otp)` function:
  - Search for the matching OTP in `otp_log`
  - Check if not expired and not already verified
  - If valid:
    - Mark the OTP row as verified
    - Add or update record in `contacts`:
      ```
      email, verified, verified_at, source
      ```
    - Return `{ "success": true }`
  - If invalid or expired, return `{ "success": false, "error": "invalid_otp" }`

- Implement JSON responses and proper error handling.
- Implement simple CORS header support:
  - Access-Control-Allow-Origin: https://okcolf.it
  - Access-Control-Allow-Methods: POST
  - Access-Control-Allow-Headers: Content-Type
  - (plus localhost and GitHub Pages for dev)

- Implement a daily “cleanup” function to delete expired OTP rows but preserves the emails
- Checks if the needed spreadsheet exists otherwise creates it and send an email to the author

---

### 2️⃣ Google Sheets structure

Provide the **schema and setup instructions** for the linked spreadsheet `OKColf_Contacts`:

#### Sheet `otp_log`
| Field | Type | Description |
|--------|------|-------------|
| email | string | User email |
| otp | string | 6-digit OTP |
| created_at | datetime | Timestamp when generated |
| expires_at | datetime | Timestamp of expiry (+5m) |
| verified | boolean | Whether OTP was used |
| ip | string | Optional logging field |

#### Sheet `contacts`
| Field | Type | Description |
|--------|------|-------------|
| email | string | User email |
| verified | boolean | Always true |
| verified_at | datetime | Verification timestamp |
| source | string | Constant value "otp_signup" |
| meta | string | Optional browser/referrer info |

---

### 3️⃣ Deployment instructions

Ask Claude to output a **final section** describing:

- How to create and link the spreadsheet
- How to deploy the script as a Web App (with “Anyone, even anonymous” access)
- How to copy and configure the Web App URL in the PWA frontend
- How to add a daily time-driven trigger to clean up expired OTPs
- How to configure the okcolf domain on the web apps domain
- Architecture of the system

---

## 🧠 Additional guidelines

- Keep the code modular and readable.  
- Use clear variable names and logging where appropriate.  
- Avoid unnecessary dependencies.  
- Ensure all Italian text in user communications uses formal, polite tone (“Gentile utente…”).  
- All timestamps must be handled in UTC or local time consistently.  
- Comments should guide future engineers in understanding flow and limitations.
- Security and correctness are a primary requirement

---

Use this prompt to deliver a **production-grade implementation** ready for copy-paste into Google Workspace,  
aligned with the **OK Colf OTP & Contacts (Free Edition)** specification version 1.0.

---
