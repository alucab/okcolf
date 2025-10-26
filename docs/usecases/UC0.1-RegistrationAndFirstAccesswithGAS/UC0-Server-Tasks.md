## Relevant Files

### Backend Files (New)
- `server/pocketbase/pb_hooks/otp-rate-limit.pb.js` - JSVM hook for rate limiting OTP requests per IP/email
- `server/pocketbase/pb_migrations/001_initial_setup.js` - Migration to create rate_limits collection
- `server/pocketbase/pb_migrations/002_configure_auth.js` - Migration to enable OTP on users collection
- `server/pocketbase/.env.example` - Environment variables template (SMTP, rate limits, CORS)
- `server/pocketbase/README.md` - Backend setup and deployment instructions
- `server/pocketbase/email_templates/otp_verification.html` - Custom OTP email template

### Frontend Files (Modified)
- `js/conf.js` - Replace GAS_CONFIG with POCKETBASE_CONFIG
- `js/services.js` - Refactor AuthService to use PocketBase SDK instead of fetch
- `html/welcome.html` - Update error message mapping for PocketBase responses
- `index.html` - Add PocketBase JS SDK CDN import

### Documentation Files (New)
- `docs/api.md` - API endpoint documentation with cURL and JavaScript examples
- `docs/architecture.md` - System architecture, security measures, and flow diagrams
- `docs/deployment.md` - Step-by-step deployment guide for PocketHost.io
- `docs/testing.md` - Test cases and validation procedures

### Test Files (New)
- `tests/otp-frontend.test.js` - Browser console test suite for frontend OTP flow
- `tests/otp-backend.test.sh` - cURL-based backend API test suite

### Notes

- PocketBase v0.23+ has native OTP support, eliminating need for custom nonce/expiry logic
- Rate limiting implemented via JSVM hooks (no external Redis needed)
- All backend code uses PocketBase JavaScript VM (not Node.js)
- Frontend uses PocketBase JavaScript SDK from CDN
- Testing can be done locally with `pocketbase serve` before deploying to PocketHost.io

---

## Tasks

- [ ] 1.0 Backend Architecture & PocketBase Setup
  - [ ] 1.1 Create `server/pocketbase/` directory structure with subdirectories: `pb_hooks/`, `pb_migrations/`, `pb_data/` (gitignored)
  - [ ] 1.2 Download PocketBase CLI for local development (latest stable version from pocketbase.io)
  - [ ] 1.3 Create `pb_migrations/001_initial_setup.js` to define `rate_limits` collection schema with fields: `email` (text), `ip` (text), `attempts` (number), `last_attempt` (date), `created` (auto)
  - [ ] 1.4 Create `pb_migrations/002_configure_auth.js` to enable OTP authentication on the default `users` collection with `emailVisibility: true` and `onlyEmailAuth: true`
  - [ ] 1.5 Run migrations locally using `pocketbase migrate up` and verify collections are created in Admin UI (http://127.0.0.1:8090/_/)
  - [ ] 1.6 Create PocketHost.io account and provision new PocketBase Cloud instance (free tier supports up to 10K records)
  - [ ] 1.7 Configure environment variables in PocketHost dashboard: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `RATE_LIMIT_MAX`, `CORS_ORIGINS`
  - [ ] 1.8 Deploy migrations to PocketHost using their CLI or web interface

- [ ] 2.0 OTP Email Logic & Security Implementation
  - [ ] 2.1 Create `pb_hooks/otp-rate-limit.pb.js` hook that intercepts `POST /api/collections/users/request-verification` requests
  - [ ] 2.2 Implement IP address extraction logic in hook (check `X-Forwarded-For` header, fallback to `X-Real-IP`, then `RemoteAddr`)
  - [ ] 2.3 Implement rate limit check: query `rate_limits` collection for matching email OR ip, count attempts in last 10 minutes
  - [ ] 2.4 Return 429 error with Italian message "Troppi tentativi. Riprova tra X minuti." if rate limit exceeded (5 attempts per 10 min)
  - [ ] 2.5 Implement cooldown check: ensure minimum 2 minutes elapsed since last OTP request for same email
  - [ ] 2.6 On successful rate limit check, record attempt in `rate_limits` collection with current timestamp
  - [ ] 2.7 Add cleanup logic to delete `rate_limits` records older than 24 hours (runs on each request, batched delete max 100 records)
  - [ ] 2.8 Implement logging for all OTP requests: timestamp, email, IP, user-agent, result (success/rate-limited/error)
  - [ ] 2.9 Test rate limiting locally by sending 6+ rapid requests and verifying 429 response

- [ ] 3.0 Frontend Refactoring (GAS → PocketBase)
  - [ ] 3.1 Add PocketBase JavaScript SDK to `index.html` via CDN: `<script src="https://cdn.jsdelivr.net/npm/pocketbase@0.21.1/dist/pocketbase.umd.js"></script>` with SRI hash
  - [ ] 3.2 Replace `GAS_CONFIG` in `js/conf.js` with `POCKETBASE_CONFIG` containing: `url` (PocketHost instance URL), `useMock` (boolean for dev mode)
  - [ ] 3.3 Initialize PocketBase client in `js/services.js`: `const pb = new PocketBase(POCKETBASE_CONFIG.url)`
  - [ ] 3.4 Refactor `AuthService.sendOTP()` to call `pb.collection('users').requestVerification(email)` instead of fetch to GAS endpoint
  - [ ] 3.5 Update error handling in `sendOTP()` to map PocketBase error codes to Italian messages: `400` → "Email non valida", `429` → "Troppi tentativi"
  - [ ] 3.6 Refactor `AuthService.verifyOTP()` to call `pb.collection('users').confirmVerification(email, otp)` instead of custom verify endpoint
  - [ ] 3.7 Update `verifyOTP()` to save PocketBase auth token to `pb.authStore` on success, sync with existing `KV.set('user_email_verified', true)`
  - [ ] 3.8 Update Alpine.js store in `conf.js` to read `pb.authStore.isValid` for connection status and user email from `pb.authStore.model?.email`
  - [ ] 3.9 Test mock mode (`useMock: true`) to ensure development workflow still works without backend
  - [ ] 3.10 Update `welcome.html` error message display to use new Italian error mappings from PocketBase responses

- [ ] 4.0 Email Templates & SMTP Configuration
  - [ ] 4.1 Create Gmail App Password: Go to Google Account → Security → 2-Step Verification → App passwords → Generate for "Mail"
  - [ ] 4.2 Create `.env.example` in `server/pocketbase/` with template values: `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER=your-email@gmail.com`, `SMTP_PASS=your-app-password`
  - [ ] 4.3 Configure SMTP in PocketHost dashboard Settings → Mail settings using values from `.env.example`
  - [ ] 4.4 Test SMTP by sending test email from PocketBase Admin UI → Settings → Mail → "Send test email"
  - [ ] 4.5 Create custom email template `email_templates/otp_verification.html` with Italian text, OTP placeholder `{TOKEN}`, and OK Colf branding
  - [ ] 4.6 Upload custom template to PocketBase Admin UI → Settings → Mail → "Verification template"
  - [ ] 4.7 Configure SPF record for sending domain: Add `v=spf1 include:_spf.google.com ~all` to DNS TXT records
  - [ ] 4.8 Configure DKIM if using custom domain (optional for Gmail, recommended for production)
  - [ ] 4.9 Test full OTP email flow: request OTP, check inbox, verify formatting and branding
  - [ ] 4.10 Document email quota limits (Gmail: ~100/day) and upgrade path to Mailgun/SendGrid in `docs/deployment.md`

- [ ] 5.0 Testing & Quality Assurance
  - [ ] 5.1 Create `tests/otp-backend.test.sh` with cURL commands to test: request OTP (valid email), request OTP (invalid email), rate limiting (6+ rapid requests)
  - [ ] 5.2 Add cURL test for verify OTP (valid code), verify OTP (invalid code), verify OTP (expired code - wait 5+ min after request)
  - [ ] 5.3 Create `tests/otp-frontend.test.js` with browser console functions: `testSendOTP(email)`, `testVerifyOTP(email, code)`, `testRateLimit(email)`
  - [ ] 5.4 Test anonymized mode: Click "Continua senza email" button, verify app loads with `isUserAnonymous: true` in Alpine store
  - [ ] 5.5 Test email mode: Complete full OTP flow, verify session persists after page reload, check `pb.authStore.token` is saved
  - [ ] 5.6 Test offline behavior: Disconnect internet, verify mock mode activates automatically, check console logs for offline detection
  - [ ] 5.7 Test CORS configuration: Make requests from `localhost`, `okcolf.it`, `alucab.github.io` and unauthorized domain (should fail)
  - [ ] 5.8 Test cooldown: Request OTP, wait 30 seconds, request again (should fail with "Attendi 2 minuti" message)
  - [ ] 5.9 Load test (optional): Send 100 OTP requests over 1 hour to verify Gmail quota and PocketBase performance
  - [ ] 5.10 Document all test cases with expected results in `docs/testing.md`

- [ ] 6.0 Documentation & Deployment Guides
  - [ ] 6.1 Create `docs/api.md` with endpoint documentation for `POST /api/collections/users/request-verification` including request body, response format, error codes
  - [ ] 6.2 Add cURL example to `api.md`: `curl -X POST https://your-instance.pockethost.io/api/collections/users/request-verification -H "Content-Type: application/json" -d '{"email":"test@example.com"}'`
  - [ ] 6.3 Add JavaScript browser console example to `api.md` using PocketBase SDK: `pb.collection('users').requestVerification('test@example.com')`
  - [ ] 6.4 Document `POST /api/collections/users/confirm-verification` endpoint with same format (cURL + JS examples)
  - [ ] 6.5 Create `docs/architecture.md` with system overview, component diagram (frontend ↔ PocketBase ↔ Gmail SMTP)
  - [ ] 6.6 Add Mermaid flow diagram to `architecture.md` showing: Request OTP → Rate limit check → Send email → User enters code → Verify OTP → Session created
  - [ ] 6.7 Document security measures in `architecture.md`: rate limiting (5/10min), cooldown (2min), OTP expiry (5min via PocketBase default), nonce (built-in)
  - [ ] 6.8 Create `docs/deployment.md` with step-by-step guide: PocketHost signup → Create instance → Upload migrations → Configure SMTP → Deploy frontend
  - [ ] 6.9 Add local development section to `deployment.md`: Install PocketBase CLI → Run `pocketbase serve` → Set `useMock: false` in conf.js → Test on localhost:8090
  - [ ] 6.10 Document CORS configuration in `deployment.md`: Dev (*), Production (okcolf.it, alucab.github.io, localhost), how to update in PocketHost dashboard
  - [ ] 6.11 Add troubleshooting section to `deployment.md`: Common errors (SMTP auth fail, CORS blocked, rate limit too strict) and solutions
  - [ ] 6.12 Create `server/pocketbase/README.md` with quick start guide: Prerequisites, local setup commands, deployment checklist, monitoring tips
  - [ ] 6.13 Add "Optional Improvements" section to `architecture.md`: Centralized logging (Datadog/Logtail), Redis caching, multi-provider email (Mailgun), JWT tokens for API