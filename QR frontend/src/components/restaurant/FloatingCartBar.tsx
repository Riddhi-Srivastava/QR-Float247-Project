import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CartItem } from '../../types/restaurant';

interface FloatingCartBarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  cartItems,
  onOpenCart
}) => {
  if (cartItems.length === 0) return null;

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.itemTotalPrice, 0);

  return (
    <div className="floating-cart-wrapper">
      <div className="container" style={{ maxWidth: '580px' }}>
        <div className="floating-cart-bar" onClick={onOpenCart}>
          <div className="floating-cart-info">
            <div className="cart-badge-circle">
              <span style={{ fontSize: '1.2rem' }}>🍽️</span>
              <span className="cart-badge-num">{totalQuantity}</span>
            </div>
            <div>
              <div className="floating-cart-items">
                {totalQuantity} {totalQuantity === 1 ? 'Item' : 'Items'} in Tray
              </div>
              <div className="floating-cart-price">
                ₹{subtotal}
              </div>
            </div>
          </div>

          <div className="floating-cart-cta">
            <span>View Tray</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};
