import { formatCurrency } from '../../../utils/donorHelpers';
import { getPaymentLabel } from '../../../data/donateMoneyConfig';
import { DONOR_PAYMENT_METHODS } from '../../../data/donorConstants';

export default function DonationSummary({ amount, purpose, payment }) {
  const paymentLabel = getPaymentLabel(payment, DONOR_PAYMENT_METHODS);

  return (
    <aside className="money-donation-summary">
      <h3 className="money-donation-summary__title">Donation Summary</h3>
      <dl className="money-donation-summary__list">
        <div>
          <dt>Amount</dt>
          <dd>{amount > 0 ? formatCurrency(amount) : '—'}</dd>
        </div>
        <div>
          <dt>Purpose</dt>
          <dd>{purpose}</dd>
        </div>
        <div>
          <dt>Payment</dt>
          <dd>{paymentLabel}</dd>
        </div>
      </dl>
    </aside>
  );
}
