# OK Colf - OTP System Deployment Guide

Complete guide for deploying the Google Apps Script backend and connecting it to the frontend PWA.

---

## Prerequisites

- Google Account (Gmail or Workspace)
- Access to [script.google.com](https://script.google.com)
- Access to Google Drive
- Text editor for frontend configuration
- Chrome/Firefox for testing

---

## Part 1: Google Apps Script Setup

### 1.1 Create Apps Script Project

1. Go to [script.google.com](https://script.google.com)
2. Click **New Project**
3. Name: "OK Colf OTP System"
4. Save (Ctrl+S / Cmd+S)

### 1.2 Add Script Files

Copy each file from `server/gas/` into the Apps Script editor:

**File 1: Code.gs**
1. Delete default `myFunction()`
2. Create new file: Click + next to Files
3. Name: `Code`
4. Paste contents of `server/gas/Code.gs`

**File 2: OTPService.gs**
1. Add new file
2. Name: `OTPService`
3. Paste contents

**File 3: SheetService.gs**
1. Add new file
2. Name: `SheetService`
3. Paste contents

**File 4: Utils.gs**
1. Add new file
2. Name: `Utils`
3. Paste contents

**File 5: appsscript.json**
1. Click ⚙️ (Project Settings)
2. Check "Show appsscript.json"
3. Click < back to editor
4. Click `appsscript.json` in file list
5. Replace contents with `server/gas/appsscript.json`

### 1.3 Configure Email Sender

In `OTPService.gs`, update if needed:
```javascript
SENDER_EMAIL: 'noreply@okcolf.it',
SENDER_NAME: 'OK Colf',
```

**Note:** Gmail accounts can send from their own address only. Custom domains require Google Workspace.

### 1.4 Test Backend

Run tests from Apps Script editor:

1. Select function: `testDeployment`
2. Click ▶️ Run
3. **First run:** Authorize permissions (Gmail, Sheets, Drive)
4. Check Execution log (View → Logs)
5. Should show: "All tests passed"

**Troubleshooting authorization:**
- Click "Advanced" → "Go to OK Colf OTP System (unsafe)"
- Review permissions carefully
- Grant access

### 1.5 Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Type: **Web app**
3. Configuration:
   - Description: "OTP API v1"
   - Execute as: **Me**
   - Who has access: **Anyone, even anonymous**
4. Click **Deploy**
5. **Copy the Web App URL** (looks like `https://script.google.com/macros/s/AKfycby.../exec`)
6. Save this URL - you'll need it for frontend

### 1.6 Test Deployment

From Apps Script editor:

```javascript
testFullOTPFlow()
```

Or test via curl:
```bash
curl -X POST "YOUR_WEB_APP_URL?path=health" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Should return: `{"success":true,"status":"ok"}`

---

## Part 2: Google Sheets Setup

### 2.1 Verify Auto-Creation

The script auto-creates the spreadsheet. To verify:

1. Go to [drive.google.com](https://drive.google.com)
2. Search for "OKColf_Contacts"
3. Should see spreadsheet with 2 sheets: `otp_log`, `contacts`

### 2.2 Manual Creation (if needed)

If auto-creation failed:

1. Create new Google Sheet
2. Name: `OKColf_Contacts`
3. Create sheets as per `SHEETS_SCHEMA.md`
4. Run `testSheetService()` in Apps Script

---

## Part 3: Frontend Configuration

### 3.1 Update API Configuration

Edit `js/conf.js`:

```javascript
const GAS_CONFIG = {
  API_URL: 'YOUR_WEB_APP_URL_HERE', // Paste from step 1.5
  USE_MOCK: false,  // Change to false for production
  TIMEOUT: 10000
};
```

### 3.2 Test Frontend Integration

1. Open app in browser
2. Open DevTools Console
3. Run:
```javascript
await Tests.Backend.testAPIConnection()
```

Should show: "Backend API reachable"

### 3.3 Full Flow Test

```javascript
await Tests.Backend.testRealOTPFlow()
```

- Enter real email
- Check inbox for OTP
- Enter OTP in prompt
- Verify success

---

## Part 4: Daily Cleanup Trigger

### 4.1 Create Time-Driven Trigger

1. In Apps Script editor: Click ⏰ (Triggers)
2. Click **+ Add Trigger**
3. Configuration:
   - Function: `cleanupExpiredOtps`
   - Event source: **Time-driven**
   - Type: **Day timer**
   - Time: **2am to 3am**
4. Save

###