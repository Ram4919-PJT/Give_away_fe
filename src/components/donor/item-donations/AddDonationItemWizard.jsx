import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, MapPin, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useApp, isRoleVerified } from '../../../context/AppContext';
import {
  createItemDonationDraft,
  getMyItemDonation,
  listItemCategories,
  submitItemDonation,
  updateItemDonation,
  uploadItemDocument,
} from '../../../api/itemDonationClient';
import { CATEGORY_DETAIL_FIELDS } from '../../../data/itemDonationFields';
import { formatApiError } from '../../../utils/formErrors';
import { useLocation } from '../../../context/LocationContext';
import { PageBackLink } from '../../ui/FlowNav';
import {
  DonationStepper,
  InlineError,
  PhotoUploader,
  ReviewSection,
  StepNavigation,
  StepPanel,
  WizardField,
  WizardSuccess,
} from './DonationWizardUi';

const STEPS = [
  { id: 'basic', label: 'Basic Info', hint: 'Tell us about the item you want to donate.' },
  { id: 'details', label: 'Item Details', hint: 'Add category-specific details for your item.' },
  { id: 'photos', label: 'Photos', hint: 'Upload at least one clear photo. Items are reviewed by admin before receivers can see them.' },
  { id: 'pickup', label: 'Pickup', hint: 'Where can the item be collected from?' },
  { id: 'preferences', label: 'Preferences', hint: 'Set urgency and delivery preferences.' },
  { id: 'review', label: 'Review', hint: 'Review everything before submitting your donation.' },
];

const CONDITIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'GOOD', label: 'Good' },
  { value: 'USED', label: 'Used' },
  { value: 'NEEDS_REPAIR', label: 'Needs Repair' },
];

const URGENCY_LABELS = { normal: 'Normal', soon: 'Needed soon', urgent: 'Urgent' };
const PICKUP_PREF_LABELS = {
  pickup: 'Pickup preferred',
  delivery: 'Delivery if possible',
  either: 'Either',
};

const emptyForm = {
  item_name: '',
  category_id: '',
  subcategory: '',
  description: '',
  quantity: 1,
  condition: 'GOOD',
  brand: '',
  model_variant: '',
  category_details: {},
  pickup_line1: '',
  pickup_city: '',
  pickup_state: '',
  pickup_pincode: '',
  pickup_availability: '',
  preferred_pickup_time: '',
  delivery_available: false,
  preferences: { who_can_request: 'any', pickup_or_delivery: 'pickup' },
  urgency: 'normal',
  additional_notes: '',
  confirm: false,
};

function validateBasicInfo(form) {
  const errors = {};
  const name = form.item_name.trim();
  const desc = form.description.trim();

  if (!name) errors.item_name = 'Item name is required.';
  else if (name.length < 2) errors.item_name = 'Item name must be at least 2 characters.';

  if (!form.category_id) errors.category_id = 'Category is required.';

  if (!desc) errors.description = 'Description is required.';
  else if (desc.length < 3) errors.description = 'Description must be at least 3 characters.';

  const qty = Number(form.quantity);
  if (!qty || qty < 1) errors.quantity = 'Quantity must be at least 1.';

  return errors;
}

function validatePickup(form) {
  const errors = {};
  const line = form.pickup_line1.trim();
  const city = form.pickup_city.trim();
  const state = form.pickup_state.trim();
  const pin = form.pickup_pincode.trim();

  if (!line) errors.pickup_line1 = 'Pickup address is required.';
  else if (line.length < 3) errors.pickup_line1 = 'Address must be at least 3 characters.';

  if (!city) errors.pickup_city = 'City is required.';
  else if (city.length < 2) errors.pickup_city = 'City must be at least 2 characters.';

  if (!state) errors.pickup_state = 'State is required.';
  else if (state.length < 2) errors.pickup_state = 'State must be at least 2 characters.';

  if (!pin) errors.pickup_pincode = 'PIN / ZIP code is required.';
  else if (pin.length < 4) errors.pickup_pincode = 'PIN / ZIP must be at least 4 characters.';

  return errors;
}

function focusFirstError(fields) {
  const firstKey = Object.keys(fields)[0];
  if (!firstKey) return;
  requestAnimationFrame(() => {
    const el = document.getElementById(firstKey);
    if (el) {
      el.focus({ preventScroll: true });
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

export default function AddDonationItemWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { currentUser } = useApp();
  const verified = currentUser?.verified;
  const canAddItems = isRoleVerified(currentUser);
  const { location: savedLocation, locationLabel } = useLocation();
  const panelRef = useRef(null);

  const [step, setStep] = useState(0);
  const [stepDirection, setStepDirection] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [draftId, setDraftId] = useState(editId ? Number(editId) : null);
  const [photos, setPhotos] = useState([]);
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);

  const selectedCategory = useMemo(
    () => categories.find((c) => String(c.category_id) === String(form.category_id)),
    [categories, form.category_id]
  );
  const detailFields = CATEGORY_DETAIL_FIELDS[selectedCategory?.slug] || [];
  const photoCount = photos.length + pendingPhotos.length;
  const stepMeta = STEPS[step];

  const loadCategories = useCallback(() => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    listItemCategories()
      .then(setCategories)
      .catch(() => setCategoriesError('Unable to load categories. Please try again.'))
      .finally(() => setCategoriesLoading(false));
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  useEffect(() => {
    if (!editId) return;
    getMyItemDonation(editId).then((item) => {
      setDraftId(item.item_donation_id);
      setPhotos(item.photo_urls || item.documents?.map((d) => d.file_url) || []);
      setForm((f) => ({
        ...f,
        item_name: item.item_name || '',
        category_id: item.category_id || '',
        subcategory: item.subcategory || '',
        description: item.description || '',
        quantity: item.quantity || 1,
        condition: item.condition || 'GOOD',
        brand: item.brand || '',
        model_variant: item.model_variant || '',
        category_details: item.category_details || {},
        pickup_line1: '',
        pickup_city: item.display_city || '',
        pickup_state: item.display_state || '',
        pickup_pincode: item.display_pincode || '',
        pickup_availability: item.pickup_availability || '',
        preferred_pickup_time: item.preferred_pickup_time || '',
        delivery_available: item.delivery_available || false,
        preferences: item.preferences || f.preferences,
        urgency: item.urgency || 'normal',
        additional_notes: item.additional_notes || '',
      }));
    }).catch((e) => setError(formatApiError(e)));
  }, [editId]);

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((errs) => {
      if (!errs[key]) return errs;
      const next = { ...errs };
      delete next[key];
      return next;
    });
    setError(null);
  };

  const setDetail = (key, value) =>
    setForm((f) => ({ ...f, category_details: { ...f.category_details, [key]: value } }));

  const buildPayload = () => ({
    item_name: form.item_name.trim(),
    category_id: Number(form.category_id),
    subcategory: form.subcategory.trim() || null,
    description: form.description.trim(),
    quantity: Number(form.quantity),
    condition: form.condition,
    brand: form.brand.trim() || null,
    model_variant: form.model_variant.trim() || null,
    category_details: Object.keys(form.category_details).length ? form.category_details : null,
    preferences: form.preferences,
    pickup_line1: form.pickup_line1.trim(),
    pickup_city: form.pickup_city.trim(),
    pickup_state: form.pickup_state.trim(),
    pickup_pincode: form.pickup_pincode.trim(),
    pickup_availability: form.pickup_availability.trim() || null,
    preferred_pickup_time: form.preferred_pickup_time.trim() || null,
    delivery_available: form.delivery_available,
    urgency: form.urgency || null,
    additional_notes: form.additional_notes.trim() || null,
  });

  const ensureDraft = async () => {
    const payload = buildPayload();
    if (draftId) return updateItemDonation(draftId, payload);
    const created = await createItemDonationDraft(payload);
    setDraftId(created.item_donation_id);
    return created;
  };

  const uploadPendingPhotos = async (id) => {
    if (!pendingPhotos.length) return;
    for (const file of pendingPhotos) {
      const res = await uploadItemDocument(id, file);
      setPhotos(res.photo_urls || res.documents?.map((d) => d.file_url) || []);
    }
    setPendingPhotos([]);
  };

  const validateStep = () => {
    if (step === 0) return validateBasicInfo(form);
    if (step === 2 && photoCount < 1) return { _form: 'Please upload at least one photo before continuing.' };
    if (step === 3) return validatePickup(form);
    if (step === 5 && !form.confirm) return { _form: 'Please confirm that your information is accurate.' };
    return {};
  };

  const applyValidationErrors = (errors) => {
    const { _form, ...fields } = errors;
    setFieldErrors(fields);
    setError(_form || (Object.keys(fields).length ? 'Please fix the highlighted fields below.' : null));
    if (Object.keys(fields).length) focusFirstError(fields);
    return Object.keys(errors).length === 0;
  };

  const goToStep = (index, direction = index > step ? 1 : -1) => {
    if (index > step) return;
    setStepDirection(direction);
    setError(null);
    setFieldErrors({});
    setStep(index);
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onNext = async () => {
    const errors = validateStep();
    if (!applyValidationErrors(errors)) return;

    setBusy(true);
    try {
      if (step >= 3) {
        const saved = await ensureDraft();
        const id = saved.item_donation_id || draftId;
        if (pendingPhotos.length && id) await uploadPendingPhotos(id);
      }
      setStepDirection(1);
      setStep((s) => s + 1);
    } catch (e) {
      setError(formatApiError(e));
    } finally {
      setBusy(false);
    }
  };

  const onUpload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const valid = [];
      for (const file of files) {
        if (!file.type.startsWith('image/')) throw new Error('Only image files (JPG, PNG, etc.) are allowed.');
        if (file.size > 10 * 1024 * 1024) throw new Error('Each image must be 10 MB or smaller.');
        valid.push(file);
      }

      if (draftId && step >= 3) {
        for (const file of valid) {
          const res = await uploadItemDocument(draftId, file);
          setPhotos(res.photo_urls || res.documents?.map((d) => d.file_url) || []);
        }
      } else {
        setPendingPhotos((prev) => [...prev, ...valid]);
      }
    } catch (e) {
      setError(formatApiError(e));
    } finally {
      setUploading(false);
    }
  };

  const removePendingPhoto = (index) => {
    setPendingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onUpload(e.dataTransfer.files);
  };

  const applySavedLocation = () => {
    if (!savedLocation) {
      setError('No saved location found. Set your location from the dashboard first.');
      return;
    }
    setForm((f) => ({
      ...f,
      pickup_city: savedLocation.city || f.pickup_city,
      pickup_state: savedLocation.state || f.pickup_state,
    }));
    setError(null);
  };

  const onSubmit = async () => {
    const errors = validateStep();
    if (!applyValidationErrors(errors)) return;

    setBusy(true);
    try {
      const saved = await ensureDraft();
      const id = saved.item_donation_id || draftId;
      if (pendingPhotos.length && id) await uploadPendingPhotos(id);
      if (photoCount < 1) {
        setError('Please upload at least one photo before submitting.');
        setStepDirection(-1);
        setStep(2);
        return;
      }
      await submitItemDonation(id);
      setSubmitted({ id, name: form.item_name.trim() || selectedCategory?.name || 'Donation item' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError(formatApiError(e));
    } finally {
      setBusy(false);
    }
  };

  const goBack = () => {
    setStepDirection(-1);
    setError(null);
    setFieldErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const previewUrls = useMemo(
    () => pendingPhotos.map((f) => URL.createObjectURL(f)),
    [pendingPhotos]
  );

  useEffect(() => () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  if (!canAddItems && !editId) {
    const isPending = verified === 'pending';
    return (
      <div className="donor-page donor-module page-route idw-wizard">
        <div className="idw-wizard__shell idw-verify-gate">
          <PageBackLink
            to="/dashboard/donor-dashboard"
            label="Back to Dashboard"
            className="idw-wizard__back"
          />
          <div className="idw-verify-gate__card">
            <div className="idw-verify-gate__icon" aria-hidden="true">
              {isPending ? <ShieldCheck size={28} /> : <ShieldAlert size={28} />}
            </div>
            <h1>{isPending ? 'Verification under review' : 'Verification required'}</h1>
            <p>
              {isPending
                ? 'Your donor verification is being reviewed. You can add donation items once your account is approved.'
                : 'Complete a quick identity check before listing items. Money donations are available without verification.'}
            </p>
            <div className="idw-verify-gate__actions">
              {!isPending && (
                <Link to="/dashboard/donor-verify" className="idw-btn idw-btn--primary">
                  Complete Verification
                </Link>
              )}
              <Link to="/dashboard/donor-donate-money" className="idw-btn idw-btn--secondary">
                Donate Money Instead
              </Link>
              <Link to="/dashboard/donor-my-donations" className="idw-link">
                View My Donations
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="donor-page donor-module page-route idw-wizard">
        <div className="idw-wizard__shell">
          <WizardSuccess
            itemId={submitted.id}
            itemName={submitted.name}
            onViewDonations={() => navigate(`/dashboard/donor-item-donation/${submitted.id}?submitted=1`)}
            onDashboard={() => navigate('/dashboard/donor-dashboard')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="donor-page donor-module page-route idw-wizard">
      <div className="idw-wizard__shell" ref={panelRef}>
        <header className="idw-wizard__head">
          <PageBackLink
            to="/dashboard/donor-dashboard"
            label="Back to Dashboard"
            className="idw-wizard__back"
          />
          <div className="idw-wizard__title-block">
            <h1>Add Donation Item</h1>
            <p>Complete each step and submit your donation for verification.</p>
          </div>
        </header>

        <DonationStepper steps={STEPS} currentStep={step} onStepClick={(i) => goToStep(i, -1)} />

        {error && (
          <div className="idw-alert idw-alert--error" role="alert">
            <AlertCircle size={18} aria-hidden="true" />
            <div>
              <strong>Couldn&apos;t continue</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        <StepPanel stepKey={step} direction={stepDirection} title={stepMeta.label} hint={stepMeta.hint}>
          {step === 0 && (
            <div className="idw-form-grid">
              <WizardField id="item_name" label="Item name" required error={fieldErrors.item_name}>
                <input
                  id="item_name"
                  value={form.item_name}
                  placeholder="e.g. Winter jackets"
                  aria-invalid={!!fieldErrors.item_name}
                  aria-describedby={fieldErrors.item_name ? 'item_name-error' : undefined}
                  onChange={(e) => setField('item_name', e.target.value)}
                />
              </WizardField>

              <WizardField id="category_id" label="Category" required error={fieldErrors.category_id}>
                {categoriesLoading ? (
                  <div className="idw-field-skeleton" aria-hidden="true" />
                ) : (
                  <select
                    id="category_id"
                    value={form.category_id}
                    aria-invalid={!!fieldErrors.category_id}
                    disabled={!!categoriesError}
                    onChange={(e) => setField('category_id', e.target.value)}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>{c.name}</option>
                    ))}
                  </select>
                )}
                <InlineError message={categoriesError} onRetry={loadCategories} />
              </WizardField>

              <WizardField id="subcategory" label="Subcategory" optional>
                <input
                  id="subcategory"
                  value={form.subcategory}
                  placeholder="e.g. Jackets"
                  onChange={(e) => setField('subcategory', e.target.value)}
                />
              </WizardField>

              <WizardField id="quantity" label="Quantity" required error={fieldErrors.quantity}>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  value={form.quantity}
                  aria-invalid={!!fieldErrors.quantity}
                  onChange={(e) => setField('quantity', e.target.value)}
                />
              </WizardField>

              <WizardField id="condition" label="Condition" required>
                <select id="condition" value={form.condition} onChange={(e) => setField('condition', e.target.value)}>
                  {CONDITIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </WizardField>

              <WizardField id="brand" label="Brand" optional>
                <input id="brand" value={form.brand} placeholder="e.g. Nike" onChange={(e) => setField('brand', e.target.value)} />
              </WizardField>

              <WizardField id="model_variant" label="Model / variant" optional>
                <input
                  id="model_variant"
                  value={form.model_variant}
                  placeholder="e.g. Size L"
                  onChange={(e) => setField('model_variant', e.target.value)}
                />
              </WizardField>

              <WizardField id="description" label="Description" required className="full" error={fieldErrors.description}>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the item, its condition, and anything the receiver should know."
                  value={form.description}
                  aria-invalid={!!fieldErrors.description}
                  onChange={(e) => setField('description', e.target.value)}
                />
              </WizardField>
            </div>
          )}

          {step === 1 && (
            <div className="idw-form-grid">
              {detailFields.length === 0 ? (
                <p className="idw-empty-step">
                  No extra fields for <strong>{selectedCategory?.name || 'this category'}</strong>.
                  You can continue to photos.
                </p>
              ) : (
                detailFields.map((field) => (
                  <WizardField key={field.key} id={field.key} label={field.label} optional>
                    {field.type === 'select' ? (
                      <select
                        id={field.key}
                        value={form.category_details[field.key] || ''}
                        onChange={(e) => setDetail(field.key, e.target.value)}
                      >
                        <option value="">Select</option>
                        {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        id={field.key}
                        value={form.category_details[field.key] || ''}
                        onChange={(e) => setDetail(field.key, e.target.value)}
                      />
                    )}
                  </WizardField>
                ))
              )}
            </div>
          )}

          {step === 2 && (
            <PhotoUploader
              photos={photos}
              pendingPhotos={pendingPhotos}
              previewUrls={previewUrls}
              uploading={uploading}
              onUpload={onUpload}
              onRemovePending={removePendingPhoto}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          )}

          {step === 3 && (
            <div className="idw-form-grid">
              <div className="idw-form-section full">
                <h3 className="idw-form-section__title">Pickup address</h3>
                {savedLocation && (
                  <button type="button" className="idw-btn idw-btn--soft idw-btn--sm" onClick={applySavedLocation}>
                    <MapPin size={14} aria-hidden="true" />
                    Use saved location{locationLabel ? ` (${locationLabel})` : ''}
                  </button>
                )}
              </div>

              <WizardField id="pickup_line1" label="Street address" required className="full" error={fieldErrors.pickup_line1}>
                <input
                  id="pickup_line1"
                  placeholder="House / building, street"
                  value={form.pickup_line1}
                  onChange={(e) => setField('pickup_line1', e.target.value)}
                />
              </WizardField>
              <WizardField id="pickup_city" label="City" required error={fieldErrors.pickup_city}>
                <input id="pickup_city" value={form.pickup_city} onChange={(e) => setField('pickup_city', e.target.value)} />
              </WizardField>
              <WizardField id="pickup_state" label="State" required error={fieldErrors.pickup_state}>
                <input id="pickup_state" value={form.pickup_state} onChange={(e) => setField('pickup_state', e.target.value)} />
              </WizardField>
              <WizardField id="pickup_pincode" label="PIN / ZIP" required error={fieldErrors.pickup_pincode}>
                <input id="pickup_pincode" value={form.pickup_pincode} onChange={(e) => setField('pickup_pincode', e.target.value)} />
              </WizardField>

              <div className="idw-form-section full">
                <h3 className="idw-form-section__title">Pickup schedule</h3>
              </div>
              <WizardField id="pickup_availability" label="Availability" className="full" optional>
                <textarea
                  id="pickup_availability"
                  rows={2}
                  placeholder="e.g. Weekdays 9 AM – 5 PM"
                  value={form.pickup_availability}
                  onChange={(e) => setField('pickup_availability', e.target.value)}
                />
              </WizardField>
              <WizardField id="preferred_pickup_time" label="Preferred time slot" optional>
                <input
                  id="preferred_pickup_time"
                  placeholder="e.g. Morning"
                  value={form.preferred_pickup_time}
                  onChange={(e) => setField('preferred_pickup_time', e.target.value)}
                />
              </WizardField>
              <label className="idw-check full">
                <input
                  type="checkbox"
                  checked={form.delivery_available}
                  onChange={(e) => setField('delivery_available', e.target.checked)}
                />
                I can arrange delivery if needed
              </label>
              <p className="idw-privacy-note full">
                Only your city and area are shown publicly until a request is accepted.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="idw-form-grid idw-form-grid--prefs">
              <WizardField id="urgency" label="Urgency" hint="How soon should this item be collected?">
                <select id="urgency" value={form.urgency} onChange={(e) => setField('urgency', e.target.value)}>
                  <option value="normal">Normal</option>
                  <option value="soon">Needed soon</option>
                  <option value="urgent">Urgent</option>
                </select>
              </WizardField>
              <WizardField id="pickup_or_delivery" label="Pickup or delivery">
                <select
                  id="pickup_or_delivery"
                  value={form.preferences.pickup_or_delivery}
                  onChange={(e) => setField('preferences', { ...form.preferences, pickup_or_delivery: e.target.value })}
                >
                  <option value="pickup">Pickup preferred</option>
                  <option value="delivery">Delivery if possible</option>
                  <option value="either">Either</option>
                </select>
              </WizardField>
              <WizardField id="additional_notes" label="Additional notes" className="full" optional>
                <textarea
                  id="additional_notes"
                  rows={3}
                  placeholder="Any other details for receivers or admins…"
                  value={form.additional_notes}
                  onChange={(e) => setField('additional_notes', e.target.value)}
                />
              </WizardField>
            </div>
          )}

          {step === 5 && (
            <div className="idw-review">
              <ReviewSection title="Donation item" onEdit={() => goToStep(0, -1)}>
                <dl className="idw-review__list">
                  <div><dt>Item</dt><dd>{form.item_name || '—'}</dd></div>
                  <div><dt>Category</dt><dd>{selectedCategory?.name || '—'}{form.subcategory ? ` · ${form.subcategory}` : ''}</dd></div>
                  <div><dt>Condition</dt><dd>{CONDITIONS.find((c) => c.value === form.condition)?.label}</dd></div>
                  <div><dt>Quantity</dt><dd>{form.quantity}</dd></div>
                  {form.brand && <div><dt>Brand</dt><dd>{form.brand}</dd></div>}
                  {form.model_variant && <div><dt>Model</dt><dd>{form.model_variant}</dd></div>}
                </dl>
              </ReviewSection>

              <ReviewSection title="Photos" onEdit={() => goToStep(2, -1)}>
                <p className="idw-review__summary">{photoCount} photo{photoCount !== 1 ? 's' : ''} attached</p>
                {(photos.length > 0 || previewUrls.length > 0) && (
                  <div className="idw-photo-grid idw-photo-grid--compact">
                    {[...photos, ...previewUrls].map((url) => (
                      <div key={url} className="idw-photo-thumb"><img src={url} alt="" /></div>
                    ))}
                  </div>
                )}
              </ReviewSection>

              <ReviewSection title="Pickup details" onEdit={() => goToStep(3, -1)}>
                <dl className="idw-review__list">
                  <div><dt>Address</dt><dd>{form.pickup_line1 || '—'}</dd></div>
                  <div><dt>Location</dt><dd>{[form.pickup_city, form.pickup_state, form.pickup_pincode].filter(Boolean).join(', ') || '—'}</dd></div>
                  {form.pickup_availability && <div><dt>Availability</dt><dd>{form.pickup_availability}</dd></div>}
                  {form.preferred_pickup_time && <div><dt>Preferred time</dt><dd>{form.preferred_pickup_time}</dd></div>}
                </dl>
              </ReviewSection>

              <ReviewSection title="Preferences" onEdit={() => goToStep(4, -1)}>
                <dl className="idw-review__list">
                  <div><dt>Urgency</dt><dd>{URGENCY_LABELS[form.urgency] || form.urgency}</dd></div>
                  <div><dt>Pickup / delivery</dt><dd>{PICKUP_PREF_LABELS[form.preferences.pickup_or_delivery] || '—'}</dd></div>
                  {form.additional_notes && <div><dt>Notes</dt><dd>{form.additional_notes}</dd></div>}
                </dl>
              </ReviewSection>

              <label className="idw-check idw-review__confirm">
                <input
                  type="checkbox"
                  checked={form.confirm}
                  onChange={(e) => setField('confirm', e.target.checked)}
                />
                I confirm that the information and photos provided are accurate.
              </label>
            </div>
          )}
        </StepPanel>

        <StepNavigation
          step={step}
          totalSteps={STEPS.length}
          onBack={goBack}
          onContinue={onNext}
          onSubmit={onSubmit}
          busy={busy}
          uploading={uploading}
        />
      </div>
    </div>
  );
}
