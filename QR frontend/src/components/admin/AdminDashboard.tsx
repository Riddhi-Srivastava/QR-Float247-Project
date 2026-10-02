import React, { useEffect, useState } from 'react';

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

// /admin/\* path (e.g. /admin/tables) falls back to the kitchen view

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

  // Responsive layout
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth <= 600;
  const isTablet = screenWidth > 600 && screenWidth <= 900;
  const isCompact = isMobile || isTablet;
  const sidebarWidth = isMobile ? 64 : isTablet ? 76 : 235;

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

      description: '',

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
{/* ================= RESPONSIVE SIDEBAR ================= */}
      <aside
        style={{
          width: `${sidebarWidth}px`,
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          background: isDark ? '#1c100c' : '#fffaf5',
          borderRight: isDark ? '1px solid rgba(255,255,255,.06)' : '1px solid #f0ddd2',
          boxShadow: isDark ? '4px 0 20px rgba(0,0,0,.18)' : '4px 0 24px rgba(95,45,25,.07)',
          overflowY: 'auto',
          overflowX: 'hidden',
          transition: 'width .25s ease',
          boxSizing: 'border-box',
        }}
      >
        {/* BRAND */}
        <div
          style={{
            height: isMobile ? '70px' : '82px',
            padding: isCompact ? '0' : '0 17px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCompact ? 'center' : 'flex-start',
            gap: '11px',
            borderBottom: isDark ? '1px solid rgba(255,255,255,.06)' : '1px solid #f2e5dc',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: isMobile ? '40px' : '45px',
              height: isMobile ? '40px' : '45px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: isMobile ? '12px' : '15px',
              background: 'linear-gradient(135deg,#ff4b16,#df2405)',
              color: '#fff',
              fontSize: isMobile ? '19px' : '22px',
              boxShadow: '0 7px 18px rgba(223,36,5,.22)',
              flexShrink: 0,
            }}
          >
            🍽️
          </div>

          {!isCompact && (
            <div style={{ minWidth: 0 }}>
              <div style={{ color: '#df2b08', fontSize: '20px', fontWeight: 950, lineHeight: 1, letterSpacing: '-.5px' }}>
                Float247
              </div>
              <div style={{ marginTop: '6px', color: isDark ? '#aa9185' : '#96796c', fontSize: '9px', fontWeight: 800, letterSpacing: '1px' }}>
                RESTAURANT ADMIN
              </div>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <nav style={{ padding: isCompact ? '12px 7px' : '18px 11px', flex: 1 }}>
          {!isCompact && (
            <div style={{ padding: '0 10px 9px', color: isDark ? '#806d62' : '#a88d80', fontSize: '9px', fontWeight: 900, letterSpacing: '1.2px', textTransform: 'uppercase' }}>
              WORKSPACE
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigateToTab(tab.id)}
                  title={isCompact ? tab.label : undefined}
                  style={{
                    width: '100%',
                    minHeight: isMobile ? '48px' : '51px',
                    padding: isCompact ? '6px 0' : '6px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCompact ? 'center' : 'flex-start',
                    gap: '10px',
                    border: active ? '1px solid rgba(255,255,255,.12)' : '1px solid transparent',
                    borderRadius: isCompact ? '13px' : '15px',
                    background: active ? 'linear-gradient(135deg,#f04418,#d92808)' : 'transparent',
                    color: active ? '#fff' : isDark ? '#d8c8c0' : '#553c31',
                    cursor: 'pointer',
                    boxShadow: active ? '0 7px 18px rgba(214,35,0,.18)' : 'none',
                    transition: 'all .2s ease',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      width: isMobile ? '36px' : '38px',
                      height: isMobile ? '36px' : '38px',
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '11px',
                      background: active ? 'rgba(255,255,255,.16)' : isDark ? '#2a1811' : '#fff1e8',
                      color: active ? '#fff' : '#d9360d',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={isMobile ? 18 : 19} strokeWidth={active ? 2.6 : 2.1} />
                  </span>

                  {!isCompact && (
                    <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                      <span style={{ fontSize: '12px', fontWeight: 900, lineHeight: 1.1 }}>
                        {tab.label}
                      </span>
                      {tab.description && (
                        <span style={{ marginTop: '4px', fontSize: '8px', fontWeight: 700, opacity: active ? 0.82 : 0.55, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tab.description}
                        </span>
                      )}
                    </span>
                  )}

                  {!isCompact && tab.count > 0 && (
                    <span style={{ minWidth: '23px', height: '23px', padding: '0 6px', display: 'grid', placeItems: 'center', borderRadius: '999px', background: active ? '#ffbd17' : '#df2b08', color: active ? '#2b160e' : '#fff', fontSize: '9px', fontWeight: 900 }}>
                      {tab.count > 99 ? '99+' : tab.count}
                    </span>
                  )}

                  {!isCompact && active && <ChevronRight size={16} strokeWidth={2.8} />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* FOOTER */}
        <div style={{ padding: isCompact ? '8px 7px' : '12px', borderTop: isDark ? '1px solid rgba(255,255,255,.06)' : '1px solid #f2e5dc' }}>
          <button
            type="button"
            onClick={onSwitchToGuestView}
            title={isCompact ? 'Guest View' : undefined}
            style={{
              width: isCompact ? '42px' : '100%',
              height: isMobile ? '42px' : '43px',
              margin: isCompact ? '0 auto' : undefined,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isCompact ? '0' : '8px',
              borderRadius: '14px',
              border: '1px solid rgba(223,43,8,.16)',
              background: isDark ? '#28150f' : '#fbf0f0',
              color: '#df2b08',
              fontSize: '10px',
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            {!isCompact && 'Guest View'}
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div
        style={{
          marginLeft: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`,
          minWidth: 0,
          minHeight: '100vh',
          transition: 'margin-left .25s ease, width .25s ease',
          boxSizing: 'border-box',
        }}
      >

        {/* ================= PREMIUM HEADER ================= */}
        <header
          style={{
            height: isMobile ? '64px' : isTablet ? '70px' : '78px',
            width: isMobile ? 'calc(100% - 12px)' : 'calc(100% - 24px)',
            margin: isMobile ? '6px 6px 0' : '12px 12px 0',
            padding: isMobile ? '0 9px' : '0 18px 0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            background: 'linear-gradient(135deg,#e92d0c 0%,#f04418 55%,#d92308 100%)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,.18)',
            borderRadius: isMobile ? '17px' : '22px',
            boxShadow: '0 8px 24px rgba(110,38,20,.16), inset 0 1px 0 rgba(255,255,255,.16)',
            position: 'sticky',
            top: isMobile ? '6px' : '10px',
            zIndex: 900,
            boxSizing: 'border-box',
          }}
        >
          {/* LEFT — ONLY TITLE */}
          <div style={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '11px', minWidth: 0 }}>
              <div
                style={{
                  width: isMobile ? '34px' : '40px',
                  height: isMobile ? '34px' : '40px',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: isMobile ? '11px' : '14px',
                  background: 'rgba(255,255,255,.15)',
                  border: '1px solid rgba(255,255,255,.18)',
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                <ActiveIcon size={isMobile ? 17 : 19} strokeWidth={2.4} />
              </div>

              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    margin: 0,
                    color: '#fff',
                    fontSize: isMobile ? '17px' : '22px',
                    lineHeight: 1.1,
                    fontWeight: 900,
                    letterSpacing: '-.4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {activeTabData.label}
                </h1>

                {!isMobile && (
                  <div style={{ marginTop: '4px', color: 'rgba(255,255,255,.72)', fontFamily: 'system-ui, sans-serif', fontSize: isTablet ? '9px' : '10px', fontWeight: 700, letterSpacing: '.25px' }}>
                    Float247 • Restaurant Admin
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — ONLY LIVE + THEME */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '5px' : '9px', flexShrink: 0 }}>
            <div
              style={{
                height: isMobile ? '36px' : '39px',
                width: isMobile ? '36px' : 'auto',
                padding: isMobile ? '0' : '0 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '999px',
                background: 'rgba(92,20,5,.20)',
                border: '1px solid rgba(255,255,255,.14)',
                color: '#fff',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '10px',
                fontWeight: 900,
                letterSpacing: '.45px',
                boxSizing: 'border-box',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#55e68a',
                  boxShadow: '0 0 0 4px rgba(85,230,138,.14),0 0 12px rgba(85,230,138,.55)',
                  flexShrink: 0,
                }}
              />
              {!isMobile && 'LIVE SYSTEM'}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                width: isMobile ? '36px' : '39px',
                height: isMobile ? '36px' : '39px',
                display: 'grid',
                placeItems: 'center',
                border: '1px solid rgba(255,255,255,.16)',
                borderRadius: '50%',
                background: 'rgba(92,20,5,.20)',
                color: '#fff',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {isDark ? <Sun size={isMobile ? 16 : 18} strokeWidth={2.4} /> : <Moon size={isMobile ? 16 : 18} strokeWidth={2.4} />}
            </button>
          </div>
        </header>
      {/* CONTENT */}
      <main
        style={{
          minWidth: 0,
          overflow: 'auto',
          padding: isMobile ? '10px' : '18px',
          background: `radial-gradient(circle at 90% 0%, rgba(214,35,0,.035), transparent 28%), ${isDark ? '#160b07' : '#fff8f0'}`,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: '1450px',
            margin: '0 auto 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '27px',
                height: '27px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '8px',
                background: isDark ? '#2a150e' : '#fff',
                color: '#d62300',
                border: `1px solid ${isDark ? 'rgba(255,255,255,.05)' : '#eedfd5'}`,
              }}
            >
              <ActiveIcon size={14} />
            </div>

            {activeTabData.description && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  color: isDark ? '#f2e6df' : '#4d3024',
                }}
              >
                {activeTabData.description}
              </span>
            )}
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