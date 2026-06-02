import React, { useState } from 'react';
import { 
  INITIAL_USER, INITIAL_ADMIN, INITIAL_PRODUCTS, 
  INITIAL_ADDRESSES, INITIAL_ORDERS, INITIAL_ORDER_ITEMS, 
  INITIAL_COUPONS, INITIAL_DELIVERY_BOYS 
} from './dbSeed';
import { User, Product, Address, Coupon, DeliveryBoy, Order, OrderItem, StockNotification, CustomerNotification } from './types';
import { StoreFront } from './components/StoreFront';
import { AdminPanel } from './components/AdminPanel';
import { ArchitecturePanel } from './components/ArchitecturePanel';
import { Droplet, HelpCircle, LayoutDashboard, Sliders, PlayCircle, Eye, Globe, Bell, CheckCircle2, Truck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, getTranslation } from './utils/translate';

export default function App() {
  // Navigation mode between Customer App, Admin Panel, and System Architecture Console
  const [activePortalMode, setActivePortalMode] = useState<'store' | 'admin' | 'architecture'>('store');

  // Language translation selection
  const [language, setLanguage] = useState<Language>('mr');

  // Central Database Simulators (React States)
  const [dbUsers, setDbUsers] = useState<User[]>([INITIAL_USER, INITIAL_ADMIN]);
  const [dbProducts, setDbProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [dbAddresses, setDbAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [dbCoupons, setDbCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [dbDeliveryBoys, setDbDeliveryBoys] = useState<DeliveryBoy[]>(INITIAL_DELIVERY_BOYS);
  const [dbOrders, setDbOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [dbOrderItems, setDbOrderItems] = useState<OrderItem[]>(INITIAL_ORDER_ITEMS);
  const [dbStockNotifications, setDbStockNotifications] = useState<StockNotification[]>([
    {
      id: 'sn_1',
      product_id: 'prod_10l_cold',
      mobile_no: '9307319929',
      created_at: '2026-06-01T06:00:00Z',
      notified: false
    }
  ]);
  const [smsLogs, setSmsLogs] = useState<{ id: string; mobile: string; message: string; timestamp: string }[]>([]);

  // Customer notification list simulator
  const [dbNotifications, setDbNotifications] = useState<CustomerNotification[]>([
    {
      id: 'notif_seed_1',
      user_id: 'usr_001',
      order_id: 'SJ-10025',
      type: 'delivered',
      heading: '🎉 Order Delivered!',
      message: 'Your water order #SJ-10025 has been successfully delivered to your registered address.',
      read: true,
      created_at: '2026-05-31T18:30:00Z'
    }
  ]);

  // Toast notifications state
  const [toasts, setToasts] = useState<{ id: string; heading: string; message: string; type: 'out_for_delivery' | 'delivered' }[]>([]);

  const triggerToast = (heading: string, message: string, type: 'out_for_delivery' | 'delivered') => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, heading, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  // Mapped user credentials (logged in client, default is null)
  const [currentUserObj, setCurrentUserObj] = useState<User | null>(null);

  // Real-time Database cascade controllers:
  
  // 1. Placing order and decreasing inventory stock
  const handlePlaceOrder = (
    cartItems: { product: Product; quantity: number }[],
    addressId: string,
    couponCode: string,
    deliveryDate: string,
    deliverySlot: string,
    paymentMethod: 'upi' | 'card' | 'net_banking' | 'cod',
    deliveryCharge: number,
    discountAmount: number
  ) => {
    // Generate new Order ID sequentially
    const nextOrderIdNum = parseInt(dbOrders[0]?.id.split('-')[1] || '10025') + 1;
    const nextOrderId = `SJ-${nextOrderIdNum}`;
    
    // Choose active Delivery boy automatically (idle first)
    const availableBoy = dbDeliveryBoys.find(db => db.status === 'idle') || dbDeliveryBoys[0];

    const currentAddress = dbAddresses.find(a => a.id === addressId);
    const snapText = currentAddress 
      ? `${currentAddress.address_line}, ${currentAddress.city} - ${currentAddress.pincode}`
      : 'Near Grampanchayat, A/P - Ingali, Dist - Kolhapur';

    // Calculate total amount
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const totalPayable = subtotal - discountAmount + deliveryCharge;

    const newOrder: Order = {
      id: nextOrderId,
      user_id: currentUserObj?.id || 'usr_001',
      address_id: addressId,
      coupon_code: couponCode || undefined,
      discount_amount: discountAmount,
      delivery_charge: deliveryCharge,
      total_amount: totalPayable,
      status: 'placed',
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'cod' ? 'pending' : 'success',
      delivery_date: deliveryDate,
      delivery_slot: deliverySlot,
      delivery_boy_id: availableBoy.id,
      address_line_snapshot: snapText,
      created_at: new Date().toISOString()
    };

    // Prepare child order items (relational model mapping)
    const newItems: OrderItem[] = cartItems.map((item, index) => ({
      id: `item_${Date.now()}_${index}`,
      order_id: nextOrderId,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));

    // Cascade: Subtract stock values from products table dynamically
    const updatedProducts = dbProducts.map(p => {
      const purchased = cartItems.find(item => item.product.id === p.id);
      if (purchased) {
        return {
          ...p,
          stock: Math.max(0, p.stock - purchased.quantity)
        };
      }
      return p;
    });

    // Cascade: Toggle Delivery partner state to 'delivering'
    const updatedBoys = dbDeliveryBoys.map(db => {
      if (db.id === availableBoy.id) {
        return {
          ...db,
          status: 'delivering' as const
        };
      }
      return db;
    });

    setDbProducts(updatedProducts);
    setDbDeliveryBoys(updatedBoys);
    setDbOrders([newOrder, ...dbOrders]);
    setDbOrderItems([...newItems, ...dbOrderItems]);

    return newOrder;
  };

  // 2. Override Order Status from Administration portal
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    // Find original order status before update
    const originalOrder = dbOrders.find(o => o.id === orderId);
    const oldStatus = originalOrder ? originalOrder.status : null;

    // Determine status and potentially release driver boy if status delivered
    const updatedOrders = dbOrders.map(o => {
      if (o.id === orderId) {
        return { ...o, status };
      }
      return o;
    });

    // Cascade: If order is delivered, set associated delivery partner back to idle!
    let updatedBoys = dbDeliveryBoys;
    if (status === 'delivered') {
      const order = dbOrders.find(o => o.id === orderId);
      if (order && order.delivery_boy_id) {
        updatedBoys = dbDeliveryBoys.map(db => {
          if (db.id === order.delivery_boy_id) {
            return { ...db, status: 'idle' as const };
          }
          return db;
        });
      }
    }

    setDbOrders(updatedOrders);
    setDbDeliveryBoys(updatedBoys);

    // If order was 'placed' and changes to 'out_for_delivery' or 'delivered'
    if (originalOrder && oldStatus === 'placed' && (status === 'out_for_delivery' || status === 'delivered')) {
      const heading = status === 'out_for_delivery' ? '🛵 Order Dispatched!' : '🎉 Order Delivered!';
      const message = status === 'out_for_delivery'
        ? `Your pure water order #${orderId} has been dispatched and is out for delivery!`
        : `Your water order #${orderId} has been successfully delivered. Thank you!`;

      const newNotif: CustomerNotification = {
        id: `notif_${Date.now()}`,
        user_id: originalOrder.user_id,
        order_id: orderId,
        type: status,
        heading,
        message,
        read: false,
        created_at: new Date().toISOString()
      };

      setDbNotifications(prev => [newNotif, ...prev]);
      triggerToast(heading, message, status);
    }
  };

  // 3. Update Product stock variables manually from admin and trigger SMS alerts if previously out of stock
  const handleUpdateProductStock = (productId: string, newStock: number) => {
    const targetProduct = dbProducts.find(p => p.id === productId);
    const wasOutOfStock = targetProduct ? targetProduct.stock === 0 : false;

    setDbProducts(dbProducts.map(p => p.id === productId ? { ...p, stock: newStock } : p));

    // If stock goes from 0 -> positive, find matching notifications and trigger SMS dispatch
    if (wasOutOfStock && newStock > 0 && targetProduct) {
      const matchingNotifs = dbStockNotifications.filter(n => n.product_id === productId && !n.notified);
      if (matchingNotifs.length > 0) {
        // Mark as notified in notifications table
        setDbStockNotifications(prev => prev.map(n => 
          (n.product_id === productId && !n.notified) ? { ...n, notified: true } : n
        ));

        // Create SMS logs
        const newSMSAlerts = matchingNotifs.map((notif, idx) => {
          const formattedMessage = `📢 *श्रीराम जल*\n\nनमस्कार,\n\nआपण मागवलेला *${targetProduct.name} (${targetProduct.capacity})* आता पुन्हा उपलब्ध झाला आहे.\n\nऑर्डर करण्यासाठी वेबसाइटला भेट द्या.\n\nधन्यवाद,\n*श्रीराम जल*`;
          return {
            id: `sms_${Date.now()}_${idx}`,
            mobile: notif.mobile_no,
            message: formattedMessage,
            timestamp: new Date().toISOString()
          };
        });

        setSmsLogs(prev => [...newSMSAlerts, ...prev]);
        
        // Show persistent success notification via window logs
        console.log(`📡 [SMS Gateway] Sent ${newSMSAlerts.length} Messages for ${targetProduct.name}`);
      }
    }
  };

  // Add stock notification entry
  const handleAddStockNotification = (productId: string, mobileNo: string) => {
    const newNotif: StockNotification = {
      id: `sn_${Date.now()}`,
      product_id: productId,
      mobile_no: mobileNo,
      created_at: new Date().toISOString().split('T')[0],
      notified: false
    };
    setDbStockNotifications(prev => [newNotif, ...prev]);
  };

  // 4. Update Product pricing manually from admin
  const handleUpdateProductPrice = (productId: string, newPrice: number) => {
    setDbProducts(dbProducts.map(p => p.id === productId ? { ...p, price: newPrice } : p));
  };

  // 5. Add coupons manually
  const handleAddCoupon = (code: string, pct: number, minAmt: number, desc: string) => {
    const newCoupon: Coupon = {
      id: `coup_${Date.now()}`,
      code: code.toUpperCase(),
      discount_percent: pct,
      min_amount: minAmt,
      is_active: true,
      description: desc || `Flat ${pct}% off on organic can reserves`
    };
    setDbCoupons([...dbCoupons, newCoupon]);
  };

  // 6. Delete coupons
  const handleDeleteCoupon = (id: string) => {
    setDbCoupons(dbCoupons.filter(c => c.id !== id));
  };

  // 7. Toggle coupon active state
  const handleToggleCouponStatus = (id: string) => {
    setDbCoupons(dbCoupons.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
  };

  // 8. Change Driver status (active vs resting)
  const handleToggleDriverStatus = (id: string) => {
    setDbDeliveryBoys(dbDeliveryBoys.map(db => {
      if (db.id === id) {
        return {
          ...db,
          status: db.status === 'idle' ? 'delivering' : 'idle'
        };
      }
      return db;
    }));
  };

  // 9. Register a new user-address from Google maps coordinates selector
  const handleAddAddress = (label: string, line: string, city: string, state: string, pin: string, lat: number, lng: number) => {
    const newAddress: Address = {
      id: `addr_${Date.now()}`,
      user_id: currentUserObj?.id || 'usr_001',
      label,
      address_line: line,
      city,
      state,
      pincode: pin,
      lat,
      lng
    };
    setDbAddresses([...dbAddresses, newAddress]);
    return newAddress;
  };

  // 10. Execute reorders dynamically
  const handleReorder = (orderId: string) => {
    // Find all items in original order
    const originalItems = dbOrderItems.filter(item => item.order_id === orderId);
    if (originalItems.length === 0) return;

    // We can show feedback here
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col font-sans relative antialiasedSelection">
      
      {/* Main active platform module */}
      <div className="flex-grow bg-slate-50">
        {activePortalMode === 'store' && (
          <StoreFront
            products={dbProducts}
            addresses={dbAddresses}
            coupons={dbCoupons}
            deliveryBoys={dbDeliveryBoys}
            orders={dbOrders}
            onPlaceOrder={handlePlaceOrder}
            onAddAddress={handleAddAddress}
            onReorder={handleReorder}
            currentUser={currentUserObj}
            setCurrentUser={setCurrentUserObj}
            language={language}
            setLanguage={setLanguage}
            dbUsers={dbUsers}
            setDbUsers={setDbUsers}
            activePortalMode={activePortalMode}
            setActivePortalMode={setActivePortalMode}
            stockNotifications={dbStockNotifications}
            onAddStockNotification={handleAddStockNotification}
            smsLogs={smsLogs}
            customerNotifications={dbNotifications}
            setCustomerNotifications={setDbNotifications}
          />
        )}

        {activePortalMode === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminPanel
              products={dbProducts}
              orders={dbOrders}
              orderItems={dbOrderItems}
              addresses={dbAddresses}
              coupons={dbCoupons}
              deliveryBoys={dbDeliveryBoys}
              users={dbUsers}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onUpdateProductStock={handleUpdateProductStock}
              onUpdateProductPrice={handleUpdateProductPrice}
              onAddCoupon={handleAddCoupon}
              onDeleteCoupon={handleDeleteCoupon}
              onToggleCouponStatus={handleToggleCouponStatus}
              onToggleDriverStatus={handleToggleDriverStatus}
              language={language}
              currentUser={currentUserObj}
              setCurrentUser={setCurrentUserObj}
              activePortalMode={activePortalMode}
              setActivePortalMode={setActivePortalMode}
              stockNotifications={dbStockNotifications}
              setStockNotifications={setDbStockNotifications}
              smsLogs={smsLogs}
            />
          </div>
        )}

        {activePortalMode === 'architecture' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ArchitecturePanel
              users={dbUsers}
              products={dbProducts}
              orders={dbOrders}
              orderItems={dbOrderItems}
              addresses={dbAddresses}
              coupons={dbCoupons}
              deliveryBoys={dbDeliveryBoys}
              activeTab={activePortalMode}
              setActiveTab={(mode) => setActivePortalMode(mode as any)}
            />
          </div>
        )}
      </div>

      {/* Floating System-Wide Toasts Overlay for Customer Status Changes */}
      <div className="fixed bottom-5 right-5 z-50 space-y-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-sky-100 p-4 flex items-start gap-3 pointer-events-auto shadow-blue-500/10"
            >
              <div className={`p-2 rounded-xl flex-shrink-0 ${
                toast.type === 'out_for_delivery' ? 'bg-cyan-50 text-cyan-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {toast.type === 'out_for_delivery' ? <Truck className="w-5 h-5 animate-bounce" /> : <CheckCircle2 className="w-5 h-5 animate-pulse" />}
              </div>
              <div className="flex-1 text-left min-w-0">
                <h4 className="text-xs font-extrabold text-slate-800">{toast.heading}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{toast.message}</p>
                <div className="flex items-center space-x-1.5 mt-1">
                  <span className="text-[8px] font-bold uppercase font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 animate-pulse">Live Update</span>
                  <span className="text-[8px] text-slate-400 font-mono">Just now</span>
                </div>
              </div>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
