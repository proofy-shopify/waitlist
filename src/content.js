// All page copy lives here. Edit freely: nothing in the components is hard-coded.

export const brand = {
  name: 'proofy',
  year: 2026
};

export const hero = {
  badge: 'coming soon',
  // The big two-line tagline (shown as the headline, but it isn't the page's <h1>)
  titleDark: 'Your ad comments,',
  titleGrey: 'now your best reviews.',
  // The page's <h1> for search engines, shown in the smaller line under the tagline
  sub: 'Turn Facebook & Instagram ad comments into Shopify social proof.',
  placeholder: 'Your email address',
  button: 'Get Notified',
  // One line under the form. Add your privacy policy URL to show a link next to it.
  privacy: 'Launch updates only. No spam, unsubscribe anytime.',
  privacyUrl: '/privacy'
};

export const footer = {
  left: ['Proofy', 'Shopify app'],
  center: ['Meta ad comments', 'into store reviews'],
  right: ['Waitlist open', `© 2026 Proofy`]
};

// ── Homepage sections below the first screen ──
// Text can contain [link text](/path) for internal links.
export const home = {
  how: {
    eyebrow: 'How it works',
    title: 'How Proofy works',
    intro: 'Three steps take a comment from under your ad to your product page.',
    steps: [
      {
        title: 'Connect your Meta account',
        text: 'Link the Meta ad account you run your Facebook and Instagram ads from.'
      },
      {
        title: 'Choose your ad campaigns',
        text: 'Select the Facebook and Instagram campaigns you want Proofy to scan for comments.'
      },
      {
        title: 'Show the best comments on Shopify',
        text: 'Proofy collects the comments and highlights the positive ones. You pick which appear on your product pages.'
      }
    ]
  },
  why: {
    eyebrow: 'Why it matters',
    title: 'Your ad comments are social proof you already have',
    paragraphs: [
      'Shoppers look for signs that people like them have bought a product and were happy with it. Busy ads often collect exactly that: customers saying how a product fits, lasts or performs, in their own words and in public.',
      'The trouble is where those comments live. A shopper sees them for a moment in the feed, taps through, and lands on a product page that shows none of it. Proofy brings that engagement to the page where the buying decision happens. Read more about [what social proof means for a Shopify store](/shopify-social-proof).'
    ]
  },
  features: {
    eyebrow: 'Features',
    title: 'Built for stores that advertise on Meta',
    items: [
      {
        title: 'Meta campaign scanning',
        icon: 'meta',
        text: 'Choose which Facebook and Instagram ad campaigns Proofy reads. Nothing outside your selection is touched.'
      },
      {
        title: 'Automatic comment collection',
        icon: 'platforms',
        text: 'Comments on your selected campaigns are collected for you as they come in. No screenshots, no copy and paste.'
      },
      {
        title: 'Comment selection and management',
        icon: 'select',
        text: 'Proofy highlights the positive comments. You decide which ones go live and can take any of them down again.'
      },
      {
        title: 'Social proof on product pages',
        icon: 'shopify',
        text: 'Selected comments appear on your Shopify product pages in a display you can customize to suit your store.'
      }
    ]
  },
  guides: {
    eyebrow: 'Learn more',
    title: 'Guides to ad comments as social proof',
    // Each card's summary is the `teaser` in src/content/landing.js
    links: [
      { href: '/shopify-social-proof', label: 'Shopify social proof' },
      { href: '/facebook-comments-shopify', label: 'Facebook comments on Shopify' },
      { href: '/instagram-comments-shopify', label: 'Instagram comments on Shopify' },
      { href: '/facebook-ads-social-proof', label: 'Facebook ads social proof' }
    ]
  },
  faqTitle: 'Frequently asked questions',
  faqs: [
    {
      q: 'What is Proofy?',
      a: 'Proofy is a Shopify app that turns the positive comments on your Facebook and Instagram ads into social proof on your Shopify product pages. It’s launching soon, and you can join the waitlist for early access.'
    },
    {
      q: 'How does Proofy work?',
      a: 'You connect your Meta account and choose the ad campaigns you want Proofy to scan. Proofy collects the comments on those ads and highlights the positive ones. You choose which comments appear on your product pages, in a display you can customize.'
    },
    {
      q: 'Does Proofy work with Facebook and Instagram ads?',
      a: 'Yes. Proofy works with comments on the Facebook and Instagram ads you run through your Meta ad account. See how it handles [Facebook ad comments](/facebook-comments-shopify) and [Instagram ad comments](/instagram-comments-shopify).'
    },
    {
      q: 'Can I select which comments appear on my product pages?',
      a: 'Yes. Proofy highlights the positive comments, but nothing appears on your store until you choose it, and you can remove a comment whenever you like.'
    },
    {
      q: 'Does Proofy automatically collect comments?',
      a: 'Yes. Once you’ve chosen your campaigns, Proofy collects their comments automatically, including new ones that arrive while the ads keep running.'
    },
    {
      q: 'Is Proofy compatible with Shopify?',
      a: 'Proofy is built specifically for Shopify. It’s a Shopify app you add to your store, and the comments you choose appear on your Shopify product pages.'
    },
    {
      q: 'Do I need to manually copy comments?',
      a: 'No. Proofy gathers the comments from your selected campaigns for you, so there’s no copying, pasting or screenshotting.'
    },
    {
      q: 'How do I get started with Proofy?',
      a: 'Join the waitlist with your email address. We’ll email you as soon as Proofy is ready to install on your store.'
    }
  ],
  cta: {
    title: 'Be first to put your ad comments to work',
    text: 'Proofy is launching soon. Join the waitlist and we’ll email you when it’s ready for your Shopify store.'
  }
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
  { platform: 'facebook', name: 'Ines Calder', time: '3h', likes: 132, product: 'Loam Stoneware Mug', text: 'Heavier than I expected in the best way. My coffee tastes better, I swear.' },
  { platform: 'instagram', handle: 'omar.brews', time: '6h', likes: 190, product: 'Cinder House Blend', text: 'Switched from my old beans after one bag. Smooth, zero bitterness.' },
  { platform: 'facebook', name: 'Lena Vogel', time: '1d', likes: 118, product: 'Monstera, Medium', text: 'The plant arrived healthier than the ones at my local shop 🌿' },
  { platform: 'instagram', handle: 'maya.ontheroad', time: '4h', likes: 276, product: 'Drift Weekender Bag', text: 'Took it on three flights already. Fits under the seat and still looks brand new.' },
  { platform: 'facebook', name: 'Chris Palmer', time: '8h', likes: 76, product: 'Ferro Pro Hand Saw', text: 'Used it on a full deck rebuild. Still sharp. Worth every cent.' },
  { platform: 'instagram', handle: 'sofia.glow', time: '3d', likes: 412, product: 'Dewy Barrier Serum', text: 'Two weeks in and my skin has never looked this calm. Obsessed ✨' },
  { platform: 'facebook', name: 'Tobias Wren', time: '2d', likes: 154, product: 'Trailhead Running Shorts', text: 'Ran a half marathon in these. No chafing, pockets actually hold my phone.' },
  { platform: 'instagram', handle: 'the.cozy.nook', time: '9h', likes: 233, product: 'Chunky Knit Throw', text: 'Softest blanket we own. The dog has officially claimed it 🐶' },
  { platform: 'facebook', name: 'Leyla Dorsey', time: '12h', likes: 168, product: 'Cedar & Smoke Candle', text: 'The smell fills my whole apartment. Best candle I’ve bought this year.' }
];
