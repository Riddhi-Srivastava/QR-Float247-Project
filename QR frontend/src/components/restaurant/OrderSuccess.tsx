import React from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Flame
} from 'lucide-react';
import { Order } from '../../types/restaurant';

interface OrderSuccessProps {
  order: Order;
  onTrackOrder: () => void;
  onBackToMenu: () => void;
}

export const OrderSuccess: React.FC<OrderSuccessProps> = ({
  order,
  onTrackOrder,
  onBackToMenu
}) => {
  return (
    <div
      className="section"
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className="container" style={{ maxWidth: '520px' }}>
        <div
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: '2.5rem 1.5rem',
            border: '2px solid var(--border-strong)',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          <div className="success-icon-bubble">
            <CheckCircle2 size={44} color="var(--bk-green)" />
          </div>

          <div
            className="badge"
            style={{ marginInline: 'auto', marginBottom: '1rem' }}
          >
            <span>🔥 Order Sent to Flame Grill!</span>
          </div>

          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              marginBottom: '0.4rem'
            }}
          >
            We're Grilling Your Meal!
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.925rem',
              marginBottom: '1.5rem'
            }}
          >
            Freshly prepared and served right to{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {order.tableNumber}
            </strong>
            .
          </p>

          {/* Quick Details Box */}
          <div className="success-meta-grid">
            <div className="meta-box">
              <span className="meta-box-label">Order Token</span>
              <span className="meta-box-val">#{order.tokenNumber}</span>
            </div>

            <div className="meta-box">
              <span className="meta-box-label">Prep Time</span>
              <span
                className="meta-box-val"
                style={{ color: 'var(--bk-yellow)' }}
              >
                ~10-15 Mins
              </span>
            </div>

            <div className="meta-box">
              <span className="meta-box-label">Table</span>
              <span className="meta-box-val">{order.tableNumber}</span>
            </div>

            <div className="meta-box">
              <span className="meta-box-label">Amount</span>
              <span
                className="meta-box-val"
                style={{ color: 'var(--bk-flame)' }}
              >
                ₹{order.total}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginTop: '1.75rem'
            }}
          >
            <button
              className="btn btn-primary btn-lg"
              onClick={onTrackOrder}
            >
              <Flame size={18} />
              <span>Track Kitchen Status</span>
              <ArrowRight size={18} />
            </button>

            <button
              className="btn btn-secondary"
              onClick={onBackToMenu}
            >
              <span>Order More from Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};