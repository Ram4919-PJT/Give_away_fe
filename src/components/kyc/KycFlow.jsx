import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Info, Loader2, ShieldCheck } from 'lucide-react';
import { useStepNavigation } from '../../hooks/useStepNavigation';
import { FlowStepFooter, FlowStepPanel, PageBackLink } from '../ui/FlowNav';
import RelativeTime from '../ui/RelativeTime';
import DocumentUploadCard from './DocumentUploadCard';
import KycFormField from './KycFormField';
import KycMobileOtpPanel from './KycMobileOtpPanel';
import { KycValidationChecklist } from './KycStatusCard';
import {
  createOrResumeVerification,
  getKycReadiness,
  getMyVerification,
  sendKycMobileOtp,
  submitVerificationRequest,
  updateVerificationDraft,
  verifyKycMobileOtp,
} from '../../api/verificationClient';
import { invalidateReceiverEligibilityCache } from '../../hooks/useReceiverEligibility';
import { ApiRequestError } from '../../api/client';
import {
  errorsToMap,
  mergePersonalNames,
  normalizeMobile,
  validateMobileNumber,
  validateKycStep,
} from '../../utils/kycFieldValidation';
import { mergeFormFromApiPayload, ID_NUMBER_FORMAT_HINTS, normalizeIdentityNumber } from '../../utils/kycPayloadMerge';
import {
  getKycConsentText,
  resolveStepDocuments,
} from '../../utils/kycConfigMapper';
import { labelForKycFieldPath } from '../../data/receiverKycAdminFields';
import {
  ReceiverKycHeader,
  ReceiverKycSecurityBanner,
  ReceiverKycProgressSidebar,
  ReceiverKycGuidelines,
  ReceiverKycSupportCard,
  ReceiverKycWhySection,
  ReceiverKycStatusCard,
  ReceiverKycPrivacyFooter,
} from '../receiver/verification/ReceiverKycUi';

function maskSensitive(value) {
  if (!value || value.length < 4) return '••••';
  const str = String(value);
  if (str.length <= 8) return '••••' + str.slice(-4);
  return '••••••' + str.slice(-4);
}

function maskAccount(value) {
  if (!value) return '—';
  const str = String(value).replace(/\s/g, '');
  return 'XXXXXX' + str.slice(-4);
}

function preparePayloadForSave(form = {}) {
  const payload = { ...form };
  if (payload.personal) {
    payload.personal = mergePersonalNames(payload.personal);
  }
  if (payload.mobile?.mobile) {
    payload.mobile = { ...payload.mobile, mobile: normalizeMobile(payload.mobile.mobile) };
  }
  return payload;
}

function statusBadge(status) {
  const s = String(status || '').toUpperCase();
  if (s === 'VERIFIED' || s === 'APPROVED') return { label: 'VERIFIED', tone: 'success' };
  if (s === 'REJECTED') return { label: 'REJECTED', tone: 'danger' };
  if (s === 'UNDER_REVIEW' || s === 'DOCUMENTS_SUBMITTED' || s === 'VALIDATION_IN_PROGRESS') {
    return { label: 'UNDER REVIEW', tone: 'info' };
  }
  if (s === 'MORE_DOCUMENTS_REQUIRED') return { label: 'ACTION REQUIRED', tone: 'warning' };
  if (s === 'DRAFT' || s === 'KYC_IN_PROGRESS') return { label: 'IN PROGRESS', tone: 'warning' };
  return { label: 'UNVERIFIED', tone: 'muted' };
}

function buildReviewSections(steps, form, documentsByType) {
  return steps.filter((s) => !s.review).map((step) => {
    const section = form[step.id] || {};
    const lines = [];

    if (step.fields?.length) {
      step.fields.forEach((f) => {
        const val = section[f.key];
        if (!val) return;
        const display = f.sensitive ? maskSensitive(val) : val;
        lines.push(`${f.label}: ${display}`);
      });
    }

    if (step.documents?.length) {
      step.documents.forEach((d) => {
        const uploaded = documentsByType[d.type];
        lines.push(`${d.label}: ${uploaded ? 'Uploaded' : 'Missing'}`);
      });
    }

    if (step.mobileOtp) {
      lines.push(`Mobile: ${section.mobile ? maskSensitive(section.mobile) : '—'}`);
      lines.push(`Verified: ${form.mobile_verification?.verified_at ? 'Yes' : 'No'}`);
    }

    if (step.dynamicDocuments) {
      const purpose = form.assistance?.category;
      lines.push(`Purpose: ${purpose || '—'}`);
    }

    return { id: step.id, title: step.title, lines };
  });
}

export default function KycFlow({
  role,
  roleLabel,
  steps,
  dashboardPath,
  onStatusChange,
  kycConfig = null,
}) {
  const isReceiver = role === 'receiver';
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [profileStatus, setProfileStatus] = useState('REGISTERED');
  const [request, setRequest] = useState(null);
  const [form, setForm] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSendBusy, setOtpSendBusy] = useState(false);
  const [otpVerifyBusy, setOtpVerifyBusy] = useState(false);
  const [otpSendMessage, setOtpSendMessage] = useState(null);
  const [devOtpHint, setDevOtpHint] = useState(null);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [consent, setConsent] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [lastSaved, setLastSaved] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);

  const onStatusChangeRef = useRef(onStatusChange);
  const lastReportedStatusRef = useRef(null);
  const stepInitializedRef = useRef(false);

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  const totalSteps = steps.length;
  const { step, direction, goNext, goBack, goToStep } = useStepNavigation(1, { min: 1, max: totalSteps });
  const currentStep = steps[step - 1];
  const badge = statusBadge(request?.status || profileStatus);

  const assistanceCategory = form.assistance?.category || form.supporting?.assistance_purpose;
  const stepDocuments = useMemo(() => {
    return resolveStepDocuments(currentStep, { form, config: kycConfig });
  }, [currentStep, form, kycConfig, assistanceCategory]);

  const consentText = getKycConsentText(kycConfig);

  const documentsByType = useMemo(() => {
    const map = {};
    (request?.documents || []).forEach((d) => { map[d.document_type] = d; });
    return map;
  }, [request?.documents]);

  const reviewSections = useMemo(
    () => buildReviewSections(steps, form, documentsByType),
    [steps, form, documentsByType],
  );

  useEffect(() => {
    if (totalSteps < 1) return;

    let cancelled = false;
    setLoading(true);
    setSessionReady(false);

    (async () => {
      setError(null);
      try {
        const me = await getMyVerification();
        if (cancelled) return;

        setProfileStatus(me.profile_status || 'REGISTERED');
        let req = me.request;
        if (!req && !['VERIFIED', 'APPROVED'].includes(String(me.profile_status || '').toUpperCase())) {
          req = await createOrResumeVerification();
        }
        if (cancelled) return;

        setRequest(req);
        setForm((prev) => mergeFormFromApiPayload(prev, req?.payload || {}));
        setMobileVerified(Boolean(req?.payload?.mobile_verification?.verified_at));

        if (req?.current_step && !stepInitializedRef.current) {
          stepInitializedRef.current = true;
          goToStep(Math.min(req.current_step, totalSteps));
        }

        const status = String(me.profile_status || 'REGISTERED').toUpperCase();
        if (lastReportedStatusRef.current !== status) {
          lastReportedStatusRef.current = status;
          onStatusChangeRef.current?.(me.profile_status, req);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Could not load verification');
      } finally {
        if (!cancelled) {
          setSessionReady(true);
          setLoading(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [totalSteps, goToStep]);

  useEffect(() => {
    setFieldErrors({});
    setOtpSendMessage(null);
    setDevOtpHint(null);
    if (currentStep?.id === 'mobile' && !mobileVerified) {
      const m = normalizeMobile(form.mobile?.mobile || '');
      if (m.length === 10) setOtpSent(true);
    }
  }, [step]);

  useEffect(() => {
    if (!sessionReady || loading || request?.request_id) return;
    const verified = ['VERIFIED', 'APPROVED'].includes(String(profileStatus).toUpperCase());
    if (verified) return;

    let cancelled = false;
    (async () => {
      try {
        const req = await createOrResumeVerification();
        if (cancelled || !req?.request_id) return;
        setRequest(req);
        setForm((prev) => mergeFormFromApiPayload(prev, { ...(req.payload || {}), ...prev }));
        setMobileVerified(Boolean(req.payload?.mobile_verification?.verified_at));
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Could not start verification session');
      }
    })();

    return () => { cancelled = true; };
  }, [sessionReady, loading, request?.request_id, profileStatus]);

  const ensureRequest = async () => {
    if (request?.request_id) return request;
    const req = await createOrResumeVerification();
    if (!req?.request_id) {
      throw new Error('Could not start verification session. Please refresh and try again.');
    }
    setRequest(req);
    setForm((prev) => mergeFormFromApiPayload(prev, { ...(req.payload || {}), ...prev }));
    setMobileVerified(Boolean(req.payload?.mobile_verification?.verified_at));
    return req;
  };

  const saveStep = async (nextStep) => {
    const req = await ensureRequest();
    const mergedPayload = preparePayloadForSave({ ...(req.payload || {}), ...form });
    const updated = await updateVerificationDraft(req.request_id, {
      payload: mergedPayload,
      current_step: nextStep ?? step,
    });
    setRequest(updated);
    setForm((prev) => mergeFormFromApiPayload(prev, updated.payload || {}));
    setLastSaved(new Date());
    return updated;
  };

  const clearFieldError = (fieldPath) => {
    setFieldErrors((prev) => {
      if (!prev[fieldPath]) return prev;
      const next = { ...prev };
      delete next[fieldPath];
      return next;
    });
  };

  const patchField = (key, value) => {
    const sectionKey = currentStep.id;
    let normalized = value;
    if (key === 'ifsc' && typeof value === 'string') {
      normalized = value.toUpperCase().replace(/\s/g, '');
    }
    if (key === 'mobile') {
      normalized = normalizeMobile(value);
    }
    if (key === 'pincode') {
      normalized = String(value).replace(/\D/g, '').slice(0, 6);
    }
    if (key === 'account_number') {
      normalized = String(value).replace(/\D/g, '').slice(0, 18);
    }
    if (key === 'id_number') {
      normalized = normalizeIdentityNumber(form.identity?.id_type, value);
    }
    clearFieldError(`${sectionKey}.${key}`);
    setForm((prev) => ({
      ...prev,
      [sectionKey]: { ...(prev[sectionKey] || {}), [key]: normalized },
    }));
  };

  const getFieldValue = (key) => {
    const section = form[currentStep.id] || {};
    return section[key] ?? '';
  };

  const isFieldVisible = (field) => {
    if (!field.show_when) return true;
    const section = form[currentStep.id] || {};
    const actual = section[field.show_when.field];
    if (field.show_when.values) return field.show_when.values.includes(actual);
    if (field.show_when.exclude_values) return actual && !field.show_when.exclude_values.includes(actual);
    return true;
  };

  const stepFieldsValid = () => {
    if (!currentStep.fields?.length) return true;
    const rel = currentStep.id === 'beneficiary' ? getFieldValue('relationship') : null;
    return currentStep.fields
      .filter((f) => isFieldVisible(f))
      .every((f) => {
        let required = f.required;
        if (currentStep.id === 'beneficiary' && rel && rel !== 'SELF') {
          if (f.key === 'full_name' || f.key === 'dob') required = true;
        }
        if (!required) return true;
        return String(getFieldValue(f.key) || '').trim();
      });
  };

  const stepDocsValid = () => {
    if (!stepDocuments.length) return true;
    return stepDocuments
      .filter((d) => d.required)
      .every((d) => documentsByType[d.type]);
  };

  const mobileStepValid = () => {
    if (!currentStep.mobileOtp) return true;
    return mobileVerified || Boolean(form.mobile_verification?.verified_at);
  };

  const canContinue = stepFieldsValid() && stepDocsValid() && mobileStepValid();

  const handleSendOtp = async () => {
    const mobile = normalizeMobile(getFieldValue('mobile') || form.mobile?.mobile);
    if (!mobile) return false;
    const mobileErrors = validateMobileNumber(mobile);
    if (mobileErrors.length) {
      setFieldErrors((prev) => ({ ...prev, ...errorsToMap(mobileErrors) }));
      setOtpSendMessage(null);
      return false;
    }
    setOtpSendBusy(true);
    setError(null);
    setOtpSendMessage(null);
    setDevOtpHint(null);
    try {
      const req = await ensureRequest();
      const result = await sendKycMobileOtp(mobile, req.request_id);
      setOtpSent(true);
      setOtpCode('');
      setDevOtpHint(result?.dev_otp || null);
      setOtpSendMessage(result?.sent
        ? 'OTP sent to your mobile.'
        : (result?.message || 'Use your existing OTP or wait to resend.'));
      patchField('mobile', mobile);
      clearFieldError('mobile_verification');
      return Boolean(result?.sent ?? true);
    } catch (err) {
      setOtpSendMessage(null);
      setError(err?.message || 'Could not send OTP');
      return false;
    } finally {
      setOtpSendBusy(false);
    }
  };

  const handleVerifyOtp = async () => {
    const mobile = normalizeMobile(getFieldValue('mobile') || form.mobile?.mobile);
    const code = String(otpCode || '').replace(/\D/g, '').slice(0, 4);
    if (!mobile || code.length < 4) {
      setFieldErrors((prev) => ({
        ...prev,
        'mobile.otp': 'Enter the 4-digit OTP sent to your mobile.',
      }));
      return false;
    }
    setOtpVerifyBusy(true);
    setError(null);
    clearFieldError('mobile.otp');
    try {
      const req = await ensureRequest();
      const updated = await verifyKycMobileOtp(mobile, code, req.request_id);
      setRequest(updated);
      setForm((prev) => mergeFormFromApiPayload(prev, updated.payload || {}));
      setMobileVerified(true);
      setOtpCode('');
      setOtpSendMessage(null);
      setDevOtpHint(null);
      clearFieldError('mobile_verification');
      return true;
    } catch (err) {
      setFieldErrors((prev) => ({
        ...prev,
        'mobile.otp': err?.message || 'Invalid OTP. Please try again.',
      }));
      return false;
    } finally {
      setOtpVerifyBusy(false);
    }
  };

  const handleContinue = async () => {
    const stepErrors = validateKycStep(currentStep, form, { documentsByType, mobileVerified });
    if (stepErrors.length) {
      setFieldErrors(errorsToMap(stepErrors));
      setError('Please fix the highlighted fields before continuing.');
      return;
    }
    setFieldErrors({});
    setError(null);
    try {
      await saveStep(step + 1);
      goNext();
    } catch (err) {
      setError(err?.message || 'Could not save progress');
    }
  };

  const handleSubmit = async () => {
    if (!consent) return;
    setSubmitting(true);
    setError(null);
    setValidationErrors([]);
    try {
      const req = await ensureRequest();
      await saveStep(totalSteps);
      const readiness = await getKycReadiness(req.request_id, { consentGiven: true });
      if (!readiness.ready) {
        setValidationErrors(readiness.errors || []);
        goToStep(totalSteps);
        setError('Your verification is incomplete. Review the checklist below and fix each item.');
        return;
      }
      const updated = await submitVerificationRequest(req.request_id, {
        consentGiven: true,
        consentVersion: kycConfig?.consent_version || 'kyc-v1',
      });
      setRequest(updated);
      setProfileStatus('UNDER_REVIEW');
      setForm((prev) => mergeFormFromApiPayload(prev, updated?.payload || {}));
      lastReportedStatusRef.current = 'UNDER_REVIEW';
      invalidateReceiverEligibilityCache();
      onStatusChangeRef.current?.('UNDER_REVIEW', updated);
      setError(null);
      setValidationErrors([]);
    } catch (err) {
      if (err instanceof ApiRequestError && err.errors?.length) {
        setValidationErrors(err.errors);
        goToStep(totalSteps);
      }
      setError(err?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const goToFieldStep = (field) => {
    if (!field) return;
    const section = field.split('.')[0];
    const stepIndex = steps.findIndex((s) => s.id === section);
    if (stepIndex >= 0) goToStep(stepIndex + 1);
  };

  const handleStepClick = (targetStep) => {
    if (targetStep < step) goToStep(targetStep);
  };

  const scrollToWizard = () => {
    document.getElementById('receiver-kyc-wizard')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || !sessionReady) {
    return (
      <div className={`kyc-flow kyc-flow--loading${isReceiver ? ' receiver-kyc-page' : ''}`}>
        <Loader2 className="kyc-flow__spinner" size={28} aria-hidden="true" />
        <p>Loading verification…</p>
      </div>
    );
  }

  const profileVerified = ['VERIFIED', 'APPROVED'].includes(String(profileStatus).toUpperCase());
  const requestStatus = String(request?.status || profileStatus).toUpperCase();
  const underReview = ['UNDER_REVIEW', 'DOCUMENTS_SUBMITTED', 'VALIDATION_IN_PROGRESS'].includes(requestStatus);
  const moreDocsRequired = requestStatus === 'MORE_DOCUMENTS_REQUIRED';
  const rejected = requestStatus === 'REJECTED';
  const showWizard = !profileVerified && (!underReview || moreDocsRequired || rejected || requestStatus === 'DRAFT' || requestStatus === 'KYC_IN_PROGRESS');

  const statusForCard = profileVerified ? 'VERIFIED' : (underReview && !moreDocsRequired && !rejected ? 'UNDER_REVIEW' : requestStatus);

  const showValidationChecklist = currentStep?.review && validationErrors.length > 0;

  if (isReceiver) {
    if (profileVerified) {
      return (
        <div className="receiver-kyc-page page-route">
          <PageBackLink to={dashboardPath} label="Back to Dashboard" />
          <ReceiverKycHeader onHelp={() => scrollToWizard()} />
          <ReceiverKycSecurityBanner />
          <ReceiverKycStatusCard status="VERIFIED" request={request} onAction={scrollToWizard} />
          <ReceiverKycPrivacyFooter />
        </div>
      );
    }

    if (underReview && !moreDocsRequired && !rejected) {
      return (
        <div className="receiver-kyc-page page-route">
          <PageBackLink to={dashboardPath} label="Back to Dashboard" />
          <ReceiverKycHeader onHelp={() => scrollToWizard()} />
          <ReceiverKycSecurityBanner />
          <div className="rkyc-form-card rkyc-form-card--status">
            <Clock size={28} aria-hidden="true" />
            <div>
              <h2>Verification submitted</h2>
              <p>Your verification is currently under review. You cannot edit the form while it is being reviewed.</p>
              {request?.reference_code && (
                <p className="rkyc-meta">Reference: <strong>{request.reference_code}</strong></p>
              )}
              {request?.submitted_at && (
                <p className="rkyc-meta">Submitted <RelativeTime value={request.submitted_at} /></p>
              )}
            </div>
          </div>
          <ReceiverKycStatusCard status="UNDER_REVIEW" request={request} />
          <ReceiverKycPrivacyFooter />
        </div>
      );
    }

    return (
      <div className="receiver-kyc-page page-route">
        <PageBackLink to={dashboardPath} label="Back to Dashboard" />

        <ReceiverKycHeader onHelp={() => scrollToWizard()} />
        <ReceiverKycSecurityBanner />

        {showWizard && !request?.request_id && (
          <div className="rkyc-form-card rkyc-form-card--loading">
            <Loader2 className="kyc-spin" size={24} aria-hidden="true" />
            <p>Preparing your verification session…</p>
          </div>
        )}

        {showWizard && request?.request_id && (
          <div id="receiver-kyc-wizard" className="receiver-kyc-layout">
            <div className="receiver-kyc-main">
              <div className="rkyc-form-card">
                {error && (
                  <div className="kyc-alert kyc-alert--danger" role="alert">{error}</div>
                )}

                {(rejected || moreDocsRequired) && (
                  <div className={`kyc-alert ${moreDocsRequired ? 'kyc-alert--warning' : 'kyc-alert--danger'}`} role="alert">
                    <AlertTriangle size={18} />
                    <div>
                      <strong>{moreDocsRequired ? 'Admin requested updates' : 'Verification rejected'}</strong>
                      <p>
                        {moreDocsRequired
                          ? 'Please update the fields or documents below, then resubmit for admin review.'
                          : (request?.rejection_reasons?.[0] || 'Please review feedback and update your submission.')}
                      </p>
                      {moreDocsRequired && (
                        <ul className="kyc-alert__list">
                          {(form.admin_field_requests || request?.payload?.admin_field_requests || [])
                            .filter((r) => r.status === 'PENDING' || !r.status)
                            .flatMap((r) => (r.field_paths || []).map((path) => ({ path, reason: r.reason })))
                            .map((item) => (
                              <li key={item.path}>
                                <strong>{labelForKycFieldPath(item.path)}</strong>
                                {item.reason ? ` — ${item.reason}` : ''}
                              </li>
                            ))}
                          {(form.admin_document_requests || request?.payload?.admin_document_requests || [])
                            .filter((r) => r.status === 'PENDING' || !r.status)
                            .map((r) => (
                              <li key={r.document_type}>
                                <strong>{r.document_type.replace(/_/g, ' ')}</strong>
                                {r.reason ? ` — ${r.reason}` : ''}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {showValidationChecklist && (
                  <KycValidationChecklist errors={validationErrors} onGoToField={goToFieldStep} />
                )}

                <span className="rkyc-step-badge">Step {step} of {totalSteps}</span>
                <h2>{currentStep.title}</h2>
                {currentStep.hint && <p className="kyc-panel__hint">{currentStep.hint}</p>}
                {lastSaved && (
                  <p className="rkyc-last-saved">Last saved <RelativeTime value={lastSaved} /></p>
                )}

                <FlowStepPanel stepKey={currentStep.id} direction={direction} className="kyc-panel kyc-panel--embedded">
                  {currentStep.id === 'identity' && (
                    <div className="rkyc-info-note" role="note">
                      <Info size={16} aria-hidden="true" />
                      <span>
                        {form.identity?.id_type && ID_NUMBER_FORMAT_HINTS[form.identity.id_type]
                          ? `${ID_NUMBER_FORMAT_HINTS[form.identity.id_type]}. Enter exactly as printed on the document.`
                          : 'Select your document type, then enter the number exactly as printed on the document.'}
                      </span>
                    </div>
                  )}

                  {currentStep.id === 'personal' && (
                    <div className="rkyc-info-note" role="note">
                      <Info size={16} aria-hidden="true" />
                      <span>Please ensure your name matches your identity document. This helps us verify your identity faster.</span>
                    </div>
                  )}

                  {currentStep.mobileOtp && (
                    <KycMobileOtpPanel
                      mobile={form.mobile?.mobile || ''}
                      onMobileChange={(v) => {
                        const prev = normalizeMobile(form.mobile?.mobile || '');
                        const next = normalizeMobile(v);
                        if (next !== prev) {
                          setOtpSent(false);
                          setOtpCode('');
                          setOtpSendMessage(null);
                          setDevOtpHint(null);
                        }
                        patchField('mobile', v);
                      }}
                      mobileError={fieldErrors['mobile.mobile']}
                      otpError={fieldErrors['mobile.otp']}
                      verified={mobileVerified}
                      verifiedAt={form.mobile_verification?.verified_at}
                      otpSent={otpSent}
                      otpCode={otpCode}
                      onOtpChange={(v) => {
                        clearFieldError('mobile.otp');
                        setOtpCode(v);
                      }}
                      sendBusy={otpSendBusy}
                      verifyBusy={otpVerifyBusy}
                      sendMessage={otpSendMessage}
                      devOtp={devOtpHint}
                      onSendOtp={handleSendOtp}
                      onVerifyOtp={handleVerifyOtp}
                    />
                  )}

                  {fieldErrors.mobile_verification && currentStep.mobileOtp && (
                    <p className="kyc-form-field__error" role="alert">{fieldErrors.mobile_verification}</p>
                  )}

                  {currentStep.fields?.filter(isFieldVisible).filter((f) => !currentStep.mobileOtp || f.key !== 'mobile').length > 0 && (
                    <div className={`kyc-form-grid${currentStep.id === 'personal' ? ' kyc-form-grid--personal' : ''}`}>
                      {currentStep.fields.filter(isFieldVisible).filter((f) => !currentStep.mobileOtp || f.key !== 'mobile').map((field) => {
                        const fieldPath = `${currentStep.id}.${field.key}`;
                        const section = form[currentStep.id] || {};
                        const rawValue = section[field.key] ?? '';
                        let maskPreview = null;
                        if (field.sensitive && rawValue) {
                          maskPreview = field.key.includes('account')
                            ? `Stored securely — display: ${maskAccount(rawValue)}`
                            : `Stored securely — display: ${maskSensitive(rawValue)}`;
                        }
                        return (
                          <KycFormField
                            key={field.key}
                            field={{ ...field, maskPreview }}
                            value={field.sensitive && !rawValue ? '' : rawValue}
                            onChange={(v) => patchField(field.key, v)}
                            error={fieldErrors[fieldPath]}
                          />
                        );
                      })}
                    </div>
                  )}

                  {stepDocuments.map((doc) => (
                    <DocumentUploadCard
                      key={doc.type}
                      requestId={request?.request_id}
                      documentType={doc.type}
                      label={doc.label}
                      required={doc.required}
                      uploaded={documentsByType[doc.type]}
                      onUpdated={setRequest}
                    />
                  ))}

                  {currentStep.review && (
                    <div className="kyc-review">
                      {isReceiver && (
                        <div className="rkyc-review-notice" role="note">
                          <strong>Submit for platform admin review</strong>
                          <p>
                            Your identity, documents, and bank details will be reviewed by our team.
                            After approval you can create assistance requests with request-specific evidence.
                          </p>
                          <ol className="rkyc-flow-mini">
                            <li className="rkyc-flow-mini__active">Submit KYC</li>
                            <li>Admin reviews</li>
                            <li>KYC approved</li>
                            <li>Request assistance</li>
                            <li>Admin reviews request</li>
                          </ol>
                        </div>
                      )}
                      <div className="kyc-review-summary">
                        {reviewSections.map((section) => (
                          <div key={section.id} className="kyc-review-section">
                            <div className="kyc-review-section__head">
                              <strong>{section.title}</strong>
                              <button type="button" className="kyc-review-section__edit" onClick={() => {
                                const idx = steps.findIndex((s) => s.id === section.id);
                                if (idx >= 0) goToStep(idx + 1);
                              }}>
                                Edit
                              </button>
                            </div>
                            {section.lines.map((line) => (
                              <p key={line}>{line}</p>
                            ))}
                          </div>
                        ))}
                      </div>
                      <label className="kyc-consent">
                        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                        <span>{consentText}</span>
                      </label>
                    </div>
                  )}
                </FlowStepPanel>

                <FlowStepFooter
                  step={step}
                  totalSteps={totalSteps}
                  onBack={goBack}
                  backLabel="Previous step"
                  onContinue={handleContinue}
                  continueLabel="Save & Continue"
                  continueDisabled={!canContinue}
                  isLastStep={currentStep.review}
                  onSubmit={handleSubmit}
                  submitLabel={isReceiver ? 'Submit for admin review' : 'Submit for Verification'}
                  submitting={submitting}
                  submitDisabled={!consent}
                  footerClassName="kyc-wizard__footer flow-step-footer flow-step-footer--split"
                  backButtonClassName="flow-btn flow-btn--ghost"
                  primaryButtonClassName="flow-btn flow-btn--primary"
                />
              </div>
            </div>

            <aside className="rkyc-aside">
              <ReceiverKycProgressSidebar
                steps={steps}
                currentStep={step}
                onStepClick={handleStepClick}
                percent={Math.round(((step - 1) / totalSteps) * 100)}
              />
              <ReceiverKycGuidelines />
              <ReceiverKycSupportCard />
            </aside>
          </div>
        )}

        <ReceiverKycWhySection />
        <ReceiverKycStatusCard
          status={statusForCard}
          request={request}
          onAction={scrollToWizard}
        />
        <ReceiverKycPrivacyFooter />
      </div>
    );
  }

  // NGO / default compact layout
  if (profileVerified) {
    return (
      <div className="kyc-flow page-route">
        <div className="kyc-status-card kyc-status-card--success">
          <ShieldCheck size={28} />
          <div>
            <strong>Verified {roleLabel}</strong>
            <p>Your verification is complete. Restricted features are unlocked.</p>
            {request?.reviewed_at && (
              <p className="kyc-status-card__meta">
                Completed <RelativeTime value={request.reviewed_at} />
              </p>
            )}
          </div>
        </div>
        <PageBackLink to={dashboardPath} label="Back to Dashboard" />
      </div>
    );
  }

  if (underReview && !moreDocsRequired && !rejected && request?.status !== 'DRAFT') {
    return (
      <div className="kyc-flow page-route">
        <PageBackLink to={dashboardPath} label="Back to Dashboard" />
        <div className="kyc-status-card kyc-status-card--info">
          <Clock size={24} />
          <div>
            <strong>Verification Submitted</strong>
            <p>Current status: <span className="kyc-badge kyc-badge--info">UNDER REVIEW</span></p>
            {request?.reference_code && <p>Reference: <strong>{request.reference_code}</strong></p>}
            {request?.submitted_at && (
              <p>Submitted <RelativeTime value={request.submitted_at} /></p>
            )}
            <p>Our team will review your documents. You will be notified when the status changes.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kyc-flow page-route">
      <PageBackLink to={dashboardPath} label="Back to Dashboard" />

      <header className="kyc-flow__header">
        <div>
          <h1>{roleLabel} Verification</h1>
          <p>Verification progress: {Math.min(step, totalSteps - 1)} of {totalSteps - 1} completed</p>
        </div>
        <span className={`kyc-badge kyc-badge--${badge.tone}`}>{badge.label}</span>
      </header>

      {rejected && (
        <div className="kyc-alert kyc-alert--danger" role="alert">
          <AlertTriangle size={18} />
          <div>
            <strong>Verification needs attention</strong>
            <p>{request.rejection_reasons?.[0] || 'Please review feedback and resubmit.'}</p>
          </div>
        </div>
      )}

      {moreDocsRequired && (
        <div className="kyc-alert kyc-alert--warning" role="alert">
          <AlertTriangle size={18} />
          <div>
            <strong>Admin requested updates</strong>
            <ul className="kyc-alert__list">
              {(form.admin_field_requests || request?.payload?.admin_field_requests || [])
                .filter((r) => r.status === 'PENDING' || !r.status)
                .flatMap((r) => (r.field_paths || []).map((path) => ({ path, reason: r.reason })))
                .map((item) => (
                  <li key={item.path}>
                    <strong>{labelForKycFieldPath(item.path)}</strong>
                    {item.reason ? ` — ${item.reason}` : ''}
                  </li>
                ))}
              {(form.admin_document_requests || request?.payload?.admin_document_requests || [])
                .filter((r) => r.status === 'PENDING' || !r.status)
                .map((r) => (
                  <li key={r.document_type}>
                    <strong>{r.document_type.replace(/_/g, ' ')}</strong>
                    {r.reason ? ` — ${r.reason}` : ''}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {error && (
        <div className="kyc-alert kyc-alert--danger" role="alert">{error}</div>
      )}

      {showValidationChecklist && (
        <KycValidationChecklist errors={validationErrors} onGoToField={goToFieldStep} />
      )}

      <FlowStepPanel stepKey={currentStep.id} direction={direction} className="kyc-panel">
        <h2>{currentStep.title}</h2>
        {currentStep.hint && <p className="kyc-panel__hint">{currentStep.hint}</p>}

        {currentStep.mobileOtp && (
          <div className="kyc-mobile-otp">
            {(mobileVerified || form.mobile_verification?.verified_at) ? (
              <p className="kyc-mobile-otp__verified">
                <CheckCircle2 size={16} /> Mobile verified
              </p>
            ) : (
              <>
                <button type="button" className="rd-btn rd-btn--secondary rd-btn--sm" onClick={handleSendOtp} disabled={otpSendBusy || !getFieldValue('mobile')}>
                  {otpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
                {otpSent && (
                  <label className="kyc-field">
                    <span>Enter OTP</span>
                    <input type="text" inputMode="numeric" maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
                  </label>
                )}
                {otpSent && (
                  <button type="button" className="rd-btn rd-btn--primary rd-btn--sm" onClick={handleVerifyOtp} disabled={otpVerifyBusy || otpCode.length < 4}>
                    Verify mobile
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {currentStep.fields?.map((field) => (
          <label key={field.key} className="kyc-field">
            <span>{field.label}{field.required ? ' *' : ''}</span>
            {field.type === 'select' ? (
              <select value={getFieldValue(field.key)} onChange={(e) => patchField(field.key, e.target.value)}>
                <option value="">Select…</option>
                {(field.options || []).map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea rows={4} value={getFieldValue(field.key)} onChange={(e) => patchField(field.key, e.target.value)} />
            ) : (
              <input
                type={field.type || (field.sensitive ? 'password' : 'text')}
                value={field.sensitive && !getFieldValue(field.key) ? '' : getFieldValue(field.key)}
                onChange={(e) => patchField(field.key, e.target.value)}
              />
            )}
          </label>
        ))}

        {stepDocuments.map((doc) => (
          <DocumentUploadCard
            key={doc.type}
            requestId={request?.request_id}
            documentType={doc.type}
            label={doc.label}
            required={doc.required}
            uploaded={documentsByType[doc.type]}
            onUpdated={setRequest}
          />
        ))}

        {currentStep.review && (
          <div className="kyc-review">
            <label className="kyc-consent">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>{consentText}</span>
            </label>
          </div>
        )}
      </FlowStepPanel>

      {currentStep.review ? (
        <FlowStepFooter
          step={step}
          totalSteps={totalSteps}
          onBack={goBack}
          isLastStep
          onSubmit={handleSubmit}
          submitLabel="Submit for Verification"
          submitting={submitting}
          submitDisabled={!consent}
        />
      ) : (
        <FlowStepFooter
          step={step}
          totalSteps={totalSteps}
          onBack={goBack}
          onContinue={handleContinue}
          continueDisabled={!canContinue}
        />
      )}
    </div>
  );
}
