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

/* ============================================================
   FLOAT247 CHECKOUT UI
   UI ONLY — NO BUSINESS LOGIC CHANGED
============================================================ */

const checkoutCss = `
  .co-overlay,
  .co-overlay * {
    box-sizing: border-box;
  }

  .co-overlay {
    position: fixed;
    inset: 0;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 18px;

    background:
      radial-gradient(
        circle at 50% 15%,
        rgba(255, 36, 87, 0.10),
        transparent 34%
      ),
      rgba(15, 15, 18, 0.48);

    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);

    animation: coOverlayIn 0.2s ease-out;
  }

  /* ==========================================================
     MODAL
  ========================================================== */

  .co-modal {
    --co-pink: #FF2457;
    --co-pink-light: #FF4F78;
    --co-pink-dark: #E91E4D;
    --co-soft: #FFE7ED;

    --co-bg: #F5F6FA;
    --co-card: #FFFFFF;

    --co-text: #1F1F1F;
    --co-body: #555555;
    --co-muted: #8A8A8A;

    --co-border: #E7E7EB;

    --co-success: #22A06B;
    --co-danger: #E53935;

    width: min(560px, calc(100vw - 36px));
    height: fit-content;
    min-height: 520px;
    max-height: calc(100dvh - 36px);

    display: flex;
    flex-direction: column;

    overflow: hidden;

    background: var(--co-bg);
    color: var(--co-text);

    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: 26px;

    box-shadow:
      0 30px 90px rgba(0, 0, 0, 0.25),
      0 8px 30px rgba(0, 0, 0, 0.10);

    font-family:
      -apple-system,
      BlinkMacSystemFont,
      "SF Pro Display",
      "SF Pro Text",
      Inter,
      "Segoe UI",
      Roboto,
      sans-serif;

    -webkit-font-smoothing: antialiased;

    animation:
      coModalIn
      0.32s
      cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* ==========================================================
     HEADER
  ========================================================== */

  .co-header {
    position: relative;
    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;

    padding: 20px 20px 17px;

    background: #FFFFFF;

    border-bottom: 1px solid var(--co-border);
  }

  .co-header::before {
    content: "";
    position: absolute;

    left: 0;
    top: 0;

    width: 100%;
    height: 3px;

    background:
      linear-gradient(
        90deg,
        var(--co-pink),
        var(--co-pink-light),
        var(--co-pink)
      );
  }

  .co-header-main {
    min-width: 0;
  }

  .co-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .co-title-icon {
    width: 38px;
    height: 38px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 12px;

    background: var(--co-soft);
    color: var(--co-pink);
  }

  .co-title {
    margin: 0;

    color: var(--co-text);

    font-size: 1.42rem;
    font-weight: 800;
    line-height: 1.1;

    letter-spacing: -0.035em;
  }

  .co-sub {
    margin: 7px 0 0 48px;

    color: var(--co-muted);

    font-size: 0.82rem;
    font-weight: 500;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .co-close {
    width: 38px;
    height: 38px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    border: 1px solid var(--co-border);
    border-radius: 12px;

    background: #FFFFFF;
    color: var(--co-body);

    cursor: pointer;

    transition:
      background 0.18s ease,
      color 0.18s ease,
      border-color 0.18s ease,
      transform 0.18s ease;
  }

  .co-close:hover {
    color: var(--co-pink);
    background: var(--co-soft);
    border-color: rgba(255, 36, 87, 0.25);
  }

  .co-close:active {
    transform: scale(0.94);
  }

  .co-close:disabled {
    opacity: 0.45;
    cursor: default;
  }

  /* ==========================================================
     FORM / BODY
  ========================================================== */

  .co-form {
    display: flex;
    flex-direction: column;

    flex: 1;
    min-height: 0;
  }

  .co-body {
    flex: 1;
    min-height: 0;

    overflow-y: auto;
    overscroll-behavior: contain;

    padding: 18px 18px 8px;

    background: var(--co-bg);

    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }

  .co-body::-webkit-scrollbar {
    width: 5px;
  }

  .co-body::-webkit-scrollbar-track {
    background: transparent;
  }

  .co-body::-webkit-scrollbar-thumb {
    background: #D9D9DF;
    border-radius: 999px;
  }

  .co-section {
    margin-bottom: 18px;
  }

  /* ==========================================================
     SECTION HEAD
  ========================================================== */

  .co-sec-head {
    display: flex;
    align-items: center;
    gap: 9px;

    margin: 0 0 10px 2px;
  }

  .co-sec-chip {
    width: 32px;
    height: 32px;

    flex-shrink: 0;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    border-radius: 10px;

    background: var(--co-soft);
    color: var(--co-pink);

    border: 1px solid rgba(255, 36, 87, 0.08);
  }

  .co-sec-title {
    margin: 0;

    color: var(--co-text);

    font-size: 0.96rem;
    font-weight: 750;

    letter-spacing: -0.01em;
  }

  .co-sec-side {
    margin-left: auto;

    color: var(--co-muted);

    font-size: 0.78rem;
    font-weight: 600;
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  .co-error {
    display: flex;
    align-items: flex-start;
    gap: 9px;

    padding: 11px 13px;
    margin-bottom: 14px;

    border: 1px solid rgba(229, 57, 53, 0.18);
    border-radius: 12px;

    background: #FFF4F3;
    color: var(--co-danger);

    font-size: 0.82rem;
    font-weight: 600;
    line-height: 1.4;
  }

  /* ==========================================================
     CUSTOMER FIELDS
  ========================================================== */

  .co-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;

    gap: 10px;

    margin-bottom: 18px;
  }

  .co-field {
    min-width: 0;

    display: flex;
    align-items: center;
    gap: 10px;

    padding: 9px 12px 9px 9px;

    background: #FFFFFF;

    border: 1px solid var(--co-border);
    border-radius: 14px;

    box-shadow:
      0 2px 7px rgba(0, 0, 0, 0.035);

    transition:
      border-color 0.18s ease,
      box-shadow 0.18s ease;
  }

  .co-field:focus-within {
    border-color: var(--co-pink);

    box-shadow:
      0 0 0 4px rgba(255, 36, 87, 0.09),
      0 3px 10px rgba(0, 0, 0, 0.04);
  }

  .co-field-ico {
    width: 36px;
    height: 36px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 11px;

    background: var(--co-soft);
    color: var(--co-pink);
  }

  .co-field-body {
    min-width: 0;
    flex: 1;

    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .co-field-label {
    color: var(--co-muted);

    font-size: 0.66rem;
    font-weight: 600;
    line-height: 1;
  }

  .co-input {
    width: 100%;

    border: 0;
    outline: none;

    padding: 0;

    background: transparent;

    color: var(--co-text);

    font-family: inherit;
    font-size: 0.91rem;
    font-weight: 650;
  }

  .co-input::placeholder {
    color: #A8A8AE;

    font-size: 0.82rem;
    font-weight: 450;
  }

  .co-input:focus-visible {
    outline: none;
  }

  /* ==========================================================
     PAYMENT
  ========================================================== */

  .co-pay-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 9px;
  }

  .co-pay {
    position: relative;

    min-height: 92px;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    padding: 13px 12px;

    border: 1px solid var(--co-border);
    border-radius: 15px;

    background: #FFFFFF;
    color: var(--co-text);

    font-family: inherit;

    text-align: left;

    cursor: pointer;

    box-shadow:
      0 2px 7px rgba(0, 0, 0, 0.035);

    transition:
      border-color 0.18s ease,
      background 0.18s ease,
      box-shadow 0.18s ease,
      transform 0.12s ease;
  }

  .co-pay:hover:not(:disabled) {
    border-color: rgba(255, 36, 87, 0.35);

    box-shadow:
      0 5px 14px rgba(255, 36, 87, 0.08);
  }

  .co-pay:active:not(:disabled) {
    transform: scale(0.975);
  }

  .co-pay.is-on {
    background: var(--co-soft);

    border: 1.5px solid var(--co-pink);

    box-shadow:
      0 6px 16px rgba(255, 36, 87, 0.13);
  }

  .co-pay:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .co-pay-ico {
    margin-bottom: 7px;

    color: var(--co-pink);
  }

  .co-pay-name {
    color: var(--co-text);

    font-size: 0.9rem;
    font-weight: 750;
  }

  .co-pay-desc {
    margin-top: 3px;

    color: var(--co-muted);

    font-size: 0.68rem;
    font-weight: 500;
    line-height: 1.25;
  }

  .co-radio {
    position: absolute;

    top: 10px;
    right: 10px;

    width: 17px;
    height: 17px;

    border: 1.5px solid #CFCFD5;
    border-radius: 50%;

    background: #FFFFFF;

    transition:
      background 0.18s ease,
      border-color 0.18s ease;
  }

  .co-pay.is-on .co-radio {
    border-color: var(--co-pink);
    background: var(--co-pink);
  }

  .co-pay.is-on .co-radio::after {
    content: "";

    position: absolute;
    inset: 4px;

    border-radius: 50%;

    background: #FFFFFF;
  }

  /* ==========================================================
     TEXTAREA
  ========================================================== */

  .co-textarea {
    width: 100%;
    min-height: 84px;

    resize: vertical;

    padding: 12px 13px;

    border: 1px solid var(--co-border);
    border-radius: 14px;

    outline: none;

    background: #FFFFFF;
    color: var(--co-text);

    font-family: inherit;
    font-size: 0.88rem;
    line-height: 1.5;

    box-shadow:
      0 2px 7px rgba(0, 0, 0, 0.035);

    transition:
      border-color 0.18s ease,
      box-shadow 0.18s ease;
  }

  .co-textarea::placeholder {
    color: #A8A8AE;
  }

  .co-textarea:focus {
    border-color: var(--co-pink);

    box-shadow:
      0 0 0 4px rgba(255, 36, 87, 0.09);
  }

  /* ==========================================================
     CUTLERY
  ========================================================== */

  .co-cutlery {
    display: flex;
    align-items: center;
    gap: 9px;

    margin-top: 11px;
    padding: 0 3px;

    color: var(--co-body);

    font-size: 0.84rem;
    font-weight: 600;

    cursor: default;
  }

  .co-check {
    width: 21px;
    height: 21px;

    flex-shrink: 0;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    border: 1.5px solid #D3D3D8;
    border-radius: 7px;

    background: #FFFFFF;
    color: #FFFFFF;

    transition:
      background 0.18s ease,
      border-color 0.18s ease;
  }

  .co-check.is-on {
    border-color: var(--co-pink);
    background: var(--co-pink);
  }

  .co-check-input {
    position: absolute;

    opacity: 0;

    width: 0;
    height: 0;

    pointer-events: none;
  }

  .co-cutlery > svg {
    color: var(--co-pink);
  }

  /* ==========================================================
     ORDER SUMMARY
  ========================================================== */

  .co-summary {
    overflow: hidden;

    background: #FFFFFF;

    border: 1px solid var(--co-border);
    border-radius: 17px;

    box-shadow:
      0 3px 12px rgba(0, 0, 0, 0.045);
  }

  .co-items {
    padding: 4px 13px 0;
  }

  .co-item {
    display: flex;
    align-items: center;
    gap: 11px;

    padding: 10px 0;
  }

  .co-item + .co-item {
    border-top: 1px solid var(--co-border);
  }

  .co-thumb {
    width: 52px;
    height: 52px;

    flex-shrink: 0;

    object-fit: cover;

    border-radius: 12px;

    background: var(--co-soft);
  }

  .co-item-info {
    min-width: 0;
    flex: 1;
  }

  .co-item-name {
    overflow: hidden;

    color: var(--co-text);

    font-size: 0.88rem;
    font-weight: 700;

    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .co-item-qty {
    margin-top: 4px;

    color: var(--co-muted);

    font-size: 0.74rem;
    font-weight: 500;
  }

  .co-item-price {
    color: var(--co-text);

    font-size: 0.9rem;
    font-weight: 750;

    white-space: nowrap;
  }

  .co-bill {
    padding: 9px 13px 10px;

    border-top: 1px solid var(--co-border);
  }

  .co-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    padding: 4px 0;

    color: var(--co-muted);

    font-size: 0.8rem;
    font-weight: 500;
  }

  .co-row strong,
  .co-row .co-val {
    color: var(--co-body);
    font-weight: 650;
  }

  .co-total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;

    padding: 13px 14px;

    background:
      linear-gradient(
        135deg,
        #FFE7ED,
        #FFF2F5
      );

    border-top: 1px solid rgba(255, 36, 87, 0.08);
  }

  .co-total-l {
    display: flex;
    align-items: center;
    gap: 8px;

    color: var(--co-text);

    font-size: 0.94rem;
    font-weight: 800;
  }

  .co-total-l svg {
    color: var(--co-pink);
  }

  .co-total-v {
    color: var(--co-pink);

    font-size: 1.42rem;
    font-weight: 850;

    letter-spacing: -0.035em;
  }

  /* ==========================================================
     FOOTER
  ========================================================== */

  .co-footer {
    flex-shrink: 0;

    padding: 12px 18px 15px;

    background: rgba(255, 255, 255, 0.96);

    border-top: 1px solid var(--co-border);

    box-shadow:
      0 -4px 16px rgba(0, 0, 0, 0.035);

    -webkit-backdrop-filter: blur(16px);
    backdrop-filter: blur(16px);
  }

  .co-cta {
    position: relative;

    width: 100%;
    min-height: 55px;

    display: flex;
    align-items: center;
    justify-content: center;

    gap: 9px;

    padding: 0 58px 0 18px;

    border: 0;
    border-radius: 14px;

    background:
      linear-gradient(
        135deg,
        #FF2457 0%,
        #FF3F6C 55%,
        #FF4F78 100%
      );

    color: #FFFFFF;

    font-family: inherit;

    font-size: 0.93rem;
    font-weight: 800;

    letter-spacing: 0.01em;

    cursor: pointer;

    box-shadow:
      0 10px 24px rgba(255, 36, 87, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.28);

    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .co-cta:hover:not(:disabled) {
    transform: translateY(-1px);

    box-shadow:
      0 13px 28px rgba(255, 36, 87, 0.30),
      inset 0 1px 0 rgba(255, 255, 255, 0.28);
  }

  .co-cta:active:not(:disabled) {
    transform: scale(0.985);
  }

  .co-cta:disabled {
    background: #D9D9DE;

    box-shadow: none;

    color: #FFFFFF;

    cursor: not-allowed;
  }

  .co-crown {
    flex-shrink: 0;
  }

  .co-cta-arrow {
    position: absolute;

    right: 8px;
    top: 50%;

    transform: translateY(-50%);

    width: 39px;
    height: 39px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 11px;

    background: rgba(255, 255, 255, 0.20);
  }

  .co-cta:disabled .co-cta-arrow {
    background: rgba(255, 255, 255, 0.22);
  }

  .co-note {
    display: flex;
    align-items: center;
    justify-content: center;

    gap: 5px;

    margin-top: 8px;

    color: var(--co-muted);

    font-size: 0.68rem;
    font-weight: 500;

    text-align: center;
  }

  /* ==========================================================
     SPINNER
  ========================================================== */

  .co-spinner {
    width: 18px;
    height: 18px;

    flex-shrink: 0;

    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #FFFFFF;

    border-radius: 50%;

    animation:
      checkoutSpin
      0.75s
      linear
      infinite;
  }

  /* ==========================================================
     FOCUS
  ========================================================== */

  .co-pay:focus-visible,
  .co-cta:focus-visible,
  .co-close:focus-visible,
  .co-input:focus-visible,
  .co-textarea:focus-visible {
    outline: 2px solid var(--co-pink);
    outline-offset: 2px;
  }

  /* ==========================================================
     ANIMATION
  ========================================================== */

  @keyframes checkoutSpin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  @keyframes coOverlayIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes coModalIn {
    from {
      opacity: 0;
      transform:
        translateY(18px)
        scale(0.985);
    }

    to {
      opacity: 1;
      transform:
        translateY(0)
        scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .co-spinner,
    .co-modal,
    .co-overlay {
      animation: none;
    }
  }

  /* ==========================================================
     MOBILE
  ========================================================== */

  @media (max-width: 520px) {
    .co-overlay {
      align-items: flex-end;
      padding: 0;
    }

    .co-modal {
      width: 100%;
      max-width: none;

      min-height: 0;

      max-height:
        calc(
          94dvh -
          env(safe-area-inset-top, 0px)
        );

      border-radius: 24px 24px 0 0;
    }

    .co-modal::before {
      content: "";

      position: absolute;

      top: 7px;
      left: 50%;

      transform: translateX(-50%);

      width: 38px;
      height: 4px;

      border-radius: 999px;

      background: #D7D7DC;

      z-index: 5;
    }

    .co-header {
      padding:
        22px
        16px
        15px;
    }

    .co-title {
      font-size: 1.28rem;
    }

    .co-title-icon {
      width: 36px;
      height: 36px;
    }

    .co-sub {
      margin-left: 46px;

      font-size: 0.77rem;
    }

    .co-body {
      padding:
        15px
        15px
        6px;
    }

    .co-fields {
      grid-template-columns: 1fr;
      gap: 9px;
    }

    .co-pay-grid {
      gap: 7px;
    }

    .co-pay {
      min-height: 88px;
      padding: 11px 9px;
    }

    .co-pay.is-on {
      padding: 10px 8px;
    }

    .co-pay-name {
      font-size: 0.83rem;
    }

    .co-pay-desc {
      font-size: 0.62rem;
    }

    .co-footer {
      padding:
        11px
        15px
        calc(
          13px +
          env(safe-area-inset-bottom, 0px)
        );
    }

    .co-cta {
      min-height: 53px;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 360px) {
    .co-pay-grid {
      grid-template-columns: 1fr;
    }

    .co-pay {
      min-height: 72px;
    }

    .co-pay-ico {
      margin-bottom: 3px;
    }
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

  /* ==========================================================
     BILL
  ========================================================== */

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

  /* ==========================================================
     VALIDATION
  ========================================================== */

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

  /* ==========================================================
     PHONE
  ========================================================== */

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
      .replace(/\D/g, '')
      .slice(0, 10);

    setCustomerPhone(value);
    setErrorMsg('');
  };

  /* ==========================================================
     SUBMIT
  ========================================================== */

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

  /* ==========================================================
     CLOSED
  ========================================================== */

  if (!isOpen) {
    return null;
  }

  /* ==========================================================
     PAYMENT OPTIONS
  ========================================================== */

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
        icon: (
          <Smartphone
            size={24}
            className="co-pay-ico"
          />
        ),
      },
      {
        id: 'card',
        name: 'Card',
        desc: 'Debit / Credit',
        icon: (
          <CreditCard
            size={24}
            className="co-pay-ico"
          />
        ),
      },
      {
        id: 'counter',
        name: 'Counter',
        desc: 'Pay at counter',
        icon: (
          <Banknote
            size={24}
            className="co-pay-ico"
          />
        ),
      },
    ];

  /* ==========================================================
     RENDER
  ========================================================== */

  return createPortal(
    <div
      className="co-overlay"
      onClick={onClose}
    >
      <style>{checkoutCss}</style>

      <div
        className="co-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="co-header">
          <div className="co-header-main">
            <div className="co-title-row">
              <span className="co-title-icon">
                <Crown
                  size={20}
                  fill="#FF2457"
                  strokeWidth={2.2}
                />
              </span>

              <h2
                id="checkout-title"
                className="co-title"
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
            <X size={19} />
          </button>
        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="co-form"
        >
          <div className="co-body">
            {/* ERROR */}

            {errorMsg && (
              <div className="co-error">
                <AlertCircle
                  size={18}
                  style={{
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                />

                <span>{errorMsg}</span>
              </div>
            )}

            {/* ==================================================
                CUSTOMER DETAILS
            ================================================== */}

            <section className="co-fields">
              {/* NAME */}

              <label className="co-field">
                <span className="co-field-ico">
                  <User size={17} />
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
                  <Phone size={17} />
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

            {/* ==================================================
                PAYMENT
            ================================================== */}

            <section className="co-section">
              <div className="co-sec-head">
                <span className="co-sec-chip">
                  <CreditCard size={16} />
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

            {/* ==================================================
                SPECIAL INSTRUCTIONS
            ================================================== */}

            <section className="co-section">
              <div className="co-sec-head">
                <span className="co-sec-chip">
                  <Pencil size={15} />
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
                    (includeCutlery
                      ? ' is-on'
                      : '')
                  }
                >
                  {includeCutlery && (
                    <Check
                      size={13}
                      strokeWidth={3.5}
                    />
                  )}
                </span>

                <Utensils size={16} />

                <span>Include cutlery</span>
              </label>
            </section>

            {/* ==================================================
                ORDER SUMMARY
            ================================================== */}

            <section className="co-section">
              <div className="co-sec-head">
                <span className="co-sec-chip">
                  <ClipboardList size={16} />
                </span>

                <h3 className="co-sec-title">
                  Order Summary
                </h3>

                <span className="co-sec-side">
                  {totalItems}{' '}
                  {totalItems === 1
                    ? 'item'
                    : 'items'}
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

                {/* BILL */}

                <div className="co-bill">
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

                  <div className="co-row">
                    <span>GST (5%)</span>

                    <span className="co-val">
                      ₹{tax.toFixed(0)}
                    </span>
                  </div>

                  {tipAmount > 0 && (
                    <div className="co-row">
                      <span>Tip</span>

                      <span className="co-val">
                        ₹
                        {Number(
                          tipAmount
                        ).toFixed(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* TOTAL */}

                <div className="co-total">
                  <span className="co-total-l">
                    <Crown
                      size={20}
                      fill="#FFB8C8"
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

          {/* ===================================================
              FOOTER
          =================================================== */}

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
                    size={20}
                    fill="rgba(255,255,255,0.35)"
                    className="co-crown"
                  />

                  <span>
                    PLACE ORDER · ₹
                    {grandTotal.toFixed(0)}
                  </span>

                  <span className="co-cta-arrow">
                    <ArrowRight size={21} />
                  </span>
                </>
              )}
            </button>

            <div className="co-note">
              <Lock size={13} />

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