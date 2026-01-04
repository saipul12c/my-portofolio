import { spamEmailDomains } from './emailDomains';
import { verifyEmail, isValidEmailSyntax } from './emailValidator';

export const filterSpamContacts = (contacts) => {
  if (!contacts || !Array.isArray(contacts)) return [];

  // Enhanced spam indicators
  const spamKeywords = [
    // Testing keywords
    'spam', 'test', 'demo', 'example', 'sample', 'dummy', 'fake', 'xxx',
    'asdf', 'qwerty', 'zzz', 'aaa', 'bbb',
    
    // Adult/Casino
    'casino', 'gambling', 'poker', 'viagra', 'cialis', 'lottery', 'jackpot',
    'adult', 'porn', 'sex', 'escort', 'dating', 'horny', 'nude', 'sexy',
    'webcam', 'xxx', 'erotic', 'milf',
    
    // Marketing spam
    'buy now', 'click here', 'limited time', 'act now', 'order now',
    'urgent', 'important!!!', 'free money', 'earn cash', 'make money fast',
    'work from home', 'get rich', 'miracle', 'guarantee', 'risk-free',
    'congratulations', 'winner', 'prize', 'claim now', 'bonus',
    'special promotion', 'limited offer', 'exclusive deal', 'amazing offer',
    'dont miss', "don't miss", 'hurry up', 'today only', 'expires today',
    
    // Cryptocurrency spam
    'bitcoin', 'crypto', 'cryptocurrency', 'investment opportunity', 'trading bot',
    'forex', 'binary options', 'profit guarantee', 'roi', 'passive income',
    'financial freedom', 'get paid', 'extra income',
    
    // Phishing indicators
    'verify account', 'suspended account', 'confirm identity', 'security alert',
    'reset password', 'unusual activity', 'click link', 'update payment',
    'account verification', 'confirm email', 'validate account', 'urgent action required',
    'your account', 'suspended', 'locked account', 'unauthorized access',
    
    // Scam phrases
    'nigerian prince', 'inheritance', 'beneficiary', 'transfer funds',
    'wire transfer', 'bank account', 'routing number', 'ssn', 'social security',
    'credit card', 'credit score', 'debt relief', 'loan approved',
    
    // SEO/Link building spam
    'seo services', 'increase traffic', 'backlinks', 'rank higher',
    'google ranking', 'website optimization', 'boost sales',
    
    // Weight loss/Health spam
    'weight loss', 'lose weight', 'diet pills', 'fat burner',
    'muscle gain', 'bodybuilding', 'hgh', 'steroids',
    
    // Other spam patterns
    'unsubscribe', 'opt-out', 'mlm', 'pyramid', 'network marketing',
    'multi-level', 'home business', 'be your own boss',
    'no experience necessary', 'earn while you sleep',
    'completely free', '100% free', 'no cost', 'no fees',
    'money back', 'full refund', 'satisfaction guaranteed',
    
    // Vulgar/Offensive
    'fuck', 'shit', 'damn', 'ass', 'bitch', 'bastard', 'crap',
    
    // Suspicious patterns
    'click below', 'click this link', 'visit this site', 'go to this website',
    'limited spots', 'limited availability', 'only x left',
    'pre-approved', 'pre-selected', 'you have been chosen',
  ];

  // Common spam name patterns
  const spamNamePatterns = [
    /^test\d*$/i,
    /^user\d*$/i,
    /^admin\d*$/i,
    /^demo\d*$/i,
    /^asdf+$/i,
    /^qwerty+$/i,
    /^zzz+$/i,
    /^xxx+$/i,
    /^aaa+$/i,
    /^bbb+$/i,
    /^[a-z]{1,2}$/i, // Single or two letter names
    /^\d+$/, // Only numbers
    /^spam/i,
    /^fake/i,
    /^dummy/i,
    /^sample/i,
    /^null$/i,
    /^none$/i,
    /^n\/a$/i,
    /^unknown$/i,
  ];

  return contacts.filter(contact => {
    // Check if essential fields exist
    if (!contact.email || !contact.name || !contact.message) return false;

    const email = contact.email.toLowerCase().trim();
    const message = contact.message.trim();
    const name = contact.name.trim();
    const messageLower = message.toLowerCase();
    const nameLower = name.toLowerCase();

    // Comprehensive email validation using emailValidator
    const emailVerification = verifyEmail(email);
    
    // Reject if email is invalid or spam
    if (!emailVerification.isValid) {
      return false;
    }
    
    if (emailVerification.isSpam) {
      return false;
    }

    // Additional legacy validation for backward compatibility
    if (!isValidEmailSyntax(email)) {
      return false;
    }

    // Check for spam domains
    const domain = email.split('@')[1];
    if (!domain || spamEmailDomains.includes(domain)) {
      return false;
    }

    // Check for spam domain patterns (more comprehensive)
    if (spamEmailDomains.some(spamDomain => domain === spamDomain || domain.endsWith('.' + spamDomain))) {
      return false;
    }

    // Check for disposable email patterns
    if (domain.includes('temp') || domain.includes('trash') || domain.includes('disposable') || 
        domain.includes('fake') || domain.includes('guerrilla') || domain.includes('throwaway')) {
      return false;
    }

    // Check for spam keywords in email
    if (spamKeywords.some(keyword => email.includes(keyword))) {
      return false;
    }

    // Check for spam keywords in message (more strict)
    const spamKeywordCount = spamKeywords.filter(keyword => messageLower.includes(keyword)).length;
    if (spamKeywordCount >= 2) { // If 2 or more spam keywords found
      return false;
    }

    // Check for spam keywords in name
    if (spamKeywords.some(keyword => nameLower.includes(keyword))) {
      return false;
    }

    // Check for spam name patterns
    if (spamNamePatterns.some(pattern => pattern.test(name))) {
      return false;
    }

    // Check message length (too short or suspiciously long)
    if (message.length < 10 || message.length > 5000) {
      return false;
    }

    // Check for excessive repeated characters
    if (/(.)\1{10,}/.test(message) || /(.)\1{10,}/.test(name)) {
      return false;
    }

    // Check for suspicious patterns in message
    const urlCount = (message.match(/https?:\/\//gi) || []).length;
    if (urlCount > 3) { // Too many URLs
      return false;
    }

    // Check for URL shorteners (often used in spam)
    const urlShorteners = [
      'bit.ly', 'goo.gl', 'tinyurl.com', 'ow.ly', 't.co', 'is.gd',
      'buff.ly', 'adf.ly', 'shorte.st', 'bc.vc', 'linktr.ee'
    ];
    if (urlShorteners.some(shortener => messageLower.includes(shortener))) {
      return false;
    }

    // Check for excessive capitalization
    const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
    if (capsRatio > 0.7 && message.length > 20) { // More than 70% caps
      return false;
    }

    // Check for excessive special characters
    const specialChars = (message.match(/[!@#$%^&*()]/g) || []).length;
    if (specialChars > message.length * 0.3) { // More than 30% special chars
      return false;
    }

    // Check for email format in name (usually spam)
    if (/@/.test(name)) {
      return false;
    }

    // Check for minimum name length
    if (name.length < 2 || name.length > 100) {
      return false;
    }

    // Check for suspicious email patterns
    const localPart = email.split('@')[0];
    if (localPart.length < 3 || domain.length < 4) {
      return false;
    }

    // Check for random-looking email (too many numbers)
    const numberCount = (localPart.match(/\d/g) || []).length;
    if (numberCount > localPart.length * 0.7) { // More than 70% numbers
      return false;
    }

    // Check for phone numbers in message (spam often includes phone)
    const phonePattern = /(\+?\d{1,4}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/g;
    const phoneMatches = message.match(phonePattern) || [];
    if (phoneMatches.length > 2) { // More than 2 phone numbers
      return false;
    }

    // Check for all caps words (common in spam)
    const allCapsWords = message.match(/\b[A-Z]{4,}\b/g) || [];
    if (allCapsWords.length > 5) { // Too many all-caps words
      return false;
    }

    // Check for excessive emoji/special unicode
    const emojiCount = (message.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
    if (emojiCount > 20) { // Too many emojis
      return false;
    }

    // Check for repetitive words
    const words = message.toLowerCase().split(/\s+/);
    const wordCounts = {};
    words.forEach(word => {
      if (word.length > 3) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
    const maxRepetition = Math.max(...Object.values(wordCounts), 0);
    if (maxRepetition > 10) { // Same word repeated more than 10 times
      return false;
    }

    return true;
  });
};