# Google Sheets Schema - OK Colf OTP System

## Spreadsheet Configuration

**Name:** `OKColf_Contacts`  
**Location:** Google Drive (auto-created by script)  
**Access:** Script owner only (via Apps Script permissions)

---

## Sheet 1: otp_log

Stores temporary OTP records for verification.

### Columns

| Column | Type | Description | Validation | Example |
|--------|------|-------------|------------|---------|
| **email** | String | User's email address | Email format | user@example.com |
| **otp** | String | 6-digit verification code | 6 numeric digits | 123456 |
| **created_at** | DateTime | Generation timestamp | ISO 8601 | 2025-01-15T10:30:00.000Z |
| **expires_at** | DateTime | Expiration timestamp (+5min) | ISO 8601 | 2025-01-15T10:35:00.000Z |
| **verified** | Boolean | Verification status | TRUE/FALSE | FALSE |
| **ip** | String | Client IP (if available) | Text | unknown |

### Header Formatting

- **Background:** #667eea (purple gradient)
- **Font:** Bold, white
- **Frozen:** Row 1

### Column Widths

- email: 250px
- otp: 80px
- created_at: 180px
- expires_at: 180px
- verified: 80px
- ip: 120px

### Data Lifecycle

- **Creation:** On OTP generation
- **Update:** When verified (verified → TRUE)
- **Deletion:** After 24 hours (daily cleanup)
- **Retention:** Historical data cleared, emails preserved in contacts

### Indexes

Search optimized by:

- Bottom-up iteration (most recent first)
- Email + OTP combination lookup

### Sample Data

```
email                 | otp    | created_at            | expires_at            | verified | ip
---------------------|--------|----------------------|----------------------|----------|--------
user@example.com     | 123456 | 2025-01-15T10:30:00Z | 2025-01-15T10:35:00Z | FALSE    | unknown
test@test.com        | 789012 | 2025-01-15T10:25:00Z | 2025-01-15T10:30:00Z | TRUE     | unknown
```

---

## Sheet 2: contacts

Stores verified user records permanently.

### Columns

| Column | Type | Description | Validation | Example |
|--------|------|-------------|------------|---------|
| **email** | String | Verified user email | Email format, unique | user@example.com |
| **verified** | Boolean | Verification status | Always TRUE | TRUE |
| **verified_at** | DateTime | Verification timestamp | ISO 8601 | 2025-01-15T10:30:15.000Z |
| **source** | String | Registration source | Text | otp_signup |
| **meta** | String | Optional metadata | Text | (browser info, referrer) |

### Header Formatting

- **Background:** #764ba2 (purple gradient)
- **Font:** Bold, white
- **Frozen:** Row 1

### Column Widths

- email: 250px
- verified: 80px
- verified_at: 180px
- source: 120px
- meta: 200px

### Data Lifecycle

- **Creation:** On successful OTP verification
- **Update:** If user re-verifies (updates verified_at)
- **Deletion:** Manual only (no automatic cleanup)
- **Retention:** Permanent

### Constraints

- Email is effectively unique (upsert logic in script)
- verified field always TRUE for records in this sheet

### Sample Data

```
email                 | verified | verified_at          | source      | meta
---------------------|----------|---------------------|-------------|------
user@example.com     | TRUE     | 2025-01-15T10:30:15Z | otp_signup  |
test@test.com        | TRUE     | 2025-01-15T10:25:30Z | otp_signup  |
```

---

## Relationships

```
otp_log.email → contacts.email
  - One-to-many: Multiple OTP attempts per email
  - On verification: OTP marked verified, contact added/updated
```

---

## Data Flow

### Registration Flow

1. User requests OTP → Row added to `otp_log` (verified=FALSE)
2. Email sent with OTP code
3. User submits OTP → `otp_log` row found and checked
4. If valid → `otp_log` row updated (verified=TRUE)
5. Contact added/updated in `contacts` sheet

### Cleanup Flow

1. Daily trigger runs `cleanupExpiredOtps()`
2. Finds `otp_log` rows older than 24 hours
3. Deletes expired rows
4. Preserves all `contacts` records

---

## Manual Sheet Creation

If auto-creation fails, create manually:

### Step 1: Create Spreadsheet

1. Go to Google Drive
2. New → Google Sheets
3. Name: `OKColf_Contacts`

### Step 2: Create otp_log Sheet

1. Rename Sheet1 to `otp_log`
2. Add headers in row 1: `email`, `otp`, `created_at`, `expires_at`, `verified`, `ip`
3. Format header: Bold, background #667eea, white text
4. Set column widths as specified above
5. View → Freeze → 1 row

### Step 3: Create contacts Sheet

1. Add new sheet (+ button)
2. Name: `contacts`
3. Add headers in row 1: `email`, `verified`, `verified_at`, `source`, `meta`
4. Format header: Bold, background #764ba2, white text
5. Set column widths as specified above
6. View → Freeze → 1 row

### Step 4: Link to Script

- Script auto-detects by spreadsheet name
- Or update `SPREADSHEET_NAME` in SheetService.gs

---

## Data Validation (Optional)

Apply these rules for data integrity:

### otp_log Sheet

- **email** (Column A): Custom formula `=ISVALID_EMAIL(A2)`
- **otp** (Column B): Text length exactly 6, numbers only
- **verified** (Column E): Checkbox

### contacts Sheet

- **email** (Column A): Custom formula `=ISVALID_EMAIL(A2)`
- **verified** (Column B): Checkbox (always checked)

---

## Backup & Recovery

### Automated Backups

Google Sheets auto-saves and maintains version history.

### Manual Export

1. File → Download → CSV (per sheet)
2. Or: File → Make a copy

### Recovery

1. File → Version history
2. Restore previous version if needed

---

## Monitoring

### Check Data Health

```javascript
// Run from Apps Script editor
SheetService.getStats()
```

Returns:

- Total OTP records
- Total verified contacts
- Spreadsheet URL

### Common Issues

- **Duplicate emails in contacts:** Upsert logic should prevent this
- **OTPs not expiring:** Check timezone in appsscript.json
- **Sheet not found:** Run script once to trigger auto-creation

---

## Performance Considerations

### Current Scale

- Expected: 10-100 OTPs/day
- Max: 1,500 OTPs/day (Gmail Workspace limit)
- Sheet limit: 10 million cells

### Optimization

- Bottom-up search (most recent first)
- Daily cleanup prevents table bloat
- Spreadsheet caching in script

### When to Scale Beyond Sheets
>
- >10,000 contacts
- >1,000 OTPs/day
- Sub-second response requirements
- Multiple concurrent editors

Consider: Cloud Firestore, PostgreSQL, or dedicated database.

---

## Security Notes

- **Access:** Only script owner can view/edit
- **PII:** Email addresses only, no other personal data
- **Retention:** OTPs deleted after 24h, contacts permanent
- **Audit:** All operations logged in Apps Script execution logs