import React, { useState } from 'react';
import { 
  MapPin, ShoppingCart, ShieldCheck, Truck, Droplet, User as UserIcon, 
  ChevronRight, Star, Phone, Clock, Plus, Minus, Tag, 
  CheckCircle2, RefreshCw, ClipboardList, LogOut, KeyRound, UserPlus, Globe, Bell, Camera, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Address, Coupon, Order, OrderItem, Review, DeliveryBoy, User, StockNotification, CustomerNotification } from '../types';
import { WaterCanVisual } from './WaterVisuals';
import { TESTIMONIALS } from '../dbSeed';
import { Language, getTranslation } from '../utils/translate';
import bannerImg from '../assets/images/shriram_jal_banner_1780293387585.png';
import loginSideImg from '../assets/images/login_side_img_1780302726821.png';

// Kolhapur Landmark coordinates for Map simulation
const KOLHAPUR_HOTSPOTS = [
  { name: 'Shirol Road, Ingali', lat: 16.6961, lng: 74.4644, desc: 'Ingali Grampanchayat cluster center' },
  { name: 'Hatkanangle Station Junction', lat: 16.7441, lng: 74.3431, desc: 'Hatkanangle commercial corridor hub' },
  { name: 'Ichalkaranji Textile Park', lat: 16.6934, lng: 74.4619, desc: 'Ichalkaranji premium industrial sector' },
  { name: 'Shirol Bypass Chowk', lat: 16.6850, lng: 74.5950, desc: 'Shirol logistics access pipeline' },
  { name: 'Jaysingpur Central Market', lat: 16.7820, lng: 74.5620, desc: 'Jaysingpur city trading node' }
];

interface StoreFrontProps {
  products: Product[];
  addresses: Address[];
  coupons: Coupon[];
  deliveryBoys: DeliveryBoy[];
  orders: Order[];
  onPlaceOrder: (
    cartItems: { product: Product; quantity: number }[],
    addressId: string,
    couponCode: string,
    deliveryDate: string,
    deliverySlot: string,
    paymentMethod: 'upi' | 'card' | 'net_banking' | 'cod',
    deliveryCharge: number,
    discountAmount: number
  ) => Order;
  onAddAddress: (label: string, line: string, city: string, state: string, pin: string, lat: number, lng: number) => Address;
  onReorder: (orderId: string) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  dbUsers?: User[];
  setDbUsers?: React.Dispatch<React.SetStateAction<User[]>>;
  activePortalMode?: 'store' | 'admin' | 'architecture';
  setActivePortalMode?: (mode: 'store' | 'admin' | 'architecture') => void;
  stockNotifications?: StockNotification[];
  onAddStockNotification?: (productId: string, mobileNo: string) => void;
  smsLogs?: any[];
  customerNotifications?: CustomerNotification[];
  setCustomerNotifications?: React.Dispatch<React.SetStateAction<CustomerNotification[]>>;
}

export const StoreFront: React.FC<StoreFrontProps> = ({
  products,
  addresses,
  coupons,
  deliveryBoys,
  orders,
  onPlaceOrder,
  onAddAddress,
  onReorder,
  currentUser,
  setCurrentUser,
  language,
  setLanguage,
  dbUsers = [],
  setDbUsers,
  activePortalMode = 'store',
  setActivePortalMode,
  stockNotifications = [],
  onAddStockNotification,
  smsLogs = [],
  customerNotifications = [],
  setCustomerNotifications
}) => {
  // Navigation states inside Store
  const [currentPage, setCurrentPage] = useState<'home' | 'products' | 'cart' | 'checkout' | 'confirmation' | 'tracking' | 'dashboard'>('home');
  const [activeNotifyProductId, setActiveNotifyProductId] = useState<string | null>(null);
  const [notifyMobile, setNotifyMobile] = useState<string>('');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<'all' | 'normal' | 'cold'>('all');
  const [selectedProductCapacity, setSelectedProductCapacity] = useState<'all' | '20L' | '10L' | '5L' | '1L'>('all');
  
  // Checkout States
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || '');
  const [deliveryDate, setDeliveryDate] = useState<string>('2026-06-02');
  const [deliverySlot, setDeliverySlot] = useState<string>('08:00 AM - 11:00 AM');
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'net_banking' | 'cod'>('upi');
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccess, setCouponSuccess] = useState<string>('');

  // Address creation states
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [newAddrLabel, setNewAddrLabel] = useState<string>('Home');
  const [newAddrLine, setNewAddrLine] = useState<string>('');
  const [newAddrCity, setNewAddrCity] = useState<string>('Kolhapur');
  const [newAddrState, setNewAddrState] = useState<string>('Maharashtra');
  const [newAddrPincode, setNewAddrPincode] = useState<string>('416115');
  const [newAddrLat, setNewAddrLat] = useState<number>(16.6961);
  const [newAddrLng, setNewAddrLng] = useState<number>(74.4644);

  // Razorpay Gateway status
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string>('');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState<boolean>(false);

  // User Authentication States
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authName, setAuthName] = useState<string>('');
  const [authPhone, setAuthPhone] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [authRedirectTarget, setAuthRedirectTarget] = useState<string | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState<boolean>(false);
  const [authConfirmPassword, setAuthConfirmPassword] = useState<string>('');
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState<boolean>(false);
  const [authRememberMe, setAuthRememberMe] = useState<boolean>(true);
  const [authTermsAccepted, setAuthTermsAccepted] = useState<boolean>(true);
  const [isEditingAvatar, setIsEditingAvatar] = useState<boolean>(false);
  const [inputAvatarUrl, setInputAvatarUrl] = useState<string>('');

  const t = (key: string) => getTranslation(key, language);

  const handleAuthSubmit = (e: React.FormEvent, directMode?: 'login' | 'signup') => {
    e.preventDefault();
    setAuthError('');
    const activeMode = directMode || authMode;

    if (activeMode === 'login') {
      const trimmedId = loginEmailOrPhone.trim();
      const trimmedPass = loginPassword.trim();
      if (!trimmedId) {
        setAuthError(language === 'en' ? 'Please enter your mobile number or email.' : 'कृपया तुमचा मोबाईल नंबर किंवा ईमेल प्रविष्ट करा.');
        return;
      }
      if (!trimmedPass) {
        setAuthError(language === 'en' ? 'Please enter your password.' : 'कृपया तुमचा पासवर्ड प्रविष्ट करा.');
        return;
      }

      const user = dbUsers.find(
        u => u.email.toLowerCase() === trimmedId.toLowerCase() || u.phone === trimmedId
      );
      if (!user) {
        setAuthError(language === 'en' ? 'Account not registered. Please register first!' : 'या क्रमांकाने खात्याची नोंदणी झालेली नाही. कृपया प्रथम नोंदणी (Register) करा.');
        return;
      }
      if (user.password && user.password !== trimmedPass) {
        setAuthError(language === 'en' ? 'Incorrect password. Please try again.' : 'पासवर्ड चुकीचा आहे. कृपया पुन्हा प्रयत्न करा.');
        return;
      }

      setCurrentUser(user);
      setShowAuthModal(false);
      setLoginEmailOrPhone('');
      setLoginPassword('');
      if (authRedirectTarget) {
        setCurrentPage(authRedirectTarget as any);
        setAuthRedirectTarget(null);
      } else {
        setCurrentPage('home');
      }
    } else {
      const trimmedName = authName.trim();
      const trimmedPhone = authPhone.trim();
      const trimmedEmail = authEmail.trim();
      const trimmedPassword = authPassword.trim();
      const trimmedConfirmPassword = authConfirmPassword.trim();

      if (!trimmedName) {
        setAuthError(language === 'en' ? 'Full name is compulsory.' : 'कृपया तुमचे संपूर्ण नाव प्रविष्ट करा.');
        return;
      }
      if (trimmedName.length < 3) {
        setAuthError(language === 'en' ? 'Name must be at least 3 letters long.' : 'नाव किमान ३ अक्षरांचे असणे आवश्यक आहे.');
        return;
      }

      if (!trimmedPhone) {
        setAuthError(language === 'en' ? 'Mobile number is compulsory.' : 'कृपया तुमचा मोबाईल नंबर प्रविष्ट करा.');
        return;
      }
      // Validating Mobile Number (10 digit Indian number)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(trimmedPhone)) {
        setAuthError(language === 'en' ? 'Please enter a valid 10-digit mobile number.' : 'कृपया १० अंकी वैध मोबाईल नंबर प्रविष्ट करा.');
        return;
      }

      if (!trimmedPassword) {
        setAuthError(language === 'en' ? 'Password is required.' : 'कृपया पासवर्ड प्रविष्ट करा.');
        return;
      }
      // Validating Password length (minimum 4 characters)
      if (trimmedPassword.length < 4) {
        setAuthError(language === 'en' ? 'Password must be at least 4 characters long.' : 'पासवर्ड किमान ४ अक्षरांचा असावा.');
        return;
      }

      if (trimmedPassword !== trimmedConfirmPassword) {
        setAuthError(language === 'en' ? 'Passwords do not match!' : 'पासवर्ड जुळत नाहीत!');
        return;
      }

      if (!authTermsAccepted) {
        setAuthError(language === 'en' ? 'Please accept the Terms and Conditions to proceed.' : 'कृपया पुढे जाण्यासाठी नियम आणि अटी स्वीकारा.');
        return;
      }

      // Check if user already exists
      const exists = dbUsers.find(
        u => (trimmedEmail && u.email.toLowerCase() === trimmedEmail.toLowerCase()) || u.phone === trimmedPhone
      );
      if (exists) {
        setAuthError(language === 'en' ? 'This Mobile Number or Email is already registered.' : 'हा मोबाईल नंबर किंवा ईमेल आधीपासूनच नोंदणीकृत आहे.');
        return;
      }

      const nextUserId = `usr_${Date.now()}`;
      const newUser: User = {
        id: nextUserId,
        name: trimmedName,
        email: trimmedEmail || `${trimmedPhone}@shriramjal.com`,
        phone: trimmedPhone,
        role: 'customer',
        password: trimmedPassword,
        whatsapp_updates: true,
        avatar: "",
        created_at: new Date().toISOString()
      };

      if (setDbUsers) {
        setDbUsers([...dbUsers, newUser]);
      }
      setCurrentUser(newUser);
      setShowAuthModal(false);
      setAuthName('');
      setAuthEmail('');
      setAuthPhone('');
      setAuthPassword('');
      setAuthConfirmPassword('');
      if (authRedirectTarget) {
        setCurrentPage(authRedirectTarget as any);
        setAuthRedirectTarget(null);
      } else {
        setCurrentPage('home');
      }
    }
  };

  // Cart Helper functions
  const handleAddToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const next = item.quantity + delta;
        return next > 0 ? { ...item, quantity: next } : null;
      }
      return item;
    }).filter(Boolean) as { product: Product; quantity: number }[]);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    const codeObj = coupons.find(c => c.code.toUpperCase() === couponInput.toUpperCase());
    
    if (!codeObj) {
      setCouponError('Invalid Coupon Code! Please try JAL20, PURE35, or WELCOME.');
      setAppliedCoupon(null);
      return;
    }
    if (!codeObj.is_active) {
      setCouponError('This coupon is currently expired or disabled.');
      setAppliedCoupon(null);
      return;
    }
    
    const sub = calculateSubtotal();
    if (sub < codeObj.min_amount) {
      setCouponError(`This coupon requires a minimum subtotal of ₹${codeObj.min_amount}.`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(codeObj);
    setCouponSuccess(`Promocode Applied! You saved ${codeObj.discount_percent}% off your cart total!`);
  };

  // Coordinates clicking for Map simulation
  const handleSelectHotspotOnMap = (spot: typeof KOLHAPUR_HOTSPOTS[0]) => {
    setNewAddrLine(`Opposite Spot, near ${spot.name}`);
    setNewAddrLat(spot.lat);
    setNewAddrLng(spot.lng);
  };

  const handleSaveAddr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLine || !newAddrPincode) {
      alert('Please fill in complete address line and pincode details.');
      return;
    }
    const created = onAddAddress(
      newAddrLabel,
      newAddrLine,
      newAddrCity,
      newAddrState,
      newAddrPincode,
      newAddrLat,
      newAddrLng
    );
    setSelectedAddressId(created.id);
    setShowAddressModal(false);
    // ResetAddrForm
    setNewAddrLine('');
    setNewAddrPincode('');
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) return;
    if (!selectedAddressId) {
      alert('Please select or register a delivery address to proceed.');
      return;
    }

    setIsProcessingPayment(true);
    
    // Simulate Razorpay gateway payload injection
    setTimeout(() => {
      const sub = calculateSubtotal();
      const discount = appliedCoupon ? Math.round((sub * appliedCoupon.discount_percent) / 100) : 0;
      const deliveryCharge = sub > 150 ? 0 : 20;

      const orderCreated = onPlaceOrder(
        cart,
        selectedAddressId,
        appliedCoupon?.code || '',
        deliveryDate,
        deliverySlot,
        paymentMethod,
        deliveryCharge,
        discount
      );

      setLastPlacedOrder(orderCreated);
      setActiveTrackingOrderId(orderCreated.id);
      setIsProcessingPayment(false);
      setCart([]); // Clear Cart
      setAppliedCoupon(null);
      setCouponInput('');
      setCurrentPage('confirmation');
    }, 2200); // realistic payment loading
  };

  const handleTriggerReorder = (orderId: string) => {
    onReorder(orderId);
    // Fetch details of reordered items to hydrate customer cart
    const originalOrder = orders.find(o => o.id === orderId);
    if (originalOrder) {
      alert(`Order ${orderId} has been loaded into your cart & re-seeded for processing! Redirecting to cart.`);
      // Add items back
      setCurrentPage('cart');
    }
  };

  // Filtered Products catalog
  const filteredProducts = products.filter(p => {
    const typeMatch = selectedProductType === 'all' || p.type === selectedProductType;
    const sizeMatch = selectedProductCapacity === 'all' || p.capacity === selectedProductCapacity;
    return typeMatch && sizeMatch;
  });

  // Calculate final totals for rendering
  const subTotal = calculateSubtotal();
  const discountAmt = appliedCoupon ? Math.round((subTotal * appliedCoupon.discount_percent) / 100) : 0;
  const deliveryChargeAmt = subTotal > 150 ? 0 : 20;
  const grandTotalAmt = Math.max(0, subTotal - discountAmt + deliveryChargeAmt);

  // Active tracking order calculations
  const trackingOrder = orders.find(o => o.id === (activeTrackingOrderId || 'SJ-10025'));
  const trackingBoy = deliveryBoys.find(db => db.id === trackingOrder?.delivery_boy_id) || deliveryBoys[0];

  // Notifications for the currently logged-in user
  const userNotifs = customerNotifications.filter(n => n.user_id === currentUser?.id);
  const unreadCount = userNotifs.filter(n => !n.read).length;

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-800">
      
      {/* Customer Web Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-3.5 flex items-center justify-between gap-1.5 sm:gap-4 select-none">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-shrink-0" onClick={() => setCurrentPage('home')}>
            <div className="bg-blue-600 p-1.5 sm:p-2 rounded-xl text-white shadow-md shadow-blue-500/20 active:scale-95 transition-transform flex-shrink-0">
              <Droplet className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-lg md:text-xl font-extrabold text-blue-900 tracking-tight block whitespace-nowrap leading-tight">{t('brand_title')}</span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-wider font-bold text-blue-500 font-mono block whitespace-nowrap leading-none mt-0.5">{t('brand_tagline')}</span>
            </div>
          </div>

          {/* Desktop Central Menu links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`transition-colors ${currentPage === 'home' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'} cursor-pointer`}
            >
              {t('home')}
            </button>
            <button 
              onClick={() => setCurrentPage('products')}
              className={`transition-colors ${currentPage === 'products' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'} cursor-pointer`}
            >
              {t('order_cans')}
            </button>
            <button 
              onClick={() => {
                setCurrentPage('home');
                setTimeout(() => {
                  const el = document.getElementById('why-choose-us');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              {t('about_us')}
            </button>
            <button 
              onClick={() => {
                setCurrentPage('home');
                setTimeout(() => {
                  const el = document.getElementById('footer-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              {t('contact_us')}
            </button>
            
            <div className="flex items-center space-x-1 text-xs text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-full border border-blue-100 font-medium font-sans">
              <MapPin className="w-3.5 h-3.5 fill-blue-100" />
              <span>{language === 'en' ? 'Ingali, Kolhapur' : 'इंगळी, कोल्हापूर'}</span>
            </div>

            {currentUser?.role === 'admin' && setActivePortalMode && (
              <button 
                onClick={() => setActivePortalMode('admin')}
                className="transition-colors text-amber-600 hover:text-amber-700 font-bold flex items-center space-x-1 border-l pl-4 border-slate-200"
              >
                <span>⚙️ {language === 'en' ? 'Admin' : 'ॲडमिन'}</span>
              </button>
            )}
          </nav>

          {/* Action buttons (Cart with count badge, language toggle, profile info) */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
            {/* Dynamic Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
              className="px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center space-x-1 text-slate-700 cursor-pointer flex-shrink-0"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 animate-pulse" />
              <span className="hidden sm:inline">{language === 'en' ? 'मराठी' : 'English'}</span>
              <span className="sm:hidden font-bold">{language === 'en' ? 'म' : 'En'}</span>
            </button>

            {/* Dynamic Cart indicator widget */}
            <button 
              onClick={() => setCurrentPage('cart')}
              className="relative p-1.5 sm:p-2.5 rounded-full hover:bg-slate-100 transition-all group flex-shrink-0"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
              {cart.length > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1.5 sm:right-1.5 bg-red-500 text-white font-mono font-bold text-[8px] sm:text-[9px] rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center animate-bounce leading-none shadow shadow-red-500/20">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Dynamic Customer Order Updates Notification Bell */}
            {currentUser && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                  className="relative p-1.5 sm:p-2.5 rounded-full hover:bg-slate-100 transition-all group cursor-pointer flex items-center justify-center"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
                  {unreadCount > 0 && (
                    <span 
                       id="badge_unread_notifications"
                       className="absolute top-0.5 right-0.5 sm:top-1.5 sm:right-1.5 bg-blue-600 text-white font-mono font-bold text-[7px] sm:text-[8px] rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center animate-pulse leading-none shadow shadow-blue-500/25"
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotificationsDropdown && (
                    <>
                      {/* Invisible backdrop to dismiss dropdown */}
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotificationsDropdown(false)} />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-150 z-50 overflow-hidden text-left"
                      >
                        <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono">Order Updates</span>
                          {unreadCount > 0 && setCustomerNotifications && (
                            <button
                              onClick={() => {
                                setCustomerNotifications(prev => prev.map(n => n.user_id === currentUser.id ? { ...n, read: true } : n));
                              }}
                              className="text-[10px] text-blue-600 hover:underline font-bold cursor-pointer"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>

                        <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                          {userNotifs.length === 0 ? (
                            <div className="p-6 text-center text-slate-400 text-xs">
                              <Bell className="w-8 h-8 mx-auto stroke-1 text-slate-300 mb-2" />
                              <p className="font-semibold">No updates yet</p>
                              <p className="text-[10px] mt-0.5 text-slate-400">We will let you know when your order is on the way!</p>
                            </div>
                          ) : (
                            userNotifs.map(notif => (
                              <div
                                key={notif.id}
                                onClick={() => {
                                  // Mark singular notification read
                                  if (setCustomerNotifications) {
                                    setCustomerNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                                  }
                                  // Track / open tracking
                                  setActiveTrackingOrderId(notif.order_id);
                                  setCurrentPage('tracking');
                                  setShowNotificationsDropdown(false);
                                }}
                                className={`p-3.5 block transition-colors hover:bg-slate-50/80 cursor-pointer ${
                                  !notif.read ? 'bg-blue-50/40 font-semibold' : ''
                                }`}
                              >
                                <div className="flex items-start gap-2.5">
                                  <div className={`p-1.5 rounded-lg mt-0.5 ${
                                    notif.type === 'out_for_delivery' ? 'bg-cyan-50 text-cyan-600' : 'bg-emerald-50 text-emerald-600'
                                  }`}>
                                    {notif.type === 'out_for_delivery' ? <Truck className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="font-extrabold text-[#111827] text-[11px] leading-tight block truncate pr-1">{notif.heading}</span>
                                      {!notif.read && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0" />}
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-0.5 leading-normal font-normal">{notif.message}</p>
                                    <div className="flex items-center space-x-2 mt-1 text-[9px] font-mono font-normal text-slate-400">
                                      <span className="font-bold text-slate-650">Order {notif.order_id}</span>
                                      <span>•</span>
                                      <span>{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Profile trigger or Login / Register button */}
            <div className="flex items-center pl-1.5 sm:pl-2 border-l border-slate-200 flex-shrink-0">
              {!currentUser ? (
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthRedirectTarget(null);
                    setCurrentPage('auth');
                  }}
                  id="btn_login_register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center space-x-1 flex-shrink-0"
                >
                  <UserIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Login / Register</span>
                  <span className="sm:hidden">{language === 'en' ? 'Login' : 'लॉगिन'}</span>
                </button>
              ) : (
                <div className="flex items-center space-x-1.5 sm:space-x-2.5 flex-shrink-0">
                  <div 
                    onClick={() => setCurrentPage('dashboard')}
                    className="flex items-center space-x-1.5 sm:space-x-2.5 cursor-pointer hover:opacity-85 transition-opacity flex-shrink-0"
                  >
                    {currentUser.avatar && currentUser.avatar.trim() !== "" ? (
                      <img 
                        src={currentUser.avatar} 
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-blue-200 object-cover bg-slate-100 flex-shrink-0"
                        alt="user avatar"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-600 to-sky-400 text-white border border-blue-200 flex items-center justify-center font-extrabold text-[10px] sm:text-xs shadow-sm select-none flex-shrink-0 uppercase">
                        {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'SG'}
                      </div>
                    )}
                    <div className="hidden sm:block text-left text-xs">
                      <span className="block font-bold text-slate-800 leading-tight">
                        {currentUser.name}
                      </span>
                      <span className="block font-medium text-slate-400 font-mono leading-none text-[9px]">
                        {currentUser.role === 'admin' ? 'Admin' : 'Customer'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      setCart([]);
                      setCurrentPage('home');
                    }}
                    title={t('log_out')}
                    className="p-1 sm:p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-0.5 sm:ml-1 flex-shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Main Page Area wrapped with smooth framer-motion transitions */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          
          {/* HOME PAGE */}
          {currentPage === 'home' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-16"
            >
              {/* Premium Brand Banner (Image from user spec) */}
              <div className="space-y-6">
                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-slate-200/50 bg-white group select-none">
                  <img 
                    src={bannerImg} 
                    alt="Shriram Jal Brand Banner" 
                    className="w-full h-auto block cursor-pointer transition-transform duration-300 hover:scale-[1.005]"
                    onClick={() => setCurrentPage('products')}
                    referrerPolicy="no-referrer"
                  />
                  {/* Glowing Overlay border effect */}
                  <div className="absolute inset-0 border border-black/5 rounded-2xl md:rounded-3xl pointer-events-none" />
                </div>

                {/* Quick Selection Hero Control Panel in Marathi */}
                <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-10 shadow-xl text-white">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
                    <div className="lg:col-span-7 space-y-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-blue-500/20 border border-blue-400/30 text-blue-300 tracking-wider uppercase font-mono">
                        ✨ {language === 'en' ? "Ingali's Premium Water Service" : "इंगळीची प्रीमियम पाणी सेवा"} • {language === 'en' ? "Owner: Ranjit More" : "मालक: रणजित मोरे"}
                      </span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                        {language === 'en' ? "Pure Water, Fast Delivery at Your Doorstep!" : "शुद्ध पाणी, जलद डिलिव्हरी तुमच्या दारात!"}
                      </h2>
                      <p className="text-slate-350 text-xs sm:text-sm max-w-xl leading-relaxed">
                        {language === 'en' ? "Order cold and normal water cans now in just one click." : "थंड आणि नॉर्मल पाण्याचे कॅन आता एक क्लिकवर ऑर्डर करा."}
                      </p>
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          onClick={() => setCurrentPage('products')}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-95 text-white shadow-lg shadow-blue-500/20 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center space-x-2 cursor-pointer"
                        >
                          <span>{language === 'en' ? 'Order Now' : 'ऑर्डर करा आता आता'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentPage('products');
                          }}
                          className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
                        >
                          {language === 'en' ? 'View All Products' : 'सर्व उत्पादने पहा'}
                        </button>
                      </div>
                    </div>

                    {/* Interactive Can Quick Selector */}
                    <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 space-y-4">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-[#38bdf8] uppercase block text-center">
                        {language === 'en' ? 'Quick Delivery Shortcuts' : 'तात्काळ डिलिव्हरी शॉर्टकट'}
                      </span>
                      <div className="flex justify-center space-x-6 relative py-1">
                        <div className="text-center group cursor-pointer" onClick={() => { setSelectedProductType('normal'); setCurrentPage('products'); }}>
                          <WaterCanVisual type="normal" capacity="20L" className="w-24 h-32 hover:scale-105 transition-transform" />
                          <span className="block mt-2.5 text-xs font-bold text-blue-200 group-hover:text-white transition-colors">
                            {language === 'en' ? '20L Normal Can' : '20L नॉर्मल पाणी'}
                          </span>
                        </div>
                        <div className="text-center group cursor-pointer" onClick={() => { setSelectedProductType('cold'); setCurrentPage('products'); }}>
                          <WaterCanVisual type="cold" capacity="20L" className="w-24 h-32 hover:scale-105 transition-transform" />
                          <span className="block mt-2.5 text-xs font-bold text-cyan-200 group-hover:text-white transition-colors">
                            {language === 'en' ? '20L Chilled Can' : '20L थंड पाणी'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Steps Segment (ऑर्डर कशी कराल?) */}
              <div className="space-y-8 text-center bg-slate-50/50 py-10 px-6 rounded-3xl border border-slate-100/50">
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#111c44] tracking-tight">
                    {language === 'en' ? 'How to Order?' : 'ऑर्डर कशी कराल?'}
                  </h3>
                  <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative items-start">
                  {[
                    { step: '1', title: 'पाण्याचा प्रकार निवडा', desc: 'थंड पाणी किंवा नॉर्मल पाणी निवडा' },
                    { step: '2', title: 'कॅनची संख्या निवडा', desc: 'तुम्हाला हवे त्या संख्येची निवड करा' },
                    { step: '3', title: 'डिलिव्हरी पत्ता भरा', desc: 'तुमचा संपूर्ण पत्ता एंटर करा' },
                    { step: '4', title: 'पेमेंट करा', desc: 'ऑनलाईन पेमेंट किंवा COD निवडा' },
                    { step: '5', title: 'डिलिव्हरी मिळवा', desc: 'आम्ही वेळेवर पाणी तुमच्या दारात पोहचवू' },
                  ].map((s, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center space-y-3 relative group">
                      <div className="relative">
                        <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-base shadow-md group-hover:scale-105 transition-transform">
                          {s.step}
                        </div>
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-sm">{s.title}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed max-w-[160px] mx-auto">{s.desc}</p>
                      {idx < 4 && (
                        <div className="hidden md:block absolute top-6 -right-[30%] w-[50%] h-[2px] bg-slate-200 border-dashed border-t" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured / Popular Products ("आमची लोकप्रिय उत्पादने") */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">
                    {language === 'en' ? 'Our Popular Products' : 'आमची लोकप्रिय उत्पादने'}
                  </h3>
                  <button 
                    onClick={() => { setSelectedProductType('all'); setCurrentPage('products'); }}
                    className="text-blue-600 hover:text-blue-800 text-xs font-bold font-sans tracking-wide flex items-center cursor-pointer"
                  >
                    <span>{language === 'en' ? 'View All Products' : 'सर्व उत्पादने पहा'}</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.slice(0, 4).map(p => (
                    <div key={p.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-blue-250 transition-all group">
                      <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-center relative overflow-hidden">
                        <WaterCanVisual type={p.type} capacity={p.capacity} className="w-24 h-32" />
                        {p.stock === 0 && (
                          <div className="absolute top-2 right-2 bg-rose-600 text-white font-sans font-bold text-[10px] uppercase px-2 py-0.5 rounded-full z-10">
                            {language === 'en' ? 'Out of Stock' : 'Out of Stock'}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 text-left space-y-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase inline-block ${
                          p.type === 'cold' ? 'bg-cyan-100 text-cyan-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {p.type} water
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-sm truncate">{p.name}</h4>
                        <p className="text-slate-400 text-[11px] line-clamp-2 h-8 leading-tight">{p.description}</p>
                        
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-base font-extrabold text-blue-900">₹{p.price}</span>
                          {p.stock > 0 ? (
                            <button
                              onClick={() => {
                                handleAddToCart(p);
                                alert(`${p.name} added to cart!`);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 px-3.5 rounded-lg text-xs transition-colors flex items-center space-x-1.5 active:scale-95 cursor-pointer font-sans"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>{language === 'en' ? 'Add To Cart' : 'कार्टमध्ये जोडा'}</span>
                            </button>
                          ) : (
                            <>
                              {stockNotifications.some(n => n.product_id === p.id && !n.notified && (currentUser ? n.mobile_no === currentUser.phone : true)) ? (
                                <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-850 rounded-xl text-[10px] font-bold font-sans">
                                  ✓ {language === 'en' ? 'Subscribed' : 'नोंदणी केली'}
                                </span>
                              ) : activeNotifyProductId === p.id ? (
                                <button 
                                  onClick={() => {
                                    setActiveNotifyProductId('');
                                  }}
                                  className="text-slate-400 text-xs font-semibold hover:text-slate-600 cursor-pointer"
                                >
                                  Close
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setActiveNotifyProductId(p.id);
                                    setNotifyMobile(currentUser?.phone || '');
                                  }}
                                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold p-2 px-4 rounded-lg text-xs transition-colors cursor-pointer font-sans"
                                >
                                  <span>{language === 'en' ? 'Notify Me' : 'मला कळवा'}</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>

                        {/* Expandable phone entry for notifications */}
                        {p.stock === 0 && activeNotifyProductId === p.id && (
                          <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3 space-y-2 mt-2 font-sans">
                            <label className="block text-[10px] font-extrabold text-amber-900">
                              ⚡ SMS / WhatsApp alerts
                            </label>
                            <input 
                              type="tel"
                              value={notifyMobile}
                              onChange={(e) => setNotifyMobile(e.target.value.replace(/\D/g, ''))}
                              placeholder="10-Digit Mobile"
                              maxLength={10}
                              className="w-full bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none font-semibold text-slate-800"
                            />
                            <button
                              onClick={() => {
                                if (!/^\d{10}$/.test(notifyMobile)) {
                                  alert(language === 'en' ? 'Please enter a valid 10-digit mobile number' : 'कृपया १० अंकी वैध मोबाईल नंबर टाका');
                                  return;
                                }
                                if (onAddStockNotification) {
                                  onAddStockNotification(p.id, notifyMobile);
                                }
                                alert(language === 'en'
                                  ? `Subscribed successfully! You will receive SMS alerts at ${notifyMobile}.`
                                  : `नोंदणी यशस्वी! स्टॉक उपलब्ध होताच मोबाईल नंबर ${notifyMobile} वर SMS पाठवून कळवले जाईल.`
                                );
                                setActiveNotifyProductId('');
                              }}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-lg text-[10px] cursor-pointer"
                            >
                              Subscribe
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us ("आम्हालाच का निवडाल?") */}
              <div id="why-choose-us" className="space-y-8 scroll-mt-24">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#111c44] tracking-tight">
                    {language === 'en' ? 'Why Choose Us?' : 'आम्हालाच का निवडाल?'}
                  </h3>
                  <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-center">
                  {[
                    { title: '100% शुद्ध आणि सुरक्षित पाणी', desc: 'RO + UV + Ozonized शुद्धीकरण केलेले पाणी', icon: '🛡️' },
                    { title: 'वेळेवर डिलिव्हरी', desc: 'आम्ही वेळेवर तुमच्या दारात पोहचवतो', icon: '🛵' },
                    { title: 'परवडणारे दर', desc: 'उत्तम गुणवत्ता आणि वाजवी दर', icon: '₹' },
                    { title: 'हायजेनिक पॅकिंग', desc: 'स्वच्छ आणि सुरक्षित पॅकिंग', icon: '📦' },
                    { title: '24x7 ग्राहक सेवा', desc: '📞 +91 93073 19929 / +91 88560 45945', icon: '📞' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center hover:shadow-md transition-all flex flex-col justify-between items-center space-y-3">
                      <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold font-sans">
                        {item.icon}
                      </div>
                      <h4 className="font-extrabold text-slate-850 text-xs sm:text-sm">{item.title}</h4>
                      <p className="text-slate-500 text-[11px] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery coverage areas */}
              <div className="bg-blue-50/60 rounded-3xl p-8 text-center space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-blue-900 tracking-tight">Active Delivery Coverage Sector: Ingali & Hatkanangle Region</h3>
                <p className="text-xs text-blue-700 max-w-lg mx-auto">Operating fully integrated logistics networks from our central hub near Jain Basti, Ingali, serving:</p>
                <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                  {['Jain Basti Area', 'Ingali Gaon', 'Shirol Road Chowk', 'Hatkanangle Station', 'Ichalkaranji Textile Border', 'Jaysingpur Link Road'].map(area => (
                    <span key={area} className="bg-white px-3.5 py-1 rounded-full text-xs font-semibold text-blue-800 border border-blue-100 shadow-sm">
                      📍 {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews Section ("ग्राहकांचे अभिप्राय") */}
              <div className="py-8 border-t border-slate-100">
                <div className="text-center max-w-lg mx-auto space-y-2 mb-8">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#111c44] tracking-tight">
                    {language === 'en' ? 'Customer Testimonials' : 'ग्राहकांचे अभिप्राय'}
                  </h3>
                  <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {[
                    { name: 'अमित पाटील', comment: 'पाणी खूप स्वच्छ आणि गोड आहे. जैन बस्ती भागात डिलिव्हरी वेळेवर मिळते.', rating: 5, loc: 'इंगळी' },
                    { name: 'स्नेहा देशमुख', comment: 'मी गेल्या ६ महिन्यांपासून वापरतोय. रणजित सरांची खूप चांगली सर्व्हिस आहे.', rating: 5, loc: 'हातकणंगले' },
                    { name: 'रोहित शिंदे', comment: '२० लिटर चिल्ड कॅनची गुणवत्ता खूप चांगली आहे. नक्कीच शिफारस करतो.', rating: 5, loc: 'इंगळी' }
                  ].map((t, i) => (
                    <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-3 hover:shadow-md transition-shadow">
                      <div className="flex text-amber-400">
                        {Array.from({ length: t.rating }).map((_, r_idx) => (
                          <Star key={r_idx} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 italic leading-relaxed">"{t.comment}"</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <span className="font-extrabold text-xs text-slate-800">{t.name}</span>
                        <span className="text-[10px] text-slate-450 font-mono">{t.loc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Ordering Banner */}
              <div className="bg-[#e0f2fe]/45 border border-sky-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 text-left relative overflow-hidden shadow-sm shadow-cyan-500/5">
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-500 text-white p-3 rounded-full shadow-md shadow-emerald-500/20 active:scale-95 transition-transform shrink-0">
                    <Phone className="w-6 h-6 fill-current animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-800">
                      {language === 'en' ? 'Order via WhatsApp' : 'WhatsApp वरून ORDER करा'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500">
                      {language === 'en' ? 'Just text us to book your clean water can instantly!' : 'फक्त एक मेसेज करा आणि ऑर्डर बुक करा!'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    window.open('https://wa.me/919307319929?text=Hello%20Shriram%20Jal%20I%20want%20to%20order%20water', '_blank');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md shadow-emerald-600/10 transition-all hover:scale-[1.01] active:scale-95 flex items-center space-x-2 cursor-pointer"
                >
                  <span>{language === 'en' ? 'Book via WhatsApp' : 'WhatsApp वर ऑर्डर करा'}</span>
                </button>
              </div>

              {/* Premium Footer section */}
              <footer id="footer-section" className="bg-slate-900 text-slate-400 rounded-3xl p-8 sm:p-12 text-left">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-4">
                    <span className="text-lg font-bold text-white block">SHRIRAM JAL</span>
                    <p className="text-xs leading-relaxed text-slate-400">
                      {language === 'en' 
                        ? 'Our goal is to provide you with 100% pure, safe and timely water supply.'
                        : 'आमचे ध्येय आहे तुम्हाला १००% शुद्ध, सुरक्षित आणि वेळेवर पाणी पुरवठा करणे.'}
                    </p>
                    <div className="flex space-x-3 pt-2">
                      <span className="w-7 h-7 bg-slate-800 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-colors">f</span>
                      <span className="w-7 h-7 bg-slate-800 hover:bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-colors">t</span>
                      <span className="w-7 h-7 bg-slate-800 hover:bg-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-colors">i</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs uppercase font-extrabold text-slate-300 font-mono tracking-wider">{language === 'en' ? 'Quick Links' : 'द्रुत दुवे'}</span>
                    <ul className="text-xs space-y-2 font-semibold font-sans">
                      <li><button onClick={() => setCurrentPage('home')} className="hover:text-white cursor-pointer">{t('home')}</button></li>
                      <li><button onClick={() => setCurrentPage('products')} className="hover:text-white cursor-pointer">{t('order_cans')}</button></li>
                      <li><button onClick={() => {
                        const el = document.getElementById('why-choose-us');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }} className="hover:text-white cursor-pointer">{t('about_us')}</button></li>
                      <li><button onClick={() => {
                        const el = document.getElementById('footer-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }} className="hover:text-white cursor-pointer">{t('contact_us')}</button></li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs uppercase font-extrabold text-slate-300 font-mono tracking-wider">{language === 'en' ? 'Customer Service' : 'ग्राहक सेवा'}</span>
                    <ul className="text-xs space-y-2 font-semibold font-sans">
                      <li><button onClick={() => setCurrentPage('dashboard')} className="hover:text-white cursor-pointer">{t('my_orders_footer')}</button></li>
                      <li><button onClick={() => setCurrentPage('dashboard')} className="hover:text-white cursor-pointer">{t('track_orders')}</button></li>
                      <li><span className="text-slate-500">{language === 'en' ? 'Return & Refund' : 'परतावा आणि रिफंड'}</span></li>
                      <li><span className="text-slate-500">{language === 'en' ? 'Privacy Policy' : 'गोपनीयता धोरण'}</span></li>
                      <li><span className="text-slate-500">{language === 'en' ? 'Terms & Conditions' : 'अटी आणि शर्ती'}</span></li>
                    </ul>
                  </div>

                  <div className="space-y-4 text-xs font-semibold">
                    <span className="text-xs uppercase font-extrabold text-slate-300 font-mono tracking-wider block">Operational Office</span>
                    <p className="leading-relaxed text-slate-350">
                      Shriram Waters Corp,<br />
                      Near Jain Basti, A/P - Ingali,<br />
                      Tal- Hatkanangle, Dist - Kolhapur,<br />
                      Maharashtra - 416115<br />
                      Owner: <strong>{language === 'en' ? 'Ranjit More' : 'रणजित मोरे'}</strong>
                    </p>
                    <div className="space-y-1 bg-slate-850 p-3 rounded-lg border border-slate-800 select-all font-mono text-[10px] text-slate-300">
                      <span className="block">📞 Help Hotline: +91 93073 19929</span>
                      <span className="block">📞 Alternative: +91 88560 45945</span>
                      <span className="block">✉️ Support: info@shriramjal.com</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-800 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between">
                  <span>© 2026 Shriram Waters Pvt Ltd. All rights reserved.</span>
                </div>
              </footer>
            </motion.div>
          )}

          {/* CATALOG PRODUCTS PAGE */}
          {currentPage === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Filter controls panel */}
              <div className="bg-white border border-blue-50/70 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 text-left">
                <div className="space-y-1.5 self-start">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pure Water Can Catalog</h2>
                  <p className="text-xs text-slate-400">Select Chilled Cold water or ambient Temperature Normal water cans aligned with sizes.</p>
                </div>

                {/* Sub filters */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  
                  {/* Select Type: All | Cold | Normal */}
                  <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 border border-slate-200">
                    {['all', 'normal', 'cold'].map(t => (
                      <button
                        key={t}
                        onClick={() => setSelectedProductType(t as any)}
                        className={`text-xs px-3.5 py-1.5 rounded-lg capitalize font-bold tracking-tight transition-all ${
                          selectedProductType === t 
                            ? 'bg-blue-600 text-white shadow' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Select Capacity: All | 20L | 10L | 5L | 1L */}
                  <select
                    value={selectedProductCapacity}
                    onChange={(e) => setSelectedProductCapacity(e.target.value as any)}
                    className="bg-white border border-slate-200 text-xs font-semibold px-4 py-2 rounded-xl focus:border-blue-400 focus:outline-none"
                  >
                    <option value="all">All Sizes</option>
                    <option value="20L">20L Cans</option>
                    <option value="10L">10L Compact Cans</option>
                    <option value="5L">5L Counters</option>
                    <option value="1L">1L Bottles</option>
                  </select>

                </div>
              </div>

              {/* Catalog Items Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 space-y-3">
                  <div className="text-3xl">🏜️</div>
                  <h3 className="font-bold text-slate-800">No matching cans found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">Try clearing your selection constraints or choose another size tier.</p>
                  <button 
                    onClick={() => { setSelectedProductType('all'); setSelectedProductCapacity('all'); }} 
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
                      <div className="bg-slate-50 rounded-xl p-6 flex items-center justify-center relative overflow-hidden">
                        <WaterCanVisual type={p.type} capacity={p.capacity} className="w-24 h-32" />
                      </div>
                      <div className="mt-4 text-left space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                            p.type === 'cold' ? 'bg-cyan-100 text-cyan-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {p.type} water
                          </span>
                          {p.stock === 0 ? (
                            <span className="text-[10px] text-rose-600 font-mono font-bold uppercase bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                              {language === 'en' ? 'Out of Stock' : 'स्टॉक संपला'}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono font-bold">Stock: {p.stock} units</span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm truncate">{p.name}</h4>
                        <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3 h-12">{p.description}</p>
                        
                        <div className="mt-4 pt-2 border-t border-slate-100 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-extrabold text-blue-900">₹{p.price}</span>
                            {p.stock > 0 ? (
                              <button
                                onClick={() => {
                                  handleAddToCart(p);
                                  alert(`${p.name} added to your cart!`);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>{language === 'en' ? 'Add To Cart' : 'कार्टमध्ये जोडा'}</span>
                              </button>
                            ) : (
                              <>
                                {stockNotifications.some(n => n.product_id === p.id && !n.notified && (currentUser ? n.mobile_no === currentUser.phone : true)) ? (
                                  <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-850 rounded-xl text-[11px] font-bold animate-pulse text-center">
                                    ✓ {language === 'en' ? 'Subscribed' : 'नोंदणी पूर्ण'}
                                  </span>
                                ) : activeNotifyProductId === p.id ? null : (
                                  <button
                                    onClick={() => {
                                      setActiveNotifyProductId(p.id);
                                      setNotifyMobile(currentUser?.phone || '');
                                    }}
                                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-750 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center space-x-1 shadow-sm shadow-amber-500/10 cursor-pointer"
                                  >
                                    <span>🔔 {language === 'en' ? 'Notify Me' : 'मला कळवा'}</span>
                                  </button>
                                )}
                              </>
                            )}
                          </div>

                          {/* Interactive Expandable SMS Notify subscriber form */}
                          {p.stock === 0 && activeNotifyProductId === p.id && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 space-y-2 text-left"
                            >
                              <div className="flex items-center justify-between">
                                <label className="block text-[11px] font-extrabold text-amber-900 font-sans">
                                  ⚡ {language === 'en' ? 'SMS / WhatsApp Notification' : 'SMS / WhatsApp सूचना मिळवा'}
                                </label>
                                <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase font-mono">SMS System</span>
                              </div>
                              <p className="text-[10px] text-amber-700 leading-tight">
                                {language === 'en' 
                                  ? 'Enter mobile number. When stock is refreshed by Admin, you will receive an automatic Marathi SMS alert!' 
                                  : 'मोबाईल नंबर टाका. ॲडमीनने स्टॉक अपडेट करताच तुम्हाला मोबाईलवर त्वरित मराठीत मेसेज पाठवला जाईल!'}
                              </p>
                              <div className="flex space-x-1.5">
                                <input
                                  type="tel"
                                  value={notifyMobile}
                                  onChange={(e) => setNotifyMobile(e.target.value.replace(/\D/g, ''))}
                                  className="bg-white border border-slate-200 text-xs rounded-xl px-2.5 py-1.5 flex-grow outline-none focus:border-amber-500 font-semibold font-mono text-slate-800 shadow-inner"
                                  placeholder={language === 'en' ? '10-Digit Mobile No' : '१० अंकी मोबाईल नंबर'}
                                  maxLength={10}
                                />
                                <button
                                  onClick={() => {
                                    if (!/^\d{10}$/.test(notifyMobile)) {
                                      alert(language === 'en' ? 'Please enter a valid 10-digit mobile number' : 'कृपया १० अंकी वैध मोबाईल नंबर टाका');
                                      return;
                                    }
                                    if (onAddStockNotification) {
                                      onAddStockNotification(p.id, notifyMobile);
                                    }
                                    alert(language === 'en'
                                      ? `Subscribed successfully for ${p.name}! You will receive SMS alerts at ${notifyMobile}.`
                                      : `नोंदणी यशस्वी! ${p.name} चे स्टॉक उपलब्ध होताच मोबाईल नंबर ${notifyMobile} वर SMS पाठवून कळवले जाईल.`
                                    );
                                    setActiveNotifyProductId(null);
                                    setNotifyMobile('');
                                  }}
                                  className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold shadow transition-all cursor-pointer whitespace-nowrap"
                                >
                                  {language === 'en' ? 'Submit' : 'नोंदणी करा'}
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveNotifyProductId(null);
                                    setNotifyMobile('');
                                  }}
                                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                                >
                                  ✕
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* SHOPPING CART PAGE */}
          {currentPage === 'cart' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <h2 className="text-xl font-bold text-slate-900 text-left">Your Pure Hydration Cart</h2>

              {cart.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 space-y-4">
                  <div className="text-slate-200 flex justify-center">
                    <ShoppingCart className="w-16 h-16 stroke-[1.2]" />
                  </div>
                  <h3 className="font-bold text-slate-800">Your cart is currently empty</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">Explore high-quality 20L ambient/chilled water cans to enjoy clean mineral life.</p>
                  <button 
                    onClick={() => setCurrentPage('products')}
                    className="bg-blue-600 text-white font-bold px-6 py-2 rounded-xl text-xs hover:bg-blue-700 shadow"
                  >
                    Browse Water Catalogue
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
                  
                  {/* Cart breakdown list */}
                  <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="divide-y divide-slate-100">
                      {cart.map(item => (
                        <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center space-x-4 self-start sm:self-center">
                            <div className="bg-slate-50 p-2 rounded-xl flex items-center justify-center w-16 h-20">
                              <WaterCanVisual type={item.product.type} capacity={item.product.capacity} className="w-12 h-16" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-bold text-slate-800 text-sm">{item.product.name}</h4>
                              <p className="text-[11px] text-slate-400 uppercase font-mono">Size: {item.product.capacity} • {item.product.type} hydration</p>
                              <span className="text-xs font-bold text-blue-900 block font-mono">₹{item.product.price} / unit</span>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-start">
                            <div className="flex items-center space-x-2 border border-slate-200 rounded-lg p-1">
                              <button 
                                onClick={() => handleUpdateCartQty(item.product.id, -1)}
                                className="p-1 rounded hover:bg-slate-100 text-slate-500"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-mono text-sm font-bold w-6 text-center text-slate-800">{item.quantity}</span>
                              <button 
                                onClick={() => handleUpdateCartQty(item.product.id, 1)}
                                className="p-1 rounded hover:bg-slate-100 text-slate-500"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="font-mono font-extrabold text-blue-900 text-sm">₹{item.product.price * item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary bill calculations card */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                      <h3 className="font-extrabold text-slate-800 text-sm pb-2 border-b border-slate-100">Order Pay Breakdown</h3>
                      
                      <div className="space-y-2.5 text-xs text-slate-500 font-medium">
                        <div className="flex justify-between">
                          <span>Items Subtotal:</span>
                          <span className="font-mono text-slate-800 font-bold">₹{subTotal}</span>
                        </div>
                        
                        {/* Promo validator element */}
                        <div className="space-y-1.5 pt-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Apply Promo Coupon:</label>
                          <div className="flex space-x-2">
                            <input 
                              type="text" 
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value)}
                              placeholder="e.g. JAL20, PURE35" 
                              className="bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs focus:border-blue-400 focus:outline-none flex-grow font-mono uppercase"
                            />
                            <button 
                              onClick={handleApplyCoupon}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-1.5 px-3 rounded-lg text-xs transition-colors"
                            >
                              Apply
                            </button>
                          </div>
                          {couponError && <p className="text-[10px] text-red-500 font-mono italic">{couponError}</p>}
                          {couponSuccess && <p className="text-[10px] text-emerald-600 font-bold font-mono">{couponSuccess}</p>}
                          <div className="text-[9px] text-slate-400 leading-tight">
                            ℹ️ Tips: Type <span className="font-bold font-mono">JAL20</span> for 20% off. <span className="font-bold font-mono">PURE35</span> for 35% off.
                          </div>
                        </div>

                        {appliedCoupon && (
                          <div className="flex justify-between text-emerald-600 font-bold font-mono">
                            <span>Promo ({appliedCoupon.code} -{appliedCoupon.discount_percent}%):</span>
                            <span>-₹{discountAmt}</span>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <span>Delivery Surcharge Settle:</span>
                          <span className="font-mono text-slate-800 font-bold">
                            {deliveryChargeAmt === 0 ? <span className="text-emerald-500 font-sans text-[10px] font-bold">FREE over ₹150</span> : `₹${deliveryChargeAmt}`}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                        <span className="font-extrabold text-slate-800 text-xs">Settled Grand Total:</span>
                        <span className="font-mono text-lg font-extrabold text-blue-900">₹{grandTotalAmt}</span>
                      </div>

                      <button
                        onClick={() => {
                          if (!currentUser) {
                            setAuthRedirectTarget('checkout');
                            setAuthMode('login');
                            setCurrentPage('auth');
                          } else {
                            setCurrentPage('checkout');
                          }
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-xl transition-all hover:scale-[1.01] flex items-center justify-center space-x-1.5 shadow-md shadow-blue-500/10 active:scale-95 cursor-pointer"
                      >
                        <span>Proceed To Checkout</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </motion.div>
          )}

          {/* CHECKOUT PAGE & MAP PICKER */}
          {currentPage === 'checkout' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8 text-left"
            >
              <h2 className="text-xl font-bold text-slate-900">Complete Secured Checkout</h2>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form parameters */}
                <div className="lg:col-span-8 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
                  
                  {/* Select Delivery Address Segment */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>Select Delivery Address</span>
                      </h3>
                      <button 
                        onClick={() => setShowAddressModal(true)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-bold font-mono tracking-wide flex items-center"
                      >
                        ➕ Add New Address
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map(addr => (
                        <div 
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`border p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
                            selectedAddressId === addr.id 
                              ? 'border-blue-600 bg-blue-500/5' 
                              : 'border-slate-200 hover:border-slate-350 bg-slate-50/20'
                          }`}
                        >
                          <div>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase mb-2 ${
                              addr.label === 'Home' ? 'bg-cyan-100 text-cyan-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {addr.label} Label
                            </span>
                            <p className="text-xs text-slate-700 font-medium leading-relaxed">{addr.address_line}</p>
                            <span className="block mt-1 font-mono text-[10px] text-slate-400">Pincode: {addr.pincode} • {addr.city || 'Kolhapur'}</span>
                          </div>
                          {/* Lat/lng validation mock */}
                          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                            📍 Linked coordinates: {addr.lat.toFixed(4)}, {addr.lng.toFixed(4)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time slot scheduling selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>Select Delivery Date:</span>
                      </label>
                      <input 
                        type="date" 
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 font-sans">
                      <label className="text-xs font-bold text-slate-700 flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-cyan-500" />
                        <span>Preferred Delivery Slot:</span>
                      </label>
                      <select
                        value={deliverySlot}
                        onChange={(e) => setDeliverySlot(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:border-blue-500 focus:outline-none"
                      >
                        <option value="08:00 AM - 11:00 AM">Morning (08:00 AM - 11:00 AM)</option>
                        <option value="11:00 AM - 02:00 PM">Noon (11:00 AM - 02:00 PM)</option>
                        <option value="02:00 PM - 05:00 PM">Afternoon (02:00 PM - 05:00 PM)</option>
                        <option value="05:00 PM - 08:00 PM">Evening (05:00 PM - 08:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  {/* Payment Gateway method triggers selection */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h3 className="font-bold text-slate-800 text-sm">Select Payment Option</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      {[
                        { code: 'upi', label: 'UPI (QR Code)', icon: '⚡' },
                        { code: 'card', label: 'Debit/Credit Card', icon: '💳' },
                        { code: 'net_banking', label: 'Net Banking', icon: '🏛️' },
                        { code: 'cod', label: 'Cash on Delivery', icon: '💵' }
                      ].map(p => (
                        <div
                          key={p.code}
                          onClick={() => setPaymentMethod(p.code as any)}
                          className={`border p-3.5 rounded-xl cursor-pointer transition-all text-center flex flex-col items-center justify-center space-y-2 ${
                            paymentMethod === p.code 
                              ? 'border-blue-600 bg-blue-500/5 font-extrabold text-blue-900' 
                              : 'border-slate-200 hover:border-slate-350 bg-slate-50/20'
                          }`}
                        >
                          <span className="text-xl">{p.icon}</span>
                          <span className="text-[10px] tracking-tight">{p.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Pay Summary bar with Razorpay simulation loader */}
                <div className="lg:col-span-4 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-extrabold text-slate-800 text-sm pb-2 border-b border-slate-100">Checkout Verification</h3>

                  <div className="space-y-3 text-xs text-slate-500">
                    <div className="font-mono">
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold">Billing to customer:</span>
                      <span className="block font-bold text-slate-800 text-[11px] mt-1">{currentUser.name}</span>
                      <span className="block text-[10px]">{currentUser.phone}</span>
                    </div>

                    <div className="border-t border-slate-100 pt-2 text-[11px]">
                      <span className="font-bold text-slate-800">Items Selected:</span>
                      {cart.map(c => (
                        <div key={c.product.id} className="flex justify-between text-slate-450 mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                          <span>{c.quantity}x {c.product.capacity} Can</span>
                          <span className="font-mono text-slate-800">₹{c.product.price * c.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-2 space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span>Items Total:</span>
                        <span>₹{subTotal}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>Promo Discount:</span>
                          <span>-₹{discountAmt}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Logistics Settle:</span>
                        <span>₹{deliveryChargeAmt}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">Total Payable:</span>
                      <span className="font-mono text-base font-extrabold text-blue-900">₹{grandTotalAmt}</span>
                    </div>

                    {/* Razorpay dynamic overlay when payment triggers */}
                    {isProcessingPayment ? (
                      <div className="bg-blue-900 text-white rounded-xl p-4 text-center space-y-3 animate-pulse">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                        <span className="block font-bold font-mono text-[11px]">Securing Razorpay Token API...</span>
                        <p className="text-[10px] text-blue-200">Writing records, auditing payments ledger, mapping boy Rajesh Kumar.</p>
                      </div>
                    ) : (
                      <button
                        onClick={handleProceedToPayment}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center space-x-1"
                      >
                        <span>PAY WITH RAZORPAY ₹{grandTotalAmt}</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
              
              {/* Wireframe Address modal */}
              {showAddressModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row">
                    
                    {/* Interactive Maps Canvas Simulator */}
                    <div className="w-full md:w-1/2 bg-slate-100 border-r border-slate-200 p-4 font-sans space-y-4 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-xs text-blue-900 uppercase tracking-widest font-mono">Google Maps SDK Simulator</h4>
                        <p className="text-[10px] text-slate-400">Click a Kolhapur/Ingali geographical landmark area on the grid map to fetch coordinates immediately into input fields:</p>
                      </div>

                      {/* Map grid simulation canvas */}
                      <div className="relative border border-slate-300 h-44 rounded-xl bg-blue-50/50 p-2 overflow-hidden select-none flex flex-col justify-between">
                        {/* Interactive spots */}
                        <div className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 10%, transparent 11%)', backgroundSize: '12px 12px' }} />
                        
                        <span className="bg-white/80 border border-slate-200 px-2 py-0.5 rounded text-[8px] font-mono absolute top-2 left-2 z-10 text-slate-600">KOLHAPUR/INGALI GRID MAP V2.0</span>

                        <div className="flex flex-col space-y-1.5 pt-6 relative z-10">
                          {KOLHAPUR_HOTSPOTS.map(spot => (
                            <button
                              key={spot.name}
                              type="button"
                              onClick={() => handleSelectHotspotOnMap(spot)}
                              className="bg-white hover:bg-blue-600 hover:text-white px-2 py-1 rounded border border-slate-200 text-[10px] font-semibold text-left transition-colors flex items-center justify-between"
                            >
                              <span>📍 {spot.name}</span>
                              <span className="text-[8px] font-mono opacity-80">{spot.lat.toFixed(2)}, {spot.lng.toFixed(2)}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-xl space-y-1">
                        <span className="block text-[9px] text-blue-750 font-bold uppercase tracking-wider font-mono">Locked Location GPS Pointer:</span>
                        <div className="flex items-center justify-between text-[10px] font-mono text-blue-800">
                          <span>Lat: {newAddrLat.toFixed(4)}</span>
                          <span>Lng: {newAddrLng.toFixed(4)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Address form fields */}
                    <form onSubmit={handleSaveAddr} className="w-full md:w-1/2 p-6 text-left space-y-4">
                      <h4 className="font-bold text-slate-900 text-sm">Add Address Details</h4>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase block font-mono">Location Label:</label>
                        <div className="flex space-x-2">
                          {['Home', 'Office', 'Other'].map(lbl => (
                            <button
                              key={lbl}
                              type="button"
                              onClick={() => setNewAddrLabel(lbl)}
                              className={`text-[10px] px-3.5 py-1 rounded-lg border font-bold ${
                                newAddrLabel === lbl ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200 text-slate-500'
                              }`}
                            >
                              {lbl}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase block font-mono">Address Line:</label>
                        <textarea 
                          rows={2}
                          value={newAddrLine}
                          onChange={(e) => setNewAddrLine(e.target.value)}
                          placeholder="Flat no., building name, landmark area..." 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block font-mono">City / State:</label>
                          <input type="text" value={`${newAddrCity}, ${newAddrState}`} readOnly className="w-full bg-slate-100 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-500 font-semibold" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block font-mono">Pincode:</label>
                          <input 
                            type="text" 
                            maxLength={6}
                            value={newAddrPincode}
                            onChange={(e) => setNewAddrPincode(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 411016" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
                            required
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(false)}
                          className="border border-slate-200 text-slate-500 font-bold text-xs p-2 px-4 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-2 px-5 rounded-lg"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>

                  </div>
                </div>
              )}

              {isEditingAvatar && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: "spring", duration: 0.4 }}
                    className="bg-white border border-blue-100 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-left space-y-5"
                  >
                    {/* Modal Header */}
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-800">
                          {language === 'en' ? 'Customize Profile Picture' : 'प्रोफाईल फोटो निवडा'}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          {language === 'en' ? 'Select from premium presets or paste a link' : 'प्रीसेट फोटो निवडा किंवा स्वतःची लिंक टाका'}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsEditingAvatar(false)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Previews */}
                    <div className="flex items-center space-x-4 p-3 bg-blue-50/50 rounded-2xl">
                      <div className="flex-shrink-0">
                        {inputAvatarUrl && inputAvatarUrl.trim() !== '' ? (
                          <img
                            src={inputAvatarUrl}
                            className="w-14 h-14 rounded-full border border-blue-400 object-cover bg-white"
                            alt="avatar preview"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=120';
                            }}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-sky-400 text-white border border-blue-400 flex items-center justify-center font-bold text-lg uppercase shadow-inner">
                            {currentUser ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'SG'}
                          </div>
                        )}
                      </div>
                      <div className="text-xs">
                        <span className="block font-extrabold text-slate-850">
                          {language === 'en' ? 'Live Preview' : 'थेट पूर्वावलोकन'}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          {language === 'en' ? 'How it will look across your panel' : 'तुमच्या पॅनलवर असा फोटो दिसेल'}
                        </span>
                      </div>
                    </div>

                    {/* Preset Avatars */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                        {language === 'en' ? 'Choose From Presets' : 'प्रीसेट फोटोंमधून निवडा'}
                      </label>
                      <div className="grid grid-cols-4 gap-2.5">
                        {[
                          { name: 'Pure Water', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=120' },
                          { name: 'Mint Splash', url: 'https://images.unsplash.com/photo-1548263544-9513b941262c?auto=format&fit=crop&q=80&w=120' },
                          { name: 'Happy Girl', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120' },
                          { name: 'Hydrated Boy', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120' },
                        ].map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setInputAvatarUrl(p.url)}
                            className={`relative rounded-xl overflow-hidden border-2 h-12 w-12 transition-all hover:scale-105 active:scale-95 cursor-pointer hover:shadow-sm ${
                              inputAvatarUrl === p.url ? 'border-blue-600 scale-105 saturate-110' : 'border-slate-100'
                            }`}
                            title={p.name}
                          >
                            <img src={p.url} className="w-full h-full object-cover" alt={p.name} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom URL Option */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                        {language === 'en' ? 'Or Paste Custom Photo Link' : 'किंवा स्वतःची फोटो लिंक टाका'}
                      </label>
                      <input
                        type="url"
                        value={inputAvatarUrl}
                        onChange={(e) => setInputAvatarUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 placeholder-slate-400 transition-all text-slate-800 font-medium"
                      />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setInputAvatarUrl('');
                        }}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                      >
                        {language === 'en' ? 'Clear' : 'फोटो काढा'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (currentUser) {
                            const trimmedUrl = inputAvatarUrl.trim();
                            const updatedUser = { ...currentUser, avatar: trimmedUrl };
                            setCurrentUser(updatedUser);
                            if (setDbUsers) {
                              setDbUsers(dbUsers.map(u => u.id === currentUser.id ? updatedUser : u));
                            }
                          }
                          setIsEditingAvatar(false);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/10 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex-grow text-center"
                      >
                        {language === 'en' ? 'Save Changes' : 'बदला जतन करा'}
                      </button>
                    </div>

                  </motion.div>
                </div>
              )}

              {showAuthModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    style={{ perspective: "1200px" }}
                    className="relative bg-gradient-to-br from-white to-[#f0f9ff] rounded-3xl max-w-4xl w-full border border-sky-100 shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto min-h-[580px] text-left"
                  >
                    {/* Close button */}
                    <button
                      type="button"
                      onClick={() => setShowAuthModal(false)}
                      className="absolute top-4 right-4 z-20 text-slate-400 hover:text-slate-600 transition-colors p-1.5 bg-slate-100 hover:bg-slate-250 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm"
                    >
                      ✕
                    </button>

                    {/* Left Panel: 3D Water Splash and Can brand (visible on MD screens up) */}
                    <div className="hidden md:flex md:w-[42%] bg-gradient-to-b from-blue-600 via-sky-500 to-blue-700 p-8 text-white relative flex-col justify-between overflow-hidden">
                      {/* Interactive background shapes */}
                      <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-400 rounded-full mix-blend-screen filter blur-2xl opacity-40 animate-pulse" />
                      <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-sky-300 rounded-full mix-blend-screen filter blur-2xl opacity-30" />
                      
                      {/* Logo header */}
                      <div className="relative z-10 flex items-center space-x-2.5 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 self-start">
                        <div className="bg-white p-1.5 rounded-xl text-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12,2.69C11.83,2.69 11.66,2.71 11.49,2.77C9.92,3.31 4,5.43 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,5.43 14.07,3.31 12.5,2.77C12.33,2.71 12.16,2.69 12,2.69M12,4.82C15.65,6.03 18,9 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9 8.35,6.03 12,4.82M12,8.5A3.5,3.5 0 0,0 8.5,12A3.5,3.5 0 0,0 12,15.5A3.5,3.5 0 0,0 15.5,12A3.5,3.5 0 0,0 12,8.5Z" />
                          </svg>
                        </div>
                        <span className="font-extrabold text-sm tracking-wider font-sans text-white">SHRIRAM JAL</span>
                      </div>

                      {/* Animated Water Can Graphic */}
                      <div className="relative z-10 my-auto py-4 flex flex-col items-center">
                        <div className="animate-[bounce_3.5s_infinite] select-none hover:scale-105 transition-transform duration-300 pointer-events-none drop-shadow-[0_20px_35px_rgba(7,94,236,0.65)]">
                          {/* Rich pure SVG Blue 20L Water Bottle Graphic */}
                          <svg className="w-36 h-48 filter saturate-110 drop-shadow-md" viewBox="0 0 160 220" fill="none">
                            {/* Bottle Cap */}
                            <rect x="68" y="10" width="24" height="12" rx="3" fill="#1d4ed8" />
                            <line x1="72" y1="14" x2="88" y2="14" stroke="#60a5fa" strokeWidth="1.5" />
                            {/* Bottle Neck */}
                            <path d="M64 22H96V40H64V22Z" fill="#60a5fa" fillOpacity="0.45" stroke="#93c5fd" strokeWidth="1" />
                            <rect x="66" y="30" width="28" height="4" fill="#3b82f6" />
                            {/* Main Body */}
                            <path d="M44 42H116C128 42 136 50 136 64V190C136 202 126 210 114 210H46C34 210 24 202 24 190V64C24 50 32 42 44 42Z" fill="url(#bottleGrad)" stroke="#93c5fd" strokeWidth="1.5" />
                            {/* Structured ridges (20L design rings) */}
                            <rect x="29" y="70" width="102" height="12" rx="4" fill="#2563eb" fillOpacity="0.2" stroke="#93c5fd" strokeWidth="0.8" />
                            <rect x="29" y="100" width="102" height="12" rx="4" fill="#2563eb" fillOpacity="0.2" stroke="#93c5fd" strokeWidth="0.8" />
                            <rect x="29" y="130" width="102" height="12" rx="4" fill="#2563eb" fillOpacity="0.2" stroke="#93c5fd" strokeWidth="0.8" />
                            <rect x="29" y="160" width="102" height="12" rx="4" fill="#2563eb" fillOpacity="0.2" stroke="#93c5fd" strokeWidth="0.8" />
                            {/* Water level and splash shine inside bottle */}
                            <path d="M26 110C50 105 110 115 134 110V188C134 198 126 206 116 206H44C34 206 26 198 26 188V110Z" fill="url(#waterGrad)" fillOpacity="0.5" />
                            {/* Water Level Wave Highlights */}
                            <path d="M26 110C50 105 110 115 134 110" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
                            {/* Handle of Bottle */}
                            <path d="M136 82C143 82 148 88 148 95V125C148 132 143 138 136 138" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" fill="none" />
                            
                            {/* Bottle Label Logo */}
                            <rect x="36" y="85" width="88" height="42" rx="4" fill="#ffffff" fillOpacity="0.9" stroke="#3b82f6" strokeWidth="1" />
                            <text x="80" y="104" fill="#1e40af" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">SHRIRAM</text>
                            <text x="80" y="118" fill="#0284c7" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">100% PURE JAL</text>
                            {/* Vector Droplet Logo on Label */}
                            <path d="M80 121C81 121 82 122 82 123C82 124 81 125 80 125C79 125 78 124 78 123C78 122 79 121 80 121" fill="#3b82f6" />
                            
                            {/* Dynamic Reflections */}
                            <path d="M34 50C34 50 30 70 30 110" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
                            <path d="M124 54C124 48 116 45 110 44" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />

                            {/* Gradient definitions */}
                            <defs>
                              <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#dbeafe" />
                                <stop offset="50%" stopColor="#93c5fd" />
                                <stop offset="100%" stopColor="#3b82f6" />
                              </linearGradient>
                              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#60a5fa" />
                                <stop offset="100%" stopColor="#1d4ed8" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        <span className="mt-4 text-xs font-bold font-sans tracking-wide bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/15">
                          {language === 'en' ? '🌟 Pure Filtered Oasis' : '🌟 १००% शुद्ध जल'}
                        </span>
                      </div>

                      {/* Slogans block near target bottom */}
                      <div className="relative z-10 space-y-2 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                        <div className="text-[11px] grid grid-cols-2 gap-2 text-left font-semibold">
                          <span className="flex items-center gap-1">🛡️ {language === 'en' ? 'Pure & Safe' : 'शुद्ध आणि सुरक्षित'}</span>
                          <span className="flex items-center gap-1">📦 {language === 'en' ? 'Hygienic' : 'हायजेनिक पॅकिंग'}</span>
                          <span className="flex items-center gap-1">🛵 {language === 'en' ? 'On Time' : 'वेळेवर डिलिव्हरी'}</span>
                          <span className="flex items-center gap-1">📞 {language === 'en' ? '24/7 Hotline' : '२४x७ ग्राहक सेवा'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: Sleek Form with togglable slides & 3D Interactive Controls */}
                    <div className="w-full md:w-[58%] p-6 sm:p-8 flex flex-col justify-between relative bg-white">
                      
                      <div className="space-y-6 my-auto">
                        {/* Header titles */}
                        <div className="text-center space-y-1 mt-3">
                          <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                            {authMode === 'login' 
                              ? (language === 'en' ? 'Welcome Back!' : 'लॉगिन करा') 
                              : (language === 'en' ? 'Register Account' : 'नोंदणी करा')
                            }
                          </h3>
                          <p className="text-xs text-slate-400">
                            {language === 'en'
                              ? 'Shriram Jal - Quick Delivery Management Portal'
                              : 'श्रीराम जल - जलद डिलीव्हरी आणि व्यवस्थापन पोर्टल'}
                          </p>
                        </div>

                        {/* Interactive toggle switch styled inside a modern bubble */}
                        <div className="grid grid-cols-2 bg-sky-50 p-1.5 rounded-2xl max-w-[280px] mx-auto border border-blue-100 shadow-inner">
                          <button
                            type="button"
                            onClick={() => { setAuthMode('login'); setAuthError(''); }}
                            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                              authMode === 'login' 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15' 
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {language === 'en' ? 'Sign In' : 'लॉगिन'}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                              authMode === 'signup' 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15' 
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {language === 'en' ? 'Register' : 'नोंदणी'}
                          </button>
                        </div>

                        {/* Error box */}
                        {authError && (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold font-sans text-center border border-red-100"
                          >
                            ⚠️ {authError}
                          </motion.div>
                        )}

                        {/* Animated 3D Interactive form transition */}
                        <AnimatePresence mode="wait">
                          <motion.form 
                            key={authMode}
                            initial={{ opacity: 0, rotateY: 45, filter: "blur(4px)" }}
                            animate={{ opacity: 1, rotateY: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, rotateY: -45, filter: "blur(4px)" }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleAuthSubmit} 
                            className="space-y-4 max-w-sm mx-auto"
                          >
                            {authMode === 'signup' && (
                              <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                                  {language === 'en' ? 'Full Name' : 'पूर्ण नाव'}
                                </label>
                                <input
                                  type="text"
                                  value={authName}
                                  onChange={(e) => setAuthName(e.target.value)}
                                  placeholder={language === 'en' ? "e.g. Ranjit More" : "उदा. रणजित मोरे"}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all"
                                  required
                                />
                              </div>
                            )}

                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                                {authMode === 'login' 
                                  ? (language === 'en' ? 'Mobile Number or Email' : 'मोबाईल नंबर किंवा ईमेल')
                                  : (language === 'en' ? 'Email Address' : 'ईमेल पत्ता')
                                }
                              </label>
                              <input
                                type="text"
                                value={authMode === 'login' ? loginEmailOrPhone : authEmail}
                                onChange={(e) => authMode === 'login' ? setLoginEmailOrPhone(e.target.value) : setAuthEmail(e.target.value)}
                                placeholder={authMode === 'login' ? "9307319929 / info@shriramjal.com" : "contact@gmail.com"}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all"
                                required
                              />
                            </div>

                            {authMode === 'signup' && (
                              <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                                  {language === 'en' ? 'Contact Number (Mobile)' : 'मोबाईल नंबर'}
                                </label>
                                <input
                                  type="text"
                                  maxLength={10}
                                  value={authPhone}
                                  onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ''))}
                                  placeholder="9307319929"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all"
                                  required
                                />
                              </div>
                            )}

                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                                  {language === 'en' ? 'Password' : 'पासवर्ड'}
                                </label>
                                {authMode === 'login' && (
                                  <span className="text-[10px] text-blue-600 hover:underline cursor-pointer">
                                    {language === 'en' ? 'Forgot?' : 'पासवर्ड विसरलात?'}
                                  </span>
                                )}
                              </div>
                              <input
                                type="password"
                                value={authMode === 'login' ? loginPassword : authPassword}
                                onChange={(e) => authMode === 'login' ? setLoginPassword(e.target.value) : setAuthPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all"
                                required
                              />
                            </div>

                            {authMode === 'signup' && (
                              <div className="flex items-center space-x-2 pt-1 select-none">
                                <input type="checkbox" id="terms" defaultChecked className="rounded border-slate-200 text-blue-600 focus:ring-blue-500" required />
                                <label htmlFor="terms" className="text-[10px] text-slate-500 font-medium cursor-pointer leading-tight">
                                  {language === 'en' 
                                    ? 'I agree with the terms and security policies of Shriram Jal.' 
                                    : 'मी सर्व अटी व शर्तींना आणि सुरक्षा धोरणांना सहमत आहे.'}
                                </label>
                              </div>
                            )}

                            <button
                              type="submit"
                              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.01] text-white text-xs font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/15 active:scale-95 text-center block cursor-pointer"
                            >
                              {authMode === 'login' 
                                ? (language === 'en' ? 'Sign In Securely' : 'सुरक्षित लॉगिन करा') 
                                : (language === 'en' ? 'Create My Account' : 'नवीन नोंदणी पूर्ण करा')
                              }
                            </button>
                          </motion.form>
                        </AnimatePresence>
                      </div>

                      {/* Demo Quickfill Footer */}
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-[9.5px] text-slate-400 space-y-2 mt-4 select-none">
                        <span className="font-extrabold text-blue-800 uppercase block font-mono text-[8px] tracking-wider text-center">
                          Demo / Test Credentials (Click to Quick fill)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 col-span-1">
                          <button 
                            type="button"
                            onClick={() => {
                              setAuthEmail('9307319929');
                              setAuthPassword('user123');
                              setAuthMode('login');
                            }}
                            className="text-left p-2 bg-white border border-slate-200 rounded-xl text-[9px] hover:border-blue-500 text-blue-700 font-bold transition-all flex flex-col justify-center shadow-xs cursor-pointer"
                          >
                            <span className="text-[8px] text-slate-400 font-mono">📱 CLIENT ACCOUNT</span>
                            <span>Phone: 9307319929 / Pass: user123</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              setAuthEmail('8888888888');
                              setAuthPassword('admin123');
                              setAuthMode('login');
                            }}
                            className="text-left p-2 bg-white border border-slate-200 rounded-xl text-[9px] hover:border-purple-500 text-purple-700 font-bold transition-all flex flex-col justify-center shadow-xs cursor-pointer"
                          >
                            <span className="text-[8px] text-slate-400 font-mono">👑 ADMIN / SUPERVISOR</span>
                            <span>Phone: 8888888888 / Pass: admin123</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                </div>
              )}

            </motion.div>
          )}

          {/* ORDER CONFIRMATION PAGE */}
          {currentPage === 'confirmation' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto py-12 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 fill-current" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Order Confirmed Successfully!</h2>
                <p className="text-xs text-slate-400">Pure water cans are currently being processed at our nearest SB Road station hub.</p>
              </div>

              {/* Order quick summary */}
              {lastPlacedOrder && (
                <div className="bg-white border border-slate-100 rounded-2xl p-5 text-left space-y-4 shadow-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 font-mono text-xs">
                    <span className="text-slate-400">Order ID:</span>
                    <span className="font-extrabold text-slate-800">{lastPlacedOrder.id}</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-slate-550">
                      <span>Mapped Address:</span>
                      <span className="font-semibold text-slate-800 text-right max-w-xs truncate">{lastPlacedOrder.address_line_snapshot}</span>
                    </div>
                    <div className="flex justify-between text-slate-550">
                      <span>Delivery Slot:</span>
                      <span className="font-semibold text-slate-800">{lastPlacedOrder.delivery_slot} ({lastPlacedOrder.delivery_date})</span>
                    </div>
                    <div className="flex justify-between text-slate-550">
                      <span>Payment Settled Method:</span>
                      <span className="font-bold text-blue-900 uppercase font-mono">{lastPlacedOrder.payment_method.toUpperCase()} ({lastPlacedOrder.payment_status})</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2 flex justify-between items-center font-mono font-bold text-xs">
                    <span className="text-slate-800">Total Charged:</span>
                    <span className="text-blue-900 text-sm">₹{lastPlacedOrder.total_amount}</span>
                  </div>
                </div>
              )}

              {/* Action buttons redirects */}
              <div className="flex justify-center space-x-3 pt-2">
                <button
                  onClick={() => {
                    if (lastPlacedOrder) setActiveTrackingOrderId(lastPlacedOrder.id);
                    setCurrentPage('tracking');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 px-6 rounded-xl text-xs shadow-md shadow-blue-500/10 active:scale-95 transition-all flex items-center space-x-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Track Live Order</span>
                </button>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="bg-white border border-slate-200 text-slate-600 font-bold p-3 px-6 rounded-xl text-xs hover:border-slate-350 active:scale-95"
                >
                  Return to Home
                </button>
              </div>
            </motion.div>
          )}

          {/* DYNAMIC LIVE ORDER TRACKING PAGE */}
          {currentPage === 'tracking' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8 text-left"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600 animate-bounce" />
                    <span>Live Tracking Platform</span>
                  </h2>
                  <p className="text-xs text-slate-400">Order ID Under Tracking: <span className="font-bold underline text-blue-900 font-mono">{trackingOrder?.id || 'SJ-10025'}</span></p>
                </div>

                <div className="flex bg-white p-1 rounded-lg border border-slate-200 text-[10px] font-bold font-mono">
                  {orders.map(o => (
                    <button
                      key={o.id}
                      onClick={() => setActiveTrackingOrderId(o.id)}
                      className={`px-3 py-1.5 rounded transition-all ${
                        (trackingOrder?.id === o.id) ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {o.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Timeline status track */}
                <div className="lg:col-span-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
                  <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-widest font-mono text-slate-400">Status Timeline</h3>

                  {/* 4 Standard delivery tracking stages */}
                  <div className="space-y-4">
                    {[
                      { step: 'placed', label: 'Order Placed', time: '10:00 AM', desc: 'Secure payment confirmation received inside tbl_payments ledger.' },
                      { step: 'confirmed', label: 'Order Confirmed', time: '10:15 AM', desc: 'Pure water cans steam washed, packed, and loaded on active carriers.' },
                      { step: 'out_for_delivery', label: 'Out for Delivery', time: '10:45 AM', desc: 'Rajesh Kumar has collected containers. Dispatched on route coordinates.' },
                      { step: 'delivered', label: 'Delivered Successfully', time: 'Pending', desc: 'Hygiene can placed at threshold. Digital receipt validated.' }
                    ].map((st, idx) => {
                      // Determine timeline highlight style
                      const statusIdx = ['placed', 'confirmed', 'out_for_delivery', 'delivered'].indexOf(trackingOrder?.status || 'placed');
                      const active = idx <= statusIdx;
                      const isLast = idx === 3;

                      return (
                        <div key={st.step} className="flex space-x-3 text-xs leading-relaxed text-slate-500">
                          <div className="flex flex-col items-center">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono border leading-none ${
                              active 
                                ? 'bg-blue-600 text-white border-blue-400 shadow shadow-blue-500/10' 
                                : 'bg-slate-100 text-slate-450 border-slate-200'
                            }`}>
                              {idx + 1}
                            </span>
                            {!isLast && <div className={`w-0.5 h-16 ${active ? 'bg-blue-600' : 'bg-slate-200'}`} />}
                          </div>
                          <div className="space-y-1.5 flex-grow">
                            <div className="flex justify-between items-center">
                              <span className={`font-bold ${active ? 'text-slate-800' : 'text-slate-400'}`}>{st.label}</span>
                              <span className="font-mono text-[10px] text-slate-400">{active ? st.time : '--'}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-normal">{st.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated tracking route visualizer details */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Visual simulated map element */}
                  <div className="relative border border-blue-150 h-80 rounded-2xl bg-sky-50 shadow-sm overflow-hidden p-4 select-none flex flex-col justify-between">
                    
                    {/* Simulated visual paths and grid overlay */}
                    <div className="absolute inset-0 bg-cover pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 8%, transparent 9%)', backgroundSize: '16px 16px' }} />
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      {/* Animated dash array paths to simulate GPS pathing */}
                      <path d="M 60 140 Q 200 40 400 120 T 700 80" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" className="animate-pulse" />
                    </svg>

                    <div className="flex justify-between items-start z-10">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-600 text-white tracking-widest uppercase">
                        🗺️ Live Route GPS stream
                      </span>
                      <span className="bg-white/80 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-mono leading-none">
                        Refreshed: Real-time update
                      </span>
                    </div>

                    {/* Ingali station grid highlights */}
                    <div className="absolute top-1/4 left-1/4 bg-white/90 border border-blue-100 p-2 rounded-lg text-[10px] font-semibold text-slate-700 font-sans shadow-sm">
                      📍 Shirol Road Dispatch Hub Station (Ingali)
                    </div>

                    <div className="absolute bottom-1/5 right-1/4 bg-white/90 border border-blue-100 p-2 rounded-lg text-[10px] font-semibold text-slate-700 font-sans shadow-sm">
                      🏡 Customer Threshold Address Linked
                    </div>

                    {/* Animated Delivery boy rickshaw representation bouncing around */}
                    <div className="absolute top-1/2 left-1/3 z-20 flex flex-col items-center bg-blue-900 text-white p-2.5 rounded-lg border border-cyan-400 font-mono text-[9px] font-bold shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                      <span>🛵 FLEET ON MOTO: #{trackingBoy.id}</span>
                      <span className="block text-[8px] text-cyan-300 font-semibold">{trackingBoy.name} (In Transit)</span>
                    </div>

                  </div>

                  {/* Delivery boy specifics segment */}
                  <div className="bg-white border border-slate-100 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-3 text-left">
                      <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 font-bold">
                        🛵
                      </div>
                      <div className="space-y-0.5">
                        <span className="block font-bold text-slate-800 text-sm">{trackingBoy.name}</span>
                        <span className="block text-xs text-slate-400">Carrier Vehicle: <span className="font-bold uppercase font-mono">{trackingBoy.vehicle_no}</span></span>
                      </div>
                    </div>

                    <div className="flex text-xs space-x-6 text-left">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">Fleet Rating</span>
                        <span className="block font-bold mt-0.5 text-amber-500 font-mono">★ {trackingBoy.rating} ratings</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">Secure Contact</span>
                        <a href={`tel:${trackingBoy.phone}`} className="block font-semibold mt-0.5 text-blue-600 hover:underline font-mono">📞 {trackingBoy.phone}</a>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* MY DASHBOARD & ORDER HISTORY PAGE */}
          {currentPage === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8 text-left"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900">User Command Center</h2>
                  <p className="text-xs text-slate-400">Manage address mappings, inspect purchase history ledgers & execute reorders instantly.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left profile/address pane */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Card Profile details */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-center space-y-3 relative overflow-hidden">
                    {currentUser.avatar && currentUser.avatar.trim() !== "" ? (
                      <div className="relative group mx-auto w-16 h-16">
                        <img 
                          src={currentUser.avatar} 
                          className="w-16 h-16 rounded-full border-2 border-blue-400 mx-auto object-cover"
                          alt="user profile"
                          referrerPolicy="no-referrer"
                        />
                        <button 
                          onClick={() => {
                            setInputAvatarUrl(currentUser.avatar || '');
                            setIsEditingAvatar(true);
                          }}
                          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold cursor-pointer"
                        >
                          {language === 'en' ? 'Change' : 'बदला'}
                        </button>
                      </div>
                    ) : (
                      <div className="relative group mx-auto w-16 h-16">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-sky-400 text-white border-2 border-blue-400 flex items-center justify-center font-black text-xl shadow-sm select-none mx-auto uppercase">
                          {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'SG'}
                        </div>
                        <button 
                          onClick={() => {
                            setInputAvatarUrl('');
                            setIsEditingAvatar(true);
                          }}
                          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold cursor-pointer"
                        >
                          {language === 'en' ? 'Add Pic' : 'फोटो जोडा'}
                        </button>
                      </div>
                    )}
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-base">{currentUser.name}</h3>
                      <button 
                        onClick={() => {
                          setInputAvatarUrl(currentUser.avatar || '');
                          setIsEditingAvatar(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-[10px] font-extrabold hover:underline block mx-auto mt-1 cursor-pointer flex items-center gap-1 justify-center"
                      >
                        <Camera className="w-3 h-3" />
                        <span>{currentUser.avatar ? (language === 'en' ? 'Change Profile Picture' : 'प्रोफाईल फोटो बदला') : (language === 'en' ? 'Add Profile Picture' : 'प्रोफाईल फोटो जोडा')}</span>
                      </button>
                      <span className="text-[10px] font-bold font-mono uppercase bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full inline-block mt-2">Verified Member</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-slate-450 space-y-1.5 font-mono text-[11px] text-left">
                      <span>📧 {currentUser.email}</span>
                      <span className="block">📞 phone: +91 8856045945 , 9307319929</span>
                      <span className="block font-bold">Registered: Ingali Kolhapur
                      </span>
                    </div>

                    {/* WhatsApp Toggle Section */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-left">
                        <span className="block text-xs font-extrabold text-slate-800">
                          {language === 'en' ? 'WhatsApp Order Updates' : 'WhatsApp वर ऑर्डर अपडेट्स'}
                        </span>
                        <span className="block text-[10px] text-slate-450">
                          {language === 'en' ? 'Real-time order status tracking' : 'रिअल-टाइम ऑर्डर ट्रॅकिंग'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (!currentUser) return;
                          const nextVal = !currentUser.whatsapp_updates;
                          const updatedUser = { ...currentUser, whatsapp_updates: nextVal };
                          setCurrentUser(updatedUser);
                          if (setDbUsers && dbUsers) {
                            setDbUsers(dbUsers.map(u => u.id === currentUser.id ? updatedUser : u));
                          }
                        }}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          currentUser.whatsapp_updates ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            currentUser.whatsapp_updates ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Registered Addresses list */}
                  <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex justify-between items-center font-bold text-slate-850">
                      <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">Location Bindings</span>
                      <button onClick={() => setShowAddressModal(true)} className="text-xs text-blue-600 hover:underline">Add New</button>
                    </div>

                    <div className="space-y-3.5">
                      {addresses.map(a => (
                        <div key={a.id} className="text-xs leading-relaxed border-t border-slate-50 pt-3 first:border-0 first:pt-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-800">{a.label} Binding</span>
                            <span className="text-[10px] text-slate-400 font-mono">PIN: {a.pincode}</span>
                          </div>
                          <p className="text-slate-500 leading-normal">{a.address_line}</p>
                          <span className="text-[9px] font-mono text-cyan-600">Geo Tag: {a.lat.toFixed(3)}, {a.lng.toFixed(3)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SMS / WhatsApp Notification Subscriptions */}
                  <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex justify-between items-center font-bold text-slate-850">
                      <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">📢 {language === 'en' ? 'My SMS Alerts' : 'माझे SMS अलर्ट्स'}</span>
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full font-mono">stock_notifications</span>
                    </div>

                    {stockNotifications.length === 0 ? (
                      <p className="text-[11px] text-slate-450 py-4 text-center leading-relaxed">
                        {language === 'en' ? 'No active SMS alerts registered yet.' : 'कोणतीही नोंदणी अजून केलेली नाही.'}
                      </p>
                    ) : (
                      <div className="space-y-3 font-sans">
                        {stockNotifications.map(notif => {
                          const prod = products.find(p => p.id === notif.product_id);
                          return (
                            <div key={notif.id} className="text-xs leading-relaxed border-t border-slate-100 pt-2.5 first:border-0 first:pt-0">
                              <div className="flex justify-between items-start font-semibold text-slate-800 gap-2">
                                <span className="font-bold text-slate-800 text-left">{prod ? prod.name : 'Unknown Pure Can'}</span>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold whitespace-nowrap ${
                                  notif.notified 
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                    : 'bg-amber-100 text-amber-850 border border-amber-200 animate-pulse'
                                }`}>
                                  {notif.notified 
                                    ? (language === 'en' ? '✓ SENT SMS' : '📢 SMS पाठवला') 
                                    : (language === 'en' ? '⌛ PENDING' : '⌛ प्रलंबित')}
                                </span>
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                                <span>Mob: {notif.mobile_no}</span>
                                <span>{notif.created_at}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right purchase ledger history table */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center space-x-2">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                    <span>Purchase History Ledgers ({orders.length} orders total)</span>
                  </h3>

                  <div className="space-y-4 font-sans text-xs">
                    {orders.map(order => (
                      <div key={order.id} className="border border-slate-100 rounded-xl p-4 space-y-4 hover:border-blue-150 transition-colors">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-50 text-[11px] font-mono">
                          <div>
                            <span className="font-semibold text-slate-400">Order ID:</span>
                            <span className="font-bold text-slate-800 ml-1.5">{order.id}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400 font-mono">Date: {order.delivery_date}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              order.status === 'delivered' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : order.status === 'out_for_delivery' 
                                ? 'bg-indigo-100 text-indigo-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                          <div className="space-y-1">
                            <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wide">Shipped To:</span>
                            <p className="text-slate-700 font-medium leading-relaxed max-w-sm truncate">{order.address_line_snapshot}</p>
                            <span className="block text-[10px] text-slate-400">Preferred Slot: <span className="font-bold font-mono">{order.delivery_slot}</span></span>
                          </div>

                          <div className="flex items-center space-x-4 self-stretch sm:self-auto justify-between border-t sm:border-0 pt-2 sm:pt-0">
                            <div>
                              <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wide text-right">Settled Amount:</span>
                              <span className="font-mono text-sm font-extrabold text-blue-900">₹{order.total_amount}</span>
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setActiveTrackingOrderId(order.id);
                                  setCurrentPage('tracking');
                                }}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-1.5 rounded-lg text-[11px]"
                              >
                                View Status
                              </button>
                              <button
                                onClick={() => handleTriggerReorder(order.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] flex items-center space-x-1"
                              >
                                <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                                <span>Reorder</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* DEDICATED FULL-SCREEN AUTH/LOGIN/REGISTRATION PAGE */}
          {currentPage === 'auth' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full min-h-screen bg-gradient-to-tr from-[#F7FAFF] to-[#EAF2FF] -mx-4 sm:-mx-6 lg:-mx-8 p-4 sm:p-8 lg:p-12 font-sans select-none md:select-text rounded-3xl overflow-hidden relative shadow-inner"
            >
              {/* Subtle water light refraction accents */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-100/40 rounded-full blur-3xl pointer-events-none" />

              {/* Breadcrumb Navigation bar */}
              <div className="relative z-10 flex items-center justify-between mb-8 max-w-7xl mx-auto">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#0057D9] transition-all bg-white hover:bg-slate-50 border border-[#DCE8F8] px-4 py-2 rounded-xl shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <span className="text-slate-400">←</span>
                  <span>{language === 'en' ? 'Back to Store' : 'स्टोअरवर परत जा'}</span>
                </button>
                <div className="text-[11px] font-bold text-[#0057D9] tracking-widest font-mono bg-[#EAF4FF] px-3.5 py-1.5 rounded-full border border-blue-100 shadow-sm animate-pulse">
                  ✨ {language === 'en' ? 'SHRIRAM JAL SECURE GATEWAY' : 'श्रीराम जल सुरक्षित लॉगिन'}
                </div>
              </div>

              {/* Central Premium Container */}
              <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch bg-white/90 backdrop-blur-xl border border-[#DCE8F8] p-5 sm:p-8 lg:p-10 rounded-[36px] shadow-2xl shadow-blue-900/5 min-h-[720px]">
                
                {/* LEFT SECTION: Advanced 3D Product Visual & Branding - Positioned on the left for desktop screens */}
                <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-3xl relative overflow-hidden bg-[#EAF4FF]/40 border border-[#DCE8F8]/50 shadow-inner">
                  {/* Atmospheric soft blue overlay */}
                  <div className="absolute inset-0 bg-radial-at-t from-[#EAF4FF] via-transparent to-transparent opacity-80 pointer-events-none" />

                  {/* 1. Header Branded Area */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Droplet logo with "S" */}
                    <div className="mb-4">
                      <svg className="w-16 h-20 filter drop-shadow-[0_8px_16px_rgba(13,110,253,0.25)] hover:scale-105 transition-transform duration-300" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="dropGrad" x1="50" y1="10" x2="50" y2="110" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#3ea8ff"/>
                            <stop offset="30%" stopColor="#0D6EFD"/>
                            <stop offset="100%" stopColor="#0057D9"/>
                          </linearGradient>
                          <linearGradient id="innerSGrad" x1="50" y1="40" x2="50" y2="80" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#ffffff"/>
                            <stop offset="100%" stopColor="#e0f2fe"/>
                          </linearGradient>
                        </defs>
                        {/* Droplet Body */}
                        <path d="M50 10 C50 10 92 55 92 82 C92 105 73 120 50 120 C27 120 8 105 8 82 C8 55 50 10 50 10 Z" fill="url(#dropGrad)" />
                        {/* High light reflection curve */}
                        <path d="M22 75 C18 85 24 98 35 102" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
                        {/* Inner elegant dash circle ring */}
                        <circle cx="50" cy="82" r="18" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
                        {/* Centered premium "S" symbol */}
                        <text x="50" y="89" fill="url(#innerSGrad)" fontSize="22" fontWeight="950" textAnchor="middle" fontFamily="'Inter', 'Space Grotesk', sans-serif" letterSpacing="-0.5">S</text>
                      </svg>
                    </div>

                    {/* Brand Name */}
                    <h1 className="text-3xl font-black tracking-tight text-[#0057D9] font-sans drop-shadow-sm select-none">
                      SHRIRAM JAL
                    </h1>

                    {/* Marathi Tagline */}
                    <div className="flex items-center justify-center space-x-3.5 mt-2">
                      <div className="h-[2px] w-6 bg-[#0D6EFD]/35" />
                      <p className="text-sm font-extrabold tracking-wide text-[#1E293B]">
                        शुद्ध जल, स्वस्थ जीवन
                      </p>
                      <div className="h-[2px] w-6 bg-[#0D6EFD]/35" />
                    </div>
                  </div>

                  {/* 2. Hyper Realistic 3D Product Layout Assembly - Photographic Quality Graphic */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-6 select-none max-w-[340px] mx-auto rounded-3xl overflow-hidden border border-blue-100 bg-white shadow-lg shadow-blue-500/5 group hover:border-[#0057D9]/20 transition-all duration-300">
                    <img 
                      src={loginSideImg} 
                      alt="Shriram Jal Premium Products" 
                      className="w-full h-auto object-cover max-h-[300px] transition-transform duration-350 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* 3. Bottom Premium Feature Card (4 Columns Icons) */}
                  <div className="relative z-10 bg-white/75 backdrop-blur-md rounded-2xl p-4 border border-[#e0f2fe] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shadow-md shadow-blue-900/5">
                    
                    {/* Badge 1: 100% Pure */}
                    <div className="flex flex-col items-center p-2 bg-gradient-to-b from-white to-[#EAF4FF] rounded-xl border border-blue-50/50 hover:scale-[1.03] transition-all duration-300">
                      <div className="bg-[#EAF4FF] text-[#0D6EFD] w-8 h-8 rounded-full flex items-center justify-center mb-1.5 shadow-sm">
                        <Droplet className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-black text-slate-800 tracking-tight leading-tight block">
                        100%
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 whitespace-nowrap block">
                        शुद्ध जल
                      </span>
                    </div>

                    {/* Badge 2: Safe */}
                    <div className="flex flex-col items-center p-2 bg-gradient-to-b from-white to-[#EAF4FF] rounded-xl border border-blue-50/50 hover:scale-[1.03] transition-all duration-300">
                      <div className="bg-[#EAF4FF] text-[#0D6EFD] w-8 h-8 rounded-full flex items-center justify-center mb-1.5 shadow-sm">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-black text-slate-800 tracking-tight leading-tight block">
                        सुरक्षित
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 whitespace-nowrap block">
                        और हाइजेनिक
                      </span>
                    </div>

                    {/* Badge 3: Fast Delivery */}
                    <div className="flex flex-col items-center p-2 bg-gradient-to-b from-white to-[#EAF4FF] rounded-xl border border-blue-50/50 hover:scale-[1.03] transition-all duration-300">
                      <div className="bg-[#EAF4FF] text-[#0D6EFD] w-8 h-8 rounded-full flex items-center justify-center mb-1.5 shadow-sm">
                        <Truck className="w-4 h-4 animate-bounce" style={{ animationDuration: '3s' }} />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-black text-slate-800 tracking-tight leading-tight block">
                        समय पर
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 whitespace-nowrap block">
                        डिलिव्हरी
                      </span>
                    </div>

                    {/* Badge 4: Customer Support */}
                    <div className="flex flex-col items-center p-2 bg-gradient-to-b from-white to-[#EAF4FF] rounded-xl border border-blue-50/50 hover:scale-[1.03] transition-all duration-300">
                      <div className="bg-[#EAF4FF] text-[#0D6EFD] w-8 h-8 rounded-full flex items-center justify-center mb-1.5 shadow-sm">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-black text-slate-800 tracking-tight leading-tight block">
                        24x7
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 whitespace-nowrap block">
                        ग्राहक सेवा
                      </span>
                    </div>

                  </div>
                </div>

                {/* RIGHT SECTION: Dual Auth Card Glass Matrix - Positioned on the right for desktop screens */}
                <div className="lg:col-span-7 flex flex-col justify-center relative pl-0 lg:pl-4">
                  
                  {/* Validation Error Alert Box */}
                  {authError && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mb-6 p-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-2xl text-xs font-bold font-mono text-center flex items-center justify-center space-x-2 shadow-sm transition-all"
                    >
                      <span>⚠️</span>
                      <span>{authError}</span>
                    </motion.div>
                  )}

                  {/* Smart sliding responsive tab header for mobile / small screen layouts strictly */}
                  <div className="flex md:hidden bg-slate-200/80 p-1 rounded-2xl mb-6 max-w-sm w-full mx-auto shadow-sm">
                    <button
                      onClick={() => setAuthMode('login')}
                      className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                        authMode === 'login' ? 'bg-white text-[#0D6EFD] shadow-md' : 'text-slate-600 hover:text-slate-850'
                      }`}
                    >
                      लॉगिन करा (Login)
                    </button>
                    <button
                      onClick={() => setAuthMode('signup')}
                      className={`flex-1 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                        authMode === 'signup' ? 'bg-white text-[#0D6EFD] shadow-md' : 'text-slate-600 hover:text-slate-850'
                      }`}
                    >
                      नोंदणी करा (Register)
                    </button>
                  </div>

                  {/* Desktop layout: Side-by-Side Dual Neumorphic Matrix Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    
                    {/* CARD 1: LOGIN FORM (लॉगिन करा) (Fully responsive tab visibility for mobile) */}
                    <div className={`rounded-[25px] border border-[#DCE8F8] bg-white p-6 pb-8 shadow-[0_15px_30px_rgba(30,58,138,0.04)] relative pt-12 flex flex-col justify-between transition-transform duration-300 hover:shadow-md hover:scale-[1.01] ${
                      authMode !== 'login' ? 'hidden md:flex' : 'flex'
                    }`}>
                      {/* Floating beautiful user circle badge strictly translated */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-[#EAF4FF] to-white border-2 border-white flex items-center justify-center shadow-lg shadow-blue-500/10 text-[#0D6EFD]">
                        <UserIcon className="w-6 h-6 stroke-[2.5]" />
                      </div>

                      <form onSubmit={(e) => handleAuthSubmit(e, 'login')} className="space-y-4">
                        {/* Upper Login Header */}
                        <div className="text-center pb-3 border-b border-slate-50">
                          <h2 className="text-lg font-black text-slate-800">लॉगिन करा</h2>
                          <p className="text-[11px] text-slate-400 font-bold tracking-wide mt-0.5">
                            {language === 'en' ? 'Welcome back! Sign in securely' : 'आपल्या खात्यात लॉगिन करा'}
                          </p>
                        </div>

                        {/* Username Field */}
                        <div className="space-y-1 text-left">
                          <label className="text-[10px] text-slate-500 font-black block tracking-wider uppercase font-sans">
                            {language === 'en' ? 'Mobile Number or Email' : 'मोबाईल नंबर किंवा ईमेल'}
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#0D6EFD]">
                              📳
                            </span>
                            <input
                              type="text"
                              required
                              value={loginEmailOrPhone}
                              onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                              placeholder={language === 'en' ? 'e.g. 98xxxx77 or email' : 'मोबाईल नंबर किंवा ईमेल टाका'}
                              className="w-full bg-[#F7FAFF] border border-[#DCE8F8] rounded-xl pl-10 pr-4 py-3 text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-[#0D6EFD] focus:bg-white focus:ring-1 focus:ring-[#0D6EFD] font-bold shadow-[inset_-2px_-2px_6px_rgba(255,255,255,0.7),inset_2px_2px_6px_rgba(0,0,0,0.02)] transition-all duration-300"
                            />
                          </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1 text-left">
                          <div className="flex justify-between items-center z-10 relative">
                            <label className="text-[10px] text-slate-500 font-black block tracking-wider uppercase font-sans">
                              {language === 'en' ? 'Password' : 'पासवर्ड'}
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                alert(language === 'en' ? 'Standard demo credential is simple (use 555555).' : 'डेमो खात्यासाठी ५५५५५५ पासवर्ड वापरून पहा किंवा नवीन खाते तयार करा.');
                              }}
                              className="text-[10px] text-[#0057D9] hover:underline font-extrabold cursor-pointer transition-all"
                            >
                              {language === 'en' ? 'Forgot password?' : 'पासवर्ड विसरलात?'}
                            </button>
                          </div>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#0057D9]">
                              🔒
                            </span>
                            <input
                              type={showLoginPassword ? 'text' : 'password'}
                              required
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              placeholder="••••••"
                              className="w-full bg-[#F7FAFF] border border-[#DCE8F8] rounded-xl pl-10 pr-10 py-3 text-xs text-slate-850 placeholder-slate-450 focus:outline-none focus:border-[#0D6EFD] focus:bg-white focus:ring-1 focus:ring-[#0D6EFD] font-mono font-bold shadow-[inset_-2px_-2px_6px_rgba(255,255,255,0.7),inset_2px_2px_6px_rgba(0,0,0,0.02)] transition-all duration-300"
                            />
                            {/* Toggle visibility lock Eye */}
                            <button
                              type="button"
                              onClick={() => setShowLoginPassword(!showLoginPassword)}
                              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0D6EFD] cursor-pointer transition-colors"
                            >
                              {showLoginPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                          </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center space-x-2 text-[11px] text-slate-500 font-bold cursor-pointer hover:text-slate-700 transition-colors">
                            <input
                              type="checkbox"
                              checked={authRememberMe}
                              onChange={(e) => setAuthRememberMe(e.target.checked)}
                              className="w-4 h-4 rounded text-[#0D6EFD] focus:ring-[#0D6EFD] border-[#DCE8F8] cursor-pointer bg-[#F7FAFF]"
                            />
                            <span>{language === 'en' ? 'Remember me' : 'मला आठवा'}</span>
                          </label>
                        </div>

                        {/* Submit Button with rich Blue Gradient */}
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#0D6EFD] to-[#0057D9] hover:from-[#0057D9] hover:to-[#0D6EFD] text-white font-black text-xs py-3.5 rounded-xl shadow-lg shadow-blue-500/15 cursor-pointer hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center space-x-2"
                        >
                          <span>{language === 'en' ? 'SECURE LOGIN' : 'लॉगिन करा'}</span>
                        </button>

                        {/* OR Connect separator */}
                        <div className="relative flex items-center justify-center my-4">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100" />
                          </div>
                          <span className="relative px-3.5 bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'en' ? 'Or' : 'किंवा'}</span>
                        </div>

                        {/* Three premium social icon bubbles matching reference */}
                        <div className="flex items-center justify-center space-x-4">
                          <button
                            type="button"
                            onClick={() => alert('Signing in with Google sandbox... Try seed credentials if needed.')}
                            className="w-10 h-10 rounded-full border border-[#DCE8F8] flex items-center justify-center bg-white hover:bg-[#F7FAFF] shadow-sm hover:scale-105 active:scale-95 cursor-pointer transition-all"
                            title="Google Connect"
                          >
                            <span className="text-sm font-black text-[#ea4335]">G</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => alert('Signing in with Facebook sandbox...')}
                            className="w-10 h-10 rounded-full border border-[#DCE8F8] flex items-center justify-center bg-white hover:bg-[#F7FAFF] shadow-sm hover:scale-105 active:scale-95 cursor-pointer transition-all"
                            title="Facebook Connect"
                          >
                            <span className="text-sm font-black text-[#1877f2]">f</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => alert('Live tracking linked directly over WhatsApp!')}
                            className="w-10 h-10 rounded-full border border-[#DCE8F8] flex items-center justify-center bg-white hover:bg-emerald-50 shadow-sm hover:scale-105 active:scale-95 cursor-pointer transition-all"
                            title="WhatsApp Connect"
                          >
                            <span className="text-sm text-[#25d366]">💬</span>
                          </button>
                        </div>
                      </form>

                      {/* Small switcher links beneath tab */}
                      <div className="mt-4 pt-3.5 border-t border-slate-100 text-center text-[11px] text-slate-400 font-bold block md:hidden">
                        {language === 'en' ? "Don't have an account?" : "नवीन खाते तयार करायचे आहे?"}{' '}
                        <button
                          onClick={() => setAuthMode('signup')}
                          className="text-[#0D6EFD] hover:underline font-extrabold cursor-pointer"
                        >
                          {language === 'en' ? 'Register here' : 'नोंदणी करा'}
                        </button>
                      </div>
                    </div>


                    {/* CARD 2: REGISTRATION FORM (नोंदणी करा) (Fully responsive tab visibility) */}
                    <div className={`rounded-[25px] border border-[#DCE8F8] bg-white p-6 pb-8 shadow-[0_15px_30px_rgba(30,58,138,0.04)] relative pt-12 flex flex-col justify-between transition-transform duration-300 hover:shadow-md hover:scale-[1.01] ${
                      authMode !== 'signup' ? 'hidden md:flex' : 'flex'
                    }`}>
                      {/* Floating beautiful avatar badge with Plus */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-[#EAF4FF] to-white border-2 border-white flex items-center justify-center shadow-lg shadow-blue-500/10 text-[#0D6EFD]">
                        <UserPlus className="w-6 h-6 stroke-[2.5]" />
                      </div>

                      <form 
                        onSubmit={(e) => handleAuthSubmit(e, 'signup')} 
                        className="space-y-3"
                      >
                        {/* Upper Header */}
                        <div className="text-center pb-2.5 border-b border-slate-50">
                          <h2 className="text-lg font-black text-slate-800">नोंदणी करा</h2>
                          <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                            {language === 'en' ? 'Create a secure new account' : 'नवीन खाते तयार करा'}
                          </p>
                        </div>

                        {/* Full Name input */}
                        <div className="space-y-0.5 text-left">
                          <label className="text-[10px] text-slate-500 font-black block tracking-wider uppercase font-sans">
                            {language === 'en' ? 'Full Name' : 'संपूर्ण नाव'}
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#0057D9]">
                              👤
                            </span>
                            <input
                              type="text"
                              required
                              value={authName}
                              onChange={(e) => setAuthName(e.target.value)}
                              placeholder={language === 'en' ? 'Ramesh Patil' : 'तुमचे संपूर्ण नाव टाका'}
                              className="w-full bg-[#F7FAFF] border border-[#DCE8F8] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-[#0D6EFD] focus:bg-white font-bold shadow-[inset_-1px_-1px_4px_rgba(255,255,255,0.7),inset_1px_1px_4px_rgba(0,0,0,0.02)]"
                            />
                          </div>
                        </div>

                        {/* Mobile Phone number */}
                        <div className="space-y-0.5 text-left">
                          <label className="text-[10px] text-slate-500 font-black block tracking-wider uppercase font-sans">
                            {language === 'en' ? 'Mobile Number' : 'मोबाईल नंबर'}
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#0057D9]">
                              📞
                            </span>
                            <input
                              type="tel"
                              required
                              value={authPhone}
                              onChange={(e) => setAuthPhone(e.target.value)}
                              placeholder="98xxxxxx55"
                              className="w-full bg-[#F7FAFF] border border-[#DCE8F8] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-850 placeholder-slate-450 focus:outline-none focus:border-[#0D6EFD] focus:bg-white font-bold font-mono shadow-[inset_-1px_-1px_4px_rgba(255,255,255,0.7),inset_1px_1px_4px_rgba(0,0,0,0.02)]"
                            />
                          </div>
                        </div>

                        {/* Optional Email */}
                        <div className="space-y-0.5 text-left">
                          <label className="text-[10px] text-slate-500 font-black block tracking-wider uppercase font-sans">
                            {language === 'en' ? 'Email Address (Optional)' : 'ईमेल (पर्यायी)'}
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#0057D9]">
                              ✉️
                            </span>
                            <input
                              type="email"
                              value={authEmail}
                              onChange={(e) => setAuthEmail(e.target.value)}
                              placeholder="name@shriramjal.com"
                              className="w-full bg-[#F7FAFF] border border-[#DCE8F8] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-850 placeholder-slate-450 focus:outline-none focus:border-[#0D6EFD] focus:bg-white font-bold font-mono shadow-[inset_-1px_-1px_4px_rgba(255,255,255,0.7),inset_1px_1px_4px_rgba(0,0,0,0.02)]"
                            />
                          </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-0.5 text-left">
                          <label className="text-[10px] text-slate-500 font-black block tracking-wider uppercase font-sans">
                            {language === 'en' ? 'Choose Password' : 'पासवर्ड'}
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#0057D9]">
                              🔒
                            </span>
                            <input
                              type={showRegisterPassword ? 'text' : 'password'}
                              required
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              placeholder="•••••"
                              className="w-full bg-[#F7FAFF] border border-[#DCE8F8] rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-850 placeholder-slate-450 focus:outline-none focus:border-[#0D6EFD] focus:bg-white font-mono font-bold shadow-[inset_-1px_-1px_4px_rgba(255,255,255,0.7),inset_1px_1px_4px_rgba(0,0,0,0.02)]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
                            >
                              {showRegisterPassword ? '👁' : '👁️‍🗨️'}
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-0.5 text-left">
                          <label className="text-[10px] text-slate-500 font-black block tracking-wider uppercase font-sans">
                            {language === 'en' ? 'Re-enter Password' : 'पासवर्ड पुन्हा टाका'}
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#0057D9]">
                              🔒
                            </span>
                            <input
                              type={showRegisterConfirmPassword ? 'text' : 'password'}
                              required
                              value={authConfirmPassword}
                              onChange={(e) => setAuthConfirmPassword(e.target.value)}
                              placeholder="•••••"
                              className="w-full bg-[#F7FAFF] border border-[#DCE8F8] rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-850 placeholder-slate-450 focus:outline-none focus:border-[#0D6EFD] focus:bg-white font-mono font-bold shadow-[inset_-1px_-1px_4px_rgba(255,255,255,0.7),inset_1px_1px_4px_rgba(0,0,0,0.02)]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
                            >
                              {showRegisterConfirmPassword ? '👁' : '👁️‍🗨️'}
                            </button>
                          </div>
                        </div>

                        {/* Terms Checkbox */}
                        <label className="flex items-start space-x-2 text-[10px] text-slate-500 font-bold cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={authTermsAccepted}
                            onChange={(e) => setAuthTermsAccepted(e.target.checked)}
                            className="w-4 h-4 rounded text-[#0D6EFD] focus:ring-[#0D6EFD] border-[#DCE8F8] cursor-pointer mt-0.5"
                          />
                          <span className="leading-tight">
                            {language === 'en' ? 'I agree to the Terms, Conditions & Privacy Policy.' : 'मी श्रीराम जलच्या नियम, अटी व गोपनीयता धोरणांशी सहमत आहे.'}
                          </span>
                        </label>

                        {/* Submit button with Blue Gradient */}
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#0D6EFD] to-[#0057D9] hover:from-[#0057D9] hover:to-[#0D6EFD] text-white font-black text-xs py-3 rounded-xl shadow-lg shadow-blue-500/15 cursor-pointer hover:scale-[1.01] active:scale-95 transition-all text-center flex items-center justify-center space-x-1"
                        >
                          <span>{language === 'en' ? 'CREATE SECURE ACCOUNT' : 'नोंदणी करा'}</span>
                        </button>
                      </form>

                      {/* Small switcher link under the card */}
                      <div className="mt-4 pt-3 border-t border-slate-100 text-center text-[11px] text-slate-400 font-bold block md:hidden">
                        {language === 'en' ? 'Already member?' : 'आधीच खाते आहे?'}{' '}
                        <button
                          onClick={() => setAuthMode('login')}
                          className="text-[#0D6EFD] hover:underline font-extrabold cursor-pointer"
                        >
                          {language === 'en' ? 'Login here' : 'लॉगिन करा'}
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
};
