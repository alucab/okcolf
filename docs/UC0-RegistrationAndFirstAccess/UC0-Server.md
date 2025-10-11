## 🎯 Goal

Design and generate a **secure OTP (One-Time Password)** email verification system for a **Jamstack PWA** hosted on `okcolf.it`.

The app sends 6-digit OTP codes via email for user verification or authentication.  
Expected load: **100–200 emails/day** → low volume, but must be **resilient against spam, flooding, and abuse**.

The output should include: design, code, configuration files, comments, and explanations.

---

## 🧠 Core Requirements

- Generate 6-digit OTP + unique nonce
- OTP expires after 5 minutes
- Mark as `used=true` after successful verification
- Apply per-IP and per-email rate limiting
- Apply cooldown (2–5 minutes between OTP requests)
- Log: email, IP, timestamp, user-agent
- Optional: reCAPTCHA v3 (frontend)
- Strict CORS (only `okcolf.it` and localhost)
- Clear error messages for invalid/flooded requests
- No sensitive keys in frontend
- Scalable to 10K OTP/day if needed

---

## ⚙️ Technical Targets

1. PocketBase Cloud + Gmail SMTP  

---

## 🧩 Logical Flow

### 1️⃣ Request OTP

**Endpoint:** `POST /request-otp`

- Input: `email`
- Steps:
  1. Enforce rate limiting per IP/email.
  2. Enforce cooldown (min 2–5 min).
  3. Generate 6-digit OTP + unique nonce.
  4. Save `{ email, otp, nonce, timestamp, ip, used=false }` in DB with TTL=5min.
  5. Send OTP via email using Gmail SMTP.
  6. Return `{ nonce }` to the frontend.

### 2️⃣ Verify OTP

**Endpoint:** `POST /verify-otp`

- Input: `email`, `otp`, `nonce`
- Steps:
  1. Validate matching record.
  2. Check expiration and `used=false`.
  3. If valid → mark as `used=true` and return `{ success: true }`.
  4. Otherwise return `{ success: false, reason }`.

---

## 🔒 Security & Anti-Abuse

- **Rate limiting**: e.g., 5 OTP requests per 10 minutes per IP.
- **Cooldown**: 2–5 minutes between requests per email.
- **Nonce**: prevents replay attacks.
- **TTL**: automatic expiration of OTP after 5 minutes.
- **Logging**: all OTP requests and verifications.
- **Optional**: reCAPTCHA v3 token check.
- **SPF/DKIM/DMARC**: configured on sending domain.
- **CORS**: active with two configurations * for dev and strict with only some domains on request
- **Server-only secrets**: all SMTP or API credentials in `.env`.

---

## 🧱 Expected Output from Claude

Claude should generate a **complete working implementation**, including all code, configurations, and explanations.

---

### **1️⃣ Project documentation**

Provide the following project documents:

- api.md:
  - explanation of the API
  - CURL sample for every call
  - javascript sample for every call usable from browser console

- architecture.md :
- Explanation of the architecture
- Explanation of the security measures in place
- Generate a Markdown flow diagram showing:
  - `Request OTP → Validation → Email send → Verify OTP → Expiration / Mark used`
  - every other flow in the module

---

### **2️⃣ Backend Code**

Provide **backend implementation**:

#### PocketBase Cloud

- JavaScript PocketBase function
- `/request-otp` and `/verify-otp` endpoints
- OTP, nonce, expiry, flag `used`
- Rate limiting & cooldown
- Logging & CORS config
- Gmail SMTP setup
- Clear inline comments explaining design and security
- test cases to execute

---

### **3️⃣ Frontend Snippets**

Provide JS code snippets for:

- Requesting OTP (`fetch /request-otp`)
- Verifying OTP (`fetch /verify-otp`)
- Handling success/failure and cooldown feedback
- Integrate easily into a simple HTML form as the supplied welcome.html
- provide the update version of welcome.html
- provide a set of test cases to execute in a js file that can be included and execute from the js console

---

### **4️⃣ Configuration Files**

Include:

- `.env.example` with:
  - GMAIL_USER=
  - GMAIL_PASS=
  - SMTP_HOST=smtp.gmail.com
  - SMTP_PORT=465
  - RATE_LIMIT_MAX=5
  - CORS_ORIGINS =
- `README.md` with setup instructions:
  - Gmail app password setup
  - Environment configuration
  - Deploy on PocketHost.io
  - Testing locally
  - CORS setup for development
    - *
  - CORS setup for deployment
    - okcolf.it
    - alucab.github.io
    - localhost
    - 127.0.0.1

---

### **5️⃣ Comments & Security Notes**

Every section of code must include brief inline comments explaining:

- How nonce prevents replay
- How TTL and `used` flag prevent reuse
- How rate limiting mitigates abuse
- Why credentials must remain server-side
- Recommended improvements for production (Mailgun/SendGrid, logging, monitoring)

---

### **6️⃣ Optional Improvements Section**

Add a short section on:

- Centralized logging (e.g., Datadog, Logtail)
- In-memory caching (e.g., Redis, PocketBase in-memory)
- Multi-provider email support
- JWT-signed tokens for advanced verification
- Webhooks or async queues for scaling

---

## 🧩 Formatting Rules

- Output must be structured as **separate code blocks for each file**:
- Example:
  - `backend/pocketbase/request-otp.js`
  - `frontend/otp.js`
  - `.env.example`
  - `README.md`
- Use proper Markdown formatting for readability.
- All code must be **ready to deploy**
- Commenting is important: at least each method call and possibly important points of execution should be commented

---

## 💡 Instruction for Claude
>
> You are a senior backend engineer.  
> Generate the **complete OTP system** (design + code + documentation) according to this spec.  
> Include all required files, comments, and explanations.  
> The final result should be **production-grade in structure**, even if using Gmail SMTP for prototyping.  
> Use clear Markdown formatting, one block per file.  
> Make it modular, secure, and ready for deployment.