import React, {
  useRef,
  useEffect,
} from 'react';

import {
  Search,
  Moon,
  Sun,
  Flame,
  ShieldCheck,
  ShoppingBasket,
  UtensilsCrossed,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

import {
  TableInfo,
  Order,
} from '../../types/restaurant';

interface RestaurantHeaderProps {
  tableInfo: TableInfo;

  activeOrder: Order | null;

  activeView:
  | 'menu'
  | 'success'
  | 'tracker';

  onOpenWaiterModal: () => void;
  onOpenOrderTracker: () => void;
  onOpenCart: () => void;
  onSwitchToAdminView: () => void;

  cartItemCount: number;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const RestaurantHeader: React.FC<
  RestaurantHeaderProps
> = ({
  tableInfo,
  activeOrder,
  activeView,
  onOpenOrderTracker,
  onOpenCart,
  onSwitchToAdminView,
  cartItemCount,
  searchQuery,
  setSearchQuery,
  theme,
  toggleTheme,
}) => {
    const headerRef =
      useRef<HTMLElement>(null);

    /* =========================================================
       KEEP EXISTING HEADER HEIGHT BEHAVIOUR
    ========================================================= */

    useEffect(() => {
      const el = headerRef.current;

      if (!el) return;

      const updateHeight = () => {
        const height = el.offsetHeight;

        if (height > 0) {
          document.documentElement.style.setProperty(
            '--header-height',
            `${height}px`
          );
        }
      };

      updateHeight();

      const resizeObserver =
        new ResizeObserver(() =>
          updateHeight()
        );

      resizeObserver.observe(el);

      window.addEventListener(
        'resize',
        updateHeight
      );

      return () => {
        resizeObserver.disconnect();

        window.removeEventListener(
          'resize',
          updateHeight
        );
      };
    }, []);

    return (
      <>
        <header
          ref={headerRef}
          className="restaurant-header float247-header"
        >
          <div className="container">

            {/* =================================================
              TOP BRAND BAR
          ================================================= */}

            <div className="float-header-main">

              {/* BRAND */}
              <div className="float-brand-group">

                <div className="float-logo-mark">
                  <UtensilsCrossed
                    size={22}
                    strokeWidth={2.5}
                  />

                  <Sparkles
                    className="float-logo-spark"
                    size={11}
                  />
                </div>

                <div className="float-brand-copy">
                  <span className="float-brand-name">
                    Float<span>24/7</span>
                  </span>

                  <span className="float-brand-tagline">
                    GOOD FOOD · ANYTIME
                  </span>
                </div>

                {/* ACTIVE ORDER */}
                {activeOrder && (
                  <button
                    type="button"
                    className="float-track-order"
                    onClick={
                      onOpenOrderTracker
                    }
                    title="View active kitchen order"
                  >
                    <span className="track-live-dot" />

                    <Flame
                      size={15}
                      strokeWidth={2.5}
                    />

                    <span className="track-order-text">
                      Track Order
                    </span>

                    <span className="track-token">
                      #{activeOrder.tokenNumber}
                    </span>

                    <ChevronRight size={14} />
                  </button>
                )}
              </div>

              {/* RIGHT ACTIONS */}
              <div className="float-header-actions">

                {/* TABLE */}
                {tableInfo?.tableNumber && (
                  <div className="float-table-chip">
                    <span className="table-chip-dot" />
                    <span>
                      Table {tableInfo.tableNumber}
                    </span>
                  </div>
                )}

                {/* CART */}
                <button
                  type="button"
                  className="float-header-action cart-action"
                  onClick={onOpenCart}
                  title="Open Your Tokri"
                >
                  <ShoppingBasket
                    size={18}
                    strokeWidth={2.3}
                  />

                  <span className="action-label">
                    Tokri
                  </span>

                  {cartItemCount > 0 && (
                    <span className="float-cart-badge">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                {/* ADMIN */}
                <button
                  type="button"
                  className="float-header-action admin-action"
                  onClick={
                    onSwitchToAdminView
                  }
                  title="Open Admin Panel"
                >
                  <ShieldCheck
                    size={17}
                    strokeWidth={2.3}
                  />

                  <span className="action-label">
                    Boss Panel
                  </span>
                </button>

                {/* THEME */}
                <button
                  type="button"
                  className="float-theme-button"
                  onClick={toggleTheme}
                  title="Toggle Dark/Light Mode"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun
                      size={17}
                      strokeWidth={2.2}
                    />
                  ) : (
                    <Moon
                      size={17}
                      strokeWidth={2.2}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* =================================================
              SEARCH
          ================================================= */}

            {activeView === 'menu' && (
              <div className="float-search-shell">

                <div className="float-search-icon">
                  <Search
                    size={19}
                    strokeWidth={2.4}
                  />
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                  placeholder="Search biryani, burger, fries, shake..."
                  className="float-search-input"
                />

                {searchQuery && (
                  <button
                    type="button"
                    className="float-clear-search"
                    onClick={() =>
                      setSearchQuery('')
                    }
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}

                <div className="search-end-dot">
                  <Search
                    size={17}
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            )}

          </div>
        </header>

        <style>{`
        /* =====================================================
           FLOAT247 HEADER
           iOS INSPIRED / PINK SYSTEM
        ===================================================== */

        .float247-header {
          position: relative;

          z-index: 50;

          padding:
            10px 0 8px;

          background:
            linear-gradient(
              180deg,
              #FFFFFF 0%,
              #FFF9FB 100%
            );

          border-bottom:
            1px solid
            rgba(255,36,87,0.08);
        }

        .float247-header
        .container {
          position: relative;
        }

        /* =====================================================
           MAIN HEADER
        ===================================================== */

        .float-header-main {
          min-height: 64px;

          padding:
            8px 10px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 14px;

          border-radius: 23px;

          background:
            rgba(255,255,255,0.94);

          border:
            1px solid #E7E7EB;

          box-shadow:
            0 6px 20px
              rgba(31,31,31,0.055),
            inset 0 1px 0
              rgba(255,255,255,0.95);

          backdrop-filter:
            blur(14px);
        }

        /* =====================================================
           BRAND
        ===================================================== */

        .float-brand-group {
          min-width: 0;

          display: flex;

          align-items: center;

          gap: 9px;
        }

        .float-logo-mark {
          position: relative;

          width: 43px;
          height: 43px;

          min-width: 43px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #FF2457,
              #FF4F78
            );

          color: #FFFFFF;

          box-shadow:
            0 7px 17px
              rgba(255,36,87,0.24);
        }

        .float-logo-spark {
          position: absolute;

          top: 5px;
          right: 5px;

          color:
            rgba(255,255,255,0.95);
        }

        .float-brand-copy {
          display: flex;

          flex-direction: column;

          justify-content: center;

          min-width: 0;
        }

        .float-brand-name {
          color: #1F1F1F;

          font-family:
            var(--font-heading),
            'Fredoka',
            'Outfit',
            sans-serif;

          font-size: 21px;

          line-height: 1;

          font-weight: 900;

          letter-spacing: -0.6px;

          white-space: nowrap;
        }

        .float-brand-name span {
          color: #FF2457;
        }

        .float-brand-tagline {
          margin-top: 4px;

          color: #8A8A8A;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: 1.4px;

          white-space: nowrap;
        }

        /* =====================================================
           TRACK ORDER
        ===================================================== */

        .float-track-order {
          position: relative;

          margin-left: 5px;

          min-height: 36px;

          padding:
            7px 11px;

          border-radius: 999px;

          border:
            1px solid
            rgba(34,160,107,0.18);

          background:
            #F0FAF5;

          color:
            #16834B;

          display: inline-flex;

          align-items: center;

          gap: 6px;

          font-family:
            var(--font-heading),
            'Fredoka',
            'Outfit',
            sans-serif;

          font-size: 11px;

          font-weight: 800;

          white-space: nowrap;

          cursor: pointer;

          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .float-track-order:hover {
          transform:
            translateY(-1px);

          background:
            #E7F7EF;

          box-shadow:
            0 5px 14px
              rgba(34,160,107,0.12);
        }

        .track-live-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background:
            #22A06B;

          box-shadow:
            0 0 0 4px
              rgba(34,160,107,0.10);
        }

        .track-token {
          padding:
            3px 6px;

          border-radius: 7px;

          background:
            rgba(34,160,107,0.10);

          font-size: 10px;
        }

        /* =====================================================
           RIGHT ACTIONS
        ===================================================== */

        .float-header-actions {
          display: flex;

          align-items: center;

          gap: 7px;

          flex-shrink: 0;
        }

        .float-table-chip {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          min-height: 38px;

          padding:
            7px 11px;

          border-radius: 999px;

          background:
            #F5F6FA;

          border:
            1px solid #E7E7EB;

          color:
            #555555;

          font-size: 11px;

          font-weight: 800;

          white-space: nowrap;
        }

        .table-chip-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background:
            #FF2457;
        }

        .float-header-action {
          position: relative;

          min-height: 40px;

          padding:
            8px 13px;

          border-radius: 13px;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 6px;

          font-family:
            var(--font-heading),
            'Fredoka',
            'Outfit',
            sans-serif;

          font-size: 11px;

          font-weight: 800;

          cursor: pointer;

          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease,
            border-color 180ms ease;
        }

        .float-header-action:hover {
          transform:
            translateY(-2px);
        }

        .cart-action {
          color:
            #FF2457;

          background:
            #FFF0F4;

          border:
            1px solid
            rgba(255,36,87,0.12);

          box-shadow:
            0 4px 11px
              rgba(255,36,87,0.08);
        }

        .cart-action:hover {
          background:
            #FFE7ED;

          box-shadow:
            0 7px 17px
              rgba(255,36,87,0.14);
        }

        .admin-action {
          color:
            #1F1F1F;

          background:
            #FFFFFF;

          border:
            1px solid #E7E7EB;

          box-shadow:
            0 3px 10px
              rgba(31,31,31,0.045);
        }

        .admin-action:hover {
          border-color:
            rgba(255,36,87,0.20);

          color:
            #FF2457;
        }

        .float-cart-badge {
          position: absolute;

          top: -6px;
          right: -6px;

          min-width: 19px;
          height: 19px;

          padding:
            0 5px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 999px;

          background:
            #FF2457;

          color: #FFFFFF;

          border:
            2px solid #FFFFFF;

          font-size: 9px;

          font-weight: 900;
        }

        /* =====================================================
           THEME
        ===================================================== */

        .float-theme-button {
          width: 40px;
          height: 40px;

          min-width: 40px;

          border-radius: 13px;

          display: flex;

          align-items: center;
          justify-content: center;

          background:
            #FFFFFF;

          color:
            #555555;

          border:
            1px solid #E7E7EB;

          cursor: pointer;

          transition:
            transform 180ms ease,
            background 180ms ease,
            color 180ms ease;
        }

        .float-theme-button:hover {
          transform:
            rotate(8deg);

          background:
            #FFF0F4;

          color:
            #FF2457;
        }

        /* =====================================================
           SEARCH
        ===================================================== */

        .float-search-shell {
          position: relative;

          margin-top: 10px;

          height: 52px;

          display: flex;

          align-items: center;

          padding:
            5px 7px 5px 15px;

          border-radius: 18px;

          background:
            #FFFFFF;

          border:
            1px solid #E7E7EB;

          box-shadow:
            0 5px 16px
              rgba(31,31,31,0.045);

          transition:
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        .float-search-shell:focus-within {
          border-color:
            rgba(255,36,87,0.30);

          box-shadow:
            0 7px 22px
              rgba(255,36,87,0.10);
        }

        .float-search-icon {
          display: flex;

          align-items: center;

          justify-content: center;

          color:
            #FF2457;

          flex-shrink: 0;
        }

        .float-search-input {
          flex: 1;

          min-width: 0;

          height: 100%;

          border: 0;

          outline: 0;

          background:
            transparent;

          color:
            #1F1F1F;

          padding:
            0 11px;

          font-size: 13px;

          font-weight: 600;

          font-family:
            var(--font-body),
            'Outfit',
            sans-serif;
        }

        .float-search-input::placeholder {
          color:
            #9A9AA1;

          font-weight: 500;
        }

        .float-clear-search {
          width: 29px;
          height: 29px;

          border-radius: 50%;

          border: 0;

          background:
            #F5F6FA;

          color:
            #777777;

          display: flex;

          align-items: center;
          justify-content: center;

          font-size: 17px;

          cursor: pointer;
        }

        .float-clear-search:hover {
          background:
            #FFE7ED;

          color:
            #FF2457;
        }

        .search-end-dot {
          width: 40px;
          height: 40px;

          border-radius: 13px;

          display: flex;

          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              135deg,
              #FF2457,
              #FF4F78
            );

          color: #FFFFFF;

          box-shadow:
            0 5px 13px
              rgba(255,36,87,0.22);
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 900px) {
          .float-table-chip {
            display: none;
          }

          .track-order-text {
            display: none;
          }

          .float-track-order {
            width: 36px;
            height: 36px;

            min-width: 36px;

            padding: 0;

            justify-content: center;
          }

          .track-token {
            display: none;
          }

          .float-brand-tagline {
            display: none;
          }
        }

        @media (max-width: 700px) {
          .float247-header {
            padding:
              7px 0;
          }

          .float-header-main {
            min-height: 55px;

            padding:
              7px 8px;

            border-radius: 19px;

            gap: 7px;
          }

          .float-logo-mark {
            width: 38px;
            height: 38px;

            min-width: 38px;

            border-radius: 12px;
          }

          .float-brand-name {
            font-size: 18px;
          }

          .float-header-actions {
            gap: 5px;
          }

          .float-header-action {
            width: 38px;
            height: 38px;

            min-width: 38px;

            padding: 0;

            border-radius: 12px;
          }

          .action-label {
            display: none;
          }

          .float-theme-button {
            width: 38px;
            height: 38px;

            min-width: 38px;

            border-radius: 12px;
          }

          .float-search-shell {
            height: 48px;

            border-radius: 16px;
          }

          .search-end-dot {
            width: 36px;
            height: 36px;

            border-radius: 11px;
          }
        }

        @media (max-width: 420px) {
          .float-header-main {
            border-radius: 17px;
          }

          .float-logo-mark {
            width: 35px;
            height: 35px;

            min-width: 35px;
          }

          .float-brand-name {
            font-size: 16px;
          }

          .float-track-order {
            width: 33px;
            height: 33px;

            min-width: 33px;
          }

          .float-header-action {
            width: 35px;
            height: 35px;

            min-width: 35px;
          }

          .float-theme-button {
            width: 35px;
            height: 35px;

            min-width: 35px;
          }

          .float-search-shell {
            height: 45px;
          }

          .search-end-dot {
            width: 33px;
            height: 33px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .float-header-action,
          .float-theme-button,
          .float-track-order {
            transition: none;
          }
        }
      `}</style>
      </>
    );
  };

export default RestaurantHeader;