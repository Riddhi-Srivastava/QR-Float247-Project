import React from 'react';



import {

  X,

  Trash2,

  Plus,

  Minus,

  ArrowRight,

  Receipt,

} from 'lucide-react';



import { CartItem } from '../../types/restaurant';



interface CartDrawerProps {

  isOpen: boolean;

  onClose: () => void;

  cartItems: CartItem[];

  onIncrement: (cartItemId: string) => void;

  onDecrement: (cartItemId: string) => void;

  onRemoveItem: (cartItemId: string) => void;

  onProceedToCheckout: (

    tipAmount: number,

    includeCutlery: boolean

  ) => void;

  tableNumber: string;

}



export const CartDrawer: React.FC<CartDrawerProps> = ({

  isOpen,

  onClose,

  cartItems,

  onIncrement,

  onDecrement,

  onRemoveItem,

  onProceedToCheckout,

  tableNumber,

}) => {

  if (!isOpen) return null;



  /* =====================================================

     EXISTING CART LOGIC — PRESERVED

     ===================================================== */



  const subtotal = cartItems.reduce(

    (acc, item) => acc + item.itemTotalPrice,

    0

  );



  const tax = Math.round(subtotal * 0.05);



  const total = subtotal + tax;



  const totalQuantity = cartItems.reduce(

    (acc, item) => acc + item.quantity,

    0

  );



  const formatCurrency = (amount: number) =>

    `₹${Math.round(amount)}`;



  /* =====================================================

     FLOAT247 COLOR SYSTEM

     ===================================================== */



  const PINK = '#FF2457';

  const PINK_DARK = '#E91E4D';

  const PINK_SOFT = '#FFE7ED';



  const WHITE = '#FFFFFF';

  const PAGE_BG = '#F5F6FA';



  const TEXT = '#1F1F1F';

  const BODY = '#555555';

  const MUTED = '#8A8A8A';



  const BORDER = '#E7E7EB';



  const VEG = '#16834B';

  const NON_VEG = '#D62300';



  return (

    <>

      {/* =====================================================

          CENTER MODAL BACKDROP

          ===================================================== */}



      <div

        onClick={onClose}

        style={{

          position: 'fixed',

          inset: 0,



          zIndex: 99990,



          display: 'flex',

          alignItems: 'center',

          justifyContent: 'center',



          padding: '20px',



          background:

            'rgba(20, 20, 24, 0.48)',



          backdropFilter: 'blur(7px)',

          WebkitBackdropFilter: 'blur(7px)',



          animation:

            'float247TrayBackdropIn 0.2s ease-out',

        }}

      >

        {/* =====================================================

            KING TRAY POPUP

            ===================================================== */}



        <div

          role="dialog"

          aria-modal="true"

          aria-labelledby="cart-drawer-title"

          onClick={(e) => e.stopPropagation()}

          style={{

            position: 'relative',



            width:

              'min(560px, calc(100vw - 32px))',



            height: 'fit-content',



            minHeight: '520px',



            maxHeight:

              'calc(100vh - 32px)',



            display: 'flex',

            flexDirection: 'column',



            background: WHITE,



            border:

              '1px solid rgba(255,255,255,0.9)',



            borderRadius: '26px',



            overflow: 'hidden',



            boxShadow:

              '0 30px 90px rgba(0,0,0,0.25), 0 8px 30px rgba(0,0,0,0.10)',



            color: TEXT,



            animation:

              'float247TrayPopupIn 0.32s cubic-bezier(0.22, 1, 0.36, 1)',

          }}

        >

          {/* =================================================

              iPHONE STYLE HANDLE

              ================================================= */}



          <div

            style={{

              position: 'absolute',



              top: '10px',

              left: '50%',



              transform:

                'translateX(-50%)',



              width: '62px',

              height: '5px',



              borderRadius: '999px',



              background: '#D8D8DE',



              zIndex: 5,

            }}

          />



          {/* =================================================

              HEADER

              ================================================= */}



          <div

            style={{

              flexShrink: 0,



              display: 'flex',

              alignItems: 'center',

              justifyContent: 'space-between',



              padding:

                '28px 22px 16px',



              background: WHITE,



              borderBottom:

                `1px solid ${BORDER}`,

            }}

          >

            {/* LEFT HEADER */}



            <div

              style={{

                display: 'flex',

                alignItems: 'center',



                gap: '13px',



                minWidth: 0,

              }}

            >

              {/* BURGER ICON */}



              <div

                style={{

                  width: '48px',

                  height: '48px',



                  minWidth: '48px',



                  display: 'flex',

                  alignItems: 'center',

                  justifyContent: 'center',



                  background:

                    PINK_SOFT,



                  border:

                    '1px solid #FFD4DE',



                  borderRadius: '15px',



                  fontSize: '22px',



                  boxShadow:

                    '0 4px 12px rgba(255,36,87,0.08)',

                }}

              >

              </div>



              {/* TITLE */}



              <div

                style={{

                  minWidth: 0,

                }}

              >

                <h2

                  id="cart-drawer-title"

                  style={{

                    margin: 0,



                    color: TEXT,



                    fontSize: '20px',



                    lineHeight: 1.15,



                    fontWeight: 850,



                    letterSpacing:

                      '-0.03em',

                  }}

                >

                  Your King Tray

                </h2>



                <div

                  style={{

                    display: 'flex',

                    alignItems: 'center',



                    gap: '5px',



                    marginTop: '5px',



                    color: MUTED,



                    fontSize: '12px',



                    fontWeight: 600,

                  }}

                >

                  <span

                    style={{

                      width: '5px',

                      height: '5px',



                      borderRadius: '50%',



                      background: MUTED,

                    }}

                  />



                  <span>

                    {totalQuantity}{' '}

                    {totalQuantity === 1

                      ? 'item'

                      : 'items'}

                  </span>



                  <span>•</span>



                  <span>

                    Table {tableNumber}

                  </span>

                </div>

              </div>

            </div>



            {/* CLOSE */}



            <button

              type="button"

              onClick={onClose}

              aria-label="Close tray"

              style={{

                width: '40px',

                height: '40px',



                minWidth: '40px',



                display: 'flex',

                alignItems: 'center',

                justifyContent: 'center',



                padding: 0,



                background: WHITE,



                color: TEXT,



                border:

                  `1px solid ${BORDER}`,



                borderRadius: '12px',



                cursor: 'pointer',



                transition:

                  'all 0.2s ease',

              }}

              onMouseEnter={(e) => {

                e.currentTarget.style.background =

                  PINK_SOFT;



                e.currentTarget.style.color =

                  PINK;



                e.currentTarget.style.borderColor =

                  '#FFD1DC';

              }}

              onMouseLeave={(e) => {

                e.currentTarget.style.background =

                  WHITE;



                e.currentTarget.style.color =

                  TEXT;



                e.currentTarget.style.borderColor =

                  BORDER;

              }}

            >

              <X size={19} />

            </button>

          </div>



          {/* =====================================================

              EMPTY CART

              ===================================================== */}



          {cartItems.length === 0 ? (

            <div

              style={{

                flex: 1,



                display: 'flex',

                flexDirection: 'column',



                alignItems: 'center',

                justifyContent: 'center',



                padding: '40px 24px',



                background: PAGE_BG,



                textAlign: 'center',

              }}

            >

              <div

                style={{

                  width: '78px',

                  height: '78px',



                  display: 'flex',

                  alignItems: 'center',

                  justifyContent: 'center',



                  background:

                    PINK_SOFT,



                  borderRadius: '24px',



                  fontSize: '38px',



                  marginBottom: '18px',

                }}

              >

                🍟

              </div>



              <h3

                style={{

                  margin: 0,



                  color: TEXT,



                  fontSize: '20px',



                  fontWeight: 850,

                }}

              >

                Your tray is empty!

              </h3>



              <p

                style={{

                  maxWidth: '310px',



                  margin:

                    '9px 0 0',



                  color: BODY,



                  fontSize: '13px',



                  lineHeight: 1.6,

                }}

              >

                Pick a flame-grilled Whopper,

                crispy fries or thick shakes

                to get started.

              </p>



              <button

                type="button"

                onClick={onClose}

                style={{

                  marginTop: '20px',



                  height: '46px',



                  padding:

                    '0 20px',



                  background: PINK,



                  color: WHITE,



                  border: 'none',



                  borderRadius: '12px',



                  fontSize: '13px',



                  fontWeight: 800,



                  cursor: 'pointer',



                  boxShadow:

                    '0 6px 16px rgba(255,36,87,0.16)',

                }}

              >

                Explore King Menu

              </button>

            </div>

          ) : (

            /* ===================================================

               CART CONTENT

               =================================================== */



            <div

              style={{

                flex: 1,



                minHeight: 0,



                display: 'flex',

                flexDirection: 'column',



                background: PAGE_BG,

              }}

            >

              {/* =================================================

                  SCROLLABLE CONTENT

                  ================================================= */}



              <div

                style={{

                  flex: 1,



                  minHeight: 0,



                  overflowY: 'auto',



                  padding:

                    '12px 14px 14px',



                  scrollbarWidth: 'thin',



                  scrollbarColor:

                    '#FFB3C4 transparent',

                }}

              >

                {/* ITEMS */}



                <div

                  style={{

                    display: 'flex',

                    flexDirection: 'column',



                    gap: '9px',

                  }}

                >

                  {cartItems.map(

                    (cartItem) => {

                      const isVeg =

                        cartItem.item.dietary ===

                        'veg' ||

                        cartItem.item.dietary ===

                        'vegan';



                      return (

                        <div

                          key={

                            cartItem.cartItemId

                          }

                          style={{

                            position: 'relative',



                            display: 'flex',

                            alignItems:

                              'center',



                            gap: '11px',



                            minHeight:

                              '82px',



                            padding:

                              '9px 10px',



                            background:

                              WHITE,



                            border:

                              `1px solid ${BORDER}`,



                            borderRadius:

                              '16px',



                            boxShadow:

                              '0 2px 8px rgba(31,31,31,0.04)',



                            transition:

                              'all 0.2s ease',

                          }}

                        >

                          {/* FOOD IMAGE */}



                          <div

                            style={{

                              width: '64px',

                              height: '64px',



                              minWidth: '64px',



                              overflow:

                                'hidden',



                              borderRadius:

                                '13px',



                              background:

                                PINK_SOFT,



                              border:

                                '1px solid #F0F0F2',



                              display: 'flex',



                              alignItems:

                                'center',



                              justifyContent:

                                'center',

                            }}

                          >

                            {cartItem.item.image ? (

                              <img

                                src={

                                  cartItem

                                    .item

                                    .image

                                }

                                alt={

                                  cartItem

                                    .item

                                    .name

                                }

                                style={{

                                  width: '100%',

                                  height: '100%',



                                  objectFit:

                                    'cover',



                                  display:

                                    'block',

                                }}

                              />

                            ) : (

                              <span

                                style={{

                                  fontSize:

                                    '27px',

                                }}

                              >

                                🍔

                              </span>

                            )}

                          </div>



                          {/* FOOD DETAILS */}



                          <div

                            style={{

                              flex: 1,



                              minWidth: 0,



                              alignSelf:

                                'stretch',



                              display:

                                'flex',



                              flexDirection:

                                'column',



                              justifyContent:

                                'center',

                            }}

                          >

                            {/* NAME */}



                            <div

                              style={{

                                display:

                                  'flex',



                                alignItems:

                                  'flex-start',



                                gap: '7px',

                              }}

                            >

                              {/* DIETARY */}



                              <span

                                style={{

                                  width: '15px',

                                  height: '15px',



                                  minWidth:

                                    '15px',



                                  marginTop:

                                    '2px',



                                  display:

                                    'flex',



                                  alignItems:

                                    'center',



                                  justifyContent:

                                    'center',



                                  background:

                                    isVeg

                                      ? '#F0FAF5'

                                      : '#FFF2EF',



                                  border:

                                    `1px solid ${isVeg

                                      ? '#B9E5CE'

                                      : '#F1C2B8'

                                    }`,



                                  borderRadius:

                                    '4px',

                                }}

                              >

                                <span

                                  style={{

                                    width:

                                      '6px',



                                    height:

                                      '6px',



                                    borderRadius:

                                      '50%',



                                    background:

                                      isVeg

                                        ? VEG

                                        : NON_VEG,

                                  }}

                                />

                              </span>



                              {/* NAME */}



                              <div

                                style={{

                                  flex: 1,



                                  minWidth: 0,



                                  color: TEXT,



                                  fontSize:

                                    '13px',



                                  lineHeight:

                                    1.3,



                                  fontWeight:

                                    800,



                                  display:

                                    '-webkit-box',



                                  WebkitLineClamp:

                                    2,



                                  WebkitBoxOrient:

                                    'vertical',



                                  overflow:

                                    'hidden',

                                }}

                              >

                                {

                                  cartItem

                                    .item

                                    .name

                                }

                              </div>

                            </div>



                            {/* PRICE */}



                            <div

                              style={{

                                marginTop:

                                  '5px',



                                color:

                                  PINK,



                                fontSize:

                                  '14px',



                                lineHeight: 1,



                                fontWeight:

                                  850,

                              }}

                            >

                              {formatCurrency(

                                cartItem

                                  .itemTotalPrice

                              )}

                            </div>



                            {/* CUSTOMIZATION */}



                            {(cartItem

                              .customization

                              .selectedVariant ||

                              cartItem

                                .customization

                                .selectedAddons

                                .length >

                              0) && (

                                <div

                                  style={{

                                    display:

                                      'flex',



                                    flexWrap:

                                      'wrap',



                                    gap: '4px',



                                    marginTop:

                                      '5px',

                                  }}

                                >

                                  {cartItem

                                    .customization

                                    .selectedVariant && (

                                      <span

                                        style={{

                                          padding:

                                            '2px 6px',



                                          background:

                                            PINK_SOFT,



                                          color:

                                            PINK,



                                          border:

                                            '1px solid #FFD5DF',



                                          borderRadius:

                                            '5px',



                                          fontSize:

                                            '9px',



                                          fontWeight:

                                            700,

                                        }}

                                      >

                                        {

                                          cartItem

                                            .customization

                                            .selectedVariant

                                            .name

                                        }

                                      </span>

                                    )}



                                  {cartItem

                                    .customization

                                    .selectedAddons

                                    .map(

                                      (a) => (

                                        <span

                                          key={

                                            a.id

                                          }

                                          style={{

                                            padding:

                                              '2px 6px',



                                            background:

                                              '#F7F7F9',



                                            color:

                                              BODY,



                                            border:

                                              `1px solid ${BORDER}`,



                                            borderRadius:

                                              '5px',



                                            fontSize:

                                              '9px',



                                            fontWeight:

                                              600,

                                          }}

                                        >

                                          +{' '}

                                          {

                                            a.name

                                          }

                                        </span>

                                      )

                                    )}

                                </div>

                              )}



                            {/* SPECIAL NOTE */}



                            {cartItem

                              .customization

                              .specialInstructions && (

                                <div

                                  style={{

                                    marginTop:

                                      '4px',



                                    color:

                                      MUTED,



                                    fontSize:

                                      '9px',



                                    fontStyle:

                                      'italic',



                                    overflow:

                                      'hidden',



                                    whiteSpace:

                                      'nowrap',



                                    textOverflow:

                                      'ellipsis',

                                  }}

                                >

                                  Note: "

                                  {

                                    cartItem

                                      .customization

                                      .specialInstructions

                                  }

                                  "

                                </div>

                              )}

                          </div>



                          {/* =================================================

                              RIGHT CONTROLS

                              ================================================= */}



                          <div

                            style={{

                              minWidth:

                                '100px',



                              display:

                                'flex',



                              flexDirection:

                                'column',



                              alignItems:

                                'flex-end',



                              justifyContent:

                                'space-between',



                              alignSelf:

                                'stretch',

                            }}

                          >

                            {/* SINGLE DELETE BUTTON */}



                            <button

                              type="button"

                              onClick={() =>

                                onRemoveItem(

                                  cartItem

                                    .cartItemId

                                )

                              }

                              aria-label={`Remove ${cartItem.item.name}`}

                              title="Remove item"

                              style={{

                                width: '28px',

                                height: '28px',



                                display:

                                  'flex',



                                alignItems:

                                  'center',



                                justifyContent:

                                  'center',



                                padding: 0,



                                background:

                                  PINK_SOFT,



                                color: PINK,



                                border:

                                  '1px solid #FFD4DE',



                                borderRadius:

                                  '8px',



                                cursor:

                                  'pointer',



                                transition:

                                  'all 0.18s ease',

                              }}

                              onMouseEnter={(

                                e

                              ) => {

                                e.currentTarget.style.background =

                                  PINK;



                                e.currentTarget.style.color =

                                  WHITE;



                                e.currentTarget.style.borderColor =

                                  PINK;

                              }}

                              onMouseLeave={(

                                e

                              ) => {

                                e.currentTarget.style.background =

                                  PINK_SOFT;



                                e.currentTarget.style.color =

                                  PINK;



                                e.currentTarget.style.borderColor =

                                  '#FFD4DE';

                              }}

                            >

                              <Trash2

                                size={13}

                              />

                            </button>



                            {/* QUANTITY */}



                            <div

                              style={{

                                display:

                                  'flex',



                                alignItems:

                                  'center',



                                gap: '7px',



                                padding:

                                  '3px',



                                background:

                                  WHITE,



                                border:

                                  `1px solid ${BORDER}`,



                                borderRadius:

                                  '12px',

                              }}

                            >

                              {/* MINUS */}



                              <button

                                type="button"

                                onClick={() =>

                                  onDecrement(

                                    cartItem

                                      .cartItemId

                                  )

                                }

                                aria-label="Decrease quantity"

                                style={{

                                  width:

                                    '30px',



                                  height:

                                    '30px',



                                  display:

                                    'flex',



                                  alignItems:

                                    'center',



                                  justifyContent:

                                    'center',



                                  padding: 0,



                                  background:

                                    '#FAFAFB',



                                  color:

                                    '#555555',



                                  border:

                                    `1px solid ${BORDER}`,



                                  borderRadius:

                                    '9px',



                                  cursor:

                                    'pointer',



                                  transition:

                                    'all 0.18s ease',

                                }}

                                onMouseEnter={(

                                  e

                                ) => {

                                  e.currentTarget.style.background =

                                    PINK_SOFT;



                                  e.currentTarget.style.color =

                                    PINK;



                                  e.currentTarget.style.borderColor =

                                    '#FFD4DE';

                                }}

                                onMouseLeave={(

                                  e

                                ) => {

                                  e.currentTarget.style.background =

                                    '#FAFAFB';



                                  e.currentTarget.style.color =

                                    '#555555';



                                  e.currentTarget.style.borderColor =

                                    BORDER;

                                }}

                              >

                                <Minus

                                  size={13}

                                />

                              </button>



                              {/* COUNT */}



                              <span

                                style={{

                                  width:

                                    '20px',



                                  textAlign:

                                    'center',



                                  color:

                                    TEXT,



                                  fontSize:

                                    '13px',



                                  fontWeight:

                                    850,

                                }}

                              >

                                {

                                  cartItem.quantity

                                }

                              </span>



                              {/* PLUS */}



                              <button

                                type="button"

                                onClick={() =>

                                  onIncrement(

                                    cartItem

                                      .cartItemId

                                  )

                                }

                                aria-label="Increase quantity"

                                style={{

                                  width:

                                    '30px',



                                  height:

                                    '30px',



                                  display:

                                    'flex',



                                  alignItems:

                                    'center',



                                  justifyContent:

                                    'center',



                                  padding: 0,



                                  background:

                                    PINK,



                                  color:

                                    WHITE,



                                  border:

                                    `1px solid ${PINK}`,



                                  borderRadius:

                                    '9px',



                                  cursor:

                                    'pointer',



                                  boxShadow:

                                    '0 4px 10px rgba(255,36,87,0.16)',



                                  transition:

                                    'all 0.18s ease',

                                }}

                                onMouseEnter={(

                                  e

                                ) => {

                                  e.currentTarget.style.background =

                                    PINK_DARK;



                                  e.currentTarget.style.borderColor =

                                    PINK_DARK;

                                }}

                                onMouseLeave={(

                                  e

                                ) => {

                                  e.currentTarget.style.background =

                                    PINK;



                                  e.currentTarget.style.borderColor =

                                    PINK;

                                }}

                              >

                                <Plus

                                  size={14}

                                />

                              </button>

                            </div>

                          </div>

                        </div>

                      );

                    }

                  )}

                </div>



                {/* =================================================

                    PAYMENT SUMMARY

                    ================================================= */}



                <div

                  style={{

                    marginTop:

                      '12px',



                    padding:

                      '17px',



                    background:

                      WHITE,



                    border:

                      `1px solid ${BORDER}`,



                    borderRadius:

                      '17px',



                    boxShadow:

                      '0 2px 9px rgba(31,31,31,0.04)',

                  }}

                >

                  {/* TITLE */}



                  <div

                    style={{

                      display:

                        'flex',



                      alignItems:

                        'center',



                      gap: '9px',



                      marginBottom:

                        '14px',

                    }}

                  >

                    <div

                      style={{

                        width: '36px',

                        height: '36px',



                        display:

                          'flex',



                        alignItems:

                          'center',



                        justifyContent:

                          'center',



                        background:

                          PINK_SOFT,



                        color: PINK,



                        borderRadius:

                          '11px',

                      }}

                    >

                      <Receipt

                        size={17}

                      />

                    </div>



                    <span

                      style={{

                        color: TEXT,



                        fontSize: '15px',



                        fontWeight: 850,

                      }}

                    >

                      Payment Summary

                    </span>

                  </div>



                  {/* SUBTOTAL */}



                  <div

                    style={{

                      display:

                        'flex',



                      justifyContent:

                        'space-between',



                      alignItems:

                        'center',



                      padding:

                        '4px 0',



                      color: BODY,



                      fontSize: '12px',

                    }}

                  >

                    <span>

                      Item Subtotal

                    </span>



                    <span

                      style={{

                        color: TEXT,



                        fontWeight: 700,

                      }}

                    >

                      {formatCurrency(

                        subtotal

                      )}

                    </span>

                  </div>



                  {/* TAX */}



                  <div

                    style={{

                      display:

                        'flex',



                      justifyContent:

                        'space-between',



                      alignItems:

                        'center',



                      padding:

                        '4px 0',



                      color: BODY,



                      fontSize: '12px',

                    }}

                  >

                    <span>

                      Taxes (GST 5%)

                    </span>



                    <span

                      style={{

                        color: TEXT,



                        fontWeight: 600,

                      }}

                    >

                      {formatCurrency(

                        tax

                      )}

                    </span>

                  </div>



                  {/* DIVIDER */}



                  <div

                    style={{

                      height: '1px',



                      margin:

                        '8px 0',



                      background:

                        BORDER,

                    }}

                  />



                  {/* TOTAL */}



                  <div

                    style={{

                      display:

                        'flex',



                      justifyContent:

                        'space-between',



                      alignItems:

                        'center',

                    }}

                  >

                    <span

                      style={{

                        color: TEXT,



                        fontSize: '14px',



                        fontWeight: 850,

                      }}

                    >

                      Total Amount

                    </span>



                    <span

                      style={{

                        color: PINK,



                        fontSize: '18px',



                        fontWeight: 900,

                      }}

                    >

                      {formatCurrency(

                        total

                      )}

                    </span>

                  </div>

                </div>



                <div

                  style={{

                    height: '10px',

                  }}

                />

              </div>



              {/* =================================================

                  SOFT BOTTOM CTA

                  ================================================= */}



              <div

                style={{

                  flexShrink: 0,



                  display:

                    'flex',



                  alignItems:

                    'center',



                  gap: '14px',



                  padding:

                    '13px 16px',



                  background:

                    'rgba(255,255,255,0.97)',



                  borderTop:

                    `1px solid ${BORDER}`,



                  boxShadow:

                    '0 -7px 22px rgba(31,31,31,0.05)',



                  backdropFilter:

                    'blur(12px)',



                  WebkitBackdropFilter:

                    'blur(12px)',

                }}

              >

                {/* TOTAL */}



                <div

                  style={{

                    minWidth: '82px',



                    display:

                      'flex',



                    flexDirection:

                      'column',



                    justifyContent:

                      'center',

                  }}

                >

                  <span

                    style={{

                      color: MUTED,



                      fontSize: '10px',



                      lineHeight: 1,



                      fontWeight: 800,



                      letterSpacing:

                        '0.08em',



                      textTransform:

                        'uppercase',

                    }}

                  >

                    TOTAL

                  </span>



                  <strong

                    style={{

                      display:

                        'block',



                      marginTop:

                        '5px',



                      color: PINK,



                      fontSize: '21px',



                      lineHeight: 1,



                      fontWeight: 900,



                      letterSpacing:

                        '-0.03em',

                    }}

                  >

                    {formatCurrency(

                      total

                    )}

                  </strong>

                </div>



                {/* DIVIDER */}



                <div

                  style={{

                    width: '1px',



                    height: '38px',



                    background:

                      BORDER,

                  }}

                />



                {/* SOFT PROCEED BUTTON */}



                <button

                  type="button"

                  onClick={() =>

                    onProceedToCheckout(

                      0,

                      true

                    )

                  }

                  style={{

                    flex: 1,



                    height: '46px',



                    display:

                      'flex',



                    alignItems:

                      'center',



                    justifyContent:

                      'center',



                    gap: '8px',



                    padding:

                      '0 18px',



                    background:

                      PINK,



                    color:

                      WHITE,



                    border:

                      `1px solid ${PINK}`,



                    borderRadius:

                      '14px',



                    fontSize: '13px',



                    fontWeight: 800,



                    cursor:

                      'pointer',



                    boxShadow:

                      '0 5px 14px rgba(255,36,87,0.16)',



                    transition:

                      'all 0.2s ease',

                  }}

                  onMouseEnter={(e) => {

                    e.currentTarget.style.background =

                      PINK_DARK;



                    e.currentTarget.style.borderColor =

                      PINK_DARK;



                    e.currentTarget.style.boxShadow =

                      '0 7px 18px rgba(255,36,87,0.20)';



                    e.currentTarget.style.transform =

                      'translateY(-1px)';

                  }}

                  onMouseLeave={(e) => {

                    e.currentTarget.style.background =

                      PINK;



                    e.currentTarget.style.borderColor =

                      PINK;



                    e.currentTarget.style.boxShadow =

                      '0 5px 14px rgba(255,36,87,0.16)';



                    e.currentTarget.style.transform =

                      'translateY(0)';

                  }}

                >

                  <span>

                    Proceed to Order

                  </span>



                  <ArrowRight

                    size={17}

                  />

                </button>

              </div>

            </div>

          )}

        </div>

      </div>



      {/* =====================================================

          INLINE ANIMATIONS

          ===================================================== */}



      <style>

        {`

          @keyframes float247TrayBackdropIn {

            from {

              opacity: 0;

            }



            to {

              opacity: 1;

            }

          }



          @keyframes float247TrayPopupIn {

            0% {

              opacity: 0;



              transform:

                translateY(18px)

                scale(0.94);

            }



            70% {

              opacity: 1;



              transform:

                translateY(-2px)

                scale(1.01);

            }



            100% {

              opacity: 1;



              transform:

                translateY(0)

                scale(1);

            }

          }



          @media (max-width: 600px) {

            .float247-king-tray-popup {

              width:

                calc(100vw - 20px);

            }

          }



          @media (max-width: 420px) {

            .float247-king-tray-popup {

              width:

                calc(100vw - 12px);

            }

          }



          @media (prefers-reduced-motion: reduce) {

            * {

              animation-duration:

                0.01ms !important;



              animation-iteration-count:

                1 !important;



              transition-duration:

                0.01ms !important;

            }

          }

        `}

      </style>

    </>

  );

};  