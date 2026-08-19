import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { getProgram, updateProgram, updateProgramStatus } from '../../../api/coreClient';
import { useApp } from '../../../context/AppContext';
import { PageBackLink } from '../../ui/FlowNav';

const CATEGORIES = [
  'Education', 'Medical', 'Food', 'Clothing', 'Housing', 'Emergency', 'Other',
];

export default function NgoEditProgramPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { refreshPlatformData } = useApp();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    program_name: '',
    description: '',
    category: 'Education',
    status: 'ACTIVE',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const program = await getProgram(id);
        if (cancelled) return;
        setForm({
          program_name: program.program_name || '',
          description: program.description || '',
          category: program.category || 'Other',
          status: (program.status || 'ACTIVE').toUpperCase(),
        });
      } catch (err) {
        if (!cancelled) showToast(err.message || 'Could not load program.', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, showToast]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.program_name.trim()) {
      showToast('Enter a program name.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await updateProgram(id, {
        program_name: form.program_name.trim(),
        description: form.description.trim() || null,
        category: form.category,
      });
      await updateProgramStatus(id, { status: form.status });
      await refreshPlatformData();
      showToast('Program updated successfully.', 'success');
      navigate(`/dashboard/ngo-program-detail/${id}`);
    } catch (err) {
      showToast(err.message || 'Could not update program.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async () => {
    const next = form.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setSubmitting(true);
    try {
      await updateProgramStatus(id, { status: next });
      setForm((prev) => ({ ...prev, status: next }));
      await refreshPlatformData();
      showToast(`Program ${next === 'ACTIVE' ? 'activated' : 'deactivated'}.`, 'success');
    } catch (err) {
      showToast(err.message || 'Could not update program status.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="ngo-page ngo-module page-route"><p className="text-sm text-[#49638F]">Loading program…</p></div>;
  }

  return (
    <div className="ngo-page ngo-module page-route ngo-program-form">
      <header className="ngo-program-form__head">
        <PageBackLink to="/dashboard/ngo-programs" label="Back to Programs" />
        <div>
          <h1>Edit Program</h1>
          <p>Update program details or change status.</p>
        </div>
      </header>

      <form className="ngo-program-form__body" onSubmit={handleSubmit}>
        <label className="ngo-field">
          <span>Program name *</span>
          <input value={form.program_name} onChange={(e) => update('program_name', e.target.value)} required />
        </label>

        <label className="ngo-field">
          <span>Description</span>
          <textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} />
        </label>

        <div className="ngo-program-form__row">
          <label className="ngo-field">
            <span>Category *</span>
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="ngo-field">
            <span>Program status</span>
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>
        </div>

        <div className="ngo-program-form__actions">
          <button
            type="button"
            className="ngo-btn ngo-btn--secondary"
            onClick={toggleStatus}
            disabled={submitting}
          >
            {form.status === 'ACTIVE' ? 'Deactivate Program' : 'Activate Program'}
          </button>
          <button type="button" className="ngo-btn ngo-btn--secondary" onClick={() => navigate('/dashboard/ngo-programs')}>
            Cancel
          </button>
          <button type="submit" className="ngo-btn ngo-btn--primary" disabled={submitting}>
            {submitting ? <><Loader2 size={16} className="ngo-spin" /> Saving…</> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
