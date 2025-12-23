// Central registration for API modules to keep `index.js` minimal
module.exports = function registerApis(app, deps = {}) {
  const { ensureDataFiles, readJSON, writeJSON, DATA_FILES, USERS_DIR, MESSAGES_DIR, JWT_SECRET, getUserFromAuthHeader, getProfileForUser, readChannelMessagesFile, writeChannelMessagesFile, tryReadStreamingFile, io } = deps;

  try {
    const registerApiGlobal = require('../modules/ApiGlobal');
    const registerApiKomunita = require('../modules/ApiKomunita');
    const registerApiTubs = require('../modules/ApiTubs');
    // AI proxies (OpenAI, etc.)
    const registerApiAI = require('../modules/ApiAI');

    registerApiGlobal(app, { ensureDataFiles, readJSON, writeJSON, DATA_FILES, USERS_DIR, MESSAGES_DIR, JWT_SECRET, getUserFromAuthHeader, getProfileForUser });
    registerApiKomunita(app, { ensureDataFiles, readJSON, writeJSON, DATA_FILES, USERS_DIR, MESSAGES_DIR, readChannelMessagesFile, writeChannelMessagesFile, getProfileForUser, io });
    // If Komunita module exposes extra (non-/api) routes, mount them too
    try {
      if (typeof registerApiKomunita.registerExtraRoutes === 'function') {
        registerApiKomunita.registerExtraRoutes(app, { ensureDataFiles, readJSON, writeJSON, DATA_FILES, USERS_DIR });
      }
    } catch (err) {
      console.warn('Failed to mount extra Komunita routes:', err && err.message);
    }
    registerApiTubs(app, { ensureDataFiles, readJSON, writeJSON, DATA_FILES, tryReadStreamingFile });
    // mount AI routes last
    registerApiAI(app, { ensureDataFiles, readJSON, writeJSON, DATA_FILES, USERS_DIR, MESSAGES_DIR, io });
  } catch (err) {
    console.warn('Failed to register API modules:', err && err.message);
    throw err;
  }
};
