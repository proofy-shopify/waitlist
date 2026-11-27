import BlurText from '../components/reactbits/BlurText/BlurText';
import { PageBackdrop, FrameBackground } from '../components/Backgrounds';
import WaitlistForm from '../components/WaitlistForm';
import CommentTransitions from '../components/CommentTransitions';
import Badge from '../components/Badge';
import Rich, { Steps, Faq } from '../components/Rich';
import { CtaPanel, SiteFooter } from '../components/SiteChrome';
import ScrollDown from '../components/ScrollDown';
import { stepVisuals, FeatureIcon, GapVisual } from '../components/StepVisuals';
import { hero, footer, home } from '../content';
import { landingByPath } from '../content/landing';

export default function Home() {
  return (
    <>
      <PageBackdrop />
      {/* First screen: unchanged design. The big tagline stays the visual headline; the line under
          it is the page's <h1> ("…Shopify social proof"), styled exactly as before. */}
      <main id="main">
        <div className="stage">
          <div className="device">
            <div className="device__screen">
              <FrameBackground />

              <section className="hero" aria-labelledby="hero-title">
                <Badge />

                <p className="hero__title">
                  <BlurText
                    as="span"
                    text={hero.titleDark}
                    className="hero__dark"
                    delay={70}
                    animateBy="words"
                    direction="top"
                    stepDuration={0.38}
                  />
                  <BlurText
                    as="span"
                    text={hero.titleGrey}
                    className="hero__grey"
                    delay={70}
                    animateBy="words"
                    direction="top"
                    stepDuration={0.38}
                  />
                </p>

                <h1 id="hero-title" className="hero__sub">{hero.sub}</h1>

                <WaitlistForm source="hero" />
                <CommentTransitions />
              </section>
            </div>
          </div>

          <div className="captions">
            <p>
              {footer.left[0]}
              <br />
              {footer.left[1]}
            </p>
            <p className="captions__center">
              {footer.center[0]}
              <br />
              {footer.center[1]}
            </p>
            <p className="captions__right">
              {footer.right[0]}
              <br />
              {footer.right[1]} · <a href="/privacy">Privacy</a>
            </p>
          </div>
        </div>

        <div className="sections">
          <section className="section" id="how-it-works" aria-labelledby="how-title">
            <p className="section__eyebrow">{home.how.eyebrow}</p>
            <h2 id="how-title" className="section__title">{home.how.title}</h2>
            <p className="section__intro">{home.how.intro}</p>
            <Steps steps={home.how.steps} visuals={stepVisuals} />
          </section>

          <section className="section section--split" aria-labelledby="why-title">
            <div>
              <p className="section__eyebrow">{home.why.eyebrow}</p>
              <h2 id="why-title" className="section__title">{home.why.title}</h2>
              <GapVisual />
            </div>
            <div className="prose">
              {home.why.paragraphs.map(t => (
                <p key={t}><Rich text={t} /></p>
              ))}
            </div>
          </section>

          <section className="section" aria-labelledby="features-title">
            <p className="section__eyebrow">{home.features.eyebrow}</p>
            <h2 id="features-title" className="section__title">{home.features.title}</h2>
            <ul className="cards">
              {home.features.items.map(f => (
                <li key={f.title} className="card">
                  <FeatureIcon name={f.icon} />
                  <h3 className="card__title">{f.title}</h3>
                  <p className="card__text">{f.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="section" aria-labelledby="guides-title">
            <p className="section__eyebrow">{home.guides.eyebrow}</p>
            <h2 id="guides-title" className="section__title">{home.guides.title}</h2>
            <ul className="cards cards--links">
              {home.guides.links.map(g => (
                <li key={g.href} className="card card--link">
                  <FeatureIcon name={landingByPath[g.href].icon} />
                  <h3 className="card__title">
                    <a href={g.href}>{g.label}</a>
                  </h3>
                  <p className="card__text">{landingByPath[g.href].teaser}</p>
                </li>
              ))}
            </ul>
          </section>

          <div id="faq">
            <Faq items={home.faqs} title={home.faqTitle} id="home-faq" />
          </div>

          <CtaPanel title={home.cta.title} text={home.cta.text} source="home-cta" />
        </div>
      </main>
      <SiteFooter />
      <ScrollDown />
    </>
  );
}
