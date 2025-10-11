/**
 * Code.gs - Main entry point for OK Colf OTP Web App
 * 
 * This Google Apps Script handles HTTP POST requests for OTP generation and verification.
 * It routes requests to appropriate service functions and manages CORS headers.
 * 
 * Endpoints:
 * - POST /send_otp    - Generate and send OTP via email
 * - POST /verify_otp  - Verify OTP and register user
 * 
 * @author OK Colf Team
 * @version 1.0
 */

/**
 * Main entry point for HTTP POST requests
 * Handles routing, CORS, and error responses
 * 
 * @param {Object} e - Event object containing request parameters
 * @returns {ContentService.TextOutput} JSON response
 */
function doPost(e) {
  const startTime = Date.now();
  const requestOrigin = getRequestOrigin(e);
  
  try {
    // Validate request has post data
    if (!e || !e.postData) {
      logWarn('Request missing postData');
      return createJsonResponse({
        success: false,
        error: 'invalid_request',
        message: 'Richiesta non valida'
      }, 400, false, requestOrigin);
    }

    // Extract and validate content type
    const contentType = e.postData.type;
    if (contentType && contentType !== 'application/json') {
      logWarn('Invalid content type', { contentType });
      return createJsonResponse({
        success: false,
        error: 'invalid_content_type',
        message: 'Content-Type deve essere application/json'
      }, 400, false, requestOrigin);
    }

    // Parse JSON payload with enhanced error handling
    let payload;
    try {
      const rawContent = e.postData.contents;
      
      // Check for empty payload
      if (!rawContent || rawContent.trim() === '') {
        logWarn('Empty request body');
        return createJsonResponse({
          success: false,
          error: 'empty_payload',
          message: 'Corpo della richiesta vuoto'
        }, 400, false, requestOrigin);
      }
      
      payload = JSON.parse(rawContent);
      
      // Validate payload is an object
      if (!payload || typeof payload !== 'object') {
        logWarn('Payload is not an object', { type: typeof payload });
        return createJsonResponse({
          success: false,
          error: 'invalid_payload',
          message: 'Payload deve essere un oggetto JSON'
        }, 400, false, requestOrigin);
      }
      
    } catch (parseError) {
      logError('JSON parse error', parseError);
      return createJsonResponse({
        success: false,
        error: 'invalid_json',
        message: 'Formato JSON non valido'
      }, 400, false, requestOrigin);
    }

    // Extract path for routing (support multiple formats)
    // Priority: query param > payload.path > payload.endpoint
    const path = e.parameter.path || payload.path || payload.endpoint || '';
    
    // Normalize path (remove leading slash, lowercase)
    const normalizedPath = path.replace(/^\/+/, '').toLowerCase();
    
    // Log sanitized request info
    logInfo('Processing request', {
      path: normalizedPath,
      origin: requestOrigin || 'unknown',
      email: payload.email ? sanitizeEmail(payload.email) : 'none',
      hasOtp: !!payload.otp
    });
    
    // Route to appropriate handler
    let response;
    
    switch (normalizedPath) {
      case 'send_otp':
      case 'sendotp':
        response = handleSendOtp(payload);
        break;
        
      case 'verify_otp':
      case 'verifyotp':
        response = handleVerifyOtp(payload);
        break;
        
      case 'health':
      case 'ping':
        // Health check endpoint
        response = {
          success: true,
          status: 'ok',
          timestamp: getCurrentTimestamp(),
          version: '1.0'
        };
        break;
        
      default:
        logWarn('Unknown endpoint requested', { path: normalizedPath });
        response = {
          success: false,
          error: 'unknown_endpoint',
          message: `Endpoint '${normalizedPath}' non trovato`,
          availableEndpoints: ['send_otp', 'verify_otp', 'health']
        };
        return createJsonResponse(response, 404, false, requestOrigin);
    }
    
    // Log execution time
    const executionTime = Date.now() - startTime;
    logInfo('Request completed', {
      path: normalizedPath,
      success: response.success,
      executionTimeMs: executionTime
    });
    
    return createJsonResponse(response, 200, false, requestOrigin);
    
  } catch (error) {
    // Log unhandled errors with full context
    const executionTime = Date.now() - startTime;
    logError('Unhandled error in doPost', error);
    logError('Error context', {
      executionTimeMs: executionTime,
      errorMessage: error.message,
      errorStack: error.stack
    });
    
    return createJsonResponse({
      success: false,
      error: 'server_error',
      message: 'Errore interno del server. Riprova più tardi.'
    }, 500, false, requestOrigin);
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 * Required for cross-origin requests from the PWA
 * 
 * @param {Object} e - Event object
 * @returns {ContentService.TextOutput} Empty response with CORS headers
 */
function doOptions(e) {
  const origin = getRequestOrigin(e);
  
  logInfo('CORS preflight request', {
    origin: origin || 'unknown'
  });
  
  const output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Set CORS headers with origin validation
  setCorsHeaders(output, origin);
  
  return output;
}

/**
 * Handle /send_otp endpoint
 * Validates email and initiates OTP generation
 * 
 * @param {Object} payload - Request payload with email
 * @returns {Object} Response object
 */
function handleSendOtp(payload) {
  // Validate email parameter
  if (!payload.email) {
    logWarn('send_otp: missing email');
    return {
      success: false,
      error: 'missing_email',
      message: 'Email richiesta'
    };
  }
  
  // Trim and lowercase email
  const email = payload.email.trim().toLowerCase();
  
  // Validate email format
  if (!isValidEmail(email)) {
    logWarn('send_otp: invalid email format', { email: sanitizeEmail(email) });
    return {
      success: false,
      error: 'invalid_email',
      message: 'Formato email non valido'
    };
  }
  
  // Check for recent OTP requests (basic rate limiting)
  try {
    const recentOtp = SheetService.findRecentOtp(email, 1); // Within 1 minute
    if (recentOtp) {
      logWarn('send_otp: rate limit hit', { email: sanitizeEmail(email) });
      return {
        success: false,
        error: 'rate_limit',
        message: 'Attendi 1 minuto prima di richiedere un nuovo codice'
      };
    }
  } catch (error) {
    // Log but don't fail - rate limiting is optional
    logError('Rate limit check failed', error);
  }
  
  // Call OTP service to generate and send
  try {
    const result = OTPService.sendOtp(email);
    
    if (result.success) {
      logInfo('OTP sent successfully', { email: sanitizeEmail(email) });
    } else {
      logWarn('OTP send failed', { 
        email: sanitizeEmail(email),
        error: result.error 
      });
    }
    
    return result;
    
  } catch (error) {
    logError('Error in handleSendOtp', error);
    return {
      success: false,
      error: 'send_failed',
      message: 'Impossibile inviare il codice. Riprova.'
    };
  }
}

/**
 * Handle /verify_otp endpoint
 * Validates OTP and registers user
 * 
 * @param {Object} payload - Request payload with email and otp
 * @returns {Object} Response object
 */
function handleVerifyOtp(payload) {
  // Validate required parameters
  if (!payload.email || !payload.otp) {
    logWarn('verify_otp: missing parameters', {
      hasEmail: !!payload.email,
      hasOtp: !!payload.otp
    });
    return {
      success: false,
      error: 'missing_parameters',
      message: 'Email e codice richiesti'
    };
  }
  
  // Trim and normalize inputs
  const email = payload.email.trim().toLowerCase();
  const otp = payload.otp.trim();
  
  // Validate email format
  if (!isValidEmail(email)) {
    logWarn('verify_otp: invalid email format', { email: sanitizeEmail(email) });
    return {
      success: false,
      error: 'invalid_email',
      message: 'Formato email non valido'
    };
  }
  
  // Validate OTP format (6 digits)
  if (!/^\d{6}$/.test(otp)) {
    logWarn('verify_otp: invalid OTP format', { 
      email: sanitizeEmail(email),
      otpLength: otp.length 
    });
    return {
      success: false,
      error: 'invalid_otp_format',
      message: 'Il codice deve essere 6 cifre'
    };
  }
  
  // Call OTP service to verify
  try {
    const result = OTPService.verifyOtp(email, otp);
    
    if (result.success) {
      logInfo('OTP verified successfully', { email: sanitizeEmail(email) });
    } else {
      logWarn('OTP verification failed', { 
        email: sanitizeEmail(email),
        error: result.error 
      });
    }
    
    return result;
    
  } catch (error) {
    logError('Error in handleVerifyOtp', error);
    return {
      success: false,
      error: 'verification_failed',
      message: 'Impossibile verificare il codice. Riprova.'
    };
  }
}

/**
 * Create JSON response with proper headers and CORS
 * 
 * @param {Object} data - Response data object
 * @param {number} statusCode - HTTP status code (default 200)
 * @param {boolean} optionsRequest - Whether this is an OPTIONS request
 * @param {string} requestOrigin - Origin from request (optional)
 * @returns {ContentService.TextOutput} Formatted response
 */
function createJsonResponse(data, statusCode = 200, optionsRequest = false, requestOrigin = null) {
  // Create output with JSON or empty content
  const output = ContentService.createTextOutput(
    optionsRequest ? '' : JSON.stringify(data)
  );
  
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers with origin validation
  setCorsHeaders(output, requestOrigin);
  
  // Add custom status code header (Apps Script doesn't support real HTTP status codes)
  // Frontend can check this header if needed
  output.setHeader('X-Status-Code', statusCode.toString());
  
  // Add timestamp header for debugging
  output.setHeader('X-Timestamp', getCurrentTimestamp());
  
  // Add version header
  output.setHeader('X-API-Version', '1.0');
  
  return output;
}

/**
 * Basic email validation with enhanced checks
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid format
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  
  // Trim whitespace
  email = email.trim();
  
  // Check minimum length
  if (email.length < 5) return false;
  
  // Check maximum length (RFC 5321)
  if (email.length > 254) return false;
  
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  // Check for multiple @ symbols
  if (email.split('@').length !== 2) return false;
  
  // Check local and domain parts
  const [local, domain] = email.split('@');
  
  // Local part checks
  if (local.length === 0 || local.length > 64) return false;
  if (local.startsWith('.') || local.endsWith('.')) return false;
  if (local.includes('..')) return false;
  
  // Domain part checks
  if (domain.length === 0 || domain.length > 253) return false;
  if (domain.startsWith('.') || domain.endsWith('.')) return false;
  if (domain.includes('..')) return false;
  if (!domain.includes('.')) return false;
  
  return true;
}

/**
 * Test function to verify deployment
 * Run this manually from the Apps Script editor to test configuration
 * 
 * @returns {Object} Test results
 */
function testDeployment() {
  const results = {
    timestamp: getCurrentTimestamp(),
    tests: []
  };
  
  // Test 1: Utility functions
  try {
    const testOtp = generateOTP();
    results.tests.push({
      name: 'OTP Generation',
      passed: /^\d{6}$/.test(testOtp),
      details: `Generated: ${testOtp}`
    });
  } catch (error) {
    results.tests.push({
      name: 'OTP Generation',
      passed: false,
      error: error.message
    });
  }
  
  // Test 2: Email validation
  const validEmail = 'test@example.com';
  const invalidEmail = 'invalid.email';
  results.tests.push({
    name: 'Email Validation',
    passed: isValidEmail(validEmail) && !isValidEmail(invalidEmail),
    details: `Valid: ${validEmail}, Invalid: ${invalidEmail}`
  });
  
  // Test 3: Timestamp functions
  try {
    const now = getCurrentTimestamp();
    const future = getExpirationTimestamp(5);
    results.tests.push({
      name: 'Timestamp Functions',
      passed: now < future,
      details: `Now: ${now}, +5min: ${future}`
    });
  } catch (error) {
    results.tests.push({
      name: 'Timestamp Functions',
      passed: false,
      error: error.message
    });
  }
  
  // Test 4: Spreadsheet access
  try {
    const spreadsheet = SheetService.getOrCreateSpreadsheet();
    results.tests.push({
      name: 'Spreadsheet Access',
      passed: !!spreadsheet,
      details: `Spreadsheet ID: ${spreadsheet.getId()}`
    });
  } catch (error) {
    results.tests.push({
      name: 'Spreadsheet Access',
      passed: false,
      error: error.message
    });
  }
  
  // Test 5: Formula injection prevention
  try {
    const dangerous = '=1+1';
    const safe = sanitizeForSheet(dangerous);
    results.tests.push({
      name: 'Formula Injection Prevention',
      passed: safe.startsWith("'"),
      details: `Input: ${dangerous}, Output: ${safe}`
    });
  } catch (error) {
    results.tests.push({
      name: 'Formula Injection Prevention',
      passed: false,
      error: error.message
    });
  }
  
  // Test 6: Retry mechanism
  try {
    let attempts = 0;
    const result = retryOperation(() => {
      attempts++;
      if (attempts < 2) throw new Error('Temporary failure');
      return 'success';
    }, 3, 'test');
    
    results.tests.push({
      name: 'Retry Mechanism',
      passed: result === 'success' && attempts === 2,
      details: `Attempts: ${attempts}, Result: ${result}`
    });
  } catch (error) {
    results.tests.push({
      name: 'Retry Mechanism',
      passed: false,
      error: error.message
    });
  }
  
  // Test 7: CORS validation
  try {
    const corsResults = testCORS();
    results.tests.push({
      name: 'CORS Configuration',
      passed: corsResults.allPassed,
      details: corsResults.summary
    });
  } catch (error) {
    results.tests.push({
      name: 'CORS Configuration',
      passed: false,
      error: error.message
    });
  }
  
  // Test 8: SheetService operations
  try {
    const sheetResults = testSheetService();
    results.tests.push({
      name: 'Sheet Operations',
      passed: sheetResults.allPassed,
      details: sheetResults.summary
    });
  } catch (error) {
    results.tests.push({
      name: 'Sheet Operations',
      passed: false,
      error: error.message
    });
  }
  
  // Summary
  const passed = results.tests.filter(t => t.passed).length;
  const total = results.tests.length;
  results.summary = `${passed}/${total} tests passed`;
  results.allPassed = passed === total;
  
  Logger.log('=== Deployment Test Results ===');
  Logger.log(JSON.stringify(results, null, 2));
  
  if (results.allPassed) {
    Logger.log('✅ All tests passed! System is ready for deployment.');
  } else {
    Logger.log('⚠️ Some tests failed. Review results before deploying.');
  }
  
  return results;
}

/**
 * Full integration test - simulates complete OTP flow
 * WARNING: This will send a real email and create real database records
 * 
 * @param {string} testEmail - Email to use for testing (default: script owner)
 * @returns {Object} Test results
 */
function testFullOTPFlow(testEmail = null) {
  const results = {
    timestamp: getCurrentTimestamp(),
    steps: [],
    success: false
  };
  
  try {
    // Use script owner email if not provided
    if (!testEmail) {
      testEmail = Session.getActiveUser().getEmail();
    }
    
    if (!testEmail) {
      throw new Error('No test email available');
    }
    
    Logger.log('🧪 Starting full OTP flow test with email: ' + sanitizeEmail(testEmail));
    
    // Step 1: Send OTP
    Logger.log('Step 1: Sending OTP...');
    const sendResult = OTPService.sendOtp(testEmail);
    results.steps.push({
      step: 'Send OTP',
      passed: sendResult.success === true,
      details: sendResult
    });
    
    if (!sendResult.success) {
      throw new Error('Failed to send OTP: ' + sendResult.error);
    }
    
    // Step 2: Find the OTP in the sheet (simulate user receiving email)
    Logger.log('Step 2: Finding OTP in database...');
    Utilities.sleep(2000); // Wait for sheet to update
    
    const spreadsheet = SheetService.getOrCreateSpreadsheet();
    const otpSheet = spreadsheet.getSheetByName(SheetService.OTP_SHEET_NAME);
    const data = otpSheet.getDataRange().getValues();
    
    let testOtp = null;
    for (let i = data.length - 1; i > 0; i--) {
      if (data[i][0] === testEmail) {
        testOtp = data[i][1];
        break;
      }
    }
    
    results.steps.push({
      step: 'Find OTP',
      passed: !!testOtp,
      details: testOtp ? `OTP found: ${testOtp}` : 'OTP not found in sheet'
    });
    
    if (!testOtp) {
      throw new Error('Could not find OTP in database');
    }
    
    // Step 3: Verify OTP
    Logger.log('Step 3: Verifying OTP...');
    const verifyResult = OTPService.verifyOtp(testEmail, testOtp);
    results.steps.push({
      step: 'Verify OTP',
      passed: verifyResult.success === true,
      details: verifyResult
    });
    
    if (!verifyResult.success) {
      throw new Error('Failed to verify OTP: ' + verifyResult.error);
    }
    
    // Step 4: Check contact was added
    Logger.log('Step 4: Checking contact record...');
    const contactsSheet = spreadsheet.getSheetByName(SheetService.CONTACTS_SHEET_NAME);
    const contactsData = contactsSheet.getDataRange().getValues();
    
    let contactFound = false;
    for (let i = 1; i < contactsData.length; i++) {
      if (contactsData[i][0] === testEmail && contactsData[i][1] === true) {
        contactFound = true;
        break;
      }
    }
    
    results.steps.push({
      step: 'Check Contact Record',
      passed: contactFound,
      details: contactFound ? 'Contact verified and stored' : 'Contact not found'
    });
    
    // Step 5: Try to verify same OTP again (should fail)
    Logger.log('Step 5: Testing double-verification prevention...');
    const doubleVerify = OTPService.verifyOtp(testEmail, testOtp);
    results.steps.push({
      step: 'Prevent Double Verification',
      passed: doubleVerify.success === false && doubleVerify.error === 'otp_already_used',
      details: `Expected failure, got: ${doubleVerify.error}`
    });
    
    // Step 6: Test rate limiting
    Logger.log('Step 6: Testing rate limiting...');
    const rateLimitResult = OTPService.sendOtp(testEmail);
    results.steps.push({
      step: 'Rate Limiting',
      passed: rateLimitResult.success === false && rateLimitResult.error === 'rate_limit',
      details: `Expected rate_limit, got: ${rateLimitResult.error || 'success'}`
    });
    
    // All steps completed
    const allPassed = results.steps.every(s => s.passed);
    results.success = allPassed;
    results.summary = `${results.steps.filter(s => s.passed).length}/${results.steps.length} steps passed`;
    
    Logger.log('=== Full OTP Flow Test Results ===');
    Logger.log(JSON.stringify(results, null, 2));
    
    if (allPassed) {
      Logger.log('✅ Full integration test PASSED!');
    } else {
      Logger.log('⚠️ Some steps failed. Review results.');
    }
    
  } catch (error) {
    results.success = false;
    results.error = error.message;
    results.stack = error.stack;
    Logger.log('❌ Integration test FAILED: ' + error.message);
  }
  
  return results;
}