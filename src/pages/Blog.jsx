// Blog index and article templates. Nothing here is built until a post in src/content/blog.js
// has status 'published' (see the notes at the top of that file).
import { PageBackdrop } from '../components/Backgrounds';
import { Block, Faq } from '../components/Rich';
import { SiteHeader, Breadcrumbs, CtaPanel, SiteFooter } from '../components/SiteChrome';
import { posts, publishedPosts, author } from '../content/blog';

const fmt = d => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

const CTA = {
  title: 'Turn your ad comments into social proof',
  text: 'Proofy is launching soon. Join the waitlist and we’ll email you when it’s ready for your Shopify store.'
};

function Shell({ children, source }) {
  return (
    <>
      <PageBackdrop />
      <div className="page">
        <SiteHeader />
        <main id="main">
          {children}
          <div className="sections">
            <CtaPanel title={CTA.title} text={CTA.text} source={source} />
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

export function BlogIndex() {
  return (
    <Shell source="blog-index">
      <div className="sections article">
        <header className="section article__head">
          <Breadcrumbs items={[{ name: 'Blog', path: '/blog' }]} />
          <h1 className="article__title">Social proof for Shopify stores</h1>
          <p className="article__intro">Guides on turning Facebook and Instagram ad engagement into trust on your product pages.</p>
        </header>
        <ul className="cards cards--links">
          {publishedPosts.map(p => (
            <li key={p.slug} className="card card--link">
              <h2 className="card__title">
                <a href={`/blog/${p.slug}`}>{p.title}</a>
              </h2>
              <p className="card__text">{p.description}</p>
              <p className="card__meta"><time dateTime={p.date}>{fmt(p.date)}</time></p>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}

export function BlogPost({ slug }) {
  const post = posts.find(p => p.slug === slug);
  return (
    <Shell source={`blog-${slug}`.slice(0, 40)}>
      <article className="sections article">
        <header className="section article__head">
          <Breadcrumbs items={[{ name: 'Blog', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }]} />
          <h1 className="article__title">{post.title}</h1>
          <p className="article__intro">{post.description}</p>
          <p className="article__meta">
            {author.name} · <time dateTime={post.date}>{fmt(post.date)}</time>
            {post.updated && post.updated !== post.date && (
              <> · Updated <time dateTime={post.updated}>{fmt(post.updated)}</time></>
            )}
          </p>
        </header>
        {post.sections.map(s => (
          <section key={s.title} className="section prose">
            <h2 className="section__title">{s.title}</h2>
            {s.body.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </section>
        ))}
        {post.faqs?.length > 0 && <Faq items={post.faqs} id="post-faq" />}
      </article>
    </Shell>
  );
}
