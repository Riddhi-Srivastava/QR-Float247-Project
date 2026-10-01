import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Receipt
} from 'lucide-react';
import { CartItem } from '../../types/restaurant';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onIncrement: (cartItemId: string) => void;
  onDecrement: (cartItemId: string) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: (tipAmount: number, includeCutlery: boolean) => void;
  tableNumber: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onIncrement,
  onDecrement,
  onRemoveItem,
  onProceedToCheckout,
  tableNumber
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.itemTotalPrice, 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + tax;
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const formatCurrency = (amount: number) => `₹${Math.round(amount)}`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="cart-drawer-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="cart-icon-circle">
              <span style={{ fontSize: '1.25rem' }}>🍔</span>
            </div>
            <div>
              <h2 id="cart-drawer-title" className="drawer-title">Your King Tray</h2>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                {tableNumber} • {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <button type="button" className="icon-btn-small" onClick={onClose} aria-label="Close tray">
            <X size={18} />
          </button>
        </div>

        {/* Empty State vs Item List */}
        {cartItems.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '3rem' }}>🍟</span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Your tray is empty!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pick a flame-grilled Whopper, crispy fries or thick shakes to get started.</p>
            <button type="button" className="btn btn-primary" onClick={onClose} style={{ marginTop: '0.5rem' }}>
              Explore King Menu
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable Items Container */}
            <div className="cart-items-scroll">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {cartItems.map((cartItem) => (
                  <div key={cartItem.cartItemId} className="cart-item-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.65rem', flex: 1 }}>
                        <div className={`dietary-box ${cartItem.item.dietary === 'veg' || cartItem.item.dietary === 'vegan' ? 'dietary-veg' : 'dietary-nonveg'}`} style={{ marginTop: '3px' }}>
                          <span className="dietary-circle"></span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4 className="cart-item-name">{cartItem.item.name}</h4>
                            <button 
                              type="button"
                              onClick={() => onRemoveItem(cartItem.cartItemId)}
                              style={{ color: 'var(--text-muted)', padding: '2px' }}
                              aria-label={`Remove ${cartItem.item.name}`}
                              title="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Customization Pills */}
                          {(cartItem.customization.selectedVariant || cartItem.customization.selectedAddons.length > 0) && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBlock: '4px' }}>
                              {cartItem.customization.selectedVariant && (
                                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                                  {cartItem.customization.selectedVariant.name}
                                </span>
                              )}
                              {cartItem.customization.selectedAddons.map(a => (
                                <span key={a.id} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                                  + {a.name} ({formatCurrency(a.price)})
                                </span>
                              ))}
                            </div>
                          )}

                          {cartItem.customization.specialInstructions && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--bk-yellow)', fontStyle: 'italic', marginTop: '2px' }}>
                              Note: "{cartItem.customization.specialInstructions}"
                            </div>
                          )}

                          <div className="cart-item-price">
                            {formatCurrency(cartItem.itemTotalPrice)}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: 'var(--bg-secondary)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
                        <button 
                          type="button"
                          className="stepper-btn" 
                          onClick={() => onDecrement(cartItem.cartItemId)}
                          aria-label="Decrease quantity"
                        >
                          {cartItem.quantity === 1 ? <Trash2 size={13} color="var(--bk-red)" /> : <Minus size={13} />}
                        </button>
                        <span style={{ fontWeight: 800, fontSize: '0.9rem', minWidth: '1.25rem', textAlign: 'center' }}>{cartItem.quantity}</span>
                        <button 
                          type="button"
                          className="stepper-btn" 
                          onClick={() => onIncrement(cartItem.cartItemId)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="bill-summary-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', fontWeight: 800 }}>
                  <Receipt size={16} />
                  <span>Payment Summary</span>
                </div>

                <div className="bill-row">
                  <span>Item Subtotal</span>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(subtotal)}</span>
                </div>
                <div className="bill-row">
                  <span>Taxes (GST 5%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="bill-divider"></div>
                <div className="bill-row grand-total">
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--bk-flame)' }}>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Bottom Order Action */}
            <div className="drawer-footer">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    TOTAL
                  </span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--bk-flame)' }}>
                    {formatCurrency(total)}
                  </div>
                </div>

                <button 
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onProceedToCheckout(0, true)}
                  style={{ flex: 1, marginLeft: '1.25rem', padding: '0.9rem 1.5rem' }}
                >
                  <span>Proceed to Order</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
