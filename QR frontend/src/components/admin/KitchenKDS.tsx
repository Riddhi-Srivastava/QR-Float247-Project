import React from 'react';

import {
  CheckCircle,
  Clock,
  ArrowRight,
  UserRound,
} from 'lucide-react';

import { Order, OrderStatus } from '../../types/restaurant';

interface KitchenKDSProps {
  orders: Order[];
  onUpdateOrderStatus: (
    orderId: string,
    status: OrderStatus
  ) => void;
}

export const KitchenKDS: React.FC<KitchenKDSProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
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
      status: 'preparing',
      label: 'Flame Grilling',
      icon: '🔥',
      count: orders.filter(o => o.status === 'preparing').length,
      accent: '#e87500',
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

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        background:
          'linear-gradient(135deg, #faf7f3 0%, #f4eee8 100%)',
        padding: '12px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(4, minmax(235px, 1fr))',
          gap: '12px',
          minWidth: '970px',
          height: '100%',
        }}
      >
        {columns.map(col => {
          const colOrders = orders.filter(
            order => order.status === col.status
          );

          return (
            <div
              key={col.status}
              style={{
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                background: '#eee9e3',
                border: '1px solid #e2dad2',
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              {/* COLUMN HEADER */}
              <div
                style={{
                  position: 'relative',
                  height: '48px',
                  flexShrink: 0,
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#fff',
                  borderBottom: '1px solid #e7dfd8',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: col.accent,
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                  }}
                >
                  <span style={{ fontSize: '17px' }}>
                    {col.icon}
                  </span>

                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 900,
                      color: '#39251b',
                    }}
                  >
                    {col.label}
                  </span>
                </div>

                <span
                  style={{
                    minWidth: '23px',
                    height: '23px',
                    padding: '0 6px',
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '50%',
                    background: col.accent,
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 900,
                  }}
                >
                  {col.count}
                </span>
              </div>

              {/* ORDERS */}
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '9px',
                }}
              >
                {colOrders.length === 0 ? (
                  <div
                    style={{
                      height: '120px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9b8e85',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    No orders here
                  </div>
                ) : (
                  colOrders.map(order => {
                    const nextStatus = getNextStatus(
                      order.status
                    );

                    return (
                      <div
                        key={order.orderId}
                        style={{
                          background: '#fff',
                          borderRadius: '14px',
                          border: '1px solid #e6ddd5',
                          boxShadow:
                            '0 4px 14px rgba(48,31,22,0.08)',
                          overflow: 'hidden',
                        }}
                      >
                        {/* STATUS STRIPE */}
                        <div
                          style={{
                            height: '3px',
                            background: col.accent,
                          }}
                        />

                        <div style={{ padding: '10px' }}>
                          {/* TABLE + TOKEN + TIME */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '9px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <span
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: '8px',
                                  background: '#d62300',
                                  color: '#fff',
                                  fontSize: '10px',
                                  fontWeight: 900,
                                }}
                              >
                                TABLE {order.tableNumber}
                              </span>

                              <span
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: '8px',
                                  background: '#fff0c7',
                                  color: '#795317',
                                  fontSize: '10px',
                                  fontWeight: 900,
                                }}
                              >
                                #{order.tokenNumber}
                              </span>
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                                color: '#9a8d84',
                                fontSize: '9px',
                                fontWeight: 700,
                              }}
                            >
                              <Clock size={11} />
                              {order.createdAt}
                            </div>
                          </div>

                          {/* GUEST */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '8px',
                              padding: '8px',
                              marginBottom: '9px',
                              borderRadius: '11px',
                              background:
                                'linear-gradient(90deg, #fff3ee, #fff9f6)',
                              border:
                                '1px solid #f1d8cf',
                            }}
                          >
                            <div
                              style={{
                                minWidth: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              <div
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  flexShrink: 0,
                                  display: 'grid',
                                  placeItems: 'center',
                                  borderRadius: '50%',
                                  background: '#d62300',
                                  color: '#fff',
                                  boxShadow:
                                    '0 3px 7px rgba(214,35,0,0.2)',
                                }}
                              >
                                <UserRound size={15} />
                              </div>

                              <div style={{ minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: '8px',
                                    color: '#a28c81',
                                    fontWeight: 800,
                                    textTransform:
                                      'uppercase',
                                    letterSpacing: '0.7px',
                                    marginBottom: '2px',
                                  }}
                                >
                                  Guest Name
                                </div>

                                <div
                                  style={{
                                    color: '#342219',
                                    fontSize: '12px',
                                    fontWeight: 900,
                                    overflow: 'hidden',
                                    textOverflow:
                                      'ellipsis',
                                    whiteSpace:
                                      'nowrap',
                                  }}
                                >
                                  {order.customerName}
                                </div>
                              </div>
                            </div>

                            <span
                              style={{
                                flexShrink: 0,
                                padding: '4px 7px',
                                borderRadius: '8px',
                                background: '#fff',
                                border:
                                  '1px solid #e6dcd5',
                                color: '#705f55',
                                fontSize: '8px',
                                fontWeight: 900,
                                textTransform:
                                  'uppercase',
                              }}
                            >
                              {order.paymentMethod}
                            </span>
                          </div>

                          {/* ORDERED ITEMS */}
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '5px',
                            }}
                          >
                            {order.items?.map(
                              (item: any, idx: number) => {
                                const itemName =
                                  item?.item?.name ||
                                  item?.food?.name ||
                                  item?.name ||
                                  'Unknown Item';

                                const variant =
                                  item?.customization
                                    ?.selectedVariant;

                                const addons =
                                  item?.customization
                                    ?.selectedAddons ||
                                  [];

                                return (
                                  <div
                                    key={
                                      item?.id ||
                                      item?.cartItemId ||
                                      idx
                                    }
                                    style={{
                                      display: 'flex',
                                      alignItems:
                                        'flex-start',
                                      gap: '7px',
                                      padding: '7px 8px',
                                      borderRadius: '9px',
                                      background: '#eefaf2',
                                      border:
                                        '1px solid #d5eddd',
                                    }}
                                  >
                                    {/* QTY */}
                                    <span
                                      style={{
                                        minWidth: '29px',
                                        padding:
                                          '4px 3px',
                                        borderRadius: '8px',
                                        background:
                                          '#16834b',
                                        color: '#fff',
                                        textAlign:
                                          'center',
                                        fontSize: '9px',
                                        fontWeight: 900,
                                      }}
                                    >
                                      {item?.quantity ||
                                        0}
                                      x
                                    </span>

                                    {/* ITEM INFO */}
                                    <div
                                      style={{
                                        flex: 1,
                                        minWidth: 0,
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontSize: '10px',
                                          fontWeight: 900,
                                          color:
                                            '#16834b',
                                          lineHeight:
                                            '14px',
                                        }}
                                      >
                                        {itemName}
                                      </div>

                                      {variant?.name && (
                                        <div
                                          style={{
                                            marginTop:
                                              '1px',
                                            fontSize:
                                              '8px',
                                            color:
                                              '#5f8069',
                                            fontWeight:
                                              600,
                                          }}
                                        >
                                          Size:{' '}
                                          {variant.name}
                                        </div>
                                      )}

                                      {addons.map(
                                        (
                                          addon: any
                                        ) => (
                                          <div
                                            key={
                                              addon.id
                                            }
                                            style={{
                                              fontSize:
                                                '8px',
                                              color:
                                                '#d62300',
                                              fontWeight:
                                                800,
                                            }}
                                          >
                                            +{' '}
                                            {
                                              addon.name
                                            }
                                          </div>
                                        )
                                      )}
                                    </div>

                                    {/* CHECK */}
                                    <CheckCircle
                                      size={15}
                                      color="#16834b"
                                      style={{
                                        flexShrink: 0,
                                        marginTop: '2px',
                                      }}
                                    />
                                  </div>
                                );
                              }
                            )}
                          </div>

                          {/* SPECIAL NOTE */}
                          {order.specialNotes && (
                            <div
                              style={{
                                marginTop: '8px',
                                padding: '7px 8px',
                                borderRadius: '9px',
                                background: '#fff8dc',
                                border:
                                  '1px solid #efdfaa',
                                color: '#6d5518',
                                fontSize: '9px',
                                fontWeight: 750,
                              }}
                            >
                              ⚠️ {order.specialNotes}
                            </div>
                          )}

                          {/* FOOTER */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent:
                                'space-between',
                              gap: '7px',
                              marginTop: '10px',
                              paddingTop: '9px',
                              borderTop:
                                '1px solid #eee7e1',
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: '8px',
                                  color: '#9b8b82',
                                  fontWeight: 700,
                                  textTransform:
                                    'uppercase',
                                }}
                              >
                                Total
                              </div>

                              <div
                                style={{
                                  color: '#d62300',
                                  fontSize: '14px',
                                  fontWeight: 950,
                                }}
                              >
                                ₹{order.total}
                              </div>
                            </div>

                            {nextStatus ? (
                              <button
                                onClick={() =>
                                  onUpdateOrderStatus(
                                    order.orderId,
                                    nextStatus
                                  )
                                }
                                style={{
                                  display: 'flex',
                                  alignItems:
                                    'center',
                                  gap: '5px',
                                  padding:
                                    '8px 11px',
                                  border: 'none',
                                  borderRadius: '9px',
                                  background:
                                    '#d62300',
                                  color: '#fff',
                                  fontSize: '9px',
                                  fontWeight: 900,
                                  cursor: 'pointer',
                                  boxShadow:
                                    '0 3px 7px rgba(214,35,0,0.18)',
                                }}
                              >
                                {getNextActionLabel(
                                  order.status
                                )}

                                <ArrowRight
                                  size={12}
                                />
                              </button>
                            ) : (
                              <span
                                style={{
                                  display: 'flex',
                                  alignItems:
                                    'center',
                                  gap: '4px',
                                  color: '#16834b',
                                  fontSize: '9px',
                                  fontWeight: 900,
                                }}
                              >
                                <CheckCircle
                                  size={13}
                                />
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};