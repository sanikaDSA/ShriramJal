export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  avatar?: string;
  password?: string;
  whatsapp_updates?: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  type: 'normal' | 'cold';
  capacity: '20L' | '10L' | '5L' | '1L';
  category: string; // e.g. "Can", "Bottle"
  price: number;
  stock: number;
  image: string;
  description: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string; // "Home" | "Office" | "Other"
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  min_amount: number;
  is_active: boolean;
  description: string;
}

export interface DeliveryBoy {
  id: string;
  name: string;
  phone: string;
  status: 'idle' | 'delivering';
  vehicle_no: string;
  rating: number;
  current_lat?: number;
  current_lng?: number;
}

export interface Order {
  id: string;
  user_id: string;
  address_id: string;
  coupon_code?: string;
  discount_amount: number;
  delivery_charge: number;
  total_amount: number;
  status: 'placed' | 'confirmed' | 'out_for_delivery' | 'delivered';
  payment_method: 'upi' | 'card' | 'net_banking' | 'cod';
  payment_status: 'pending' | 'success' | 'failed';
  delivery_date: string;
  delivery_slot: string;
  delivery_boy_id?: string;
  address_line_snapshot?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface StockNotification {
  id: string;
  product_id: string;
  mobile_no: string;
  created_at: string;
  notified?: boolean; // track if SMS notification was triggered
}

export interface CustomerNotification {
  id: string;
  user_id: string;
  order_id: string;
  type: 'out_for_delivery' | 'delivered';
  heading: string;
  message: string;
  read: boolean;
  created_at: string;
}

