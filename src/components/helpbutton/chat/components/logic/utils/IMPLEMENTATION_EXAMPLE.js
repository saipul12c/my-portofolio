/**
 * IMPLEMENTATION EXAMPLE
 * Contoh cara mengintegrasikan enhanced modules ke useChatbot.js
 * 
 * Copy code dari file ini ke useChatbot.js sesuai kebutuhan
 */

/* eslint-disable */

// ============================================
// STEP 1: ADD IMPORTS
// ============================================

// Tambahkan ini ke bagian imports di useChatbot.js:

import { 
  classifyIntent, 
  getResponseStrategy, 
  INTENT_TYPES 
} from '../utils/advancedIntentClassifier';

import { 
  ConversationContextManager, 
  isFollowUp, 
  extractTopics, 
  buildContextualPrefix 
} from '../utils/conversationContext';

import { 
  generateEnhancedResponse 
} from '../utils/enhancedResponseGenerator';

import { 
  smartKBQuery, 
  augmentResponseWithContext 
} from '../utils/smartKBQuery';

import { 
  detectClarificationNeeded, 
  generateClarificationPrompt,
  generateSmartFallback,
  parseUserClarification 
} from '../utils/clarificationSystem';


// ============================================
// STEP 2: ADD STATE INITIALIZATION
// ============================================

// Tambahkan ini di dalam fungsi useChatbot, sebelum state declarations:

export function useChatbot(knowledgeBase, knowledgeStats) {
  // Initialize context manager
  const [contextManager] = useState(() => {
    try {
      const stored = localStorage.getItem('saipul_context_manager');
      if (stored) {
        const data = JSON.parse(stored);
        const manager = new ConversationContextManager();
        manager.messages = data.messages || [];
        manager.topics = data.topics || [];
        manager.entities = data.entities || [];
        return manager;
      }
    } catch (e) {
      console.warn('Could not restore context manager:', e);
    }
    return new ConversationContextManager();
  });

  // Track yang terakhir dipilih untuk clarification
  const [pendingClarification, setPendingClarification] = useState(null);

  // ... existing state declarations ...
}


// ============================================
// STEP 3: CREATE MESSAGE HANDLER
// ============================================

// Tambahkan/update fungsi ini (biasanya bernama handleSendMessage atau similar):

const handleSendMessage = useCallback(async (userMessage) => {
  try {
    if (!userMessage || !userMessage.trim()) {
      return;
    }

    const sanitized = sanitizeInput(userMessage.trim());

    // ===== STEP 3A: CLASSIFY INTENT =====
    const classificationResult = classifyIntent(sanitized, {
      lastBotIntent: lastInputType.type,
      turnCount: messages.length / 2,
      hasUnresolvedQuestion: contextManager.unresolvedQuestions.some(q => !q.resolved)
    });

    setLastInputType({
      type: classificationResult.intent,
      confidence: classificationResult.confidence
    });

    // ===== STEP 3B: ADD TO CONTEXT =====
    contextManager.addMessage(sanitized, {
      sender: 'user',
      intent: classificationResult.intent,
      entities: classificationResult.entities || {},
      topics: extractTopics(sanitized, classificationResult.entities),
      confidence: classificationResult.confidence
    });

    // ===== STEP 3C: CHECK FOR CLARIFICATION =====
    const clarificationNeeded = detectClarificationNeeded(
      sanitized,
      {
        lastMentionedEntity: contextManager.entities[contextManager.entities.length - 1],
        ...contextManager.getSummary()
      },
      kbState
    );

    let botResponse;

    if (clarificationNeeded && clarificationNeeded.confidence > 0.7) {
      // Generate clarification prompt
      const clarificationPrompt = generateClarificationPrompt(clarificationNeeded);
      setPendingClarification(clarificationNeeded);
      
      botResponse = {
        id: `msg_${Date.now()}_${Math.floor(Math.random()*10000)}`,
        from: 'bot',
        text: clarificationPrompt.text,
        timestamp: new Date().toISOString(),
        type: 'clarification',
        options: clarificationPrompt.options || clarificationPrompt.interpretations
      };
    } else {
      // ===== STEP 3D: GENERATE RESPONSE =====
      botResponse = generateEnhancedResponse(
        sanitized,
        settings,
        contextManager,
        classificationResult,
        kbState
      );

      // ===== STEP 3E: AUGMENT RESPONSE =====
      botResponse = augmentResponseWithContext(botResponse, kbState, sanitized);

      // ===== STEP 3F: ADD CONTEXTUAL PREFIX =====
      const contextualPrefix = buildContextualPrefix(
        contextManager,
        sanitized,
        classificationResult.intent
      );

      if (contextualPrefix) {
        botResponse.text = contextualPrefix + botResponse.text;
      }

      // ===== STEP 3G: TRACK UNRESOLVED QUESTIONS =====
      if (
        classificationResult.intent === INTENT_TYPES.DEFINITION ||
        classificationResult.intent === INTENT_TYPES.HOW_TO ||
        classificationResult.followUpSuggested
      ) {
        contextManager.addUnresolvedQuestion(
          sanitized,
          classificationResult.intent
        );
      }

      // Add message ID and timestamp
      botResponse.id = botResponse.id || `msg_${Date.now()}_${Math.floor(Math.random()*10000)}`;
      botResponse.from = botResponse.from || 'bot';
      botResponse.timestamp = botResponse.timestamp || new Date().toISOString();
    }

    // ===== STEP 3H: ADD TO MESSAGES =====
    setMessages(prev => {
      const updated = [...prev, {
        from: 'user',
        text: sanitized,
        id: `msg_${Date.now()}_user`,
        timestamp: new Date().toISOString(),
        type: 'user-message'
      }, botResponse];
      
      // Save to localStorage
      try {
        localStorage.setItem('saipul_chat_history', JSON.stringify(updated));
        localStorage.setItem('saipul_chat_version', CHATBOT_VERSION);
      } catch (e) {
        console.warn('Could not save chat history:', e);
      }
      
      return updated;
    });

    // ===== STEP 3I: SAVE CONTEXT =====
    try {
      localStorage.setItem('saipul_context_manager', JSON.stringify({
        messages: contextManager.messages,
        topics: contextManager.topics,
        entities: contextManager.entities
      }));
    } catch (e) {
      console.warn('Could not save context manager:', e);
    }

    // Reset input
    setInput('');

  } catch (error) {
    console.error('Error handling user message:', error);
    
    // Fallback response
    const fallback = generateSmartFallback(userMessage, 0.3, contextManager.getSummary());
    setMessages(prev => [...prev, {
      from: 'bot',
      text: fallback.text,
      timestamp: new Date().toISOString(),
      type: 'error',
      id: `msg_${Date.now()}_error`
    }]);
  }
}, [messages, settings, kbState, lastInputType, contextManager]);


// ============================================
// STEP 4: HANDLE CLARIFICATION RESPONSES
// ============================================

// Tambahkan fungsi ini untuk handle ketika user menjawab clarification:

const handleClarificationResponse = useCallback((userResponse) => {
  if (!pendingClarification) {
    // Tidak ada clarification pending, treat as normal message
    handleSendMessage(userResponse);
    return;
  }

  try {
    // Parse user's clarification response
    const parsed = parseUserClarification(userResponse, pendingClarification);

    if (parsed.understood) {
      // User berhasil clarify
      console.log('Clarification understood:', parsed);
      setPendingClarification(null);

      // Now generate response dengan info yang sudah diclarify
      const enhancedContext = {
        ...pendingClarification,
        userClarification: parsed
      };

      const botResponse = generateEnhancedResponse(
        userResponse,
        settings,
        contextManager,
        {
          intent: INTENT_TYPES.CLARIFICATION,
          confidence: parsed.confidence
        },
        kbState
      );

      setMessages(prev => [...prev, {
        from: 'bot',
        text: botResponse.text,
        timestamp: new Date().toISOString(),
        type: 'response-after-clarification',
        id: `msg_${Date.now()}_clarified`
      }]);

    } else {
      // User tidak clarify dengan baik
      const retryPrompt = {
        from: 'bot',
        text: `Hmm, aku masih kurang jelas. Bisa ulangi? ${pendingClarification.data ? '(Pilih dari opsi yang ada)' : '(Kasih detail lebih)'}`,
        timestamp: new Date().toISOString(),
        type: 'clarification-retry',
        id: `msg_${Date.now()}_retry`
      };

      setMessages(prev => [...prev, retryPrompt]);
    }

  } catch (error) {
    console.error('Error handling clarification response:', error);
    setPendingClarification(null);
    handleSendMessage(userResponse); // Fallback to normal handling
  }

}, [pendingClarification, settings, kbState, contextManager]);


// ============================================
// STEP 5: UPDATE SEND FUNCTION
// ============================================

// Update fungsi yang dipanggil saat user send message
// (biasanya di component yang display chat input)

// OLD WAY:
// const handleSend = () => {
//   handleSendMessage(input);
// };

// NEW WAY:
const handleSend = () => {
  if (pendingClarification) {
    handleClarificationResponse(input);
  } else {
    handleSendMessage(input);
  }
};


// ============================================
// STEP 6: CLEANUP ON UNMOUNT
// ============================================

// Tambahkan cleanup effect:

useEffect(() => {
  return () => {
    // Save context when component unmounts
    try {
      localStorage.setItem('saipul_context_manager', JSON.stringify({
        messages: contextManager.messages,
        topics: contextManager.topics,
        entities: contextManager.entities
      }));
    } catch (e) {
      console.warn('Could not save context on unmount:', e);
    }
  };
}, [contextManager]);


// ============================================
// STEP 7: EXPORT CONTEXT MANAGER
// ============================================

// Jika Anda ingin expose context manager untuk debugging:
// return {
//   // ... existing returns ...
//   contextManager, // Add this
//   pendingClarification // Add this
// };


// ============================================
// MINIMAL VERSION (if you want less code)
// ============================================

// Jika Anda hanya ingin implement intent classification + better responses:

const handleSendMessage_MINIMAL = async (userMessage) => {
  const sanitized = sanitizeInput(userMessage.trim());
  
  // Classify intent
  const classification = classifyIntent(sanitized);
  
  // Generate response
  const response = generateEnhancedResponse(
    sanitized,
    settings,
    {}, // empty context for now
    classification,
    kbState
  );
  
  // Add to messages
  setMessages(prev => [...prev, {
    from: 'bot',
    text: response.text,
    timestamp: new Date().toISOString()
  }]);
};


// ============================================
// TESTING SNIPPET
// ============================================

// Gunakan ini untuk test di browser console:

/*
// Test 1: Intent classification
import { classifyIntent } from './utils/advancedIntentClassifier';
const result = classifyIntent('Bagaimana cara membuat neural network?');
console.log(result); // Should show { intent: 'how_to', confidence: 0.8+, ... }

// Test 2: KB Query
import { smartKBQuery } from './utils/smartKBQuery';
const kbResults = smartKBQuery('machine learning', knowledgeBase);
console.log('Found', kbResults.length, 'results');

// Test 3: Context Manager
import { ConversationContextManager } from './utils/conversationContext';
const manager = new ConversationContextManager();
manager.addMessage('Halo!', { intent: 'greeting' });
manager.addMessage('Bagaimana kabar?', { intent: 'greeting' });
console.log(manager.getSummary());
*/


// ============================================
// DEBUGGING HELPER FUNCTIONS
// ============================================

// Add these functions to help with debugging:

export function debugClassification(text) {
  const result = classifyIntent(text);
  console.log('=== INTENT CLASSIFICATION ===');
  console.log('Text:', text);
  console.log('Intent:', result.intent);
  console.log('Confidence:', result.confidence);
  console.log('Complexity:', result.complexity);
  console.log('Requires Reasoning:', result.reasoning);
  console.log('Follow-up Suggested:', result.followUpSuggested);
  return result;
}

export function debugContext() {
  console.log('=== CONVERSATION CONTEXT ===');
  console.log('Summary:', contextManager.getSummary());
  console.log('Recent Messages:', contextManager.getRecentContext(3));
  console.log('Unresolved Questions:', contextManager.unresolvedQuestions);
  return contextManager;
}

export function debugKBQuery(query) {
  const results = smartKBQuery(query, kbState, { returnMetadata: true });
  console.log('=== KB QUERY RESULTS ===');
  console.log('Query:', query);
  console.log('Found:', results.length, 'results');
  results.forEach((r, i) => {
    console.log(`${i+1}. [${r.matchType}] Score: ${r.relevanceScore.toFixed(2)}`);
    console.log(`   Answer: ${r.answer.slice(0, 80)}...`);
  });
  return results;
}

// Usage:
// debugClassification('Your test message')
// debugContext()
// debugKBQuery('Your search query')


// ============================================
// NOTES
// ============================================

/*
1. Pastikan semua imports path benar sesuai folder structure Anda
2. CONTEXT_MANAGER akan auto-save ke localStorage
3. Kalau ada error, check browser console untuk detail
4. Anda bisa customize responses di enhancedResponseGenerator.js
5. Untuk production, uncomment error reporting di handleSendMessage
6. Test thoroughly dengan berbagai message types sebelum deploy
*/
