/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

/***********************************************************************************
 * API Service - HTTP request handler with error handling and retry logic
 ***********************************************************************************/

const ApiService = {
  /**
   * Make HTTP request with timeout and error handling
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  async request(url, options = {}) {
    const timeout = GAS_CONFIG.TIMEOUT || 10000;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - il server non risponde');
      }
      
      if (!navigator.onLine) {
        throw new Error('Nessuna connessione internet');
      }
      
      throw error;
    }
  },
  
  /**
   * Retry request with exponential backoff
   * @param {Function} operation - Request function to retry
   * @param {number} maxRetries - Maximum retry attempts
   * @returns {Promise<Object>} Response data
   */
  async retry(operation, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors or offline
        if (error.message.includes('400') || 
            error.message.includes('404') ||
            error.message.includes('internet')) {
          throw error;
        }
        
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
};

/***********************************************************************************
 * Auth Service - Session management with real OTP backend
 ***********************************************************************************/

const AuthService = {
  /**
   * Check if user has an active session
   * @returns {Promise<Object|null>} Session object or null
   */
  async checkSession() {
    try {
      const mode = await KV.get('user_session_mode');
      if (!mode) return null;

      return {
        mode,
        email: await KV.get('user_email', ''),
        verified: await KV.get('user_email_verified', false)
      };
    } catch (err) {
      console.error('AuthService.checkSession error:', err);
      return null;
    }
  },

  /**
   * Save user session to KV store
   * @param {string} mode - 'email' or 'anon'
   * @param {string} email - User email (empty for anonymous)
   * @param {boolean} verified - Email verification status
   */
  async saveSession(mode, email = '', verified = false) {
    try {
      await KV.set('user_session_mode', mode);
      await KV.set('user_email', email);
      await KV.set('user_email_verified', verified);
      await addLog('auth', `Session saved: ${mode} - ${email}`);
    } catch (err) {
      console.error('AuthService.saveSession error:', err);
      throw err;
    }
  },

  /**
   * Clear user session
   */
  async clearSession() {
    try {
      await KV.delete('user_session_mode');
      await KV.delete('user_email');
      await KV.delete('user_email_verified');
      await addLog('auth', 'Session cleared');
    } catch (err) {
      console.error('AuthService.clearSession error:', err);
    }
  },

  /**
   * Send OTP to email (real backend or mock)
   * @param {string} email - User email
   * @returns {Promise<Object>} Response with success status
   */
  async sendOTP(email) {
    // Mock mode for development
    if (GAS_CONFIG.USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockCode = '123456';
          console.log(`📧 Mock OTP sent to ${email}: ${mockCode}`);
          resolve({ success: true, status: 'ok' });
        }, 1000);
      });
    }
    
    // Real backend call
    if (!GAS_CONFIG.API_URL) {
      throw new Error('API_URL not configured');
    }
    
    try {
      const result = await ApiService.retry(async () => {
        return await ApiService.request(`${GAS_CONFIG.API_URL}?path=send_otp`, {
          method: 'POST',
          body: JSON.stringify({ email })
        });
      });
      
      return result;
      
    } catch (error) {
      console.error('sendOTP error:', error);
      return {
        success: false,
        error: 'network_error',
        message: this._getErrorMessage(error)
      };
    }
  },

  /**
   * Verify OTP code (real backend or mock)
   * @param {string} email - User email
   * @param {string} code - OTP code
   * @returns {Promise<Object>} Response with verification result
   */
  async verifyOTP(email, code) {
    // Mock mode for development
    if (GAS_CONFIG.USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!/^\d{6}$/.test(code)) {
            resolve({ success: false, error: 'invalid_otp_format', message: 'Codice deve essere 6 cifre' });
          } else {
            console.log(`✅ Mock OTP verified for ${email}`);
            resolve({ success: true });
          }
        }, 500);
      });
    }
    
    // Real backend call
    if (!GAS_CONFIG.API_URL) {
      throw new Error('API_URL not configured');
    }
    
    try {
      const result = await ApiService.retry(async () => {
        return await ApiService.request(`${GAS_CONFIG.API_URL}?path=verify_otp`, {
          method: 'POST',
          body: JSON.stringify({ email, otp: code })
        });
      });
      
      // Map backend errors to user messages
      if (!result.success && result.error) {
        result.message = this._mapErrorMessage(result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('verifyOTP error:', error);
      return {
        success: false,
        error: 'network_error',
        message: this._getErrorMessage(error)
      };
    }
  },
  
  /**
   * Map backend error codes to Italian messages
   * @param {string} errorCode - Backend error code
   * @returns {string} User-friendly message
   * @private
   */
  _mapErrorMessage(errorCode) {
    const errorMessages = {
      'invalid_otp': 'Codice non valido',
      'otp_expired': 'Il codice è scaduto. Richiedine uno nuovo.',
      'otp_already_used': 'Questo codice è già stato utilizzato',
      'rate_limit': 'Troppi tentativi. Riprova tra 1 minuto.',
      'invalid_email': 'Formato email non valido',
      'missing_email': 'Email richiesta',
      'missing_parameters': 'Parametri mancanti',
      'server_error': 'Errore del server. Riprova più tardi.',
      'email_quota_exceeded': 'Limite giornaliero email raggiunto. Riprova domani.',
      'verification_failed': 'Verifica fallita. Riprova.'
    };
    
    return errorMessages[errorCode] || 'Errore sconosciuto';
  },
  
  /**
   * Get user-friendly error message from exception
   * @param {Error} error - Error object
   * @returns {string} User message
   * @private
   */
  _getErrorMessage(error) {
    if (error.message.includes('timeout')) {
      return 'Il server non risponde. Riprova.';
    }
    if (error.message.includes('internet')) {
      return 'Nessuna connessione internet';
    }
    if (error.message.includes('404')) {
      return 'Servizio non disponibile';
    }
    return 'Errore di connessione. Riprova.';
  }
};

// Export globally
window.AuthService = AuthService;
window.ApiService = ApiService;