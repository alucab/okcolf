/**
 * SheetService.gs - Google Sheets Data Access Layer
 * 
 * Manages all interactions with Google Sheets storage:
 * - Spreadsheet creation and initialization
 * - OTP log operations (add, find, update, delete)
 * - Contact management (add, update, find)
 * - Data validation and error handling
 * 
 * @author OK Colf Team
 * @version 1.0
 */

const SheetService = {
  
  // Configuration
  SPREADSHEET_NAME: 'OKColf_Contacts',
  OTP_SHEET_NAME: 'otp_log',
  CONTACTS_SHEET_NAME: 'contacts',
  
  // Cache for spreadsheet (to avoid repeated lookups)
  _cachedSpreadsheet: null,
  
  /**
   * Get or create the main spreadsheet
   * Creates sheets with proper headers if they don't exist
   * 
   * @returns {Spreadsheet} The spreadsheet object
   */
  getOrCreateSpreadsheet() {
    // Return cached if available
    if (this._cachedSpreadsheet) {
      return this._cachedSpreadsheet;
    }
    
    try {
      // Try to find existing spreadsheet
      const files = DriveApp.getFilesByName(this.SPREADSHEET_NAME);
      
      if (files.hasNext()) {
        const file = files.next();
        this._cachedSpreadsheet = SpreadsheetApp.openById(file.getId());
        
        logInfo('Found existing spreadsheet', {
          id: this._cachedSpreadsheet.getId()
        });
        
        // Ensure sheets exist
        this._ensureSheetsExist(this._cachedSpreadsheet);
        
        return this._cachedSpreadsheet;
      }
      
    } catch (error) {
      logWarn('Error finding spreadsheet', error);
    }
    
    // Create new spreadsheet
    logInfo('Creating new spreadsheet', {
      name: this.SPREADSHEET_NAME
    });
    
    const spreadsheet = SpreadsheetApp.create(this.SPREADSHEET_NAME);
    this._cachedSpreadsheet = spreadsheet;
    
    // Initialize sheets
    this._initializeSheets(spreadsheet);
    
    // Send notification email to script owner
    this._notifySpreadsheetCreated(spreadsheet);
    
    return spreadsheet;
  },
  
  /**
   * Ensure required sheets exist in spreadsheet
   * 
   * @param {Spreadsheet} spreadsheet - The spreadsheet to check
   * @private
   */
  _ensureSheetsExist(spreadsheet) {
    const sheetNames = spreadsheet.getSheets().map(s => s.getName());
    
    if (!sheetNames.includes(this.OTP_SHEET_NAME)) {
      logWarn('OTP sheet missing, creating it');
      this._createOtpSheet(spreadsheet);
    }
    
    if (!sheetNames.includes(this.CONTACTS_SHEET_NAME)) {
      logWarn('Contacts sheet missing, creating it');
      this._createContactsSheet(spreadsheet);
    }
  },
  
  /**
   * Initialize sheets with headers
   * 
   * @param {Spreadsheet} spreadsheet - The spreadsheet to initialize
   * @private
   */
  _initializeSheets(spreadsheet) {
    // Remove default sheet if it exists
    const sheets = spreadsheet.getSheets();
    if (sheets.length === 1 && sheets[0].getName() === 'Sheet1') {
      spreadsheet.deleteSheet(sheets[0]);
    }
    
    // Create OTP log sheet
    this._createOtpSheet(spreadsheet);
    
    // Create contacts sheet
    this._createContactsSheet(spreadsheet);
    
    logInfo('Sheets initialized successfully');
  },
  
  /**
   * Create OTP log sheet with headers
   * 
   * @param {Spreadsheet} spreadsheet - The spreadsheet
   * @private
   */
  _createOtpSheet(spreadsheet) {
    const sheet = spreadsheet.insertSheet(this.OTP_SHEET_NAME);
    
    // Set headers
    const headers = ['email', 'otp', 'created_at', 'expires_at', 'verified', 'ip'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#667eea');
    headerRange.setFontColor('#ffffff');
    
    // Set column widths
    sheet.setColumnWidth(1, 250); // email
    sheet.setColumnWidth(2, 80);  // otp
    sheet.setColumnWidth(3, 180); // created_at
    sheet.setColumnWidth(4, 180); // expires_at
    sheet.setColumnWidth(5, 80);  // verified
    sheet.setColumnWidth(6, 120); // ip
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    logInfo('OTP sheet created');
    return sheet;
  },
  
  /**
   * Create contacts sheet with headers
   * 
   * @param {Spreadsheet} spreadsheet - The spreadsheet
   * @private
   */
  _createContactsSheet(spreadsheet) {
    const sheet = spreadsheet.insertSheet(this.CONTACTS_SHEET_NAME);
    
    // Set headers
    const headers = ['email', 'verified', 'verified_at', 'source', 'meta'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#764ba2');
    headerRange.setFontColor('#ffffff');
    
    // Set column widths
    sheet.setColumnWidth(1, 250); // email
    sheet.setColumnWidth(2, 80);  // verified
    sheet.setColumnWidth(3, 180); // verified_at
    sheet.setColumnWidth(4, 120); // source
    sheet.setColumnWidth(5, 200); // meta
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    logInfo('Contacts sheet created');
    return sheet;
  },
  
  /**
   * Send notification email when spreadsheet is created
   * 
   * @param {Spreadsheet} spreadsheet - The created spreadsheet
   * @private
   */
  _notifySpreadsheetCreated(spreadsheet) {
    try {
      const userEmail = Session.getActiveUser().getEmail();
      if (!userEmail) return;
      
      const subject = 'OK Colf: Spreadsheet Created';
      const body = `
The OK Colf OTP system has automatically created a new spreadsheet.

Spreadsheet Name: ${this.SPREADSHEET_NAME}
Spreadsheet ID: ${spreadsheet.getId()}
URL: ${spreadsheet.getUrl()}

Sheets created:
- ${this.OTP_SHEET_NAME}
- ${this.CONTACTS_SHEET_NAME}

This is an automated notification.
      `;
      
      MailApp.sendEmail(userEmail, subject, body);
      logInfo('Notification email sent to script owner');
      
    } catch (error) {
      logError('Failed to send notification email', error);
    }
  },
  
  /**
   * Add OTP record to log
   * 
   * @param {Object} record - OTP record object
   * @returns {number} Row number where record was added
   */
  addOtpLog(record) {
    return retryOperation(() => {
      const spreadsheet = this.getOrCreateSpreadsheet();
      const sheet = spreadsheet.getSheetByName(this.OTP_SHEET_NAME);
      
      if (!sheet) {
        throw new Error('OTP sheet not found');
      }
      
      // Sanitize and prepare row data
      const rowData = [
        sanitizeForSheet(record.email),
        sanitizeForSheet(record.otp),
        record.created_at,
        record.expires_at,
        record.verified || false,
        sanitizeForSheet(record.ip || 'unknown')
      ];
      
      // Append row
      sheet.appendRow(rowData);
      const lastRow = sheet.getLastRow();
      
      logInfo('OTP record added', {
        email: sanitizeEmail(record.email),
        row: lastRow
      });
      
      return lastRow;
      
    }, 3, 'addOtpLog');
  },
  
  /**
   * Find OTP record by email and code
   * 
   * @param {string} email - User email
   * @param {string} otp - OTP code
   * @returns {Object|null} OTP record with rowIndex, or null if not found
   */
  findOtpRecord(email, otp) {
    try {
      const spreadsheet = this.getOrCreateSpreadsheet();
      const sheet = spreadsheet.getSheetByName(this.OTP_SHEET_NAME);
      
      if (!sheet) {
        throw new Error('OTP sheet not found');
      }
      
      const data = sheet.getDataRange().getValues();
      
      // Skip header row, search from bottom (most recent first)
      for (let i = data.length - 1; i > 0; i--) {
        const row = data[i];
        
        // Check email and OTP match
        if (row[0] === email && row[1] === otp) {
          return {
            rowIndex: i + 1, // 1-based index
            email: row[0],
            otp: row[1],
            created_at: row[2],
            expires_at: row[3],
            verified: row[4],
            ip: row[5]
          };
        }
      }
      
      logInfo('OTP record not found', {
        email: sanitizeEmail(email)
      });
      
      return null;
      
    } catch (error) {
      logError('Error finding OTP record', error);
      throw error;
    }
  },
  
  /**
   * Find recent OTP for rate limiting
   * 
   * @param {string} email - User email
   * @param {number} withinMinutes - Time window in minutes
   * @returns {Object|null} Recent OTP record or null
   */
  findRecentOtp(email, withinMinutes) {
    try {
      const spreadsheet = this.getOrCreateSpreadsheet();
      const sheet = spreadsheet.getSheetByName(this.OTP_SHEET_NAME);
      
      if (!sheet) {
        throw new Error('OTP sheet not found');
      }
      
      const data = sheet.getDataRange().getValues();
      const now = new Date();
      const cutoffTime = new Date(now.getTime() - (withinMinutes * 60 * 1000));
      
      // Search from bottom (most recent first)
      for (let i = data.length - 1; i > 0; i--) {
        const row = data[i];
        
        if (row[0] === email) {
          const createdAt = new Date(row[2]);
          
          if (createdAt > cutoffTime) {
            return {
              email: row[0],
              created_at: row[2]
            };
          }
          
          // Since we're going backwards, if we found this email but it's old, we can stop
          break;
        }
      }
      
      return null;
      
    } catch (error) {
      logError('Error finding recent OTP', error);
      throw error;
    }
  },
  
  /**
   * Mark OTP as verified
   * 
   * @param {number} rowIndex - Row number to update (1-based)
   */
  updateOtpVerified(rowIndex) {
    try {
      const spreadsheet = this.getOrCreateSpreadsheet();
      const sheet = spreadsheet.getSheetByName(this.OTP_SHEET_NAME);
      
      if (!sheet) {
        throw new Error('OTP sheet not found');
      }
      
      // Update verified column (column 5)
      sheet.getRange(rowIndex, 5).setValue(true);
      
      logInfo('OTP marked as verified', {
        row: rowIndex
      });
      
    } catch (error) {
      logError('Error updating OTP verified status', error);
      throw error;
    }
  },
  
  /**
   * Add or update contact record
   * 
   * @param {Object} contact - Contact record object
   * @returns {string} 'added' or 'updated'
   */
  addOrUpdateContact(contact) {
    try {
      const spreadsheet = this.getOrCreateSpreadsheet();
      const sheet = spreadsheet.getSheetByName(this.CONTACTS_SHEET_NAME);
      
      if (!sheet) {
        throw new Error('Contacts sheet not found');
      }
      
      const data = sheet.getDataRange().getValues();
      
      // Check if contact already exists
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        
        if (row[0] === contact.email) {
          // Update existing contact
          const rowData = [
            contact.email,
            contact.verified || true,
            contact.verified_at,
            contact.source || 'otp_signup',
            contact.meta || ''
          ];
          
          sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
          
          logInfo('Contact updated', {
            email: sanitizeEmail(contact.email)
          });
          
          return 'updated';
        }
      }
      
      // Add new contact
      const rowData = [
        contact.email,
        contact.verified || true,
        contact.verified_at,
        contact.source || 'otp_signup',
        contact.meta || ''
      ];
      
      sheet.appendRow(rowData);
      
      logInfo('Contact added', {
        email: sanitizeEmail(contact.email)
      });
      
      return 'added';
      
    } catch (error) {
      logError('Error adding/updating contact', error);
      throw error;
    }
  },
  
  /**
   * Delete expired OTP records
   * 
   * @param {number} olderThanHours - Delete records older than this many hours
   * @returns {number} Number of records deleted
   */
  deleteExpiredOtps(olderThanHours) {
    try {
      const spreadsheet = this.getOrCreateSpreadsheet();
      const sheet = spreadsheet.getSheetByName(this.OTP_SHEET_NAME);
      
      if (!sheet) {
        throw new Error('OTP sheet not found');
      }
      
      const data = sheet.getDataRange().getValues();
      const now = new Date();
      const cutoffTime = new Date(now.getTime() - (olderThanHours * 60 * 60 * 1000));
      
      let deletedCount = 0;
      
      // Go backwards to avoid index shifting issues
      for (let i = data.length - 1; i > 0; i--) {
        const row = data[i];
        const createdAt = new Date(row[2]);
        
        if (createdAt < cutoffTime) {
          sheet.deleteRow(i + 1);
          deletedCount++;
        }
      }
      
      logInfo('Expired OTPs deleted', {
        count: deletedCount,
        olderThanHours: olderThanHours
      });
      
      return deletedCount;
      
    } catch (error) {
      logError('Error deleting expired OTPs', error);
      throw error;
    }
  },
  
  /**
   * Get statistics about stored data
   * Useful for monitoring
   * 
   * @returns {Object} Statistics object
   */
  getStats() {
    try {
      const spreadsheet = this.getOrCreateSpreadsheet();
      const otpSheet = spreadsheet.getSheetByName(this.OTP_SHEET_NAME);
      const contactsSheet = spreadsheet.getSheetByName(this.CONTACTS_SHEET_NAME);
      
      return {
        spreadsheetId: spreadsheet.getId(),
        spreadsheetUrl: spreadsheet.getUrl(),
        otpRecords: otpSheet ? otpSheet.getLastRow() - 1 : 0, // -1 for header
        contacts: contactsSheet ? contactsSheet.getLastRow() - 1 : 0,
        timestamp: getCurrentTimestamp()
      };
      
    } catch (error) {
      logError('Error getting stats', error);
      throw error;
    }
  }
};

/**
 * Test SheetService functionality
 * Run this manually to verify sheet operations
 * 
 * @returns {Object} Test results
 */
function testSheetService() {
  const results = {
    timestamp: getCurrentTimestamp(),
    tests: []
  };
  
  // Test 1: Get or create spreadsheet
  try {
    const spreadsheet = SheetService.getOrCreateSpreadsheet();
    results.tests.push({
      name: 'Get/Create Spreadsheet',
      passed: !!spreadsheet,
      details: `ID: ${spreadsheet.getId()}`
    });
  } catch (error) {
    results.tests.push({
      name: 'Get/Create Spreadsheet',
      passed: false,
      error: error.message
    });
  }
  
  // Test 2: Add OTP log
  try {
    const testEmail = 'test-' + Date.now() + '@example.com';
    const rowNum = SheetService.addOtpLog({
      email: testEmail,
      otp: '123456',
      created_at: getCurrentTimestamp(),
      expires_at: getExpirationTimestamp(5),
      verified: false,
      ip: 'test'
    });
    
    results.tests.push({
      name: 'Add OTP Log',
      passed: rowNum > 1,
      details: `Row: ${rowNum}`
    });
  } catch (error) {
    results.tests.push({
      name: 'Add OTP Log',
      passed: false,
      error: error.message
    });
  }
  
  // Test 3: Get stats
  try {
    const stats = SheetService.getStats();
    results.tests.push({
      name: 'Get Statistics',
      passed: stats.otpRecords >= 0,
      details: `OTPs: ${stats.otpRecords}, Contacts: ${stats.contacts}`
    });
  } catch (error) {
    results.tests.push({
      name: 'Get Statistics',
      passed: false,
      error: error.message
    });
  }
  
  // Summary
  const passed = results.tests.filter(t => t.passed).length;
  const total = results.tests.length;
  results.summary = `${passed}/${total} tests passed`;
  results.allPassed = passed === total;
  
  Logger.log('=== SheetService Test Results ===');
  Logger.log(JSON.stringify(results, null, 2));
  
  return results;
}