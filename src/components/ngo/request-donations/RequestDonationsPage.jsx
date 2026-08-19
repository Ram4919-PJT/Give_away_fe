import { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../ui/Toast';
import { coreClient } from '../../../api/platformApi';
import { getNgoRequests } from '../../../utils/ngoHelpers';
import {
  getCategoryById,
  INITIAL_REQUEST_FORM,
} from '../../../data/ngoDonationCategories';
import { useStepNavigation } from '../../../hooks/useStepNavigation';
import { FlowStepFooter, FlowStepPanel } from '../../ui/FlowNav';
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

const NGO_FOOTER = 'rd-step-footer rd-step-footer--split';
const NGO_BACK_BTN = 'rd-btn rd-btn--ghost';
const NGO_PRIMARY_BTN = 'rd-btn rd-btn--primary';

export default function RequestDonationsPage() {
  const { currentUser, ngoRequests, ngoProfile, refreshPlatformData } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const inventoryItem = location.state?.inventoryItem;

  const { step, direction, goToStep, goBack, resetStep } = useStepNavigation(1, { max: 6 });
  const [form, setForm] = useState({ ...INITIAL_REQUEST_FORM });
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const requests = getNgoRequests(ngoRequests, currentUser);

  const resetFlow = useCallback(() => {
    setForm({ ...INITIAL_REQUEST_FORM });
    resetStep(1);
    setDetailsModalOpen(false);
  }, [resetStep]);

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
      templateId: tpl.id,
    });
    goToStep(2);
    showToast(`Template applied: ${tpl.title}`, 'success');
  };

  const handleCategorySelect = (id) => {
    setForm((prev) => ({
      ...prev,
      category: id,
      subcategories: prev.category === id ? prev.subcategories : [],
      templateId: prev.category === id ? prev.templateId : null,
      condition: id === 'clothes' ? (prev.condition || 'either') : prev.condition,
    }));
  };

  const goToDetails = () => {
    goToStep(4);
    setDetailsModalOpen(true);
  };

  const handleDetailsContinue = () => {
    setDetailsModalOpen(false);
    goToStep(5);
  };

  const handleReviewBack = () => {
    goToStep(3);
  };

  const handleSubmit = async () => {
    const category = getCategoryById(form.category);
    const ngoId = ngoProfile?.ngo_id;
    if (!ngoId) {
      showToast('NGO profile not found. Complete registration first.', 'error');
      return;
    }
    const qty = Number(form.quantity) || 1;
    setSubmitting(true);
    try {
      await coreClient.createNgoItemRequest({
        ngo_id: ngoId,
        item_category: category?.label || form.category,
        quantity_requested: qty,
      });
      await refreshPlatformData('ngo', currentUser?.email);
      goToStep(6);
      showToast('Donation request submitted successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Could not submit request.', 'error');
    } finally {
      setSubmitting(false);
    }
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
            <FlowStepPanel stepKey="rd-step-1" direction={direction} className="rd-step-panel">
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

              <FlowStepFooter
                step={step}
                totalSteps={5}
                onCancel={() => navigate('/dashboard/ngo-dashboard')}
                cancelLabel="Cancel"
                onContinue={() => goToStep(2)}
                continueDisabled={!form.category}
                footerClassName={NGO_FOOTER}
                backButtonClassName={NGO_BACK_BTN}
                primaryButtonClassName={NGO_PRIMARY_BTN}
              />
            </FlowStepPanel>
          )}

          {step === 2 && (
            <FlowStepPanel stepKey="rd-step-2" direction={direction}>
              <SubcategoryStep
                categoryId={form.category}
                selected={form.subcategories}
                onToggle={(item) => toggleListValue('subcategories', item)}
              />
              <FlowStepFooter
                step={step}
                totalSteps={5}
                onBack={goBack}
                backLabel="Previous"
                onContinue={() => goToStep(3)}
                continueDisabled={!form.subcategories?.length}
                footerClassName={NGO_FOOTER}
                backButtonClassName={NGO_BACK_BTN}
                primaryButtonClassName={NGO_PRIMARY_BTN}
              />
            </FlowStepPanel>
          )}

          {step === 3 && (
            <FlowStepPanel stepKey="rd-step-3" direction={direction}>
              <BeneficiaryStep
                selected={form.beneficiaries}
                condition={form.condition}
                showCondition={form.category === 'clothes'}
                onToggle={(item) => toggleListValue('beneficiaries', item)}
                onConditionChange={(id) => patchForm({ condition: id })}
              />
              <FlowStepFooter
                step={step}
                totalSteps={5}
                onBack={goBack}
                backLabel="Previous"
                onContinue={goToDetails}
                continueLabel="Continue to Details"
                continueDisabled={!form.beneficiaries?.length}
                footerClassName={NGO_FOOTER}
                backButtonClassName={NGO_BACK_BTN}
                primaryButtonClassName={NGO_PRIMARY_BTN}
              />
            </FlowStepPanel>
          )}

          {step === 5 && (
            <FlowStepPanel stepKey="rd-step-5" direction={direction}>
              <RequestReview
                form={form}
                onEdit={() => {
                  goToStep(4);
                  setDetailsModalOpen(true);
                }}
                onBack={handleReviewBack}
                onSubmit={handleSubmit}
                submitting={submitting}
              />
            </FlowStepPanel>
          )}

          {step === 6 && (
            <FlowStepPanel stepKey="rd-step-6" direction={direction}>
              <RequestSuccess
                onViewRequests={() => navigate('/dashboard/ngo-my-requests')}
                onCreateAnother={resetFlow}
              />
            </FlowStepPanel>
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
            if (step === 4) goToStep(3);
          }}
          onContinue={handleDetailsContinue}
        />
      )}

      {showRecent && <RecentRequests requests={requests} />}
    </div>
  );
}
