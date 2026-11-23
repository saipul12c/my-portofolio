/**
 * Netlify Function Wrapper for SaipulAI API
 * Endpoint: /.netlify/functions/saipul -> diproksikan dari /api/saipul
 */

import saipulHandler from '../../api/saipul.js';

export const handler = async (event, context) => {
  return await saipulHandler(event, context);
};

export default saipulHandler;
