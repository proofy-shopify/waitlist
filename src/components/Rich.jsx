// Renders copy from the content files: "[text](/path)" becomes a link, "**text**" becomes bold.
import { Fragment } from 'react';

const TOKEN = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

export default function Rich({ text }) {
  const out = [];
  let last = 0;
  let m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<a key={m.index} href={m[2]}>{m[1]}</a>);
    else out.push(<strong key={m.index}>{m[3]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <Fragment>{out}</Fragment>;
}

// One content block from the landing-page / blog format.
export function Block({ block }) {
  if (block.p) return <p><Rich text={block.p} /></p>;
  if (block.ul) return <ul>{block.ul.map((t, i) => <li key={i}><Rich text={t} /></li>)}</ul>;
  if (block.ol) return <ol>{block.ol.map((t, i) => <li key={i}><Rich text={t} /></li>)}</ol>;
  if (block.steps) return <Steps steps={block.steps} headingLevel={3} />;
  return null;
}

export function Steps({ steps, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <ol className="steps">
      {steps.map((s, i) => (
        <li key={s.title} className="steps__item">
          <span className="steps__num" aria-hidden="true">{i + 1}</span>
          <H className="steps__title">{s.title}</H>
          <p className="steps__text"><Rich text={s.text} /></p>
        </li>
      ))}
    </ol>
  );
}

export function Faq({ items, title = 'Frequently asked questions', id = 'faq' }) {
  return (
    <section className="section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="section__title">{title}</h2>
      <div className="faq">
        {items.map(f => (
          <details key={f.q} className="faq__item">
            <summary className="faq__q">
              <h3>{f.q}</h3>
              <svg className="faq__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </summary>
            <p className="faq__a"><Rich text={f.a} /></p>
          </details>
        ))}
      </div>
    </section>
  );
}
