import React from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import {

  ChefHat,

  UtensilsCrossed,

  BarChart3,

  ArrowLeft,

  Sun,

  Moon,

  ChevronRight,

  Activity,

} from 'lucide-react';

import {

  Order,

  OrderStatus,

  TableData,

  TableOccupancyStatus,

  MenuItem,

  ServiceRequest,

} from '../../types/restaurant';

import { KitchenKDS } from './KitchenKDS';

import { MenuController } from './MenuController';

import { AdminStats } from './AdminStats';

type TabId = 'kds' | 'menu' | 'analytics';

interface AdminDashboardProps {

  orders: Order[];

  tables: TableData[];

  menuItems: MenuItem[];

  serviceRequests: ServiceRequest[];

  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;

  onUpdateTableStatus: (tableId: string, status: TableOccupancyStatus) => void;

  onToggleMenuAvailability: (itemId: string) => void;

  onUpdateMenuPrice: (itemId: string, newPrice: number) => void;

  // ADD MENU

  onAddMenuItem: (data: {

    id: string;

    name: string;

    description: string;

    price: number;

    veg: 'VEG' | 'NON_VEG';

    image: string;

    prepTime: number;

    restaurantId: string;

    categoryId: string;

    available: boolean;

    popular: boolean;

    featured: boolean;

  }) => Promise<void> | void;

  onResolveServiceRequest: (requestId: string) => void;

  onEditMenuItem?: (data: {

    id: string;

    name: string;

    description: string;

    price: number;

    veg: 'VEG' | 'NON_VEG';

    image: string;

    prepTime: number;

    categoryId: string;

    available: boolean;

    popular: boolean;

    featured: boolean;

  }) => Promise<void> | void;

  onSwitchToGuestView: () => void;

  theme: 'dark' | 'light';

  toggleTheme: () => void;

}

const ROUTE_MAP: Record<TabId, string> = {

  kds: '/admin/kitchen',

  menu: '/admin/menu',

  analytics: '/admin/reports',

};

// Only tabs that actually render something are routable. Any other

// /admin/* path (e.g. /admin/tables) falls back to the kitchen view

// instead of showing an empty page.

const getTabFromPath = (path: string): TabId => {

  const clean = path.replace(/\/+$/, '');

  switch (clean) {

    case '/admin/menu':

      return 'menu';

    case '/admin/reports':

      return 'analytics';

    case '/admin/kitchen':

    case '/admin':

    default:

      return 'kds';

  }

};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({

  orders,

  menuItems,

  onUpdateOrderStatus,

  onToggleMenuAvailability,

  onUpdateMenuPrice,

  // ADD MENU

  onAddMenuItem,

  onEditMenuItem,

  onSwitchToGuestView,

  theme,

  toggleTheme,

}) => {

  // Use the router instead of raw window\.history so React Router (and App's

  // useLocation) stay in sync with the URL, and back/forward work correctly.

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const activeTab = getTabFromPath(pathname);

  const navigateToTab = (tabId: TabId) => {

    navigate(ROUTE_MAP[tabId]);

  };

  const pendingOrdersCount = orders.filter(

    (o) => o.status === 'received' || o.status === 'preparing'

  ).length;

  const isDark = theme === 'dark';

  const tabs = [

    {

      id: 'kds' as const,

      label: 'Kitchen',

      shortLabel: 'KDS',

      description: 'Live order flow',

      icon: ChefHat,

      count: pendingOrdersCount,

    },

    {

      id: 'menu' as const,

      label: 'Menu',

      shortLabel: 'Menu',

      description: 'Items & pricing',

      icon: UtensilsCrossed,

      count: 0,

    },

    {

      id: 'analytics' as const,

      label: 'Reports',

      shortLabel: 'Reports',

      description: 'Business overview',

      icon: BarChart3,

      count: 0,

    },

  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  const ActiveIcon = activeTabData.icon;

  const borderColor = isDark ? 'rgba(255,255,255,.045)' : 'rgba(60,30,20,.065)';

  return (

    <div

      className="admin-dashboard"

      style={{

        minHeight: '100vh',

        display: 'flex',

        background: isDark ? '#160b07' : '#fff8f0',

        color: isDark ? '#fff' : '#2a160f',

        fontFamily:

          "'Flame', 'Arial Rounded MT Bold', 'Trebuchet MS', system-ui, sans-serif",

      }}

    >

      <style>{`

        .admin-dashboard,

        .admin-dashboard * {

          box-sizing: border-box;

        }

        .admin-dashboard button,

        .admin-dashboard input {

          font-family: inherit;

        }

        .admin-sidebar {

          width: 235px;

          height: 100vh;

          position: fixed;

          top: 0;

          left: 0;

          z-index: 1000;

          display: flex;

          flex-direction: column;

          flex-shrink: 0;

          background: ${isDark ? '#1d0e09' : '#fff'};

          border-right: 1px solid ${borderColor};

          overflow-y: auto;

        }

        .admin-brand {

          height: 82px;

          padding: 0 18px;

          display: flex;

          align-items: center;

          gap: 11px;

          border-bottom: 1px solid ${borderColor};

        }

        .brand-mark {

          width: 44px;

          height: 44px;

          flex-shrink: 0;

          display: grid;

          place-items: center;

          border-radius: 14px;

          background: #d62300;

          color: #fff;

          box-shadow: 0 7px 18px rgba(214,35,0,.2);

          font-size: 23px;

        }

        .brand-name {

          color: #d62300;

          font-size: 20px;

          font-weight: 900;

          line-height: 1;

          letter-spacing: -.5px;

        }

        .brand-subtitle {

          margin-top: 5px;

          color: ${isDark ? '#a8958b' : '#92776a'};

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 1px;

        }

        .nav-section {

          padding: 18px 11px;

          flex: 1;

        }

        .nav-label {

          padding: 0 10px 8px;

          color: ${isDark ? '#76645b' : '#aa8e80'};

          font-size: 9px;

          font-weight: 900;

          letter-spacing: 1.2px;

          text-transform: uppercase;

        }

        .nav-item {

          position: relative;

          width: 100%;

          height: 48px;

          margin-bottom: 5px;

          padding: 0 11px;

          border: 0;

          border-radius: 11px;

          display: flex;

          align-items: center;

          gap: 11px;

          background: transparent;

          color: ${isDark ? '#d5c5bc' : '#5a4034'};

          cursor: pointer;

          text-align: left;

          transition: background .18s ease, color .18s ease, transform .18s ease;

        }

        .nav-item\:hover {

          background: ${isDark ? '#2a1710' : '#fff5ed'};

          color: #d62300;

        }

        .nav-item.active {

          background: #d62300;

          color: #fff;

          box-shadow: 0 6px 15px rgba(214,35,0,.17);

        }

        .nav-icon {

          width: 34px;

          height: 34px;

          flex-shrink: 0;

          display: grid;

          place-items: center;

          border-radius: 9px;

        }

        .nav-item\:not(.active) .nav-icon {

          background: ${isDark ? '#28150e' : '#fff7f0'};

        }

        .nav-label-text {

          display: block;

          flex: 1;

          font-size: 12px;

          font-weight: 900;

        }

        .nav-description {

          display: block;

          margin-top: 2px;

          font-size: 8px;

          font-weight: 600;

          opacity: .58;

        }

        .nav-count {

          min-width: 22px;

          height: 22px;

          padding: 0 6px;

          display: grid;

          place-items: center;

          border-radius: 7px;

          background: ${isDark ? '#fff' : '#d62300'};

          color: ${isDark ? '#d62300' : '#fff'};

          font-size: 9px;

          font-weight: 900;

        }

        .nav-item.active .nav-count {

          background: #ffbf18;

          color: #2a160f;

        }

        .sidebar-footer {

          padding: 12px;

          border-top: 1px solid ${borderColor};

        }

        .guest-button {

          width: 100%;

          height: 40px;

          border: 1px solid rgba(214,35,0,.18);

          border-radius: 10px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

          background: ${isDark ? '#28140d' : '#fff8f3'};

          color: #d62300;

          font-size: 10px;

          font-weight: 900;

          cursor: pointer;

          transition: .18s ease;

        }

        .guest-button\:hover {

          background: ${isDark ? '#35190f' : '#fff0e8'};

          border-color: rgba(214,35,0,.3);

          transform: translateY(-1px);

        }

        .main-area {

          margin-left: 235px;

          width: calc(100% - 235px);

          min-width: 0;

          min-height: 100vh;

        }

        .topbar {

          height: 76px;

          flex-shrink: 0;

          padding: 0 22px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          background: #d62300;

          color: #fff;

          box-shadow: 0 5px 20px rgba(70,30,15,.13);

        }

        .topbar-left {

          min-width: 0;

        }

        .topbar-title-row {

          display: flex;

          align-items: center;

          gap: 9px;

        }

        .topbar-title {

          margin: 0;

          font-size: 21px;

          font-weight: 900;

          letter-spacing: -.35px;

        }

        .topbar-arrow {

          opacity: .55;

        }

        .topbar-subtitle {

          margin-top: 4px;

          font-family: system-ui, sans-serif;

          font-size: 10px;

          opacity: .76;

        }

        .topbar-actions {

          display: flex;

          align-items: center;

          gap: 9px;

        }

        .live-pill {

          height: 34px;

          padding: 0 11px;

          display: flex;

          align-items: center;

          gap: 7px;

          border-radius: 9px;

          background: rgba(0,0,0,.14);

          font-family: system-ui, sans-serif;

          font-size: 10px;

          font-weight: 800;

        }

        .live-dot {

          width: 7px;

          height: 7px;

          border-radius: 50%;

          background: #39df78;

          box-shadow: 0 0 0 3px rgba(57,223,120,.12);

        }

        .theme-button {

          width: 35px;

          height: 35px;

          border: 0;

          border-radius: 9px;

          display: grid;

          place-items: center;

          background: rgba(0,0,0,.14);

          color: #fff;

          cursor: pointer;

          transition: .18s ease;

        }

        .theme-button\:hover {

          background: rgba(0,0,0,.22);

        }

        .content-area {

          flex: 1;

          min-width: 0;

          overflow: auto;

          padding: 18px;

          background:

            radial-gradient(circle at 90% 0%, rgba(214,35,0,.035), transparent 28%),

            ${isDark ? '#160b07' : '#fff8f0'};

        }

        .page-context {

          max-width: 1450px;

          margin: 0 auto 14px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 12px;

        }

        .context-left {

          display: flex;

          align-items: center;

          gap: 8px;

        }

        .context-icon {

          width: 27px;

          height: 27px;

          display: grid;

          place-items: center;

          border-radius: 7px;

          background: ${isDark ? '#2a150e' : '#fff'};

          color: #d62300;

          border: 1px solid ${isDark ? 'rgba(255,255,255,.05)' : '#eedfd5'};

        }

        .context-title {

          font-size: 11px;

          font-weight: 900;

          color: ${isDark ? '#f2e6df' : '#4d3024'};

        }

        .context-status {

          display: flex;

          align-items: center;

          gap: 6px;

          font-family: system-ui, sans-serif;

          font-size: 9px;

          font-weight: 800;

          color: ${isDark ? '#a9958b' : '#94796b'};

        }

        .context-status-dot {

          width: 6px;

          height: 6px;

          border-radius: 50%;

          background: #22aa58;

        }

        @media (max-width: 900px) {

          .admin-sidebar {

            width: 76px;

          }

          .admin-brand {

            justify-content: center;

            padding: 0;

          }

          .brand-copy,

          .nav-copy,

          .nav-count,

          .nav-label,

          .guest-copy {

            display: none !important;

          }

          .nav-item {

            justify-content: center;

            padding: 0;

          }

          .nav-icon {

            width: 38px;

            height: 38px;

          }

          .guest-button {

            width: 42px;

            margin: auto;

            font-size: 0;

          }

          .guest-button svg {

            margin: 0;

          }

          .main-area {

            margin-left: 76px;

            width: calc(100% - 76px);

          }

        }

        @media (max-width: 600px) {

          .admin-sidebar {

            width: 64px;

          }

          .admin-brand {

            height: 70px;

            padding: 0;

            justify-content: center;

          }

          .nav-section {

            padding: 12px 7px;

          }

          .nav-item {

            justify-content: center;

            padding: 12px 0;

          }

          .nav-icon {

            margin: 0;

          }

          .sidebar-footer {

            padding: 8px 7px;

          }

          .guest-button {

            justify-content: center;

            padding: 12px 0;

          }

          .main-area {

            margin-left: 64px;

            width: calc(100% - 64px);

          }

        }

      `}</style>

      {/* ================= SIDEBAR ================= */}

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <div className="brand-mark">🍔</div>

          <div className="brand-copy">

            <div className="brand-name">Float247</div>

            <div className="brand-subtitle">RESTAURANT ADMIN</div>

          </div>

        </div>

        <nav className="nav-section">

          <div className="nav-label">Workspace</div>

          {tabs.map((tab) => {

            const Icon = tab.icon;

            const active = activeTab === tab.id;

            return (

              <button

                key={tab.id}

                type="button"

                className={`nav-item ${active ? 'active' : ''}`}

                onClick={() => navigateToTab(tab.id)}

              >

                <span className="nav-icon">

                  <Icon size={18} />

                </span>

                <span className="nav-copy" style={{ flex: 1 }}>

                  <span className="nav-label-text">{tab.label}</span>

                  <span className="nav-description">{tab.description}</span>

                </span>

                {tab.count > 0 && (

                  <span className="nav-count">{tab.count}</span>

                )}

                {active && <ChevronRight size={14} style={{ opacity: 0.7 }} />}

              </button>

            );

          })}

        </nav>

        <div className="sidebar-footer">

          {/* onSwitchToGuestView handles logout + navigation to "/" */}

          <button

            type="button"

            className="guest-button"

            onClick={onSwitchToGuestView}

          >

            <ArrowLeft size={14} />

            <span className="guest-copy">Guest View</span>

          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <div className="main-area">

        {/* TOP BAR */}

        <header className="topbar">

          <div className="topbar-left">

            <div className="topbar-title-row">

              <h1 className="topbar-title">{activeTabData.label}</h1>

              <ChevronRight className="topbar-arrow" size={16} />

              <Activity size={15} style={{ opacity: 0.7 }} />

            </div>

            <div className="topbar-subtitle">Float247 Restaurant Admin</div>

          </div>

          <div className="topbar-actions">

            <div className="live-pill">

              <span className="live-dot" />

              LIVE SYSTEM

            </div>

            <button

              type="button"

              className="theme-button"

              onClick={toggleTheme}

              aria-label="Toggle theme"

            >

              {isDark ? <Sun size={16} /> : <Moon size={16} />}

            </button>

          </div>

        </header>

        {/* CONTENT */}

        <main className="content-area">

          <div className="page-context">

            <div className="context-left">

              <div className="context-icon">

                <ActiveIcon size={14} />

              </div>

              <span className="context-title">{activeTabData.description}</span>

            </div>

            <div className="context-status">

              <span className="context-status-dot" />

              System operational

            </div>

          </div>

          {activeTab === 'kds' && (

            <KitchenKDS

              orders={orders}

              onUpdateOrderStatus={onUpdateOrderStatus}

            />

          )}

          {activeTab === 'menu' && (

            <MenuController

              menuItems={menuItems}

              onToggleAvailability={onToggleMenuAvailability}

              onUpdatePrice={onUpdateMenuPrice}

              onAddMenuItem={onAddMenuItem}

              onEditMenuItem={onEditMenuItem}

            />

          )}

          {activeTab === 'analytics' && (

            <AdminStats orders={orders} menuItems={menuItems} />

          )}

        </main>

      </div>

    </div>

  );

};