/**
 * Rate Limiting Utility for Contact Form
 * Prevents spam submissions using localStorage and time-based restrictions
 */

const STORAGE_KEY = 'contact_form_rate_limit';
const IP_SIMULATION_KEY = 'user_session_id';

// Rate limit configurations
const RATE_LIMITS = {
  // Per session/IP limits
  perMinute: 2,        // Max 2 submissions per minute
  perHour: 5,          // Max 5 submissions per hour
  perDay: 10,          // Max 10 submissions per day
  
  // Time windows (milliseconds)
  oneMinute: 60 * 1000,
  oneHour: 60 * 60 * 1000,
  oneDay: 24 * 60 * 60 * 1000,
  
  // Cooldown period after reaching limit (minutes)
  cooldownPeriod: 30,
  
  // Suspicious activity detection
  rapidSubmissionThreshold: 3,  // 3 submissions in 10 seconds = suspicious
  rapidSubmissionWindow: 10 * 1000,
};

/**
 * Get or create a unique session ID (simulates IP tracking)
 */
const getSessionId = () => {
  let sessionId = localStorage.getItem(IP_SIMULATION_KEY);
  
  if (!sessionId) {
    // Generate unique session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(IP_SIMULATION_KEY, sessionId);
  }
  
  return sessionId;
};

/**
 * Get submission history from localStorage
 */
const getSubmissionHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return { submissions: [], blocked: false, blockedUntil: null };
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading rate limit data:', error);
    return { submissions: [], blocked: false, blockedUntil: null };
  }
};

/**
 * Save submission history to localStorage
 */
const saveSubmissionHistory = (history) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving rate limit data:', error);
  }
};

/**
 * Clean old submissions from history
 */
const cleanOldSubmissions = (submissions) => {
  const now = Date.now();
  const oneDayAgo = now - RATE_LIMITS.oneDay;
  
  return submissions.filter(sub => sub.timestamp > oneDayAgo);
};

/**
 * Check if user is currently blocked
 */
export const isUserBlocked = () => {
  const history = getSubmissionHistory();
  
  if (history.blocked && history.blockedUntil) {
    const now = Date.now();
    
    if (now < history.blockedUntil) {
      const remainingMinutes = Math.ceil((history.blockedUntil - now) / 60000);
      return {
        blocked: true,
        remainingMinutes,
        message: `Anda diblokir sementara. Silakan coba lagi dalam ${remainingMinutes} menit.`
      };
    } else {
      // Block period expired, unblock user
      history.blocked = false;
      history.blockedUntil = null;
      saveSubmissionHistory(history);
    }
  }
  
  return { blocked: false };
};

/**
 * Check submission rate limits
 */
export const checkRateLimit = () => {
  // Check if user is blocked first
  const blockStatus = isUserBlocked();
  if (blockStatus.blocked) {
    return {
      allowed: false,
      reason: 'blocked',
      message: blockStatus.message,
      remainingTime: blockStatus.remainingMinutes
    };
  }
  
  const history = getSubmissionHistory();
  const now = Date.now();
  
  // Clean old submissions
  history.submissions = cleanOldSubmissions(history.submissions);
  
  // Get submissions in different time windows
  const lastMinute = history.submissions.filter(
    sub => now - sub.timestamp < RATE_LIMITS.oneMinute
  ).length;
  
  const lastHour = history.submissions.filter(
    sub => now - sub.timestamp < RATE_LIMITS.oneHour
  ).length;
  
  const lastDay = history.submissions.length;
  
  // Check rapid submission (suspicious activity)
  const rapidSubmissions = history.submissions.filter(
    sub => now - sub.timestamp < RATE_LIMITS.rapidSubmissionWindow
  ).length;
  
  if (rapidSubmissions >= RATE_LIMITS.rapidSubmissionThreshold) {
    // Block user for suspicious activity
    history.blocked = true;
    history.blockedUntil = now + (RATE_LIMITS.cooldownPeriod * 60000);
    saveSubmissionHistory(history);
    
    return {
      allowed: false,
      reason: 'suspicious_activity',
      message: `Aktivitas mencurigakan terdeteksi. Anda diblokir sementara selama ${RATE_LIMITS.cooldownPeriod} menit.`,
      remainingTime: RATE_LIMITS.cooldownPeriod
    };
  }
  
  // Check per-minute limit
  if (lastMinute >= RATE_LIMITS.perMinute) {
    const oldestInMinute = history.submissions
      .filter(sub => now - sub.timestamp < RATE_LIMITS.oneMinute)
      .sort((a, b) => a.timestamp - b.timestamp)[0];
    
    const waitSeconds = Math.ceil((RATE_LIMITS.oneMinute - (now - oldestInMinute.timestamp)) / 1000);
    
    return {
      allowed: false,
      reason: 'per_minute',
      message: `Terlalu cepat! Harap tunggu ${waitSeconds} detik sebelum mengirim lagi.`,
      remainingTime: waitSeconds
    };
  }
  
  // Check per-hour limit
  if (lastHour >= RATE_LIMITS.perHour) {
    const oldestInHour = history.submissions
      .filter(sub => now - sub.timestamp < RATE_LIMITS.oneHour)
      .sort((a, b) => a.timestamp - b.timestamp)[0];
    
    const waitMinutes = Math.ceil((RATE_LIMITS.oneHour - (now - oldestInHour.timestamp)) / 60000);
    
    return {
      allowed: false,
      reason: 'per_hour',
      message: `Batas pengiriman per jam tercapai. Harap tunggu ${waitMinutes} menit.`,
      remainingTime: waitMinutes
    };
  }
  
  // Check per-day limit
  if (lastDay >= RATE_LIMITS.perDay) {
    const oldestInDay = history.submissions
      .sort((a, b) => a.timestamp - b.timestamp)[0];
    
    const waitHours = Math.ceil((RATE_LIMITS.oneDay - (now - oldestInDay.timestamp)) / 3600000);
    
    return {
      allowed: false,
      reason: 'per_day',
      message: `Batas pengiriman harian tercapai (${RATE_LIMITS.perDay} pesan). Harap tunggu ${waitHours} jam.`,
      remainingTime: waitHours
    };
  }
  
  // All checks passed
  return {
    allowed: true,
    submissionsRemaining: {
      minute: RATE_LIMITS.perMinute - lastMinute,
      hour: RATE_LIMITS.perHour - lastHour,
      day: RATE_LIMITS.perDay - lastDay
    }
  };
};

/**
 * Record a successful submission
 */
export const recordSubmission = (metadata = {}) => {
  const history = getSubmissionHistory();
  const sessionId = getSessionId();
  
  const submission = {
    timestamp: Date.now(),
    sessionId,
    ...metadata
  };
  
  history.submissions.push(submission);
  history.submissions = cleanOldSubmissions(history.submissions);
  
  saveSubmissionHistory(history);
  
  return submission;
};

/**
 * Get current rate limit status
 */
export const getRateLimitStatus = () => {
  const blockStatus = isUserBlocked();
  if (blockStatus.blocked) {
    return {
      blocked: true,
      message: blockStatus.message,
      remainingTime: blockStatus.remainingMinutes
    };
  }
  
  const history = getSubmissionHistory();
  const now = Date.now();
  
  history.submissions = cleanOldSubmissions(history.submissions);
  
  const lastMinute = history.submissions.filter(
    sub => now - sub.timestamp < RATE_LIMITS.oneMinute
  ).length;
  
  const lastHour = history.submissions.filter(
    sub => now - sub.timestamp < RATE_LIMITS.oneHour
  ).length;
  
  const lastDay = history.submissions.length;
  
  return {
    blocked: false,
    submissions: {
      lastMinute,
      lastHour,
      lastDay
    },
    limits: {
      perMinute: RATE_LIMITS.perMinute,
      perHour: RATE_LIMITS.perHour,
      perDay: RATE_LIMITS.perDay
    },
    remaining: {
      minute: RATE_LIMITS.perMinute - lastMinute,
      hour: RATE_LIMITS.perHour - lastHour,
      day: RATE_LIMITS.perDay - lastDay
    }
  };
};

/**
 * Reset rate limit (admin only - for testing)
 */
export const resetRateLimit = () => {
  localStorage.removeItem(STORAGE_KEY);
  return { success: true, message: 'Rate limit reset successfully' };
};

/**
 * Manually block a user
 */
export const blockUser = (minutes = RATE_LIMITS.cooldownPeriod) => {
  const history = getSubmissionHistory();
  history.blocked = true;
  history.blockedUntil = Date.now() + (minutes * 60000);
  saveSubmissionHistory(history);
  
  return {
    success: true,
    message: `User blocked for ${minutes} minutes`,
    blockedUntil: history.blockedUntil
  };
};
