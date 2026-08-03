export default function NgoCard({ ngo, onView }) {
  return (
    <article className="donor-ngo-card" style={{ cursor: 'pointer' }} onClick={onView}>
      <div className="donor-ngo-card-logo">{ngo.logo}</div>
      <div className="donor-ngo-card-body">
        <h3>{ngo.name}</h3>
        <p>{ngo.city} · {ngo.categories?.slice(0, 2).join(', ')}</p>
        <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.35rem' }}>{ngo.description?.slice(0, 90)}...</p>
        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={`badge ${ngo.verified ? 'status-approved' : 'status-pending'}`}>
            {ngo.verified ? 'Verified' : 'Pending'}
          </span>
          <button type="button" className="btn-sm-card" onClick={(e) => { e.stopPropagation(); onView(); }}>View Details</button>
        </div>
      </div>
    </article>
  );
}
