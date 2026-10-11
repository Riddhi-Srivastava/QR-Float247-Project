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



    .replace(/\\_/g, ' ')



    .replace(/\b\w/g, char => char.toUpperCase());



};







/*



 * ============================================================



 * STYLES (UI only)



 * ============================================================



 */







const trackerCss = `
  .ot-wrap{
    --ot-pink:#FF2457;
    --ot-pink-dark:#E91E4D;
    --ot-pink-soft:#FFE7ED;
    --ot-pink-light:#FF4F78;
    --ot-bg:#F5F6FA;
    --ot-white:#FFFFFF;
    --ot-text:#1F1F1F;
    --ot-body:#555555;
    --ot-muted:#8A8A8A;
    --ot-border:#E7E7EB;
    --ot-green:#22A06B;
    --ot-warning:#F5A623;
    --ot-danger:#E53935;
    font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",Inter,"Segoe UI",Roboto,sans-serif;
    color:var(--ot-text);
  }
  .ot-wrap *{box-sizing:border-box;}
  .ot-back{
    display:inline-flex;align-items:center;gap:.45rem;
    background:transparent;border:0;cursor:pointer;
    font-size:.88rem;font-weight:700;color:var(--ot-pink);
    padding:7px 0;margin-bottom:.75rem;
    transition:color .18s ease,transform .18s ease;
  }
  .ot-back:hover{color:var(--ot-pink-dark);transform:translateX(-2px);}
  .ot-card{
    position:relative;overflow:hidden;
    background:var(--ot-white);
    border:1px solid var(--ot-border);
    border-radius:20px;
    padding:18px 16px 16px;
    box-shadow:0 10px 30px rgba(0,0,0,.07);
  }
  .ot-fries,.ot-fries-left,.ot-slash{display:none!important;}
  .ot-head{position:relative;text-align:center;margin-bottom:1rem;}
  .ot-live{
    display:inline-flex;align-items:center;gap:.4rem;
    background:var(--ot-pink-soft);color:var(--ot-pink);
    font-weight:800;font-size:.72rem;letter-spacing:.02em;
    padding:.42rem .85rem;border-radius:999px;
    border:1px solid rgba(255,36,87,.10);
  }
  .ot-live svg{color:var(--ot-pink)!important;fill:var(--ot-pink)!important;}
  .ot-token{
    margin:.65rem 0 .25rem;
    font-size:2rem;line-height:1.05;font-weight:900;
    color:var(--ot-text);letter-spacing:-.03em;
  }
  .ot-token b{color:var(--ot-pink);font-weight:900;}
  .ot-meta{
    display:flex;justify-content:center;align-items:center;
    flex-wrap:wrap;gap:.4rem .75rem;
    font-size:.8rem;color:var(--ot-body);
  }
  .ot-meta-item{display:inline-flex;align-items:center;gap:.45rem;}
  .ot-chip{
    width:27px;height:27px;border-radius:9px;
    background:var(--ot-pink-soft);color:var(--ot-pink);
    display:inline-flex;align-items:center;justify-content:center;
  }
  .ot-meta-sep{width:1px;height:18px;background:var(--ot-border);}
  .ot-note{margin-top:.7rem;font-size:.82rem;color:var(--ot-muted);}
  .ot-error{
    margin-top:.7rem;display:flex;align-items:center;justify-content:center;
    gap:.4rem;color:var(--ot-danger);font-size:.82rem;
    padding:.55rem .7rem;border-radius:10px;background:#FFF4F3;
  }
  .ot-refresh{
    margin-top:.6rem;display:inline-flex;align-items:center;gap:.4rem;
    background:#fff;border:1px solid var(--ot-border);color:var(--ot-body);
    border-radius:10px;padding:.45rem .8rem;font-size:.78rem;font-weight:700;
    cursor:pointer;transition:.18s ease;
  }
  .ot-refresh:hover:not(:disabled){border-color:rgba(255,36,87,.28);color:var(--ot-pink);background:var(--ot-pink-soft);}
  .ot-refresh:disabled{opacity:.6;cursor:default;}
  .ot-eta{
    position:relative;margin-top:.75rem;
    border-radius:16px;padding:.8rem;text-align:center;
    background:var(--ot-pink-soft);
    border:1px solid rgba(255,36,87,.12);
  }
  .ot-eta-label{font-size:.7rem;font-weight:800;color:var(--ot-body);letter-spacing:.02em;margin-top:.2rem;}
  .ot-eta-time{font-size:2rem;font-weight:900;color:var(--ot-pink);line-height:1.1;letter-spacing:-.02em;}
  .ot-eta-done{background:#EDF9F3;border-color:#CFEEDF;}
  .ot-eta-done .ot-eta-time{color:var(--ot-green);font-size:1.12rem;}
  .ot-eta-cancel{background:#FFF4F3;border-color:#F4D0CD;}
  .ot-eta-cancel .ot-eta-time{color:var(--ot-danger);font-size:1.05rem;}
  .ot-timeline{position:relative;margin-top:.75rem;display:flex;flex-direction:column;gap:.5rem;}
  .ot-step{position:relative;display:flex;align-items:stretch;gap:.45rem;}
  .ot-rail{position:relative;width:38px;flex:0 0 38px;display:flex;justify-content:center;}
  .ot-rail::before{
    content:"";position:absolute;top:0;bottom:-.5rem;left:50%;width:2px;
    transform:translateX(-50%);background:var(--seg,#D9D9DF);
  }
  .ot-step:first-child .ot-rail::before{top:50%;}
  .ot-step:last-child .ot-rail::before{bottom:50%;}
  .ot-node{
    position:relative;z-index:1;align-self:center;
    width:32px;height:32px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    background:var(--accent);color:#fff;
    box-shadow:0 0 0 4px #fff,0 0 0 5px rgba(0,0,0,.05);
  }
  .ot-node.is-current{box-shadow:0 0 0 4px #fff,0 0 0 6px var(--accent-soft);}
  .ot-step-card{
    position:relative;flex:1;min-width:0;
    display:flex;align-items:center;gap:.65rem;
    padding:.7rem .75rem;border-radius:14px;
    background:#fff;border:1px solid var(--ot-border);
    box-shadow:0 2px 8px rgba(0,0,0,.035);
  }
  .ot-step-card::before{
    content:"";position:absolute;left:-7px;top:50%;
    width:12px;height:12px;background:var(--card-bg,#fff);
    border-left:1px solid var(--ot-border);border-bottom:1px solid var(--ot-border);
    transform:translateY(-50%) rotate(45deg);
  }
  .ot-step-ico{
    flex:0 0 auto;width:40px;height:40px;border-radius:12px;
    display:flex;align-items:center;justify-content:center;
    background:var(--ico-bg,var(--ot-pink-soft));color:var(--accent,var(--ot-pink));
  }
  .ot-step-title{font-weight:800;font-size:.9rem;color:var(--title,var(--ot-text));line-height:1.2;}
  .ot-step-desc{font-size:.76rem;color:var(--ot-muted);margin-top:.18rem;line-height:1.35;}
  .ot-step.is-upcoming .ot-step-card{opacity:.9;}
  .ot-pay{
    margin-top:.75rem;display:flex;justify-content:space-between;align-items:center;
    gap:.6rem;padding:.65rem .75rem;border-radius:14px;
    background:#fff;border:1px solid var(--ot-border);
  }
  .ot-pay-left{display:flex;align-items:center;gap:.55rem;font-weight:750;font-size:.88rem;color:var(--ot-text);}
  .ot-pay-ico{color:var(--ot-pink);}
  .ot-pill{padding:.38rem .7rem;border-radius:999px;background:var(--ot-pink-soft);color:var(--ot-pink);font-weight:800;font-size:.78rem;white-space:nowrap;}
  .ot-pill.is-ok{background:#E9F7F0;color:var(--ot-green);}
  .ot-history{margin-top:.9rem;padding:.8rem .85rem;border-radius:14px;background:#fff;border:1px solid var(--ot-border);}
  .ot-history-title{font-weight:800;margin-bottom:.45rem;color:var(--ot-text);}
  .ot-history-row{display:flex;justify-content:space-between;gap:.6rem;font-size:.82rem;color:var(--ot-body);padding:.2rem 0;}
  .ot-history-time{color:var(--ot-muted);white-space:nowrap;}
  .ot-cancelled{margin-top:.9rem;padding:.9rem;border-radius:14px;background:#FFF4F3;border:1px solid #F4D0CD;color:var(--ot-text);}
  .ot-tray{margin-top:.75rem;border-radius:15px;overflow:hidden;background:#fff;border:1px solid var(--ot-border);box-shadow:0 2px 8px rgba(0,0,0,.04);}
  .ot-tray-bar{display:flex;justify-content:space-between;align-items:center;gap:.75rem;padding:.75rem .85rem;background:#fff;border-bottom:1px solid var(--ot-border);}
  .ot-tray-title{display:flex;align-items:center;gap:.5rem;font-weight:800;font-size:.88rem;color:var(--ot-text);}
  .ot-tray-title svg{color:var(--ot-pink);}
  .ot-tray-total{color:var(--ot-pink);font-weight:900;font-size:.88rem;white-space:nowrap;}
  .ot-tray-list{display:flex;flex-direction:column;}
  .ot-tray-row{display:flex;justify-content:space-between;align-items:center;gap:.75rem;padding:.62rem .85rem;font-weight:650;font-size:.82rem;color:var(--ot-body);}
  .ot-tray-row span:first-child{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .ot-tray-row span:last-child{color:var(--ot-text);font-weight:750;white-space:nowrap;}
  .ot-tray-row + .ot-tray-row{border-top:1px solid var(--ot-border);}
  .ot-cta{
    margin-top:.75rem;width:100%;border:0;cursor:pointer;
    display:flex;align-items:center;justify-content:center;gap:.55rem;
    min-height:52px;padding:.85rem 1rem;border-radius:14px;
    background:#FF2457;color:#fff;font-weight:800;font-size:.92rem;
    box-shadow:0 8px 20px rgba(255,36,87,.20);
    transition:transform .15s ease,background .15s ease,box-shadow .15s ease;
  }
  .ot-cta:hover{background:#E91E4D;box-shadow:0 10px 24px rgba(255,36,87,.25);}
  .ot-cta:active{transform:translateY(1px);}
  .ot-spin{animation:ot-spin 1s linear infinite;}
  @keyframes ot-spin{to{transform:rotate(360deg);}}
  @media (prefers-reduced-motion:reduce){.ot-spin{animation:none;}}
  @media (max-width:380px){
    .ot-card{padding:15px 12px 13px;border-radius:18px;}
    .ot-token{font-size:1.85rem;}
    .ot-eta-time{font-size:1.8rem;}
    .ot-step-ico{width:38px;height:38px;}
    .ot-step-title{font-size:.86rem;}
    .ot-step-desc{font-size:.72rem;}
  }
`;








export const OrderTracker: React.FC<OrderTrackerProps> = ({



  order,



  onBackToMenu,



  onOpenWaiterModal: _onOpenWaiterModal



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



            prev.specialNotes,



          items: Array.isArray(backendOrder.items) && backendOrder.items.length > 0

            ? backendOrder.items.map((bi: any) => ({

              cartItemId: bi.id || bi.foodId,

              item: {

                id: bi.foodId || bi.id,

                name: bi.name,

                description: '',

                price: Number(bi.price),

                category: bi.category || 'General',

                image: bi.image || '',

                dietary: 'veg',

                rating: 4.5,

                ratingCount: 10,

                prepTimeMinutes: 15,

                isAvailable: true,

              },

              quantity: Number(bi.quantity),

              customization: { selectedAddons: [] },

              itemTotalPrice: Number(bi.price) * Number(bi.quantity),

            }))

            : prev.items



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



        accent: '#FF2457',



        accentSoft: 'rgba(200,16,46,.25)',



        cardBg: '#fde6e6',



        icoBg: '#f9cfcf',



        title: '#FF2457'



      },



      {



        id: 'preparing',



        label: 'Preparing Your Order',



        desc:



          'The kitchen is preparing your food.',



        icon: <Flame size={22} fill="#F5A623" />,



        accent: '#F5A623',



        accentSoft: 'rgba(255,184,0,.35)',



        cardBg: '#FFF7E8',



        icoBg: '#FFE9C2',



        title: '#1F1F1F'



      },



      {



        id: 'ready',



        label: 'Ready',



        desc:



          'Your order is ready at the kitchen.',



        icon: <ConciergeBell size={22} />,



        accent: '#22A06B',



        accentSoft: 'rgba(30,158,58,.28)',



        cardBg: '#EDF9F3',



        icoBg: '#D8F1E5',



        title: '#22A06B'



      },



      {



        id: 'completed',



        label: 'Completed',



        desc:



          'Your order has been completed.',



        icon: <CheckCircle size={22} />,



        accent: '#6b6b6b',



        accentSoft: 'rgba(107,107,107,.25)',



        cardBg: '#F3F3F4',



        icoBg: '#E7E7EB',



        title: '#1F1F1F'



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



            color: "#FF2457",



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







          <span style={{ fontWeight: 700, color: "#FF2457" }}>



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



              background: '#F5A623',



              transform: 'rotate(-35deg)'



            }}



          />



          <span



            className="ot-slash"



            aria-hidden="true"



            style={{



              top: 34,



              right: '20%',



              background: '#FF2457',



              transform: 'rotate(30deg)'



            }}



          />







          {/* Header */}







          <div className="ot-head">



            <div className="ot-live">



              <Flame



                size={18}



                fill="#F5A623"



                color="#F5A623"



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



                color="#FF2457"



              />







              <div className="ot-eta-label">



                ESTIMATED PREPARATION TIME



              </div>







              <div className="ot-eta-time">



                {estimatedMinutes &&



                  secondsRemaining > 0



                  ? `\~ ${timeFormatted}`



                  : 'Calculating...'}



              </div>



            </div>



          ) : trackerStatus ===



            'completed' ? (



            <div className="ot-eta ot-eta-done">



              <Sparkles



                size={28}



                color="#22A06B"



              />







              <div



                className="ot-eta-label"



                style={{ color: '#22A06B' }}



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



                color="#FF2457"



              />







              <div



                className="ot-eta-label"



                style={{ color: '#FF2457' }}



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



                  color: '#555555',



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