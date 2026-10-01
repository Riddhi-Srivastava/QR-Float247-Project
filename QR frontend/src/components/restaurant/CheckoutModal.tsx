import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  User,
  Phone,
  CreditCard,
  Smartphone,
  Banknote,
  AlertCircle,
  Crown,
  Lock,
  Utensils,
  ArrowRight,
  ClipboardList,
  Pencil,
  Check,
} from 'lucide-react';

interface CartItem {
  cartItemId: string;
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  customization?: any;
  itemTotalPrice: number;
}

interface TableInfo {
  tableNumber: string;
  restaurantName: string;
  tagline: string;
  guestCount: number;
  serverName: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  tipAmount: number;
  includeCutlery: boolean;
  tableInfo: TableInfo;

  onPlaceOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    paymentMethod: 'counter' | 'upi' | 'card';
    specialNotes: string;
    discount: number;
  }) => void;
}

/*
 * ============================================================
 * STYLES (UI only)
 * ============================================================
 */

const checkoutCss = `
.co-overlay{
  position:fixed;inset:0;z-index:999999;
  background:rgba(20,8,4,.6);
  -webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);
  display:flex;align-items:center;justify-content:center;
  padding:16px;box-sizing:border-box;
}
.co-overlay *{box-sizing:border-box;}
.co-modal{
  --co-red:#e2231a;
  --co-red-deep:#b3140f;
  --co-amber:#ffa51f;
  --co-brown:#2b0f0a;
  --co-cream:#fdf7f1;
  --co-pink:#fde3df;
  width:100%;max-width:560px;max-height:94vh;
  background:var(--co-cream);border-radius:26px;
  box-shadow:0 30px 80px rgba(0,0,0,.5);
  display:flex;flex-direction:column;overflow:hidden;position:relative;
  color:var(--co-brown);
}

/* header */
.co-header{
  position:relative;flex-shrink:0;
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:16px 18px 16px 34px;
  background:linear-gradient(100deg,#2a0e09 0%,#4a1810 60%,#5c1f14 100%);
  color:#fff;
}
.co-strip-a,.co-strip-b{position:absolute;top:0;bottom:0;}
.co-strip-a{left:0;width:14px;background:var(--co-amber);}
.co-strip-b{left:14px;width:14px;background:var(--co-red);}
.co-title-row{display:flex;align-items:center;gap:.6rem;}
.co-title{margin:0;font-size:1.6rem;font-weight:900;line-height:1.1;letter-spacing:-.01em;}
.co-sub{margin:.25rem 0 0;font-size:.85rem;color:#f3dcd2;}
.co-close{
  width:38px;height:38px;border-radius:50%;border:0;flex-shrink:0;
  background:rgba(255,255,255,.22);color:#fff;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
}
.co-close:disabled{opacity:.5;cursor:default;}

/* body */
.co-form{display:flex;flex-direction:column;flex:1;min-height:0;}
.co-body{flex:1;min-height:0;overflow-y:auto;padding:14px 16px 6px;background:var(--co-cream);}
.co-section{margin-bottom:14px;}
.co-sec-head{display:flex;align-items:center;gap:.6rem;margin:0 0 .55rem;}
.co-sec-chip{
  width:32px;height:32px;border-radius:50%;background:var(--co-pink);color:var(--co-red);
  display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;
}
.co-sec-title{margin:0;font-size:1.05rem;font-weight:800;color:var(--co-brown);}
.co-sec-side{margin-left:auto;font-size:.82rem;color:#7a655f;}

.co-error{
  display:flex;align-items:flex-start;gap:.6rem;padding:.7rem .85rem;margin-bottom:.9rem;
  border-radius:14px;background:#fff1f1;border:1px solid #ffcaca;
  color:#c62828;font-size:.85rem;font-weight:600;
}

/* inputs */
.co-fields{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-bottom:14px;}
.co-field{
  display:flex;align-items:center;gap:.6rem;
  background:#fffaf6;border:1px solid #efdcd3;border-radius:16px;
  padding:.4rem .6rem .4rem .4rem;min-width:0;
}
.co-field-ico{
  width:36px;height:36px;border-radius:50%;background:var(--co-pink);color:var(--co-red);
  display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;
}
.co-field-body{display:flex;flex-direction:column;min-width:0;flex:1;}
.co-field-label{font-size:.68rem;color:#7a655f;line-height:1.2;}
.co-input{
  width:100%;border:0;outline:none;background:transparent;padding:0;
  font-size:.95rem;font-weight:600;color:var(--co-brown);font-family:inherit;
}
.co-input::placeholder{color:#b3a29c;font-weight:400;font-size:.85rem;}
.co-field:focus-within{border-color:var(--co-amber);box-shadow:0 0 0 3px rgba(255,165,31,.2);}

/* payment */
.co-pay-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem;}
.co-pay{
  position:relative;text-align:left;cursor:pointer;font-family:inherit;
  background:#fffaf6;border:1px solid #efdcd3;border-radius:16px;
  padding:.75rem .65rem;min-height:92px;color:var(--co-brown);
  transition:border-color .15s ease,background .15s ease;
}
.co-pay.is-on{background:#ffe9c9;border:2px solid var(--co-amber);padding:calc(.75rem - 1px) calc(.65rem - 1px);}
.co-pay:disabled{cursor:default;opacity:.7;}
.co-pay-ico{color:var(--co-red);margin-bottom:.3rem;display:block;}
.co-pay-name{font-weight:800;font-size:.95rem;}
.co-pay-desc{font-size:.7rem;color:#7a655f;margin-top:.1rem;line-height:1.25;}
.co-radio{
  position:absolute;top:.55rem;right:.55rem;width:20px;height:20px;border-radius:50%;
  border:2px solid #9b8a84;background:#fff;
}
.co-pay.is-on .co-radio{border-color:var(--co-red);background:var(--co-red);}
.co-pay.is-on .co-radio::after{
  content:"";position:absolute;inset:4px;border-radius:50%;background:#fff;
}

/* instructions */
.co-textarea{
  width:100%;min-height:76px;resize:vertical;font-family:inherit;
  background:#fffaf6;border:1px solid #efdcd3;border-radius:16px;
  padding:.7rem .85rem;font-size:.9rem;color:var(--co-brown);outline:none;
}
.co-textarea::placeholder{color:#b3a29c;}
.co-textarea:focus{border-color:var(--co-amber);box-shadow:0 0 0 3px rgba(255,165,31,.2);}
.co-cutlery{display:flex;align-items:center;gap:.6rem;margin-top:.6rem;font-size:.88rem;color:var(--co-brown);cursor:default;}
.co-check{
  width:22px;height:22px;border-radius:6px;flex-shrink:0;
  border:2px solid #b9a9a3;background:#fff;color:#fff;
  display:inline-flex;align-items:center;justify-content:center;
}
.co-check.is-on{background:var(--co-red);border-color:var(--co-red);}
.co-check-input{position:absolute;opacity:0;width:0;height:0;pointer-events:none;}

/* summary */
.co-summary{
  background:#f8efe8;border:1px solid #efdcd3;border-radius:18px;overflow:hidden;
}
.co-items{padding:.35rem .8rem 0;}
.co-item{display:flex;align-items:center;gap:.8rem;padding:.5rem 0;}
.co-item + .co-item{border-top:1px solid #e6d6cc;}
.co-thumb{
  width:52px;height:52px;border-radius:12px;object-fit:cover;flex-shrink:0;
  background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.1);
}
.co-item-info{flex:1;min-width:0;}
.co-item-name{font-weight:800;font-size:.95rem;}
.co-item-qty{font-size:.78rem;color:#7a655f;margin-top:.1rem;}
.co-item-price{font-weight:800;font-size:.95rem;white-space:nowrap;}
.co-bill{padding:.5rem .8rem .6rem;}
.co-row{display:flex;align-items:center;justify-content:space-between;gap:1rem;font-size:.88rem;color:#6b5650;padding:.15rem 0;}
.co-row strong,.co-row .co-val{color:var(--co-brown);font-weight:700;}
.co-total{
  display:flex;align-items:center;justify-content:space-between;gap:1rem;
  background:#ffe7bd;padding:.7rem .9rem;
}
.co-total-l{display:flex;align-items:center;gap:.5rem;font-size:1.05rem;font-weight:900;}
.co-total-l svg{color:var(--co-amber);}
.co-total-v{font-size:1.5rem;font-weight:900;color:var(--co-red);}

/* footer */
.co-footer{flex-shrink:0;padding:10px 16px 12px;background:var(--co-cream);}
.co-cta{
  width:100%;min-height:54px;border:0;border-radius:18px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:.6rem;position:relative;
  padding:0 60px;font-family:inherit;
  background:linear-gradient(180deg,#ee2a1f,#c5170f);color:#fff;
  font-size:1rem;font-weight:900;letter-spacing:.01em;
  box-shadow:0 8px 18px rgba(226,35,26,.35);
}
.co-cta svg.co-crown{color:#ffc43a;}
.co-cta-arrow{
  position:absolute;right:8px;top:50%;transform:translateY(-50%);
  width:38px;height:38px;border-radius:50%;background:var(--co-red-deep);
  display:flex;align-items:center;justify-content:center;
}
.co-cta:disabled{background:#cfc6c1;box-shadow:none;cursor:not-allowed;color:#fff;}
.co-cta:disabled .co-cta-arrow{background:#b3aaa5;}
.co-note{
  display:flex;align-items:center;justify-content:center;gap:.4rem;
  margin-top:.6rem;font-size:.72rem;color:#7a655f;text-align:center;
}

.co-spinner{
  width:18px;height:18px;border:2px solid rgba(255,255,255,.4);
  border-top-color:#fff;border-radius:50%;animation:checkoutSpin .8s linear infinite;
}
@keyframes checkoutSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.co-spinner{animation:none;}}

@media (max-width:520px){
  .co-fields{grid-template-columns:1fr;}
  .co-title{font-size:1.35rem;}
  .co-pay{padding:.65rem .5rem;min-height:86px;}
  .co-pay-desc{font-size:.66rem;}
  .co-cta{padding:0 52px;font-size:.92rem;}
}
`;

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  tipAmount,
  includeCutlery,
  tableInfo,
  onPlaceOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<
    'counter' | 'upi' | 'card'
  >('upi');

  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // --------------------------------------------------
  // BILL
  // --------------------------------------------------

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.itemTotalPrice || 0),
      0
    );
  }, [cartItems]);

  const tax = Math.round(subtotal * 0.05);

  // No dummy coupon
  const discount = 0;

  const grandTotal = Math.max(
    0,
    subtotal + tax + Number(tipAmount || 0) - discount
  );

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  const validateForm = () => {
    if (cartItems.length === 0) {
      setErrorMsg('Your cart is empty.');
      return false;
    }

    if (!customerName.trim()) {
      setErrorMsg('Please enter your name.');
      return false;
    }

    if (customerName.trim().length < 2) {
      setErrorMsg('Please enter a valid name.');
      return false;
    }

    if (!customerPhone.trim()) {
      setErrorMsg('Please enter your mobile number.');
      return false;
    }

    const phone = customerPhone.replace(/\D/g, '');

    if (phone.length !== 10) {
      setErrorMsg(
        'Please enter a valid 10-digit mobile number.'
      );
      return false;
    }

    setErrorMsg('');
    return true;
  };

  // --------------------------------------------------
  // PHONE
  // --------------------------------------------------

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
      .replace(/\D/g, '')
      .slice(0, 10);

    setCustomerPhone(value);
    setErrorMsg('');
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      await Promise.resolve(
        onPlaceOrder({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          paymentMethod,
          specialNotes: specialNotes.trim(),
          discount: 0,
        })
      );
    } catch (error) {
      console.error('Place order error:', error);

      setErrorMsg(
        'Unable to place your order. Please try again.'
      );

      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // CLOSED
  // --------------------------------------------------

  if (!isOpen) {
    return null;
  }

  // --------------------------------------------------
  // PAYMENT OPTIONS (visual meta only)
  // --------------------------------------------------

  const paymentOptions: {
    id: 'upi' | 'card' | 'counter';
    name: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'upi',
      name: 'UPI',
      desc: 'GPay / PhonePe / Paytm',
      icon: <Smartphone size={26} className="co-pay-ico" />,
    },
    {
      id: 'card',
      name: 'Card',
      desc: 'Debit / Credit',
      icon: <CreditCard size={26} className="co-pay-ico" />,
    },
    {
      id: 'counter',
      name: 'Counter',
      desc: 'Pay at counter',
      icon: <Banknote size={26} className="co-pay-ico" />,
    },
  ];

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return createPortal(
    <div className="co-overlay" onClick={onClose}>
      <style>{checkoutCss}</style>

      <div
        className="co-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="co-header">
          <span className="co-strip-a" />
          <span className="co-strip-b" />

         <div>
        <div className="co-title-row">
        <Crown
         size={28}
         color="#ffc43a"
        fill="#000000"
    />

    <h2
      id="checkout-title"
      className="co-title"
      style={{ color: "#db1515" }}
    >
      Checkout
    </h2>
  </div>

            <p className="co-sub">
            {tableInfo.tableNumber} ·{' '}
              {tableInfo.restaurantName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="co-close"
            aria-label="Close checkout"
          >
            <X size={22} />
          </button>
        </div>

        {/* ==========================================
            FORM
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="co-form"
        >
          {/* SCROLLABLE BODY */}

          <div className="co-body">
            {/* ERROR */}

            {errorMsg && (
              <div className="co-error">
                <AlertCircle
                  size={19}
                  style={{
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                />

                <span>{errorMsg}</span>
              </div>
            )}

            {/* ======================================
                CUSTOMER DETAILS
            ====================================== */}

            <section className="co-fields">
              {/* NAME */}

              <label className="co-field">
                <span className="co-field-ico">
                  <User size={18} />
                </span>

                <span className="co-field-body">
                  <span className="co-field-label">
                    Your Name
                  </span>

                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Enter your name"
                    required
                    disabled={isSubmitting}
                    className="co-input"
                  />
                </span>
              </label>

              {/* PHONE */}

              <label className="co-field">
                <span className="co-field-ico">
                  <Phone size={18} />
                </span>

                <span className="co-field-body">
                  <span className="co-field-label">
                    Contact Number
                  </span>

                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={handlePhoneChange}
                    placeholder="10-digit mobile number"
                    required
                    maxLength={10}
                    inputMode="numeric"
                    disabled={isSubmitting}
                    className="co-input"
                  />
                </span>
              </label>
            </section>

            {/* ======================================
                PAYMENT
            ====================================== */}

            <section className="co-section">
              <div className="co-sec-head">
                <span className="co-sec-chip">
                  <CreditCard size={17} />
                </span>

                <h3 className="co-sec-title">
                  Payment Method
                </h3>
              </div>

              <div className="co-pay-grid">
                {paymentOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setPaymentMethod(opt.id)
                    }
                    className={
                      'co-pay' +
                      (paymentMethod === opt.id
                        ? ' is-on'
                        : '')
                    }
                    aria-pressed={
                      paymentMethod === opt.id
                    }
                  >
                    <span className="co-radio" />

                    {opt.icon}

                    <div className="co-pay-name">
                      {opt.name}
                    </div>

                    <div className="co-pay-desc">
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* ======================================
                SPECIAL INSTRUCTIONS
            ====================================== */}

            <section className="co-section">
              <div className="co-sec-head">
                <span className="co-sec-chip">
                  <Pencil size={16} />
                </span>

                <h3 className="co-sec-title">
                  Special Instructions
                </h3>
              </div>

              <textarea
                value={specialNotes}
                onChange={(e) =>
                  setSpecialNotes(e.target.value)
                }
                placeholder="Any special instructions for your order?"
                rows={3}
                disabled={isSubmitting}
                className="co-textarea"
              />

              <label className="co-cutlery">
                <input
                  type="checkbox"
                  checked={includeCutlery}
                  readOnly
                  className="co-check-input"
                />

                <span
                  className={
                    'co-check' +
                    (includeCutlery ? ' is-on' : '')
                  }
                >
                  {includeCutlery && (
                    <Check size={15} strokeWidth={3.5} />
                  )}
                </span>

                <Utensils size={17} />

                <span>Include cutlery</span>
              </label>
            </section>

            {/* ======================================
                ORDER SUMMARY
            ====================================== */}

            <section className="co-section">
              <div className="co-sec-head">
                <span className="co-sec-chip">
                  <ClipboardList size={17} />
                </span>

                <h3 className="co-sec-title">
                  Order Summary
                </h3>

                <span className="co-sec-side">
                  {totalItems}{' '}
                  {totalItems === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="co-summary">
                {/* ITEMS */}

                <div className="co-items">
                  {cartItems.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="co-item"
                    >
                      <img
                        src={item.item.image}
                        alt={item.item.name}
                        className="co-thumb"
                        onError={(e) => {
                          (
                            e.currentTarget as HTMLImageElement
                          ).style.visibility = 'hidden';
                        }}
                      />

                      <div className="co-item-info">
                        <div className="co-item-name">
                          {item.item.name}
                        </div>

                        <div className="co-item-qty">
                          Qty: {item.quantity}
                        </div>
                      </div>

                      <div className="co-item-price">
                        ₹
                        {Number(
                          item.itemTotalPrice || 0
                        ).toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="co-bill">
                  {/* SUBTOTAL */}

                  <div className="co-row">
                    <span>
                      Subtotal ({totalItems}{' '}
                      {totalItems === 1
                        ? 'item'
                        : 'items'}
                      )
                    </span>

                    <strong>
                      ₹{subtotal.toFixed(0)}
                    </strong>
                  </div>

                  {/* TAX */}

                  <div className="co-row">
                    <span>GST (5%)</span>
                    <span className="co-val">
                      ₹{tax.toFixed(0)}
                    </span>
                  </div>

                  {/* TIP */}

                  {tipAmount > 0 && (
                    <div className="co-row">
                      <span>Tip</span>
                      <span className="co-val">
                        ₹{Number(tipAmount).toFixed(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* TOTAL */}

                <div className="co-total">
                  <span className="co-total-l">
                    <Crown
                      size={26}
                      fill="#ffa51f"
                    />

                    Grand Total
                  </span>

                  <span className="co-total-v">
                    ₹{grandTotal.toFixed(0)}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* ==========================================
              FOOTER
          ========================================== */}

          <div className="co-footer">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                cartItems.length === 0
              }
              className="co-cta"
            >
              {isSubmitting ? (
                <>
                  <span className="co-spinner" />

                  Placing Order...
                </>
              ) : (
                <>
                  <Crown
                    size={24}
                    fill="#ffc43a"
                    className="co-crown"
                  />

                  <span>
                    PLACE ORDER · ₹
                    {grandTotal.toFixed(0)}
                  </span>

                  <span className="co-cta-arrow">
                    <ArrowRight size={22} />
                  </span>
                </>
              )}
            </button>

            <div className="co-note">
              <Lock size={14} />

              <span>
                By placing this order, you confirm
                that the order details are correct.
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CheckoutModal;