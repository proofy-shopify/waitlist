// Blog posts. A post is only built, linked and listed in the sitemap when `status` is 'published',
// and /blog itself only exists once at least one post is published. Until then nothing here is public.
//
// To publish a post:
//   1. Write its `sections` (same block format as the landing pages: { p }, { ul }, { ol }, { steps }).
//      Each section needs a `title` (an H2). Use [text](/path) for internal links.
//   2. Add `faqs` if readers genuinely ask those questions (optional).
//   3. Set `date` (first published) and `updated`, both as YYYY-MM-DD, and `status: 'published'`.
//   4. Run `npm run build`. The post gets its own page, Article + breadcrumb structured data,
//      a place on /blog and an entry in sitemap.xml.
//
// The `brief` and `outline` fields are notes for the writer and are never shown on the site.
// Publish a post only when it says something specific and useful that a merchant can't find in
// the landing pages already.

export const author = { name: 'The Proofy team' };

export const posts = [
  {
    slug: 'facebook-ad-comments-shopify',
    title: 'How to Turn Facebook Ad Comments Into Shopify Reviews',
    description: 'A step-by-step look at finding, choosing and displaying Facebook ad comments on Shopify product pages.',
    status: 'draft',
    brief: 'Practical walkthrough for merchants who want to reuse Facebook ad comments, manual method first, then with Proofy.',
    outline: [
      'Where Facebook ad comments live (feed placements, the ad post, Ads Manager) and how to find them',
      'Which comments qualify, with real-feeling before/after examples',
      'The manual process and its limits',
      'Doing it with Proofy (only shipped features)',
      'Keeping it honest: no edits that change meaning, keep the source visible'
    ],
    sections: []
  },
  {
    slug: 'shopify-social-proof',
    title: 'How to Add Social Proof to Shopify Product Pages',
    description: 'The kinds of social proof a Shopify product page can show, and where each one works best.',
    status: 'draft',
    brief: 'Broader guide than the /shopify-social-proof landing page: cover reviews, UGC, popularity signals, guarantees, with placement advice. Link to the landing page, do not repeat it.',
    outline: [
      'Types of social proof and what each signals',
      'Placement on the product page: above the fold, near price, near Add to cart, lower down',
      'Mobile considerations',
      'Common mistakes (fake urgency, irrelevant praise, stale content)'
    ],
    sections: []
  },
  {
    slug: 'facebook-ad-engagement',
    title: 'Why Your Facebook Ad Comments Are Valuable',
    description: 'What the comments on your Facebook ads reveal about customers, and how to use them beyond the feed.',
    status: 'draft',
    brief: 'Use comments as customer research too: objections, language for copy, product feedback, plus social proof.',
    outline: [
      'Comments as social proof',
      'Comments as research: objections and FAQs',
      'Borrowing customer language for product copy',
      'Moderating and replying to comments on ads'
    ],
    sections: []
  },
  {
    slug: 'instagram-social-proof',
    title: 'How to Use Instagram Comments as Social Proof',
    description: 'Making short, enthusiastic Instagram ad comments useful on a Shopify product page.',
    status: 'draft',
    brief: 'Focus on short-form comments: grouping, choosing specific ones, mixing with longer Facebook comments.',
    outline: [
      'How Instagram comments differ from Facebook comments',
      'Choosing short comments that still say something',
      'Grouping and layout on product pages',
      'Ad comments vs organic comments (Proofy handles ad comments)'
    ],
    sections: []
  },
  {
    slug: 'customer-reviews-vs-social-proof',
    title: 'Customer Reviews vs. Social Proof',
    description: 'How customer reviews relate to the wider idea of social proof, and when each one helps a shopper most.',
    status: 'draft',
    brief: 'Clarify terms; reviews are one kind of social proof. When each helps; using both together.',
    outline: ['Definitions', 'Strengths and limits of reviews', 'Other forms of social proof', 'Using them together'],
    sections: []
  },
  {
    slug: 'shopify-conversion-optimization',
    title: 'How to Build Trust on a Shopify Store',
    description: 'The trust signals Shopify shoppers look for before they buy, from store policies to social proof.',
    status: 'draft',
    brief: 'Trust building as part of conversion optimization: policies, shipping clarity, contact info, payment badges, social proof.',
    outline: [
      'Why first-time shoppers hesitate',
      'Store-level trust signals (policies, contact, shipping times)',
      'Product-level trust signals (photos, details, social proof)',
      'Measuring changes with Shopify analytics'
    ],
    sections: []
  },
  {
    slug: 'meta-ad-engagement',
    title: 'How to Get More Value From Your Meta Ad Engagement',
    description: 'Ways to reuse the comments, reactions and questions your Facebook and Instagram ads collect.',
    status: 'draft',
    brief: 'Reuse engagement across the funnel: product pages, FAQs, creative ideas, retargeting copy.',
    outline: [
      'What engagement your Meta ads produce',
      'On-site reuse: product pages and FAQs',
      'Creative reuse: new ad angles from comments',
      'Where Proofy fits'
    ],
    sections: []
  }
];

export const publishedPosts = posts
  .filter(p => p.status === 'published')
  .sort((a, b) => (a.date < b.date ? 1 : -1));
