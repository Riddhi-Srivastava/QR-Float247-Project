import React, { useMemo, useState } from 'react';















import {







  CheckCircle,







  Clock,







  ArrowRight,







  ArrowLeft,







  ArrowUpRight,







  UserRound,







  Search,







  CalendarDays,







  ArrowUpDown,







  LayoutGrid,







  List,







  Moon,







  Sun,







  Activity,







  ChefHat,







  ChevronDown,







  X,







} from 'lucide-react';















import { Order, OrderStatus } from '../../types/restaurant';















interface KitchenKDSProps {







  orders: Order[];







  onUpdateOrderStatus: (







    orderId: string,







    status: OrderStatus







  ) => void;







  /** Optional – shown under the "Kitchen" title when provided */







  restaurantName?: string;







  /** Render the built-in red header. Keep false when your app shell already has one */







  showHeader?: boolean;







  /** Optional – drive dark mode from the parent (e.g. your app's theme toggle) */







  darkMode?: boolean;







}















const PAGE_SIZE = 10;















const DATE_LABELS = {







  all: 'All Time',







  today: 'Today',







  week: 'Last 7 Days',







} as const;















type DateFilter = keyof typeof DATE_LABELS;















/* Display only – falls back to the raw value if it isn't a valid date */







const formatTime = (value: unknown): string => {







  const d = new Date(value as any);







  if (Number.isNaN(d.getTime())) return String(value ?? '');







  return d.toLocaleString(undefined, {







    day: '2-digit',







    month: 'short',







    hour: '2-digit',







    minute: '2-digit',







  });







};















export const KitchenKDS: React.FC<KitchenKDSProps> = ({







  orders,







  onUpdateOrderStatus,







  restaurantName,







  showHeader = false,







  darkMode,







}) => {







  /* ---------- UI-only state ---------- */







  const [search, setSearch] = useState('');







  const [dateFilter, setDateFilter] = useState<DateFilter>('all');







  const [sortOrder, setSortOrder] = useState<'earliest' | 'latest'>(







    'earliest'







  );







  const [view, setView] = useState<'grid' | 'list'>('grid');







  const [localDark, setLocalDark] = useState(false);







  const dark = darkMode ?? localDark;







  const [pages, setPages] = useState<Record<string, number>>({});







  const [activeTab, setActiveTab] = useState<OrderStatus>('received');















  /* ---------- ORIGINAL LOGIC (unchanged) ---------- */







  const columns: {







    status: OrderStatus;







    label: string;







    icon: string;







    count: number;







    accent: string;







  }[] = [







      {







        status: 'received',







        label: 'New Orders',







        icon: '🛎️',







        count: orders.filter(o => o.status === 'received').length,







        accent: '#FF2457',







      },







      {







        status: 'ready',







        label: 'Ready to Serve',







        icon: '🍽️',







        count: orders.filter(o => o.status === 'ready').length,







        accent: '#22A06B',







      },







      {







        status: 'completed',







        label: 'Completed',







        icon: '✨',







        count: orders.filter(o => o.status === 'completed').length,







        accent: '#8A8A8A',







      },







    ];















  const getNextStatus = (







    current: OrderStatus







  ): OrderStatus | null => {







    if (current === 'received') return 'ready';







    if (current === 'ready') return 'completed';















    return null;







  };















  const getNextActionLabel = (







    current: OrderStatus







  ): string => {







    if (current === 'received') return 'Mark Ready';







    if (current === 'ready') return 'Complete';















    return 'Completed';







  };







  /* ---------- END ORIGINAL LOGIC ---------- */















  /* ---------- search / date / sort (view layer only) ---------- */







  const hasFilter = search.trim() !== '' || dateFilter !== 'all';















  const visibleOrders = useMemo(() => {







    const q = search.trim().toLowerCase();







    const now = Date.now();







    const startOfToday = new Date();







    startOfToday.setHours(0, 0, 0, 0);















    return orders







      .filter(o => {







        if (q) {







          const hay = `${o.tableNumber} ${o.tokenNumber} ${o.customerName}`.toLowerCase();







          if (!hay.includes(q)) return false;







        }







        if (dateFilter !== 'all') {







          const ts = new Date(o.createdAt as any).getTime();







          if (Number.isNaN(ts)) return false;







          if (dateFilter === 'today' && ts < startOfToday.getTime())







            return false;







          if (dateFilter === 'week' && now - ts > 7 * 86400000)







            return false;







        }







        return true;







      })







      .sort((a, b) => {







        const diff =







          new Date(a.createdAt as any).getTime() -







          new Date(b.createdAt as any).getTime();







        return sortOrder === 'earliest' ? diff : -diff;







      });







  }, [orders, search, dateFilter, sortOrder]);















  const statCards: {







    key: string;







    title: string;







    value: number;







    sub: string;







    icon: string;







    accent: string;







    target?: OrderStatus;







  }[] = [







      {







        key: 'received',







        title: 'New Orders',







        value: columns[0].count,







        sub: 'Received from customers',







        icon: '🛎️',







        accent: '#FF2457',







        target: 'received',







      },







      {







        key: 'ready',







        title: 'Ready to Serve',







        value: columns[1].count,







        sub: 'Ready for pickup',







        icon: '🍽️',







        accent: '#22A06B',







        target: 'ready',







      },







      {







        key: 'completed',







        title: 'Completed',







        value: columns[2].count,







        sub: 'Successfully served',







        icon: '✨',







        accent: '#8A8A8A',







        target: 'completed',







      },







      {







        key: 'total',







        title: 'Total Orders',







        value: orders.length,







        sub: 'All orders',







        icon: '🕒',







        accent: '#F5A623',







      },







    ];















  const openColumn = (status: OrderStatus) => {







    setActiveTab(status);







    setView('grid');







  };















  /* ---------- ORDER CARD (same data & handler as before) ---------- */







  const renderOrder = (order: Order, accent: string) => {







    const nextStatus = getNextStatus(order.status);















    return (







      <article







        key={order.orderId}







        className="kds-card"







        style={{ ['--accent' as any]: accent }}







      >







        <div className="kds-card-stripe" />















        <div className="kds-card-body">







          {/* TABLE / TOKEN / TIME */}







          <div className="kds-row kds-between">







            <div className="kds-row kds-gap4">







              <span className="kds-chip kds-chip-table">







                T-{order.tableNumber}







              </span>







              <span className="kds-chip kds-chip-token">







                \#{order.tokenNumber}







              </span>







            </div>















            <div className="kds-time">







              <Clock size={11} />







              {formatTime(order.createdAt)}







            </div>







          </div>















          {/* GUEST */}







          <div className="kds-guest">







            <div className="kds-row kds-gap6 kds-min0">







              <div className="kds-avatar">







                <UserRound size={14} />







              </div>







              <div className="kds-min0">







                <div className="kds-label">Guest</div>







                <div className="kds-guest-name">







                  {order.customerName}







                </div>







              </div>







            </div>















            <span className="kds-pay">{order.paymentMethod}</span>







          </div>















          {/* ORDERED ITEMS */}







          <div className="kds-items">







            {order.items?.map((item: any, idx: number) => {







              const itemName =







                item?.item?.name ||







                item?.food?.name ||







                item?.name ||







                'Unknown Item';















              const variant = item?.customization?.selectedVariant;















              const addons =







                item?.customization?.selectedAddons || [];















              return (







                <div







                  key={item?.id || item?.cartItemId || idx}







                  className="kds-item"







                >







                  <span className="kds-qty">







                    {item?.quantity || 0}x







                  </span>















                  <div className="kds-item-info">







                    <div className="kds-item-name">{itemName}</div>















                    {variant?.name && (







                      <div className="kds-item-variant">







                        Size: {variant.name}







                      </div>







                    )}















                    {addons.map((addon: any) => (







                      <div key={addon.id} className="kds-item-addon">







                        \+ {addon.name}







                      </div>







                    ))}







                  </div>















                  <CheckCircle







                    size={15}







                    color="#16834b"







                    style={{ flexShrink: 0 }}







                  />







                </div>







              );







            })}







          </div>















          {/* SPECIAL NOTE */}







          {order.specialNotes && (







            <div className="kds-note">⚠️ {order.specialNotes}</div>







          )}















          {/* FOOTER */}







          <div className="kds-footer">







            <div>







              <div className="kds-label">Total</div>







              <div className="kds-total">₹{order.total}</div>







            </div>















            {nextStatus ? (







              <button







                type="button"







                className="kds-action"







                onClick={() =>







                  onUpdateOrderStatus(order.orderId, nextStatus)







                }







              >







                {getNextActionLabel(order.status)}







                <ArrowRight size={13} />







              </button>







            ) : (







              <span className="kds-done">







                <CheckCircle size={14} />







                Completed







              </span>







            )}







          </div>







        </div>







      </article>







    );







  };















  /* ---------- PAGE ---------- */







  return (







    <div className={`kds ${dark ? 'kds-dark' : ''}`}>







      <style>{CSS}</style>















      {/* TOP BAR (optional – hidden when the app shell already has a header) */}







      {showHeader && (







        <header className="kds-header">







          <div className="kds-row kds-gap10 kds-min0">







            <ChefHat size={30} />







            <div className="kds-min0">







              <div className="kds-title">







                Kitchen







                <ArrowRight size={14} />







                <Activity size={17} />







              </div>







              {restaurantName && (







                <div className="kds-subtitle">{restaurantName}</div>







              )}







            </div>







          </div>















          <div className="kds-row kds-gap8">







            <div className="kds-live">







              <span className="kds-live-dot" />







              <span className="kds-live-text">LIVE SYSTEM</span>







            </div>















            <button







              type="button"







              className="kds-icon-btn"







              onClick={() => setLocalDark(d => !d)}







              aria-label="Toggle theme"







            >







              {dark ? <Sun size={18} /> : <Moon size={18} />}







            </button>







          </div>







        </header>







      )}















      <div className={`kds-body ${view === 'list' ? 'kds-body-list' : ''}`}>







        {/* STAT CARDS */}







        <div className="kds-stats">







          {statCards.map(s => {







            const Tag: any = s.target ? 'button' : 'div';







            return (







              <Tag







                key={s.key}







                type={s.target ? 'button' : undefined}







                className={`kds-stat ${s.target ? 'kds-stat-click' : ''}`}







                style={{ ['--accent' as any]: s.accent }}







                onClick={s.target ? () => openColumn(s.target!) : undefined}







              >







                <div className="kds-stat-icon">{s.icon}</div>







                <div className="kds-min0 kds-left">







                  <div className="kds-stat-title">{s.title}</div>







                  <div className="kds-stat-value">{s.value}</div>







                  <div className="kds-stat-sub">{s.sub}</div>







                </div>







                {s.target && (







                  <span className="kds-stat-arrow">







                    <ArrowUpRight size={13} />







                  </span>







                )}







              </Tag>







            );







          })}







        </div>















        {/* TOOLBAR */}







        <div className="kds-toolbar">







          <label className="kds-search kds-a-search">







            <Search size={16} />







            <input







              value={search}







              onChange={e => setSearch(e.target.value)}







              placeholder="Search by table, token or customer..."







            />







            {search && (







              <button







                type="button"







                className="kds-clear"







                onClick={() => setSearch('')}







                aria-label="Clear search"







              >







                <X size={14} />







              </button>







            )}







          </label>















          <div className="kds-select kds-a-date">







            <CalendarDays size={16} />







            <span className="kds-select-label">Order Date</span>







            <select







              value={dateFilter}







              onChange={e => setDateFilter(e.target.value as DateFilter)}







              aria-label="Order date"







            >







              {(Object.keys(DATE_LABELS) as DateFilter[]).map(k => (







                <option key={k} value={k}>







                  {DATE_LABELS[k]}







                </option>







              ))}







            </select>







            <ChevronDown size={14} className="kds-caret" />







          </div>















          <div className="kds-select kds-a-sort">







            <ArrowUpDown size={16} />







            <select







              value={sortOrder}







              onChange={e => setSortOrder(e.target.value as any)}







              aria-label="Sort orders"







            >







              <option value="earliest">Earliest First</option>







              <option value="latest">Latest First</option>







            </select>







            <ChevronDown size={14} className="kds-caret" />







          </div>















          <div className="kds-toggle kds-a-toggle">







            {(['grid', 'list'] as const).map(v => (







              <button







                key={v}







                type="button"







                onClick={() => setView(v)}







                aria-label={`${v} view`}







                aria-pressed={view === v}







                className={view === v ? 'is-on' : ''}







              >







                {v === 'grid' ? <LayoutGrid size={16} /> : <List size={16} />}







              </button>







            ))}







          </div>







        </div>















        {/* MOBILE TABS (grid view only) */}







        {view === 'grid' && (







          <div className="kds-tabs" role="tablist">







            {columns.map(col => (







              <button







                key={col.status}







                type="button"







                role="tab"







                aria-selected={activeTab === col.status}







                className={activeTab === col.status ? 'is-on' : ''}







                style={{ ['--accent' as any]: col.accent }}







                onClick={() => setActiveTab(col.status)}







              >







                <span className="kds-tab-full">{col.label}</span>







                <span className="kds-tab-short">







                  {col.status === 'received'







                    ? 'New'







                    : col.status === 'ready'







                      ? 'Ready'







                      : 'Done'}







                </span>







                <b>{col.count}</b>







              </button>







            ))}







          </div>







        )}















        {/* COLUMNS */}







        <div className={`kds-cols kds-cols-${view}`}>







          {columns.map(col => {







            const colOrders = visibleOrders.filter(







              order => order.status === col.status







            );















            const totalPages = Math.max(







              1,







              Math.ceil(colOrders.length / PAGE_SIZE)







            );







            const page = Math.min(pages[col.status] || 1, totalPages);







            const pageOrders = colOrders.slice(







              (page - 1) * PAGE_SIZE,







              page * PAGE_SIZE







            );







            const setPage = (p: number) =>







              setPages(prev => ({ ...prev, [col.status]: p }));















            return (







              <section







                key={col.status}







                className={`kds-col ${view === 'grid' && activeTab === col.status ? 'is-active' : ''







                  }`}







                style={{ ['--accent' as any]: col.accent }}







              >







                {/* COLUMN HEADER */}







                <div className="kds-col-head">







                  <div className="kds-row kds-gap8">







                    <span className="kds-col-icon">{col.icon}</span>







                    <span className="kds-col-title">{col.label}</span>







                  </div>







                  <span className="kds-badge">{col.count}</span>







                </div>















                {/* ORDERS LIST */}







                <div className="kds-list">







                  {pageOrders.length === 0 ? (







                    <div className="kds-empty">







                      <div className="kds-empty-icon">{col.icon}</div>







                      <div className="kds-empty-title">







                        {hasFilter ? 'No matching orders' : 'No orders here'}







                      </div>







                      <div className="kds-empty-sub">







                        {hasFilter







                          ? 'Try changing the search or date filter'







                          : col.status === 'received'







                            ? 'New orders will appear here as they come in from customers'







                            : col.status === 'ready'







                              ? 'Ready to serve orders will appear here when items are prepared'







                              : 'Completed orders will appear here'}







                      </div>







                    </div>







                  ) : (







                    pageOrders.map(order => renderOrder(order, col.accent))







                  )}







                </div>















                {/* PAGINATION */}







                <div className="kds-pager">







                  <button







                    type="button"







                    disabled={page <= 1}







                    onClick={() => setPage(page - 1)}







                  >







                    <ArrowLeft size={13} />







                    Previous







                  </button>















                  <span className="kds-page">







                    {page} / {totalPages}







                  </span>















                  <button







                    type="button"







                    disabled={page >= totalPages}







                    onClick={() => setPage(page + 1)}







                  >







                    Next







                    <ArrowRight size={13} />







                  </button>







                </div>







              </section>







            );







          })}







        </div>







      </div>







    </div>







  );







};















/* ====================== STYLES ====================== */



const CSS = `

.kds{

  --bg:#F5F6FA;

  --panel:#FFFFFF;

  --card:#FFFFFF;

  --col:#FCFCFE;

  --text:#1F1F1F;

  --sub:#8A8A8A;

  --muted:#A2A2A8;

  --border:#E9E9EE;

  --border-soft:#F0DDE3;

  --input:#FAFAFC;

  --pink:#FF2457;

  --pink-dark:#E91E4D;

  --pink-soft:#FFE7ED;

  --pink-wash:#FFF6F8;

  --guest:#FFF8FA;

  --guest-b:#F8D9E1;

  --item:#F7FCF9;

  --item-b:#D8EEE2;

  --note:#FFF9EC;

  --note-b:#F0DEAD;

  container-type:inline-size;

  container-name:kds;

  width:100%;

  height:100%;

  min-width:0;

  display:flex;

  flex-direction:column;

  background:var(--bg);

  color:var(--text);

  box-sizing:border-box;

  overflow:hidden;

  border-radius:20px;

  font-family:"Flame","Arial Rounded MT Bold","Trebuchet MS",system-ui,sans-serif;

}



.kds *{box-sizing:border-box}

.kds button,.kds input,.kds select{font-family:inherit}

.kds button{cursor:pointer}

.kds button:focus-visible,.kds select:focus-visible,.kds input:focus-visible{

  outline:2px solid var(--pink);

  outline-offset:2px;

}



.kds-dark{

  --bg:#171717;

  --panel:#202020;

  --card:#252525;

  --col:#1D1D1D;

  --text:#F7F7F7;

  --sub:#A0A0A0;

  --muted:#8A8A8A;

  --border:#383838;

  --border-soft:#4A3139;

  --input:#292929;

  --pink-soft:#3B2029;

  --pink-wash:#2A1B20;

  --guest:#302228;

  --guest-b:#56313D;

  --item:#20362B;

  --item-b:#315B43;

  --note:#3A311A;

  --note-b:#5A4C25;

}



.kds-row{display:flex;align-items:center}

.kds-between{justify-content:space-between;gap:8px}

.kds-gap4{gap:4px}.kds-gap6{gap:6px}.kds-gap8{gap:8px}.kds-gap10{gap:10px}

.kds-min0{min-width:0}.kds-left{text-align:left}



/* Optional internal header — normally supplied by the app shell. */

.kds-header{

  flex-shrink:0;

  display:flex;

  align-items:center;

  justify-content:space-between;

  gap:12px;

  padding:11px 16px;

  min-height:70px;

  color:#fff;

  background:var(--pink);

  border-bottom:1px solid rgba(255,255,255,.18);

  box-shadow:0 8px 24px rgba(255,36,87,.13);

}

.kds-title{

  display:flex;

  align-items:center;

  gap:9px;

  font-size:20px;

  font-weight:900;

  line-height:1.1;

}

.kds-title>svg:first-child{

  width:40px;height:40px;padding:9px;border-radius:13px;

  background:rgba(255,255,255,.13);

  border:1px solid rgba(255,255,255,.22);

}

.kds-subtitle{font-size:11px;font-weight:650;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.kds-live{

  display:flex;align-items:center;gap:7px;padding:9px 13px;border-radius:999px;

  background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.22);

  font-size:10px;font-weight:900;white-space:nowrap;letter-spacing:.4px;

}

.kds-live-dot{width:9px;height:9px;border-radius:50%;background:#55E68A;box-shadow:0 0 0 3px rgba(85,230,138,.18)}

.kds-icon-btn{

  width:38px;height:38px;display:grid;place-items:center;

  border:1px solid rgba(255,255,255,.25);border-radius:50%;

  background:rgba(255,255,255,.08);color:#fff;

}

.kds-icon-btn:hover{background:rgba(255,255,255,.16)}



/* Main workspace */

.kds-body{

  flex:1;

  min-height:0;

  display:flex;

  flex-direction:column;

  gap:12px;

  padding:12px 14px 14px;

  overflow:hidden;

}

.kds-body-list{overflow-y:auto}



/* Summary cards */

.kds-stats{

  flex-shrink:0;

  display:grid;

  grid-template-columns:repeat(4,minmax(0,1fr));

  gap:12px;

}

.kds-stat{

  position:relative;

  display:flex;

  align-items:center;

  gap:12px;

  min-width:0;

  width:100%;

  padding:13px 14px;

  border:1px solid var(--border);

  border-radius:16px;

  background:var(--panel);

  color:var(--text);

  font:inherit;

  text-align:left;

  box-shadow:0 3px 12px rgba(31,31,31,.035);

  transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;

}

.kds-stat::before{

  content:"";

  position:absolute;

  left:-1px;top:14px;bottom:14px;width:3px;

  border-radius:0 4px 4px 0;

  background:var(--accent);

}

.kds-stat-click:hover{

  transform:translateY(-2px);

  border-color:#F2B8C6;

  box-shadow:0 9px 24px rgba(255,36,87,.08);

}

.kds-stat-icon{

  width:48px;height:48px;flex:0 0 48px;

  display:grid;place-items:center;

  border-radius:14px;

  background:color-mix(in srgb,var(--accent) 10%,white);

  color:var(--accent);

  font-size:21px;

  border:1px solid color-mix(in srgb,var(--accent) 10%,white);

}

.kds-stat-title{font-size:12px;font-weight:850;color:var(--text);padding-right:18px;line-height:1.2}

.kds-stat-value{margin-top:2px;font-size:25px;font-weight:950;line-height:1.05;color:var(--accent)}

.kds-stat-sub{margin-top:3px;font-size:10px;color:var(--sub);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.kds-stat-arrow{

  position:absolute;top:10px;right:10px;

  width:25px;height:25px;display:grid;place-items:center;

  border-radius:50%;background:var(--pink-soft);color:var(--accent);

}



/* Search / filter toolbar */

.kds-toolbar{

  flex-shrink:0;

  display:flex;align-items:center;gap:8px;

  padding:7px;

  border:1px solid var(--border);

  border-radius:14px;

  background:var(--panel);

  box-shadow:0 3px 12px rgba(31,31,31,.03);

}

.kds-search{

  flex:1 1 220px;min-width:0;height:40px;

  display:flex;align-items:center;gap:8px;padding:0 12px;

  border:1px solid var(--border);border-radius:11px;

  background:var(--input);color:var(--sub);

  transition:border-color .16s ease,box-shadow .16s ease,background .16s ease;

}

.kds-search:focus-within{

  background:var(--panel);border-color:#FFB8C7;

  box-shadow:0 0 0 3px rgba(255,36,87,.06);

  color:var(--pink);

}

.kds-search input{flex:1;min-width:0;border:none;outline:none;background:transparent;color:var(--text);font-size:12px}

.kds-search input::placeholder{color:#A3A3AA}

.kds-clear{border:none;background:transparent;color:var(--sub);display:grid;place-items:center;padding:4px}

.kds-select{

  position:relative;height:40px;display:flex;align-items:center;gap:7px;

  padding:0 29px 0 12px;border:1px solid var(--border);border-radius:11px;

  background:var(--panel);color:var(--text);font-size:11px;font-weight:750;

}

.kds-select:hover{border-color:#F2B8C6}

.kds-select-label{white-space:nowrap;color:var(--sub);font-weight:700}

.kds-select select{

  appearance:none;-webkit-appearance:none;border:none;outline:none;

  background:transparent;color:var(--text);font:inherit;font-weight:850;

  cursor:pointer;padding-right:4px;min-width:0;

}

.kds-select select option{color:#222;background:#fff}

.kds-caret{position:absolute;right:9px;top:50%;transform:translateY(-50%);pointer-events:none}

.kds-toggle{display:flex;gap:4px}

.kds-toggle button{

  width:40px;height:40px;display:grid;place-items:center;

  border:1px solid var(--border);border-radius:11px;

  background:var(--panel);color:var(--sub);

  transition:.16s ease;

}

.kds-toggle button:hover{border-color:#F2B8C6;color:var(--pink)}

.kds-toggle button.is-on{

  background:var(--pink);border-color:var(--pink);color:#fff;

  box-shadow:0 5px 14px rgba(255,36,87,.16);

}



/* Mobile status tabs */

.kds-tabs{display:none;flex-shrink:0;gap:6px}

.kds-tabs button{

  flex:1;min-width:0;display:flex;align-items:center;justify-content:center;gap:6px;

  padding:9px 7px;border-radius:11px;border:1px solid var(--border);

  background:var(--panel);color:var(--text);font-size:11px;font-weight:850;white-space:nowrap;

}

.kds-tab-short{display:none}

.kds-tabs button b{min-width:21px;padding:3px 6px;border-radius:999px;background:var(--accent);color:#fff;font-size:10px}

.kds-tabs button.is-on{border-color:#FFB8C7;background:var(--pink-soft);box-shadow:inset 0 -2px 0 var(--pink);color:#C91945}



/* KDS columns */

.kds-cols{flex:1;min-height:0;display:grid;gap:12px}

.kds-cols-grid{grid-template-columns:repeat(3,minmax(0,1fr))}

.kds-cols-list{grid-template-columns:minmax(0,1fr);flex:none}

.kds-col{

  min-width:0;min-height:0;display:flex;flex-direction:column;

  background:var(--col);border:1px solid var(--border);

  border-top:3px solid var(--accent);border-radius:16px;overflow:hidden;

  box-shadow:0 4px 16px rgba(31,31,31,.035);

}

.kds-col-head{

  flex-shrink:0;display:flex;align-items:center;justify-content:space-between;

  padding:11px 13px;background:var(--panel);border-bottom:1px solid var(--border);

}

.kds-col-icon{

  width:34px;height:34px;display:grid;place-items:center;border-radius:11px;

  background:color-mix(in srgb,var(--accent) 10%,white);

  color:var(--accent);font-size:16px;

}

.kds-col-title{font-size:13px;font-weight:900;color:var(--text)}

.kds-badge{min-width:29px;height:23px;padding:0 8px;display:grid;place-items:center;border-radius:999px;background:var(--accent);color:#fff;font-size:10px;font-weight:900}

.kds-list{flex:1;min-height:0;overflow-y:auto;padding:8px;display:flex;flex-direction:column;gap:8px}

.kds-list::-webkit-scrollbar{width:5px}

.kds-list::-webkit-scrollbar-thumb{background:#E6DCE0;border-radius:999px}

.kds-cols-list .kds-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));align-content:start;overflow:visible}

.kds-cols-list .kds-empty{grid-column:1/-1}



/* Empty state */

.kds-empty{

  flex:1;min-height:170px;display:flex;flex-direction:column;

  align-items:center;justify-content:center;text-align:center;gap:5px;padding:18px;

}

.kds-empty-icon{

  width:62px;height:62px;display:grid;place-items:center;border-radius:18px;

  background:var(--pink-soft);color:var(--pink);font-size:28px;margin-bottom:5px;

  border:1px solid #FFD1DC;

}

.kds-empty-title{font-size:15px;font-weight:900;color:var(--text)}

.kds-empty-sub{font-size:11px;color:var(--sub);max-width:270px;line-height:1.45}



/* Pagination */

.kds-pager{

  flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:8px;

  padding:8px 10px;background:var(--panel);border-top:1px solid var(--border);

}

.kds-pager button{

  display:flex;align-items:center;gap:5px;padding:7px 11px;border:1px solid transparent;

  border-radius:9px;background:var(--pink);color:#fff;font-size:10px;font-weight:850;

  transition:.16s ease;

}

.kds-pager button:hover:not(:disabled){background:var(--pink-dark);box-shadow:0 4px 10px rgba(255,36,87,.13)}

.kds-pager button:disabled{background:var(--input);color:var(--sub);cursor:not-allowed;border-color:var(--border)}

.kds-page{font-size:11px;font-weight:900;color:var(--sub)}



/* Order cards */

.kds-card{

  flex-shrink:0;background:var(--card);border:1px solid var(--border);

  border-left:3px solid var(--accent,var(--border));border-radius:13px;overflow:hidden;

  box-shadow:0 2px 8px rgba(31,31,31,.045);

  transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease;

}

.kds-card:hover{

  transform:translateY(-1px);

  border-color:#F0D5DC;

  box-shadow:0 8px 20px rgba(255,36,87,.065);

}

.kds-card-stripe{height:2px;background:color-mix(in srgb,var(--accent) 80%,white)}

.kds-card-body{padding:8px 9px 9px;display:flex;flex-direction:column;gap:6px}

.kds-chip{padding:4px 8px;border-radius:7px;font-size:9px;font-weight:900;white-space:nowrap;line-height:1.35}

.kds-chip-table{background:var(--pink);color:#fff}

.kds-chip-token{background:var(--pink-soft);color:#C91945}

.kds-time{display:flex;align-items:center;gap:3px;color:var(--sub);font-size:9px;font-weight:650;white-space:nowrap}

.kds-guest{

  display:flex;align-items:center;justify-content:space-between;gap:6px;

  padding:5px 6px;border-radius:9px;background:var(--guest);border:1px solid var(--guest-b)

}

.kds-avatar{width:23px;height:23px;flex-shrink:0;display:grid;place-items:center;border-radius:50%;background:var(--pink-soft);color:var(--pink)}

.kds-avatar svg{width:11px;height:11px}

.kds-label{font-size:8px;color:var(--sub);font-weight:700;text-transform:uppercase;letter-spacing:.3px;line-height:1.1}

.kds-guest-name{font-size:11px;font-weight:850;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.kds-guest .kds-label{display:none}

.kds-pay{flex-shrink:0;padding:3px 7px;border-radius:6px;background:var(--card);border:1px solid var(--border);font-size:8px;font-weight:900;text-transform:uppercase}

.kds-items{display:flex;flex-direction:column;gap:4px}

.kds-item{display:flex;align-items:center;gap:6px;padding:5px 6px;border-radius:8px;background:var(--item);border:1px solid var(--item-b)}

.kds-qty{min-width:24px;padding:3px 4px;border-radius:6px;background:#22A06B;color:#fff;text-align:center;font-size:9px;font-weight:900;line-height:1.35}

.kds-item-info{flex:1;min-width:0}

.kds-item-name{font-size:10.5px;font-weight:850;color:#187A4D;line-height:1.25;word-break:break-word}

.kds-item-variant{font-size:8px;color:#628370;font-weight:600;line-height:1.2}

.kds-item-addon{font-size:8px;color:var(--pink);font-weight:800;line-height:1.2}

.kds-item svg{width:13px;height:13px;color:#22A06B}

.kds-note{padding:5px 7px;border-radius:7px;background:var(--note);border:1px solid var(--note-b);font-size:9px;font-weight:700;line-height:1.3}

.kds-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;padding-top:6px;border-top:1px solid var(--border)}

.kds-footer .kds-label{font-size:7px}

.kds-total{color:var(--pink);font-size:15px;font-weight:950;line-height:1.1}

.kds-action{

  display:flex;align-items:center;gap:4px;padding:7px 11px;border:none;border-radius:9px;

  background:var(--pink);color:#fff;font-size:10px;font-weight:900;white-space:nowrap;

  box-shadow:0 4px 11px rgba(255,36,87,.14);transition:.16s ease;

}

.kds-action:hover{background:var(--pink-dark);box-shadow:0 7px 16px rgba(255,36,87,.18)}

.kds-action:active{transform:scale(.97)}

.kds-done{display:flex;align-items:center;gap:4px;padding:6px 9px;border-radius:8px;background:#EAF8F1;color:#22A06B;border:1px solid #C7E8D7;font-size:10px;font-weight:850}



.kds-a-search{grid-area:search}.kds-a-date{grid-area:date}.kds-a-sort{grid-area:sort}.kds-a-toggle{grid-area:toggle}



@container kds (max-width:1000px){

  .kds-stats{grid-template-columns:repeat(2,minmax(0,1fr))}

  .kds-select-label{display:none}

}



@container kds (max-width:899px){

  .kds-body{overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;padding-bottom:calc(12px + env(safe-area-inset-bottom,0px))}

  .kds-tabs{display:flex;position:sticky;top:0;z-index:3;padding:4px 0;background:var(--bg)}

  .kds-cols{flex:none}

  .kds-cols-grid{grid-template-columns:minmax(0,1fr)}

  .kds-cols-grid .kds-col{display:none}

  .kds-cols-grid .kds-col.is-active{display:flex}

  .kds-cols-grid .kds-list{overflow:visible}

  .kds-cols-list .kds-list{grid-template-columns:minmax(0,1fr)}

  .kds-toolbar{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;grid-template-areas:"search search toggle" "date sort sort";gap:8px}

  .kds-search{min-width:0}.kds-select{min-width:0;width:100%}.kds-select select{width:100%;min-width:0;text-overflow:ellipsis}

}



@container kds (max-width:600px){

  .kds-stat-arrow{display:none}.kds-stat-title{padding-right:0}

  .kds-toolbar{grid-template-areas:"search search search" "date sort toggle";grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto}

}



@container kds (max-width:480px){

  .kds-header{padding:8px 12px}.kds-title{font-size:17px}.kds-live-text{display:none}.kds-live{padding:11px}

  .kds-body{padding:8px 10px 12px;gap:8px}.kds-stats{gap:8px}.kds-stat{padding:9px 10px;gap:8px;border-radius:13px}

  .kds-stat-icon{width:34px;height:34px;flex-basis:34px;font-size:16px;border-radius:10px}.kds-stat-value{font-size:20px}

  .kds-stat-title{font-size:10px;line-height:1.2}.kds-stat-sub{display:none}

  .kds-toolbar{padding:6px;gap:6px}.kds-select{padding:0 22px 0 9px;gap:5px;font-size:11px}.kds-select>svg:first-child{display:none}.kds-select select{font-size:11px}.kds-caret{right:6px}

  .kds-toggle{gap:2px}.kds-toggle button{width:34px}.kds-tabs button{padding:9px 4px;gap:4px;font-size:11px}.kds-tab-full{display:none}.kds-tab-short{display:inline}.kds-pager button{padding:9px 12px}.kds-action{padding:7px 11px}

}



@container kds (max-width:340px){.kds-stats{grid-template-columns:minmax(0,1fr)}}

`;


