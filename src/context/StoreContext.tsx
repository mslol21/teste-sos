'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Tenant,
  Category,
  Product,
  CartItem,
  Order,
  OrderStatus,
  Coupon,
  LoyaltyReward,
  AIInsight,
  CartItemOption,
} from '@/types';
import {
  INITIAL_TENANT,
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_COUPONS,
  MOCK_LOYALTY_REWARDS,
  MOCK_AI_INSIGHTS,
  INITIAL_ORDERS,
} from '@/lib/mockData';

interface TableOrder {
  tableNumber: number;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'OPEN' | 'CLOSED';
}

interface StoreContextType {
  tenant: Tenant;
  categories: Category[];
  products: Product[];
  activeCategory: string | null;
  setActiveCategory: (catId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPromoOnly: boolean;
  setFilterPromoOnly: (val: boolean) => void;
  filterBestSellersOnly: boolean;
  setFilterBestSellersOnly: (val: boolean) => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, options: CartItemOption[], notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTotal: number;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  audioAlertEnabled: boolean;
  setAudioAlertEnabled: (val: boolean) => void;

  // Loyalty & Customer
  customerPoints: number;
  addLoyaltyPoints: (points: number) => void;
  redeemReward: (reward: LoyaltyReward) => boolean;

  // AI Insights
  aiInsights: AIInsight[];
  applyAIInsight: (id: string) => void;
  dismissAIInsight: (id: string) => void;

  // Waiter Tables
  tables: Record<number, TableOrder>;
  openTableOrder: (tableNumber: number, customerName: string) => void;
  addItemToTable: (tableNumber: number, item: CartItem) => void;
  closeTableOrder: (tableNumber: number) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [tenant] = useState<Tenant>(INITIAL_TENANT);
  const [categories] = useState<Category[]>(MOCK_CATEGORIES);
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPromoOnly, setFilterPromoOnly] = useState(false);
  const [filterBestSellersOnly, setFilterBestSellersOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['prod-xbacon-supremo']);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [audioAlertEnabled, setAudioAlertEnabled] = useState(true);
  const [customerPoints, setCustomerPoints] = useState(140);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(MOCK_AI_INSIGHTS);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [tables, setTables] = useState<Record<number, TableOrder>>({
    1: { tableNumber: 1, customerName: 'João Silva', items: [], total: 0, status: 'OPEN' },
    2: { tableNumber: 2, customerName: 'Ana Souza', items: [], total: 0, status: 'OPEN' },
    4: { tableNumber: 4, customerName: 'Lucas Mendes', items: [], total: 28.90, status: 'OPEN' },
  });

  // Load cart / favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('lanches_londrina_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedFavs = localStorage.getItem('lanches_londrina_favs');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
    } catch {
      // ignore SSR
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('lanches_londrina_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('lanches_londrina_favs', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number, options: CartItemOption[], notes = '') => {
    const basePrice = product.promoPrice && product.promoPrice < product.price ? product.promoPrice : product.price;
    const optionsPrice = options.reduce((acc, opt) => acc + opt.optionPrice, 0);
    const unitPrice = basePrice + optionsPrice;
    const totalPrice = unitPrice * quantity;

    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      product,
      quantity,
      selectedOptions: options,
      notes,
      unitPrice,
      totalPrice,
    };

    setCart((prev) => [...prev, newItem]);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId
          ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupon calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  
  let cartDeliveryFee = tenant.defaultFee;
  let cartDiscount = 0;

  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      cartDiscount = (cartSubtotal * appliedCoupon.discountValue) / 100;
    } else if (appliedCoupon.discountType === 'FIXED') {
      cartDiscount = appliedCoupon.discountValue;
    } else if (appliedCoupon.discountType === 'FREE_DELIVERY') {
      cartDiscount = cartDeliveryFee;
      cartDeliveryFee = 0;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + cartDeliveryFee - cartDiscount);

  const applyCoupon = (code: string) => {
    const found = MOCK_COUPONS.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active
    );
    if (!found) {
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }
    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Este cupom exige pedido mínimo de R$ ${found.minOrderValue.toFixed(2)}.`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: 'Cupom aplicado com sucesso!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Web Audio chime for new orders
  const playNewOrderAudio = () => {
    if (!audioAlertEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio autoplay policy blocked or not supported
    }
  };

  // Place Order
  const placeOrder = (orderData: Partial<Order>): Order => {
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: newId,
      tenantId: tenant.id,
      customerName: orderData.customerName || 'Cliente',
      customerPhone: orderData.customerPhone || '(43) 99999-9999',
      customerCpf: orderData.customerCpf,
      orderType: orderData.orderType || 'DELIVERY',
      status: 'NEW',
      deliveryAddress: orderData.deliveryAddress,
      number: orderData.number,
      neighborhood: orderData.neighborhood,
      zipCode: orderData.zipCode,
      reference: orderData.reference,
      tableNumber: orderData.tableNumber,
      paymentMethod: orderData.paymentMethod || 'PIX',
      changeFor: orderData.changeFor,
      subtotal: cartSubtotal,
      deliveryFee: orderData.orderType === 'DELIVERY' ? cartDeliveryFee : 0,
      discount: cartDiscount,
      total: orderData.orderType === 'DELIVERY' ? cartTotal : cartSubtotal - cartDiscount,
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: cart.map((item, idx) => ({
        id: `item-${newId}-${idx}`,
        productId: item.product.id,
        productName: item.product.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        notes: item.notes,
        totalPrice: item.totalPrice,
        options: item.selectedOptions,
      })),
    };

    setOrders((prev) => [newOrder, ...prev]);
    playNewOrderAudio();
    
    // Earn 1 loyalty point per R$ 1 spent
    const earnedPoints = Math.floor(newOrder.total);
    setCustomerPoints((prev) => prev + earnedPoints);

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status: newStatus, updatedAt: new Date().toISOString() }
          : ord
      )
    );
  };

  const addLoyaltyPoints = (points: number) => {
    setCustomerPoints((prev) => prev + points);
  };

  const redeemReward = (reward: LoyaltyReward) => {
    if (customerPoints < reward.pointsCost) return false;
    setCustomerPoints((prev) => prev - reward.pointsCost);
    return true;
  };

  const applyAIInsight = (id: string) => {
    setAiInsights((prev) =>
      prev.map((ins) => (ins.id === id ? { ...ins, status: 'APPLIED' } : ins))
    );
  };

  const dismissAIInsight = (id: string) => {
    setAiInsights((prev) =>
      prev.map((ins) => (ins.id === id ? { ...ins, status: 'DISMISSED' } : ins))
    );
  };

  // Waiter Tables management
  const openTableOrder = (tableNumber: number, customerName: string) => {
    setTables((prev) => ({
      ...prev,
      [tableNumber]: {
        tableNumber,
        customerName,
        items: [],
        total: 0,
        status: 'OPEN',
      },
    }));
  };

  const addItemToTable = (tableNumber: number, item: CartItem) => {
    setTables((prev) => {
      const existing = prev[tableNumber] || {
        tableNumber,
        customerName: `Mesa ${tableNumber}`,
        items: [],
        total: 0,
        status: 'OPEN',
      };
      const updatedItems = [...existing.items, item];
      const updatedTotal = updatedItems.reduce((acc, i) => acc + i.totalPrice, 0);
      return {
        ...prev,
        [tableNumber]: {
          ...existing,
          items: updatedItems,
          total: updatedTotal,
        },
      };
    });
  };

  const closeTableOrder = (tableNumber: number) => {
    setTables((prev) => {
      const copy = { ...prev };
      delete copy[tableNumber];
      return copy;
    });
  };

  return (
    <StoreContext.Provider
      value={{
        tenant,
        categories,
        products,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        filterPromoOnly,
        setFilterPromoOnly,
        filterBestSellersOnly,
        setFilterBestSellersOnly,
        favorites,
        toggleFavorite,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDiscount,
        cartDeliveryFee,
        cartTotal,

        orders,
        placeOrder,
        updateOrderStatus,
        audioAlertEnabled,
        setAudioAlertEnabled,

        customerPoints,
        addLoyaltyPoints,
        redeemReward,

        aiInsights,
        applyAIInsight,
        dismissAIInsight,

        tables,
        openTableOrder,
        addItemToTable,
        closeTableOrder,

        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
