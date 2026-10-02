import React, { useMemo, useState } from "react";



import {

  DollarSign,

  ShoppingBag,

  TrendingUp,

  Clock,

  Flame,

  ArrowUpRight,

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



  const [dateFilter, setDateFilter] =

    useState<DateFilter>("all");



  const [customStartDate, setCustomStartDate] =

    useState("");



  const [customEndDate, setCustomEndDate] =

    useState("");



  const [showSalesModal, setShowSalesModal] =

    useState(false);



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



    const date = new Date(

      backendOrder.createdAt

    );



    return Number.isNaN(date.getTime())

      ? null

      : date;

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



  const isSameDay = (

    first: Date,

    second: Date

  ) => {

    return (

      first.getFullYear() ===

        second.getFullYear() &&

      first.getMonth() ===

        second.getMonth() &&

      first.getDate() ===

        second.getDate()

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



      yesterday.setDate(

        yesterday.getDate() - 1

      );



      return orders.filter((order) => {

        const orderDate = getOrderDate(order);



        if (!orderDate) {

          return false;

        }



        return isSameDay(

          orderDate,

          yesterday

        );

      });

    }



    if (dateFilter === "7days") {

      const start = new Date(now);



      start.setDate(

        start.getDate() - 6

      );



      const startDate = startOfDay(start);

      const endDate = endOfDay(now);



      return orders.filter((order) => {

        const orderDate = getOrderDate(order);



        if (!orderDate) {

          return false;

        }



        return (

          orderDate >= startDate &&

          orderDate <= endDate

        );

      });

    }



    if (dateFilter === "30days") {

      const start = new Date(now);



      start.setDate(

        start.getDate() - 29

      );



      const startDate = startOfDay(start);

      const endDate = endOfDay(now);



      return orders.filter((order) => {

        const orderDate = getOrderDate(order);



        if (!orderDate) {

          return false;

        }



        return (

          orderDate >= startDate &&

          orderDate <= endDate

        );

      });

    }



    if (

      dateFilter === "custom" &&

      customStartDate

    ) {

      const start = startOfDay(

        new Date(`${customStartDate}T00:00:00`)

      );



      const end = customEndDate

        ? endOfDay(

            new Date(

              `${customEndDate}T00:00:00`

            )

          )

        : endOfDay(start);



      return orders.filter((order) => {

        const orderDate = getOrderDate(order);



        if (!orderDate) {

          return false;

        }



        return (

          orderDate >= start &&

          orderDate <= end

        );

      });

    }



    return orders;

  }, [

    orders,

    dateFilter,

    customStartDate,

    customEndDate,

  ]);



  // =========================================================

  // REAL SUMMARY DATA

  // =========================================================



  const totalRevenue = useMemo(() => {

    return filteredOrders.reduce(

      (acc, order) =>

        acc + Number(order.total || 0),

      0

    );

  }, [filteredOrders]);



  const totalOrdersCount =

    filteredOrders.length;



  const avgOrderValue =

    totalOrdersCount > 0

      ? Math.round(

          totalRevenue /

            totalOrdersCount

        )

      : 0;



  const completedOrders =

    filteredOrders.filter(

      (order) =>

        String(order.status).toLowerCase() ===

        "completed"

    ).length;



  // =========================================================

  // REAL ITEM-WISE SALES

  // =========================================================



  const itemSales = useMemo<SalesItem[]>(() => {

    const salesMap = new Map<

      string,

      SalesItem

    >();



    filteredOrders.forEach((order) => {

      const items = getOrderItems(order);



      items.forEach((item) => {

        const name =

          String(item.name || "").trim();



        if (!name) {

          return;

        }



        const key =

          String(

            item.foodId ||

              item.id ||

              name

          ).toLowerCase();



        const quantity =

          Number(item.quantity || 0);



        const price =

          Number(item.price || 0);



        if (quantity <= 0) {

          return;

        }



        const existing =

          salesMap.get(key);



        if (existing) {

          existing.quantity += quantity;



          existing.sales +=

            price * quantity;



          if (

            !existing.image &&

            item.image

          ) {

            existing.image = item.image;

          }

        } else {

          salesMap.set(key, {

            key,

            name,

            category:

              String(

                item.category || "Uncategorized"

              ),

            quantity,

            sales:

              price * quantity,

            image:

              item.image || undefined,

            price,

          });

        }

      });

    });



    return Array.from(

      salesMap.values()

    ).sort(

      (a, b) =>

        b.quantity - a.quantity ||

        b.sales - a.sales

    );

  }, [filteredOrders]);



  // =========================================================

  // TOP 5 ACTUAL BESTSELLERS

  // =========================================================



  const topFiveItems =

    itemSales.slice(0, 5);



  // =========================================================

  // MENU IMAGE FALLBACK

  // =========================================================



  const getItemImage = (

    item: SalesItem

  ) => {

    if (item.image) {

      return item.image;

    }



    const menuItem =

      menuItems.find(

        (menu) =>

          String(menu.name)

            .toLowerCase()

            .trim() ===

          item.name

            .toLowerCase()

            .trim()

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

        if (

          customStartDate &&

          customEndDate

        ) {

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

      value: `₹${totalRevenue.toLocaleString(

        "en-IN"

      )}`,

      subtitle: "Click to view item-wise sales",

      icon: DollarSign,

      accent: "#d62300",

      soft: "#fff0eb",

      clickable: true,

    },

    {

      title: "Total Orders",

      value:

        totalOrdersCount.toLocaleString(

          "en-IN"

        ),

      subtitle: dateLabel,

      icon: ShoppingBag,

      accent: "#b8860b",

      soft: "#fff7df",

      clickable: false,

    },

    {

      title: "Average Order",

      value: `₹${avgOrderValue.toLocaleString(

        "en-IN"

      )}`,

      subtitle: "Based on filtered orders",

      icon: TrendingUp,

      accent: "#00843d",

      soft: "#edf8f1",

      clickable: false,

    },

    {

      title: "Completed",

      value:

        completedOrders.toLocaleString(

          "en-IN"

        ),

      subtitle: "Completed orders",

      icon: Clock,

      accent: "#6b3f2e",

      soft: "#f4ebe6",

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
          --bk-red: #d62300;
          --bk-red-dark: #a91b00;
          --bk-orange: #ef7d00;
          --bk-yellow: #f6c400;
          --bk-green: #00843d;
          --bk-brown: #24120d;
          --bk-muted: #8d776d;
          --bk-border: rgba(82, 46, 31, .10);
          width: 100%;
          min-height: 100%;
          padding: 6px 2px 36px;
          color: var(--bk-brown);
          font-family: "Arial Rounded MT Bold", "Trebuchet MS", system-ui, sans-serif;
          background:
            radial-gradient(circle at 88% 0%, rgba(246,196,0,.10), transparent 23%),
            radial-gradient(circle at 0% 35%, rgba(214,35,0,.055), transparent 24%);
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
          margin-bottom: 16px;
          padding: 18px 20px;
          overflow: hidden;
          border: 1px solid rgba(214,35,0,.09);
          border-radius: 24px;
          background: linear-gradient(135deg, #fff 0%, #fffaf7 70%, #fff4ed 100%);
          box-shadow: 0 14px 35px rgba(55,27,17,.065);
        }

        .bk-stats-header::after {
          content: "";
          position: absolute;
          width: 170px;
          height: 170px;
          right: -80px;
          top: -105px;
          border-radius: 50%;
          background: rgba(246,196,0,.16);
          pointer-events: none;
        }

        .bk-title-wrap { display: flex; align-items: center; gap: 13px; position: relative; z-index: 2; }

        .bk-flame-icon {
          width: 50px;
          height: 50px;
          flex: 0 0 50px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          color: #fff;
          background: linear-gradient(145deg, var(--bk-red), var(--bk-orange));
          box-shadow: 0 10px 24px rgba(214,35,0,.23), inset 0 1px 0 rgba(255,255,255,.22);
        }

        .bk-stats-title { margin: 0; font-size: 25px; line-height: 1.08; font-weight: 950; letter-spacing: -.8px; }
        .bk-stats-subtitle { margin: 5px 0 0; color: var(--bk-muted); font-size: 12px; font-weight: 650; }

        .bk-live-badge {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border: 1px solid rgba(0,132,61,.13);
          border-radius: 999px;
          background: rgba(255,255,255,.88);
          color: #24633f;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .75px;
          text-transform: uppercase;
          box-shadow: 0 5px 16px rgba(0,132,61,.07);
        }

        .bk-live-dot { width: 8px; height: 8px; border-radius: 50%; background: #12a052; box-shadow: 0 0 0 4px rgba(18,160,82,.11); animation: bkPulse 1.8s infinite; }
        @keyframes bkPulse { 0%,100% { box-shadow: 0 0 0 4px rgba(18,160,82,.10); } 50% { box-shadow: 0 0 0 7px rgba(18,160,82,.025); } }

        .bk-filter-bar {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          padding: 9px;
          margin-bottom: 14px;
          border: 1px solid var(--bk-border);
          border-radius: 18px;
          background: rgba(255,255,255,.88);
          box-shadow: 0 10px 28px rgba(55,27,17,.045);
          backdrop-filter: blur(12px);
        }

        .bk-filter-title {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 8px;
          color: #704d3d;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .75px;
          text-transform: uppercase;
        }

        .bk-filter-select { position: relative; }
        .bk-filter-select select {
          appearance: none;
          height: 38px;
          min-width: 152px;
          padding: 0 36px 0 12px;
          border: 1px solid #eaded7;
          border-radius: 11px;
          outline: none;
          background: #fffaf7;
          color: #3b2016;
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
          transition: .2s ease;
        }
        .bk-filter-select select:hover { border-color: rgba(214,35,0,.28); background: #fff; }
        .bk-filter-select select:focus { border-color: var(--bk-red); box-shadow: 0 0 0 3px rgba(214,35,0,.08); }
        .bk-filter-select svg { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #806c61; }

        .bk-date-input {
          height: 38px;
          padding: 0 11px;
          border: 1px solid #eaded7;
          border-radius: 11px;
          outline: none;
          background: #fffaf7;
          color: #3b2016;
          font-size: 10px;
          font-weight: 750;
          transition: .2s ease;
        }
        .bk-date-input:focus { border-color: var(--bk-red); box-shadow: 0 0 0 3px rgba(214,35,0,.08); background: #fff; }

        .bk-filter-result {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 7px 11px;
          border-radius: 10px;
          background: linear-gradient(135deg, #fff0eb, #fff7df);
          color: var(--bk-red);
          font-size: 9px;
          font-weight: 950;
          box-shadow: inset 0 0 0 1px rgba(214,35,0,.06);
        }

        .bk-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 11px;
          margin-bottom: 14px;
        }

        .bk-metric-card {
          position: relative;
          min-height: 142px;
          overflow: hidden;
          padding: 17px;
          border: 1px solid var(--bk-border);
          border-radius: 20px;
          background: linear-gradient(145deg, #fff 0%, #fffdfc 72%, #fff7f2 100%);
          box-shadow: 0 10px 28px rgba(55,27,17,.055);
          transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
        }

        .bk-metric-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, var(--bk-red), var(--bk-orange), var(--bk-yellow));
          opacity: .8;
        }

        .bk-metric-card::after {
          content: "";
          position: absolute;
          width: 105px;
          height: 105px;
          right: -48px;
          bottom: -55px;
          border-radius: 50%;
          background: rgba(214,35,0,.045);
        }

        .bk-metric-card:hover { transform: translateY(-3px); border-color: rgba(214,35,0,.16); box-shadow: 0 17px 36px rgba(55,27,17,.09); }
        .bk-metric-top { position: relative; z-index: 2; display: flex; align-items: flex-start; justify-content: space-between; }
        .bk-metric-icon { width: 43px; height: 43px; border-radius: 13px; display: grid; place-items: center; box-shadow: inset 0 0 0 1px rgba(0,0,0,.025); }
        .bk-arrow { width: 28px; height: 28px; border-radius: 9px; display: grid; place-items: center; color: #a38c81; background: #faf7f4; transition: .2s ease; }
        .bk-metric-card:hover .bk-arrow { color: var(--bk-red); background: #fff0eb; transform: translate(1px,-1px); }
        .bk-metric-title { position: relative; z-index: 2; margin-top: 14px; color: #806c61; font-size: 9px; font-weight: 950; letter-spacing: .75px; text-transform: uppercase; }
        .bk-metric-value { position: relative; z-index: 2; margin-top: 5px; color: #24120d; font-size: 27px; line-height: 1.05; font-weight: 950; letter-spacing: -1px; }
        .bk-metric-subtitle { position: relative; z-index: 2; margin-top: 7px; color: #9b887e; font-size: 9px; font-weight: 650; }

        .bk-content-grid { display: grid; grid-template-columns: minmax(0,1.3fr) minmax(330px,.7fr); gap: 14px; }

        .bk-panel {
          overflow: hidden;
          border: 1px solid var(--bk-border);
          border-radius: 21px;
          background: rgba(255,255,255,.95);
          box-shadow: 0 11px 30px rgba(55,27,17,.055);
        }

        .bk-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 16px 18px;
          border-bottom: 1px solid #f0e6e0;
          background: linear-gradient(180deg, #fff, #fffdfc);
        }

        .bk-panel-title-wrap { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .bk-panel-icon { width: 38px; height: 38px; flex: 0 0 38px; border-radius: 12px; display: grid; place-items: center; background: #fff0eb; color: var(--bk-red); box-shadow: inset 0 0 0 1px rgba(214,35,0,.06); }
        .bk-panel-title { margin: 0; color: #24120d; font-size: 14px; font-weight: 950; }
        .bk-panel-description { margin: 3px 0 0; color: #968279; font-size: 9px; font-weight: 650; }
        .bk-panel-badge { padding: 6px 9px; border-radius: 999px; background: #fff7df; color: #956b00; font-size: 8px; font-weight: 950; letter-spacing: .55px; text-transform: uppercase; white-space: nowrap; }

        .bk-sales-body { padding: 16px; }
        .bk-sales-highlight {
          position: relative;
          min-height: 155px;
          overflow: hidden;
          padding: 21px;
          border-radius: 19px;
          background: radial-gradient(circle at 86% 18%, rgba(246,196,0,.20), transparent 20%), linear-gradient(135deg, #1f100b 0%, #432014 56%, #6b2f1b 100%);
          color: #fff;
          box-shadow: 0 13px 28px rgba(36,18,13,.16);
        }
        .bk-sales-highlight::before { content: ""; position: absolute; width: 190px; height: 190px; right: -76px; top: -102px; border-radius: 50%; background: rgba(246,196,0,.10); }
        .bk-sales-highlight::after { content: ""; position: absolute; width: 120px; height: 120px; right: 44px; bottom: -82px; border-radius: 50%; background: rgba(214,35,0,.20); }
        .bk-sales-label { position: relative; z-index: 2; display: flex; align-items: center; gap: 7px; color: #f7d76a; font-size: 9px; font-weight: 950; letter-spacing: .95px; text-transform: uppercase; }
        .bk-sales-number { position: relative; z-index: 2; margin-top: 9px; font-size: 36px; line-height: 1; font-weight: 950; letter-spacing: -1.4px; }
        .bk-sales-note { position: relative; z-index: 2; margin-top: 10px; color: #dfcfc6; font-size: 9px; font-weight: 650; }

        .bk-sales-mini-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 9px; margin-top: 11px; }
        .bk-mini-card { min-width: 0; padding: 12px; border: 1px solid #f0e3dc; border-radius: 14px; background: linear-gradient(145deg,#fff,#fffaf7); transition: .2s ease; }
        .bk-mini-card:hover { transform: translateY(-2px); border-color: rgba(214,35,0,.14); box-shadow: 0 8px 20px rgba(55,27,17,.06); }
        .bk-mini-label { color: #927d73; font-size: 8px; font-weight: 950; letter-spacing: .55px; text-transform: uppercase; }
        .bk-mini-value { margin-top: 5px; color: #24120d; font-size: 18px; font-weight: 950; }

        .bk-best-body { padding: 7px 11px 11px; }
        .bk-best-item { position: relative; display: flex; align-items: center; gap: 9px; padding: 10px 6px; border-bottom: 1px solid #f2e9e4; border-radius: 13px; transition: .2s ease; }
        .bk-best-item:last-child { border-bottom: 0; }
        .bk-best-item:hover { padding-left: 9px; background: linear-gradient(90deg,#fff8f4,#fff); box-shadow: inset 3px 0 0 var(--bk-red); }
        .bk-rank { width: 29px; height: 29px; flex: 0 0 29px; display: grid; place-items: center; border-radius: 9px; background: linear-gradient(145deg,var(--bk-red),var(--bk-orange)); color: #fff; font-size: 8px; font-weight: 950; box-shadow: 0 5px 12px rgba(214,35,0,.15); }
        .bk-food-image { width: 52px; height: 52px; flex: 0 0 52px; overflow: hidden; border-radius: 14px; background: #f7eee9; border: 1px solid #eaded7; box-shadow: 0 5px 13px rgba(55,27,17,.07); }
        .bk-food-image img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .35s ease; }
        .bk-best-item:hover .bk-food-image img { transform: scale(1.06); }
        .bk-food-placeholder { width: 100%; height: 100%; display: grid; place-items: center; color: #b69c8e; }
        .bk-food-info { min-width: 0; flex: 1; }
        .bk-food-name { overflow: hidden; color: #2b160e; font-size: 11px; font-weight: 950; white-space: nowrap; text-overflow: ellipsis; }
        .bk-food-meta { margin-top: 3px; color: #9a867c; font-size: 8px; font-weight: 800; letter-spacing: .35px; text-transform: uppercase; }
        .bk-food-sales { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; }
        .bk-sales-pill, .bk-amount-pill { padding: 4px 6px; border-radius: 6px; font-size: 7px; font-weight: 950; }
        .bk-sales-pill { background: #fff0eb; color: var(--bk-red); }
        .bk-amount-pill { background: #edf8f1; color: var(--bk-green); }
        .bk-hot-icon { flex-shrink: 0; color: #e09c00; filter: drop-shadow(0 2px 3px rgba(224,156,0,.18)); }

        .bk-empty { min-height: 190px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px; padding: 25px; text-align: center; }
        .bk-empty-icon { width: 47px; height: 47px; display: grid; place-items: center; border-radius: 15px; background: #fff4ee; color: var(--bk-red); box-shadow: inset 0 0 0 1px rgba(214,35,0,.07); }
        .bk-empty-title { color: #3a2118; font-size: 12px; font-weight: 950; }
        .bk-empty-text { max-width: 270px; color: #9a867c; font-size: 10px; font-weight: 600; line-height: 1.55; }

        .bk-modal-overlay { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 18px; background: rgba(28,13,8,.60); backdrop-filter: blur(8px); animation: bkFade .18s ease; }
        @keyframes bkFade { from { opacity: 0; } to { opacity: 1; } }
        .bk-modal {
  width: min(860px, 100%);
  max-height: 88vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  border: 1px solid rgba(214,35,0,.12);
  border-radius: 26px;

  background: #fffaf7;

  box-shadow:
    0 35px 100px rgba(36,18,13,.30),
    0 8px 30px rgba(214,35,0,.08);

  animation: bkModal .22s ease;
}

@keyframes bkModal {
  from {
    transform: translateY(14px) scale(.985);
    opacity: .7;
  }

  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}


/* =========================
   MODAL HEADER
========================= */

.bk-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  padding: 20px 22px;

  background:
    radial-gradient(
      circle at 90% 0%,
      rgba(246,196,0,.22),
      transparent 24%
    ),
    linear-gradient(
      135deg,
      #21100b 0%,
      #421d12 55%,
      #6b2b18 100%
    );

  color: #fff;
}

.bk-modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
}

.bk-modal-icon {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;

  display: grid;
  place-items: center;

  border-radius: 14px;

  background:
    linear-gradient(
      145deg,
      #ffbf18,
      #ef7d00 45%,
      #d62300
    );

  color: #fff;

  box-shadow:
    0 8px 22px rgba(214,35,0,.30),
    inset 0 1px 0 rgba(255,255,255,.25);
}

.bk-modal-title {
  margin: 0;

  font-size: 17px;
  line-height: 1.15;
  font-weight: 950;
  letter-spacing: -.3px;
}

.bk-modal-subtitle {
  margin: 5px 0 0;

  color: #e6d4cb;

  font-size: 9px;
  font-weight: 700;
}


/* =========================
   CLOSE BUTTON
========================= */

.bk-close {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;

  border: 1px solid rgba(255,255,255,.16);
  border-radius: 11px;

  display: grid;
  place-items: center;

  background: rgba(255,255,255,.09);
  color: #fff;

  cursor: pointer;

  transition:
    background .18s ease,
    transform .18s ease,
    border-color .18s ease;
}

.bk-close:hover {
  background: #d62300;
  border-color: #ffbf18;
  transform: scale(1.05);
}


/* =========================
   MODAL BODY
========================= */

.bk-modal-body {
  overflow-y: auto;
  padding: 12px 15px 16px;

  background:
    linear-gradient(
      180deg,
      #fffaf7 0%,
      #fff 100%
    );
}

.bk-modal-body::-webkit-scrollbar {
  width: 7px;
}

.bk-modal-body::-webkit-scrollbar-track {
  background: #f7eee9;
  border-radius: 99px;
}

.bk-modal-body::-webkit-scrollbar-thumb {
  border-radius: 99px;
  background: linear-gradient(
    180deg,
    #d62300,
    #ef7d00
  );
}


/* =========================
   SALES ROW
========================= */

.bk-sales-row {
  position: relative;

  display: grid;

  grid-template-columns:
    42px
    minmax(0, 1fr)
    100px
    135px;

  align-items: center;

  gap: 15px;

  margin-bottom: 7px;
  padding: 13px 12px;

  border: 1px solid #f0e3dc;
  border-radius: 15px;

  background: #fff;

  box-shadow:
    0 3px 12px rgba(55,27,17,.035);

  transition:
    transform .18s ease,
    border-color .18s ease,
    box-shadow .18s ease,
    background .18s ease;
}

.bk-sales-row:hover {
  transform: translateY(-2px);

  border-color: rgba(214,35,0,.18);

  background:
    linear-gradient(
      90deg,
      #fff9f5,
      #fff
    );

  box-shadow:
    0 8px 22px rgba(55,27,17,.08);
}

.bk-sales-row:last-child {
  margin-bottom: 0;
}


/* =========================
   RANK
========================= */

.bk-sales-row-rank {
  width: 32px;
  height: 32px;

  display: grid;
  place-items: center;

  border-radius: 10px;

  background:
    linear-gradient(
      145deg,
      #fff0eb,
      #fff7df
    );

  color: #d62300;

  font-size: 8px;
  font-weight: 950;

  border: 1px solid rgba(214,35,0,.08);
}


/* =========================
   ITEM NAME
========================= */

.bk-sales-row-name {
  overflow: hidden;

  color: #2b160e;

  font-size: 12px;
  font-weight: 950;

  white-space: nowrap;
  text-overflow: ellipsis;
}

.bk-sales-row-category {
  margin-top: 4px;

  color: #9a867c;

  font-size: 8px;
  font-weight: 800;

  letter-spacing: .35px;
  text-transform: uppercase;
}


/* =========================
   QUANTITY
========================= */

.bk-sales-row-qty,
.bk-sales-row-total {
  text-align: right;
}

.bk-sales-row-label {
  color: #a18d83;

  font-size: 7px;
  font-weight: 900;

  letter-spacing: .7px;
  text-transform: uppercase;
}

.bk-sales-row-value {
  margin-top: 4px;

  color: #24120d;

  font-size: 14px;
  font-weight: 950;
}


/* =========================
   TOTAL SALES
========================= */

.bk-sales-row-total {
  padding: 7px 10px;

  border-radius: 11px;

  background:
    linear-gradient(
      135deg,
      #fff0eb,
      #fff7f2
    );

  border: 1px solid rgba(214,35,0,.08);
}

.bk-sales-row-total .bk-sales-row-value {
  color: #d62300;

  font-size: 14px;
  font-weight: 950;
}
        
        

        @media (max-width: 1120px) {
          .bk-metrics-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .bk-content-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 760px) {
          .bk-stats-page { padding: 2px 0 22px; }
          .bk-stats-header { padding: 15px; border-radius: 19px; }
          .bk-stats-title { font-size: 21px; }
          .bk-live-badge { display: none; }
          .bk-filter-bar { align-items: stretch; padding: 8px; }
          .bk-filter-title { width: 100%; padding: 2px; }
          .bk-filter-select, .bk-filter-select select, .bk-date-input { width: 100%; }
          .bk-filter-result { width: 100%; justify-content: center; margin-left: 0; }
          .bk-metrics-grid { grid-template-columns: 1fr; gap: 9px; }
          .bk-metric-card { min-height: 126px; }
          .bk-content-grid { gap: 10px; }
          .bk-panel { border-radius: 18px; }
          .bk-sales-body { padding: 13px; }
          .bk-sales-mini-grid { grid-template-columns: repeat(2,1fr); }
          .bk-sales-number { font-size: 30px; }
          .bk-panel-header { padding: 14px; }
          .bk-modal-overlay { padding: 10px; }
          .bk-modal { max-height: 92vh; border-radius: 20px; }
          .bk-sales-row { grid-template-columns: 34px minmax(0,1fr); gap: 9px; }
          .bk-sales-row-qty, .bk-sales-row-total { grid-column: 2; text-align: left; }
          .bk-sales-row-total { margin-top: -4px; }
        }
        @media (max-width: 430px) {
          .bk-title-wrap { gap: 9px; }
          .bk-flame-icon { width: 41px; height: 41px; flex-basis: 41px; border-radius: 13px; }
          .bk-stats-title { font-size: 19px; }
          .bk-stats-subtitle { font-size: 10px; }
          .bk-metric-card { padding: 15px; border-radius: 17px; }
          .bk-metric-value { font-size: 24px; }
          .bk-sales-highlight { min-height: 142px; padding: 17px; }
          .bk-mini-card { padding: 10px; }
          .bk-mini-value { font-size: 17px; }
          .bk-food-image { width: 47px; height: 47px; flex-basis: 47px; }
          .bk-best-body { padding-left: 8px; padding-right: 8px; }
        }
`}</style>







      {/* =====================================================

          DATE FILTER

      ===================================================== */}



      <div className="bk-filter-bar">

        <div className="bk-filter-title">

          <CalendarDays size={15} />

          Order Date

        </div>



        <div className="bk-filter-select">

          <select

            value={dateFilter}

            onChange={(event) =>

              setDateFilter(

                event.target.value as DateFilter

              )

            }

          >

            <option value="all">

              All Time

            </option>



            <option value="today">

              Today

            </option>



            <option value="yesterday">

              Yesterday

            </option>



            <option value="7days">

              Last 7 Days

            </option>



            <option value="30days">

              Last 30 Days

            </option>



            <option value="custom">

              Custom Date / Range

            </option>

          </select>



          <ChevronDown size={14} />

        </div>



        {dateFilter === "custom" && (

          <>

            <input

              type="date"

              className="bk-date-input"

              value={customStartDate}

              onChange={(e) =>

                setCustomStartDate(e.target.value)

              }

              placeholder="Start Date"

            />

            <input

              type="date"

              className="bk-date-input"

              value={customEndDate}

              onChange={(e) =>

                setCustomEndDate(e.target.value)

              }

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

      ===================================================== */}



      <div className="bk-metrics-grid">

        {metrics.map((metric, idx) => {

          const Icon = metric.icon;



          return (

            <div

              key={idx}

              className={`bk-metric-card ${

                metric.clickable ? "clickable" : ""

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



              <div className="bk-metric-title">

                {metric.title}

              </div>



              <div className="bk-metric-value">

                {metric.value}

              </div>



              <div className="bk-metric-subtitle">

                {metric.subtitle}

              </div>

            </div>

          );

        })}

      </div>



      {/* =====================================================

          CONTENT GRID (SALES SUMMARY & BESTSELLERS)

      ===================================================== */}



      <div className="bk-content-grid">

        {/* Revenue & Overview Panel */}

        <div className="bk-panel">

          <div className="bk-panel-header">

            <div className="bk-panel-title-wrap">

              <div className="bk-panel-icon">

                <DollarSign size={18} strokeWidth={2.6} />

              </div>

              <div>

                <h3 className="bk-panel-title">

                  Revenue & Volume

                </h3>

                <p className="bk-panel-description">

                  Financial performance metrics

                </p>

              </div>

            </div>

            <div className="bk-panel-badge">

              {dateLabel}

            </div>

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

                Aggregated from {totalOrdersCount} valid orders in the selected period.

              </div>

            </div>



            <div className="bk-sales-mini-grid">

              <div className="bk-mini-card">

                <div className="bk-mini-label">Total Volume</div>

                <div className="bk-mini-value">

                  {totalOrdersCount} <span style={{ fontSize: "12px", color: "#806c61" }}>orders</span>

                </div>

              </div>

              <div className="bk-mini-card">

                <div className="bk-mini-label">Success Rate</div>

                <div className="bk-mini-value" style={{ color: "#00843d" }}>

                  {totalOrdersCount > 0

                    ? `${Math.round((completedOrders / totalOrdersCount) * 100)}%`

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

                <h3 className="bk-panel-title">

                  Top Bestsellers

                </h3>

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

                    <div className="bk-rank">

                      #{index + 1}

                    </div>



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

                      <div className="bk-food-meta">

                        {item.category}

                      </div>

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

                <div className="bk-empty-title">

                  No Sales Found

                </div>

                <div className="bk-empty-text">

                  There are no recorded food sales matching the selected date filter criteria.

                </div>

              </div>

            )}

          </div>

        </div>

      </div>



      {/* =====================================================

          SALES BREAKDOWN MODAL

      ===================================================== */}



      {showSalesModal && (

        <div className="bk-modal-overlay" onClick={() => setShowSalesModal(false)}>

          <div className="bk-modal" onClick={(e) => e.stopPropagation()}>

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

                    ITEMS WISE SALES BREAKDOWN FOR {dateLabel.toLowerCase()}

                  </p>

                </div>

              </div>



              <button

                className="bk-close"

                onClick={() => setShowSalesModal(false)}

              >

                <X size={18} />

              </button>

            </div>



            <div className="bk-modal-body">

              {itemSales.length > 0 ? (

                itemSales.map((item, idx) => (

                  <div key={item.key} className="bk-sales-row">

                    <div className="bk-sales-row-rank">

                      #{idx + 1}

                    </div>



                    <div>

                      <div className="bk-sales-row-name">

                        {item.name}

                      </div>

                      <div className="bk-sales-row-category">

                        {item.category} • ₹{item.price} each

                      </div>

                    </div>



                    <div className="bk-sales-row-qty">

                      <div className="bk-sales-row-label">Quantity</div>

                      <div className="bk-sales-row-value">

                        {item.quantity}

                      </div>

                    </div>



                    <div className="bk-sales-row-total">

                      <div className="bk-sales-row-label">Total Sales</div>

                      <div className="bk-sales-row-value">

                        ₹{item.sales.toLocaleString("en-IN")}

                      </div>

                    </div>

                  </div>

                ))

              ) : (

                <div className="bk-empty">

                  <div className="bk-empty-icon">

                    <Package size={22} />

                  </div>

                  <div className="bk-empty-title">

                    No Item Records

                  </div>

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