import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { createProgram } from '../../../api/coreClient';
import { useApp } from '../../../context/AppContext';
import { PageBackLink } from '../../ui/FlowNav';

const CATEGORIES = [
  'Education', 'Medical', 'Food', 'Clothing', 'Housing', 'Emergency', 'Other',
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export default function NgoCreateProgramPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { refreshPlatformData } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    program_name: '',
    description: '',
    category: 'Education',
    status: 'ACTIVE',
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.program_name.trim()) {
      showToast('Enter a program name.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await createProgram({
        program_name: form.program_name.trim(),
        description: form.description.trim() || null,
        category: form.category,
        status: form.status,
      });
      await refreshPlatformData();
      showToast('Program created successfully.', 'success');
      navigate('/dashboard/ngo-programs');
    } catch (err) {
      showToast(err.message || 'Could not create program.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ngo-page ngo-module page-route ngo-program-form">
      <header className="ngo-program-form__head">
        <PageBackLink to="/dashboard/ngo-programs" label="Back to Programs" />
        <div>
          <h1>Create Program</h1>
          <p>Add a new program to the catalog.</p>
        </div>
      </header>

      <form className="ngo-program-form__body" onSubmit={handleSubmit}>
        <label className="ngo-field">
          <span>Program name *</span>
          <input
            value={form.program_name}
            onChange={(e) => update('program_name', e.target.value)}
            placeholder="Education Support Program"
            required
          />
        </label>

        <label className="ngo-field">
          <span>Description</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Describe the program purpose and scope."
          />
        </label>

        <div className="ngo-program-form__row">
          <label className="ngo-field">
            <span>Category *</span>
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="ngo-field">
            <span>Status *</span>
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>
        </div>

        <div className="ngo-program-form__actions">
          <button type="button" className="ngo-btn ngo-btn--secondary" onClick={() => navigate('/dashboard/ngo-programs')}>
            Cancel
          </button>
          <button type="submit" className="ngo-btn ngo-btn--primary" disabled={submitting}>
            {submitting ? <><Loader2 size={16} className="ngo-spin" /> Creating…</> : 'Create Program'}
          </button>
        </div>
      </form>
    </div>
  );
}
