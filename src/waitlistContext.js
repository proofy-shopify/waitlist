import { createContext, useContext } from 'react';

// Shared waitlist state, so every form on a page (hero, final CTA) shows the same "joined" state
// and opens the same success modal. Provided by App.jsx.
export const WaitlistContext = createContext({ joinedEmail: '', onJoined: () => {}, onReset: () => {} });
export const useWaitlist = () => useContext(WaitlistContext);
