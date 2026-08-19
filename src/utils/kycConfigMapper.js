import { RECEIVER_KYC_STEPS, getPurposeDocuments, KYC_CONSENT_TEXT } from '../data/kycConfig';

function mapOptions(options = []) {
  return (options || []).map((opt) => ({
    id: opt.id || opt.code,
    label: opt.label || opt.name,
  }));
}

function mapDocuments(docs = []) {
  return (docs || []).map((doc) => ({
    type: doc.type,
    label: doc.label,
    required: Boolean(doc.required),
    required_when: doc.required_when || null,
  }));
}

function mapFields(fields = []) {
  return (fields || []).map((field) => ({
    ...field,
    options: field.options ? mapOptions(field.options) : undefined,
  }));
}

export function buildKycStepsFromConfig(config) {
  if (!config?.wizard_steps?.length) {
    return RECEIVER_KYC_STEPS;
  }
  return config.wizard_steps
    .filter((step) => step.id !== 'intro')
    .map((step) => ({
      id: step.id,
      title: step.title,
      hint: step.hint,
      fields: step.mobile_otp ? [] : mapFields(step.fields),
      documents: mapDocuments(step.documents),
      mobileOtp: step.mobile_otp,
      dynamicDocuments: step.dynamic_documents,
      dynamicDocumentsSource: step.dynamic_documents_source,
      review: step.review,
    }));
}

export function getKycPurposeDocumentsFromConfig(config, purposeCode) {
  if (!config?.purposes?.length) {
    return getPurposeDocuments(purposeCode);
  }
  const purpose = config.purposes.find((p) => p.code === purposeCode)
    || config.purposes.find((p) => p.code === 'OTHER');
  if (!purpose) return getPurposeDocuments(purposeCode);
  return [
    ...(purpose.required_documents || []).map((d) => ({ ...d, required: true })),
    ...(purpose.optional_documents || []).map((d) => ({ ...d, required: false })),
  ];
}

export function getKycConsentText(config) {
  return config?.consent_text || KYC_CONSENT_TEXT;
}

export function isDocumentRequired(doc, form) {
  if (!doc) return false;
  if (doc.required_when) {
    const { field, values, exclude_values: excludeValues } = doc.required_when;
    const [section, key] = (field || '').split('.');
    const actual = form?.[section]?.[key];
    if (values?.length) return values.includes(actual);
    if (excludeValues?.length) return actual && !excludeValues.includes(actual);
    return Boolean(actual);
  }
  return Boolean(doc.required);
}

export function resolveStepDocuments(step, { form, config }) {
  if (step?.dynamicDocuments) {
    const purpose = form?.assistance?.category || form?.supporting?.assistance_purpose;
    return getKycPurposeDocumentsFromConfig(config, purpose);
  }
  return (step?.documents || []).map((doc) => ({
    ...doc,
    required: isDocumentRequired(doc, form),
  }));
}
