/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

/***********************************************************************************
 * Auth Service - Session management with mocked email/OTP
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
   * Mock: Send OTP to email (simulated 1s delay)
   * @param {string} email
   * @returns {Promise<{success: boolean, code?: string}>}
   */
  async sendOTP(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockCode = '123456'; // Mock OTP for testing
        console.log(`📧 Mock OTP sent to ${email}: ${mockCode}`);
        resolve({ success: true, code: mockCode });
      }, 1000);
    });
  },

  /**
   * Mock: Verify OTP code (accepts any 6-digit code)
   * @param {string} email
   * @param {string} code
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async verifyOTP(email, code) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!/^\d{6}$/.test(code)) {
          resolve({ success: false, error: 'Codice deve essere 6 cifre' });
        } else {
          console.log(`✅ Mock OTP verified for ${email}`);
          resolve({ success: true });
        }
      }, 500);
    });
  }
};

// Export globally
window.AuthService = AuthService;

  /////////////////
  // Task Service //
  /////////////////


    // Creates a new task and attaches it to the pending task list.


    // Modifies the inner data and current view of an existing task.


    // Deletes a task item and its listeners.



  /////////////////////
  // Category Service //
  ////////////////////


    // Creates a new category and attaches it to the custom category list.

      // Adds filtering functionality to this category item.

      // Attach the new category to the corresponding list.

    // On task creation/update, updates the category list adding new categories if needed.


    // On task deletion/update, updates the category list removing categories without tasks if needed.
 

    // Deletes a category item and its listeners.


    // Adds filtering functionality to a category item.


    // Transforms a category name into a valid id.

  

  //////////////////////
  // Animation Service //
  /////////////////////


    // Swipe animation for task completion.


    // Remove animation for task deletion.

    
  



