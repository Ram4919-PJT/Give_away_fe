import UPIPayment from './UPIPayment';
import CardPayment from './CardPayment';
import NetBankingPayment from './NetBankingPayment';
import WalletPayment from './WalletPayment';

export default function PaymentModule({ payment, amount, onPay, disabled }) {
  const props = { amount, onPay, disabled };

  switch (payment) {
    case 'upi':
      return <UPIPayment {...props} />;
    case 'card':
      return <CardPayment {...props} />;
    case 'netbanking':
      return <NetBankingPayment {...props} />;
    case 'wallet':
      return <WalletPayment {...props} />;
    default:
      return null;
  }
}
