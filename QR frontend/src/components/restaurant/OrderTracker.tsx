import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {

  CheckCircle,

  Check,

  Clock,

  ArrowLeft,

  Sparkles,

  Receipt,

  Plus,

  Flame,

  AlertCircle,

  RefreshCw,

  ClipboardList,

  ConciergeBell,

  Armchair,

  User,

  Wallet

} from 'lucide-react';



import api from '../../lib/api';

import { Order } from '../../types/restaurant';



interface OrderTrackerProps {

  order: Order;

  onBackToMenu: () => void;

  onOpenWaiterModal: () => void;

}



type TrackerStatus =

  | 'received'

  | 'preparing'

  | 'ready'

  | 'completed'

  | 'cancelled';



type BackendOrderStatus =

  | 'RECEIVED'

  | 'PREPARING'

  | 'READY'

  | 'COMPLETED'

  | 'CANCELLED';



interface BackendOrderResponse {

  id: string;

  tokenNumber?: number;

  tableNumber?: string;

  customerName?: string;

  customerPhone?: string;

  subtotal?: string | number;

  tax?: string | number;

  discount?: string | number;

  total?: string | number;

  paymentMethod?: string;

  paymentStatus?: string;

  status: BackendOrderStatus;

  specialInstructions?: string | null;

  estimatedPrepTime?: number | null;

  createdAt?: string;

  updatedAt?: string;



  items?: Array<{

    id: string;

    name: string;

    price: string | number;

    quantity: number;

    image?: string;

    category?: string;

  }>;



  statusHistory?: Array<{

    id: string;

    status: BackendOrderStatus;

    timestamp?: string;

    createdAt?: string;

  }>;

}



const normalizeStatus = (

  status: BackendOrderStatus

): TrackerStatus => {

  switch (status) {

    case 'RECEIVED':

      return 'received';



    case 'PREPARING':

      return 'preparing';



    case 'READY':

      return 'ready';



    case 'COMPLETED':

      return 'completed';



    case 'CANCELLED':

      return 'cancelled';



    default:

      return 'received';

  }

};



const formatStatus = (status: TrackerStatus) => {

  switch (status) {

    case 'received':

      return 'Order Confirmed';



    case 'preparing':

      return 'Preparing Your Order';



    case 'ready':

      return 'Ready at Kitchen';



    case 'completed':

      return 'Order Completed';



    case 'cancelled':

      return 'Order Cancelled';



    default:

      return 'Order Status';

  }

};



const formatPaymentStatus = (status?: string) => {

  if (!status) {

    return 'Not available';

  }



  return status

    .toLowerCase()

    .replace(/\_/g, ' ')

    .replace(/\b\w/g, char => char.toUpperCase());

};



/*

 * ============================================================

 * STYLES (UI only)

 * ============================================================

 */



const trackerCss = `

.ot-wrap{

  --ot-red:#c8102e;

  --ot-red-deep:#a30d1f;

  --ot-yellow:#ffb800;

  --ot-green:#1e9e3a;

  --ot-grey:#8a8a8a;

  --ot-brown:#3a0f0a;

  --ot-cream:#fff8f2;

  --ot-pink:#fde4e4;

  font-family:inherit;

}

.ot-wrap *{box-sizing:border-box;}



.ot-back{

  display:inline-flex;align-items:center;gap:.4rem;

  background:none;border:0;cursor:pointer;

  font-weight:700;color:var(--ot-brown);padding:0;margin-bottom:1rem;

}



.ot-card{

  position:relative;overflow:hidden;

  background:var(--ot-cream);

  border-radius:22px;

  padding:1rem .8rem .9rem;

  box-shadow:0 10px 30px rgba(120,20,10,.12);

}



/* faded fries + slash doodles (no burgers) */

.ot-fries{

  position:absolute;top:26px;right:14px;

  font-size:48px;line-height:1;opacity:.1;

  transform:rotate(12deg);pointer-events:none;user-select:none;

}

.ot-fries-left{

  position:absolute;top:70px;left:10px;

  font-size:44px;line-height:1;opacity:.07;

  transform:rotate(-14deg);pointer-events:none;user-select:none;

}

.ot-slash{

  position:absolute;width:4px;height:22px;border-radius:4px;

  pointer-events:none;

}



.ot-head{position:relative;text-align:center;margin-bottom:1rem;}



.ot-live{

  display:inline-flex;align-items:center;gap:.4rem;

  background:var(--ot-yellow);color:var(--ot-brown);

  font-weight:900;font-size:.75rem;letter-spacing:.01em;

  padding:.4rem 1rem;border-radius:999px;

  box-shadow:0 4px 10px rgba(255,184,0,.35);

}



.ot-token{

  margin:.4rem 0 .2rem;

  font-size:2rem;line-height:1.05;font-weight:900;

  color:var(--ot-brown);letter-spacing:-.02em;

}

.ot-token b{color:var(--ot-red);font-weight:900;}



.ot-meta{

  display:flex;justify-content:center;align-items:center;

  flex-wrap:wrap;gap:.35rem .8rem;

  font-size:.82rem;color:var(--ot-brown);

}

.ot-meta-item{display:inline-flex;align-items:center;gap:.5rem;}

.ot-chip{

  width:26px;height:26px;border-radius:8px;

  background:#fbe1e1;color:var(--ot-red);

  display:inline-flex;align-items:center;justify-content:center;

}

.ot-meta-sep{width:1px;height:20px;background:#e6d5cf;}



.ot-note{

  margin-top:.75rem;font-size:.85rem;color:#6b5550;

}

.ot-error{

  margin-top:.75rem;display:flex;align-items:center;justify-content:center;

  gap:.4rem;color:var(--ot-red);font-size:.85rem;

}

.ot-refresh{

  margin-top:.6rem;display:inline-flex;align-items:center;gap:.4rem;

  background:transparent;border:1px solid #ecd6cf;color:var(--ot-brown);

  border-radius:999px;padding:.35rem .9rem;font-size:.8rem;font-weight:700;

  cursor:pointer;

}

.ot-refresh:disabled{opacity:.6;cursor:default;}



/* ETA box */

.ot-eta{

  position:relative;margin-top:.7rem;

  border-radius:18px;padding:.65rem;text-align:center;

  background:linear-gradient(180deg,#fde8e8,#fbdcdc);

  border:1px solid #f6caca;

}

.ot-eta-label{

  font-size:.72rem;font-weight:800;color:#6b4a46;

  letter-spacing:.01em;margin-top:.2rem;

}

.ot-eta-time{

  font-size:2rem;font-weight:900;color:var(--ot-red);

  line-height:1.1;letter-spacing:-.01em;

}

.ot-eta-done{background:#e4f5e4;border-color:#bfe3c2;}

.ot-eta-done .ot-eta-time{color:var(--ot-green);font-size:1.15rem;}

.ot-eta-cancel{background:#fde4e4;border-color:#f3b8b8;}

.ot-eta-cancel .ot-eta-time{color:var(--ot-red);font-size:1.05rem;}



/* timeline */

.ot-timeline{position:relative;margin-top:.7rem;display:flex;flex-direction:column;gap:.45rem;}

.ot-step{position:relative;display:flex;align-items:stretch;gap:.4rem;}

.ot-rail{position:relative;width:40px;flex:0 0 40px;display:flex;justify-content:center;}

.ot-rail::before{

  content:"";position:absolute;top:0;bottom:-.45rem;left:50%;width:3px;

  transform:translateX(-50%);background:var(--seg,#ddd);

}

.ot-step:first-child .ot-rail::before{top:50%;}

.ot-step:last-child .ot-rail::before{bottom:50%;}

.ot-node{

  position:relative;z-index:1;align-self:center;

  width:34px;height:34px;border-radius:50%;

  display:flex;align-items:center;justify-content:center;

  background:var(--accent);color:#fff;

  box-shadow:0 0 0 4px #fff,0 0 0 5px rgba(0,0,0,.06);

}

.ot-node.is-current{box-shadow:0 0 0 4px #fff,0 0 0 6px var(--accent-soft);}

.ot-step-card{

  position:relative;flex:1;min-width:0;

  display:flex;align-items:center;gap:.65rem;

  padding:.55rem .7rem;border-radius:16px;

  background:var(--card-bg);

}

.ot-step-card::before{

  content:"";position:absolute;left:-7px;top:50%;

  width:14px;height:14px;background:var(--card-bg);

  transform:translateY(-50%) rotate(45deg);border-radius:3px;

}

.ot-step-ico{

  flex:0 0 auto;width:40px;height:40px;border-radius:12px;

  display:flex;align-items:center;justify-content:center;

  background:var(--ico-bg);color:var(--accent);

}

.ot-step-title{font-weight:900;font-size:.95rem;color:var(--title,var(--ot-brown));line-height:1.2;}

.ot-step-desc{font-size:.78rem;color:#5d4a46;margin-top:.15rem;line-height:1.3;}

.ot-step.is-upcoming .ot-step-card{opacity:.92;}



/* generic rows */

.ot-pay{

  margin-top:.7rem;display:flex;justify-content:space-between;align-items:center;

  gap:.6rem;padding:.5rem .7rem;border-radius:16px;

  background:#fffaf6;border:1px solid #f1e2da;

}

.ot-pay-left{display:flex;align-items:center;gap:.6rem;font-weight:800;font-size:.9rem;color:var(--ot-brown);}

.ot-pay-ico{color:var(--ot-brown);}

.ot-pill{

  padding:.4rem .85rem;border-radius:999px;

  background:#fde0e0;color:var(--ot-red);font-weight:800;font-size:.82rem;

  white-space:nowrap;

}

.ot-pill.is-ok{background:#dff3e0;color:var(--ot-green);}



.ot-history{margin-top:1rem;padding:.85rem .95rem;border-radius:18px;background:#fffaf6;border:1px solid #f1e2da;}

.ot-history-title{font-weight:800;margin-bottom:.5rem;color:var(--ot-brown);}

.ot-history-row{display:flex;justify-content:space-between;font-size:.85rem;color:var(--ot-brown);padding:.15rem 0;}

.ot-history-time{color:#8b746f;}



.ot-cancelled{

  margin-top:1rem;padding:1rem;border-radius:18px;

  background:#fde4e4;border:1px solid #f3b8b8;color:var(--ot-brown);

}



/* tray */

.ot-tray{margin-top:.7rem;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.05);}

.ot-tray-bar{

  display:flex;justify-content:space-between;align-items:center;gap:.75rem;

  padding:.7rem .9rem;background:var(--ot-brown);color:#fff;

}

.ot-tray-title{display:flex;align-items:center;gap:.5rem;font-weight:800;font-size:.9rem;}

.ot-tray-total{color:var(--ot-yellow);font-weight:900;font-size:.9rem;white-space:nowrap;}

.ot-tray-list{display:flex;flex-direction:column;}

.ot-tray-row{

  display:flex;justify-content:space-between;align-items:center;gap:.75rem;

  padding:.6rem .9rem;font-weight:800;font-size:.85rem;color:var(--ot-brown);

}

.ot-tray-row + .ot-tray-row{border-top:1px solid #f3e7e1;}



/* CTA */

.ot-cta{

  margin-top:.7rem;width:100%;border:0;cursor:pointer;

  display:flex;align-items:center;justify-content:center;gap:.6rem;

  padding:.85rem 1rem;border-radius:18px;

  background:linear-gradient(180deg,#d8152f,#b30f22);

  color:#fff;font-weight:900;font-size:.98rem;

  box-shadow:0 8px 18px rgba(200,16,46,.35);

}

.ot-cta:active{transform:translateY(1px);}



.ot-spin{animation:ot-spin 1s linear infinite;}

@keyframes ot-spin{to{transform:rotate(360deg);}}

@media (prefers-reduced-motion:reduce){.ot-spin{animation:none;}}



@media (max-width:380px){

  .ot-token{font-size:2.2rem;}

  .ot-eta-time{font-size:2.2rem;}

  .ot-step-ico{width:44px;height:44px;}

  .ot-step-title{font-size:1rem;}

}

`;



export const OrderTracker: React.FC<OrderTrackerProps> = ({

  order,

  onBackToMenu,

  onOpenWaiterModal

}) => {

  const [currentOrder, setCurrentOrder] =

    useState<Order>(order);



  const [trackerStatus, setTrackerStatus] =

    useState<TrackerStatus>('received');



  const [isLoading, setIsLoading] =

    useState(true);



  const [isRefreshing, setIsRefreshing] =

    useState(false);



  const [error, setError] =

    useState<string | null>(null);



  const [secondsRemaining, setSecondsRemaining] =

    useState(0);



  const [estimatedMinutes, setEstimatedMinutes] =

    useState<number | null>(null);



  /*

   * ============================================================

   * LOAD ORDER FROM BACKEND

   * ============================================================

   */



  const loadOrder = useCallback(

    async (silent = false) => {

      try {

        if (!silent) {

          setIsLoading(true);

        } else {

          setIsRefreshing(true);

        }



        setError(null);



        const response = await api.get(

          `/orders/${order.orderId}`

        );



        const backendOrder =

          response.data?.order as

            | BackendOrderResponse

            | undefined;



        if (!backendOrder) {

          throw new Error(

            'Order data was not returned by the server.'

          );

        }



        const newTrackerStatus =

          normalizeStatus(

            backendOrder.status

          );



        setTrackerStatus(newTrackerStatus);



        setCurrentOrder(prev => ({

          ...prev,



          orderId:

            backendOrder.id ||

            prev.orderId,



          tokenNumber:

            backendOrder.tokenNumber ??

            prev.tokenNumber,



          tableNumber:

            backendOrder.tableNumber ??

            prev.tableNumber,



          customerName:

            backendOrder.customerName ??

            prev.customerName,



          customerPhone:

            backendOrder.customerPhone ??

            prev.customerPhone,



          subtotal:

            backendOrder.subtotal !== undefined

              ? Number(backendOrder.subtotal)

              : prev.subtotal,



          tax:

            backendOrder.tax !== undefined

              ? Number(backendOrder.tax)

              : prev.tax,



          discount:

            backendOrder.discount !== undefined

              ? Number(backendOrder.discount)

              : prev.discount,



          total:

            backendOrder.total !== undefined

              ? Number(backendOrder.total)

              : prev.total,



          createdAt:

            backendOrder.createdAt ??

            prev.createdAt,



          estimatedDeliveryTime:

            backendOrder.estimatedPrepTime !==

              undefined &&

            backendOrder.estimatedPrepTime !== null

              ? `${backendOrder.estimatedPrepTime} Mins`

              : prev.estimatedDeliveryTime,



          specialNotes:

            backendOrder.specialInstructions ??

            prev.specialNotes

        }));



        /*
         * Calculate the countdown from the order's original
         * createdAt + estimated preparation time so refresh
         * does not restart the timer.
         */

        if (
          backendOrder.estimatedPrepTime !==
            undefined &&
          backendOrder.estimatedPrepTime !== null
        ) {
          const backendMinutes = Number(
            backendOrder.estimatedPrepTime
          );

          const createdAtMs = new Date(
            backendOrder.createdAt || currentOrder.createdAt
          ).getTime();

          if (
            Number.isFinite(backendMinutes) &&
            backendMinutes > 0 &&
            Number.isFinite(createdAtMs)
          ) {
            setEstimatedMinutes(
              backendMinutes
            );

            const endTimeMs =
              createdAtMs +
              backendMinutes * 60 * 1000;

            const remainingSeconds = Math.max(
              0,
              Math.ceil(
                (endTimeMs - Date.now()) / 1000
              )
            );

            setSecondsRemaining(
              remainingSeconds
            );
          }
        }

      } catch (err: any) {

        console.error(

          'Failed to load order:',

          err?.response?.data ||

            err?.message ||

            err

        );



        setError(

          err?.response?.data?.message ||

            err?.message ||

            'Unable to load the latest order status.'

        );

      } finally {

        setIsLoading(false);

        setIsRefreshing(false);

      }

    },

    [order.orderId]

  );



  /*

   * ============================================================

   * INITIAL LOAD

   * ============================================================

   */



  useEffect(() => {

    loadOrder(false);

  }, [loadOrder]);



  /*

   * ============================================================

   * LIVE POLLING

   * ============================================================

   */



  useEffect(() => {

    const terminalStatuses: TrackerStatus[] = [

      'completed',

      'cancelled'

    ];



    if (

      terminalStatuses.includes(

        trackerStatus

      )

    ) {

      return;

    }



    const interval = window.setInterval(() => {

      loadOrder(true);

    }, 5000);



    return () => {

      window.clearInterval(interval);

    };

  }, [

    trackerStatus,

    loadOrder

  ]);



  /*

   * ============================================================

   * COUNTDOWN

   * ============================================================

   */



  useEffect(() => {

    if (

      trackerStatus === 'completed' ||

      trackerStatus === 'cancelled'

    ) {

      return;

    }



    if (secondsRemaining <= 0) {

      return;

    }



    const interval = window.setInterval(() => {

      setSecondsRemaining(prev =>

        prev > 0 ? prev - 1 : 0

      );

    }, 1000);



    return () => {

      window.clearInterval(interval);

    };

  }, [

    trackerStatus,

    secondsRemaining

  ]);



  const minutes = Math.floor(

    secondsRemaining / 60

  );



  const seconds = secondsRemaining % 60;



  const timeFormatted =

    `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;



  /*

   * ============================================================

   * TRACKING STEPS

   * (same ids / labels / descriptions; only visual meta added)

   * ============================================================

   */



  const normalSteps: {

    id: TrackerStatus;

    label: string;

    desc: string;

    icon: React.ReactNode;

    accent: string;

    accentSoft: string;

    cardBg: string;

    icoBg: string;

    title: string;

  }[] = [

    {

      id: 'received',

      label: 'Order Confirmed',

      desc:

        'Your order has been received by the kitchen.',

      icon: <ClipboardList size={22} />,

      accent: '#c8102e',

      accentSoft: 'rgba(200,16,46,.25)',

      cardBg: '#fde6e6',

      icoBg: '#f9cfcf',

      title: '#c8102e'

    },

    {

      id: 'preparing',

      label: 'Preparing Your Order',

      desc:

        'The kitchen is preparing your food.',

      icon: <Flame size={22} fill="#ff6a00" />,

      accent: '#ffb800',

      accentSoft: 'rgba(255,184,0,.35)',

      cardBg: '#fff0d6',

      icoBg: '#ffe2ad',

      title: '#3a0f0a'

    },

    {

      id: 'ready',

      label: 'Ready',

      desc:

        'Your order is ready at the kitchen.',

      icon: <ConciergeBell size={22} />,

      accent: '#1e9e3a',

      accentSoft: 'rgba(30,158,58,.28)',

      cardBg: '#e2f4e3',

      icoBg: '#c6e8c9',

      title: '#1e9e3a'

    },

    {

      id: 'completed',

      label: 'Completed',

      desc:

        'Your order has been completed.',

      icon: <CheckCircle size={22} />,

      accent: '#6b6b6b',

      accentSoft: 'rgba(107,107,107,.25)',

      cardBg: '#eeeceb',

      icoBg: '#dcd9d7',

      title: '#3a0f0a'

    }

  ];



  const statusOrder: TrackerStatus[] = [

    'received',

    'preparing',

    'ready',

    'completed'

  ];



  const currentStepIndex =

    statusOrder.indexOf(

      trackerStatus

    );



  const isCancelled =

    trackerStatus === 'cancelled';



  /*

   * ============================================================

   * PAYMENT / HISTORY

   * ============================================================

   */



  const paymentStatus =

    (

      currentOrder as Order & {

        paymentStatus?: string;

      }

    ).paymentStatus;



  const statusHistory = useMemo(() => {

    return (

      currentOrder as Order & {

        statusHistory?: Array<{

          status: string;

          timestamp?: string;

          createdAt?: string;

        }>;

      }

    ).statusHistory || [];

  }, [currentOrder]);



  /*

   * ============================================================

   * RENDER

   * ============================================================

   */



  return (

    <div className="section tracker-section">

      <style>{trackerCss}</style>



      <div

        className="container ot-wrap"

        style={{ maxWidth: '440px' }}

      >

        {/* Top Navigator */}

<button

  className="ot-back"

  onClick={onBackToMenu}

  style={{

    background: "transparent",

    color: "#ef233c",

    border: "none",

    padding: "8px 0",

    display: "inline-flex",

    alignItems: "center",

    gap: "8px",

    fontWeight: 400,

    cursor: "pointer",

  }}

>

  <ArrowLeft size={16} />



  <span style={{ fontWeight: 700, color: "#ef233c" }}>

    Back to Menu

  </span>

</button>



        {/* Main Card */}



        <div className="ot-card">

          {/* Decorations: fries + slash doodles (no burgers) */}

          <span className="ot-fries" aria-hidden="true">🍟</span>

          <span className="ot-fries-left" aria-hidden="true">🍟</span>

          <span

            className="ot-slash"

            aria-hidden="true"

            style={{

              top: 46,

              left: '18%',

              background: '#ffb800',

              transform: 'rotate(-35deg)'

            }}

          />

          <span

            className="ot-slash"

            aria-hidden="true"

            style={{

              top: 34,

              right: '20%',

              background: '#c8102e',

              transform: 'rotate(30deg)'

            }}

          />



          {/* Header */}



          <div className="ot-head">

            <div className="ot-live">

              <Flame

                size={18}

                fill="#d62300"

                color="#d62300"

              />



              <span>

                LIVE KITCHEN STATUS

              </span>

            </div>



            <h2 className="ot-token">

              Token <b>#{currentOrder.tokenNumber}</b>

            </h2>



            <div className="ot-meta">

              <span className="ot-meta-item">

                <span className="ot-chip">

                  <Armchair size={15} />

                </span>

                <span>{currentOrder.tableNumber}</span>

              </span>



              <span className="ot-meta-sep" />



              <span className="ot-meta-item">

                <span className="ot-chip">

                  <User size={15} />

                </span>

                <span>Guest: {currentOrder.customerName}</span>

              </span>

            </div>



            {/* Loading */}



            {isLoading && (

              <div className="ot-note">

                Loading latest order status...

              </div>

            )}



            {/* Error */}



            {error && (

              <div className="ot-error">

                <AlertCircle size={15} />



                <span>

                  {error}

                </span>

              </div>

            )}



            {/* Refresh */}



            <button

              className="ot-refresh"

              onClick={() =>

                loadOrder(true)

              }

              disabled={isRefreshing}

            >

              <RefreshCw

                size={14}

                className={

                  isRefreshing

                    ? 'ot-spin'

                    : ''

                }

              />



              <span>

                {isRefreshing

                  ? 'Refreshing...'

                  : 'Refresh Status'}

              </span>

            </button>

          </div>



          {/* ETA */}



          {!isCancelled &&

          trackerStatus !== 'completed' ? (

            <div className="ot-eta">

              <Clock

                size={22}

                color="#c8102e"

              />



              <div className="ot-eta-label">

                ESTIMATED PREPARATION TIME

              </div>



              <div className="ot-eta-time">

                {estimatedMinutes &&

                secondsRemaining > 0

                  ? `~ ${timeFormatted}`

                  : 'Calculating...'}

              </div>

            </div>

          ) : trackerStatus ===

            'completed' ? (

            <div className="ot-eta ot-eta-done">

              <Sparkles

                size={28}

                color="#1e9e3a"

              />



              <div

                className="ot-eta-label"

                style={{ color: '#1e9e3a' }}

              >

                ORDER COMPLETED

              </div>



              <div className="ot-eta-time">

                Enjoy your meal at Table{' '}

                {currentOrder.tableNumber}!

              </div>

            </div>

          ) : (

            <div className="ot-eta ot-eta-cancel">

              <AlertCircle

                size={28}

                color="#c8102e"

              />



              <div

                className="ot-eta-label"

                style={{ color: '#c8102e' }}

              >

                ORDER CANCELLED

              </div>



              <div className="ot-eta-time">

                Please contact staff if

                you need assistance.

              </div>

            </div>

          )}



          {/* Stepper */}



          {!isCancelled && (

            <div className="ot-timeline">

              {normalSteps.map(

                (step, idx) => {

                  const isCompleted =

                    idx <

                    currentStepIndex;



                  const isCurrent =

                    idx ===

                    currentStepIndex;



                  const nextStep =

                    normalSteps[idx + 1];



                  const cssVars = {

                    '--accent': step.accent,

                    '--accent-soft': step.accentSoft,

                    '--card-bg': step.cardBg,

                    '--ico-bg': step.icoBg,

                    '--title': step.title,

                    '--seg': nextStep

                      ? `linear-gradient(180deg, ${step.accent}, ${nextStep.accent})`

                      : step.accent

                  } as React.CSSProperties;



                  return (

                    <div

                      key={step.id}

                      className={

                        'ot-step' +

                        (!isCompleted && !isCurrent

                          ? ' is-upcoming'

                          : '')

                      }

                      style={cssVars}

                    >

                      <div className="ot-rail">

                        <div

                          className={

                            'ot-node' +

                            (isCurrent

                              ? ' is-current'

                              : '')

                          }

                        >

                          {isCompleted && (

                            <Check

                              size={17}

                              strokeWidth={3.5}

                            />

                          )}

                        </div>

                      </div>



                      <div className="ot-step-card">

                        <div className="ot-step-ico">

                          {step.icon}

                        </div>



                        <div>

                          <div className="ot-step-title">

                            {step.label}

                          </div>



                          <div className="ot-step-desc">

                            {step.desc}

                          </div>

                        </div>

                      </div>

                    </div>

                  );

                }

              )}

            </div>

          )}



          {/* Cancelled State */}



          {isCancelled && (

            <div className="ot-cancelled">

              <strong>

                This order was cancelled.

              </strong>



              <p

                style={{

                  marginTop: '0.35rem',

                  color: '#6b5550',

                  fontSize: '0.875rem'

                }}

              >

                The status shown here is

                provided by the restaurant

                system.

              </p>

            </div>

          )}



          {/* Payment Status */}



          <div className="ot-pay">

            <span className="ot-pay-left">

              <Wallet

                size={24}

                className="ot-pay-ico"

              />



              <span>

                Payment Status

              </span>

            </span>



            <span

              className={

                'ot-pill' +

                (paymentStatus &&

                paymentStatus.toLowerCase() ===

                  'paid'

                  ? ' is-ok'

                  : '')

              }

            >

              {formatPaymentStatus(

                paymentStatus

              )}

            </span>

          </div>



          {/* Status History */}



          {statusHistory.length > 0 && (

            <div className="ot-history">

              <div className="ot-history-title">

                Status History

              </div>



              <div>

                {statusHistory.map(

                  (entry, index) => {

                    const entryStatus =

                      entry.status as BackendOrderStatus;



                    const normalized =

                      normalizeStatus(

                        entryStatus

                      );



                    const timestamp =

                      entry.timestamp ||

                      entry.createdAt;



                    return (

                      <div

                        key={`${entry.status}-${index}`}

                        className="ot-history-row"

                      >

                        <span>

                          {formatStatus(

                            normalized

                          )}

                        </span>



                        {timestamp && (

                          <span className="ot-history-time">

                            {new Date(

                              timestamp

                            ).toLocaleTimeString(

                              [],

                              {

                                hour:

                                  '2-digit',

                                minute:

                                  '2-digit'

                              }

                            )}

                          </span>

                        )}

                      </div>

                    );

                  }

                )}

              </div>

            </div>

          )}



          {/* Ordered Dishes */}



          <div className="ot-tray">

            <div className="ot-tray-bar">

              <span className="ot-tray-title">

                <Receipt size={20} />



                <span>

                  Tray Summary (

                  {currentOrder.items.length}

                  )

                </span>

              </span>



              <span className="ot-tray-total">

                ₹{currentOrder.total}{' '}

                Total

              </span>

            </div>



            <div className="ot-tray-list">

              {currentOrder.items.map(

                item => (

                  <div

                    key={item.cartItemId}

                    className="ot-tray-row"

                  >

                    <span>

                      {item.quantity}×{' '}

                      {item.item.name}

                    </span>



                    <span>

                      ₹{item.itemTotalPrice}

                    </span>

                  </div>

                )

              )}

            </div>

          </div>



          {/* Quick Actions */}



          <button

            className="ot-cta"

            onClick={onBackToMenu}

          >

            <Plus size={22} strokeWidth={3} />



            <span>

              Add More Items

            </span>

          </button>

        </div>

      </div>

    </div>

  );

};