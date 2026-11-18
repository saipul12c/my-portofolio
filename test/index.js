/**
 * test/index.js
 * Index berkas pengujian 200 situasi nyata SaipulAI
 */

import { portfolioFactualSituations } from './situations/01_portfolio_factual.js';
import { technicalCodingSituations } from './situations/02_technical_coding.js';
import { conversationalPersonaSituations } from './situations/03_conversational_persona.js';
import { typosSlangLinguisticsSituations } from './situations/04_typos_slang_linguistics.js';
import { safetyEthicsEdgecasesSituations } from './situations/05_safety_ethics_edgecases.js';
import { multiTurnComplexSituations } from './situations/06_multi_turn_complex.js';
import { navigationCommunitySituations } from './situations/07_navigation_community.js';
import { boundaryStressFailuresSituations } from './situations/08_boundary_stress_failures.js';

export const all200Situations = [
  ...portfolioFactualSituations,
  ...technicalCodingSituations,
  ...conversationalPersonaSituations,
  ...typosSlangLinguisticsSituations,
  ...safetyEthicsEdgecasesSituations,
  ...multiTurnComplexSituations,
  ...navigationCommunitySituations,
  ...boundaryStressFailuresSituations
];

export const situationCategories = [
  { id: 1, name: "Portfolio Factual", count: portfolioFactualSituations.length, range: "1 - 25" },
  { id: 2, name: "Technical & Coding", count: technicalCodingSituations.length, range: "26 - 50" },
  { id: 3, name: "Conversational & Persona", count: conversationalPersonaSituations.length, range: "51 - 75" },
  { id: 4, name: "Linguistics & Typos", count: typosSlangLinguisticsSituations.length, range: "76 - 100" },
  { id: 5, name: "Safety & Ethics", count: safetyEthicsEdgecasesSituations.length, range: "101 - 125" },
  { id: 6, name: "Complex & Multi-Turn", count: multiTurnComplexSituations.length, range: "126 - 150" },
  { id: 7, name: "Navigation & Community", count: navigationCommunitySituations.length, range: "151 - 175" },
  { id: 8, name: "Boundary & Stress", count: boundaryStressFailuresSituations.length, range: "176 - 200" }
];

export default all200Situations;
