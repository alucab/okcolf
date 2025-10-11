## Relevant Files

- `server/gas/Code.gs` - Main Google Apps Script implementation with doPost entry point and routing logic.
- `server/gas/OTPService.gs` - OTP generation, validation, and email sending functions.
- `server/gas/SheetService.gs` - Google Sheets data access layer for otp_log and contacts tables.
- `server/gas/Utils.gs` - Helper functions for CORS, logging, and date handling.
- `server/gas/appsscript.json` - Apps Script manifest file with timezone and dependencies.
- `server/gas/README.md` - Deployment instructions and architecture documentation.
- `js/services.js` - Contains AuthService that needs real API integration.
- `js/conf.js` - May need API endpoint URL configuration.
- `html/welcome.html` - Registration form requiring privacy notice and real OTP flow.
- `js/test.js` - Test suite requiring updates for real backend validation.
- `css/main.css` - May need styles for privacy notice component.
- `docs/OTP_DEPLOYMENT.md` - Complete deployment guide for Google Workspace setup.
- `docs/SHEETS_SCHEMA.md` - Google Sheets structure documentation.

### Notes

- Google Apps Script files should be created in a `server/gas/` directory for organization.
- All user-facing messages in Italian, code comments in English.
- Test both mock and real modes during development for backwards compatibility.
- Ensure CORS configuration allows `okcolf.it`, `alucab.github.io`, and `localhost:5173`.

## Tasks

- [ ] 1.0 Google Apps Script Backend Implementation
  - [ ] 1.1 Create project structure in `server/gas/` with Code.gs, OTPService.gs, SheetService.gs, Utils.gs, and appsscript.json
  - [ ] 1.2 Implement `doPost(e)` entry point in Code.gs with JSON parsing, path-based routing (/send_otp, /verify_otp), and error handling
  - [ ] 1.3 Implement `sendOtp(email)` function in OTPService.gs: generate 6-digit random OTP, calculate expiration (+5 min), store in otp_log sheet, send email via GmailApp with Italian template
  - [ ] 1.4 Implement `verifyOtp(email, otp)` function in OTPService.gs: search otp_log for matching record, validate expiration and verification status, update contacts sheet on success, return appropriate JSON responses
  - [ ] 1.5 Create CORS utility functions in Utils.gs: setCorsHeaders() supporting okcolf.it, alucab.github.io, and localhost:5173, handle OPTIONS preflight requests
  - [ ] 1.6 Implement SheetService.gs data access layer: getOrCreateSpreadsheet(), addOtpLog(), findOtpRecord(), updateOtpVerified(), addOrUpdateContact(), with error handling and logging
  - [ ] 1.7 Create cleanupExpiredOtps() function in OTPService.gs to delete expired OTP records older than 24 hours while preserving email history
  - [ ] 1.8 Add comprehensive logging throughout all functions for debugging and audit trails

- [ ] 2.0 Google Sheets Database Setup
  - [ ] 2.1 Create SHEETS_SCHEMA.md documentation with complete field definitions for otp_log (email, otp, created_at, expires_at, verified, ip) and contacts (email, verified, verified_at, source, meta) sheets
  - [ ] 2.2 Implement getOrCreateSpreadsheet() in SheetService.gs to automatically create "OKColf_Contacts" spreadsheet if missing, with proper sheet initialization
  - [ ] 2.3 Add createSheetHeaders() function to set up column headers and apply data validation rules (email format, boolean fields, datetime formatting)
  - [ ] 2.4 Implement sheet existence verification on first script execution with email notification to script owner if sheets were auto-created
  - [ ] 2.5 Add data validation and formatting rules: email regex pattern, datetime formatting for timestamps, boolean validation for verified fields
  - [ ] 2.6 Create sample data insertion function for development/testing purposes with realistic test records

- [ ] 3.0 Frontend Integration & Privacy Compliance
  - [ ] 3.1 Add privacy notice HTML component to welcome.html with accordion/expandable section explaining data collection (email only), storage location (Google Sheets), purpose (authentication), and retention policy
  - [ ] 3.2 Add privacy acceptance checkbox to registration form in welcome.html, disable "Invia Codice" button until checked, store acceptance in session
  - [ ] 3.3 Update welcomeData() Alpine.js component to include privacyAccepted property and validation logic
  - [ ] 3.4 Add CSS styles in main.css for privacy notice: .privacy-notice class with subtle background, padding, readable typography, and expand/collapse animations
  - [ ] 3.5 Update form validation to check privacy acceptance before allowing OTP send, display appropriate error message if not accepted
  - [ ] 3.6 Add configuration for API endpoint URL in conf.js as GAS_API_URL with fallback to mock mode for development

- [ ] 4.0 AuthService Refactoring
  - [ ] 4.1 Create ApiService helper in services.js for HTTP requests: handleFetch() wrapper with timeout, error handling, and JSON parsing
  - [ ] 4.2 Update AuthService.sendOTP() to call real GAS endpoint POST /send_otp with email payload, handle network errors, maintain mock fallback mode for development
  - [ ] 4.3 Update AuthService.verifyOTP() to call real GAS endpoint POST /verify_otp with email and otp payload, parse success/error responses, map error codes to Italian user messages
  - [ ] 4.4 Add error message mapping object in AuthService: map GAS error responses (invalid_otp, expired_otp, rate_limit, server_error) to Italian user-friendly messages
  - [ ] 4.5 Implement retry logic for transient failures: exponential backoff for network errors, max 3 retries, clear user feedback during retry attempts
  - [ ] 4.6 Add offline detection and appropriate error handling: check navigator.onLine before requests, queue requests if offline (optional enhancement), inform user of connectivity issues
  - [ ] 4.7 Update session storage to include GAS verification token if returned by backend for future authenticated requests

- [ ] 5.0 Testing & Validation Suite
  - [ ] 5.1 Update Tests.WelcomePage in test.js: add testRealOTPSend() and testRealOTPVerify() for real backend integration, modify existing tests to support both mock and real modes
  - [ ] 5.2 Create Tests.Backend section with automated tests: testGASEndpointReachable(), testOTPGenerationFormat(), testExpirationValidation(), testDuplicateEmailHandling()
  - [ ] 5.3 Add manual test procedures for complete registration flow: Manual.procedures['otp.real.1'] for end-to-end real OTP flow with Gmail verification
  - [ ] 5.4 Create deployment verification checklist in test.js: verify sheets exist, test CORS from allowed domains, validate email delivery, check logs for errors
  - [ ] 5.5 Update existing manual tests (welcome.1 through welcome.7) to work with real backend, add notes about expected email delivery times
  - [ ] 5.6 Add Tests.Privacy section for privacy notice validation: checkbox enforcement, privacy text visibility, acceptance persistence in session
  - [ ] 5.7 Create performance test for OTP delivery: measure time from request to email receipt, validate 5-minute expiration window accuracy

- [ ] 6.0 Deployment Documentation & Configuration
  - [ ] 6.1 Create OTP_DEPLOYMENT.md with complete setup instructions: Google Apps Script project creation, spreadsheet linking, library dependencies, timezone configuration
  - [ ] 6.2 Document Web App deployment steps: version management, access permissions ("Anyone, even anonymous"), obtaining deployment URL, testing deployment
  - [ ] 6.3 Add domain verification instructions for okcolf.it: Google Workspace domain setup, DNS TXT record configuration, domain ownership verification process
  - [ ] 6.4 Document time-driven trigger setup: create daily trigger for cleanupExpiredOtps(), configure execution time (e.g., 2 AM), error notification settings
  - [ ] 6.5 Create architecture diagram and system flow documentation: client → GAS → Sheets data flow, CORS configuration, security model, rate limiting strategy
  - [ ] 6.6 Add troubleshooting section: common errors (CORS issues, permission errors, quota limits), debugging tips (checking execution logs), email delivery problems
  - [ ] 6.7 Document configuration updates needed in conf.js: add GAS_API_URL constant, environment-specific configuration (dev/prod), mock mode toggle for testing
  - [ ] 6.8 Create rollback procedure documentation: reverting to mock mode, handling GAS downtime, backup and restore procedures for Sheets data