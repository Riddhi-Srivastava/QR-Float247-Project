import React from 'react';
import { Plus, Minus, Star, Clock } from 'lucide-react';
import { MenuItem, CartItem } from '../../types/restaurant';

interface FoodCardProps {
  item: MenuItem;
  cartItem?: CartItem;
  onOpenDetails: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  onIncrement: (cartItemId: string) => void;
  onDecrement: (cartItemId: string) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  cartItem,
  onOpenDetails,
  onQuickAdd,
  onIncrement,
  onDecrement
}) => {
  const isAvailable = item.isAvailable !== false;

  const hasCustomizations =
    (item.variants && item.variants.length > 0) ||
    (item.addons && item.addons.length > 0);

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('🔥 ADD BUTTON CLICKED');
    console.log('Food ID:', item.id);
    console.log('Food Name:', item.name);
    console.log('Available:', isAvailable);

    if (!isAvailable) {
      console.log('❌ ITEM NOT AVAILABLE');
      return;
    }

    console.log('➡️ CALLING onQuickAdd');
    onQuickAdd(item);
  };

  const handleCardClick = () => {
    if (!isAvailable) return;

    console.log('📦 FOOD CARD CLICKED:', item.name);

    onOpenDetails(item);
  };

  return (
    <div
      className={`food-card ${
        !isAvailable ? 'item-sold-out' : ''
      }`}
      onClick={handleCardClick}
      style={{
        opacity: isAvailable ? 1 : 0.65
      }}
    >
      {/* Food Visual */}
      <div className="food-image-wrapper">
        <img
          src={item.image}
          alt={item.name}
          className="food-img"
          loading="lazy"
        />

        {/* Badges */}
        <div className="food-badge-overlay">
          {!isAvailable ? (
            <span
              className="bestseller-badge"
              style={{
                background: '#4b5563'
              }}
            >
              <span>Sold Out</span>
            </span>
          ) : item.isBestseller ? (
            <span className="bestseller-badge">
              <span>⭐ Bestseller</span>
            </span>
          ) : null}
        </div>

        {/* ADD / Quantity */}
        <div
          className="food-action-container"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {!isAvailable ? (
            <button
              type="button"
              className="food-add-btn"
              disabled
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-muted)',
                cursor: 'not-allowed'
              }}
            >
              <span>UNAVAILABLE</span>
            </button>
          ) : !cartItem ? (
            <button
              type="button"
              className="food-add-btn"
              onClick={handleAddClick}
            >
              <span>ADD</span>
              <Plus size={14} />
            </button>
          ) : (
            <div className="food-qty-stepper">
              <button
                type="button"
                className="stepper-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  console.log(
                    '➖ DECREASE:',
                    item.name
                  );

                  onDecrement(
                    cartItem.cartItemId
                  );
                }}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>

              <span className="stepper-count">
                {cartItem.quantity}
              </span>

              <button
                type="button"
                className="stepper-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  console.log(
                    '➕ INCREASE:',
                    item.name
                  );

                  onIncrement(
                    cartItem.cartItemId
                  );
                }}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

          {hasCustomizations && isAvailable && (
            <span className="customizable-hint">
              Customise
            </span>
          )}
        </div>
      </div>

      {/* Food Details */}
      <div className="food-info">
        <div className="food-header-row">
          {/* Veg / Non-Veg */}
          <div
            className={`dietary-box ${
              item.dietary === 'veg' ||
              item.dietary === 'vegan'
                ? 'dietary-veg'
                : 'dietary-nonveg'
            }`}
          >
            <span className="dietary-circle"></span>
          </div>

          {/* Rating */}
          <div className="food-rating">
            <Star
              size={12}
              fill="currentColor"
            />

            <span>
              {item.rating}
            </span>

            <span
              style={{
                color: 'var(--text-muted)',
                fontWeight: 400
              }}
            >
              ({item.ratingCount})
            </span>
          </div>
        </div>

        <h3 className="food-name">
          {item.name}
        </h3>

        <div className="food-price-row">
          <span className="food-current-price">
            ₹{item.price}
          </span>

          {item.originalPrice && (
            <span className="food-original-price">
              ₹{item.originalPrice}
            </span>
          )}

          {item.prepTimeMinutes && (
            <span className="prep-time-tag">
              <Clock size={12} />
              <span>
                {item.prepTimeMinutes}m
              </span>
            </span>
          )}
        </div>

        <p className="food-description">
          {item.description}
        </p>
      </div>
    </div>
  );
};