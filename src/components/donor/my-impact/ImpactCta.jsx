import { useNavigate } from 'react-router-dom';
import { Send, CalendarHeart } from 'lucide-react';
import { useToast } from '../../ui/Toast';

export default function ImpactCta({ shareText, loading }) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleShare = async () => {
    const payload = {
      title: 'Give Away — My Impact',
      text: shareText || 'I am supporting causes on Give Away. Join me in making an impact.',
      url: window.location.origin,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard.writeText(`${payload.text} ${payload.url}`);
      showToast('Impact link copied to clipboard.', 'success');
    } catch {
      /* cancelled or blocked */
    }
  };

  if (loading) {
    return (
      <div className="ir-cta-grid" aria-hidden="true">
        <div className="dd-card mp-skel ir-cta-skel" />
        <div className="dd-card mp-skel ir-cta-skel" />
      </div>
    );
  }

  return (
    <section className="ir-cta-grid">
      <article className="ir-share-card">
        <h2>Your generosity is creating a better tomorrow!</h2>
        <p>Share your impact and inspire others to give.</p>
        <button type="button" className="dd-btn" onClick={handleShare}>
          <Send size={15} aria-hidden="true" />
          Share Your Impact
        </button>
      </article>
      <article className="ir-recurring-card">
        <div className="ir-recurring-card__icon" aria-hidden="true">
          <CalendarHeart size={20} />
        </div>
        <div>
          <h2>Prefer to do more?</h2>
          <p>Set up a recurring gift and keep creating lasting change.</p>
          <button
            type="button"
            className="dd-btn-outline"
            onClick={() => navigate('/dashboard/donor-donate-money?recurring=1')}
          >
            Set Up Recurring Gift
          </button>
        </div>
      </article>
    </section>
  );
}
