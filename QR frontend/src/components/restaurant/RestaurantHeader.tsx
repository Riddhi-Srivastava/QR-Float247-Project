import React from 'react';
import {
  Search,
  Moon,
  Sun,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { TableInfo, Order } from '../../types/restaurant';

interface RestaurantHeaderProps {
  tableInfo: TableInfo;
  activeOrder: Order | null;
  activeView: 'menu' | 'success' | 'tracker';

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
  activeOrder,
  activeView,
  onOpenOrderTracker,
  onSwitchToAdminView,
  searchQuery,
  setSearchQuery,
  theme,
  toggleTheme
}) => {
  return (
    <>
      <header
        className="restaurant-header"
        style={{
          marginTop: 0,
          paddingTop: 0
        }}
      >
        {/* Main Restaurant Brand Banner */}
        <div className="container">
          <div
            className="resto-hero-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            {/* LEFT — Chef Logo + FLOAT24/7 + Track Order */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: 0
              }}
            >
              <div className="resto-avatar">
                <span
                  style={{
                    fontSize: '1.85rem'
                  }}
                >
                  👨‍🍳
                </span>
              </div>

              <span className="float-brand">
                🍽️ Float 24/7
              </span>

              {/* Track Order */}
              {activeOrder && (
                <button
                  className="live-order-btn"
                  onClick={onOpenOrderTracker}
                  title="View active kitchen order"
                >
                  <Flame size={14} />

                  <span>
                    Track Order (#
                    {activeOrder.tokenNumber})
                  </span>
                </button>
              )}
            </div>

            {/* RIGHT — Admin + Theme */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0
              }}
            >
              {/* Admin Panel Button */}
              <button
                type="button"
                className="admin-panel-button"
                onClick={onSwitchToAdminView}
                title="Open Admin Panel"
              >
                <ShieldCheck size={16} />
                <span>Admin Panel</span>
              </button>

              {/* Theme Button */}
              <button
                className="icon-btn-small"
                onClick={toggleTheme}
                title="Toggle Dark/Light Mode"
              >
                {theme === 'dark' ? (
                  <Sun size={14} />
                ) : (
                  <Moon size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar — Menu Page Only */}
          {activeView === 'menu' && (
            <div className="search-bar-wrapper">
              <Search
                size={18}
                className="search-icon"
              />

              <input
                type="text"
                placeholder="Search Whopper, Crispy Burger, Fries, Shake..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="search-input"
              />

              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() =>
                    setSearchQuery('')
                  }
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* =====================================================
          INTERNAL CSS
          ===================================================== */}

      <style>
        {`

          /* ==========================================
             FLOAT BRAND
             ========================================== */

          .float-brand {
            display: inline-flex;
            align-items: center;
            justify-content: center;

            min-height: 40px;
            padding: 9px 17px;

            background: #D62300;
            color: #FFFFFF;

            border: 1px solid #D62300;
            border-radius: 999px;

            font-size: 16px;
            font-weight: 800;

            font-family:
              "Arial Rounded MT Bold",
              "Trebuchet MS",
              Arial,
              sans-serif;

            letter-spacing: -0.2px;
            line-height: 1;

            white-space: nowrap;

            box-sizing: border-box;

            box-shadow:
              0 5px 14px rgba(214, 35, 0, 0.20);

            transition:
              transform 0.2s ease,
              box-shadow 0.2s ease;
          }

          .float-brand:hover {
            transform: translateY(-2px);

            box-shadow:
              0 8px 18px rgba(214, 35, 0, 0.30);
          }


          /* ==========================================
             CHEF AVATAR
             ========================================== */

          .resto-avatar {
            background: #D62300 !important;
          }


          /* ==========================================
             TRACK ORDER BUTTON
             ========================================== */

          .live-order-btn {
            display: inline-flex;

            align-items: center;
            justify-content: center;

            gap: 7px;

            min-height: 40px;

            padding: 9px 15px;

            border: none;
            border-radius: 999px;

            background: #43A72D;
            color: #FFFFFF;

            font-size: 13px;
            font-weight: 800;

            font-family:
              "Arial Rounded MT Bold",
              "Trebuchet MS",
              Arial,
              sans-serif;

            cursor: pointer;

            white-space: nowrap;

            box-shadow:
              0 5px 14px rgba(67, 167, 45, 0.20);

            transition:
              transform 0.2s ease,
              background 0.2s ease,
              box-shadow 0.2s ease;
          }

          .live-order-btn:hover {
            background: #378D24;

            transform: translateY(-2px);

            box-shadow:
              0 8px 18px rgba(67, 167, 45, 0.28);
          }

          .live-order-btn:active {
            transform: translateY(0);
          }


          /* ==========================================
             ADMIN PANEL BUTTON
             ========================================== */

          .admin-panel-button {
            display: inline-flex;

            align-items: center;
            justify-content: center;

            gap: 7px;

            min-height: 40px;

            padding: 9px 15px;

            border: none;
            border-radius: 999px;

            background: #D62300;
            color: #FFFFFF;

            font-size: 13px;
            font-weight: 800;

            font-family:
              "Arial Rounded MT Bold",
              "Trebuchet MS",
              Arial,
              sans-serif;

            cursor: pointer;

            white-space: nowrap;

            box-shadow:
              0 5px 14px rgba(214, 35, 0, 0.20);

            transition:
              transform 0.2s ease,
              background 0.2s ease,
              box-shadow 0.2s ease;
          }

          .admin-panel-button:hover {
            background: #B91F00;

            transform: translateY(-2px);

            box-shadow:
              0 8px 18px rgba(214, 35, 0, 0.28);
          }

          .admin-panel-button:active {
            transform: translateY(0);
          }


          /* ==========================================
             THEME BUTTON
             ========================================== */

          .icon-btn-small {
            width: 40px !important;
            height: 40px !important;

            min-width: 40px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50% !important;

            border: 1px solid #E6DDD5 !important;

            background: #FFF8E7 !important;

            color: #502314 !important;

            cursor: pointer;

            transition:
              transform 0.2s ease,
              background 0.2s ease;
          }

          .icon-btn-small:hover {
            background: #F9C80E !important;

            transform: rotate(10deg);
          }


          /* ==========================================
             MOBILE
             ========================================== */

          @media (max-width: 600px) {

            .resto-hero-card {
              gap: 8px !important;
            }

            .float-brand {
              font-size: 14px;

              min-height: 36px;

              padding: 8px 12px;
            }

            .live-order-btn {
              min-height: 36px;

              padding: 8px 11px;

              font-size: 12px;

              gap: 5px;
            }

            .live-order-btn svg {
              width: 14px;
              height: 14px;
            }

            .admin-panel-button {
              min-height: 36px;

              padding: 8px 11px;

              font-size: 12px;

              gap: 5px;
            }

            .admin-panel-button svg {
              width: 14px;
              height: 14px;
            }

            .icon-btn-small {
              width: 36px !important;
              height: 36px !important;

              min-width: 36px;
            }

          }


          /* ==========================================
             SMALL MOBILE
             ========================================== */

          @media (max-width: 420px) {

            .float-brand {
              font-size: 13px;

              padding: 7px 10px;
            }

            .live-order-btn span {
              display: none;
            }

            .live-order-btn {
              width: 36px;
              height: 36px;

              min-width: 36px;

              padding: 0;
            }

            .admin-panel-button span {
              display: none;
            }

            .admin-panel-button {
              width: 36px;
              height: 36px;

              min-width: 36px;

              padding: 0;
            }

            .icon-btn-small {
              width: 36px !important;
              height: 36px !important;
            }

          }


          /* ==========================================
             VERY SMALL MOBILE
             ========================================== */

          @media (max-width: 350px) {

            .float-brand {
              font-size: 12px;

              padding: 7px 9px;
            }

          }

        `}
      </style>
    </>
  );
};
