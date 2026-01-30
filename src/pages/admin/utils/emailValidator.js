import { trustedEmailDomains, spamEmailDomains } from './emailDomains';

/**
 * Comprehensive Email Validation Utility - Enhanced 5x
 * Advanced multi-layer validation with pattern recognition, 
 * character analysis, and sophisticated spam detection
 */

// Common typos for popular email domains (expanded)
const domainTypos = {
  'gmail.com': ['gmai.com', 'gmial.com', 'gmaill.com', 'gmil.com', 'gmail.co', 'gnail.com', 'gamil.com', 'gmal.com', 'gmeil.com', 'gmaul.com', 'gmqil.com'],
  'yahoo.com': ['yahooo.com', 'yaho.com', 'yhoo.com', 'yahoo.co', 'yah00.com', 'yahou.com', 'yhaoo.com', 'yahho.com', 'yaoo.com'],
  'outlook.com': ['outlok.com', 'outloook.com', 'outlook.co', 'outlok.com', 'outllook.com', 'ooutlook.com', 'otlook.com'],
  'hotmail.com': ['hotmial.com', 'hotmai.com', 'hotmal.com', 'hotmail.co', 'hotmil.com', 'homail.com', 'hotmaii.com'],
  'icloud.com': ['iclod.com', 'icoud.com', 'icloud.co', 'iclould.com', 'iclowd.com', 'iloud.com'],
  'protonmail.com': ['protonmal.com', 'protonmial.com', 'protonmai.com', 'protonmailcom'],
  'aol.com': ['aool.com', 'aol.co', 'ao1.com'],
};

// Suspicious patterns in email addresses
const suspiciousPatterns = {
  // Too many numbers
  excessiveNumbers: /\d{6,}/,
  // Random character sequences
  randomSequence: /[a-z]{1}[0-9]{3,}[a-z]{1}/i,
  // Keyboard patterns
  keyboardPatterns: /(qwerty|asdfgh|zxcvbn|12345|abcdef|qazwsx)/i,
  // Repeated characters
  repeatedChars: /(.)\1{4,}/,
  // No vowels (suspicious for spam)
  noVowels: /^[^aeiouAEIOU@.]+@/,
  // All numbers before @
  allNumbers: /^\d+@/,
  // Special char spam
  excessiveSpecialChars: /[!#$%&*+=?^_`{|}~]{3,}/,
  // Mixed case spam pattern
  randomCase: /[a-z][A-Z][a-z][A-Z]/,
};

// Common free email domains (expanded for corporate detection)
const commonFreeEmailDomains = [
  'gmail.com', 'googlemail.com', 'google.com',
  'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.es', 'yahoo.it', 'yahoo.co.jp', 'ymail.com', 'rocketmail.com',
  'outlook.com', 'outlook.co.uk', 'outlook.fr', 'outlook.de', 'hotmail.com', 'hotmail.co.uk', 'hotmail.fr', 'live.com', 'live.co.uk', 'msn.com',
  'aol.com', 'aim.com',
  'icloud.com', 'me.com', 'mac.com',
  'mail.com', 'email.com', 'gmx.com', 'gmx.de', 'web.de',
  'zoho.com', 'zohomail.com',
  'yandex.com', 'yandex.ru', 'mail.ru', 'inbox.ru',
  'qq.com', '163.com', '126.com', 'sina.com',
  'protonmail.com', 'protonmail.ch', 'proton.me', 'pm.me',
];

// Role-based email addresses (usually not personal)
const roleBasedAddresses = [
  'admin', 'webmaster', 'info', 'contact', 'support', 'sales', 
  'marketing', 'help', 'service', 'noreply', 'no-reply', 'postmaster',
  'root', 'abuse', 'security', 'privacy', 'billing', 'careers',
  'jobs', 'office', 'team', 'hello', 'mail'
];

/**
 * RFC 5322 compliant email regex (more strict)
 */
const emailRegexStrict = /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

/**
 * Additional validation patterns
 */
const validationPatterns = {
  // Valid local part characters
  validLocalPart: /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+$/,
  // Valid domain format
  validDomain: /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/,
  // IP address in domain (usually spam)
  ipInDomain: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
  // Consecutive dots
  consecutiveDots: /\.\./,
  // Starts or ends with special chars
  invalidStartEnd: /^[._-]|[._-]$/,
};

/**
 * Character frequency analysis for spam detection
 */
const analyzeCharacterFrequency = (email) => {
  const localPart = email.split('@')[0];
  const chars = localPart.split('');
  
  // Count character types
  const counts = {
    letters: 0,
    numbers: 0,
    special: 0,
    uppercase: 0,
    lowercase: 0
  };
  
  chars.forEach(char => {
    if (/[a-z]/.test(char)) {
      counts.letters++;
      counts.lowercase++;
    } else if (/[A-Z]/.test(char)) {
      counts.letters++;
      counts.uppercase++;
    } else if (/\d/.test(char)) {
      counts.numbers++;
    } else {
      counts.special++;
    }
  });
  
  const total = chars.length;
  
  return {
    ...counts,
    total,
    numberRatio: counts.numbers / total,
    specialRatio: counts.special / total,
    uppercaseRatio: counts.uppercase / total,
    letterRatio: counts.letters / total
  };
};

/**
 * Enhanced email syntax validation with deep analysis
 */
export const isValidEmailSyntax = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const trimmedEmail = email.trim().toLowerCase();
  
  // Basic format check
  if (!emailRegexStrict.test(trimmedEmail)) return false;
  
  // Length checks (RFC compliance)
  if (trimmedEmail.length > 254) return false;
  if (trimmedEmail.length < 3) return false; // Minimum: a@b.co = 3 chars (RFC 5321 allows)
  
  const [localPart, domain] = trimmedEmail.split('@');
  
  // Enhanced local part validation
  if (!localPart || localPart.length > 64) return false;
  if (!validationPatterns.validLocalPart.test(localPart)) return false;
  if (validationPatterns.invalidStartEnd.test(localPart)) return false;
  if (validationPatterns.consecutiveDots.test(localPart)) return false;
  
  // Check for suspicious patterns in local part
  if (suspiciousPatterns.excessiveNumbers.test(localPart)) return false;
  if (suspiciousPatterns.repeatedChars.test(localPart)) return false;
  if (suspiciousPatterns.keyboardPatterns.test(localPart)) return false;
  
  // Character frequency analysis
  const charAnalysis = analyzeCharacterFrequency(email);
  if (charAnalysis.numberRatio > 0.8) return false; // >80% numbers
  if (charAnalysis.specialRatio > 0.4) return false; // >40% special chars
  
  // Enhanced domain validation
  if (!domain || domain.length > 253) return false;
  if (!validationPatterns.validDomain.test(domain)) return false;
  if (validationPatterns.ipInDomain.test(domain)) return false; // IP addresses
  if (validationPatterns.invalidStartEnd.test(domain)) return false;
  
  // Domain structure validation
  const domainParts = domain.split('.');
  if (domainParts.length < 2) return false;
  
  // Each domain part validation
  for (const part of domainParts) {
    if (part.length === 0 || part.length > 63) return false;
    if (/^-|-$/.test(part)) return false; // Can't start/end with hyphen
  }
  
  // TLD validation (more strict)
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || tld.length > 24) return false; // Real TLDs are 2-24 chars
  if (!/^[a-z]+$/.test(tld)) return false; // TLD must be letters only
  
  // Check for common invalid TLDs
  const invalidTlds = ['test', 'invalid', 'localhost', 'example', 'local'];
  if (invalidTlds.includes(tld)) return false;
  
  return true;
};

/**
 * Enhanced spam domain detection with pattern matching
 */
export const isSpamDomain = (email) => {
  if (!email) return true;
  
  const domain = email.toLowerCase().split('@')[1];
  if (!domain) return true;
  
  // Direct match in spam list
  if (spamEmailDomains.includes(domain)) return true;
  
  // Check for subdomain matches
  if (spamEmailDomains.some(spamDomain => domain.endsWith('.' + spamDomain))) {
    return true;
  }
  
  // Enhanced disposable email pattern detection
  const disposablePatterns = [
    'temp', 'trash', 'disposable', 'throwaway', 'fake', 
    'guerrilla', 'mailinator', 'burner', 'spam', 'junk',
    'yopmail', 'maildrop', 'tempmail', 'trashmail', 'guerrillamail',
    'sharklasers', 'grr', 'pokemail', 'spam4', 'mailcatch',
    'mytrashmail', 'emailondeck', 'anonymousemail', 'mintemail',
    'dispostable', 'spamgourmet', 'mailnesia', 'mohmal',
    'mailnull', 'mailexpire', 'tempemail', 'tempinbox'
  ];
  
  if (disposablePatterns.some(pattern => domain.includes(pattern))) {
    return true;
  }
  
  // Check for numeric-heavy domains (often spam)
  const domainWithoutTld = domain.split('.').slice(0, -1).join('.');
  const numCount = (domainWithoutTld.match(/\d/g) || []).length;
  if (numCount > domainWithoutTld.length * 0.5) return true;
  
  // Check for very short domain names (but trust known short domains)
  // Examples: ai.com, me.com, it.com are legitimate but short
  const domainName = domain.split('.')[0];
  if (domainName.length < 3) {
    // If domain is in trusted list, it's legitimate (e.g., me.com)
    if (trustedEmailDomains.includes(domain)) {
      return false; // It's trusted, not spam
    }
    // If not trusted AND too short, suspect spam
    return true;
  }
  
  // Check for TLD patterns commonly used by spam
  const spamTlds = ['tk', 'ml', 'ga', 'cf', 'gq', 'xyz'];
  const tld = domain.split('.').pop();
  if (spamTlds.includes(tld)) return true;
  
  return false;
};

/**
 * Check if email domain is trusted
 */
export const isTrustedDomain = (email) => {
  if (!email) return false;
  
  const domain = email.toLowerCase().split('@')[1];
  if (!domain) return false;
  
  // Direct match in comprehensive trusted list (500+ domains)
  if (trustedEmailDomains.includes(domain)) return true;
  
    // Check for educational institutions worldwide
    const eduPatterns = [
      // Global generic
      '.edu',

      // ===== Asia =====
      '.ac.id', '.sch.id',
      '.ac.jp', '.ac.kr', '.ac.th', '.ac.cn', '.ac.in', '.ac.my',
      '.edu.sg', '.edu.my', '.edu.ph', '.edu.vn', '.edu.pk',
      '.edu.bd', '.edu.hk', '.edu.tw', '.edu.sa', '.edu.ae',
      '.ac.ae', '.ac.il',

      // ===== Europe =====
      '.ac.uk', '.edu.uk',
      '.edu.fr', '.edu.de', '.edu.it', '.edu.es', '.edu.pt',
      '.edu.nl', '.edu.be', '.edu.ch', '.edu.se', '.edu.no',
      '.edu.fi', '.edu.pl', '.edu.cz', '.edu.hu', '.edu.ro',
      '.edu.gr', '.edu.ie',

      // ===== Americas =====
      '.edu.us', '.edu.ca',
      '.edu.mx', '.edu.co', '.edu.ar', '.edu.br', '.edu.cl',
      '.edu.pe', '.edu.ve', '.edu.ec', '.edu.bo', '.edu.py',
      '.edu.uy',

      // ===== Africa =====
      '.ac.za', '.edu.ng', '.edu.ke', '.edu.gh', '.edu.eg',
      '.edu.tn', '.edu.ma', '.edu.et', '.edu.ug',

      // ===== Oceania =====
      '.edu.au', '.edu.nz', '.ac.nz'
    ];

  
  if (eduPatterns.some(pattern => domain.endsWith(pattern))) {
    return true;
  }
  
    // Check for government domains worldwide
    const govPatterns = [
      // Global generic
      '.gov',

      // ===== Americas =====
      '.gov.us', '.gov.ca',
      '.gob.mx', '.gob.ar', '.gob.cl', '.gob.pe', '.gob.bo',
      '.gob.ve', '.gob.ec', '.gob.py', '.gob.uy',
      '.gov.br', '.gov.co', '.gov.gt', '.gov.hn',
      '.gov.sv', '.gov.ni', '.gov.cr', '.gov.pa',
      '.gov.do', '.gov.cu', '.gov.jm', '.gov.tt',

      // ===== Europe =====
      '.gov.uk', '.gov.ie',
      '.gouv.fr', '.gov.fr',
      '.gov.de', '.gov.it', '.gov.es', '.gov.pt',
      '.gov.nl', '.gov.be', '.gov.lu',
      '.gov.ch', '.gov.at',
      '.gov.pl', '.gov.cz', '.gov.sk',
      '.gov.hu', '.gov.ro', '.gov.bg',
      '.gov.gr', '.gov.si', '.gov.hr',
      '.gov.se', '.gov.no', '.gov.fi', '.gov.dk',
      '.gov.is', '.gov.lv', '.gov.lt', '.gov.ee',
      '.gov.ua', '.gov.md', '.gov.rs', '.gov.ba',
      '.gov.mk', '.gov.me', '.gov.al',

      // ===== Asia =====
      '.go.id',
      '.go.jp', '.go.kr',
      '.gov.cn', '.gov.hk', '.gov.tw',
      '.gov.in', '.gov.pk', '.gov.bd', '.gov.lk', '.gov.np',
      '.gov.my', '.gov.sg', '.gov.ph', '.gov.th', '.gov.vn',
      '.gov.kh', '.gov.la', '.gov.mm',
      '.gov.mn', '.gov.kz', '.gov.uz', '.gov.tm', '.gov.kg',
      '.gov.af',

      // ===== Middle East =====
      '.gov.sa', '.gov.ae', '.gov.qa', '.gov.kw',
      '.gov.om', '.gov.bh',
      '.gov.ir', '.gov.iq',
      '.gov.il', '.gov.ps',
      '.gov.tr', '.gov.sy', '.gov.lb', '.gov.jo', '.gov.ye',

      // ===== Africa =====
      '.gov.eg', '.gov.za', '.gov.ng', '.gov.ke', '.gov.gh',
      '.gov.et', '.gov.sd', '.gov.ss',
      '.gov.tz', '.gov.ug', '.gov.rw', '.gov.bi',
      '.gov.sn', '.gov.ci', '.gov.ml', '.gov.ne',
      '.gov.ma', '.gov.tn', '.gov.dz', '.gov.ly',
      '.gov.cm', '.gov.ga', '.gov.cg', '.gov.cd',
      '.gov.zm', '.gov.zw', '.gov.mw', '.gov.mz',
      '.gov.na', '.gov.bw', '.gov.sz', '.gov.ls',

      // ===== Oceania =====
      '.gov.au', '.gov.nz',
      '.gov.pg', '.gov.sb', '.gov.fj', '.gov.ws',
      '.gov.to', '.gov.vu', '.gov.ki', '.gov.nr'
    ];

  
  if (govPatterns.some(pattern => domain.endsWith(pattern))) {
    return true;
  }
  
  // Check for military domains
  if (domain.endsWith('.mil') || domain.endsWith('.mil.id')) {
    return true;
  }
  
  // Check for research institutions
  const researchPatterns = ['.org', '.int'];
  const researchKeywords = ['research', 'institute', 'university', 'college'];
  if (researchPatterns.some(p => domain.endsWith(p)) && 
      researchKeywords.some(k => domain.includes(k))) {
    return true;
  }
  
  return false;
};

/**
 * Check for common domain typos and suggest correction
 */
export const checkDomainTypo = (email) => {
  if (!email) return null;
  
  const domain = email.toLowerCase().split('@')[1];
  if (!domain) return null;
  
  const localPart = email.split('@')[0];
  
  // Check against known typos
  for (const [correctDomain, typos] of Object.entries(domainTypos)) {
    if (typos.includes(domain)) {
      return {
        hasTypo: true,
        suggested: `${localPart}@${correctDomain}`,
        originalDomain: domain,
        suggestedDomain: correctDomain
      };
    }
  }
  
  return { hasTypo: false };
};

/**
 * Enhanced corporate domain validation
 */
export const isCorporateDomain = (email) => {
  if (!email) return false;
  
  const domain = email.toLowerCase().split('@')[1];
  if (!domain) return false;
  
  // If it's spam, definitely not corporate
  if (isSpamDomain(email)) return false;
  
  // If it's already trusted (edu/gov), not corporate
  if (isTrustedDomain(email)) return false;
  
  // Exclude all free email providers (expanded list)
  if (commonFreeEmailDomains.includes(domain)) return false;
  
  // Check domain structure
  const parts = domain.split('.');
  
  // Should have at least domain + TLD (e.g., company.com)
  if (parts.length < 2) return false;
  
  // TLD validation
  const tld = parts[parts.length - 1];
  if (tld.length < 2 || tld.length > 6 || !/^[a-z]+$/.test(tld)) {
    return false;
  }
  
  // Domain name should be at least 3 chars for corporate
  const domainName = parts[parts.length - 2];
  if (domainName.length < 3) return false;
  
  // Check for common corporate TLDs
  const corporateTlds = ['com', 'co', 'net', 'org', 'biz', 'io', 'ai', 'tech', 'dev'];
  const hasCorporateTld = corporateTlds.includes(tld) || parts.length >= 3;
  
  // Additional validation for likely corporate domains
  if (hasCorporateTld && !suspiciousPatterns.excessiveNumbers.test(domainName)) {
    return true;
  }
  
  return false;
};

/**
 * Check if email uses role-based address (not personal)
 * IMPROVED: Only flag if from UNTRUSTED domain
 */
export const isRoleBasedEmail = (email) => {
  if (!email) return false;
  
  const localPart = email.toLowerCase().split('@')[0];
  const isRoleBased = roleBasedAddresses.some(role => 
    localPart === role || localPart.startsWith(role + '.')
  );
  
  // If it's not role-based, return false
  if (!isRoleBased) return false;
  
  // If it IS role-based, only flag if from untrusted domain
  // Example: admin@microsoft.com is LEGITIMATE
  // But: admin@unknown-domain.tk is SUSPICIOUS
  if (isTrustedDomain(email)) {
    return false; // Role-based email from trusted domain is OK
  }
  
  return true; // Role-based from unknown domain is suspicious
};

/**
 * Calculate email trust score (0-100)
 */
export const calculateTrustScore = (email) => {
  if (!email || !isValidEmailSyntax(email)) return 0;
  
  let score = 50; // Base score for valid email
  
  // Trusted domain: +40
  if (isTrustedDomain(email)) score += 40;
  
  // Corporate domain: +25
  else if (isCorporateDomain(email)) score += 25;
  
  // Spam domain: -100 (instant fail)
  if (isSpamDomain(email)) return 0;
  
  // Character analysis bonus
  const charAnalysis = analyzeCharacterFrequency(email);
  if (charAnalysis.letterRatio > 0.6) score += 10; // Good letter ratio
  if (charAnalysis.numberRatio < 0.3) score += 5; // Not too many numbers
  
  // No suspicious patterns: +10
  const localPart = email.split('@')[0];
  let hasSuspiciousPattern = false;
  for (const pattern of Object.values(suspiciousPatterns)) {
    if (pattern.test(localPart)) {
      hasSuspiciousPattern = true;
      break;
    }
  }
  if (!hasSuspiciousPattern) score += 10;
  
  // Not role-based: +5
  if (!isRoleBasedEmail(email)) score += 5;
  
  // Length validation: +5
  const [local, domain] = email.split('@');
  if (local.length >= 3 && local.length <= 30) score += 5;
  
  // Domain age simulation (proper structure): +5
  const domainParts = domain.split('.');
  if (domainParts.length === 2 && domainParts[0].length >= 4) score += 5;
  
  return Math.min(100, Math.max(0, score));
};

/**
 * Comprehensive email verification
 * Returns detailed validation result
 */
export const verifyEmail = (email) => {
  const result = {
    isValid: false,
    isTrusted: false,
    isCorporate: false,
    isSpam: false,
    hasTypo: false,
    suggestion: null,
    validationErrors: [],
    securityLevel: 'unknown', // 'high', 'medium', 'low', 'unknown'
  };

  
  // Basic syntax validation
  if (!isValidEmailSyntax(email)) {
    result.validationErrors.push('Invalid email format');
    result.securityLevel = 'low';
    return result;
  }
  
  result.isValid = true;
  
  // Check for spam
  if (isSpamDomain(email)) {
    result.isSpam = true;
    result.validationErrors.push('Disposable/spam email domain');
    result.securityLevel = 'low';
    return result;
  }
  
  // Check for typos
  const typoCheck = checkDomainTypo(email);
  if (typoCheck.hasTypo) {
    result.hasTypo = true;
    result.suggestion = typoCheck.suggested;
    result.validationErrors.push(`Possible typo: did you mean ${typoCheck.suggestedDomain}?`);
  }
  
  // Check if trusted
  if (isTrustedDomain(email)) {
    result.isTrusted = true;
    result.securityLevel = 'high';
    return result;
  }
  
  // Check if corporate
  if (isCorporateDomain(email)) {
    result.isCorporate = true;
    result.securityLevel = 'medium';
    return result;
  }
  
  // Default: valid but unknown
  result.securityLevel = 'medium';
  
  return result;
};

/**
 * Simple verification for boolean check (backward compatibility)
 */
export const isEmailVerified = (email) => {
  const verification = verifyEmail(email);
  return verification.isTrusted || verification.isCorporate;
};

/**
 * Get security badge info for display
 */
export const getEmailSecurityBadge = (email) => {
  const verification = verifyEmail(email);
  
  const badges = {
    high: {
      icon: '✅',
      color: 'green',
      text: 'Terverifikasi',
      description: 'Email dari domain terpercaya'
    },
    medium: {
      icon: '✓',
      color: 'blue',
      text: 'Valid',
      description: 'Email valid dari domain legitimate'
    },
    low: {
      icon: '⚠️',
      color: 'orange',
      text: 'Tidak terverifikasi',
      description: 'Harap berhati-hati dengan email ini'
    },
    unknown: {
      icon: '❓',
      color: 'gray',
      text: 'Tidak diketahui',
      description: 'Status verifikasi tidak dapat ditentukan'
    }
  };
  
  return {
    ...badges[verification.securityLevel],
    verification
  };
};
