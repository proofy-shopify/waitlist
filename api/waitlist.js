// Vercel function: /api/waitlist  (logic lives in server/core.js)
import { handleWaitlist } from '../server/core.js';

export default {
  fetch(request) {
    return handleWaitlist(request, process.env);
  }
};
