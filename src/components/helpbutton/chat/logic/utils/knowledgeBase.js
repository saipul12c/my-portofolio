// Dynamic knowledge base loader
// This file aggregates data from various JSON files in the project

import AIBase from '../../data/AI-base.json';
import cards from '../../data/cards.json';
import certificates from '../../data/certificates.json';
import collaborations from '../../data/collaborations.json';
import interests from '../../data/interests.json';
import profile from '../../data/profile.json';
import softskills from '../../data/softskills.json';

const knowledgeBase = {
  AI: AIBase,
  cards,
  certificates,
  collaborations,
  interests,
  profile,
  softskills
};

export default knowledgeBase;