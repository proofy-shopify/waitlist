// Header for inner pages, the final waitlist panel and the site footer with internal links.
import Badge from './Badge';
import WaitlistForm from './WaitlistForm';
import { FrameBackground } from './Backgrounds';
import { landingPages } from '../content/landing';
import { publishedPosts } from '../content/blog';

export function SiteHeader({ ctaHref = '#join' }) {
  return (
    <header className="site-header">
      <Badge href="/" />
      <a className="site-header__cta" href={ctaHref}>
        Join the waitlist
      </a>
    </header>
  );
}

// Breadcrumb trail shown on inner pages; it matches the BreadcrumbList structured data.
export function Breadcrumbs({ items }) {
  const trail = [{ name: 'Home', path: '/' }, ...items];
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((c, i) => (
          <li key={c.path}>
            {i < trail.length - 1 ? <a href={c.path}>{c.name}</a> : <span aria-current="page">{c.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// The closing "join the waitlist" panel: same navy bezel and frosted scene as the hero frame.
export function CtaPanel({ title, text, source }) {
  return (
    <section className="cta device" aria-labelledby="join-title">
      <div className="device__screen cta__screen">
        <FrameBackground still />
        <h2 id="join-title" className="cta__title">{title}</h2>
        <p className="cta__text">{text}</p>
        <WaitlistForm source={source} id="join" />
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav className="site-footer__nav" aria-label="Footer">
        <div className="site-footer__col">
          <p className="site-footer__head">Proofy</p>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/#how-it-works">How Proofy works</a></li>
            <li><a href="/#faq">FAQ</a></li>
            {publishedPosts.length > 0 && <li><a href="/blog">Blog</a></li>}
            <li><a href="/privacy">Privacy policy</a></li>
          </ul>
        </div>
        <div className="site-footer__col">
          <p className="site-footer__head">Guides</p>
          <ul>
            {landingPages.map(p => (
              <li key={p.path}><a href={p.path}>{p.crumb}</a></li>
            ))}
          </ul>
        </div>
      </nav>
      <p className="site-footer__note">© 2026 Proofy. Facebook and Instagram are trademarks of Meta Platforms, Inc. Shopify is a trademark of Shopify Inc.</p>
    </footer>
  );
}
