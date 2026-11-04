// All page copy lives here. Edit freely: nothing in the components is hard-coded.

export const brand = {
  name: 'proofy',
  year: 2026
};

export const hero = {
  badge: 'coming soon',
  titleDark: 'Your ad comments,',
  titleGrey: 'now your best reviews.',
  sub: 'Turn Meta ad comments into Shopify reviews. Stay updated, select your best comments across campaigns, and showcase them with beautiful, customizable templates.',
  placeholder: 'Your email address',
  button: 'Get Notified',
  // One line under the form. Add your privacy policy URL to show a link next to it.
  privacy: 'Launch updates only. No spam, unsubscribe anytime.',
  privacyUrl: ''
};

export const footer = {
  left: ['Proofy', 'Shopify app'],
  center: ['Meta ad comments', 'into store reviews'],
  right: ['Waitlist open', `© 2026 Proofy`]
};

// Screens shown in the pop-up card. `icon`: 'check' | 'mail' | 'alert'.
export const screens = {
  // After signing up, when no confirmation email is needed (demo mode, or DOUBLE_OPT_IN=false)
  joined: {
    icon: 'check',
    titleLead: 'You’ve been added to our',
    titleAccent: 'waitlist!',
    body: 'Thanks for joining. We’ll email you the moment Proofy is ready to install on your store.'
  },
  // After signing up with double opt-in (the default for the real API)
  checkInbox: {
    icon: 'mail',
    titleLead: 'Almost there!',
    titleAccent: 'Check your inbox.',
    body: 'We sent a confirmation link to {email}. Click it to lock in your spot on the waitlist.'
  },
  // Opening the link in the confirmation email
  confirmed: {
    icon: 'check',
    titleLead: 'You’re confirmed. See you at',
    titleAccent: 'launch!',
    body: 'Your spot on the Proofy waitlist is locked in. We’ll email you the moment your invite is ready.'
  },
  already: {
    icon: 'check',
    titleLead: 'You’re already',
    titleAccent: 'confirmed!',
    body: 'Your spot is safe. We’ll email you the moment your invite is ready.'
  },
  invalid: {
    icon: 'alert',
    titleLead: 'This link has',
    titleAccent: 'expired.',
    body: 'Links stop working once a newer one is sent. Enter your email on the page again and we’ll send a fresh one.'
  },
  // Unsubscribe link in the email footer: ask first
  unsubscribeAsk: {
    icon: 'alert',
    titleLead: 'Unsubscribe from',
    titleAccent: 'Proofy emails?',
    body: 'You’ll stop getting launch updates and give up your spot on the waitlist.',
    action: 'Unsubscribe',
    cancel: 'Keep me on the list'
  },
  unsubscribed: {
    icon: 'check',
    titleLead: 'You’ve been',
    titleAccent: 'unsubscribed.',
    body: 'You won’t get any more emails from us. Changed your mind? You can join again anytime.'
  },
  error: {
    icon: 'alert',
    titleLead: 'Something went',
    titleAccent: 'wrong.',
    body: 'We couldn’t finish that just now. Try the link from your email again in a minute.'
  }
};

// ── Comment → store review pairs in the slider under the email field ──
// Illustration only: every person, handle and store here is made up.
// platform: 'instagram' renders an Instagram-style comment, 'facebook' a Facebook-style one.
export const transitions = [
  { platform: 'instagram', handle: 'jenna.makes', time: '2h', likes: 214, product: 'Cedar & Smoke Candle', text: 'Burned through mine in a week, already ordered two more 🔥' },
  { platform: 'facebook', name: 'Daniel Whitford', time: '5h', likes: 241, product: 'Kids’ Trail Sneakers', text: 'My son hasn’t taken these sneakers off since they arrived.' },
  { platform: 'instagram', handle: 'emma.swims', time: '1d', likes: 309, product: 'Saltline One-Piece', text: 'Finally a swimsuit that stays put when I actually swim 🙌' },
  { platform: 'facebook', name: 'Priya Sharma', time: '3h', likes: 132, product: 'Loam Stoneware Mug', text: 'Heavier than I expected in the best way. My coffee tastes better, I swear.' },
  { platform: 'instagram', handle: 'omar.brews', time: '6h', likes: 190, product: 'Cinder House Blend', text: 'Switched from my old beans after one bag. Smooth, zero bitterness.' },
  { platform: 'facebook', name: 'Lena Vogel', time: '1d', likes: 118, product: 'Monstera, Medium', text: 'The plant arrived healthier than the ones at my local shop 🌿' },
  { platform: 'instagram', handle: 'maya.ontheroad', time: '4h', likes: 276, product: 'Drift Weekender Bag', text: 'Took it on three flights already. Fits under the seat and still looks brand new.' },
  { platform: 'facebook', name: 'Chris Palmer', time: '8h', likes: 76, product: 'Ferro Pro Hand Saw', text: 'Used it on a full deck rebuild. Still sharp. Worth every cent.' },
  { platform: 'instagram', handle: 'sofia.glow', time: '3d', likes: 412, product: 'Dewy Barrier Serum', text: 'Two weeks in and my skin has never looked this calm. Obsessed ✨' },
  { platform: 'facebook', name: 'Marcus Reed', time: '2d', likes: 154, product: 'Trailhead Running Shorts', text: 'Ran a half marathon in these. No chafing, pockets actually hold my phone.' },
  { platform: 'instagram', handle: 'the.cozy.nook', time: '9h', likes: 233, product: 'Chunky Knit Throw', text: 'Softest blanket we own. The dog has officially claimed it 🐶' },
  { platform: 'facebook', name: 'Aisha Rahman', time: '12h', likes: 168, product: 'Cedar & Smoke Candle', text: 'The smell fills my whole apartment. Best candle I’ve bought this year.' }
];
