export default function CheckoutLayout({ isCheckout, children }) {
  return (
    <div className={`money-checkout-shell ${isCheckout ? 'money-checkout-shell--split' : 'money-checkout-shell--centered'}`}>
      {children}
    </div>
  );
}

export function CheckoutLeft({ isCheckout, children }) {
  return (
    <div className={`money-checkout-left ${isCheckout ? 'money-checkout-left--dock' : ''}`}>
      <div className={`money-checkout-card ${isCheckout ? 'money-checkout-card--compact' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export function CheckoutRight({ paymentKey, children }) {
  return (
    <div className="money-checkout-right" key={paymentKey}>
      <div className="money-checkout-right__inner money-checkout-right__inner--animate">
        {children}
      </div>
    </div>
  );
}
