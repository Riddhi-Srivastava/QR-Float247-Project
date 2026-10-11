import React, { useMemo, useState } from "react";

import {

  DollarSign,

  ShoppingBag,

  TrendingUp,

  Clock,

  Flame,

  ArrowUpRight,

  ArrowUp,

  ArrowDown,

  Utensils,

  Trophy,

  CalendarDays,

  X,

  ChevronDown,

  Package,

} from "lucide-react";



import { Order, MenuItem } from "../../types/restaurant";



interface AdminStatsProps {

  orders: Order[];

  menuItems: MenuItem[];

}



type DateFilter =

  | "all"

  | "today"

  | "yesterday"

  | "7days"

  | "30days"

  | "custom";



type SortMode = "sales_desc" | "sales_asc";



interface SalesItem {

  key: string;

  name: string;

  category: string;

  quantity: number;

  sales: number;

  image?: string;

  price: number;

}



export const AdminStats: React.FC<AdminStatsProps> = ({

  orders,

  menuItems,

}) => {

  // =========================================================

  // DATE FILTER

  // =========================================================



  const [dateFilter, setDateFilter] = useState<DateFilter>("all");



  const [customStartDate, setCustomStartDate] = useState("");



  const [customEndDate, setCustomEndDate] = useState("");



  const [showSalesModal, setShowSalesModal] = useState(false);



  // Sort mode for the item-wise sales modal (UI only)

  const [sortMode, setSortMode] = useState<SortMode>("sales_desc");



  // =========================================================

  // SAFE BACKEND DATA ACCESS

  // =========================================================



  const getOrderItems = (order: Order): any[] => {

    const backendOrder = order as any;



    return Array.isArray(backendOrder.items)

      ? backendOrder.items

      : [];

  };



  const getOrderDate = (order: Order): Date | null => {

    const backendOrder = order as any;



    if (!backendOrder.createdAt) {

      return null;

    }



    const date = new Date(backendOrder.createdAt);



    return Number.isNaN(date.getTime()) ? null : date;

  };



  // =========================================================

  // DATE HELPERS

  // =========================================================



  const startOfDay = (date: Date) => {

    const result = new Date(date);



    result.setHours(0, 0, 0, 0);



    return result;

  };



  const endOfDay = (date: Date) => {

    const result = new Date(date);



    result.setHours(23, 59, 59, 999);



    return result;

  };



  const isSameDay = (first: Date, second: Date) => {

    return (

      first.getFullYear() === second.getFullYear() &&

      first.getMonth() === second.getMonth() &&

      first.getDate() === second.getDate()

    );

  };



  // =========================================================

  // FILTER ORDERS

  // =========================================================



  const filteredOrders = useMemo(() => {

    if (dateFilter === "all") {

      return orders;

    }



    const now = new Date();



    if (dateFilter === "today") {

      return orders.filter((order) => {

        const orderDate = getOrderDate(order);



        if (!orderDate) {

          return false;

        }



        return isSameDay(orderDate, now);

      });

    }



    if (dateFilter === "yesterday") {

      const yesterday = new Date(now);



      yesterday.setDate(yesterday.getDate() - 1);



      return orders.filter((order) => {

        const orderDate = getOrderDate(order);



        if (!orderDate) {

          return false;

        }



        return isSameDay(orderDate, yesterday);

      });

    }



    if (dateFilter === "7days") {

      const start = new Date(now);



      start.setDate(start.getDate() - 6);



      const startDate = startOfDay(start);

      const endDate = endOfDay(now);



      return orders.filter((order) => {

        const orderDate = getOrderDate(order);



        if (!orderDate) {

          return false;

        }



        return orderDate >= startDate && orderDate <= endDate;

      });

    }



    if (dateFilter === "30days") {

      const start = new Date(now);



      start.setDate(start.getDate() - 29);



      const startDate = startOfDay(start);

      const endDate = endOfDay(now);



      return orders.filter((order) => {

        const orderDate = getOrderDate(order);



        if (!orderDate) {

          return false;

        }



        return orderDate >= startDate && orderDate <= endDate;

      });

    }



    if (dateFilter === "custom" && customStartDate) {

      const start = startOfDay(

        new Date(`${customStartDate}T00:00:00`)

      );



      const end = customEndDate

        ? endOfDay(new Date(`${customEndDate}T00:00:00`))

        : endOfDay(start);



      return orders.filter((order) => {

        const orderDate = getOrderDate(order);



        if (!orderDate) {

          return false;

        }



        return orderDate >= start && orderDate <= end;

      });

    }



    return orders;

  }, [orders, dateFilter, customStartDate, customEndDate]);



  // =========================================================

  // REAL SUMMARY DATA

  // =========================================================



  const totalRevenue = useMemo(() => {

    return filteredOrders.reduce(

      (acc, order) => acc + Number(order.total || 0),

      0

    );

  }, [filteredOrders]);



  const totalOrdersCount = filteredOrders.length;



  const avgOrderValue =

    totalOrdersCount > 0

      ? Math.round(totalRevenue / totalOrdersCount)

      : 0;



  const completedOrders = filteredOrders.filter(

    (order) => String(order.status).toLowerCase() === "completed"

  ).length;



  // =========================================================

  // REAL ITEM-WISE SALES

  // =========================================================



  const itemSales = useMemo<SalesItem[]>(() => {

    const salesMap = new Map<string, SalesItem>();



    filteredOrders.forEach((order) => {

      const items = getOrderItems(order);



      items.forEach((item) => {

        const name = String(item.name || "").trim();



        if (!name) {

          return;

        }



        const key = String(

          item.foodId || item.id || name

        ).toLowerCase();



        const quantity = Number(item.quantity || 0);



        const price = Number(item.price || 0);



        if (quantity <= 0) {

          return;

        }



        const existing = salesMap.get(key);



        if (existing) {

          existing.quantity += quantity;



          existing.sales += price * quantity;



          if (!existing.image && item.image) {

            existing.image = item.image;

          }

        } else {

          salesMap.set(key, {

            key,

            name,

            category: String(item.category || "Uncategorized"),

            quantity,

            sales: price * quantity,

            image: item.image || undefined,

            price,

          });

        }

      });

    });



    return Array.from(salesMap.values()).sort(

      (a, b) => b.quantity - a.quantity || b.sales - a.sales

    );

  }, [filteredOrders]);



  // =========================================================

  // TOP 5 ACTUAL BESTSELLERS

  // =========================================================



  const topFiveItems = itemSales.slice(0, 5);



  // =========================================================

  // MODAL: PRICE SORTED LIST + SUMMARY (DISPLAY ONLY)

  // =========================================================



  const sortedSales = useMemo(() => {

    const copy = [...itemSales];



    copy.sort((a, b) =>

      sortMode === "sales_desc"

        ? b.sales - a.sales

        : a.sales - b.sales

    );



    return copy;

  }, [itemSales, sortMode]);



  const itemsTotalQuantity = useMemo(

    () => itemSales.reduce((acc, item) => acc + item.quantity, 0),

    [itemSales]

  );



  const itemsTotalSales = useMemo(

    () => itemSales.reduce((acc, item) => acc + item.sales, 0),

    [itemSales]

  );



  // =========================================================

  // MENU IMAGE FALLBACK

  // =========================================================



  const getItemImage = (item: SalesItem) => {

    if (item.image) {

      return item.image;

    }



    const menuItem = menuItems.find(

      (menu) =>

        String(menu.name).toLowerCase().trim() ===

        item.name.toLowerCase().trim()

    );



    return menuItem?.image;

  };



  // =========================================================

  // DATE LABEL

  // =========================================================



  const dateLabel = (() => {

    switch (dateFilter) {

      case "today":

        return "Today";



      case "yesterday":

        return "Yesterday";



      case "7days":

        return "Last 7 Days";



      case "30days":

        return "Last 30 Days";



      case "custom":

        if (customStartDate && customEndDate) {

          return `${customStartDate} → ${customEndDate}`;

        }



        if (customStartDate) {

          return customStartDate;

        }



        return "Select Date";



      default:

        return "All Time";

    }

  })();



  // =========================================================

  // METRICS

  // =========================================================



  const metrics = [

    {

      title: "Total Sales",

      value: `₹${totalRevenue.toLocaleString("en-IN")}`,

      subtitle: "Click to view item-wise sales",

      icon: DollarSign,

      accent: "#FF2457",

      soft: "#FFE7ED",

      clickable: true,

    },

    {

      title: "Total Orders",

      value: totalOrdersCount.toLocaleString("en-IN"),

      subtitle: dateLabel,

      icon: ShoppingBag,

      accent: "#FF2457",

      soft: "#FFF3F6",

      clickable: false,

    },

    {

      title: "Average Order",

      value: `₹${avgOrderValue.toLocaleString("en-IN")}`,

      subtitle: "Based on filtered orders",

      icon: TrendingUp,

      accent: "#22A06B",

      soft: "#EEF9F4",

      clickable: false,

    },

    {

      title: "Completed",

      value: completedOrders.toLocaleString("en-IN"),

      subtitle: "Completed orders",

      icon: Clock,

      accent: "#FF2457",

      soft: "#F8F8FA",

      clickable: false,

    },

  ];



  // =========================================================

  // UI

  // =========================================================



  return (

    <div className="bk-stats-page">

      <style>{`
      * { box-sizing: border-box; }

      .bk-stats-page {
        --pink: #FF2457;
        --pink-dark: #E91E4D;
        --pink-soft: #FFE7ED;
        --bg: #F5F6FA;
        --surface: #FFFFFF;
        --text: #1F1F1F;
        --body: #555555;
        --muted: #8A8A8A;
        --border: #E7E7EB;
        --success: #22A06B;
        --warning: #F5A623;
        --danger: #E53935;
        width: 100%;
        min-height: 100%;
        padding: 6px 2px 36px;
        color: var(--text);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: var(--bg);
      }

      .bk-stats-page button,
      .bk-stats-page input,
      .bk-stats-page select { font: inherit; }

      .bk-stats-header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 14px;
        padding: 16px 18px;
        border: 1px solid var(--border);
        border-radius: 14px;
        background: var(--surface);
        box-shadow: 0 2px 8px rgba(0,0,0,.05);
      }

      .bk-title-wrap { display: flex; align-items: center; gap: 12px; min-width: 0; }

      .bk-flame-icon {
        width: 44px;
        height: 44px;
        flex: 0 0 44px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        color: #fff;
        background: var(--pink);
        box-shadow: 0 5px 14px rgba(255,36,87,.18);
      }

      .bk-stats-title {
        margin: 0;
        color: var(--text);
        font-size: 22px;
        line-height: 1.15;
        font-weight: 800;
        letter-spacing: -.45px;
      }

      .bk-stats-subtitle {
        margin: 4px 0 0;
        color: var(--muted);
        font-size: 11px;
        font-weight: 600;
      }

      .bk-live-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 11px;
        border: 1px solid rgba(34,160,107,.18);
        border-radius: 999px;
        background: #F3FBF7;
        color: #18794F;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: .65px;
        text-transform: uppercase;
      }

      .bk-live-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--success);
        box-shadow: 0 0 0 4px rgba(34,160,107,.10);
        animation: bkPulse 1.8s infinite;
      }

      @keyframes bkPulse {
        0%,100% { box-shadow: 0 0 0 4px rgba(34,160,107,.10); }
        50% { box-shadow: 0 0 0 7px rgba(34,160,107,.025); }
      }

      .bk-filter-bar {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        padding: 8px;
        margin-bottom: 12px;
        border: 1px solid var(--border);
        border-radius: 12px;
        background: var(--surface);
        box-shadow: 0 2px 8px rgba(0,0,0,.04);
      }

      .bk-filter-title {
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 0 7px;
        color: var(--body);
        font-size: 9px;
        font-weight: 800;
        letter-spacing: .65px;
        text-transform: uppercase;
      }

      .bk-filter-title svg { color: var(--pink); }

      .bk-filter-select { position: relative; }

      .bk-filter-select select {
        appearance: none;
        height: 38px;
        min-width: 152px;
        padding: 0 36px 0 12px;
        border: 1px solid var(--border);
        border-radius: 10px;
        outline: none;
        background: #fff;
        color: var(--text);
        font-size: 10px;
        font-weight: 700;
        cursor: pointer;
        transition: .18s ease;
      }

      .bk-filter-select select:hover { border-color: rgba(255,36,87,.30); }
      .bk-filter-select select:focus {
        border-color: var(--pink);
        box-shadow: 0 0 0 3px rgba(255,36,87,.10);
      }

      .bk-filter-select svg {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        color: var(--muted);
      }

      .bk-date-input {
        height: 38px;
        padding: 0 11px;
        border: 1px solid var(--border);
        border-radius: 10px;
        outline: none;
        background: #fff;
        color: var(--text);
        font-size: 10px;
        font-weight: 650;
        transition: .18s ease;
      }

      .bk-date-input:focus {
        border-color: var(--pink);
        box-shadow: 0 0 0 3px rgba(255,36,87,.10);
      }

      .bk-filter-result {
        margin-left: auto;
        display: inline-flex;
        align-items: center;
        min-height: 34px;
        padding: 7px 11px;
        border: 1px solid rgba(255,36,87,.10);
        border-radius: 10px;
        background: var(--pink-soft);
        color: var(--pink-dark);
        font-size: 9px;
        font-weight: 800;
      }

      .bk-metrics-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0,1fr));
        gap: 10px;
        margin-bottom: 12px;
      }

      .bk-metric-card {
        position: relative;
        min-height: 132px;
        overflow: hidden;
        padding: 16px;
        border: 1px solid var(--border);
        border-radius: 14px;
        background: var(--surface);
        box-shadow: 0 2px 8px rgba(0,0,0,.05);
        transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
      }

      .bk-metric-card.clickable { cursor: pointer; }
      .bk-metric-card:hover {
        transform: translateY(-2px);
        border-color: rgba(255,36,87,.22);
        box-shadow: 0 7px 18px rgba(0,0,0,.07);
      }

      .bk-metric-card::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 3px;
        background: var(--pink);
      }

      .bk-metric-top {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      }

      .bk-metric-icon {
        width: 42px;
        height: 42px;
        border-radius: 11px;
        display: grid;
        place-items: center;
      }

      .bk-arrow {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        display: grid;
        place-items: center;
        color: var(--muted);
        background: #F7F7F9;
        transition: .18s ease;
      }

      .bk-metric-card:hover .bk-arrow {
        color: var(--pink);
        background: var(--pink-soft);
        transform: translate(1px,-1px);
      }

      .bk-metric-title {
        position: relative;
        z-index: 2;
        margin-top: 13px;
        color: var(--muted);
        font-size: 9px;
        font-weight: 800;
        letter-spacing: .7px;
        text-transform: uppercase;
      }

      .bk-metric-value {
        position: relative;
        z-index: 2;
        margin-top: 5px;
        color: var(--text);
        font-size: 26px;
        line-height: 1.05;
        font-weight: 800;
        letter-spacing: -.7px;
      }

      .bk-metric-subtitle {
        position: relative;
        z-index: 2;
        margin-top: 7px;
        color: var(--muted);
        font-size: 9px;
        font-weight: 600;
      }

      .bk-content-grid {
        display: grid;
        grid-template-columns: minmax(0,1.3fr) minmax(330px,.7fr);
        gap: 12px;
      }

      .bk-panel {
        overflow: hidden;
        border: 1px solid var(--border);
        border-radius: 14px;
        background: var(--surface);
        box-shadow: 0 2px 8px rgba(0,0,0,.05);
      }

      .bk-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        padding: 14px 16px;
        border-bottom: 1px solid var(--border);
        background: var(--surface);
      }

      .bk-panel-title-wrap { display: flex; align-items: center; gap: 10px; min-width: 0; }

      .bk-panel-icon {
        width: 36px;
        height: 36px;
        flex: 0 0 36px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        background: var(--pink-soft);
        color: var(--pink);
      }

      .bk-panel-title {
        margin: 0;
        color: var(--text);
        font-size: 14px;
        font-weight: 800;
      }

      .bk-panel-description {
        margin: 3px 0 0;
        color: var(--muted);
        font-size: 9px;
        font-weight: 600;
      }

      .bk-panel-badge {
        padding: 6px 9px;
        border: 1px solid rgba(255,36,87,.10);
        border-radius: 999px;
        background: var(--pink-soft);
        color: var(--pink-dark);
        font-size: 8px;
        font-weight: 800;
        letter-spacing: .5px;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .bk-sales-body { padding: 14px; }

      .bk-sales-highlight {
        position: relative;
        min-height: 148px;
        overflow: hidden;
        padding: 19px;
        border-radius: 14px;
        background: var(--pink);
        color: #fff;
        box-shadow: 0 8px 20px rgba(255,36,87,.16);
      }

      .bk-sales-highlight::before {
        content: "";
        position: absolute;
        width: 180px;
        height: 180px;
        right: -90px;
        top: -110px;
        border-radius: 50%;
        background: rgba(255,255,255,.10);
      }

      .bk-sales-label {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 7px;
        color: #fff;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: .8px;
        text-transform: uppercase;
      }

      .bk-sales-number {
        position: relative;
        z-index: 2;
        margin-top: 9px;
        font-size: 34px;
        line-height: 1;
        font-weight: 850;
        letter-spacing: -1.1px;
      }

      .bk-sales-note {
        position: relative;
        z-index: 2;
        margin-top: 10px;
        color: rgba(255,255,255,.82);
        font-size: 9px;
        font-weight: 600;
      }

      .bk-sales-mini-grid {
        display: grid;
        grid-template-columns: repeat(2,1fr);
        gap: 9px;
        margin-top: 10px;
      }

      .bk-mini-card {
        min-width: 0;
        padding: 11px;
        border: 1px solid var(--border);
        border-radius: 12px;
        background: #FAFAFC;
        transition: .18s ease;
      }

      .bk-mini-card:hover {
        transform: translateY(-1px);
        border-color: rgba(255,36,87,.16);
      }

      .bk-mini-label {
        color: var(--muted);
        font-size: 8px;
        font-weight: 800;
        letter-spacing: .55px;
        text-transform: uppercase;
      }

      .bk-mini-value {
        margin-top: 5px;
        color: var(--text);
        font-size: 18px;
        font-weight: 800;
      }

      .bk-best-body { padding: 6px 10px 10px; }

      .bk-best-item {
        position: relative;
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 9px 6px;
        border-bottom: 1px solid var(--border);
        border-radius: 10px;
        transition: .18s ease;
      }

      .bk-best-item:last-child { border-bottom: 0; }

      .bk-best-item:hover {
        background: #FFF9FB;
        box-shadow: inset 3px 0 0 var(--pink);
      }

      .bk-rank {
        width: 29px;
        height: 29px;
        flex: 0 0 29px;
        display: grid;
        place-items: center;
        border-radius: 9px;
        background: var(--pink-soft);
        color: var(--pink-dark);
        font-size: 8px;
        font-weight: 800;
      }

      .bk-food-image {
        width: 52px;
        height: 52px;
        flex: 0 0 52px;
        overflow: hidden;
        border-radius: 12px;
        background: #F7F7F9;
        border: 1px solid var(--border);
      }

      .bk-food-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform .25s ease;
      }

      .bk-best-item:hover .bk-food-image img { transform: scale(1.04); }

      .bk-food-placeholder {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        color: var(--muted);
      }

      .bk-food-info { min-width: 0; flex: 1; }

      .bk-food-name {
        overflow: hidden;
        color: var(--text);
        font-size: 11px;
        font-weight: 800;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .bk-food-meta {
        margin-top: 3px;
        color: var(--muted);
        font-size: 8px;
        font-weight: 700;
        letter-spacing: .3px;
        text-transform: uppercase;
      }

      .bk-food-sales { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; }

      .bk-sales-pill,
      .bk-amount-pill {
        padding: 4px 6px;
        border-radius: 6px;
        font-size: 7px;
        font-weight: 800;
      }

      .bk-sales-pill { background: var(--pink-soft); color: var(--pink-dark); }
      .bk-amount-pill { background: #EEF9F4; color: #18794F; }
      .bk-hot-icon { flex-shrink: 0; color: var(--pink); }

      .bk-empty {
        min-height: 190px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 8px;
        padding: 25px;
        text-align: center;
      }

      .bk-empty-icon {
        width: 47px;
        height: 47px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: var(--pink-soft);
        color: var(--pink);
      }

      .bk-empty-title { color: var(--text); font-size: 12px; font-weight: 800; }

      .bk-empty-text {
        max-width: 270px;
        color: var(--muted);
        font-size: 10px;
        font-weight: 600;
        line-height: 1.55;
      }

      .bk-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
        background: rgba(20,20,24,.56);
        backdrop-filter: blur(6px);
        animation: bkFade .18s ease;
      }

      @keyframes bkFade { from { opacity: 0; } to { opacity: 1; } }

      .bk-modal {
        width: min(820px, 100%);
        max-height: min(88vh, 760px);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border: 1px solid var(--border);
        border-radius: 18px;
        background: var(--surface);
        box-shadow: 0 25px 70px rgba(0,0,0,.20);
        animation: bkModal .22s ease;
      }

      @keyframes bkModal {
        from { transform: translateY(10px) scale(.99); opacity: .75; }
        to { transform: translateY(0) scale(1); opacity: 1; }
      }

      .bk-modal-header {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 17px 19px;
        background: var(--pink);
        color: #fff;
      }

      .bk-modal-title-wrap { display: flex; align-items: center; gap: 11px; min-width: 0; }

      .bk-modal-icon {
        width: 42px;
        height: 42px;
        flex: 0 0 42px;
        display: grid;
        place-items: center;
        border-radius: 11px;
        background: rgba(255,255,255,.16);
        color: #fff;
      }

      .bk-stats-page .bk-modal-title {
        margin: 0;
        color: #fff !important;
        font-size: 17px;
        line-height: 1.15;
        font-weight: 800;
      }

      .bk-stats-page .bk-modal-subtitle {
        margin: 5px 0 0;
        color: rgba(255,255,255,.80) !important;
        font-size: 10px;
        font-weight: 600;
      }

      .bk-close {
        width: 36px;
        height: 36px;
        flex: 0 0 36px;
        border: 1px solid rgba(255,255,255,.25);
        border-radius: 10px;
        display: grid;
        place-items: center;
        background: rgba(255,255,255,.10);
        color: #fff;
        cursor: pointer;
        transition: background .18s ease, transform .18s ease;
      }

      .bk-close:hover {
        background: rgba(255,255,255,.20);
        transform: scale(1.03);
      }

      .bk-modal-summary {
        flex: 0 0 auto;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 9px;
        padding: 12px 16px 4px;
        background: var(--surface);
      }

      .bk-summary-card {
        min-width: 0;
        padding: 10px 12px;
        border-radius: 11px;
        border: 1px solid var(--border);
      }

      .bk-summary-card.items { background: #F8F8FA; }
      .bk-summary-card.qty { background: var(--pink-soft); border-color: rgba(255,36,87,.10); }
      .bk-summary-card.sales { background: #EEF9F4; border-color: rgba(34,160,107,.15); }

      .bk-summary-label {
        font-size: 9px;
        font-weight: 800;
        letter-spacing: .55px;
        text-transform: uppercase;
      }

      .bk-summary-card.items .bk-summary-label { color: var(--muted); }
      .bk-summary-card.qty .bk-summary-label { color: var(--pink-dark); }
      .bk-summary-card.sales .bk-summary-label { color: #18794F; }

      .bk-summary-value {
        margin-top: 4px;
        font-size: 20px;
        line-height: 1.1;
        font-weight: 800;
        letter-spacing: -.4px;
      }

      .bk-summary-card.items .bk-summary-value { color: var(--text); }
      .bk-summary-card.qty .bk-summary-value { color: var(--pink-dark); }
      .bk-summary-card.sales .bk-summary-value { color: #18794F; }

      .bk-sort-bar {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        padding: 10px 16px 12px;
        border-bottom: 1px solid var(--border);
        background: var(--surface);
      }

      .bk-sort-label {
        margin-right: 2px;
        color: var(--muted);
        font-size: 10px;
        font-weight: 800;
        letter-spacing: .5px;
        text-transform: uppercase;
      }

      .bk-sort-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 34px;
        padding: 0 12px;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: #fff;
        color: var(--body);
        font-size: 11px;
        font-weight: 750;
        cursor: pointer;
        transition: background .18s ease, color .18s ease, border-color .18s ease, box-shadow .18s ease;
      }

      .bk-sort-btn:hover {
        border-color: rgba(255,36,87,.30);
        color: var(--pink-dark);
      }

      .bk-sort-btn.active {
        background: var(--pink);
        border-color: var(--pink);
        color: #fff;
        box-shadow: 0 5px 13px rgba(255,36,87,.18);
      }

      .bk-modal-body {
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
        padding: 11px 16px 16px;
        background: #FAFAFC;
      }

      .bk-modal-body::-webkit-scrollbar { width: 7px; }
      .bk-modal-body::-webkit-scrollbar-track { background: #F0F0F3; border-radius: 99px; }
      .bk-modal-body::-webkit-scrollbar-thumb { border-radius: 99px; background: #FF9AB1; }

      .bk-sales-row {
        display: grid;
        grid-template-columns: 34px 52px minmax(0, 1fr) auto;
        align-items: center;
        gap: 13px;
        margin-bottom: 8px;
        padding: 11px 12px;
        border: 1px solid var(--border);
        border-radius: 13px;
        background: var(--surface);
        box-shadow: 0 2px 7px rgba(0,0,0,.03);
        transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
      }

      .bk-sales-row:hover {
        transform: translateY(-1px);
        border-color: rgba(255,36,87,.18);
        box-shadow: 0 7px 18px rgba(0,0,0,.06);
      }

      .bk-sales-row:last-child { margin-bottom: 0; }

      .bk-sales-row-rank {
        width: 34px;
        height: 34px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: var(--pink-soft);
        border: 1px solid rgba(255,36,87,.10);
        color: var(--pink-dark);
        font-size: 10px;
        font-weight: 800;
      }

      .bk-sales-row-img {
        width: 52px;
        height: 52px;
        overflow: hidden;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: #F7F7F9;
      }

      .bk-sales-row-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .bk-sales-row-img .bk-food-placeholder { color: var(--muted); }

      .bk-sales-row-info { min-width: 0; }

      .bk-sales-row-name {
        overflow: hidden;
        color: var(--text);
        font-size: 13px;
        font-weight: 800;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .bk-sales-row-category {
        margin-top: 4px;
        color: var(--muted);
        font-size: 9px;
        font-weight: 700;
        letter-spacing: .25px;
        text-transform: uppercase;
      }

      .bk-share {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
      }

      .bk-share-track {
        flex: 1;
        height: 6px;
        overflow: hidden;
        border-radius: 99px;
        background: #ECECF0;
      }

      .bk-share-fill {
        height: 100%;
        border-radius: 99px;
        background: var(--pink);
      }

      .bk-share-text {
        min-width: 58px;
        color: var(--muted);
        font-size: 10px;
        font-weight: 700;
        text-align: right;
      }

      .bk-sales-row-boxes {
        display: flex;
        align-items: stretch;
        gap: 8px;
      }

      .bk-box {
        min-width: 92px;
        padding: 9px 12px;
        border-radius: 11px;
        border: 1px solid var(--border);
        text-align: center;
      }

      .bk-box-qty { background: var(--pink-soft); border-color: rgba(255,36,87,.10); }
      .bk-box-sales { min-width: 118px; background: #EEF9F4; border-color: rgba(34,160,107,.15); }

      .bk-box-label {
        font-size: 9px;
        font-weight: 800;
        letter-spacing: .55px;
        text-transform: uppercase;
      }

      .bk-box-qty .bk-box-label { color: var(--pink-dark); }
      .bk-box-sales .bk-box-label { color: #18794F; }

      .bk-box-value {
        margin-top: 4px;
        font-size: 18px;
        line-height: 1.1;
        font-weight: 800;
        letter-spacing: -.3px;
      }

      .bk-box-qty .bk-box-value { color: var(--pink-dark); }
      .bk-box-sales .bk-box-value { color: #18794F; }

      @media (max-width: 1120px) {
        .bk-metrics-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
        .bk-content-grid { grid-template-columns: 1fr; }
      }

      @media (max-width: 760px) {
        .bk-stats-page { padding: 2px 0 22px; }
        .bk-stats-header { padding: 14px; border-radius: 13px; }
        .bk-stats-title { font-size: 20px; }
        .bk-live-badge { display: none; }
        .bk-filter-bar { align-items: stretch; padding: 8px; }
        .bk-filter-title { width: 100%; padding: 2px; }
        .bk-filter-select, .bk-filter-select select, .bk-date-input { width: 100%; }
        .bk-filter-result { width: 100%; justify-content: center; margin-left: 0; }
        .bk-metrics-grid { grid-template-columns: 1fr; gap: 9px; }
        .bk-metric-card { min-height: 122px; }
        .bk-content-grid { gap: 10px; }
        .bk-panel { border-radius: 13px; }
        .bk-sales-body { padding: 12px; }
        .bk-sales-number { font-size: 29px; }
        .bk-panel-header { padding: 13px; }
        .bk-modal-overlay { padding: 10px; }
        .bk-modal { max-height: 92dvh; border-radius: 16px; }
        .bk-modal-header { padding: 15px; }
        .bk-modal-summary { padding: 11px 11px 4px; gap: 7px; }
        .bk-summary-card { padding: 9px 10px; }
        .bk-summary-value { font-size: 16px; }
        .bk-sort-bar { padding: 9px 11px; }
        .bk-modal-body { padding: 9px 11px 13px; }
        .bk-sales-row {
          grid-template-columns: 30px 46px minmax(0,1fr);
          gap: 9px;
          padding: 10px;
        }
        .bk-sales-row-rank { width: 30px; height: 30px; font-size: 9px; }
        .bk-sales-row-img { width: 46px; height: 46px; }
        .bk-sales-row-boxes {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .bk-box, .bk-box-sales { min-width: 0; }
      }

      @media (max-width: 430px) {
        .bk-title-wrap { gap: 9px; }
        .bk-flame-icon { width: 40px; height: 40px; flex-basis: 40px; border-radius: 11px; }
        .bk-stats-title { font-size: 18px; }
        .bk-stats-subtitle { font-size: 9px; }
        .bk-metric-card { padding: 14px; border-radius: 12px; }
        .bk-metric-value { font-size: 23px; }
        .bk-sales-highlight { min-height: 138px; padding: 16px; }
        .bk-mini-card { padding: 10px; }
        .bk-mini-value { font-size: 17px; }
        .bk-food-image { width: 47px; height: 47px; flex-basis: 47px; }
        .bk-best-body { padding-left: 7px; padding-right: 7px; }
        .bk-summary-label { font-size: 8px; }
        .bk-sort-btn { font-size: 10px; padding: 0 10px; }
      }
      `}</style>



      {/* =====================================================

          DATE FILTER

      \===================================================== */}



      <div className="bk-filter-bar">

        <div className="bk-filter-title">

          <CalendarDays size={15} />

          Order Date

        </div>



        <div className="bk-filter-select">

          <select

            value={dateFilter}

            onChange={(event) =>

              setDateFilter(event.target.value as DateFilter)

            }

          >

            <option value="all">All Time</option>

            <option value="today">Today</option>

            <option value="yesterday">Yesterday</option>

            <option value="7days">Last 7 Days</option>

            <option value="30days">Last 30 Days</option>

            <option value="custom">Custom Date / Range</option>

          </select>



          <ChevronDown size={14} />

        </div>



        {dateFilter === "custom" && (

          <>

            <input

              type="date"

              className="bk-date-input"

              value={customStartDate}

              onChange={(e) => setCustomStartDate(e.target.value)}

              placeholder="Start Date"

            />

            <input

              type="date"

              className="bk-date-input"

              value={customEndDate}

              onChange={(e) => setCustomEndDate(e.target.value)}

              placeholder="End Date"

            />

          </>

        )}



        <div className="bk-filter-result">

          {filteredOrders.length} orders found

        </div>

      </div>



      {/* =====================================================

          METRICS GRID

      \===================================================== */}



      <div className="bk-metrics-grid">

        {metrics.map((metric, idx) => {

          const Icon = metric.icon;



          return (

            <div

              key={idx}

              className={`bk-metric-card ${metric.clickable ? "clickable" : ""

                }`}

              onClick={() => {

                if (metric.clickable) {

                  setShowSalesModal(true);

                }

              }}

            >

              <div className="bk-metric-top">

                <div

                  className="bk-metric-icon"

                  style={{

                    background: metric.soft,

                    color: metric.accent,

                  }}

                >

                  <Icon size={20} strokeWidth={2.5} />

                </div>



                {metric.clickable && (

                  <div className="bk-arrow">

                    <ArrowUpRight size={16} />

                  </div>

                )}

              </div>



              <div className="bk-metric-title">{metric.title}</div>



              <div className="bk-metric-value">{metric.value}</div>



              <div className="bk-metric-subtitle">{metric.subtitle}</div>

            </div>

          );

        })}

      </div>



      {/* =====================================================

          CONTENT GRID (SALES SUMMARY & BESTSELLERS)

      \===================================================== */}



      <div className="bk-content-grid">

        {/* Revenue & Overview Panel */}

        <div className="bk-panel">

          <div className="bk-panel-header">

            <div className="bk-panel-title-wrap">

              <div className="bk-panel-icon">

                <DollarSign size={18} strokeWidth={2.6} />

              </div>

              <div>

                <h3 className="bk-panel-title">Revenue & Volume</h3>

                <p className="bk-panel-description">

                  Financial performance metrics

                </p>

              </div>

            </div>

            <div className="bk-panel-badge">{dateLabel}</div>

          </div>



          <div className="bk-sales-body">

            <div className="bk-sales-highlight">

              <div className="bk-sales-label">

                <DollarSign size={13} /> Total Revenue Generated

              </div>

              <div className="bk-sales-number">

                ₹{totalRevenue.toLocaleString("en-IN")}

              </div>

              <div className="bk-sales-note">

                Aggregated from {totalOrdersCount} valid orders in the

                selected period.

              </div>

            </div>



            <div className="bk-sales-mini-grid">

              <div className="bk-mini-card">

                <div className="bk-mini-label">Total Volume</div>

                <div className="bk-mini-value">

                  {totalOrdersCount}{" "}

                  <span style={{ fontSize: "12px", color: "#806c61" }}>

                    orders

                  </span>

                </div>

              </div>

              <div className="bk-mini-card">

                <div className="bk-mini-label">Success Rate</div>

                <div

                  className="bk-mini-value"

                  style={{ color: "#00843d" }}

                >

                  {totalOrdersCount > 0

                    ? `${Math.round(

                      (completedOrders / totalOrdersCount) * 100

                    )}%`

                    : "0%"}

                </div>

              </div>

            </div>

          </div>

        </div>



        {/* Bestsellers Panel */}

        <div className="bk-panel">

          <div className="bk-panel-header">

            <div className="bk-panel-title-wrap">

              <div className="bk-panel-icon">

                <Trophy size={18} strokeWidth={2.6} />

              </div>

              <div>

                <h3 className="bk-panel-title">Top Bestsellers</h3>

                <p className="bk-panel-description">

                  Most ordered menu items

                </p>

              </div>

            </div>

            <Flame size={18} className="bk-hot-icon" />

          </div>



          <div className="bk-best-body">

            {topFiveItems.length > 0 ? (

              topFiveItems.map((item, index) => {

                const img = getItemImage(item);



                return (

                  <div key={item.key} className="bk-best-item">

                    <div className="bk-rank">#{index + 1}</div>



                    <div className="bk-food-image">

                      {img ? (

                        <img src={img} alt={item.name} />

                      ) : (

                        <div className="bk-food-placeholder">

                          <Utensils size={18} />

                        </div>

                      )}

                    </div>



                    <div className="bk-food-info">

                      <div className="bk-food-name" title={item.name}>

                        {item.name}

                      </div>

                      <div className="bk-food-meta">{item.category}</div>

                      <div className="bk-food-sales">

                        <span className="bk-sales-pill">

                          Qty: {item.quantity}

                        </span>

                        <span className="bk-amount-pill">

                          ₹{item.sales.toLocaleString("en-IN")}

                        </span>

                      </div>

                    </div>

                  </div>

                );

              })

            ) : (

              <div className="bk-empty">

                <div className="bk-empty-icon">

                  <Package size={22} />

                </div>

                <div className="bk-empty-title">No Sales Found</div>

                <div className="bk-empty-text">

                  There are no recorded food sales matching the selected

                  date filter criteria.

                </div>

              </div>

            )}

          </div>

        </div>

      </div>



      {/* =====================================================

          SALES BREAKDOWN MODAL

      \===================================================== */}



      {showSalesModal && (

        <div

          className="bk-modal-overlay"

          onClick={() => setShowSalesModal(false)}

        >

          <div

            className="bk-modal"

            onClick={(e) => e.stopPropagation()}

          >

            {/* Header */}

            <div className="bk-modal-header">

              <div className="bk-modal-title-wrap">

                <div className="bk-modal-icon">

                  <DollarSign size={20} />

                </div>



                <div>

                  <h3 className="bk-modal-title">

                    Item-Wise Sales Breakdown

                  </h3>



                  <p className="bk-modal-subtitle">

                    {dateLabel}  •  {itemSales.length}{" "}

                    {itemSales.length === 1 ? "item" : "items"} sold

                  </p>

                </div>

              </div>



              <button

                className="bk-close"

                onClick={() => setShowSalesModal(false)}

                aria-label="Close"

              >

                <X size={18} />

              </button>

            </div>



            {/* Summary */}

            {itemSales.length > 0 && (

              <div className="bk-modal-summary">

                <div className="bk-summary-card items">

                  <div className="bk-summary-label">Dishes</div>

                  <div className="bk-summary-value">

                    {itemSales.length}

                  </div>

                </div>



                <div className="bk-summary-card qty">

                  <div className="bk-summary-label">Total Quantity</div>

                  <div className="bk-summary-value">

                    {itemsTotalQuantity.toLocaleString("en-IN")}

                  </div>

                </div>



                <div className="bk-summary-card sales">

                  <div className="bk-summary-label">Total Sales</div>

                  <div className="bk-summary-value">

                    ₹{itemsTotalSales.toLocaleString("en-IN")}

                  </div>

                </div>

              </div>

            )}



            {/* Sort toolbar */}

            {itemSales.length > 0 && (

              <div className="bk-sort-bar">

                <span className="bk-sort-label">Sort by price</span>



                <button

                  type="button"

                  className={`bk-sort-btn ${sortMode === "sales_desc" ? "active" : ""

                    }`}

                  onClick={() => setSortMode("sales_desc")}

                >

                  <ArrowDown size={14} />

                  High to Low

                </button>



                <button

                  type="button"

                  className={`bk-sort-btn ${sortMode === "sales_asc" ? "active" : ""

                    }`}

                  onClick={() => setSortMode("sales_asc")}

                >

                  <ArrowUp size={14} />

                  Low to High

                </button>

              </div>

            )}



            {/* List */}

            <div className="bk-modal-body">

              {sortedSales.length > 0 ? (

                sortedSales.map((item, idx) => {

                  const img = getItemImage(item);



                  const sharePercent =

                    itemsTotalSales > 0

                      ? Math.round((item.sales / itemsTotalSales) * 100)

                      : 0;



                  return (

                    <div key={item.key} className="bk-sales-row">

                      <div className="bk-sales-row-rank">#{idx + 1}</div>



                      <div className="bk-sales-row-img">

                        {img ? (

                          <img src={img} alt={item.name} />

                        ) : (

                          <div className="bk-food-placeholder">

                            <Utensils size={18} />

                          </div>

                        )}

                      </div>



                      <div className="bk-sales-row-info">

                        <div

                          className="bk-sales-row-name"

                          title={item.name}

                        >

                          {item.name}

                        </div>



                        <div className="bk-sales-row-category">

                          {item.category} • ₹{item.price} each

                        </div>



                        <div className="bk-share">

                          <div className="bk-share-track">

                            <div

                              className="bk-share-fill"

                              style={{

                                width: `${Math.max(sharePercent, 2)}%`,

                              }}

                            />

                          </div>

                          <span className="bk-share-text">

                            {sharePercent}% of sales

                          </span>

                        </div>

                      </div>



                      <div className="bk-sales-row-boxes">

                        <div className="bk-box bk-box-qty">

                          <div className="bk-box-label">Quantity</div>

                          <div className="bk-box-value">

                            {item.quantity}

                          </div>

                        </div>



                        <div className="bk-box bk-box-sales">

                          <div className="bk-box-label">Total Sales</div>

                          <div className="bk-box-value">

                            ₹{item.sales.toLocaleString("en-IN")}

                          </div>

                        </div>

                      </div>

                    </div>

                  );

                })

              ) : (

                <div className="bk-empty">

                  <div className="bk-empty-icon">

                    <Package size={22} />

                  </div>

                  <div className="bk-empty-title">No Item Records</div>

                  <div className="bk-empty-text">

                    No items found for the selected time range.

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>

  );

};