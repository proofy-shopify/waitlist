// Netlify function: /api/confirm  (logic lives in server/core.js)
import { handleConfirm } from '../../server/core.js';

export default (request, context) => handleConfirm(request, process.env, { ip: context.ip });

export const config = { path: '/api/confirm' };
