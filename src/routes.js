// Every public page of the site. The build prerenders each one to its own HTML file, writes its
// head tags (src/seo.js) and lists it in sitemap.xml. Internal links are plain <a href> links.
import { home } from './content.js';
import { landingPages } from './content/landing.js';
import { publishedPosts } from './content/blog.js';

const HOME_UPDATED = '2026-11-21';

export const routes = [
  {
    path: '/',
    page: 'home',
    title: 'Shopify Social Proof from Ad Comments | Proofy',
    description:
      'Proofy: Automatically turn Facebook & Instagram ad comments into authentic Shopify product reviews. No manual copying, importing, or transferring.',
    ogTitle: 'Proofy: your ad comments, now your best reviews',
    faqs: home.faqs,
    updated: HOME_UPDATED
  },
  ...landingPages.map(p => ({
    path: p.path,
    page: 'landing',
    title: p.title,
    description: p.description,
    crumbs: [{ name: p.crumb, path: p.path }],
    faqs: p.faqs,
    updated: p.updated
  })),
  ...(publishedPosts.length
    ? [
        {
          path: '/blog',
          page: 'blogIndex',
          title: 'Blog: Social Proof for Shopify Stores | Proofy',
          description:
            'Guides on using Facebook and Instagram ad comments, reviews and other social proof to build trust on Shopify product pages.',
          crumbs: [{ name: 'Blog', path: '/blog' }],
          updated: publishedPosts[0].updated || publishedPosts[0].date
        },
        ...publishedPosts.map(post => ({
          path: `/blog/${post.slug}`,
          page: 'blogPost',
          slug: post.slug,
          title: `${post.title} | Proofy`,
          description: post.description,
          type: 'article',
          article: post,
          crumbs: [
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` }
          ],
          faqs: post.faqs,
          updated: post.updated || post.date
        }))
      ]
    : [])
];

export const notFoundRoute = {
  path: '/404',
  page: 'notFound',
  title: 'Page not found | Proofy',
  description: 'This page doesn’t exist. Head back to Proofy to see how ad comments become Shopify social proof.',
  noindex: true
};

// "/shopify-social-proof/", "/shopify-social-proof.html" and "/index.html" all resolve to their page.
export function normalizePath(pathname) {
  let p = (pathname || '/').replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return p || '/';
}

export function findRoute(pathname) {
  const path = normalizePath(pathname);
  return routes.find(r => r.path === path) || notFoundRoute;
}
