/**
 * Simple coreference/anaphora resolver for multi-turn chats
 * - Heuristic: resolve pronouns (dia, dia-nya, itu, mereka, itu) to most recent entity in context
 * - Context is expected to be ConversationContextManager or an object with messages/entities
 */

const PRONOUNS = /\b(itu|dia|diajuga|mereka|kamu|kau|saya|aku|ini|tersebut|yang itu)\b/i;

export function resolvePronouns(message, context) {
  if (!message || !context) return { resolvedMessage: message, mapping: {} };
  // get recent entities from context (most recent first)
  let antecedents = [];
  try {
    if (typeof context.getRecentContext === 'function') {
      const recent = context.getRecentContext(6);
      // gather entities mentioned in recent messages
      for (let i = recent.length - 1; i >= 0; i--) {
        const m = recent[i];
        if (m.entities && m.entities.length > 0) antecedents.push(...m.entities);
        // also consider names / topics
        if (m.content) {
          const names = (m.content.match(/([A-Z][a-z]{2,})/g) || []).slice(0,2);
          antecedents.push(...names);
        }
      }
    } else if (Array.isArray(context.messages)) {
      for (let i = context.messages.length - 1; i >= 0; i--) {
        const m = context.messages[i];
        if (m.entities && m.entities.length > 0) antecedents.push(...m.entities);
        if (m.content) {
          const names = (m.content.match(/([A-Z][a-z]{2,})/g) || []).slice(0,2);
          antecedents.push(...names);
        }
      }
    }
  } catch (e) { /* ignore */ }

  antecedents = antecedents.filter(Boolean);
  const mapping = {};
  let resolved = message;

  // naive replacement: replace 'itu'/'dia' with most recent antecedent
  if (PRONOUNS.test(message) && antecedents.length > 0) {
    const top = antecedents[0];
    resolved = resolved.replace(/\b(itu|tersebut|yang itu)\b/gi, top);
    resolved = resolved.replace(/\b(dia|diajuga|mereka)\b/gi, top);
    mapping.pronoun = top;
  }

  return { resolvedMessage: resolved, mapping };
}

export default { resolvePronouns };
