// The four landing pages. Each page has its own angle and copy, so nothing is repeated between them.
// Text can contain [link text](/path) for internal links.
// Block types in `sections[].body`: { p }, { ul: [] }, { ol: [] }, { steps: [{ title, text }] }.
// `example` picks a comment from `transitions` in src/content.js for the illustration.

export const landingPages = [
  {
    path: '/shopify-social-proof',
    icon: 'shopify',
    // Short summary used on link cards (homepage guides, related guides)
    teaser: 'What social proof is, where it belongs on a product page, and how ad comments fit in.',
    crumb: 'Shopify social proof',
    title: 'Shopify Social Proof: Turn Ad Comments Into Trust | Proofy',
    description:
      'Discover how to use Facebook and Instagram ad comments as social proof on Shopify product pages. Showcase real engagement with Proofy.',
    eyebrow: 'Shopify social proof',
    h1: 'Turn your Shopify product pages into social proof machines.',
    intro:
      'Social proof is the evidence that other people already want what you sell. If you run Facebook and Instagram ads, you’re collecting that evidence every day in the comments. Proofy brings it onto your Shopify product pages, where shoppers make up their minds.',
    example: 2,
    updated: '2026-11-21',
    sections: [
      {
        title: 'What social proof means for a Shopify store',
        body: [
          { p: 'Online shoppers can’t pick a product up, so they look for signs that other people have bought it and liked it. On a Shopify store, that evidence usually takes one of these forms:' },
          {
            ul: [
              'Customer reviews and star ratings left after a purchase.',
              'Photos and videos from customers using the product.',
              'Signs of demand, such as bestseller labels or a product selling out.',
              'Public reactions to your brand, such as comments on your social posts and ads.'
            ]
          },
          { p: 'Each one works for the same reason: it comes from someone other than you. Your product description says what you believe about the product. Social proof shows what customers think of it.' }
        ]
      },
      {
        title: 'Why your strongest social proof may be sitting under your ads',
        body: [
          { p: 'New products have a familiar problem. There are no reviews yet, and without reviews, sales are slower, which means reviews arrive slower too. Meanwhile, an ad that has been running for a while often has comments from people who already own the product: they describe how it worked for them, answer other people’s questions and tag friends who should try it.' },
          { p: 'Those comments are written in the customer’s own words, in public, often before you ever asked anyone for a review. But they stay on Facebook and Instagram. A shopper who clicks the ad sees them for a moment, then lands on a product page that shows none of it.' }
        ]
      },
      {
        title: 'What makes an ad comment worth showing',
        body: [
          { p: 'Not every comment helps a shopper decide. The ones worth putting on a product page are:' },
          {
            ul: [
              '**Specific.** They mention how the product fits, tastes, lasts or performs.',
              '**Genuine.** They read like a real customer, not a bot, a giveaway entry or a bare tag of a friend.',
              '**Relevant.** They’re about the product on that page, not another item or an unrelated order.',
              '**Current.** They describe the product as you sell it today.'
            ]
          },
          { p: 'Picking comments with those qualities and showing them as they were written keeps your social proof honest. Rewording a comment to change its meaning, or mixing in comments you wrote yourself, undermines the trust you’re trying to build.' }
        ]
      },
      {
        title: 'How Proofy puts ad comments on your product pages',
        body: [
          {
            steps: [
              { title: 'Connect your Meta account', text: 'Link the ad account you run your Facebook and Instagram ads from.' },
              { title: 'Choose your campaigns', text: 'Select the campaigns you want Proofy to scan for comments.' },
              { title: 'Pick comments and publish', text: 'Proofy collects the comments and highlights the positive ones. You choose which appear on which product pages, in a display you can customize.' }
            ]
          },
          { p: 'As your campaigns keep running, new comments are collected automatically, so there’s nothing to screenshot or paste. For a closer look at each platform, see how to use [Facebook ad comments on Shopify](/facebook-comments-shopify) and [Instagram ad comments on Shopify](/instagram-comments-shopify).' }
        ]
      },
      {
        title: 'Where social proof belongs on a product page',
        body: [
          { p: 'Where you place social proof matters as much as what it says. Shoppers look for reassurance at the moment they hesitate, which is usually near the price and the Add to cart button, and again as they scroll for details.' },
          {
            ul: [
              'Put one short, strong comment close to the buy button, and keep longer ones further down the page.',
              'Match comments to the product. Praise for a different item makes shoppers wonder about the rest.',
              'Check how it reads on a phone, since most traffic from social ads arrives on mobile.',
              'Swap in better comments as they come in, so the page doesn’t go stale.'
            ]
          }
        ]
      }
    ],
    faqs: [
      {
        q: 'What is Shopify social proof?',
        a: 'It’s any evidence on your Shopify store that other people have bought, used or liked your products: reviews and ratings, customer photos, popularity signals, and comments from social media, including comments on your ads.'
      },
      {
        q: 'Are ad comments the same as product reviews?',
        a: 'Not quite. A review is usually requested after a purchase. An ad comment is posted voluntarily and in public, and it may come from a buyer or from someone still deciding. That’s why Proofy lets you choose which comments to show instead of publishing everything.'
      },
      {
        q: 'Can ad comments help a new product with no reviews yet?',
        a: 'They can give you something to show sooner. If your ads already have positive comments from customers, those can appear on your product pages before post-purchase reviews have had time to build up.'
      },
      {
        q: 'Will negative comments show up on my store?',
        a: 'No. Proofy highlights the positive comments, and nothing appears on your store unless you choose it.'
      }
    ],
    related: ['/facebook-ads-social-proof', '/facebook-comments-shopify', '/instagram-comments-shopify'],
    cta: {
      title: 'Get early access to Proofy',
      text: 'Proofy is launching soon. Join the waitlist and we’ll email you when it’s ready to install on your store.'
    }
  },

  {
    path: '/facebook-comments-shopify',
    icon: 'facebook',
    // Short summary used on link cards (homepage guides, related guides)
    teaser: 'Get Facebook ad comments out from under your ads and onto your product pages.',
    crumb: 'Facebook comments on Shopify',
    title: 'How to Use Facebook Ad Comments on Shopify | Proofy',
    description:
      'Turn Facebook ad comments into social proof on your Shopify store. Discover how Proofy helps you collect and showcase relevant comments.',
    eyebrow: 'Facebook comments on Shopify',
    h1: 'Turn your Facebook ad comments into Shopify social proof.',
    intro:
      'Every Facebook ad you run has a comment section, and some of the best things ever said about your products are in it. Here’s how to get those comments off Facebook and onto the Shopify product pages where buyers decide.',
    example: 1,
    updated: '2026-11-21',
    sections: [
      {
        title: 'The problem: your best feedback is buried under your ads',
        body: [
          { p: 'Comments on Facebook ads live somewhere shoppers only pass through. Someone scrolls their feed, sees your ad, maybe glances at the comments, and taps through to your store. On the product page, that conversation has disappeared.' },
          { p: 'It gets harder to find over time, too. Ads are paused, creatives are replaced and campaigns end. The comments from a campaign you ran last season are still there, but nobody reads them anymore, including you.' }
        ]
      },
      {
        title: 'Why Facebook ad comments are worth reusing',
        body: [
          {
            ul: [
              '**They answer real objections.** Comments often cover what hesitant shoppers wonder about: sizing, quality, how long something lasts, whether it arrived on time.',
              '**They’re in the customer’s voice.** A comment reads differently from marketing copy, which is exactly why shoppers trust it.',
              '**They build up quickly.** An ad shown to a large audience can gather comments faster than a new product gathers reviews.',
              '**Facebook comments tend to be detailed.** People often write full sentences and tell a short story, which gives a shopper real context.'
            ]
          }
        ]
      },
      {
        title: 'The manual way, and why it doesn’t last',
        body: [
          { p: 'Without a tool, getting Facebook comments onto Shopify usually looks like this:' },
          {
            ol: [
              'Open each ad and read through its comments.',
              'Copy the good ones, or take screenshots of them.',
              'Paste them into your product pages or another app by hand.',
              'Repeat the whole thing whenever new comments come in.'
            ]
          },
          { p: 'Screenshots are hard to read on a phone, pasted text loses who said it and where, and the routine stops the moment you get busy.' }
        ]
      },
      {
        title: 'How Proofy brings Facebook comments to Shopify',
        body: [
          {
            steps: [
              { title: 'Connect your Meta account', text: 'Proofy works with the Meta ad account you run your Facebook ads from.' },
              { title: 'Select your campaigns', text: 'Choose the Facebook ad campaigns you want Proofy to scan for comments.' },
              { title: 'Choose and display', text: 'Proofy collects comments from those ads automatically and highlights the positive ones. You decide which appear on which product pages.' }
            ]
          },
          { p: 'Because collection is automatic, new comments on running campaigns are picked up without any copying. You stay in control of what’s published: nothing goes on your store until you choose it. Proofy handles [Instagram ad comments](/instagram-comments-shopify) in the same way.' }
        ]
      },
      {
        title: 'Tips for choosing which Facebook comments to show',
        body: [
          {
            ul: [
              'Favor comments from people who say they bought or used the product.',
              'Skip comments that only tag a friend. They show interest, but they don’t tell a shopper anything.',
              'Leave out comments about promotions that have ended, so the page doesn’t promise something you no longer offer.',
              'Choose a mix that covers different concerns, such as quality, fit, delivery and value.'
            ]
          }
        ]
      }
    ],
    faqs: [
      {
        q: 'Can I import Facebook comments to Shopify automatically?',
        a: 'Yes, that’s what Proofy is for. After you connect your Meta account and choose your campaigns, Proofy collects the comments on those ads automatically. You still decide which ones are displayed.'
      },
      {
        q: 'Does Proofy use comments from regular Facebook posts?',
        a: 'Proofy is built around comments on your Facebook and Instagram ads, the ones you run through your Meta ad account.'
      },
      {
        q: 'Do I need to copy comments by hand?',
        a: 'No. Proofy gathers comments from the campaigns you select, so there’s no copying, pasting or screenshotting.'
      },
      {
        q: 'Can I display Facebook comments on specific product pages?',
        a: 'Yes. You choose which comments appear on which product pages, so each comment shows up next to the product it’s about.'
      }
    ],
    related: ['/instagram-comments-shopify', '/facebook-ads-social-proof', '/shopify-social-proof'],
    cta: {
      title: 'Put your Facebook comments to work',
      text: 'Join the Proofy waitlist and we’ll email you as soon as you can bring your Facebook ad comments to your store.'
    }
  },

  {
    path: '/instagram-comments-shopify',
    icon: 'instagram',
    // Short summary used on link cards (homepage guides, related guides)
    teaser: 'Make short, enthusiastic Instagram ad comments work on a product page.',
    crumb: 'Instagram comments on Shopify',
    title: 'Instagram Comments on Shopify Product Pages | Proofy',
    description:
      'Make your Instagram ad engagement work harder. Discover how to showcase relevant Instagram comments as social proof on Shopify.',
    eyebrow: 'Instagram comments on Shopify',
    h1: 'Bring your Instagram ad comments to your Shopify store.',
    intro:
      'Instagram comments are quick and enthusiastic: a “need this,” a heart, a line about how a product held up. When those comments are on your ads, Proofy can collect the positive ones and show them on your Shopify product pages.',
    example: 0,
    updated: '2026-11-21',
    sections: [
      {
        title: 'What Instagram ad comments tell a shopper',
        body: [
          { p: 'Instagram comments tend to be short. On its own, a few words might not seem like much. Together, they tell a shopper two things a product page can’t say about itself: real people are paying attention to this product, and people who own it are happy to say so in public.' },
          { p: 'The most useful ones go further. They mention the fit or finish, compare the product with something else the person tried, or describe how it held up after weeks of use. That’s context a shopper can’t get from product photos alone.' }
        ]
      },
      {
        title: 'Ad comments, not organic posts',
        body: [
          { p: 'Proofy works with comments on the Instagram ads you run through your Meta ad account. Comments on your regular, organic Instagram posts aren’t part of the workflow described here.' },
          { p: 'That focus has an upside. Ad comments come from the audience you’re already paying to reach, so they often speak to the same people your product pages are built for.' }
        ]
      },
      {
        title: 'How Proofy handles Instagram comments',
        body: [
          {
            steps: [
              { title: 'Connect Meta', text: 'Instagram ads are managed through Meta, so you connect the Meta account you advertise from.' },
              { title: 'Choose campaigns', text: 'Pick the campaigns running on Instagram that you want Proofy to scan.' },
              { title: 'Select and display', text: 'Proofy collects comments from those ads, highlights the positive ones and lets you choose which appear on your product pages.' }
            ]
          },
          { p: 'The display is customizable, so Instagram comments can sit on your product pages in a way that suits your store.' }
        ]
      },
      {
        title: 'Making short comments work on a product page',
        body: [
          {
            ul: [
              'Pick comments that say something specific, even briefly. “Fits true to size” helps more than a row of emojis.',
              'Show several short comments together. A cluster of reactions reads as momentum in a way a single one can’t.',
              'Keep comments as written, casual tone included. That’s what makes them believable.',
              'Pair Instagram comments with longer [Facebook ad comments](/facebook-comments-shopify) where you have them, so shoppers get quick reactions and detail.'
            ]
          },
          { p: 'For more on choosing and placing comments, see our guide to [Shopify social proof](/shopify-social-proof).' }
        ]
      }
    ],
    faqs: [
      {
        q: 'Does Proofy work with Instagram ads?',
        a: 'Yes. Proofy collects comments from the Instagram ads you run through your Meta ad account, alongside comments from your Facebook ads.'
      },
      {
        q: 'Can I show comments from my organic Instagram posts?',
        a: 'Proofy is built around comments on your ads. Comments on regular, organic Instagram posts aren’t part of that workflow.'
      },
      {
        q: 'Will Instagram comments appear on my store automatically?',
        a: 'Proofy collects comments from your selected campaigns automatically, but none of them appear on your store until you choose them.'
      },
      {
        q: 'Can I choose which Instagram comments appear?',
        a: 'Yes. Proofy highlights the positive comments, and you pick which ones go on which product pages. You can remove any of them later.'
      }
    ],
    related: ['/facebook-comments-shopify', '/shopify-social-proof', '/facebook-ads-social-proof'],
    cta: {
      title: 'Bring your Instagram comments home',
      text: 'Join the Proofy waitlist and we’ll email you as soon as you can show your Instagram ad comments on your store.'
    }
  },

  {
    path: '/facebook-ads-social-proof',
    icon: 'meta',
    // Short summary used on link cards (homepage guides, related guides)
    teaser: 'Put the engagement you already paid for to work where shoppers decide to buy.',
    crumb: 'Facebook ads social proof',
    title: 'Facebook Ads Social Proof for Shopify Stores | Proofy',
    description:
      'Get more value from your Facebook ad engagement. Turn relevant ad comments into social proof directly on your Shopify product pages.',
    eyebrow: 'Facebook ads social proof',
    h1: 'Your Facebook ads generate engagement. Put it to work.',
    intro:
      'You pay for every impression your ads get, and the comments they collect come with them. Most stores use that engagement once, in the feed. Proofy helps you use it again on your Shopify product pages.',
    example: 3,
    updated: '2026-11-21',
    sections: [
      {
        title: 'Paid ads start conversations',
        body: [
          { p: 'A good ad does more than earn clicks. It gets people talking: customers vouching for a product, friends tagging each other, people asking questions and buyers answering them.' },
          { p: 'That conversation is social proof, but it only reaches the people who see the ad. Shoppers who arrive at your store some other way, from search, an email or a friend’s link, never see it.' }
        ]
      },
      {
        title: 'The gap between the ad and the product page',
        body: [
          { p: 'Clicking an ad takes a shopper from a lively comment section to a product page that may have no customer voices on it at all. That’s the moment they decide whether to buy, and it’s exactly when the reassurance they just saw disappears.' },
          { p: 'Reusing your ad comments closes that gap. The reactions that convinced someone to click are still there when they reach the price and the Add to cart button.' }
        ]
      },
      {
        title: 'How social proof supports purchase confidence',
        body: [
          { p: 'Buying from a store for the first time feels like a risk: will it look like the photos, will it fit, will it arrive? Social proof lowers that uncertainty by showing that real people own the product and like it.' },
          { p: 'It doesn’t replace clear photos, honest shipping times or a fair return policy, but it makes all of them more believable. For the different kinds of social proof and where each one belongs, see our guide to [Shopify social proof](/shopify-social-proof).' }
        ]
      },
      {
        title: 'Getting more from engagement you’ve already paid for',
        body: [
          { p: 'Proofy is built around the ads you already run:' },
          {
            ul: [
              '**Campaign scanning.** Choose which Meta campaigns Proofy reads comments from.',
              '**Automatic collection.** Comments are collected as your ads keep running, so the selection doesn’t go stale.',
              '**Positive comments highlighted.** Proofy surfaces the comments worth showing, so you don’t have to read every reply.',
              '**You approve what’s shown.** Pick which comments go live and on which product pages, and take any of them down later.',
              '**Customizable display.** Comments appear on your product pages in a way that suits your store.'
            ]
          },
          { p: 'It works for [Facebook ad comments](/facebook-comments-shopify) and for [Instagram ad comments](/instagram-comments-shopify) from the same Meta account.' }
        ]
      },
      {
        title: 'How to tell whether it’s working',
        body: [
          { p: 'When you start showing ad comments on a product page, note the date. Then compare that product’s conversion rate in your Shopify analytics for a few weeks before and after. The comparison is fairest on products whose ad spend and pricing stayed roughly the same over that period, so a change in traffic doesn’t muddy the result.' }
        ]
      }
    ],
    faqs: [
      {
        q: 'What is Facebook ads social proof?',
        a: 'It’s the engagement your ads collect, such as comments, reactions and shares, used as evidence that people like your products. Proofy takes the positive comments and shows them on your Shopify product pages.'
      },
      {
        q: 'Do I need to set up new ad campaigns?',
        a: 'No. Proofy works with comments on the campaigns you already run. You choose which of them it scans.'
      },
      {
        q: 'Does Proofy work with Instagram ads too?',
        a: 'Yes. Instagram ads run through the same Meta ad account, and Proofy collects comments from both Facebook and Instagram ads.'
      },
      {
        q: 'Do ad comments replace customer reviews?',
        a: 'They work best alongside them. Reviews come from buyers after a purchase. Ad comments add public, unprompted reactions, which is especially useful while a product is still building up reviews.'
      }
    ],
    related: ['/shopify-social-proof', '/facebook-comments-shopify', '/instagram-comments-shopify'],
    cta: {
      title: 'Make your ad spend work twice',
      text: 'Join the Proofy waitlist and we’ll email you when you can turn your ad engagement into social proof on your store.'
    }
  }
];

export const landingByPath = Object.fromEntries(landingPages.map(p => [p.path, p]));
