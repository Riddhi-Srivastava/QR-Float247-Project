import React, { useEffect, useState } from 'react';

import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';

import api from './lib/api';

import { getFoods } from './services/foodService';

import {

  getRestaurants,

  Restaurant,

} from './services/restaurantService';

import Adminlogin from './components/admin/Adminlogin';

import {

  MenuItem,

  CartItem,

  CartCustomization,

  Order,

  OrderStatus,

  TableData,

  TableOccupancyStatus,

  ServiceRequest,

} from './types/restaurant';

// Guest Dining Components

import { RestaurantHeader } from './components/restaurant/RestaurantHeader';

import { CategoryPills } from './components/restaurant/CategoryPills';

import { FoodCard } from './components/restaurant/FoodCard';

import { ItemDetailModal } from './components/restaurant/ItemDetailModal';

import { CartDrawer } from './components/restaurant/CartDrawer';

import CheckoutModal from './components/restaurant/CheckoutModal';

import { OrderSuccess } from './components/restaurant/OrderSuccess';

import { OrderTracker } from './components/restaurant/OrderTracker';

import { FloatingCartBar } from './components/restaurant/FloatingCartBar';

import { WaiterCallModal } from './components/restaurant/WaiterCallModal';

// Admin

import { AdminDashboard } from './components/admin/AdminDashboard';

/* =========================================================

   GUEST VIEW

\\========================================================= */

const GuestView: React.FC<{

  menuItemsList: MenuItem[];

  restaurantInfo: Restaurant | null;

  categoryNames: Record<string, string>;

  displayTableInfo: {

    tableNumber: string;

    restaurantName: string;

    tagline: string;

    guestCount: number;

    serverName: string;

  };

  cartItems: CartItem[];

  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;

  activeOrder: Order | null;

  setActiveOrder: React.Dispatch<React.SetStateAction<Order | null>>;

  theme: 'dark' | 'light';

  toggleTheme: () => void;

  onSwitchToAdminView: () => void;

  routeOrderId?: string;

}> = ({

  menuItemsList,

  restaurantInfo,

  categoryNames,

  displayTableInfo,

  cartItems,

  setCartItems,

  activeOrder,

  setActiveOrder,

  theme,

  toggleTheme,

  onSwitchToAdminView,

  routeOrderId,

}) => {

  const navigate = useNavigate();

  const location = useLocation();

  const tableId = new URLSearchParams(location.search).get('table');

  const [activeView, setActiveView] = useState<

    'menu' | 'success' | 'tracker'

  >('menu');

  // Keep the existing guest UI/state, but expose each customer flow as a real route.

  useEffect(() => {

    const path = location.pathname;

    if (path === '/cart') {

      setActiveView('menu');

      setIsCartOpen(true);

      setIsCheckoutOpen(false);

      return;

    }

    if (path === '/checkout') {

      setActiveView('menu');

      setIsCartOpen(false);

      setIsCheckoutOpen(true);

      return;

    }

    if (path.startsWith('/track-order/')) {

      setActiveView('tracker');

      return;

    }

    if (path.startsWith('/order/')) {

      setIsCartOpen(false);

      setIsCheckoutOpen(false);

      setActiveView('success');

      return;

    }

    setIsCartOpen(false);

    setIsCheckoutOpen(false);

    setActiveView('menu');

  }, [location.pathname]);

  useEffect(() => {

    if (!routeOrderId) return;

    if (activeOrder?.orderId === routeOrderId) return;

    try {

      const savedOrder = sessionStorage.getItem(`float247_order\_${routeOrderId}`);

      if (savedOrder) {

        const parsedOrder = JSON.parse(savedOrder) as Order;

        if (parsedOrder?.orderId === routeOrderId) {

          setActiveOrder(parsedOrder);

        }

      }

    } catch (error) {

      console.error('Failed to restore order route state:', error);

    }

  }, [routeOrderId, activeOrder, setActiveOrder]);

  const [selectedCategory, setSelectedCategory] =

    useState<string>('all');

  const [dietaryFilter, setDietaryFilter] = useState<

    'all' | 'veg' | 'non-veg' | 'specials'

  >('all');

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedItemForDetail, setSelectedItemForDetail] =

    useState<MenuItem | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);

  const [tipAmount, setTipAmount] = useState(0);

  const [includeCutlery, setIncludeCutlery] = useState(true);

  const [, setServiceRequests] =

    useState<ServiceRequest[]>([]);

  const filteredItems = menuItemsList.filter(item => {

    if (

      selectedCategory !== 'all' &&

      item.category !== selectedCategory

    ) {

      return false;

    }

    if (

      dietaryFilter === 'veg' &&

      item.dietary !== 'veg' &&

      item.dietary !== 'vegan'

    ) {

      return false;

    }

    if (

      dietaryFilter === 'non-veg' &&

      item.dietary !== 'non-veg'

    ) {

      return false;

    }

    if (

      dietaryFilter === 'specials' &&

      !item.isBestseller

    ) {

      return false;

    }

    if (searchQuery.trim()) {

      const q = searchQuery.toLowerCase();

      const matchName = item.name

        .toLowerCase()

        .includes(q);

      const matchDesc = item.description

        .toLowerCase()

        .includes(q);

      const matchCat = item.category

        .toLowerCase()

        .includes(q);

      if (!matchName && !matchDesc && !matchCat) {

        return false;

      }

    }

    return true;

  });

  const handleAddToCart = async (

    item: MenuItem,

    quantity: number,

    customization: CartCustomization

  ) => {

    const normalizedQuantity = Math.max(

      1,

      Number(quantity) || 1

    );

    const basePrice =

      item.price +

      (customization.selectedVariant

        ? customization.selectedVariant.priceDelta

        : 0);

    const addonsTotal =

      customization.selectedAddons.reduce(

        (acc, addon) => acc + addon.price,

        0

      );

    const unitPrice = basePrice + addonsTotal;

    try {

      const response = await api.post('/cart/items', {

        foodId: item.id,

        itemId: item.id,

        menuItemId: item.id,

        quantity: normalizedQuantity,

        variantId:

          customization.selectedVariant?.id,

        addonIds:

          customization.selectedAddons.map(

            addon => addon.id

          ),

      });

      const backendCartItem = response.data?.item;

      const serverQuantity =

        backendCartItem?.quantity ??

        normalizedQuantity;

      setCartItems(prev => {

        const existing = prev.find(

          cartItem => cartItem.item.id === item.id

        );

        if (existing) {

          return prev.map(cartItem =>

            cartItem.item.id === item.id

              ? {

                  ...cartItem,

                  quantity: serverQuantity,

                  itemTotalPrice:

                    serverQuantity * unitPrice,

                }

              : cartItem

          );

        }

        return [

          ...prev,

          {

            cartItemId:

              backendCartItem?.id ??

              `${item.id}-${Date.now()}`,

            item,

            quantity: serverQuantity,

            customization,

            itemTotalPrice:

              serverQuantity * unitPrice,

          },

        ];

      });

    } catch (error: any) {

      console.error(

        'Failed to add item to backend cart:',

        error?.response?.data ||

          error?.message ||

          error

      );

    }

  };

  const handleQuickAdd = (item: MenuItem) => {

    handleAddToCart(item, 1, {

      selectedVariant:

        item.variants &&

        item.variants.length > 0

          ? item.variants[0]

          : undefined,

      selectedAddons: [],

      specialInstructions: undefined,

    });

  };

  const handleIncrement = async (

    cartItemId: string

  ) => {

    const target = cartItems.find(

      item => item.cartItemId === cartItemId

    );

    if (!target) return;

    try {

      const newQuantity = target.quantity + 1;

      await api.put(

        `/cart/items/${cartItemId}`,

        {

          quantity: newQuantity,

        }

      );

      const unitPrice =

        target.itemTotalPrice /

        target.quantity;

      setCartItems(prev =>

        prev.map(item =>

          item.cartItemId === cartItemId

            ? {

                ...item,

                quantity: newQuantity,

                itemTotalPrice:

                  newQuantity * unitPrice,

              }

            : item

        )

      );

    } catch (error) {

      console.error(

        'Failed to increase cart item:',

        error

      );

    }

  };

  const handleDecrement = async (

    cartItemId: string

  ) => {

    const target = cartItems.find(

      item => item.cartItemId === cartItemId

    );

    if (!target) return;

    try {

      if (target.quantity <= 1) {

        await api.delete(

          `/cart/items/${cartItemId}`

        );

        setCartItems(prev =>

          prev.filter(

            item =>

              item.cartItemId !== cartItemId

          )

        );

        return;

      }

      const newQuantity = target.quantity - 1;

      await api.put(

        `/cart/items/${cartItemId}`,

        {

          quantity: newQuantity,

        }

      );

      const unitPrice =

        target.itemTotalPrice /

        target.quantity;

      setCartItems(prev =>

        prev.map(item =>

          item.cartItemId === cartItemId

            ? {

                ...item,

                quantity: newQuantity,

                itemTotalPrice:

                  newQuantity * unitPrice,

              }

            : item

        )

      );

    } catch (error) {

      console.error(

        'Failed to decrease cart item:',

        error

      );

    }

  };

  const handleRemoveItem = async (

    cartItemId: string

  ) => {

    try {

      await api.delete(

        `/cart/items/${cartItemId}`

      );

      setCartItems(prev =>

        prev.filter(

          item =>

            item.cartItemId !== cartItemId

        )

      );

    } catch (error) {

      console.error(

        'Failed to remove cart item:',

        error

      );

    }

  };

  const handleProceedToCheckout = (

    tip: number,

    cutlery: boolean

  ) => {

    setTipAmount(tip);

    setIncludeCutlery(cutlery);

    setIsCartOpen(false);

    setIsCheckoutOpen(true);

  };

  const handlePlaceOrder = async (orderData: {

    customerName: string;

    customerPhone: string;

    paymentMethod:

      | 'counter'

      | 'upi'

      | 'card';

    specialNotes: string;

    discount: number;

  }) => {

    try {

      if (!restaurantInfo) {

        console.error(

          'Restaurant information is not available'

        );

        return;

      }

      if (!displayTableInfo.tableNumber.trim()) {

        console.error(

          'Table number is not available.'

        );

        return;

      }

      const paymentMethodMap = {

        counter: 'CASH',

        upi: 'UPI',

        card: 'CARD',

      } as const;

      const response = await api.post('/orders', {

        restaurantId: restaurantInfo.id,

        tableNumber:

          displayTableInfo.tableNumber.trim(),

        customerName:

          orderData.customerName,

        customerPhone:

          orderData.customerPhone,

        paymentMethod:

          paymentMethodMap[

            orderData.paymentMethod

          ],

        specialInstructions:

          orderData.specialNotes,

      });

      const backendOrder =

        response.data.order;
        

      const newOrder: Order = {

        orderId: backendOrder.id,

        tokenNumber:

          backendOrder.tokenNumber,

        tableNumber:

          backendOrder.tableNumber,

        customerName:

          backendOrder.customerName,

        customerPhone:

          backendOrder.customerPhone,

        items: [...cartItems],

        subtotal:

          Number(backendOrder.subtotal),

        tax:

          Number(backendOrder.tax),

        serviceCharge: 0,

        tip: tipAmount,

        discount:

          Number(backendOrder.discount) ||

          orderData.discount,

        total:

          Number(backendOrder.total),

        status: 'received',

        createdAt:

          backendOrder.createdAt ||

          new Date().toISOString(),

        estimatedDeliveryTime:

          backendOrder.estimatedPrepTime

            ? `${backendOrder.estimatedPrepTime} Mins`

            : '10-15 Mins',

        paymentMethod:

          orderData.paymentMethod,

        specialNotes:

          orderData.specialNotes,

      };

      setActiveOrder(newOrder);

      try {

        sessionStorage.setItem(

          `float247_order\_${newOrder.orderId}`,

          JSON.stringify(newOrder)

        );

      } catch (error) {

        console.error('Failed to persist order route state:', error);

      }

      setCartItems([]);

      setIsCheckoutOpen(false);

      setActiveView('success');

      navigate(`/order/${newOrder.orderId}`);

    } catch (error: any) {

      console.error(

        'Failed to place order:',

        error?.response?.data ||

          error?.message ||

          error

      );

    }

  };

  const handleGuestServiceCall = (

    requestType: string

  ) => {

    const newReq: ServiceRequest = {

      id: `req-${Date.now()}`,

      tableNumber:

        displayTableInfo.tableNumber,

      requestType,

      time: new Date().toLocaleTimeString(

        [],

        {

          hour: '2-digit',

          minute: '2-digit',

        }

      ),

      resolved: false,

    };

    setServiceRequests(prev => [

      newReq,

      ...prev,

    ]);

  };

  return (

    <div className="app-container">

      <RestaurantHeader

        tableInfo={displayTableInfo}

        activeOrder={activeOrder}

        activeView={activeView}

        onOpenWaiterModal={() =>

          setIsWaiterModalOpen(true)

        }

        onOpenOrderTracker={() => {

          if (activeOrder?.orderId) {

            navigate(`/track-order/${activeOrder.orderId}`);

          }

        }}

        onOpenCart={() => {

          setIsCartOpen(true);

          navigate(

            tableId

              ? `/cart?table=${encodeURIComponent(tableId)}`

              : '/cart'

          );

        }}

        onSwitchToAdminView={

          onSwitchToAdminView

        }

        cartItemCount={cartItems.reduce(

          (acc, item) =>

            acc + item.quantity,

          0

        )}

        searchQuery={searchQuery}

        setSearchQuery={setSearchQuery}

        theme={theme}

        toggleTheme={toggleTheme}

      />

      {activeView === 'menu' && (

        <main>

          <CategoryPills

            selectedCategory={

              selectedCategory

            }

            onSelectCategory={

              setSelectedCategory

            }

            dietaryFilter={

              dietaryFilter

            }

            setDietaryFilter={

              setDietaryFilter

            }

          />

          <section

            className="section"

            style={{

              paddingTop: '0.75rem',

            }}

          >

            <div className="container">

              <div

                style={{

                  display: 'flex',

                  justifyContent:

                    'space-between',

                  alignItems: 'center',

                  marginBottom: '0.75rem',

                }}

              >

                <h2

                  style={{

                    fontSize: '1.25rem',

                    fontWeight: 900,

                  }}

                >

                  {searchQuery

                    ? `Search Results for "${searchQuery}"`

                    : selectedCategory ===

                        'all'

                      ? 'Flame-Grilled Menu'

                      : categoryNames[

                          selectedCategory

                        ] || 'Menu'}

                </h2>

                <span

                  style={{

                    fontSize: '0.85rem',

                    color:

                      'var(--text-muted)',

                    fontWeight: 700,

                  }}

                >

                  {filteredItems.length}{' '}

                  {filteredItems.length === 1

                    ? 'dish'

                    : 'dishes'}

                </span>

              </div>

              {filteredItems.length === 0 ? (

                <div

                  style={{

                    textAlign: 'center',

                    padding:

                      '3.5rem 1rem',

                    color:

                      'var(--text-muted)',

                  }}

                >

                  <p

                    style={{

                      fontSize: '1.1rem',

                      marginBottom:

                        '0.5rem',

                    }}

                  >

                    No dishes match your

                    filter criteria.

                  </p>

                  <button

                    className="btn btn-secondary btn-sm"

                    onClick={() => {

                      setSelectedCategory(

                        'all'

                      );

                      setDietaryFilter(

                        'all'

                      );

                      setSearchQuery('');

                    }}

                  >

                    Reset All Filters

                  </button>

                </div>

              ) : (

                <div className="food-grid">

                  {filteredItems.map(

                    item => {

                      const cartItem =

                        cartItems.find(

                          cart =>

                            cart.item.id ===

                            item.id

                        );

                      return (

                        <FoodCard

                          key={item.id}

                          item={item}

                          cartItem={cartItem}

                          onOpenDetails={

                            setSelectedItemForDetail

                          }

                          onQuickAdd={

                            handleQuickAdd

                          }

                          onIncrement={

                            handleIncrement

                          }

                          onDecrement={

                            handleDecrement

                          }

                        />

                      );

                    }

                  )}

                </div>

              )}

            </div>

          </section>

        </main>

      )}

      {activeView === 'success' &&

        activeOrder && (

          <OrderSuccess

            order={activeOrder}

            onTrackOrder={() => {

              if (activeOrder?.orderId) {

                navigate(`/track-order/${activeOrder.orderId}`);

              }

            }}

            onBackToMenu={() =>

              navigate(

                tableId

                  ? `/?table=${encodeURIComponent(tableId)}`

                  : '/'

              )

            }

          />

        )}

      {activeView === 'tracker' &&

        activeOrder && (

          <OrderTracker

            order={activeOrder}

            onBackToMenu={() =>

              navigate(

                tableId

                  ? `/?table=${encodeURIComponent(tableId)}`

                  : '/'

              )

            }

            onOpenWaiterModal={() =>

              setIsWaiterModalOpen(true)

            }

          />

        )}

      {activeView === 'menu' && (

        <FloatingCartBar

          cartItems={cartItems}

          onOpenCart={() => {

            setIsCartOpen(true);

            navigate(

              tableId

                ? `/cart?table=${encodeURIComponent(tableId)}`

                : '/cart'

            );

          }}

        />

      )}

      <ItemDetailModal

        item={selectedItemForDetail}

        onClose={() =>

          setSelectedItemForDetail(null)

        }

        onAddToCart={handleAddToCart}

      />

      <CartDrawer

        isOpen={isCartOpen}

        onClose={() => {

          setIsCartOpen(false);

          navigate(

            tableId

              ? `/?table=${encodeURIComponent(tableId)}`

              : '/'

          );

        }}

        cartItems={cartItems}

        onIncrement={handleIncrement}

        onDecrement={handleDecrement}

        onRemoveItem={handleRemoveItem}

        onProceedToCheckout={(tip, cutlery) => {

          handleProceedToCheckout(tip, cutlery);

          navigate(

            tableId

              ? `/checkout?table=${encodeURIComponent(tableId)}`

              : '/checkout'

          );

        }}

        tableNumber={

          displayTableInfo.tableNumber

        }

      />

      <CheckoutModal

        isOpen={isCheckoutOpen}

        onClose={() => {

          setIsCheckoutOpen(false);

          navigate(

            tableId

              ? `/cart?table=${encodeURIComponent(tableId)}`

              : '/cart'

          );

        }}

        cartItems={cartItems}

        tipAmount={tipAmount}

        includeCutlery={

          includeCutlery

        }

        tableInfo={displayTableInfo}

        onPlaceOrder={handlePlaceOrder}

      />

      <WaiterCallModal

        isOpen={isWaiterModalOpen}

        onClose={() =>

          setIsWaiterModalOpen(false)

        }

        tableInfo={displayTableInfo}

        onServiceCall={

          handleGuestServiceCall

        }

      />

    </div>

  );

};

const GuestViewWithOrderId: React.FC<React.ComponentProps<typeof GuestView>> = (

  props

) => {

  const { orderId } = useParams<{ orderId: string }>();

  return <GuestView {...props} routeOrderId={orderId} />;

};

/* =========================================================

   ROOT APP

\\========================================================= */

export const App: React.FC = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const tableId = new URLSearchParams(location.search).get('table');

  /* ---------------- Theme ---------------- */

  const [theme, setTheme] =

    useState<'dark' | 'light'>(() => {

      const saved =

        localStorage.getItem(

          'resto_theme'

        );

      return saved === 'light' ||

        saved === 'dark'

        ? saved

        : 'dark';

    });

  useEffect(() => {

    document.documentElement.setAttribute(

      'data-theme',

      theme

    );

    localStorage.setItem(

      'resto_theme',

      theme

    );

  }, [theme]);

  const toggleTheme = () => {

    setTheme(prev =>

      prev === 'dark'

        ? 'light'

        : 'dark'

    );

  };

  /* ---------------- Auth ---------------- */

  const [isAdminLoggedIn, setIsAdminLoggedIn] =

    useState(() =>

      Boolean(

        localStorage.getItem('token')

      )

    );

  /* ---------------- Guest State ---------------- */

  const [menuItemsList, setMenuItemsList] =

    useState<MenuItem[]>([]);

  const [restaurantInfo, setRestaurantInfo] =

    useState<Restaurant | null>(null);

  const [categoryNames, setCategoryNames] =

    useState<Record<string, string>>({});

  const [cartItems, setCartItems] =

    useState<CartItem[]>([]);

  const [activeOrder, setActiveOrder] =

    useState<Order | null>(null);

  const [displayTableInfo, setDisplayTableInfo] =

    useState({

      tableNumber: '',

      restaurantName: '',

      tagline: '',

      guestCount: 0,

      serverName: '',

    });

  /* ---------------- Guest / Table Session ---------------- */

  // A QR table gets its own guest/cart session. Same-table refresh keeps

  // the session; opening a different table rotates the guest id.

  useEffect(() => {

    if (!tableId) return;

    const TABLE_SESSION_KEY = 'FLOAT247_ACTIVE_TABLE_ID';

    const GUEST_ID_KEY = 'FLOAT247_GUEST_ID';

    const previousTableId = localStorage.getItem(TABLE_SESSION_KEY);

    if (previousTableId !== String(tableId)) {

      const newGuestId =

        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'

          ? crypto.randomUUID()

          : `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;

      localStorage.setItem(GUEST_ID_KEY, newGuestId);

      localStorage.setItem(TABLE_SESSION_KEY, String(tableId));

      setCartItems([]);

      setActiveOrder(null);

    }

  }, [tableId]);

  /* ---------------- Admin State ---------------- */

const adminPage = location.pathname;

const isTablesPage =

  adminPage === '/admin/tables';

const isMenuPage =

  adminPage === '/admin/menu';

const isReportsPage =

  adminPage === '/admin/reports';

const isGuestPage =

  !location.pathname.startsWith('/admin');

  const [orders, setOrders] =

    useState<Order[]>([]);

  const [tables, setTables] =

    useState<TableData[]>([]);

  const [serviceRequests, setServiceRequests] =

    useState<ServiceRequest[]>([]);

  /* =========================================================

     GUEST DATA

  \\========================================================= */

 useEffect(() => {

  const shouldLoadFoods =

    isGuestPage ||

    isMenuPage ||

    isReportsPage;

  if (!shouldLoadFoods) return;

  const loadFoods = async () => {

    try {

      const foods = await getFoods();

      const mappedFoods: MenuItem[] = foods.map(food => ({

        id: food.id,

        name: food.name,

        description: food.description,

        price: Number(food.price),

        category:

          food.categoryId as MenuItem['category'],

        image: food.image || '',

        dietary:

          food.veg === 'VEG'

            ? 'veg'

            : 'non-veg',

        rating: food.rating,

        ratingCount: food.ratingCount,

        prepTimeMinutes: food.prepTime,

        isAvailable: food.available,

        isBestseller: food.popular,

        isChefSpecial: food.featured,

      }));

      setMenuItemsList(mappedFoods);

    } catch (error) {

      console.error(

        'Failed to load foods:',

        error

      );

    }

  };

  loadFoods();

}, [

  isGuestPage,

  isMenuPage,

  isReportsPage,

]);

  useEffect(() => {

    const loadRestaurant = async () => {

      try {

        const restaurants =

          await getRestaurants();

        if (restaurants.length > 0) {

          setRestaurantInfo(

            restaurants[0]

          );

        }

      } catch (error) {

        console.error(

          'Failed to load restaurant:',

          error

        );

      }

    };

    loadRestaurant();

  }, []);

  useEffect(() => {

    const loadCategories =

      async () => {

        try {

          const response =

            await api.get(

              '/categories'

            );

          const categories =

            response.data

              .categories || [];

          const categoryMap: Record<

            string,

            string

          > = {};

          categories.forEach(

            (category: {

              id: string;

              name: string;

            }) => {

              categoryMap[

                category.id

              ] = category.name;

            }

          );

          setCategoryNames(

            categoryMap

          );

        } catch (error) {

          console.error(

            'Failed to load category names:',

            error

          );

        }

      };

    loadCategories();

  }, []);

  /* ---------------- QR Table ---------------- */

  useEffect(() => {

    const resolveTableContext =

      async () => {

        if (!tableId) {

          console.warn(

            'No QR table id found in URL'

          );

          return;

        }

        try {

          const restaurantsResponse =

            await api.get(

              '/restaurants'

            );

          const restaurants =

            restaurantsResponse

              .data.restaurants ||

            [];

          for (const restaurant of restaurants) {

            const tablesResponse =

              await api.get(

                '/tables',

                {

                  params: {

                    restaurantId:

                      restaurant.id,

                  },

                }

              );

            const backendTables =

              tablesResponse

                .data.tables || [];

            const matchedTable =

              backendTables.find(

                (table: any) =>

                  String(table.id) ===

                    String(tableId) ||

                  String(table.number) ===

                    String(tableId)

              );

            if (matchedTable) {

              setRestaurantInfo(

                restaurant

              );

              setDisplayTableInfo({

                tableNumber:

                  String(

                    matchedTable.number

                  ),

                restaurantName:

                  restaurant.name,

                tagline:

                  restaurant.tagline ||

                  '',

                guestCount: 0,

                serverName: '',

              });

              return;

            }

          }

          console.error(

            'QR table was not found:',

            tableId

          );

        } catch (error) {

          console.error(

            'Failed to resolve QR table context:',

            error

          );

        }

      };

    resolveTableContext();

  }, []);

  /* ---------------- Cart ---------------- */

  const loadCart = async () => {

    try {

      const response =

        await api.get('/cart');

      const backendItems =

        response.data.cart

          ?.items || [];

      const mappedCartItems: CartItem[] =

        backendItems

          .map(

            (cartItem: any) => {

              const menuItem =

                menuItemsList.find(

                  item =>

                    item.id ===

                    cartItem.food.id

                );

              if (!menuItem) {

                return null;

              }

              return {

                cartItemId:

                  cartItem.id,

                item: menuItem,

                quantity:

                  cartItem.quantity,

                customization: {

                  selectedVariant:

                    undefined,

                  selectedAddons: [],

                  specialInstructions:

                    undefined,

                },

               itemTotalPrice:
  Number(
    cartItem.food.price
  ) *
  cartItem.quantity,

              };

            }

          )

          .filter(Boolean) as CartItem[];

      setCartItems(

        mappedCartItems

      );

    } catch (error) {

      console.error(

        'Failed to load cart:',

        error

      );

    }

  };

  useEffect(() => {

    if (menuItemsList.length > 0) {

      loadCart();

    }

  }, [menuItemsList, tableId]);

  /* =========================================================

     ADMIN DATA

  \\========================================================= */

  useEffect(() => {

    const loadTables = async () => {

      if (!restaurantInfo || !isTablesPage) {

        return;

      }

      try {

        const response =

          await api.get(

            '/tables',

            {

              params: {

                restaurantId:

                  restaurantInfo.id,

              },

            }

          );

        const backendTables =

          response.data.tables ||

          [];

        const mappedTables: TableData[] =

          backendTables.map(

            (table: any) => ({

              id: table.id,

              tableNumber:

                table.number,

              capacity:

                Number(

                  table.capacity || 0

                ),

              status:

                table.status ===

                'AVAILABLE'

                  ? 'available'

                  : table.status ===

                      'ORDERING'

                    ? 'cooking'

                    : table.status ===

                        'PAYMENT_PENDING'

                      ? 'bill_requested'

                      : 'occupied',

              activeOrderId:

                table.currentOrderId ||

                undefined,

            })

          );

        setTables(

          mappedTables

        );

      } catch (error) {

        console.error(

          'Failed to load tables:',

          error

        );

      }

    };

    loadTables();

  }, [restaurantInfo]);

  useEffect(() => {
  const loadOrders = async () => {
    if (!isAdminLoggedIn) {
      return;
    }

    try {
      const response = await api.get('/admin/orders');

      const backendOrders = Array.isArray(response.data?.orders)
        ? response.data.orders
        : [];

      const mappedOrders = backendOrders.map((order: any) => ({
        ...order,

        // Frontend Order type
        orderId: order.id,

        // Backend: RECEIVED/PREPARING/READY/COMPLETED/CANCELLED
        // Frontend: received/preparing/ready/completed/cancelled
        status: String(
          order.status || 'RECEIVED'
        ).toLowerCase(),

        // Keep backend createdAt
        createdAt:
          order.createdAt || new Date().toISOString(),

        // IMPORTANT:
        // AdminStats needs order.items
        items: Array.isArray(order.items)
          ? order.items.map((item: any) => ({
              ...item,
              foodId: item.foodId,
              name: item.name || '',
              price: Number(item.price || 0),
              quantity: Number(item.quantity || 0),
              category: item.category || 'Uncategorized',
              image: item.image || '',
            }))
          : [],
      }));

      setOrders(mappedOrders as Order[]);
    } catch (error: any) {
      console.error(
        'Failed to load admin orders:',
        error?.response?.data ||
          error?.message ||
          error
      );

      setOrders([]);
    }
  };

  loadOrders();
}, [isAdminLoggedIn]);

  /* =========================================================

     ADMIN HANDLERS

  \\========================================================= */

  const handleUpdateOrderStatus = async (

    orderId: string,

    status: OrderStatus

  ) => {

    const backendStatusMap: Record<string, string> = {

      received: 'RECEIVED',

      preparing: 'PREPARING',

      ready: 'READY',

      served: 'COMPLETED',

      completed: 'COMPLETED',

      cancelled: 'CANCELLED',

    };

    const backendStatus =

      backendStatusMap[String(status).toLowerCase()] ||

      String(status).toUpperCase();

    try {

      const response = await api.put(

        `/orders/${orderId}/status`,

        {

          status: backendStatus,

        }

      );

      const updatedBackendOrder =

        response.data?.order;

      const updatedStatus = String(

        updatedBackendOrder?.status ||

          backendStatus

      ).toLowerCase();

      setOrders(prev =>

        prev.map(order =>

          order.orderId === orderId

            ? {

                ...order,

                ...updatedBackendOrder,

                orderId,

                status:

                  updatedStatus as OrderStatus,

              }

            : order

        )

      );

      if (

        activeOrder?.orderId === orderId

      ) {

        setActiveOrder(prev =>

          prev

            ? {

                ...prev,

                ...updatedBackendOrder,

                orderId,

                status:

                  updatedStatus as OrderStatus,

              }

            : null

        );

      }

    } catch (error: any) {

      console.error(

        'Failed to update order status:',

        error?.response?.data ||

          error?.message ||

          error

      );

    }

  };

  const handleUpdateTableStatus = (

    tableId: string,

    status: TableOccupancyStatus

  ) => {

    setTables(prev =>

      prev.map(table => {

        if (table.id !== tableId) {

          return table;

        }

        if (

          status === 'available'

        ) {

          return {

            ...table,

            status,

            activeOrderId:

              undefined,

            guestName:

              undefined,

            orderTotal:

              undefined,

          };

        }

        return {

          ...table,

          status,

        };

      })

    );

  };

  const handleToggleMenuAvailability = (

    itemId: string

  ) => {

    const currentItem = menuItemsList.find(

      item => item.id === itemId

    );

    if (!currentItem) return;

    const available = currentItem.isAvailable === false;

    const updateAvailability = async () => {

      try {

        const response = await api.patch(

          `/admin/foods/${itemId}/availability`,

          { available }

        );

        if (!response.data?.success) {

          throw new Error(

            response.data?.message ||

              "Failed to update food availability"

          );

        }

        const food = response.data.food;

        setMenuItemsList(prev =>

          prev.map(item =>

            item.id === itemId

              ? {

                  ...item,

                  isAvailable: food.available,

                }

              : item

          )

        );

      } catch (error: any) {

        console.error(

          "Failed to update food availability:",

          error?.response?.data ||

            error?.message ||

            error

        );

      }

    };

    updateAvailability();

  };


const handleUpdateMenuPrice = (

    itemId: string,

    newPrice: number

  ) => {

    setMenuItemsList(prev =>

      prev.map(item =>

        item.id === itemId

          ? {

              ...item,

              price: newPrice,

            }

          : item

      )

    );

  };



 const handleAddMenuItem = async (data: {
  id: string;
  name: string;
  description: string;
  price: number;
  veg: "VEG" | "NON_VEG";
  image: string;
  prepTime: number;
  restaurantId: string;
  categoryId: string;
  available: boolean;
  popular: boolean;
  featured: boolean;
}) => {
  try {
    const response = await api.post(
      "/admin/foods",
      data
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to create food item"
      );
    }

    const food = response.data.food;

    const newItem: MenuItem = {
      id: food.id,
      name: food.name,
      description: food.description,
      price: Number(food.price),
      category:
        food.categoryId as MenuItem["category"],
      image: food.image || "",
      dietary:
        food.veg === "VEG"
          ? "veg"
          : "non-veg",
      rating: food.rating ?? 0,
      ratingCount: food.ratingCount ?? 0,
      prepTimeMinutes:
        food.prepTime ?? 0,
      isAvailable:
        food.available,
      isBestseller:
        food.popular,
      isChefSpecial:
        food.featured,
    };

    setMenuItemsList(prev => [
      ...prev,
      newItem,
    ]);
  } catch (error: any) {
    console.error(
      "Add menu item error:",
      error?.response?.data ||
        error?.message ||
        error
    );

    alert(
      error?.response?.data?.message ||
        "Failed to add menu item."
    );

    throw error;
  }
};

const handleEditMenuItem = async (data: {
  id: string;
  name: string;
  description: string;
  price: number;
  veg: "VEG" | "NON_VEG";
  image: string;
  prepTime: number;
  categoryId: string;
  available: boolean;
  popular: boolean;
  featured: boolean;
}) => {
  try {
    const response = await api.put(
      `/admin/foods/${data.id}`,
      data
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to update food item"
      );
    }

    const food = response.data.food;

    const updatedItem: MenuItem = {
      id: food.id,
      name: food.name,
      description: food.description,
      price: Number(food.price),
      category:
        food.categoryId as MenuItem["category"],
      image: food.image || "",
      dietary:
        food.veg === "VEG"
          ? "veg"
          : "non-veg",
      rating: food.rating ?? 0,
      ratingCount: food.ratingCount ?? 0,
      prepTimeMinutes:
        food.prepTime ?? 0,
      isAvailable:
        food.available,
      isBestseller:
        food.popular,
      isChefSpecial:
        food.featured,
    };

    setMenuItemsList(prev =>
      prev.map(item =>
        item.id === updatedItem.id
          ? updatedItem
          : item
      )
    );
  } catch (error: any) {
    console.error(
      "Edit menu item error:",
      error?.response?.data ||
        error?.message ||
        error
    );

    alert(
      error?.response?.data?.message ||
        "Failed to update menu item."
    );

    throw error;
  }
};

const handleResolveServiceRequest = (

    requestId: string

  ) => {

    setServiceRequests(prev =>

      prev.map(request =>

        request.id === requestId

          ? {

              ...request,

              resolved: true,

            }

          : request

      )

    );

  };

  /* =========================================================

     NAVIGATION

  \\========================================================= */

  const handleSwitchToAdmin = () => {

    navigate('/admin/kitchen');

  };

  const handleSwitchToGuest = () => {

    localStorage.removeItem('token');

    setIsAdminLoggedIn(false);

    window.location.replace('/');

  };

  /* =========================================================

     ROUTES

  \\========================================================= */

  return (

    <Routes>

      {/* Guest */}

      {/* Customer flow routes */}

      <Route

        path="/"

        element={

          <GuestView

            menuItemsList={menuItemsList}

            restaurantInfo={restaurantInfo}

            categoryNames={categoryNames}

            displayTableInfo={displayTableInfo}

            cartItems={cartItems}

            setCartItems={setCartItems}

            activeOrder={activeOrder}

            setActiveOrder={setActiveOrder}

            theme={theme}

            toggleTheme={toggleTheme}

            onSwitchToAdminView={handleSwitchToAdmin}

          />

        }

      />

      <Route

        path="/cart"

        element={

          <GuestView

            menuItemsList={menuItemsList}

            restaurantInfo={restaurantInfo}

            categoryNames={categoryNames}

            displayTableInfo={displayTableInfo}

            cartItems={cartItems}

            setCartItems={setCartItems}

            activeOrder={activeOrder}

            setActiveOrder={setActiveOrder}

            theme={theme}

            toggleTheme={toggleTheme}

            onSwitchToAdminView={handleSwitchToAdmin}

          />

        }

      />

      <Route

        path="/checkout"

        element={

          <GuestView

            menuItemsList={menuItemsList}

            restaurantInfo={restaurantInfo}

            categoryNames={categoryNames}

            displayTableInfo={displayTableInfo}

            cartItems={cartItems}

            setCartItems={setCartItems}

            activeOrder={activeOrder}

            setActiveOrder={setActiveOrder}

            theme={theme}

            toggleTheme={toggleTheme}

            onSwitchToAdminView={handleSwitchToAdmin}

          />

        }

      />

      <Route

        path="/order/:orderId"

        element={

          <GuestViewWithOrderId

            menuItemsList={menuItemsList}

            restaurantInfo={restaurantInfo}

            categoryNames={categoryNames}

            displayTableInfo={displayTableInfo}

            cartItems={cartItems}

            setCartItems={setCartItems}

            activeOrder={activeOrder}

            setActiveOrder={setActiveOrder}

            theme={theme}

            toggleTheme={toggleTheme}

            onSwitchToAdminView={handleSwitchToAdmin}

          />

        }

      />

      <Route

        path="/track-order/:orderId"

        element={

          <GuestViewWithOrderId

            menuItemsList={menuItemsList}

            restaurantInfo={restaurantInfo}

            categoryNames={categoryNames}

            displayTableInfo={displayTableInfo}

            cartItems={cartItems}

            setCartItems={setCartItems}

            activeOrder={activeOrder}

            setActiveOrder={setActiveOrder}

            theme={theme}

            toggleTheme={toggleTheme}

            onSwitchToAdminView={handleSwitchToAdmin}

          />

        }

      />

      {/* Admin Login */}

      <Route

        path="/admin/login"

        element={

          isAdminLoggedIn ? (

            <Navigate

              to="/admin/kitchen"

              replace

            />

          ) : (

            <Adminlogin

              onLogin={() => {

                setIsAdminLoggedIn(

                  true

                );

                navigate(

                  '/admin/kitchen'

                );

              }}

            />

          )

        }

      />

      {/* =====================================================

          EXISTING ADMIN ROUTE

          Keep AdminDashboard as the admin container.

          Do NOT create KitchenView/TablesView/etc here.

      \\===================================================== */}

      <Route

        path="/admin/*"

        element={

          !isAdminLoggedIn ? (

            <Navigate

              to="/admin/login"

              replace

            />

          ) : (

            <AdminDashboard

              orders={orders}

              tables={tables}

              menuItems={

                menuItemsList

              }

              serviceRequests={

                serviceRequests

              }

              onAddMenuItem={

                handleAddMenuItem

              }

              onEditMenuItem={

                handleEditMenuItem

              }

              onUpdateOrderStatus={

                handleUpdateOrderStatus

              }

              onUpdateTableStatus={

                handleUpdateTableStatus

              }

              onToggleMenuAvailability={

                handleToggleMenuAvailability

              }

              onUpdateMenuPrice={

                handleUpdateMenuPrice

              }

              onResolveServiceRequest={

                handleResolveServiceRequest

              }

              onSwitchToGuestView={

                handleSwitchToGuest

              }

              theme={theme}

              toggleTheme={

                toggleTheme

              }

            />

          )

        }

      />

      {/* Fallback */}

      <Route

        path="*"

        element={

          <Navigate

            to="/"

            replace

          />

        }

      />

    </Routes>

  );

};

export default App;

