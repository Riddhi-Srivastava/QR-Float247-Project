  import React, { useLayoutEffect, useRef, useState } from 'react';
  import { useLocation, useNavigate } from 'react-router-dom';
  import {
    ChefHat,
    UtensilsCrossed,
    BarChart3,
    ShieldCheck,
    Sun,
    Moon,
    Sparkles,
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

    onUpdateOrderStatus: (
      orderId: string,
      status: OrderStatus
    ) => void;

    onUpdateTableStatus: (
      tableId: string,
      status: TableOccupancyStatus
    ) => void;

    onToggleMenuAvailability: (itemId: string) => void;
    onUpdateMenuPrice: (itemId: string, newPrice: number) => void;

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
    onLogout?: () => void;

    theme: 'dark' | 'light';
    toggleTheme: () => void;
  }

  const ROUTE_MAP: Record<TabId, string> = {
    kds: '/admin/kitchen',
    menu: '/admin/menu',
    analytics: '/admin/reports',
  };

  const NAV_ITEMS = [
    { id: 'kds' as const, label: 'Kitchen', icon: ChefHat },
    { id: 'menu' as const, label: 'Menu', icon: UtensilsCrossed },
    { id: 'analytics' as const, label: 'Reports', icon: BarChart3 },
  ];

  // Background image: file must be at  public/images/restaurant-bg.jpg
  const BG_IMAGE = "url('/images/restaurant-bg.jpg')";

  const PAGE_PADDING = 10;

  const getTabFromPath = (path: string): TabId => {
    const clean = path.replace(/\/+$/, '');

    if (clean === '/admin/menu') return 'menu';
    if (clean === '/admin/reports') return 'analytics';

    return 'kds';
  };

  export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    orders,
    menuItems,
    onUpdateOrderStatus,
    onToggleMenuAvailability,
    onUpdateMenuPrice,
    onAddMenuItem,
    onEditMenuItem,
    onSwitchToGuestView,
    theme,
    toggleTheme,
  }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const activeTab = getTabFromPath(location.pathname);
    const isDark = theme === 'dark';

    // Header is position: fixed, so we measure its height and
    // push the content down by the same amount.
    const headerRef = useRef<HTMLElement | null>(null);
    const [headerHeight, setHeaderHeight] = useState(74);

    useLayoutEffect(() => {
      const el = headerRef.current;
      if (!el) return;

      const update = () => setHeaderHeight(el.offsetHeight);
      update();

      if (typeof ResizeObserver === 'undefined') {
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
      }

      const observer = new ResizeObserver(update);
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    const pendingOrders = orders.filter(
      (order) =>
        order.status === 'received' ||
        order.status === 'preparing'
    ).length;

    const colors = {
      page: isDark ? '#211820' : '#FFF9FB',
      surface: isDark ? '#30252D' : '#FFFFFF',
      text: isDark ? '#FFF5F8' : '#1F1F1F',
      muted: isDark ? '#C6B8C0' : '#8A8A8A',
      border: isDark ? 'rgba(255,255,255,0.12)' : '#E7E7EB',
      pink: '#FF2457',
      pinkHover: '#FF4F78',
      pinkLight: isDark ? '#432632' : '#FFF0F4',
    };

    const activeItem =
      NAV_ITEMS.find((item) => item.id === activeTab) ??
      NAV_ITEMS[0];

    const ActiveIcon = activeItem.icon;

    const navButtonStyle = (
      active: boolean
    ): React.CSSProperties => ({
      minHeight: 40,
      padding: '8px 13px',
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      fontFamily: 'inherit',
      fontSize: 12,
      fontWeight: 800,
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      transition:
        'transform 180ms ease, box-shadow 180ms ease, background 180ms ease',
      background: active ? colors.pinkLight : colors.surface,
      color: active ? colors.pink : colors.text,
      border: active
        ? '1px solid rgba(255,36,87,0.18)'
        : `1px solid ${colors.border}`,
      boxShadow: active
        ? '0 4px 11px rgba(255,36,87,0.08)'
        : '0 3px 10px rgba(31,31,31,0.025)',
    });

    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          padding: PAGE_PADDING,
          backgroundColor: colors.page,
          // Lighter overlay so the restaurant image is clearly visible
          backgroundImage: isDark
            ? `
                linear-gradient(
                  rgba(33,24,32,0.70),
                  rgba(33,24,32,0.80)
                ),
                ${BG_IMAGE}
              `
            : `
                linear-gradient(
                  110deg,
                  rgba(255,249,251,0.80) 0%,
                  rgba(255,249,251,0.62) 48%,
                  rgba(255,240,244,0.42) 100%
                ),
                ${BG_IMAGE}
              `,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          color: colors.text,
          fontFamily:
            "'Flame', 'Fredoka', 'Outfit', 'Trebuchet MS', sans-serif",
          colorScheme: isDark ? 'dark' : 'light',
          boxSizing: 'border-box',
        }}
      >
        {/* FIXED TOP BAR - stays in place while content scrolls */}
        <header
          ref={headerRef}
          style={{
            position: 'fixed',
            top: PAGE_PADDING,
            left: PAGE_PADDING,
            right: PAGE_PADDING,
            zIndex: 50,
            padding: '8px 0',
            background: isDark
              ? colors.surface
              : 'linear-gradient(180deg, #FFFFFF 0%, #FFF9FB 100%)',
            border: `1px solid ${colors.border}`,
            borderRadius: 25,
            boxShadow: '0 4px 16px rgba(31,31,31,0.045)',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              minHeight: 58,
              padding: '5px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            {/* BRAND */}
            <div
              style={{
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 9,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: 43,
                  height: 43,
                  minWidth: 43,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 14,
                  background:
                    'linear-gradient(135deg, #FF2457, #FF4F78)',
                  color: '#FFFFFF',
                  boxShadow: '0 7px 17px rgba(255,36,87,0.24)',
                }}
              >
                <UtensilsCrossed size={22} strokeWidth={2.5} />
                <Sparkles
                  size={11}
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    color: 'rgba(255,255,255,0.95)',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    color: colors.text,
                    fontSize: 21,
                    lineHeight: 1,
                    fontWeight: 900,
                    letterSpacing: '-0.6px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Float
                  <span style={{ color: colors.pink }}>24/7</span>
                </span>

                <span
                  style={{
                    marginTop: 4,
                    color: colors.muted,
                    fontSize: 8,
                    fontWeight: 900,
                    letterSpacing: 1.4,
                    whiteSpace: 'nowrap',
                  }}
                >
                  GOOD FOOD · ANYTIME
                </span>
              </div>
            </div>

            {/* NAVIGATION */}
            <nav
              aria-label="Admin navigation"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexWrap: 'wrap',
                gap: 7,
              }}
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(ROUTE_MAP[item.id])}
                    aria-current={active ? 'page' : undefined}
                    style={navButtonStyle(active)}
                  >
                    <Icon size={17} strokeWidth={2.3} />
                    <span>{item.label}</span>

                    {item.id === 'kds' && pendingOrders > 0 && (
                      <span
                        style={{
                          minWidth: 18,
                          height: 18,
                          padding: '0 4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 999,
                          background: colors.pink,
                          color: '#FFFFFF',
                          fontSize: 10,
                          fontWeight: 900,
                        }}
                      >
                        {pendingOrders > 99 ? '99+' : pendingOrders}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* GUEST VIEW */}
              <button
                type="button"
                onClick={onSwitchToGuestView}
                style={navButtonStyle(false)}
                title="Open Guest View"
              >
                <ShieldCheck size={17} strokeWidth={2.3} />
                <span>Guest-Panel</span>
              </button>

              {/* THEME TOGGLE */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle dark/light mode"
                title="Toggle theme"
                style={{
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  borderRadius: 13,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: colors.surface,
                  color: colors.muted,
                  border: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  transition:
                    'transform 180ms ease, background 180ms ease',
                }}
              >
                {isDark ? (
                  <Sun size={17} strokeWidth={2.2} />
                ) : (
                  <Moon size={17} strokeWidth={2.2} />
                )}
              </button>
            </nav>
          </div>
        </header>

        {/* MAIN PAGE - pushed below the fixed header */}
        <main
          style={{
            width: '100%',
            maxWidth: 1800,
            margin: '0 auto',
            paddingTop: headerHeight + 22,
            paddingRight: 4,
            paddingBottom: 28,
            paddingLeft: 4,
            boxSizing: 'border-box',
          }}
        >
          {/* PAGE TITLE */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 14,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 13,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15,
                  background: colors.pinkLight,
                  color: colors.pink,
                  border: '1px solid rgba(255,36,87,0.08)',
                }}
              >
                <ActiveIcon size={23} strokeWidth={2.4} />
              </div>

              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 24,
                    lineHeight: 1.2,
                    fontWeight: 900,
                    letterSpacing: '-0.6px',
                  }}
                >
                  {activeItem.label}
                </h1>

                <p
                  style={{
                    margin: '5px 0 0',
                    color: colors.muted,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {activeTab === 'kds' &&
                    'Monitor and manage incoming orders'}
                  {activeTab === 'menu' &&
                    'Manage menu items, prices and availability'}
                  {activeTab === 'analytics' &&
                    'Review restaurant revenue and performance'}
                </p>
              </div>
            </div>
          </div>

          {/* EXISTING PAGE COMPONENTS */}
          <section style={{ width: '100%', minWidth: 0 }}>
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
              <AdminStats
                orders={orders}
                menuItems={menuItems}
              />
            )}
          </section>
        </main>
      </div>
    );
  };

  export default AdminDashboard;