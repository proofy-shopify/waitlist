// Vercel function: /api/unsubscribe  (logic lives in server/core.js)
import { handleUnsubscribe } from '../server/core.js';

export default {
  fetch(request) {
    return handleUnsubscribe(request, process.env);
  }
};
