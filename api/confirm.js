// Vercel function: /api/confirm  (logic lives in server/core.js)
import { handleConfirm } from '../server/core.js';

export default {
  fetch(request) {
    return handleConfirm(request, process.env);
  }
};
