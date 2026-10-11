import React from 'react';
import {
  Clock3,
  Minus,
  Plus,
  Star,
} from 'lucide-react';

import { CartItem, MenuItem } from '../../types/restaurant';

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
  onDecrement,
}) => {
  const isVeg =
    item.dietary === 'veg' ||
    item.dietary === 'vegan';

  const isAvailable = item.isAvailable !== false;

  const quantity = cartItem?.quantity ?? 0;

  const hasCustomization =
    Boolean(
      (item.variants && item.variants.length > 0) ||
      (item.addons && item.addons.length > 0)
    );

  return (
    <>
      <article
        className="food-card"
        onClick={() => onOpenDetails(item)}
      >
        {/* =================================================
            FOOD IMAGE
        ================================================= */}
        <div className="food-image-wrapper">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="food-img"
              loading="lazy"
            />
          ) : (
            <div className="food-image-placeholder">
              🍽️
            </div>
          )}

          {/* Bestseller */}
          {item.isBestseller && (
            <div className="food-badge-overlay">
              <span className="bestseller-badge">
                ★ Bestseller
              </span>
            </div>
          )}

          {/* Add / Quantity */}
          <div
            className="food-action-container"
            onClick={(e) => e.stopPropagation()}
          >
            {!isAvailable ? (
              <button
                type="button"
                className="food-add-btn food-add-disabled"
                disabled
              >
                Sold Out
              </button>
            ) : cartItem ? (
              <div className="food-qty-stepper">
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() =>
                    onDecrement(cartItem.cartItemId)
                  }
                  aria-label={`Decrease ${item.name}`}
                >
                  <Minus size={16} />
                </button>

                <span className="stepper-count">
                  {quantity}
                </span>

                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() =>
                    onIncrement(cartItem.cartItemId)
                  }
                  aria-label={`Increase ${item.name}`}
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="food-add-btn"
                onClick={() => onQuickAdd(item)}
              >
                ADD
                <Plus size={17} strokeWidth={3} />
              </button>
            )}

            {hasCustomization && isAvailable && (
              <span className="customizable-hint">
                Customisable
              </span>
            )}
          </div>
        </div>

        {/* =================================================
            FOOD INFORMATION
        ================================================= */}
        <div className="food-info">
          {/* Header */}
          <div className="food-header-row">
            <span
              className={`dietary-box ${isVeg
                  ? 'dietary-veg'
                  : 'dietary-nonveg'
                }`}
              aria-label={
                isVeg
                  ? 'Vegetarian'
                  : 'Non-Vegetarian'
              }
            >
              <span className="dietary-circle" />
            </span>

            <div className="food-rating">
              <Star
                size={14}
                fill="currentColor"
                strokeWidth={1.5}
              />

              <span>
                {item.rating ?? 'N/A'}
              </span>

              {item.ratingCount ? (
                <span className="food-rating-count">
                  ({item.ratingCount})
                </span>
              ) : null}
            </div>
          </div>

          {/* Name */}
          <h3 className="food-name">
            {item.name}
          </h3>

          {/* Price + Time */}
          <div className="food-price-row">
            <span className="food-current-price">
              ₹{item.price}
            </span>

            {item.prepTimeMinutes !== undefined &&
              item.prepTimeMinutes !== null && (
                <span className="prep-time-tag">
                  <Clock3 size={13} />
                  {item.prepTimeMinutes}m
                </span>
              )}
          </div>

          {/* Description */}
          <p className="food-description">
            {item.description}
          </p>
        </div>
      </article>

      <style>{`
        /* =====================================================
           FLOAT247 FOOD CARD
           Resto Pink / White Theme
           ORIGINAL CARD DIMENSIONS PRESERVED
        ===================================================== */

        .food-card {
          --fc-primary: #FF2457;
          --fc-primary-dark: #E91E4D;
          --fc-primary-soft: #FFE7ED;

          --fc-surface: #FFFFFF;
          --fc-bg: #F5F6FA;

          --fc-text: #1F1F1F;
          --fc-body: #555555;
          --fc-muted: #8A8A8A;

          --fc-border: #E7E7EB;

          background: var(--fc-surface);

          border: 1px solid var(--fc-border);

          border-radius: 18px;

          padding: 15px;

          display: flex;
          flex-direction: row-reverse;

          justify-content: space-between;

          gap: 14px;

          cursor: pointer;

          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease;

          position: relative;

          box-shadow:
            0 2px 8px rgba(31, 31, 31, 0.05);

          overflow: visible;
        }

        .food-card:hover {
          border-color:
            rgba(255, 36, 87, 0.25);

          transform: translateY(-2px);

          box-shadow:
            0 8px 22px
            rgba(255, 36, 87, 0.09);
        }

        .food-card:focus-within {
          border-color:
            rgba(255, 36, 87, 0.35);
        }

        /* =====================================================
           IMAGE
        ===================================================== */

        .food-image-wrapper {
          position: relative;

          width: 130px;
          height: 130px;

          border-radius: 16px;

          overflow: hidden;

          flex-shrink: 0;

          background:
            linear-gradient(
              135deg,
              #FFE7ED,
              #FFD1DC
            );

          border: 1px solid
            rgba(255, 36, 87, 0.08);
        }

        .food-img {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;

          transition:
            transform 300ms ease;
        }

        .food-card:hover .food-img {
          transform: scale(1.035);
        }

        .food-image-placeholder {
          width: 100%;
          height: 100%;

          display: grid;
          place-items: center;

          background:
            linear-gradient(
              135deg,
              #FFF0F4,
              #FFE0E8
            );

          color: var(--fc-primary);

          font-size: 30px;
        }

        /* =====================================================
           BESTSELLER
        ===================================================== */

        .food-badge-overlay {
          position: absolute;

          top: 7px;
          left: 7px;

          z-index: 2;
        }

        .bestseller-badge {
          display: inline-flex;

          align-items: center;

          gap: 3px;

          padding: 4px 8px;

          border-radius: 999px;

          background:
            rgba(255, 255, 255, 0.94);

          color: var(--fc-primary);

          border: 1px solid
            rgba(255, 36, 87, 0.14);

          box-shadow:
            0 3px 9px
            rgba(31, 31, 31, 0.08);

          font-size: 10px;

          font-weight: 900;

          font-family:
            var(--font-heading),
            'Fredoka',
            'Outfit',
            sans-serif;

          text-transform: uppercase;
        }

        /* =====================================================
           ADD ACTION
        ===================================================== */

        .food-action-container {
          position: absolute;

          bottom: -4px;

          left: 50%;

          transform:
            translateX(-50%);

          display: flex;

          flex-direction: column;

          align-items: center;

          z-index: 5;

          width: 85%;
        }

        .food-add-btn {
          width: 100%;

          min-height: 38px;

          background:
            linear-gradient(
              135deg,
              #FF2457 0%,
              #FF4F78 100%
            );

          color: #FFFFFF;

          font-weight: 900;

          font-size: 13px;

          font-family:
            var(--font-heading),
            'Fredoka',
            'Outfit',
            sans-serif;

          padding:
            7px 12px;

          border-radius: 999px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 4px;

          border:
            1px solid
            rgba(255, 255, 255, 0.3);

          box-shadow:
            0 5px 13px
            rgba(255, 36, 87, 0.28);

          transition:
            transform 150ms ease,
            box-shadow 150ms ease,
            background 150ms ease;
        }

        .food-add-btn:hover:not(:disabled) {
          background:
            linear-gradient(
              135deg,
              #E91E4D,
              #FF2457
            );

          transform: scale(1.025);

          box-shadow:
            0 7px 17px
            rgba(255, 36, 87, 0.34);
        }

        .food-add-btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .food-add-disabled {
          background: #EEEEF1;

          color: #888888;

          border-color: #E0E0E4;

          box-shadow: none;

          cursor: not-allowed;
        }

        /* =====================================================
           QUANTITY STEPPER
        ===================================================== */

        .food-qty-stepper {
          width: 100%;

          min-height: 38px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          background:
            linear-gradient(
              135deg,
              #FF2457,
              #E91E4D
            );

          color: #FFFFFF;

          border-radius: 999px;

          padding:
            4px 7px;

          box-shadow:
            0 5px 13px
            rgba(255, 36, 87, 0.25);
        }

        .stepper-btn {
          width: 30px;
          height: 30px;

          min-width: 30px;

          display: flex;

          align-items: center;

          justify-content: center;

          color: #FFFFFF;

          background:
            rgba(255, 255, 255, 0.15);

          border:
            1px solid
            rgba(255, 255, 255, 0.18);

          border-radius: 50%;

          padding: 0;

          transition:
            background 150ms ease,
            transform 150ms ease;
        }

        .stepper-btn:hover {
          background:
            rgba(255, 255, 255, 0.28);

          transform: scale(1.06);
        }

        .stepper-btn:focus-visible,
        .food-add-btn:focus-visible {
          outline:
            2px solid
            rgba(255, 36, 87, 0.45);

          outline-offset: 2px;
        }

        .stepper-count {
          min-width: 25px;

          text-align: center;

          color: #FFFFFF;

          font-weight: 900;

          font-size: 14px;

          font-family:
            var(--font-heading),
            'Fredoka',
            'Outfit',
            sans-serif;
        }

        /* =====================================================
           CUSTOMISABLE
        ===================================================== */

        .customizable-hint {
          font-size: 9px;

          color: var(--fc-primary);

          background:
            rgba(255, 255, 255, 0.95);

          border:
            1px solid
            rgba(255, 36, 87, 0.10);

          padding:
            2px 7px;

          border-radius: 999px;

          margin-top: 3px;

          font-weight: 700;

          box-shadow:
            0 2px 6px
            rgba(0, 0, 0, 0.05);
        }

        /* =====================================================
           FOOD INFO
        ===================================================== */

        .food-info {
          display: flex;

          flex-direction: column;

          flex: 1;

          min-width: 0;

          padding-top: 1px;
        }

        .food-header-row {
          display: flex;

          align-items: center;

          gap: 7px;

          margin-bottom: 5px;

          min-height: 18px;
        }

        /* =====================================================
           DIETARY
        ===================================================== */

        .dietary-box {
          width: 16px;
          height: 16px;

          border-radius: 4px;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          background: #FFFFFF;
        }

        .dietary-box.dietary-veg {
          border:
            1.5px solid #16834B;
        }

        .dietary-box.dietary-veg
        .dietary-circle {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #16834B;
        }

        .dietary-box.dietary-nonveg {
          border:
            1.5px solid #D62300;
        }

        .dietary-box.dietary-nonveg
        .dietary-circle {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #D62300;
        }

        /* =====================================================
           RATING
        ===================================================== */

        .food-rating {
          display: inline-flex;

          align-items: center;

          gap: 3px;

          font-size: 12px;

          font-weight: 800;

          color: #F5A623;
        }

        .food-rating-count {
          color: #8A8A8A;

          font-weight: 600;
        }

        /* =====================================================
           FOOD NAME
        ===================================================== */

        .food-name {
          font-size: 20px;

          font-weight: 900;

          margin: 0 0 7px;

          line-height: 1.18;

          color: #1F1F1F;

          font-family:
            var(--font-heading),
            'Fredoka',
            'Outfit',
            sans-serif;

          letter-spacing: -0.25px;

          display: -webkit-box;

          -webkit-box-orient: vertical;

          -webkit-line-clamp: 2;

          overflow: hidden;
        }

        /* =====================================================
           PRICE
        ===================================================== */

        .food-price-row {
          display: flex;

          align-items: center;

          flex-wrap: wrap;

          gap: 8px;

          margin-bottom: 7px;
        }

        .food-current-price {
          font-size: 22px;

          font-weight: 900;

          font-family:
            var(--font-heading),
            'Fredoka',
            'Outfit',
            sans-serif;

          color: var(--fc-primary);

          line-height: 1;
        }

        .food-original-price {
          font-size: 13px;

          color: #8A8A8A;

          text-decoration: line-through;
        }

        /* =====================================================
           PREP TIME
        ===================================================== */

        .prep-time-tag {
          display: inline-flex;

          align-items: center;

          gap: 4px;

          font-size: 12px;

          color: #75636A;

          background:
            #FFF0F4;

          border:
            1px solid
            rgba(255, 36, 87, 0.08);

          padding:
            5px 8px;

          border-radius: 999px;

          white-space: nowrap;
        }

        .prep-time-tag svg {
          color: #8A6F77;
        }

        /* =====================================================
           DESCRIPTION
        ===================================================== */

        .food-description {
          font-size: 13px;

          color: #555555;

          line-height: 1.42;

          display: -webkit-box;

          -webkit-line-clamp: 2;

          -webkit-box-orient: vertical;

          overflow: hidden;

          margin: 0;

          max-width: 100%;
        }

        /* =====================================================
           MOBILE
           CARD SIZE STILL COMPACT
        ===================================================== */

        @media (max-width: 640px) {
          .food-card {
            padding: 13px;

            gap: 11px;

            border-radius: 17px;
          }

          .food-image-wrapper {
            width: 125px;
            height: 125px;

            border-radius: 15px;
          }

          .food-name {
            font-size: 18px;

            margin-bottom: 6px;
          }

          .food-current-price {
            font-size: 20px;
          }

          .food-description {
            font-size: 12px;
          }

          .food-rating {
            font-size: 11px;
          }

          .prep-time-tag {
            font-size: 10px;

            padding:
              4px 7px;
          }

          .food-add-btn {
            min-height: 36px;

            font-size: 12px;

            padding:
              6px 10px;
          }

          .food-qty-stepper {
            min-height: 36px;

            padding:
              3px 6px;
          }

          .stepper-btn {
            width: 29px;
            height: 29px;

            min-width: 29px;
          }

          .stepper-count {
            font-size: 13px;
          }
        }

        /* =====================================================
           VERY SMALL DEVICES
        ===================================================== */

        @media (max-width: 380px) {
          .food-card {
            padding: 11px;

            gap: 9px;
          }

          .food-image-wrapper {
            width: 115px;
            height: 115px;
          }

          .food-name {
            font-size: 17px;
          }

          .food-current-price {
            font-size: 19px;
          }

          .food-description {
            font-size: 11px;
          }

          .food-add-btn {
            min-height: 34px;

            font-size: 11px;
          }

          .food-qty-stepper {
            min-height: 34px;
          }

          .stepper-btn {
            width: 27px;
            height: 27px;

            min-width: 27px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .food-card,
          .food-img,
          .food-add-btn,
          .food-qty-stepper,
          .stepper-btn {
            transition: none;
          }
        }
      `}</style>
    </>
  );
};

export default FoodCard;