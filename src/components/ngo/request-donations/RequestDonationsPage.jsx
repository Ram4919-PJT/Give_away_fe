import { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../ui/Toast';
import { getNgoRequests } from '../../../utils/ngoHelpers';
import {
  getCategoryById,
  INITIAL_REQUEST_FORM,
  CONDITION_OPTIONS
} from '../../../data/ngoDonationCategories';
import RequestHero from './RequestHero';
import RequestStepper from './RequestStepper';
import RequestGuidelines from './RequestGuidelines';
import RequestTemplates from './RequestTemplates';
import CategoryGrid from './category/CategoryGrid';
import SubcategoryStep from './SubcategoryStep';
import BeneficiaryStep from './BeneficiaryStep';
import RequestDetailsModal from './RequestDetailsModal';
import RequestReview from './RequestReview';
import RequestSuccess from './RequestSuccess';
import RecentRequests from './RecentRequests';
import InventoryRequestForm from '../inventory/InventoryRequestForm';

export default function RequestDonationsPage() {
  const { currentUser, ngoRequests, dispatch } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const inventoryItem = location.state?.inventoryItem;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...INITIAL_REQUEST_FORM });
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const requests = getNgoRequests(ngoRequests, currentUser);

  const resetFlow = useCallback(() => {
    setForm({ ...INITIAL_REQUEST_FORM });
    setStep(1);
    setDetailsModalOpen(false);
  }, []);

  if (inventoryItem) {
    return <InventoryRequestForm inventoryItem={inventoryItem} />;
  }

  const patchForm = (updates) => setForm((prev) => ({ ...prev, ...updates }));

  const toggleListValue = (key, value) => {
    setForm((prev) => {
      const list = prev[key] || [];
      const next = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
      return { ...prev, [key]: next };
    });
  };

  const applyTemplate = (tpl) => {
    setForm({
      ...INITIAL_REQUEST_FORM,
      category: tpl.categoryId,
      subcategories: [...tpl.subcategories],
      beneficiaries: [...tpl.beneficiaries],
      condition: tpl.condition || 'either',
      purpose: tpl.purpose || '',
      priority: tpl.priority || 'Medium',
      templateId: tpl.id
    });
    setStep(2);
    showToast(`Template applied: ${tpl.title}`, 'success');
  };

  const handleCategorySelect = (id) => {
    setForm((prev) => ({
      ...prev,
      category: id,
      subcategories: prev.category === id ? prev.subcategories : [],
      templateId: prev.category === id ? prev.templateId : null,
      condition: id === 'clothes' ? (prev.condition || 'either') : prev.condition
    }));
  };

  const goToDetails = () => {
    setStep(4);
    setDetailsModalOpen(true);
  };

  const handleDetailsContinue = () => {
    setDetailsModalOpen(false);
    setStep(5);
  };

  const handleSubmit = () => {
    const category = getCategoryById(form.category);
    const purposeText = form.purpose || category?.label || 'Donation Request';
    const conditionLabel = CONDITION_OPTIONS.find((c) => c.id === form.condition)?.label;

    dispatch({
      type: 'ADD_NGO_REQUEST',
      payload: {
        id: 'NGO-REQ-' + Date.now(),
        ngoEmail: currentUser.email,
        type: 'Items',
        category: category?.label || form.category,
        subcategories: form.subcategories,
        beneficiaries: form.beneficiaries,
        condition: form.category === 'clothes' ? conditionLabel : null,
        title: purposeText.slice(0, 60),
        purpose: purposeText,
        quantity: Number(form.quantity) || 0,
        priority: form.priority,
        beneficiary: `${form.beneficiaryCount} beneficiaries · ${(form.beneficiaries || []).join(', ') || form.location}`,
        beneficiaryCount: Number(form.beneficiaryCount),
        location: form.location,
        distributionDate: form.deliveryDate,
        targetDate: form.deliveryDate,
        notes: [form.description, form.specialInstructions].filter(Boolean).join('\n\n'),
        status: 'Submitted',
        appliedDate: new Date().toISOString().split('T')[0]
      }
    });
    setStep(6);
    showToast('Donation request submitted successfully!', 'success');
  };

  const showSidebar = step < 6;
  const showRecent = step < 6;
  const showTemplates = step === 1;

  return (
    <div className="rd-page ngo-page ngo-module page-route">
      <RequestHero requests={requests} />
      <RequestStepper step={step} />

      <div className="rd-layout">
        <div className="rd-main-panel">
          {step === 1 && (
            <section className="rd-step-panel" key="step-category">
              {showTemplates && (
                <RequestTemplates activeId={form.templateId} onSelect={applyTemplate} />
              )}

              <header className="rd-panel-head">
                <h2>Select Donation Category</h2>
                <p>Choose the main resource type. Next you will pick exact items needed.</p>
              </header>

              <CategoryGrid
                selectedCategory={form.category}
                onSelect={handleCategorySelect}
              />

              <footer className="rd-step-footer">
                <button
                  type="button"
                  className="rd-btn rd-btn--primary"
                  disabled={!form.category}
                  onClick={() => setStep(2)}
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              </footer>
            </section>
          )}

          {step === 2 && (
            <>
              <SubcategoryStep
                categoryId={form.category}
                selected={form.subcategories}
                onToggle={(item) => toggleListValue('subcategories', item)}
              />
              <footer className="rd-step-footer rd-step-footer--split">
                <button type="button" className="rd-btn rd-btn--ghost" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button
                  type="button"
                  className="rd-btn rd-btn--primary"
                  disabled={!form.subcategories?.length}
                  onClick={() => setStep(3)}
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              </footer>
            </>
          )}

          {step === 3 && (
            <>
              <BeneficiaryStep
                selected={form.beneficiaries}
                condition={form.condition}
                showCondition={form.category === 'clothes'}
                onToggle={(item) => toggleListValue('beneficiaries', item)}
                onConditionChange={(id) => patchForm({ condition: id })}
              />
              <footer className="rd-step-footer rd-step-footer--split">
                <button type="button" className="rd-btn rd-btn--ghost" onClick={() => setStep(2)}>
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button
                  type="button"
                  className="rd-btn rd-btn--primary"
                  disabled={!form.beneficiaries?.length}
                  onClick={goToDetails}
                >
                  Continue to Details
                  <ArrowRight size={18} />
                </button>
              </footer>
            </>
          )}

          {step === 5 && (
            <RequestReview
              form={form}
              onEdit={() => {
                setStep(4);
                setDetailsModalOpen(true);
              }}
              onSubmit={handleSubmit}
            />
          )}

          {step === 6 && (
            <RequestSuccess
              onViewRequests={() => navigate('/dashboard/ngo-my-requests')}
              onCreateAnother={resetFlow}
            />
          )}
        </div>

        {showSidebar && <RequestGuidelines />}
      </div>

      {detailsModalOpen && (
        <RequestDetailsModal
          form={form}
          onChange={setForm}
          onClose={() => {
            setDetailsModalOpen(false);
            if (step === 4) setStep(3);
          }}
          onContinue={handleDetailsContinue}
        />
      )}

      {showRecent && <RecentRequests requests={requests} />}
    </div>
  );
}
