// Netlify function: /api/unsubscribe  (logic lives in server/core.js)
import { handleUnsubscribe } from '../../server/core.js';

export default (request, context) => handleUnsubscribe(request, process.env, { ip: context.ip });

export const config = { path: '/api/unsubscribe' };
