// Small product fragments for the "How Proofy works" steps on the homepage.
// They're illustrations (hidden from screen readers); campaign names and the comment are made up.
import BrandIcon from './BrandIcon';

const Check = () => (
  <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Connect() {
  return (
    <div className="mini" data-ui>
      <div className="mini__row">
        <span className="mini__logo"><BrandIcon name="Meta" size={18} /></span>
        <span className="mini__text">
          <strong>Meta ad account</strong>
          <span className="mini__sub">
            <BrandIcon name="Facebook" size={10} /> <BrandIcon name="Instagram" size={10} /> Ads Manager
          </span>
        </span>
        <span className="mini__pill mini__pill--ok"><Check /> Connected</span>
      </div>
    </div>
  );
}

const CAMPAIGNS = [
  { name: 'Spring launch', platform: 'Instagram', on: true },
  { name: 'Bestsellers', platform: 'Facebook', on: true },
  { name: 'Retargeting', platform: 'Facebook', on: false }
];

function Campaigns() {
  return (
    <div className="mini mini--list" data-ui>
      {CAMPAIGNS.map(c => (
        <div key={c.name} className="mini__item">
          <span className={`mini__box${c.on ? ' mini__box--on' : ''}`}>{c.on && <Check />}</span>
          <span className="mini__name">{c.name}</span>
          <BrandIcon name={c.platform} size={12} />
        </div>
      ))}
    </div>
  );
}

function ProductPage() {
  return (
    <div className="mini" data-ui>
      <div className="mini__head">
        <BrandIcon name="Shopify" size={12} />
        <span>Product page</span>
        <span className="mini__pill mini__pill--picked">Picked</span>
      </div>
      <p className="mini__quote">“Fits true to size and the colour is exactly like the ad.”</p>
    </div>
  );
}

export const stepVisuals = [<Connect key="c" />, <Campaigns key="k" />, <ProductPage key="p" />];

// Icons for the feature cards, in the products' own colours.
export function FeatureIcon({ name }) {
  const inner = {
    meta: <BrandIcon name="Meta" size={20} />,
    platforms: (
      <>
        <BrandIcon name="Facebook" size={16} />
        <BrandIcon name="Instagram" size={16} />
      </>
    ),
    select: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#0ea5e9" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    shopify: <BrandIcon name="Shopify" size={20} />,
    facebook: <BrandIcon name="Facebook" size={20} />,
    instagram: <BrandIcon name="Instagram" size={20} />
  }[name];
  return <span className="card__icon" aria-hidden="true">{inner}</span>;
}

// "Why it matters": the comments live under the ad, the product page shows none of them.
export function GapVisual() {
  return (
    <div className="gap-visual" aria-hidden="true">
      <div className="mini" data-ui>
        <div className="mini__head">
          <BrandIcon name="Facebook" size={12} />
          <span>Your ad</span>
          <span className="mini__count">214 comments</span>
        </div>
        <p className="mini__bubble">Wore it all weekend, so comfy</p>
        <p className="mini__bubble">Second order already 🙌</p>
      </div>
      <span className="ct-pair__arrow gap-visual__arrow">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="mini" data-ui>
        <div className="mini__head">
          <BrandIcon name="Shopify" size={12} />
          <span>Your product page</span>
        </div>
        <p className="mini__empty">No reviews yet</p>
      </div>
    </div>
  );
}
