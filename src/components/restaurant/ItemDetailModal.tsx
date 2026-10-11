import React, { useState, useEffect } from 'react';
import { X, Star, Clock, Plus, Minus, Check } from 'lucide-react';
import { MenuItem, VariantOption, AddonOption, CartCustomization } from '../../types/restaurant';

interface ItemDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, customization: CartCustomization) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onAddToCart
}) => {
  if (!item) return null;

  const [selectedVariant, setSelectedVariant] = useState<VariantOption | undefined>(
    item.variants && item.variants.length > 0 ? item.variants[0] : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<AddonOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    setSelectedVariant(item.variants && item.variants.length > 0 ? item.variants[0] : undefined);
    setSelectedAddons([]);
    setQuantity(1);
    setSpecialInstructions('');
  }, [item]);

  const toggleAddon = (addon: AddonOption) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const basePrice = item.price + (selectedVariant ? selectedVariant.priceDelta : 0);
  const addonsTotal = selectedAddons.reduce((acc, curr) => acc + curr.price, 0);
  const unitPrice = basePrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(item, quantity, {
      selectedVariant,
      selectedAddons,
      specialInstructions: specialInstructions.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
          <X size={20} />
        </button>

        {/* Modal Image Header */}
        <div className="modal-img-wrapper">
          <img src={item.image} alt={item.name} className="modal-food-img" />
        </div>

        {/* Modal Scrollable Content */}
        <div className="modal-body">
          {/* Header Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <div className={`dietary-box ${item.dietary === 'veg' || item.dietary === 'vegan' ? 'dietary-veg' : 'dietary-nonveg'}`}>
                  <span className="dietary-circle"></span>
                </div>
                {item.isBestseller && (
                  <span className="badge" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                    👑 King's Favorite
                  </span>
                )}
              </div>
              <h2 className="modal-food-title">{item.name}</h2>
            </div>
            <div className="modal-food-price">₹{unitPrice}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <div className="food-rating">
              <Star size={13} fill="currentColor" />
              <span>{item.rating}</span>
              <span>({item.ratingCount} reviews)</span>
            </div>
            {item.prepTimeMinutes && (
              <span className="prep-time-tag">
                <Clock size={12} />
                <span>{item.prepTimeMinutes} mins</span>
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            {item.description}
          </p>

          {/* Variants Selection (e.g. Size or Double Patty) */}
          {item.variants && item.variants.length > 0 && (
            <div style={{ borderTop: '1.5px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.65rem' }}>
                Choose Size / Option
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {item.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <label 
                      key={v.id} 
                      className={`custom-radio-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedVariant(v)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className={`radio-circle ${isSelected ? 'checked' : ''}`}>
                          {isSelected && <div className="radio-inner" />}
                        </div>
                        <span style={{ fontWeight: 700 }}>{v.name}</span>
                      </div>
                      <span style={{ fontWeight: 800, color: 'var(--bk-flame)' }}>
                        {v.priceDelta > 0 ? `+₹${v.priceDelta}` : 'Included'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons Selection (e.g. Make it a Meal, Extra Cheese, Fries) */}
          {item.addons && item.addons.length > 0 && (
            <div style={{ borderTop: '1.5px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.65rem' }}>
                King Add-Ons & Meal Upgrades
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {item.addons.map((addon) => {
                  const isChecked = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <label 
                      key={addon.id} 
                      className={`custom-checkbox-card ${isChecked ? 'selected' : ''}`}
                      onClick={() => toggleAddon(addon)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className={`checkbox-box ${isChecked ? 'checked' : ''}`}>
                          {isChecked && <Check size={12} color="#fff" />}
                        </div>
                        <span style={{ fontWeight: 600 }}>{addon.name}</span>
                      </div>
                      <span style={{ fontWeight: 800, color: 'var(--bk-flame)' }}>
                        +₹{addon.price}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cooking instructions */}
          <div style={{ borderTop: '1.5px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.45rem' }}>
              Special Request for Kitchen (Optional)
            </div>
            <textarea
              className="instructions-textarea"
              placeholder="e.g. No mayo, extra napkins, cut into half..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="modal-qty-control">
            <button 
              className="qty-btn" 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="qty-number">{quantity}</span>
            <button 
              className="qty-btn" 
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          <button className="btn btn-primary" onClick={handleAdd} style={{ flex: 1, padding: '0.9rem 1.25rem' }}>
            <span>Add to Tray</span>
            <span>•</span>
            <span>₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
