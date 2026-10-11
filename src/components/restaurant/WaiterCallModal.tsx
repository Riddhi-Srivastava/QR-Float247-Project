import React, { useState } from 'react';
import { 
  X, 
  BellRing, 
  Droplets, 
  Utensils, 
  Receipt, 
  Sparkles, 
  CheckCircle2
} from 'lucide-react';
import { TableInfo } from '../../types/restaurant';

interface WaiterCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableInfo: TableInfo;
  onServiceCall?: (requestType: string) => void;
}

export const WaiterCallModal: React.FC<WaiterCallModalProps> = ({
  isOpen,
  onClose,
  tableInfo,
  onServiceCall
}) => {
  if (!isOpen) return null;

  const [requestedAction, setRequestedAction] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const quickAssists = [
    { id: 'water', label: 'Drinking Water', icon: Droplets, desc: 'Bring water to table' },
    { id: 'waiter', label: 'Call Table Server', icon: BellRing, desc: `Crew member will visit ${tableInfo.tableNumber}` },
    { id: 'cutlery', label: 'Extra Napkins & Straws', icon: Utensils, desc: 'Forks, tissues, dip cups' },
    { id: 'bill', label: 'Request Final Bill', icon: Receipt, desc: 'Ready for table checkout' },
    { id: 'clean', label: 'Clear Tray & Table', icon: Sparkles, desc: 'Clean table surface' }
  ];

  const handleRequest = (label: string) => {
    setRequestedAction(label);
    if (onServiceCall) {
      onServiceCall(label);
    }
    setTimeout(() => {
      setSuccessMessage(`Request dispatched for ${tableInfo.tableNumber}! A crew member is on their way.`);
      setTimeout(() => {
        setSuccessMessage(null);
        setRequestedAction(null);
        onClose();
      }, 1800);
    }, 500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="modal-body" style={{ paddingTop: '1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div className="cart-icon-circle" style={{ marginInline: 'auto', marginBottom: '0.5rem', width: '48px', height: '48px' }}>
              <BellRing size={22} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.2rem' }}>Table Assistance</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Instant service alert for <strong>{tableInfo.tableNumber}</strong>
            </p>
          </div>

          {successMessage ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '1.75rem 1rem', 
              background: 'rgba(80, 158, 47, 0.15)', 
              border: '2px solid var(--bk-green)', 
              borderRadius: 'var(--radius-md)' 
            }}>
              <CheckCircle2 size={36} color="var(--bk-green)" style={{ marginInline: 'auto', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Crew Alerted!</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{successMessage}</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {quickAssists.map((assist) => {
                const Icon = assist.icon;
                const isSelected = requestedAction === assist.label;
                return (
                  <button
                    key={assist.id}
                    className="custom-radio-card"
                    style={{ padding: '0.85rem 1rem' }}
                    onClick={() => handleRequest(assist.label)}
                    disabled={!!requestedAction}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bk-red)' }}>
                        <Icon size={18} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{assist.label}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{assist.desc}</div>
                      </div>
                    </div>
                    {isSelected ? (
                      <span style={{ fontSize: '0.8rem', color: 'var(--bk-red)', fontWeight: 800 }}>Sending...</span>
                    ) : (
                      <span className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.85rem', pointerEvents: 'none' }}>Call</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
