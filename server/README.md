# OK Colf - Google Apps Script Backend

This directory contains the Google Apps Script backend for the OTP email verification system.

## 📁 File Structure

```
server/gas/
├── Code.gs           - Main entry point and request routing
├── OTPService.gs     - OTP generation, validation, and email sending
├── SheetService.gs   - Google Sheets data access layer
├── Utils.gs          - Helper functions (CORS, logging, dates)
├── appsscript.json   - Apps Script configuration
└── README.md         - This file
```

## 🚀 Quick Start

### Prerequisites
- Google Account with access to Google Apps Script
- Gmail account configured for sending (noreply@okcolf.it recommended)
- Google Sheets for data storage

### Installation Steps

1. **Create New Apps Script Project**
   - Go to [script.google.com](https://script.google.com)
   - Click "New Project"
   - Name it "OK Colf OTP System"

2. **Add Script Files**
   - Delete the default `Code.gs` content
   - Copy each `.gs` file from this directory into separate script files
   - Copy `appsscript.json` content (View > Show project manifest)

3. **Deploy as Web App**
   - Click "Deploy" > "New deployment"
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone, even anonymous
   - Click "Deploy"
   - Copy the deployment URL

4. **Configure Spreadsheet**
   - The script will auto-create "OKColf_Contacts" spreadsheet on first run
   - Or manually create and link via SheetService configuration

5. **Update Frontend**
   - Add deployment URL to `js/conf.js` as `GAS_API_URL`

## 🔧 Configuration

### Timezone
Set in `appsscript.json`:
```json
"timeZone": "Europe/Rome"
```

### Allowed CORS Origins
Edit in `Utils.gs` function `setCorsHeaders()` and `isOriginAllowed()`:
```javascript
const allowedOrigins = [
  'https://okcolf.it',
  'https://www.okcolf.it',
  'https://alucab.github.io',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080'
];
```

**Pattern Matching:**
- GitHub Pages: Any `https://*.github.io` domain is automatically allowed
- Localhost: Both `localhost` and `127.0.0.1` on ports 5173 and 8080

**Security Notes:**
- Origin validation happens on every request
- Preflight (OPTIONS) requests are handled separately
- Failed origin checks are logged for monitoring
- Production should use exact domain matching only

**Testing CORS:**
Run `testCORS()` from the Apps Script editor to verify your configuration.

### Email Sender
Configure in `OTPService.gs`:
```javascript
const SENDER_EMAIL = 'noreply@okcolf.it';
const SENDER_NAME = 'OK Colf';
```

## 📡 API Endpoints

### POST /send_otp
Generate and send OTP to email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "status": "ok"
}
```

### POST /verify_otp
Verify OTP and register user.

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true
}
```

## 🧪 Testing

### Automated Tests

Run these functions from the Apps Script editor:

**1. Basic Deployment Test**
```javascript
testDeployment()
```
Tests:
- OTP generation
- Email validation
- Timestamp functions
- Spreadsheet access
- Formula injection prevention
- Retry mechanism
- CORS configuration
- Sheet operations

**2. Full Integration Test**
```javascript
testFullOTPFlow()
// Or with custom email:
testFullOTPFlow('your-test@email.com')
```
⚠️ **WARNING**: This sends a real email and creates database records!

Tests complete flow:
1. Send OTP to email
2. Find OTP in database
3. Verify OTP
4. Check contact record created
5. Prevent double verification
6. Test rate limiting

**3. CORS Test**
```javascript
testCORS()
```

**4. Sheet Operations Test**
```javascript
testSheetService()
```

### Manual API Testing

Test the endpoints using curl or Postman:

```bash
# Send OTP
curl -X POST "YOUR_DEPLOYMENT_URL?path=send_otp" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP
curl -X POST "YOUR_DEPLOYMENT_URL?path=verify_otp" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# Health check
curl -X POST "YOUR_DEPLOYMENT_URL?path=health" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Testing Checklist

Before deploying to production:

- [ ] Run `testDeployment()` - all tests pass
- [ ] Run `testFullOTPFlow()` with real email
- [ ] Verify email is received and formatted correctly
- [ ] Test from localhost with CORS
- [ ] Test invalid email format
- [ ] Test invalid OTP code
- [ ] Test expired OTP (wait 6 minutes)
- [ ] Test double verification prevention
- [ ] Test rate limiting (send 2 OTPs within 1 minute)
- [ ] Check execution logs for errors
- [ ] Verify spreadsheet is created correctly

## 📊 Data Structure

### otp_log Sheet
| Column | Type | Description |
|--------|------|-------------|
| email | string | User email |
| otp | string | 6-digit code |
| created_at | datetime | Generation time |
| expires_at | datetime | Expiration time (+5min) |
| verified | boolean | Verification status |
| ip | string | Client IP (if available) |

### contacts Sheet
| Column | Type | Description |
|--------|------|-------------|
| email | string | Verified user email |
| verified | boolean | Always true |
| verified_at | datetime | Verification timestamp |
| source | string | Always "otp_signup" |
| meta | string | Optional metadata |

## 🔒 Security Notes

### Data Protection
- OTPs expire after 5 minutes
- Each OTP can only be used once (double-verification prevented)
- Failed verification attempts are logged
- No sensitive data beyond email is stored
- Email addresses sanitized in logs (partial masking)

### Formula Injection Prevention
All user inputs are sanitized before insertion into sheets:
- Dangerous characters (`=`, `+`, `-`, `@`) are prefixed with `'`
- Prevents formula injection attacks

### Rate Limiting
- Max 1 OTP request per minute per email
- Gmail quota: 100 emails/day (free), 1,500/day (Workspace)
- Quota exceeded errors handled gracefully

### CORS Security
- Whitelist-based origin validation
- Only approved domains can access API
- Failed origin attempts are logged
- Pattern matching for trusted domains only (GitHub Pages)

### Retry Logic
- Transient failures automatically retried (max 3 attempts)
- Exponential backoff: 1s, 2s, 4s
- Permanent errors fail immediately
- All retry attempts logged

### Access Control
- Web App deployed with "Anyone, even anonymous"
- Spreadsheet access controlled by Apps Script permissions
- Only script owner can modify data directly

### Monitoring
- All operations logged with timestamps
- Critical errors trigger admin email notifications
- Execution logs available in Apps Script dashboard

## 🛠 Maintenance

### Daily Cleanup Trigger
Set up a time-driven trigger for `cleanupExpiredOtps()`:
1. Click "Triggers" (clock icon)
2. "Add Trigger"
3. Function: `cleanupExpiredOtps`
4. Event source: Time-driven
5. Type: Day timer
6. Time: 2:00 AM - 3:00 AM

### Monitoring
View execution logs:
- "Executions" tab in Apps Script editor
- Check for errors and performance issues

## 📝 Development Notes

- All user-facing messages are in Italian
- All code comments are in English
- Logging uses ISO 8601 timestamps
- Error responses include user-friendly messages

## 🐛 Troubleshooting

### Issue: CORS errors
**Symptoms:** Browser shows "CORS policy" error in console

**Solutions:**
1. Verify deployment access is "Anyone, even anonymous"
2. Check origin is in allowed list (Utils.gs)
3. Apps Script CORS is automatic - header setting may not work as expected
4. Test with different browsers
5. Check Apps Script execution logs for errors

**Note:** Apps Script Web Apps handle CORS automatically for anonymous access. Custom headers may be ignored.

### Issue: Email not sending
**Symptoms:** OTP send succeeds but email never arrives

**Solutions:**
1. Check spam/junk folder
2. Verify Gmail account permissions in Google Account settings
3. Check daily email quota (100/day for free accounts)
4. Review execution logs for GmailApp errors
5. Try with different email address
6. Verify sender email domain (may need Google Workspace for custom domain)

**Check quota:**
```javascript
Logger.log('Remaining quota: ' + MailApp.getRemainingDailyQuota());
```

### Issue: Sheet not found
**Symptoms:** "OTP sheet not found" or "Contacts sheet not found"

**Solutions:**
1. Run script manually once to trigger auto-creation
2. Check spreadsheet name matches SPREADSHEET_NAME in SheetService
3. Verify script has Drive permissions
4. Manually create "OKColf_Contacts" spreadsheet if needed
5. Check sheet names match exactly (case-sensitive)

### Issue: Permission denied
**Symptoms:** "Permission denied" or "Authorization required"

**Solutions:**
1. Re-authorize script (Run > Authorize)
2. Check required scopes in appsscript.json
3. Verify Drive and Gmail permissions granted
4. Try with owner account (not shared account)

### Issue: Verification fails unexpectedly
**Symptoms:** Valid OTP shows as "invalid" or "expired"

**Debugging:**
1. Check timezone in appsscript.json (should be "Europe/Rome")
2. Verify OTP in sheet matches what user entered
3. Check expires_at timestamp format
4. Look for race conditions (multiple simultaneous requests)
5. Review execution logs for detailed error messages

**Debug query:**
```javascript
// Run from Apps Script editor
function debugOTP() {
  const email = 'test@example.com';
  const record = SheetService.findOtpRecord(email, 'ENTER_OTP_HERE');
  Logger.log(JSON.stringify(record, null, 2));
}
```

### Issue: Rate limiting not working
**Symptoms:** Can send multiple OTPs within 1 minute

**Causes:**
- Race condition (requests arrive simultaneously)
- Sheet update delay
- Not a critical issue - Gmail quota is the real limit

### Issue: Slow response times
**Symptoms:** Requests take >3 seconds

**Solutions:**
1. Check sheet size - cleanup old OTPs
2. Run `cleanupExpiredOtps()` manually
3. Verify no infinite loops in code
4. Check Apps Script quotas and limits
5. Consider spreadsheet caching (already implemented)

### Issue: Double verification succeeds
**Symptoms:** Same OTP can be verified twice

**This should not happen** - double-verification is prevented. If it does:
1. Check verified column is boolean (not string)
2. Verify updateOtpVerified() is being called
3. Check for race conditions
4. Review execution logs for both requests

### Getting Help

1. **Check execution logs:**
   - Apps Script Editor > Executions tab
   - Look for errors with timestamps

2. **Run diagnostics:**
   ```javascript
   testDeployment()
   testSheetService()
   ```

3. **Get statistics:**
   ```javascript
   SheetService.getStats()
   ```

4. **Enable debug logging:**
   All functions already log extensively. Check:
   - Logger.log() output
   - Execution logs
   - Email notifications (for critical errors)

## 📚 Resources

- [Apps Script Documentation](https://developers.google.com/apps-script)
- [GmailApp Reference](https://developers.google.com/apps-script/reference/gmail)
- [Spreadsheet Service](https://developers.google.com/apps-script/reference/spreadsheet)

## 👥 Support

For issues or questions, contact the OK Colf development team.