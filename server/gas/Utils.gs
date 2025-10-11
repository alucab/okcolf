/**
 * Utils.gs - Utility functions for OK Colf OTP System
 * 
 * Provides helper functions for:
 * - CORS header management
 * - Logging (info, warning, error)
 * - Date/time handling
 * - Random number generation
 * 
 * @author OK Colf Team
 * @version 1.0
 */

/**
 * Set CORS headers on response output
 * Allows requests from approved domains only
 * 
 * @param {ContentService.TextOutput} output - Response output object
 * @param {string} requestOrigin - Origin from request headers (optional)
 */
function setCorsHeaders(output, requestOrigin = null) {
  // Allowed origins for CORS
  const allowedOrigins = [
    'https://okcolf.it',
    'https://www.okcolf.it',
    'https://alucab.github.io',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080'
  ];
  
  // Determine which origin to allow
  let allowedOrigin = '*'; // Default fallback
  
  // If request origin is provided and is in allowed list, use it
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    allowedOrigin = requestOrigin;
    logInfo('CORS: Allowing specific origin', { origin: requestOrigin });
  } else if (requestOrigin) {
    logWarn('CORS: Origin not in allowed list', { origin: requestOrigin });
  }
  
  // Set CORS headers
  output.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  output.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  output.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  output.setHeader('Access-Control-Allow-Credentials', 'false');
}

/**
 * Check if origin is allowed for CORS
 * 
 * @param {string} origin - Origin to check
 * @returns {boolean} True if origin is allowed
 */
function isOriginAllowed(origin) {
  if (!origin) return false;
  
  const allowedOrigins = [
    'https://okcolf.it',
    'https://www.okcolf.it',
    'https://alucab.github.io',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080'
  ];
  
  // Exact match
  if (allowedOrigins.includes(origin)) {
    return true;
  }
  
  // Pattern matching for GitHub Pages (user.github.io)
  if (origin.match(/^https:\/\/[\w-]+\.github\.io$/)) {
    logInfo('CORS: GitHub Pages origin detected', { origin });
    return true;
  }
  
  return false;
}

/**
 * Get request origin from event object
 * Apps Script doesn't always provide this, so we do our best
 * 
 * @param {Object} e - Event object from doPost/doGet
 * @returns {string|null} Origin or null
 */
function getRequestOrigin(e) {
  // Try to get from parameters (some clients send it)
  if (e && e.parameter && e.parameter.origin) {
    return e.parameter.origin;
  }
  
  // Try to get from headers (Apps Script may expose this)
  if (e && e.headers && e.headers.Origin) {
    return e.headers.Origin;
  }
  
  if (e && e.headers && e.headers.origin) {
    return e.headers.origin;
  }
  
  // Apps Script limitation: headers not always available
  return null;
}

/**
 * Test CORS configuration
 * Run this manually to verify CORS setup
 * 
 * @returns {Object} Test results
 */
function testCORS() {
  const results = {
    timestamp: getCurrentTimestamp(),
    tests: []
  };
  
  // Test allowed origins
  const testOrigins = [
    { origin: 'https://okcolf.it', shouldAllow: true },
    { origin: 'https://www.okcolf.it', shouldAllow: true },
    { origin: 'https://alucab.github.io', shouldAllow: true },
    { origin: 'http://localhost:5173', shouldAllow: true },
    { origin: 'https://evil.com', shouldAllow: false },
    { origin: 'https://test.github.io', shouldAllow: true }, // GitHub Pages pattern
    { origin: null, shouldAllow: false }
  ];
  
  testOrigins.forEach(test => {
    const allowed = isOriginAllowed(test.origin);
    const passed = allowed === test.shouldAllow;
    
    results.tests.push({
      origin: test.origin || 'null',
      expected: test.shouldAllow ? 'allow' : 'deny',
      actual: allowed ? 'allow' : 'deny',
      passed: passed
    });
  });
  
  // Summary
  const passed = results.tests.filter(t => t.passed).length;
  const total = results.tests.length;
  results.summary = `${passed}/${total} CORS tests passed`;
  results.allPassed = passed === total;
  
  Logger.log('=== CORS Test Results ===');
  Logger.log(JSON.stringify(results, null, 2));
  
  return results;
}

/**
 * Log informational message
 * 
 * @param {string} message - Log message
 * @param {Object} data - Optional data object to log
 */
function logInfo(message, data = null) {
  const timestamp = new Date().toISOString();
  let logMessage = `[INFO] ${timestamp} - ${message}`;
  
  if (data) {
    logMessage += ' | ' + JSON.stringify(data);
  }
  
  Logger.log(logMessage);
  
  // Also log to Console for better debugging in Apps Script
  console.info(message, data || '');
}

/**
 * Log warning message
 * 
 * @param {string} message - Warning message
 * @param {Object} data - Optional data object to log
 */
function logWarn(message, data = null) {
  const timestamp = new Date().toISOString();
  let logMessage = `[WARN] ${timestamp} - ${message}`;
  
  if (data) {
    logMessage += ' | ' + JSON.stringify(data);
  }
  
  Logger.log(logMessage);
  console.warn(message, data || '');
}

/**
 * Log error message with stack trace
 * 
 * @param {string} message - Error message
 * @param {Error} error - Error object
 */
function logError(message, error) {
  const timestamp = new Date().toISOString();
  let logMessage = `[ERROR] ${timestamp} - ${message}`;
  
  if (error) {
    logMessage += ` | ${error.message}`;
    if (error.stack) {
      logMessage += `\nStack: ${error.stack}`;
    }
  }
  
  Logger.log(logMessage);
  console.error(message, error);
  
  // In production, you might want to send critical errors to admin
  if (shouldNotifyAdmin(error)) {
    notifyAdminOfError(message, error);
  }
}

/**
 * Determine if admin should be notified of this error
 * 
 * @param {Error} error - Error object
 * @returns {boolean} True if admin notification needed
 */
function shouldNotifyAdmin(error) {
  if (!error) return false;
  
  // Notify on critical errors only
  const criticalKeywords = [
    'Permission denied',
    'Quota exceeded',
    'Service unavailable',
    'Database error'
  ];
  
  return criticalKeywords.some(keyword => 
    error.message && error.message.includes(keyword)
  );
}

/**
 * Send error notification to admin
 * 
 * @param {string} message - Error context
 * @param {Error} error - Error object
 */
function notifyAdminOfError(message, error) {
  try {
    const adminEmail = Session.getActiveUser().getEmail();
    if (!adminEmail) return;
    
    const subject = 'OK Colf: Critical Error Alert';
    const body = `
Critical error in OK Colf OTP System:

Context: ${message}
Error: ${error.message}
Time: ${new Date().toISOString()}

Stack Trace:
${error.stack || 'N/A'}

Please investigate immediately.
    `;
    
    MailApp.sendEmail(adminEmail, subject, body);
  } catch (notifyError) {
    console.error('Failed to notify admin:', notifyError);
  }
}

/**
 * Generate random 6-digit OTP
 * 
 * @returns {string} 6-digit numeric string
 */
function generateOTP() {
  const min = 100000;
  const max = 999999;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp.toString();
}

/**
 * Get current timestamp as ISO string
 * 
 * @returns {string} ISO 8601 timestamp
 */
function getCurrentTimestamp() {
  return new Date().toISOString();
}

/**
 * Calculate expiration timestamp (current time + minutes)
 * 
 * @param {number} minutes - Minutes to add
 * @returns {string} ISO 8601 timestamp
 */
function getExpirationTimestamp(minutes) {
  const now = new Date();
  const expiration = new Date(now.getTime() + (minutes * 60 * 1000));
  return expiration.toISOString();
}

/**
 * Check if timestamp has expired
 * 
 * @param {string} timestamp - ISO 8601 timestamp to check
 * @returns {boolean} True if expired
 */
function isExpired(timestamp) {
  const expirationDate = new Date(timestamp);
  const now = new Date();
  return now > expirationDate;
}

/**
 * Format date for display in emails (Italian format)
 * 
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDateItalian(date) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('it-IT', options);
}

/**
 * Get client IP from request (if available)
 * Note: This may not always be available in Google Apps Script
 * 
 * @param {Object} e - Event object from doPost
 * @returns {string} IP address or 'unknown'
 */
function getClientIP(e) {
  // Apps Script doesn't directly expose client IP in most cases
  // This is a placeholder for potential future implementation
  return 'unknown';
}

/**
 * Sanitize email for logging (partial masking)
 * 
 * @param {string} email - Email to sanitize
 * @returns {string} Partially masked email
 */
function sanitizeEmail(email) {
  if (!email || !email.includes('@')) return '***';
  
  const [local, domain] = email.split('@');
  const maskedLocal = local.length > 2 
    ? local[0] + '***' + local[local.length - 1]
    : '***';
  
  return `${maskedLocal}@${domain}`;
}

/**
 * Sanitize value for sheet insertion (prevent formula injection)
 * 
 * @param {*} value - Value to sanitize
 * @returns {*} Sanitized value
 */
function sanitizeForSheet(value) {
  if (typeof value === 'string') {
    // Prevent formula injection by prefixing with single quote
    const dangerousChars = ['=', '+', '-', '@', '\t', '\r'];
    if (dangerousChars.some(char => value.startsWith(char))) {
      return "'" + value;
    }
  }
  return value;
}

/**
 * Retry operation with exponential backoff
 * 
 * @param {Function} operation - Operation to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {string} operationName - Name for logging
 * @returns {*} Result of operation
 */
function retryOperation(operation, maxRetries = 3, operationName = 'operation') {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on permanent errors
      if (error.message && (
        error.message.includes('Permission denied') ||
        error.message.includes('not found') ||
        error.message.includes('Invalid')
      )) {
        throw error;
      }
      
      if (attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        logWarn(`${operationName} failed, retrying in ${waitTime}ms`, {
          attempt: attempt + 1,
          error: error.message
        });
        Utilities.sleep(waitTime);
      }
    }
  }
  
  logError(`${operationName} failed after ${maxRetries} attempts`, lastError);
  throw lastError;
}