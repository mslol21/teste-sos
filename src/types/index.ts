export type OrderType = 'DELIVERY' | 'PICKUP' | 'TABLE';
export type OrderStatus = 'NEW' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH';

export interface Option {
  id: string;
  name: string;
  price: number;
  active?: boolean;
}

export interface OptionGroup {
  id: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  required: boolean;
  options: Option[];
}

export interface Product {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number | null;
  image: string;
  isNew?: boolean;
  isPromo?: boolean;
  isBestSeller?: boolean;
  ingredients: string[];
  nutritionalInfo?: string;
  prepTimeMinutes: number;
  active: boolean;
  stockCount: number;
  optionGroups?: OptionGroup[];
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  orderIndex: number;
  active: boolean;
}

export interface CartItemOption {
  groupName: string;
  optionName: string;
  optionPrice: number;
}

export interface CartItem {
  id: string; // unique cart line item id
  product: Product;
  quantity: number;
  selectedOptions: CartItemOption[];
  notes?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  notes?: string;
  totalPrice: number;
  options: CartItemOption[];
}

export interface Order {
  id: string;
  tenantId: string;
  customerName: string;
  customerPhone: string;
  customerCpf?: string;
  orderType: OrderType;
  status: OrderStatus;
  deliveryAddress?: string;
  number?: string;
  neighborhood?: string;
  zipCode?: string;
  reference?: string;
  tableNumber?: number;
  paymentMethod: PaymentMethod;
  changeFor?: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  slogan: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  minOrderValue: number;
  defaultFee: number;
  avgDeliveryTime: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED' | 'FREE_DELIVERY';
  discountValue: number;
  minOrderValue: number;
  validUntil: string;
  active: boolean;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  pointsCost: number;
  rewardType: string;
  image: string;
}

export interface AIInsight {
  id: string;
  type: 'PROMOTION' | 'INVENTORY' | 'DEMAND' | 'CUSTOMER_RETENTION';
  title: string;
  message: string;
  actionText?: string;
  status: 'NEW' | 'APPLIED' | 'DISMISSED';
  createdAt: string;
}
