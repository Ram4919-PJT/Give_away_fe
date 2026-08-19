import { useNavigate } from 'react-router-dom';
import { Send, CalendarHeart } from 'lucide-react';
import { useToast } from '../../ui/Toast';

export default function ImpactFooter({ snapshot, shareText, loading }) {
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
      // cancelled / blocked
    }
  };

  if (loading) {
    return (
      <div className="dd-footer-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="dd-card h-40 animate-pulse bg-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <section className="dd-footer-grid">
      <article className="dd-card p-5 sm:p-6">
        <h2 className="dd-section-title">Impact Snapshot</h2>
        <div className="dd-snapshot">
          <div>
            <strong>
              {Number(snapshot?.lives_impacted || 0).toLocaleString('en-IN')}
              {snapshot?.lives_impacted >= 1000 ? '+' : ''}
            </strong>
            <span>Lives Impacted</span>
          </div>
          <div>
            <strong>{snapshot?.donations_made || 0}</strong>
            <span>Donations Made</span>
          </div>
          <div>
            <strong>{snapshot?.ngos_supported || 0}</strong>
            <span>NGOs Supported</span>
          </div>
        </div>
      </article>

      <article className="dd-card p-5 sm:p-6 flex flex-col">
        <h2 className="dd-section-title">Thank you for being a changemaker!</h2>
        <p className="m-0 mt-2 text-sm text-[#49638F] leading-relaxed flex-1">
          Your support is helping build a better, kinder and more equitable world.
        </p>
        <button
          type="button"
          onClick={handleShare}
          className="dd-btn mt-4 h-10 px-4 text-sm inline-flex items-center justify-center gap-2 w-fit"
        >
          <Send size={15} aria-hidden="true" />
          Share Your Impact
        </button>
      </article>

      <article className="dd-recurring">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-[#1268E8] flex items-center justify-center shrink-0 border border-[#DCE8FA]">
            <CalendarHeart size={18} aria-hidden="true" />
          </div>
          <div>
            <h2 className="dd-section-title">Prefer to donate again?</h2>
            <p className="m-0 mt-1.5 text-sm text-[#49638F] leading-relaxed">
              Set up a recurring donation and keep making an impact, every month.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/dashboard/donor-donate-money?recurring=1')}
          className="dd-btn-outline mt-4 h-10 px-4 text-sm w-fit"
        >
          Set Up Recurring Gift
        </button>
      </article>
    </section>
  );
}
