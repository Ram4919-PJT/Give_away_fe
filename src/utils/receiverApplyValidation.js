import {
  MIN_PURPOSE_LENGTH,
  MAX_PURPOSE_LENGTH,
  VAGUE_PURPOSE_PATTERNS,
  ALLOWED_DOC_TYPES,
  MAX_DOC_BYTES,
} from '../data/receiverApplyConfig';
import { categoryRequiresUploadedDocuments } from '../data/assistanceCategoryUi';

export function validatePurposeCategory(categoryId) {
  if (!categoryId) return 'Please select a purpose category.';
  return null;
}

export function validateSpecificPurpose(text) {
  const value = String(text || '').trim();
  if (!value) return 'Please describe the exact purpose for the requested funds.';
  if (value.length < MIN_PURPOSE_LENGTH) {
    return `Please provide at least ${MIN_PURPOSE_LENGTH} characters explaining your specific need.`;
  }
  if (value.length > MAX_PURPOSE_LENGTH) {
    return `Purpose must be ${MAX_PURPOSE_LENGTH} characters or fewer.`;
  }
  if (VAGUE_PURPOSE_PATTERNS.some((pattern) => pattern.test(value))) {
    return 'Please be specific about how the funds will be used.';
  }
  return null;
}

export function validateAmount(amount, limits = null) {
  const raw = String(amount || '').replace(/[^\d.]/g, '');
  const num = Number(raw);
  if (!raw || Number.isNaN(num) || num <= 0) {
    return 'Enter a valid amount greater than ₹0.';
  }
  const min = limits?.min_amount;
  const max = limits?.max_amount;
  if (min != null && num < Number(min)) {
    return `Minimum request amount is ₹${Number(min).toLocaleString('en-IN')}.`;
  }
  if (max != null && num > Number(max)) {
    return `Maximum request amount is ₹${Number(max).toLocaleString('en-IN')}.`;
  }
  return null;
}

export function validateExpenseBreakdown(breakdown, amount) {
  const text = String(breakdown || '').trim();
  if (!text) return 'Please provide an expense breakdown.';
  if (text.length < 10) return 'Please add more detail to your expense breakdown.';
  const amountNum = Number(String(amount || '').replace(/[^\d.]/g, ''));
  if (!Number.isNaN(amountNum) && amountNum > 0) {
    const numbers = [...text.matchAll(/₹?\s*([0-9][0-9,]*(?:\.[0-9]+)?)/g)]
      .map((m) => Number(String(m[1]).replace(/,/g, '')))
      .filter((n) => !Number.isNaN(n));
    if (numbers.length > 0) {
      const sum = numbers.reduce((s, n) => s + n, 0);
      if (sum > amountNum * 1.05) {
        return 'Expense breakdown total should not exceed the requested amount.';
      }
    }
  }
  return null;
}

export function validateDocumentFile(file) {
  if (!file) return 'A document is required for this category.';
  if (!ALLOWED_DOC_TYPES.includes(file.type)) {
    return 'Only PDF, JPG, and PNG files are allowed.';
  }
  if (file.size > MAX_DOC_BYTES) {
    return 'Each file must be 5MB or smaller.';
  }
  return null;
}

export function documentsRequiredForCategory(categoryConfig) {
  return categoryRequiresUploadedDocuments(categoryConfig);
}
