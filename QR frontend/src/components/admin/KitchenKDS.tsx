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
      accent: '#d62300',
    },
    {
      status: 'ready',
      label: 'Ready to Serve',
      icon: '🍽️',
      count: orders.filter(o => o.status === 'ready').length,
      accent: '#16834b',
    },
    {
      status: 'completed',
      label: 'Completed',
      icon: '✨',
      count: orders.filter(o => o.status === 'completed').length,
      accent: '#6f625b',
    },
  ];

  const getNextStatus = (
    current: OrderStatus
  ): OrderStatus | null => {
    if (current === 'received') return 'preparing';
    if (current === 'preparing') return 'ready';
    if (current === 'ready') return 'completed';

    return null;
  };

  const getNextActionLabel = (
    current: OrderStatus
  ): string => {
    if (current === 'received') return 'Start Grilling';
    if (current === 'preparing') return 'Mark Ready';
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
      accent: '#d62300',
      target: 'received',
    },
    {
      key: 'ready',
      title: 'Ready to Serve',
      value: columns[1].count,
      sub: 'Ready for pickup',
      icon: '🍽️',
      accent: '#16834b',
      target: 'ready',
    },
    {
      key: 'completed',
      title: 'Completed',
      value: columns[2].count,
      sub: 'Successfully served',
      icon: '✨',
      accent: '#6f625b',
      target: 'completed',
    },
    {
      key: 'total',
      title: 'Total Orders',
      value: orders.length,
      sub: 'All orders',
      icon: '🕒',
      accent: '#c27a00',
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
                #{order.tokenNumber}
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
                        + {addon.name}
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
                className={`kds-col ${
                  view === 'grid' && activeTab === col.status ? 'is-active' : ''
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
  --bg:#fbf6f2;--panel:#fff;--card:#fff;--col:#f6f0eb;--text:#2f1d14;--sub:#9a8c83;
  --border:#eadfd7;--input:#f4efea;--guest:#fff5f0;--guest-b:#f4dcd2;
  --item:#eefaf2;--item-b:#d5eddd;--note:#fff8dc;--note-b:#efdfaa;--red:#d62300;
  container-type:inline-size;container-name:kds;
  width:100%;height:100%;min-width:0;display:flex;flex-direction:column;background:var(--bg);
  color:var(--text);box-sizing:border-box;overflow:hidden;
}
.kds *{box-sizing:border-box}
.kds-dark{
  --bg:#17110e;--panel:#221a16;--card:#2b211c;--col:#1d1613;--text:#f6ede7;--sub:#a99a90;
  --border:#3b2f28;--input:#2b211c;--guest:#34251f;--guest-b:#4a352c;
  --item:#1f3a2b;--item-b:#2c5640;--note:#3a3216;--note-b:#5a4c20;
}
.kds button{font-family:inherit;cursor:pointer}
.kds button:focus-visible,.kds select:focus-visible,.kds input:focus-visible{outline:2px solid #ff2b06;outline-offset:2px}
.kds-row{display:flex;align-items:center}
.kds-between{justify-content:space-between;gap:6px}
.kds-gap4{gap:4px}.kds-gap6{gap:6px}.kds-gap8{gap:8px}.kds-gap10{gap:10px}
.kds-min0{min-width:0}.kds-left{text-align:left}

/* header */
.kds-header{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:10px;
  padding:10px 16px;background:linear-gradient(90deg,#ff2b06,#e61f00);color:#fff}
.kds-title{display:flex;align-items:center;gap:8px;font-size:20px;font-weight:900;line-height:1.1}
.kds-subtitle{font-size:12px;font-weight:600;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kds-live{display:flex;align-items:center;gap:7px;padding:9px 12px;border-radius:10px;background:rgba(0,0,0,.2);font-size:12px;font-weight:800;white-space:nowrap}
.kds-live-dot{width:9px;height:9px;border-radius:50%;background:#22d36b;box-shadow:0 0 0 3px rgba(34,211,107,.3)}
.kds-icon-btn{width:38px;height:38px;display:grid;place-items:center;border:none;border-radius:10px;background:rgba(0,0,0,.2);color:#fff}

/* body */
.kds-body{flex:1;min-height:0;display:flex;flex-direction:column;gap:10px;padding:10px 14px 12px;overflow:hidden}
.kds-body-list{overflow-y:auto}

/* stats */
.kds-stats{flex-shrink:0;display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.kds-stat{position:relative;display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;
  background:var(--panel);border:1px solid var(--border);border-left:4px solid var(--accent);color:var(--text);font:inherit;width:100%;min-width:0;text-align:left;cursor:default}
.kds-stat-click{cursor:pointer}
.kds-stat-click:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(48,31,22,.1)}
.kds-stat-icon{width:40px;height:40px;flex-shrink:0;display:grid;place-items:center;border-radius:12px;
  background:color-mix(in srgb,var(--accent) 14%,transparent);font-size:19px}
.kds-stat-title{font-size:12px;font-weight:800;padding-right:18px}
.kds-stat-value{font-size:22px;font-weight:900;line-height:1.1}
.kds-stat-sub{font-size:10.5px;color:var(--sub);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kds-stat-arrow{position:absolute;top:8px;right:8px;width:22px;height:22px;display:grid;place-items:center;border-radius:7px;
  background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent)}

/* toolbar */
.kds-toolbar{flex-shrink:0;display:flex;align-items:center;gap:8px;padding:8px;border-radius:14px;background:var(--panel);border:1px solid var(--border)}
.kds-search{flex:1 1 220px;min-width:0;height:38px;display:flex;align-items:center;gap:8px;padding:0 12px;border-radius:10px;background:var(--input);color:var(--sub)}
.kds-search input{flex:1;min-width:0;border:none;outline:none;background:transparent;color:var(--text);font-size:13px}
.kds-clear{border:none;background:transparent;color:var(--sub);display:grid;place-items:center;padding:4px}
.kds-select{position:relative;height:38px;display:flex;align-items:center;gap:7px;padding:0 28px 0 12px;border-radius:10px;border:1px solid var(--border);background:var(--panel);color:var(--text);font-size:12.5px;font-weight:700}
.kds-select-label{white-space:nowrap}
.kds-select select{appearance:none;-webkit-appearance:none;border:none;outline:none;background:transparent;color:var(--text);font:inherit;font-weight:800;cursor:pointer;padding-right:4px;min-width:0}
.kds-select select option{color:#222;background:#fff}
.kds-caret{position:absolute;right:9px;top:50%;transform:translateY(-50%);pointer-events:none}
.kds-toggle{display:flex;gap:4px}
.kds-toggle button{width:38px;height:38px;display:grid;place-items:center;border:none;border-radius:10px;background:transparent;color:var(--text)}
.kds-toggle button.is-on{background:#ff2b06;color:#fff}

/* tabs (mobile only) */
.kds-tabs{display:none;flex-shrink:0;gap:6px}
.kds-tabs button{flex:1;min-width:0;display:flex;align-items:center;justify-content:center;gap:5px;padding:9px 6px;border-radius:10px;
  border:1px solid var(--border);background:var(--panel);color:var(--text);font-size:12px;font-weight:800;white-space:nowrap}
.kds-tab-short{display:none}
.kds-tabs button b{min-width:20px;padding:1px 6px;border-radius:10px;background:var(--accent);color:#fff;font-size:11px}
.kds-tabs button.is-on{border-color:var(--accent);box-shadow:inset 0 -3px 0 var(--accent)}

/* columns */
.kds-cols{flex:1;min-height:0;display:grid;gap:10px}
.kds-cols-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
.kds-cols-list{grid-template-columns:minmax(0,1fr);flex:none}
.kds-col{min-width:0;min-height:0;display:flex;flex-direction:column;background:var(--col);border:1px solid var(--border);border-top:3px solid var(--accent);border-radius:14px;overflow:hidden}
.kds-col-head{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:color-mix(in srgb,var(--accent) 9%,var(--panel))}
.kds-col-icon{width:30px;height:30px;display:grid;place-items:center;border-radius:9px;background:var(--panel);font-size:15px}
.kds-col-title{font-size:14px;font-weight:900}
.kds-badge{min-width:28px;height:22px;padding:0 8px;display:grid;place-items:center;border-radius:11px;background:var(--accent);color:#fff;font-size:12px;font-weight:900}
.kds-list{flex:1;min-height:0;overflow-y:auto;padding:6px;display:flex;flex-direction:column;gap:6px}
.kds-cols-list .kds-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));align-content:start;overflow:visible}
.kds-cols-list .kds-empty{grid-column:1/-1}

/* empty */
.kds-empty{flex:1;min-height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:3px;padding:12px}
.kds-empty-icon{font-size:34px;opacity:.5;margin-bottom:4px}
.kds-empty-title{font-size:15px;font-weight:900;opacity:.8}
.kds-empty-sub{font-size:12px;color:var(--sub);max-width:260px}

/* pager */
.kds-pager{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;background:var(--panel);border-top:1px solid var(--border)}
.kds-pager button{display:flex;align-items:center;gap:5px;padding:8px 12px;border:none;border-radius:8px;background:#ff2b06;color:#fff;font-size:12px;font-weight:800}
.kds-pager button:disabled{background:var(--input);color:var(--sub);cursor:not-allowed}
.kds-page{font-size:13px;font-weight:900}

/* card (compact: ~2-3 cards visible per screen) */
.kds-card{flex-shrink:0;background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(48,31,22,.07)}
.kds-card-stripe{height:2px;background:var(--accent)}
.kds-card-body{padding:6px 7px 7px;display:flex;flex-direction:column;gap:4px}
.kds-chip{padding:2px 6px;border-radius:6px;font-size:10px;font-weight:900;white-space:nowrap;line-height:1.5}
.kds-chip-table{background:linear-gradient(90deg,#d62300,#ff4a1c);color:#fff}
.kds-chip-token{background:#fff0c7;color:#795317}
.kds-time{display:flex;align-items:center;gap:3px;color:var(--sub);font-size:10px;font-weight:600;white-space:nowrap;min-width:0;overflow:hidden;text-overflow:ellipsis}
.kds-guest{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:3px 6px;border-radius:7px;background:var(--guest);border:1px solid var(--guest-b)}
.kds-avatar{width:20px;height:20px;flex-shrink:0;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#ff4a1c,#d62300);color:#fff}
.kds-avatar svg{width:11px;height:11px}
.kds-label{font-size:8px;color:var(--sub);font-weight:700;text-transform:uppercase;letter-spacing:.3px;line-height:1.1}
.kds-guest-name{font-size:11.5px;font-weight:800;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kds-guest .kds-label{display:none}
.kds-pay{flex-shrink:0;padding:1px 6px;border-radius:5px;background:var(--card);border:1px solid var(--border);font-size:9px;font-weight:900;text-transform:uppercase}
.kds-items{display:flex;flex-direction:column;gap:3px}
.kds-item{display:flex;align-items:center;gap:6px;padding:3px 6px;border-radius:6px;background:var(--item);border:1px solid var(--item-b)}
.kds-qty{min-width:22px;padding:1px 3px;border-radius:5px;background:#16834b;color:#fff;text-align:center;font-size:10px;font-weight:900;line-height:1.5}
.kds-item-info{flex:1;min-width:0}
.kds-item-name{font-size:11.5px;font-weight:800;color:#16834b;line-height:1.2;word-break:break-word}
.kds-item-variant{font-size:9px;color:#5f8069;font-weight:600;line-height:1.2}
.kds-item-addon{font-size:9px;color:var(--red);font-weight:800;line-height:1.2}
.kds-item svg{width:13px;height:13px}
.kds-note{padding:3px 6px;border-radius:6px;background:var(--note);border:1px solid var(--note-b);font-size:10px;font-weight:700;line-height:1.25}
.kds-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;padding-top:4px;border-top:1px solid var(--border)}
.kds-footer .kds-label{font-size:8px}
.kds-total{color:var(--red);font-size:14px;font-weight:900;line-height:1.1}
.kds-action{display:flex;align-items:center;gap:4px;padding:6px 10px;border:none;border-radius:8px;background:linear-gradient(90deg,#d62300,#ff3b0d);color:#fff;font-size:11px;font-weight:900;white-space:nowrap;box-shadow:0 2px 6px rgba(214,35,0,.22)}
.kds-action:active{transform:scale(.97)}
.kds-done{display:flex;align-items:center;gap:4px;padding:5px 10px;border-radius:8px;background:var(--item);color:#16834b;font-size:11px;font-weight:800}

/* toolbar grid areas */
.kds-a-search{grid-area:search}.kds-a-date{grid-area:date}.kds-a-sort{grid-area:sort}.kds-a-toggle{grid-area:toggle}

/* ---------- responsive: based on the component's OWN width (works beside a sidebar) ---------- */
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
  .kds-toolbar{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;
    grid-template-areas:"search search toggle" "date sort sort";gap:8px}
  .kds-a-date{grid-area:date}
  .kds-search{min-width:0}
  .kds-select{min-width:0;width:100%}
  .kds-select select{width:100%;min-width:0;text-overflow:ellipsis}
}

@container kds (max-width:600px){
  .kds-stat-arrow{display:none}
  .kds-stat-title{padding-right:0}
  .kds-toolbar{grid-template-areas:"search search search" "date sort toggle";grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto}
  .kds-a-sort{grid-area:sort}
}

@container kds (max-width:480px){
  .kds-header{padding:8px 12px}
  .kds-title{font-size:17px}
  .kds-live-text{display:none}
  .kds-live{padding:11px}
  .kds-body{padding:8px 10px 12px;gap:8px}
  .kds-stats{gap:8px}
  .kds-stat{padding:8px 10px;gap:8px}
  .kds-stat-icon{width:32px;height:32px;font-size:16px;border-radius:10px}
  .kds-stat-value{font-size:19px}
  .kds-stat-title{font-size:11px;line-height:1.2}
  .kds-stat-sub{display:none}
  .kds-toolbar{padding:6px;gap:6px}
  .kds-select{padding:0 22px 0 9px;gap:5px;font-size:12px}
  .kds-select > svg:first-child{display:none}
  .kds-select select{font-size:12px}
  .kds-caret{right:6px}
  .kds-toggle{gap:2px}
  .kds-toggle button{width:34px}
  .kds-tabs button{padding:9px 4px;gap:4px;font-size:12px}
  .kds-tab-full{display:none}
  .kds-tab-short{display:inline}
  .kds-pager button{padding:9px 12px}
  .kds-action{padding:7px 11px}
}

@container kds (max-width:340px){
  .kds-stats{grid-template-columns:minmax(0,1fr)}
}
`;