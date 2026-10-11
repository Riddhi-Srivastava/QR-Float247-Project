export type DietaryType = 'veg' | 'non-veg' | 'vegan' | 'egg';

export interface AddonOption {
  id: string;
  name: string;
  price: number;
}

export interface VariantOption {
  id: string;
  name: string;
  priceDelta: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'pizza' | 'burger' | 'whoppers' | 'burgers' | 'combos' | 'starters' | 'sides' | 'mains' | 'breads' | 'pastas' | 'rice' | 'drinks' | 'desserts' | 'specials';
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  dietary: DietaryType;
  rating: number;
  ratingCount: number;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  prepTimeMinutes: number;
  calories?: number;
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  isAvailable?: boolean; // Stock availability controller
  variants?: VariantOption[];
  addons?: AddonOption[];
}

export interface CartCustomization {
  selectedVariant?: VariantOption;
  selectedAddons: AddonOption[];
  specialInstructions?: string;
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  quantity: number;
  customization: CartCustomization;
  itemTotalPrice: number;
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'completed' | 'served';

export interface Order {
  orderId: string;
  tokenNumber: number;
  tableNumber: string;
  customerName: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  tip: number;
  discount?: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  paymentMethod: 'counter' | 'upi' | 'card';
  specialNotes?: string;
}

export interface TableInfo {
  tableNumber: string;
  restaurantName: string;
  tagline: string;
  guestCount: number;
  serverName: string;
}

export type TableOccupancyStatus = 'available' | 'occupied' | 'cooking' | 'bill_requested';

export interface TableData {
  id: string;
  tableNumber: string;
  capacity: number;
  status: TableOccupancyStatus;
  activeOrderId?: string;
  guestName?: string;
  orderTotal?: number;
}

export interface ServiceRequest {
  id: string;
  tableNumber: string;
  requestType: string;
  time: string;
  resolved: boolean;
}
