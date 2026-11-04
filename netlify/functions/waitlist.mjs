// Netlify function: /api/waitlist  (logic lives in server/core.js)
import { handleWaitlist } from '../../server/core.js';

export default (request, context) => handleWaitlist(request, process.env, { ip: context.ip });

export const config = { path: '/api/waitlist' };
