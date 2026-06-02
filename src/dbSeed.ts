import { User, Product, Address, Coupon, DeliveryBoy, Order, OrderItem, Review } from './types';

export const INITIAL_USER: User = {
  id: 'usr_001',
  name: 'Sanika Gurav',
  email: 'sanikagurav6530@gmail.com',
  phone: '9307319929',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
  password: 'user123',
  whatsapp_updates: true,
  created_at: '2026-05-15T09:00:00Z'
};

export const INITIAL_ADMIN: User = {
  id: 'usr_002',
  name: 'Admin Panel',
  email: 'admin@shriramjal.com',
  phone: '8888888888',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
  password: 'admin123',
  created_at: '2026-05-01T10:00:00Z'
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_20l_normal',
    name: '20L नॉर्मल पाणी',
    type: 'normal',
    capacity: '20L',
    category: 'Can',
    price: 40,
    stock: 400,
    image: 'https://images.unsplash.com/photo-1608889174633-8326af5f0168?auto=format&fit=crop&q=80&w=600',
    description: 'ऑक्सिजन-फिल्टर केलेले, बहु-स्तरीय रिव्हर्स ऑस्मोसिस (RO) शुद्ध पिण्याचे पाणी. घरगुती स्वयंपाक आणि पिण्याच्या रोजच्या वापरासाठी सर्वोत्तम.'
  },
  {
    id: 'prod_20l_cold',
    name: '20L थंड पाणी',
    type: 'cold',
    capacity: '20L',
    category: 'Can',
    price: 50,
    stock: 250,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600',
    description: 'थंडगार आणि ताजेतवाने पाणी (4-8°C). उन्हाळ्याच्या दिवसांत, कार्यालयात आणि कार्यक्रमांमध्ये वापरण्यासाठी अत्यंत सोयीस्कर.'
  },
  {
    id: 'prod_10l_normal',
    name: '10L नॉर्मल पाणी',
    type: 'normal',
    capacity: '10L',
    category: 'Can',
    price: 25,
    stock: 180,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    description: 'कमी जागेत बसणारे १० लिटरचे कॉम्पॅक्ट हँडल असलेले कॅन. छोट्या कुटुंबांसाठी आणि प्रवासासाठी अतिशय उपयुक्त.'
  },
  {
    id: 'prod_10l_cold',
    name: '10L थंड पाणी',
    type: 'cold',
    capacity: '10L',
    category: 'Can',
    price: 35,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600',
    description: 'थंडगार आणि ताजेतवाने १० लिटर पाणी. लहान कार्यालये आणि कौटुंबिक छोट्या कार्यक्रमांसाठी उत्कृष्ट पर्याय.'
  }
];

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr_001',
    user_id: 'usr_001',
    label: 'Home',
    address_line: 'Flat No 402, Shivajinagar',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    lat: 18.5308,
    lng: 73.8475
  },
  {
    id: 'addr_002',
    user_id: 'usr_001',
    label: 'Office',
    address_line: 'Senapati Bapat Road, Near ICC Tech Park',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411016',
    lat: 18.5362,
    lng: 73.8298
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup_001',
    code: 'JAL20',
    discount_percent: 20,
    min_amount: 100,
    is_active: true,
    description: 'Get 20% off on premium water orders over ₹100'
  },
  {
    id: 'coup_002',
    code: 'PURE35',
    discount_percent: 35,
    min_amount: 200,
    is_active: true,
    description: 'Healthy Life special! Grab an incredible 35% off on orders above ₹200'
  },
  {
    id: 'coup_003',
    code: 'WELCOME',
    discount_percent: 10,
    min_amount: 0,
    is_active: true,
    description: 'Flat 10% discount to welcome you to premium water hydration'
  },
  {
    id: 'coup_004',
    code: 'ADMIN50',
    discount_percent: 50,
    min_amount: 50,
    is_active: false,
    description: 'Executive internal coupon (Inactive)'
  }
];

export const INITIAL_DELIVERY_BOYS: DeliveryBoy[] = [
  {
    id: 'db_001',
    name: 'Rajesh Kumar',
    phone: '9012345678',
    status: 'delivering',
    vehicle_no: 'MH-12-JN-4512',
    rating: 4.8,
    current_lat: 18.5350,
    current_lng: 73.8250
  },
  {
    id: 'db_002',
    name: 'Anil Shinde',
    phone: '9123456789',
    status: 'idle',
    vehicle_no: 'MH-12-KL-8901',
    rating: 4.7,
    current_lat: 18.5401,
    current_lng: 73.8310
  },
  {
    id: 'db_003',
    name: 'Sameer Gore',
    phone: '9234567890',
    status: 'idle',
    vehicle_no: 'MH-12-RT-2345',
    rating: 4.9,
    current_lat: 18.5280,
    current_lng: 73.8150
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'SJ-10025',
    user_id: 'usr_001',
    address_id: 'addr_001',
    coupon_code: 'JAL20',
    discount_amount: 32,
    delivery_charge: 20,
    total_amount: 148,
    status: 'out_for_delivery',
    payment_method: 'upi',
    payment_status: 'success',
    delivery_date: '2026-06-01',
    delivery_slot: '08:00 AM - 11:00 AM',
    delivery_boy_id: 'db_001',
    address_line_snapshot: 'Near Grampanchayat, A/P - Ingali, Tal- Hatkanangle, Kolhapur',
    created_at: '2026-06-01T04:30:00Z'
  },
  {
    id: 'SJ-10024',
    user_id: 'usr_001',
    address_id: 'addr_002',
    delivery_charge: 30,
    discount_amount: 0,
    total_amount: 110,
    status: 'delivered',
    payment_method: 'card',
    payment_status: 'success',
    delivery_date: '2026-05-30',
    delivery_slot: '11:00 AM - 02:00 PM',
    delivery_boy_id: 'db_002',
    address_line_snapshot: 'Main Road Water Hub, A/P - Ingali, Tal- Hatkanangle, Kolhapur',
    created_at: '2026-05-30T10:15:00Z'
  },
  {
    id: 'SJ-10023',
    user_id: 'usr_001',
    address_id: 'addr_001',
    coupon_code: 'WELCOME',
    discount_amount: 8,
    delivery_charge: 20,
    total_amount: 92,
    status: 'delivered',
    payment_method: 'cod',
    payment_status: 'success',
    delivery_date: '2026-05-28',
    delivery_slot: '05:00 PM - 08:00 PM',
    delivery_boy_id: 'db_003',
    address_line_snapshot: 'Near Grampanchayat, A/P - Ingali, Tal- Hatkanangle, Kolhapur',
    created_at: '2026-05-28T16:00:00Z'
  }
];

export const INITIAL_ORDER_ITEMS: OrderItem[] = [
  // SJ-10025 items
  {
    id: 'item_001',
    order_id: 'SJ-10025',
    product_id: 'prod_20l_cold',
    quantity: 2,
    price: 50
  },
  {
    id: 'item_002',
    order_id: 'SJ-10025',
    product_id: 'prod_20l_normal',
    quantity: 1,
    price: 40
  },
  {
    id: 'item_003',
    order_id: 'SJ-10025',
    product_id: 'prod_1l_single',
    quantity: 2,
    price: 15
  },
  // SJ-10024 items
  {
    id: 'item_004',
    order_id: 'SJ-10024',
    product_id: 'prod_20l_normal',
    quantity: 2,
    price: 40
  },
  // SJ-10023 items
  {
    id: 'item_005',
    order_id: 'SJ-10023',
    product_id: 'prod_20l_cold',
    quantity: 1,
    price: 50
  },
  {
    id: 'item_006',
    order_id: 'SJ-10023',
    product_id: 'prod_10l_normal',
    quantity: 1,
    price: 30
  }
];

export const TESTIMONIALS: Review[] = [
  {
    id: 'rev_1',
    user_name: 'Anjali Sharma',
    rating: 5,
    comment: 'The 20L Cold Can is perfect for our monthly office discussions. Outstandingly hygienic casing, on-time deliveries, and a highly courteous delivery partner!',
    date: '3 days ago'
  },
  {
    id: 'rev_2',
    user_name: 'Dr. Vivek Ranade',
    rating: 5,
    comment: 'Shriram Jal is my absolute go-to water delivery partner. Multiple filtration steps guarantee strict medical-grade purity. Love and recommend the 5L easy countertops cans values!',
    date: '1 week ago'
  },
  {
    id: 'rev_3',
    user_name: 'Ketan Deshmukh',
    rating: 4,
    comment: 'Top tier service in Kolhapur! Booking through their responsive checkout screen takes just minutes. Applying JAL20 saves us on every cycle. Essential product is highly persistent.',
    date: '2 weeks ago'
  }
];

export const DELHI_COVERAGE_AREAS = [
  'Kothrud', 'Senapati Bapat Road', 'Hinjawadi', 'Baner', 'Aundh', 'Shivajinagar', 'Deccan Gymkhana', 'Wakad'
];
