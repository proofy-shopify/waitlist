// Builds each page's <head> tags and JSON-LD structured data at build time.
// Structured data only states facts that are visible on the page: no ratings, prices or counts.
import { SITE_URL, SITE_NAME, OG_IMAGE, LOGO_URL, abs } from './site.js';

const esc = s =>
  String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// "[text](/path)" → "text", "**bold**" → "bold"
export const plain = s => String(s).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '');

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: LOGO_URL, width: 512, height: 512 }
};

const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  inLanguage: 'en-US',
  publisher: { '@id': ORG_ID }
};

function breadcrumbs(route) {
  const items = [{ name: 'Home', path: '/' }, ...(route.crumbs || [])];
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(route.path)}#breadcrumb`,
    itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) }))
  };
}

function faqPage(route) {
  return {
    '@type': 'FAQPage',
    '@id': `${abs(route.path)}#faq`,
    mainEntity: route.faqs.map(f => ({
      '@type': 'Question',
      name: plain(f.q),
      acceptedAnswer: { '@type': 'Answer', text: plain(f.a) }
    }))
  };
}

export function structuredData(route) {
  const url = abs(route.path);
  const webPage = {
    '@type': route.page === 'blogIndex' ? 'CollectionPage' : 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: route.title,
    description: route.description,
    inLanguage: 'en-US',
    isPartOf: { '@id': WEBSITE_ID },
    ...(route.updated ? { dateModified: route.updated } : {}),
    ...(route.crumbs ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {})
  };
  const graph = [organization, website, webPage];

  if (route.page === 'home') {
    webPage.about = { '@id': `${SITE_URL}/#software` };
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#software`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      image: LOGO_URL,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Shopify',
      description:
        'A Shopify app that collects comments from your Facebook and Instagram ads and displays the positive ones as social proof on your Shopify product pages.',
      publisher: { '@id': ORG_ID }
    });
  }
  if (route.crumbs) graph.push(breadcrumbs(route));
  if (route.faqs?.length) graph.push(faqPage(route));
  if (route.article) {
    const a = route.article;
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: a.title,
      description: a.description,
      datePublished: a.date,
      dateModified: a.updated || a.date,
      author: { '@type': 'Organization', name: a.author || SITE_NAME, url: `${SITE_URL}/` },
      publisher: { '@id': ORG_ID },
      mainEntityOfPage: { '@id': `${url}#webpage` },
      image: OG_IMAGE.url,
      inLanguage: 'en-US'
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function buildHead(route) {
  const url = abs(route.path);
  const ogTitle = route.ogTitle || route.title;
  const tags = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`
  ];
  if (route.noindex) {
    tags.push('<meta name="robots" content="noindex, follow" />');
  } else {
    tags.push(
      '<meta name="robots" content="index, follow, max-image-preview:large" />',
      `<link rel="canonical" href="${url}" />`
    );
  }
  tags.push(
    `<meta property="og:type" content="${route.type === 'article' ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    '<meta property="og:locale" content="en_US" />',
    `<meta property="og:title" content="${esc(ogTitle)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    `<meta property="og:image" content="${OG_IMAGE.url}" />`,
    '<meta property="og:image:type" content="image/jpeg" />',
    `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
    '<meta property="og:image:alt" content="Proofy turns Facebook and Instagram ad comments into reviews on Shopify product pages" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(ogTitle)}" />`,
    `<meta name="twitter:description" content="${esc(route.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE.url}" />`,
    '<meta name="twitter:image:alt" content="Proofy turns Facebook and Instagram ad comments into reviews on Shopify product pages" />'
  );
  if (!route.noindex) tags.push(`<meta property="og:url" content="${url}" />`);
  if (!route.noindex) {
    const json = JSON.stringify(structuredData(route)).replace(/</g, '\\u003c');
    tags.push(`<script type="application/ld+json">${json}</script>`);
  }
  return tags.join('\n    ');
}
