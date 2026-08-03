export const UPI_APPS = [
  { id: 'gpay', label: 'Google Pay' },
  { id: 'phonepe', label: 'PhonePe' },
  { id: 'paytm', label: 'Paytm' },
  { id: 'bhim', label: 'BHIM' }
];

export const POPULAR_BANKS = [
  { id: 'sbi', label: 'SBI', short: 'SBI' },
  { id: 'hdfc', label: 'HDFC Bank', short: 'HDFC' },
  { id: 'icici', label: 'ICICI Bank', short: 'ICICI' },
  { id: 'axis', label: 'Axis Bank', short: 'Axis' },
  { id: 'kotak', label: 'Kotak Mahindra', short: 'Kotak' }
];

export const WALLET_OPTIONS = [
  { id: 'paytm', label: 'Paytm', icon: '💙' },
  { id: 'amazonpay', label: 'Amazon Pay', icon: '🟠' },
  { id: 'mobikwik', label: 'Mobikwik', icon: '🔵' },
  { id: 'freecharge', label: 'Freecharge', icon: '🟣' }
];

export function getPaymentLabel(paymentId, methods) {
  return methods.find((m) => m.id === paymentId)?.label || paymentId;
}
