import React, { useEffect, useState } from 'react';



import { useLocation, useNavigate } from 'react-router-dom';



import {



  ChefHat,



  UtensilsCrossed,



  BarChart3,



  ArrowLeft,



  LogOut,



  Sun,



  Moon,



  ChevronRight,



  Calendar,



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







  // LOGOUT (pass your existing logout handler from the parent)



  onLogout?: () => void;







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



  onLogout,



  theme,



  toggleTheme,



}) => {



  // Use the router instead of raw window.history so React Router (and App's



  // useLocation) stay in sync with the URL, and back/forward work correctly.



  const navigate = useNavigate();







  const { pathname } = useLocation();







  const activeTab = getTabFromPath(pathname);







  const navigateToTab = (tabId: TabId) => {



    navigate(ROUTE_MAP[tabId]);



  };







  // LOGOUT: clears saved auth data, runs the parent's onLogout (if given),



  // then reloads to the home route so any in-memory login state is reset too.



  const handleLogout = () => {



    if (!window.confirm('Are you sure you want to logout?')) {



      return;



    }







    const isAuthKey = (key: string) =>



      /token|auth|jwt|session|login/i.test(key) ||



      ['user', 'admin', 'adminUser', 'role'].includes(key);







    try {



      [window.localStorage, window.sessionStorage].forEach((store) => {



        Object.keys(store)



          .filter(isAuthKey)



          .forEach((key) => store.removeItem(key));



      });



    } catch {



      // storage can be blocked; continue with logout anyway



    }







    onLogout?.();







    window.location.replace('/');



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







  // CURRENT DATE / DAY / MONTH (updates every minute)



  const [now, setNow] = useState<Date>(new Date());







  useEffect(() => {



    const timer = setInterval(() => setNow(new Date()), 60 * 1000);



    return () => clearInterval(timer);



  }, []);







  const dayName = now.toLocaleDateString('en-IN', { weekday: 'long' });



  const dateNumber = now.getDate();



  const monthName = now.toLocaleDateString('en-IN', { month: 'long' });



  const yearNumber = now.getFullYear();







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



      description: 'Your Menu, Your Signature',



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















  return (



    <div



      className="admin-dashboard"



      data-theme={theme}



      style={{



        minHeight: '100vh',



        display: 'flex',



        background: 'var(--admin-page-bg)',



        color: 'var(--admin-text)',



        colorScheme: isDark ? 'dark' : 'light',



        ['--admin-page-bg' as any]: isDark ? '#171717' : '#F5F6FA',



        ['--admin-content-bg' as any]: isDark



          ? 'radial-gradient(circle at 90% 0%, rgba(255,36,87,.055), transparent 28%), #171717'



          : 'radial-gradient(circle at 90% 0%, rgba(255,36,87,.035), transparent 28%), #F5F6FA',



        ['--admin-sidebar-bg' as any]: isDark ? '#202020' : '#FFFFFF',



        ['--admin-text' as any]: isDark ? '#F5F6FA' : '#1f1f1f',



        ['--admin-text-secondary' as any]: isDark ? '#E7E7EB' : '#555555',



        ['--admin-muted' as any]: isDark ? '#8a8a8a' : '#8a8a8a',



        ['--admin-muted-strong' as any]: isDark ? '#8a8a8a' : '#8a8a8a',



        ['--admin-nav-text' as any]: isDark ? '#d8c8c0' : '#555555',



        ['--admin-nav-icon-bg' as any]: isDark ? '#2b2b2b' : '#FFE7ED',



        ['--admin-guest-bg' as any]: isDark ? '#252525' : '#FFE7ED',



        ['--admin-icon-surface' as any]: isDark ? '#252525' : '#ffffff',



        ['--admin-border' as any]: isDark ? 'rgba(255,255,255,.055)' : 'rgba(231,231,235,.09)',



        ['--admin-header-gradient' as any]: 'linear-gradient(135deg,#FF2457 0%,#FF2457 55%,#FF2457 100%)',
        ['--admin-header-height' as any]: isMobile ? '64px' : isTablet ? '72px' : '82px',



        fontFamily:



          "Poppins, Montserrat, Arial Rounded MT Bold, Trebuchet MS, sans-serif",



      }}



    >



      {/* ================= RESPONSIVE SIDEBAR ================= */}



      <aside



        style={{



          width: `${sidebarWidth}px`,



          height: isMobile ? 'calc(100vh - 64px)' : isTablet ? 'calc(100vh - 70px)' : 'calc(100vh - 76px)',



          position: 'fixed',



          top: isMobile ? '64px' : isTablet ? '70px' : '76px',



          left: 0,



          zIndex: 800,



          display: 'flex',



          flexDirection: 'column',



          background: 'var(--admin-sidebar-bg)',







          // SOFT BORDER



          borderRight: isDark



            ? '1px solid rgba(255,255,255,0.055)'



            : '1px solid rgba(231,231,235,0.09)',







          // VERY SOFT SHADOW



          boxShadow: isDark



            ? '4px 0 18px rgba(0,0,0,0.14)'



            : '4px 0 20px rgba(31,31,31,0.045)',







          overflowY: 'auto',



          overflowX: 'hidden',



          transition: 'width .25s ease',



          boxSizing: 'border-box',



        }}



      >



        {/* =========================================================



           BRAND



       \========================================================= */}







        <div



          style={{



            height: isMobile ? '70px' : '82px',



            padding: isCompact ? '0' : '0 17px',



            display: 'flex',



            alignItems: 'center',



            justifyContent: isCompact ? 'center' : 'flex-start',



            gap: '11px',



            borderBottom: isDark



              ? '1px solid rgba(255,255,255,0.05)'



              : '1px solid rgba(231,231,235,0.07)',



            flexShrink: 0,



          }}



        >



          {/* BRAND ICON */}



          <div



            style={{



              width: isMobile ? '40px' : '45px',



              height: isMobile ? '40px' : '45px',



              display: 'grid',



              placeItems: 'center',



              borderRadius: isMobile ? '12px' : '14px',



              background: 'linear-gradient(135deg,#FF2457,#E91E4D)',



              color: '#fff',



              fontSize: isMobile ? '19px' : '22px',



              boxShadow: '0 6px 16px rgba(223,36,5,0.16)',



              flexShrink: 0,



            }}



          >



            🍽️



          </div>







          {/* BRAND TEXT */}



          {!isCompact && (



            <div style={{ minWidth: 0 }}>



              <div



                style={{



                  color: '#FF2457',



                  fontSize: '20px',



                  fontWeight: 950,



                  lineHeight: 1,



                  letterSpacing: '-0.5px',



                }}



              >



                F•QR•247



              </div>







              <div



                style={{



                  marginTop: '6px',



                  color: isDark ? '#8a8a8a' : '#8a8a8a',



                  fontSize: '9px',



                  fontWeight: 800,



                  letterSpacing: '1px',



                }}



              >



                RESTAURANT ADMIN



              </div>



            </div>



          )}



        </div>







        {/* =========================================================



           NAVIGATION



       \========================================================= */}







        <nav



          style={{



            padding: isCompact ? '12px 7px' : '18px 11px',



            flex: 1,



          }}



        >



          {!isCompact && (



            <div



              style={{



                padding: '0 10px 9px',



                color: isDark ? '#8a8a8a' : '#8a8a8a',



                fontSize: '9px',



                fontWeight: 900,



                letterSpacing: '1.2px',



                textTransform: 'uppercase',



              }}



            >



              WORKSPACE



            </div>



          )}







          <div



            style={{



              display: 'flex',



              flexDirection: 'column',



              gap: '6px',



            }}



          >



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







                    /* SOFT BORDER */



                    border: active



                      ? '1px solid rgba(255,255,255,0.14)'



                      : '1px solid transparent',







                    borderRadius: isCompact ? '13px' : '14px',







                    background: active



                      ? 'linear-gradient(135deg,#FF2457,#E91E4D)'



                      : 'transparent',







                    color: active



                      ? '#fff'



                      : isDark



                        ? '#d8c8c0'



                        : '#555555',







                    cursor: 'pointer',







                    /* SOFT ACTIVE SHADOW */



                    boxShadow: active



                      ? '0 5px 14px rgba(255,36,87,0.14)'



                      : 'none',







                    transition:



                      'background .2s ease, box-shadow .2s ease, transform .2s ease',







                    boxSizing: 'border-box',



                    textAlign: 'left',



                  }}



                >



                  {/* ICON */}



                  <span



                    style={{



                      width: isMobile ? '36px' : '38px',



                      height: isMobile ? '36px' : '38px',



                      display: 'grid',



                      placeItems: 'center',



                      borderRadius: '11px',



                      background: active



                        ? 'rgba(255,255,255,0.16)'



                        : isDark



                          ? '#2b2b2b'



                          : '#FFE7ED',



                      color: active ? '#fff' : '#FF2457',



                      flexShrink: 0,



                      transition: 'background .2s ease',



                    }}



                  >



                    <Icon



                      size={isMobile ? 18 : 19}



                      strokeWidth={active ? 2.6 : 2.1}



                    />



                  </span>







                  {/* TEXT */}



                  {!isCompact && (



                    <span



                      style={{



                        flex: 1,



                        minWidth: 0,



                        display: 'flex',



                        flexDirection: 'column',



                        textAlign: 'left',



                      }}



                    >



                      <span



                        style={{



                          fontSize: '12px',



                          fontWeight: 900,



                          lineHeight: 1.1,



                        }}



                      >



                        {tab.label}



                      </span>







                      {tab.description && (



                        <span



                          style={{



                            marginTop: '4px',



                            fontSize: '8px',



                            fontWeight: 700,



                            opacity: active ? 0.82 : 0.55,



                            whiteSpace: 'nowrap',



                            overflow: 'hidden',



                            textOverflow: 'ellipsis',



                          }}



                        >



                          {tab.description}



                        </span>



                      )}



                    </span>



                  )}







                  {/* COUNT */}



                  {!isCompact && tab.count > 0 && (



                    <span



                      style={{



                        minWidth: '23px',



                        height: '23px',



                        padding: '0 6px',



                        display: 'grid',



                        placeItems: 'center',



                        borderRadius: '999px',



                        background: active ? '#FFE7ED' : '#FF2457',



                        color: active ? '#1f1f1f' : '#fff',



                        fontSize: '9px',



                        fontWeight: 900,



                      }}



                    >



                      {tab.count > 99 ? '99+' : tab.count}



                    </span>



                  )}







                  {/* ACTIVE ARROW */}



                  {!isCompact && active && (



                    <ChevronRight size={16} strokeWidth={2.8} />



                  )}



                </button>



              );



            })}



          </div>



        </nav>







        {/* =========================================================



           FOOTER



       \========================================================= */}







        <div



          style={{



            padding: isCompact ? '8px 7px' : '12px',



            borderTop: isDark



              ? '1px solid rgba(255,255,255,0.05)'



              : '1px solid rgba(231,231,235,0.07)',



          }}



        >



          {/* GUEST VIEW */}



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



              borderRadius: '12px',







              /* SOFT BORDER */



              border: '1px solid rgba(255,36,87,0.10)',







              background: isDark ? '#252525' : '#FFE7ED',



              color: '#FF2457',



              fontSize: '10px',



              fontWeight: 900,



              cursor: 'pointer',



              transition: 'background .2s ease, border-color .2s ease',



            }}



          >



            <ArrowLeft size={16} strokeWidth={2.5} />







            {!isCompact && 'Guest View'}



          </button>







          {/* LOGOUT */}



          <button



            type="button"



            onClick={handleLogout}



            title={isCompact ? 'Logout' : undefined}



            aria-label="Logout"



            style={{



              width: isCompact ? '42px' : '100%',



              height: isMobile ? '42px' : '43px',



              margin: isCompact ? '8px auto 0' : '8px 0 0',



              display: 'flex',



              alignItems: 'center',



              justifyContent: 'center',



              gap: isCompact ? '0' : '8px',



              borderRadius: '12px',



              border: '1px solid rgba(255,255,255,0.14)',



              background: 'linear-gradient(135deg,#FF2457,#E91E4D)',



              color: '#fff',



              fontSize: '10px',



              fontWeight: 900,



              cursor: 'pointer',



              boxShadow: '0 5px 14px rgba(255,36,87,0.16)',



              transition: 'transform .2s ease, box-shadow .2s ease',



            }}



          >



            <LogOut size={16} strokeWidth={2.5} />







            {!isCompact && 'Logout'}



          </button>



        </div>



      </aside>







      {/* ================= MAIN ================= */}



      <div



        style={{



          marginLeft: `${sidebarWidth}px`,



          width: `calc(100% - ${sidebarWidth}px)`,



          minWidth: 0,



          minHeight: isMobile ? 'calc(100vh - 64px)' : isTablet ? 'calc(100vh - 70px)' : 'calc(100vh - 76px)',



          transition: 'margin-left .25s ease, width .25s ease',



          boxSizing: 'border-box',



        }}



      >



        {/* ================= PREMIUM HEADER ================= */}



        <header
          style={{
            height: isMobile ? '64px' : isTablet ? '70px' : '76px',
            width: '100%',
            margin: 0,
            padding: isMobile ? '0 12px' : '0 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            background: '#FF2457',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.16)',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.22)',
            borderRadius: 0,
            boxShadow: '0 3px 12px rgba(255,36,87,0.12)',
            position: 'sticky',
            top: 0,
            zIndex: 900,
            boxSizing: 'border-box',
            overflow: 'hidden',
            fontFamily: '"Poppins", "Montserrat", "Arial Rounded MT Bold", "Trebuchet MS", sans-serif',
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



                  <div style={{ marginTop: '4px', color: 'rgba(255,255,255,.72)', fontFamily: '"Poppins", "Montserrat", "Arial Rounded MT Bold", "Trebuchet MS", sans-serif', fontSize: isTablet ? '9px' : '10px', fontWeight: 700, letterSpacing: '.25px' }}>



                    Float247 • Restaurant Admin



                  </div>



                )}



              </div>



            </div>



          </div>







          {/* RIGHT — DATE + LIVE + THEME */}



          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '5px' : '9px', flexShrink: 0 }}>



            {/* ================= DATE / DAY / MONTH (Wednesday, 7 October 2026) ================= */}



            <div



              title={`${dayName}, ${dateNumber} ${monthName} ${yearNumber}`}



              style={{



                height: isMobile ? '36px' : isTablet ? '40px' : '44px',



                padding: isMobile ? '0 8px' : '0 14px',



                display: 'flex',



                alignItems: 'center',



                gap: '8px',



                borderRadius: isMobile ? '12px' : '15px',



                background: 'rgba(255,255,255,.12)',



                border: '1px solid rgba(255,255,255,.20)',



                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.22), 0 4px 12px rgba(31,31,31,.14)',



                backdropFilter: 'blur(6px)',



                color: '#fff',



                fontFamily: '"Poppins", "Montserrat", "Arial Rounded MT Bold", "Trebuchet MS", sans-serif',



                boxSizing: 'border-box',



                whiteSpace: 'nowrap',



                flexShrink: 0,



              }}



            >



              <div



                style={{



                  width: isMobile ? '28px' : '32px',



                  height: isMobile ? '28px' : '32px',



                  borderRadius: '9px',



                  background: '#FFFFFF',



                  display: 'grid',



                  placeItems: 'center',



                  color: '#FF2457',



                  boxShadow: '0 3px 8px rgba(31,31,31,.25)',



                  flexShrink: 0,



                }}



              >



                <Calendar size={isMobile ? 15 : 17} strokeWidth={2.2} />



              </div>







              <span



                style={{



                  fontSize: isMobile ? '12px' : isTablet ? '13px' : '14px',



                  fontWeight: 800,



                  letterSpacing: '.1px',



                  color: '#ffffff',



                  textShadow: '0 1px 2px rgba(31,31,31,.25)',



                }}



              >



                {dayName}, {dateNumber} {monthName} {yearNumber}



              </span>



            </div>







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



                background: 'rgba(255,255,255,.12)',



                border: '1px solid rgba(255,255,255,.14)',



                color: '#fff',



                fontFamily: '"Poppins", "Montserrat", "Arial Rounded MT Bold", "Trebuchet MS", sans-serif',



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



                background: 'rgba(255,255,255,.12)',



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



            background: 'var(--admin-content-bg)',



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



                  background: 'var(--admin-icon-surface)',



                  color: '#FF2457',



                  border: '1px solid var(--admin-border)',



                }}



              >



                <ActiveIcon size={14} />



              </div>







              {activeTabData.description && (



                <span



                  style={{



                    fontSize: '11px',



                    fontWeight: 900,



                    color: 'var(--admin-text-secondary)',



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