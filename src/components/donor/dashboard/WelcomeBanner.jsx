import { formatCurrency } from '../../../utils/donorHelpers';

export default function WelcomeBanner({ name, impact, loading }) {
  if (loading) {
    return <div className="dd-card h-44 animate-pulse bg-slate-100" aria-hidden="true" />;
  }

  return (
    <section className="dd-hero" aria-label="Welcome">
      <div className="dd-hero__copy">
        <h1>
          Welcome back,
          <br />
          {name || 'Donor'} <span aria-hidden="true">👋</span>
        </h1>
        <p>Your generosity is creating a better tomorrow for countless lives.</p>
      </div>

      <div className="dd-hero__visual">
        <div className="dd-hero__art dd-hero-image-frame">
          <img
            src="/assets/donor/Donor_Dashboard_Heart_Hands_Hero.png"
            alt=""
            width={160}
            height={160}
            decoding="async"
            className="dd-hero-image"
          />
        </div>
        <div className="dd-impact-chip">
          <p className="dd-impact-chip__title">Your Impact This Year</p>
          <dl>
            <div>
              <dt>Total Contribution</dt>
              <dd>{formatCurrency(impact?.total_donated || 0)}</dd>
            </div>
            <div>
              <dt>Lives Impacted</dt>
              <dd>{impact?.lives_impacted || 0}</dd>
            </div>
            <div>
              <dt>Causes Supported</dt>
              <dd>{impact?.causes_supported || 0}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
