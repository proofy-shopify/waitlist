import { PageBackdrop, FrameBackground } from '../components/Backgrounds';
import WaitlistForm from '../components/WaitlistForm';
import { ExamplePair } from '../components/CommentTransitions';
import { FeatureIcon } from '../components/StepVisuals';
import { Block, Faq } from '../components/Rich';
import { SiteHeader, Breadcrumbs, CtaPanel, SiteFooter } from '../components/SiteChrome';
import { landingByPath } from '../content/landing';

const source = path => `lp${path.replace(/\//g, '-')}`.slice(0, 40);

export default function LandingPage({ path }) {
  const page = landingByPath[path];
  const related = page.related.map(p => landingByPath[p]);

  return (
    <>
      <PageBackdrop />
      <div className="page">
        <SiteHeader />
        <main id="main">
          <div className="device lp-hero">
            <div className="device__screen lp-hero__screen">
              <FrameBackground />
              <div className="lp-hero__copy">
                <Breadcrumbs items={[{ name: page.crumb, path: page.path }]} />
                <h1 className="lp-hero__title">{page.h1}</h1>
                <p className="lp-hero__intro">{page.intro}</p>
                <WaitlistForm source={source(page.path)} />
              </div>
              <ExamplePair index={page.example} />
            </div>
          </div>

          <article className="sections article">
            {page.sections.map(s => (
              <section key={s.title} className="section prose">
                <h2 className="section__title">{s.title}</h2>
                {s.body.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </section>
            ))}

            <Faq items={page.faqs} id="lp-faq" />

            <section className="section" aria-labelledby="related-title">
              <h2 id="related-title" className="section__title">Related guides</h2>
              <ul className="cards cards--links">
                {related.map(r => (
                  <li key={r.path} className="card card--link">
                    <FeatureIcon name={r.icon} />
                    <h3 className="card__title">
                      <a href={r.path}>{r.crumb}</a>
                    </h3>
                    <p className="card__text">{r.teaser}</p>
                  </li>
                ))}
                <li className="card card--link">
                  <FeatureIcon name="select" />
                  <h3 className="card__title">
                    <a href="/#how-it-works">How Proofy works</a>
                  </h3>
                  <p className="card__text">The three-step workflow and the features behind it, on the Proofy homepage.</p>
                </li>
              </ul>
            </section>
          </article>

          <div className="sections">
            <CtaPanel title={page.cta.title} text={page.cta.text} source={`${source(page.path)}-cta`.slice(0, 40)} />
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
