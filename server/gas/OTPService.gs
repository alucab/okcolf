/**
 * OTPService.gs - OTP Generation, Validation, and Email Service
 * 
 * Handles the complete OTP lifecycle:
 * - Generation of 6-digit codes
 * - Email delivery via Gmail
 * - Verification with expiration checks
 * - Cleanup of expired records
 * 
 * @author OK Colf Team
 * @version 1.0
 */

const OTPService = {
  
  // Configuration constants
  OTP_EXPIRATION_MINUTES: 5,
  SENDER_EMAIL: 'noreply@okcolf.it',
  SENDER_NAME: 'OK Colf',
  
  /**
   * Generate and send OTP to user's email
   * 
   * @param {string} email - User's email address
   * @returns {Object} Response object with success status
   */
  sendOtp(email) {
    try {
      // Generate 6-digit OTP
      const otp = generateOTP();
      
      // Calculate timestamps
      const createdAt = getCurrentTimestamp();
      const expiresAt = getExpirationTimestamp(this.OTP_EXPIRATION_MINUTES);
      
      logInfo('Generating OTP', {
        email: sanitizeEmail(email),
        expiresAt: expiresAt
      });
      
      // Store OTP in database
      try {
        SheetService.addOtpLog({
          email: email,
          otp: otp,
          created_at: createdAt,
          expires_at: expiresAt,
          verified: false,
          ip: 'unknown' // Apps Script doesn't expose client IP easily
        });
      } catch (dbError) {
        logError('Failed to store OTP in database', dbError);
        return {
          success: false,
          error: 'storage_failed',
          message: 'Impossibile salvare il codice. Riprova.'
        };
      }
      
      // Send email with OTP
      try {
        this._sendOtpEmail(email, otp, expiresAt);
        
        logInfo('OTP email sent successfully', {
          email: sanitizeEmail(email)
        });
        
        return {
          success: true,
          status: 'ok',
          message: 'Codice inviato via email'
        };
        
      } catch (emailError) {
        logError('Failed to send OTP email', emailError);
        
        // Check if it's a quota error
        if (emailError.message && emailError.message.includes('quota')) {
          return {
            success: false,
            error: 'email_quota_exceeded',
            message: 'Limite email giornaliero raggiunto. Riprova domani.'
          };
        }
        
        return {
          success: false,
          error: 'email_send_failed',
          message: 'Impossibile inviare l\'email. Verifica l\'indirizzo.'
        };
      }
      
    } catch (error) {
      logError('Unexpected error in sendOtp', error);
      return {
        success: false,
        error: 'unexpected_error',
        message: 'Errore durante la generazione del codice'
      };
    }
  },
  
  /**
   * Verify OTP code and register user
   * 
   * @param {string} email - User's email address
   * @param {string} otp - OTP code to verify
   * @returns {Object} Response object with verification result
   */
  verifyOtp(email, otp) {
    try {
      logInfo('Verifying OTP', {
        email: sanitizeEmail(email)
      });
      
      // Find OTP record in database
      const otpRecord = SheetService.findOtpRecord(email, otp);
      
      if (!otpRecord) {
        logWarn('OTP not found', {
          email: sanitizeEmail(email)
        });
        return {
          success: false,
          error: 'invalid_otp',
          message: 'Codice non valido o già utilizzato'
        };
      }
      
      // Check if already verified
      if (otpRecord.verified === true || otpRecord.verified === 'TRUE') {
        logWarn('OTP already verified', {
          email: sanitizeEmail(email)
        });
        return {
          success: false,
          error: 'otp_already_used',
          message: 'Questo codice è già stato utilizzato'
        };
      }
      
      // Check if expired
      if (isExpired(otpRecord.expires_at)) {
        logWarn('OTP expired', {
          email: sanitizeEmail(email),
          expiresAt: otpRecord.expires_at
        });
        return {
          success: false,
          error: 'otp_expired',
          message: 'Il codice è scaduto. Richiedine uno nuovo.'
        };
      }
      
      // Mark OTP as verified IMMEDIATELY to prevent race conditions
      try {
        SheetService.updateOtpVerified(otpRecord.rowIndex);
      } catch (updateError) {
        logError('Failed to update OTP status', updateError);
        return {
          success: false,
          error: 'update_failed',
          message: 'Errore durante la verifica. Riprova.'
        };
      }
      
      // Double-check that we successfully marked it (race condition protection)
      const verifiedRecord = SheetService.findOtpRecord(email, otp);
      if (!verifiedRecord || verifiedRecord.verified !== true) {
        logError('Failed to verify OTP update - possible race condition', {
          email: sanitizeEmail(email)
        });
        return {
          success: false,
          error: 'verification_conflict',
          message: 'Errore durante la verifica. Riprova.'
        };
      }
      
      // Add or update contact record
      try {
        SheetService.addOrUpdateContact({
          email: email,
          verified: true,
          verified_at: getCurrentTimestamp(),
          source: 'otp_signup',
          meta: '' // Could store browser info if available
        });
        
        logInfo('User verified and registered', {
          email: sanitizeEmail(email)
        });
        
        return {
          success: true,
          message: 'Email verificata con successo'
        };
        
      } catch (contactError) {
        logError('Failed to add contact', contactError);
        return {
          success: false,
          error: 'registration_failed',
          message: 'Verifica riuscita ma registrazione fallita. Contatta il supporto.'
        };
      }
      
    } catch (error) {
      logError('Unexpected error in verifyOtp', error);
      return {
        success: false,
        error: 'unexpected_error',
        message: 'Errore durante la verifica del codice'
      };
    }
  },
  
  /**
   * Send OTP email to user
   * Private method - called by sendOtp()
   * 
   * @param {string} email - Recipient email
   * @param {string} otp - OTP code
   * @param {string} expiresAt - Expiration timestamp
   * @private
   */
  _sendOtpEmail(email, otp, expiresAt) {
    const subject = 'Il tuo codice OTP OK Colf';
    
    // Calculate expiration time in friendly format
    const expirationDate = new Date(expiresAt);
    const expirationMinutes = this.OTP_EXPIRATION_MINUTES;
    
    // HTML email body
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border: 1px solid #e0e0e0;
      border-top: none;
    }
    .otp-box {
      background: #f8f9fa;
      border: 2px solid #667eea;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 25px 0;
    }
    .otp-code {
      font-size: 36px;
      font-weight: bold;
      color: #667eea;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 0 0 10px 10px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border: 1px solid #e0e0e0;
      border-top: none;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔐 OK Colf Express</h1>
    <p>Verifica la tua email</p>
  </div>
  
  <div class="content">
    <p>Gentile utente,</p>
    
    <p>Hai richiesto un codice di verifica per accedere a <strong>OK Colf Express</strong>.</p>
    
    <div class="otp-box">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Il tuo codice OTP è:</p>
      <div class="otp-code">${otp}</div>
    </div>
    
    <p>Inserisci questo codice nell'applicazione per completare la registrazione.</p>
    
    <div class="warning">
      <strong>⚠️ Importante:</strong>
      <ul style="margin: 10px 0 0 0; padding-left: 20px;">
        <li>Questo codice è valido per <strong>${expirationMinutes} minuti</strong></li>
        <li>Può essere utilizzato una sola volta</li>
        <li>Non condividerlo con nessuno</li>
      </ul>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Se non hai richiesto questo codice, ignora questa email. Il codice scadrà automaticamente.
    </p>
  </div>
  
  <div class="footer">
    <p><strong>OK Colf Express</strong> - Gestione semplificata per il lavoro domestico</p>
    <p style="margin: 10px 0;">
      Questa è un'email automatica. Per supporto, visita <a href="https://okcolf.it">okcolf.it</a>
    </p>
    <p style="color: #999; font-size: 11px;">
      © ${new Date().getFullYear()} OK Colf. Tutti i diritti riservati.
    </p>
  </div>
</body>
</html>
    `;
    
    // Plain text fallback
    const plainBody = `
OK Colf Express - Codice di Verifica

Gentile utente,

Hai richiesto un codice di verifica per accedere a OK Colf Express.

Il tuo codice OTP è: ${otp}

Questo codice è valido per ${expirationMinutes} minuti e può essere utilizzato una sola volta.

Non condividere questo codice con nessuno.

Se non hai richiesto questo codice, ignora questa email.

---
OK Colf Express
https://okcolf.it
    `;
    
    // Send email using GmailApp
    try {
      GmailApp.sendEmail(
        email,
        subject,
        plainBody,
        {
          htmlBody: htmlBody,
          name: this.SENDER_NAME,
          noReply: true
        }
      );
    } catch (error) {
      // If GmailApp fails, try MailApp as fallback
      logWarn('GmailApp failed, trying MailApp', error);
      MailApp.sendEmail(
        email,
        subject,
        plainBody,
        {
          htmlBody: htmlBody,
          name: this.SENDER_NAME
        }
      );
    }
  }
};

/**
 * Cleanup expired OTP records
 * Should be run daily via time-driven trigger
 * 
 * Deletes OTP records older than 24 hours to keep the sheet clean
 * Preserves contact records
 */
function cleanupExpiredOtps() {
  try {
    logInfo('Starting OTP cleanup');
    
    const deletedCount = SheetService.deleteExpiredOtps(24); // Delete OTPs older than 24 hours
    
    logInfo('OTP cleanup completed', {
      deletedRecords: deletedCount
    });
    
    return {
      success: true,
      deletedCount: deletedCount
    };
    
  } catch (error) {
    logError('Error during OTP cleanup', error);
    
    // Send notification email to admin if cleanup fails
    try {
      const adminEmail = Session.getActiveUser().getEmail();
      if (adminEmail) {
        MailApp.sendEmail(
          adminEmail,
          'OK Colf: OTP Cleanup Failed',
          `The scheduled OTP cleanup failed with error:\n\n${error.message}\n\nStack:\n${error.stack}`
        );
      }
    } catch (notifyError) {
      logError('Failed to send admin notification', notifyError);
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}