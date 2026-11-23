import { PageBackdrop } from '../components/Backgrounds';
import { SiteHeader, SiteFooter } from '../components/SiteChrome';
import { landingPages } from '../content/landing';

// Served by the host for any unknown address, with a real 404 status (dist/404.html).
export default function NotFound() {
  return (
    <>
      <PageBackdrop />
      <div className="page">
        <SiteHeader ctaHref="/#join" />
        <main className="sections article">
          <div className="section article__head notfound">
            <h1 className="article__title">We couldn’t find that page.</h1>
            <p className="article__intro">
              The link may be old or mistyped. Start from the <a href="/">Proofy homepage</a>, or try one of these guides:
            </p>
            <ul className="notfound__links">
              {landingPages.map(p => (
                <li key={p.path}><a href={p.path}>{p.crumb}</a></li>
              ))}
            </ul>
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
