# Task List: OTP Email Verification System

## Relevant Files

**Backend (PocketBase Cloud)**

- `server/pb_hooks/otp.pb.js` - Main PocketBase hook with OTP endpoints
- `server/pb_migrations/otp_requests.js` - Database schema for OTP records
- `server/pb_migrations/rate_limits.js` - Database schema for rate limiting
- `server/config/.env.example` - Environment variables template
- `server/utils/email-template.js` - HTML email template generator
- `server/utils/logger.js` - Configurable logging utility

**Frontend Integration**

- `js/services.js` - Update AuthService with real API calls
- `html/welcome.html` - Update to use real endpoints (remove mock notifications)

**Documentation**

- `server/docs/api.md` - API reference with curl and JS examples
- `server/docs/architecture.md` - System design and security explanation
- `server/docs/pocketbase.md` - PocketBase Cloud setup guide
- `server/docs/README.md` - Setup and deployment instructions
- `server/tests/otp-test.js` - Browser console test suite
- `server/tests/integration.sh` - Curl-based integration tests

### Notes

- All PocketBase code uses `onRequest()` hooks for API endpoints
- Logging levels: DEBUG (all events), INFO (major ops), WARN (rate limits), ERROR (failures only)
- Rate limiting can be toggled via environment variables for development/testing
- CORS configuration differs between dev (localhost allowed) and prod (whitelist only)

---

## Tasks

- [ ] 1.0 Set up PocketBase Cloud project structure and configuration
  - [ ] 1.1 Create directory structure (`server/pb_hooks/`, `server/utils/`, `server/docs/`, `server/tests/`)
  - [ ] 1.2 Create `.env.example` with Gmail SMTP credentials, rate limit settings, CORS origins, LOG_LEVEL (DEBUG/INFO/WARN/ERROR), ENABLE_IP_RATE_LIMIT=true, and ENABLE_EMAIL_RATE_LIMIT=true
  - [ ] 1.3 Create PocketBase collection schemas for `otp_requests` (email, otp, nonce, timestamp, ip, used, expires_at) and `rate_limits` (identifier, count, window_start, type)
  - [ ] 1.4 Set up logger utility (`server/utils/logger.js`) with configurable levels from env variable

- [ ] 2.0 Implement OTP generation, storage, and email sending logic
  - [ ] 2.1 Create OTP generator function (6-digit numeric, cryptographically secure)
  - [ ] 2.2 Create nonce generator function (UUID v4 or similar)
  - [ ] 2.3 Create HTML email template (`server/utils/email-template.js`) with OTP code, expiration notice, and minimal branding
  - [ ] 2.4 Implement Gmail SMTP sender function with error handling and logging
  - [ ] 2.5 Create database helper to store OTP record with TTL=5min, mark auto-expiration
  - [ ] 2.6 Add comprehensive logging (with level control) for OTP generation, email sending, failures

- [ ] 3.0 Implement rate limiting and anti-abuse mechanisms
  - [ ] 3.1 Create rate limiter for IP (5 requests per 10 minutes, configurable via env) with ENABLE_IP_RATE_LIMIT check
  - [ ] 3.2 Create rate limiter for email (same limits, separate tracking) with ENABLE_EMAIL_RATE_LIMIT check
  - [ ] 3.3 Implement cooldown check (2-5 minutes between requests per email)
  - [ ] 3.4 Create cleanup function to remove expired rate limit records
  - [ ] 3.5 Add logging for rate limit hits and cooldown violations (log when disabled too)

- [ ] 4.0 Create verification endpoint with nonce validation
  - [ ] 4.1 Implement `POST /api/verify-otp` endpoint accepting email, otp, nonce
  - [ ] 4.2 Add validation logic: check matching record, expiration, used flag
  - [ ] 4.3 Mark OTP as used=true on successful verification
  - [ ] 4.4 Return clear error messages for: invalid OTP, expired, already used, missing nonce
  - [ ] 4.5 Add logging for verification attempts (success/failure with reasons)
  - [ ] 4.6 Implement CORS headers (strict for production: okcolf.it, alucab.github.io; wildcard for dev)

- [ ] 5.0 Integrate frontend with real API endpoints
  - [ ] 5.1 Update `AuthService.sendOTP()` in `services.js` to call real `/api/request-otp` endpoint
  - [ ] 5.2 Update `AuthService.verifyOTP()` to call real `/api/verify-otp` with nonce
  - [ ] 5.3 Store returned nonce in Alpine.js component state
  - [ ] 5.4 Update error handling to display API error messages
  - [ ] 5.5 Remove mock toast notification, keep only real success/error feedback
  - [ ] 5.6 Add rate limit feedback UI (show cooldown timer if applicable)

- [ ] 6.0 Generate documentation, testing suite, and deployment guide
  - [ ] 6.1 Write `api.md` with endpoint specs, curl examples, and browser JS examples
  - [ ] 6.2 Write `architecture.md` with flow diagrams (Mermaid), security explanations, and logging levels guide
  - [ ] 6.3 Write `README.md` with: Gmail app password setup, PocketHost deployment steps, CORS configuration (dev/prod), LOG_LEVEL usage, and rate limiting toggle options (ENABLE_IP_RATE_LIMIT, ENABLE_EMAIL_RATE_LIMIT)
  - [ ] 6.4 Create `otp-test.js` browser console test suite (10+ test cases: valid flow, expired OTP, rate limits, etc.)
  - [ ] 6.5 Create `integration.sh` with curl commands for endpoint testing
  - [ ] 6.6 Add "Optional Improvements" section in README (Redis caching, Mailgun, JWT tokens, monitoring)
  - [ ] 6.7 Write `pocketbase.md` documenting PocketBase Cloud setup: account creation, project initialization, collection creation via admin UI, environment variables configuration (including rate limit toggles), hooks deployment, and testing endpoints
