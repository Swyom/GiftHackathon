// Root entry that delegates to the backend/server.js module
// This allows running `node server.js` from the project root
import './backend/server.js';

// Note: `backend/server.js` performs the server.listen side-effect.
// Keep this file minimal so root-level `node server.js` works the same way.
