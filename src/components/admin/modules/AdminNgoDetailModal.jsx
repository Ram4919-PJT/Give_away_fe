import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X, MapPin, FileText, Eye, Download, CheckCircle2, Clock, Building2
} from 'lucide-react';
import { AdminBadge } from '../AdminModuleShell';

const NGO_DOCUMENTS = [
  { label: 'NGO Registration Certificate', filename: 'registration_certificate.pdf', uploadedAt: '2026-06-15' },
  { label: 'PAN Card', filename: 'pan_card.pdf', uploadedAt: '2026-06-15' },
  { label: 'Address Proof', filename: 'address_proof.pdf', uploadedAt: '2026-06-16' },
  { label: 'Representative ID', filename: 'representative_id.pdf', uploadedAt: '2026-06-16' },
  { label: 'Bank Details', filename: 'bank_details.pdf', uploadedAt: '2026-06-17' }
];

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatFundsManaged(donationsReceived = 0) {
  const amount = donationsReceived * 7000;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

function buildTimeline(ngo) {
  const events = [
    { date: ngo.dateJoined, event: 'Organization registered on platform' },
    { date: '2026-06-18', event: 'Verification documents submitted' },
    { date: '2026-06-20', event: 'Assigned for admin review' }
  ];
  if (ngo.verified) {
    events.push({ date: '2026-06-22', event: 'Verification approved' });
  }
  return events;
}

export default function AdminNgoDetailModal({ ngo, onClose, showToast }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!ngo) return null;

  const timeline = buildTimeline(ngo);

  return createPortal(
    <div className="admin-ngo-modal-overlay" role="presentation">
      <div className="admin-ngo-modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className="admin-ngo-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ngo-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="admin-ngo-modal__header">
          <div className="admin-ngo-modal__header-left">
            <span className="admin-ngo-modal__logo" aria-hidden="true">{ngo.logo}</span>
            <div>
              <h2 id="ngo-modal-title">{ngo.name}</h2>
              <div className="admin-ngo-modal__header-meta">
                <AdminBadge variant={ngo.verified ? 'green' : 'orange'}>{ngo.verificationStatus}</AdminBadge>
                <span className="admin-ngo-modal__reg">{ngo.regNumber}</span>
              </div>
            </div>
          </div>
          <button type="button" className="admin-ngo-modal__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>

        <div className="admin-ngo-modal__scroll">
          <div className="admin-ngo-modal__body">
            <div className="admin-ngo-modal__main">
              <section className="admin-ngo-modal__section">
                <h3><Building2 size={16} /> Organization Details</h3>
                <dl className="admin-ngo-modal__grid">
                  <div><dt>Organization Name</dt><dd>{ngo.name}</dd></div>
                  <div><dt>Registration Number</dt><dd>{ngo.regNumber}</dd></div>
                  <div><dt>Account Status</dt><dd>{ngo.accountStatus}</dd></div>
                  <div><dt>Date Joined</dt><dd>{formatDate(ngo.dateJoined)}</dd></div>
                  <div><dt>Rating</dt><dd>{ngo.rating}★</dd></div>
                  <div><dt>Mission</dt><dd>{ngo.mission}</dd></div>
                </dl>
              </section>

              <section className="admin-ngo-modal__section">
                <h3>Representative Information</h3>
                <dl className="admin-ngo-modal__grid">
                  <div><dt>Representative</dt><dd>{ngo.contactPerson}</dd></div>
                  <div><dt>Designation</dt><dd>Program Director</dd></div>
                  <div><dt>Email</dt><dd>{ngo.email}</dd></div>
                  <div><dt>Phone</dt><dd>{ngo.phone}</dd></div>
                </dl>
              </section>

              <section className="admin-ngo-modal__section">
                <h3>Contact Details</h3>
                <dl className="admin-ngo-modal__grid">
                  <div><dt>Email</dt><dd>{ngo.email}</dd></div>
                  <div><dt>Phone</dt><dd>{ngo.phone}</dd></div>
                  <div className="admin-ngo-modal__full"><dt>Address</dt><dd>{ngo.location}</dd></div>
                </dl>
              </section>

              <section className="admin-ngo-modal__section">
                <h3>Operating Areas</h3>
                <div className="admin-ngo-modal__tags">
                  {ngo.operatingAreas.map((a) => (
                    <AdminBadge key={a} variant="muted">{a}</AdminBadge>
                  ))}
                </div>
              </section>

              <section className="admin-ngo-modal__section">
                <h3>Supported Categories</h3>
                <div className="admin-ngo-modal__tags">
                  {(ngo.categoryTags || ngo.categories || []).map((c) => (
                    <AdminBadge key={c} variant="blue">{c}</AdminBadge>
                  ))}
                </div>
              </section>

              <section className="admin-ngo-modal__section">
                <h3><FileText size={16} /> Verification Documents</h3>
                <div className="admin-ngo-modal__doc-grid">
                  {NGO_DOCUMENTS.map((doc) => (
                    <article key={doc.filename} className="admin-ngo-modal__doc-card">
                      <div className="admin-ngo-modal__doc-icon"><FileText size={22} strokeWidth={1.5} /></div>
                      <div className="admin-ngo-modal__doc-body">
                        <strong>{doc.label}</strong>
                        <span>{doc.filename}</span>
                        <span className="admin-ngo-modal__doc-date">Uploaded {formatDate(doc.uploadedAt)}</span>
                      </div>
                      <div className="admin-ngo-modal__doc-actions">
                        <button
                          type="button"
                          className="admin-ngo-modal__btn admin-ngo-modal__btn--ghost"
                          onClick={() => showToast(`Opening ${doc.filename} (mock).`, 'info')}
                        >
                          <Eye size={14} /> Preview
                        </button>
                        <button
                          type="button"
                          className="admin-ngo-modal__btn admin-ngo-modal__btn--ghost"
                          onClick={() => showToast(`Downloading ${doc.filename} (mock).`, 'info')}
                        >
                          <Download size={14} /> Download
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="admin-ngo-modal__section">
                <h3>Organization Description</h3>
                <p className="admin-ngo-modal__desc">{ngo.description}</p>
                {ngo.about && <p className="admin-ngo-modal__desc admin-ngo-modal__desc--muted">{ngo.about}</p>}
              </section>

              <section className="admin-ngo-modal__section">
                <h3><Clock size={16} /> Timeline</h3>
                <ol className="admin-ngo-modal__timeline">
                  {timeline.map((ev) => (
                    <li key={ev.date + ev.event}>
                      <span className="admin-ngo-modal__timeline-dot" />
                      <div>
                        <strong>{ev.event}</strong>
                        <span>{formatDate(ev.date)}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <aside className="admin-ngo-modal__aside">
              <div className="admin-ngo-modal__summary">
                <h3>Quick Summary</h3>
                <dl className="admin-ngo-modal__summary-list">
                  <div><dt>Verification Status</dt><dd><AdminBadge variant={ngo.verified ? 'green' : 'orange'}>{ngo.verificationStatus}</AdminBadge></dd></div>
                  <div><dt>Registration Date</dt><dd>{formatDate(ngo.dateJoined)}</dd></div>
                  <div><dt>Location</dt><dd>{ngo.city}, {ngo.state}</dd></div>
                </dl>
              </div>

              <div className="admin-ngo-modal__map">
                <h3><MapPin size={16} /> Location</h3>
                <p>{ngo.location}</p>
                <div className="admin-ngo-modal__map-placeholder">Map Placeholder — Wireframe UI</div>
              </div>

              <div className="admin-ngo-modal__perf">
                <h3>Performance Statistics</h3>
                <div className="admin-ngo-modal__stat-grid">
                  <div className="admin-ngo-modal__stat">
                    <strong>{ngo.totalBeneficiaries.toLocaleString('en-IN')}</strong>
                    <span>Beneficiaries</span>
                  </div>
                  <div className="admin-ngo-modal__stat">
                    <strong>{ngo.requestsCompleted}</strong>
                    <span>Completed Requests</span>
                  </div>
                  <div className="admin-ngo-modal__stat">
                    <strong>{ngo.activeRequests}</strong>
                    <span>Active Requests</span>
                  </div>
                  <div className="admin-ngo-modal__stat">
                    <strong>{formatFundsManaged(ngo.donationsReceived)}</strong>
                    <span>Funds Managed</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <footer className="admin-ngo-modal__actions">
            <button
              type="button"
              className="admin-ngo-modal__btn admin-ngo-modal__btn--approve"
              onClick={() => showToast(`${ngo.name} verification approved (mock).`, 'success')}
            >
              <CheckCircle2 size={16} /> Approve Verification
            </button>
            <button
              type="button"
              className="admin-ngo-modal__btn admin-ngo-modal__btn--reject"
              onClick={() => showToast(`${ngo.name} application rejected (mock).`, 'info')}
            >
              Reject Application
            </button>
            <button
              type="button"
              className="admin-ngo-modal__btn admin-ngo-modal__btn--outline"
              onClick={() => showToast('Document request sent (mock).', 'info')}
            >
              Request More Documents
            </button>
            <button
              type="button"
              className="admin-ngo-modal__btn admin-ngo-modal__btn--warn"
              onClick={() => showToast(`${ngo.name} suspended (mock).`, 'info')}
            >
              Suspend NGO
            </button>
          </footer>
        </div>
      </div>
    </div>,
    document.body
  );
}
