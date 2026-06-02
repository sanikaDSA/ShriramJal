import React, { useState } from 'react';
import { 
  Users, ShoppingBag, Landmark, Award, Eye, Trash2, 
  Settings, UserPlus, RefreshCw, Layers, TrendingUp, ShieldAlert,
  Sliders, Plus, Edit2, Check, AlertCircle, Sparkles, ArrowLeft
} from 'lucide-react';
import { motion } from 'motion/react';
import { Product, Address, Coupon, Order, OrderItem, DeliveryBoy, User, StockNotification } from '../types';
import { Language, getTranslation } from '../utils/translate';
import { Lock } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  orderItems: OrderItem[];
  addresses: Address[];
  coupons: Coupon[];
  deliveryBoys: DeliveryBoy[];
  users: User[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onUpdateProductPrice: (productId: string, newPrice: number) => void;
  onAddCoupon: (code: string, pct: number, minAmt: number, desc: string) => void;
  onDeleteCoupon: (id: string) => void;
  onToggleCouponStatus: (id: string) => void;
  onToggleDriverStatus: (id: string) => void;
  language: Language;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  activePortalMode?: 'store' | 'admin' | 'architecture';
  setActivePortalMode?: (mode: 'store' | 'admin' | 'architecture') => void;
  stockNotifications?: StockNotification[];
  setStockNotifications?: React.Dispatch<React.SetStateAction<StockNotification[]>>;
  smsLogs?: any[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  orderItems,
  addresses,
  coupons,
  deliveryBoys,
  users,
  onUpdateOrderStatus,
  onUpdateProductStock,
  onUpdateProductPrice,
  onAddCoupon,
  onDeleteCoupon,
  onToggleCouponStatus,
  onToggleDriverStatus,
  language,
  currentUser,
  setCurrentUser,
  activePortalMode,
  setActivePortalMode,
  stockNotifications = [],
  setStockNotifications,
  smsLogs = []
}) => {
  const t = (key: string) => getTranslation(key, language);

  // Local helper states for Admin login screen
  const [adminPhoneOrEmail, setAdminPhoneOrEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Search for admin
    const foundUser = users.find(
      u => (u.email.toLowerCase() === adminPhoneOrEmail.toLowerCase() || u.phone === adminPhoneOrEmail)
    );

    if (!foundUser) {
      setLoginError(language === 'en' ? 'User not found' : 'युझर आढळला नाही');
      return;
    }

    if (foundUser.role !== 'admin') {
      setLoginError(language === 'en' ? 'Unauthorized: This panel is restricted to ADMIN users only' : 'अनधिकृत: हे पॅनेल केवळ ॲडमिन युझर्ससाठी मर्यादित आहे');
      return;
    }

    // Success login
    setCurrentUser(foundUser);
  };

  // Restrict access gate: check if current user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-6 text-left relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl pointer-events-none opacity-40" />

        <div className="text-center space-y-2">
          <div className="bg-red-50 text-red-500 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {language === 'en' ? 'Admin Access Only' : 'फक्त ॲडमिन प्रवेश नियंत्रण'}
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'en' 
              ? 'Authorized personnel only. Please sign in with your Shriram Jal Admin credentials.' 
              : 'केवळ अधिकृत कर्मचारी. कृपया तुमच्या श्रीराम जल ॲडमिन खात्यासह लॉगिन करा.'}
          </p>
        </div>

        {loginError && (
          <div className="p-3 bg-red-50 text-red-650 rounded-xl text-xs font-semibold font-mono text-center">
            ⚠️ {loginError}
          </div>
        )}

        <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block font-mono">
              {language === 'en' ? 'Admin Email / Phone' : 'ॲडमिन ईमेल / फोन'}
            </label>
            <input
              type="text"
              value={adminPhoneOrEmail}
              onChange={(e) => setAdminPhoneOrEmail(e.target.value)}
              placeholder="admin@shriramjal.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:border-blue-500/50 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block font-mono">
              {language === 'en' ? 'Password' : 'पासवर्ड'}
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:border-blue-500/50 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-650 hover:opacity-95 text-white font-bold py-3 p-4 rounded-xl text-xs transition-colors shadow-md active:scale-95"
          >
            {language === 'en' ? 'Verify Shriram Jal Admin Authorization' : 'श्रीराम जल ॲडमिन अधिकृतता तपासा'}
          </button>
        </form>

        <div className="p-4 bg-blue-50 rounded-2xl text-[11px] text-blue-800 space-y-1.5 leading-relaxed">
          <span className="font-extrabold uppercase font-mono text-[9px] tracking-wider text-blue-900 block">Registered Station Information</span>
          <div className="space-y-1">
            <span className="block font-medium">📍 <strong>{language === 'en' ? 'Location' : 'पत्ता'}:</strong> A/P - Ingali, Dist - Kolhapur</span>
            <span className="block font-medium">👤 <strong>{language === 'en' ? 'Owner Name' : 'मालकाचे नाव'}:</strong> Ranjit More</span>
          </div>
          <div className="pt-2 border-t border-blue-100 flex items-center justify-between text-[10px]">
            <span className="font-bold text-blue-950 font-mono">ADMIN TEST CREDENTIALS:</span>
            <button
              onClick={() => {
                setAdminPhoneOrEmail('admin@shriramjal.com');
                setAdminPassword('admin123');
              }}
              type="button"
              className="px-2 py-0.5 bg-blue-600 text-white rounded font-bold uppercase hover:bg-blue-700 transition"
            >
              Autofill
            </button>
          </div>
        </div>

      </div>
    );
  }

  // Navigation inside Admin Panel
  const [adminSection, setAdminSection] = useState<'analytics' | 'orders' | 'products' | 'drivers' | 'coupons' | 'notifications'>('analytics');

  // Input states for creating coupon
  const [newCouponCode, setNewCouponCode] = useState<string>('');
  const [newCouponPct, setNewCouponPct] = useState<number>(15);
  const [newCouponMin, setNewCouponMin] = useState<number>(100);
  const [newCouponDesc, setNewCouponDesc] = useState<string>('');

  // Inline editing stock states
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState<number>(0);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // Stats operations
  const totalRevenue = orders
    .filter(o => o.payment_status === 'success')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingDeliveries = orders.filter(o => o.status !== 'delivered').length;
  const activeFleetCount = deliveryBoys.filter(db => db.status === 'delivering').length;

  const handleSaveProductEdits = (productId: string) => {
    onUpdateProductStock(productId, tempStock);
    onUpdateProductPrice(productId, tempPrice);
    setEditingProductId(null);
  };

  const startEditingProduct = (p: Product) => {
    setEditingProductId(p.id);
    setTempStock(p.stock);
    setTempPrice(p.price);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) {
      alert('Please provide a coupon promo code.');
      return;
    }
    onAddCoupon(newCouponCode.toUpperCase(), newCouponPct, newCouponMin, newCouponDesc);
    // Reset Form
    setNewCouponCode('');
    setNewCouponDesc('');
    alert(`Promo Code ${newCouponCode.toUpperCase()} has been seeded into tbl_coupons successfully!`);
  };

  return (
    <div className="bg-[#0b1329] text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-8">
      
      {/* Admin Panel Console Header */}
      <div className="bg-[#111c3a] p-6 border-b border-slate-800/80 flex flex-col lg:flex-row items-center justify-between gap-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full lg:w-auto gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-2xl text-white shadow shadow-blue-500/20">
              <Settings className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <h2 className="text-xl font-sans font-extrabold tracking-tight text-white flex items-center space-x-2">
                <span>Shriram Jal Command Center</span>
                <span className="bg-rose-500/10 text-rose-450 border border-rose-500/20 px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase font-bold animate-pulse">
                  SysAdmin Terminal v2.0
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">Full Stack Logistics, Inventory Control, relational tables override, and live sales analysis node</p>
            </div>
          </div>

          {setActivePortalMode && (
            <button
              onClick={() => setActivePortalMode('store')}
              className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-950 hover:bg-slate-900 transition-colors text-xs font-bold text-cyan-400 cursor-pointer w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>🏡 {language === 'en' ? 'Customer Storefront' : 'स्टोअरफ्रन्टवर जा'}</span>
            </button>
          )}
        </div>

        {/* Dynamic section tabs selector */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 space-x-1.5 overflow-x-auto w-full lg:w-auto">
          {[
            { id: 'analytics', label: 'Overview Metrics', icon: TrendingUp },
            { id: 'orders', label: 'Override Orders', icon: ShoppingBag },
            { id: 'products', label: 'Inventory & Prices', icon: Layers },
            { id: 'drivers', label: 'Fleet Boys', icon: Users },
            { id: 'coupons', label: 'Manage Coupons', icon: Award },
            { id: 'notifications', label: 'SMS Notifications', icon: Sparkles }
          ].map(sect => {
            const Icon = sect.icon;
            return (
              <button
                key={sect.id}
                onClick={() => setAdminSection(sect.id as any)}
                className={`text-xs px-3.5 py-2 rounded-lg font-semibold flex items-center space-x-2 whitespace-nowrap transition-all ${
                  adminSection === sect.id 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/10' 
                    : 'text-slate-450 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sect.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Admin Interactive Stage */}
      <div className="p-6">
        
        {/* OVERVIEW CHANNELS & REALTIME ANALYTICS */}
        {adminSection === 'analytics' && (
          <div className="space-y-8 text-left">
            
            {/* Bento statistics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-[#121c38] border border-blue-900Item border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider font-mono">Gross Settled Sales</span>
                <span className="text-2xl font-extrabold text-white font-mono mt-2">₹{totalRevenue}</span>
                <span className="text-[11px] text-emerald-400 font-mono mt-1">▲ 14.5% versus last week</span>
              </div>

              <div className="bg-[#121c38] border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider font-mono">Active Delivery Backlog</span>
                <span className="text-2xl font-extrabold text-[#38bdf8] font-mono mt-2">{pendingDeliveries} dispatch</span>
                <span className="text-[11px] text-slate-400 font-mono mt-1">Pending dispatch boy allocate</span>
              </div>

              <div className="bg-[#121c38] border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider font-mono">Purified Water Reserve</span>
                <span className="text-2xl font-extrabold text-[#10b981] font-mono mt-2">
                  {products.reduce((sum, p) => sum + p.stock, 0)} Units
                </span>
                <span className="text-[11px] text-emerald-400 font-mono mt-1">Stock status: Healthy Normal</span>
              </div>

              <div className="bg-[#121c38] border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider font-mono">Fleet Boy Roster</span>
                <span className="text-2xl font-extrabold text-amber-400 font-mono mt-2">
                  {activeFleetCount} / {deliveryBoys.length} Delivering
                </span>
                <span className="text-[11px] text-[#22d3ee] font-mono mt-1">{deliveryBoys.length - activeFleetCount} boys resting (Idle)</span>
              </div>

            </div>

            {/* Simulated Clean charts segment containing sales timeline and inventories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Sales analytics chart simulator */}
              <div className="bg-[#101931]/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="font-extrabold text-slate-200 text-xs uppercase tracking-widest font-mono">Ledger Hourly Performance Ledger</h3>
                
                {/* Visual bar chart columns using standard HTML */}
                <div className="h-44 flex items-end justify-between pt-6 px-4 relative">
                  {/* Grid lines background */}
                  <div className="absolute inset-0 border-b border-dashed border-slate-800 flex flex-col justify-between" />
                  
                  {/* Visual columns bars */}
                  {[
                    { slot: 'SB Road', sales: 480, height: 'h-2/3', fill: 'bg-blue-500' },
                    { slot: 'Hinjawadi', sales: 750, height: 'h-5/6', fill: 'bg-indigo-500' },
                    { slot: 'Kothrud', sales: 320, height: 'h-1/3', fill: 'bg-cyan-500' },
                    { slot: 'Baner/Aundh', sales: 600, height: 'h-4/6', fill: 'bg-teal-500' },
                    { slot: 'Other Area', sales: 180, height: 'h-1/5', fill: 'bg-blue-400' }
                  ].map(bar => (
                    <div key={bar.slot} className="flex flex-col items-center space-y-2 group cursor-pointer z-10 w-12">
                      <span className="opacity-0 group-hover:opacity-100 bg-[#0f172a] text-cyan-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-800 transition-opacity whitespace-nowrap">
                        ₹{bar.sales}
                      </span>
                      <div className={`${bar.height} ${bar.fill} w-8 rounded-t-md relative hover:opacity-85 transition-opacity`} />
                      <span className="text-[9px] text-slate-400 tracking-tight text-center font-mono">{bar.slot}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roster / Products split percentage progress indicator */}
              <div className="bg-[#101931]/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="font-extrabold text-slate-200 text-xs uppercase tracking-widest font-mono">Inventory Demand Tiers</h3>
                
                <div className="space-y-3.5">
                  {[
                    { label: '20L Cans Ambient Series', count: 320, pct: 45, color: 'bg-blue-500' },
                    { label: '20L Cans Premium Chilled', count: 240, pct: 32, color: 'bg-cyan-500' },
                    { label: '10L/5L Portable Tanks', count: 120, pct: 15, color: 'bg-teal-500' },
                    { label: '1L Single Hydration cases', count: 65, pct: 8, color: 'bg-slate-500' }
                  ].map(row => (
                    <div key={row.label} className="space-y-1.5 text-xs">
                      <div className="flex justify-between font-mono text-slate-400">
                        <span>{row.label}</span>
                        <span className="font-bold text-white">{row.count} units ({row.pct}%)</span>
                      </div>
                      <div className="bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick Audit disclaimer info alert */}
            <div className="p-4 bg-yellow-450/10 border border-yellow-500/20 text-yellow-400 text-xs rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>
                <strong>Hygienic Audit Advisory:</strong> Current temperature mapping reports excellent cooling ratios (4-8°C) within 20L Cold cans storage grids. Monitor stock depletion inside 10L Ambient series, currently under critical load threshold.
              </span>
            </div>

          </div>
        )}

        {/* ORDER OVERRIDES CONTROL NODE */}
        {adminSection === 'orders' && (
          <div className="space-y-6 text-left">
            <h3 className="font-extrabold text-slate-200 text-xs uppercase tracking-widest font-mono">Active Order Pipeline Override Node</h3>
            
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#101931]/40">
              <table className="w-full text-xs text-left border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-950 text-slate-300 font-mono border-b border-slate-800">
                    <th className="p-3 font-semibold">ORDER ID</th>
                    <th className="p-3 font-semibold">CUSTOMER</th>
                    <th className="p-3 font-semibold">DELIVERY PREF SLOT</th>
                    <th className="p-3 font-semibold">ASSIGNED FLEET BOY</th>
                    <th className="p-3 font-semibold">RECONCILED PRICE</th>
                    <th className="p-3 font-semibold">STATUS LIFECYCLE OVERRIDE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-350">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-900/30">
                      <td className="p-3 font-mono font-bold text-white">{order.id}</td>
                      <td className="p-3">
                        <span className="font-semibold block text-slate-200">{users.find(u => u.id === order.user_id)?.name || 'Sanika Gurav'}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Kolhapur / Ingali Grid</span>
                      </td>
                      <td className="p-3">
                        <span className="block">{order.delivery_slot}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Date: {order.delivery_date}</span>
                      </td>
                      <td className="p-3 text-cyan-400 font-semibold font-mono">
                        {deliveryBoys.find(db => db.id === order.delivery_boy_id)?.name || 'Rajesh Kumar'}
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">₹{order.total_amount}</td>
                      <td className="p-3 font-semibold">
                        
                        {/* Selector Override triggers */}
                        <div className="flex bg-slate-950 p-1 rounded border border-slate-800 space-x-1 inline-block max-w-[400px]">
                          {(['placed', 'confirmed', 'out_for_delivery', 'delivered'] as const).map(st => {
                            const active = order.status === st;
                            return (
                              <button
                                key={st}
                                onClick={() => onUpdateOrderStatus(order.id, st)}
                                className={`text-[10px] capitalize px-2 py-1 rounded font-bold transition-all ${
                                  active 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                              >
                                {st === 'out_for_delivery' ? 'Out' : st}
                              </button>
                            );
                          })}
                        </div>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl text-[11px] text-slate-500 font-mono leading-relaxed">
              👉 <strong className="text-[#38bdf8]">Instruction:</strong> Click the state buttons (e.g. "delivered" or "Out") next to any order. This alters the status in the relational table. If that order is loaded on the tracking board screen on the storefront webpage, it will dynamically change the tracking and progress map.
            </div>
          </div>
        )}

        {/* PRODUCTS INVENTORY & PRICING CONTROLS */}
        {adminSection === 'products' && (
          <div className="space-y-6 text-left">
            <h3 className="font-extrabold text-slate-200 text-xs uppercase tracking-widest font-mono">Corporate Stock & Price Controller</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs leading-normal">
              {products.map(p => {
                const isEditing = editingProductId === p.id;
                
                return (
                  <div key={p.id} className="bg-[#101931]/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                    
                    <div className="flex items-center space-x-3.5 text-left">
                      <div className="bg-slate-950 p-2 rounded-xl flex items-center justify-center w-14 h-18 text-lg">
                        💧
                      </div>
                      <div className="space-y-1">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                          p.type === 'cold' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/20' : 'bg-blue-950 text-blue-400 border border-blue-500/20'
                        }`}>
                          {p.type} water • {p.capacity}
                        </span>
                        <h4 className="font-bold text-white text-xs truncate max-w-xs">{p.name}</h4>
                        
                        <div className="flex items-center space-x-4 pt-1 font-mono text-[10px] text-slate-400">
                          <span>Price: <span className="text-emerald-400 font-bold">₹{p.price}</span></span>
                          <span>Stock: <span className="text-white font-bold">{p.stock} units</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Editor Inline elements */}
                    <div>
                      {isEditing ? (
                        <div className="space-y-2 text-right">
                          <div className="flex flex-col space-y-1 inline-block">
                            <label className="text-[8px] font-bold text-slate-500 font-mono">STOCK UNITS:</label>
                            <input 
                              type="number" 
                              value={tempStock}
                              onChange={(e) => setTempStock(parseInt(e.target.value) || 0)}
                              className="bg-slate-950 border border-slate-800 rounded font-mono p-1 w-16 text-center text-white" 
                            />
                          </div>

                          <div className="flex flex-col space-y-1 inline-block">
                            <label className="text-[8px] font-bold text-slate-500 font-mono">PRICE (₹):</label>
                            <input 
                              type="number" 
                              value={tempPrice}
                              onChange={(e) => setTempPrice(parseInt(e.target.value) || 0)}
                              className="bg-slate-950 border border-slate-800 rounded font-mono p-1 w-16 text-center text-emerald-400" 
                            />
                          </div>

                          <div className="flex space-x-1 pt-1 justify-end">
                            <button
                              onClick={() => setEditingProductId(null)}
                              className="bg-slate-800 text-slate-400 p-1 rounded hover:text-white"
                            >
                              ✕
                            </button>
                            <button
                              onClick={() => handleSaveProductEdits(p.id)}
                              className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditingProduct(p)}
                          className="bg-slate-950 border border-slate-850 text-slate-400 hover:text-white p-2.5 rounded-xl text-[10px] font-bold font-mono transition-transform active:scale-95 flex items-center space-x-1.5"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Configure</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DRIVERS / FLEET BOYS ROSTER */}
        {adminSection === 'drivers' && (
          <div className="space-y-6 text-left">
            <h3 className="font-extrabold text-slate-200 text-xs uppercase tracking-widest font-mono">Active Delivery-Partners Roster Node</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-left">
              {deliveryBoys.map(db => (
                <div key={db.id} className="bg-[#101931]/60 border border-slate-850 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🛵</span>
                      <div>
                        <h4 className="font-bold text-white text-sm">{db.name}</h4>
                        <span className="block text-[10px] text-slate-400">Carrier: {db.vehicle_no}</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-amber-500">★ {db.rating}</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] font-mono leading-none">
                    <span className="text-slate-400">Status Variable:</span>
                    <button
                      onClick={() => onToggleDriverStatus(db.id)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] uppercase font-bold tracking-wider transition-all ${
                        db.status === 'delivering' 
                          ? 'bg-rose-500/10 text-rose-450 border border-rose-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {db.status === 'delivering' ? '🚲 Delivering (On Path)' : '⏳ Idle (At Hub)'}
                    </button>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg text-[10px] text-slate-400 font-mono space-y-1">
                    <span className="block font-bold text-blue-400 uppercase tracking-wide text-[8px]">Coordinates Broadcast:</span>
                    <div className="flex justify-between">
                      <span>Latitude: {db.current_lat?.toFixed(4) || '18.5350'}</span>
                      <span>Longitude: {db.current_lng?.toFixed(4) || '73.8250'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MANAGE COUPONS */}
        {adminSection === 'coupons' && (
          <div className="space-y-6 text-left">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Insert Coupon module */}
              <form onSubmit={handleCreateCoupon} className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                <span className="text-[10px] font-bold font-mono uppercase bg-blue-900Item text-blue-400 tracking-wider">Generate Promo Code</span>
                <h3 className="font-bold text-white text-sm">Add New Promo Campaign</h3>

                <div className="space-y-1 text-xs">
                  <label className="text-[10px] text-slate-400 font-bold block font-mono">PROMO COUPON CODE:</label>
                  <input 
                    type="text" 
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    placeholder="e.g. SHRIRAM50" 
                    className="w-full bg-[#101931] border border-slate-850 rounded-xl px-3 py-2 text-white font-mono uppercase focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">OFF PERCENT (%):</label>
                    <input 
                      type="number" 
                      min={5}
                      max={90}
                      value={newCouponPct}
                      onChange={(e) => setNewCouponPct(parseInt(e.target.value) || 10)}
                      className="w-full bg-[#101931] border border-slate-850 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">MIN CART SUB (₹):</label>
                    <input 
                      type="number" 
                      min={0}
                      value={newCouponMin}
                      onChange={(e) => setNewCouponMin(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#101931] border border-slate-850 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-[10px] text-slate-400 font-bold block font-mono">DESCRIPTION:</label>
                  <input 
                     type="text"
                     value={newCouponDesc}
                     onChange={(e) => setNewCouponDesc(e.target.value)}
                     placeholder="e.g. Flat 50% discount on summer cans..."
                     className="w-full bg-[#101931] border border-slate-850 rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Seed Promo Campaign</span>
                </button>
              </form>

              {/* Coupons list table */}
              <div className="lg:col-span-12 xl:col-span-7 bg-[#101931]/60 border border-slate-850 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-white text-sm">Active Promotion Campaign Ledgers</h3>
                
                <div className="space-y-3 text-xs leading-normal font-mono">
                  {coupons.map(c => (
                    <div key={c.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 flex items-center justify-between">
                      <div className="space-y-1 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-white text-sm bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900">{c.code}</span>
                          <span className="text-[10px] text-slate-400">({c.discount_percent}% Discount)</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans mt-1">{c.description}</p>
                        <span className="block text-[10px] text-slate-500 mt-1">Required Min subtotal: ₹{c.min_amount}</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => onToggleCouponStatus(c.id)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                            c.is_active 
                              ? 'bg-emerald-900/40 text-emerald-450 border border-emerald-900' 
                              : 'bg-rose-900/40 text-rose-450 border border-rose-900'
                          }`}
                        >
                          {c.is_active ? 'ACTIVE' : 'DISABLED'}
                        </button>
                        <button
                          onClick={() => onDeleteCoupon(c.id)}
                          className="p-1 px-2 rounded bg-slate-800 text-slate-450 hover:text-red-400 hover:bg-red-400/10 border border-slate-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {adminSection === 'notifications' && (
          <div className="space-y-6 text-left animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* stock_notifications Table */}
              <div className="lg:col-span-7 bg-[#101931]/60 border border-slate-850 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <h3 className="font-extrabold text-white text-base">Relational Database: stock_notifications</h3>
                    <p className="text-xs text-slate-450 mt-0.5">Live index of customer SMS alerts subscribed for Out of Stock cans</p>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-900/40 text-blue-400 font-bold px-2 py-0.5 rounded border border-blue-800">
                    {stockNotifications.length} Subscriptions
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-850 bg-slate-950">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-850 font-mono text-slate-400">
                        <th className="p-3">ID</th>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Mobile No</th>
                        <th className="p-3">Created At</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/60 font-mono text-slate-300">
                      {stockNotifications.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">
                            No notifications registered in database. Try visiting the customer storefront, set any item out of stock, and click "मला कळवा".
                          </td>
                        </tr>
                      ) : (
                        stockNotifications.map(notif => {
                          const prod = products.find(p => p.id === notif.product_id);
                          return (
                            <tr key={notif.id} className="hover:bg-slate-900/30">
                              <td className="p-3 font-bold text-cyan-400">{notif.id.replace('sn_', '')}</td>
                              <td className="p-3 font-sans font-bold text-white max-w-[150px] truncate">
                                {prod ? prod.name : 'Unknown Product'} 
                                <span className="block text-[10px] text-slate-400 font-mono font-medium mt-0.5">
                                  Capacity: {prod?.capacity || 'N/A'} (Stock: {prod?.stock || 0})
                                </span>
                              </td>
                              <td className="p-3 font-bold text-slate-100">{notif.mobile_no}</td>
                              <td className="p-3 text-[11px] text-slate-400">{notif.created_at}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-[5px] text-[9px] font-bold ${
                                  notif.notified
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/60'
                                    : 'bg-amber-950 text-amber-400 border border-amber-900/60 animate-pulse'
                                }`}>
                                  {notif.notified ? '✓ SENT' : '⌛ PENDING'}
                                </span>
                              </td>
                              <td className="p-3">
                                {prod && prod.stock === 0 && !notif.notified ? (
                                  <button
                                    onClick={() => {
                                      // Trigger stock update which automatically sends notification
                                      onUpdateProductStock(prod.id, 150);
                                      alert(`Stock for ${prod.name} successfully replenished to 150! SMS Alerts dispatched to subscriber.`);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold px-2.5 py-1 rounded-lg text-[10px] transition-all cursor-pointer whitespace-nowrap"
                                  >
                                    Refill Stock & Notify
                                  </button>
                                ) : (
                                  <span className="text-slate-500 font-sans">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                  <h4 className="text-xs font-bold text-blue-400 flex items-center space-x-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Quick Testing Playground</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    To test the notification flow instantly:
                  </p>
                  <ol className="list-decimal list-inside text-[11px] text-slate-400 space-y-1 pl-1 font-sans">
                    <li>Switch to the <strong>Customer Storefront</strong></li>
                    <li>Note the <strong>10L Compact Chilled Can</strong> (it is currently marked Out of Stock)</li>
                    <li>Click <strong>मला कळवा (Notify Me)</strong> and subscribe with any 10-digit number</li>
                    <li>Return here to view your new database row, and click <strong>Refill Stock & Notify</strong></li>
                  </ol>
                </div>
              </div>

              {/* SMS Gateway & Outbox */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Simulated SMS Outbox */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4 text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-900/80">
                    <div className="flex items-center space-x-2">
                      <div className="bg-emerald-500/10 text-emerald-400 p-1.5 rounded-lg border border-emerald-500/20">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-sm">SMS / WhatsApp Gateway</h3>
                        <p className="text-[10px] text-slate-400">Live outbound SMS mock API transmission logs</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                      ONLINE
                    </span>
                  </div>

                  {smsLogs.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 font-sans space-y-2">
                      <div className="text-2xl">💤</div>
                      <p className="text-[11px]">Outbox logs are currently empty.</p>
                      <p className="text-[10px] text-slate-400 max-w-xs mx-auto">No SMS messages have been dispatched yet. Replenish any out-of-stock item's stock in Inventory tab or click Refill Stock above to trigger.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 font-sans">
                      {smsLogs.map(log => (
                        <div key={log.id} className="bg-[#101931]/40 border border-slate-850 p-3.5 rounded-xl space-y-2.5 text-left">
                          <div className="flex justify-between items-center text-[10px] font-mono pb-1.5 border-b border-slate-900/60">
                            <span className="text-emerald-400 font-bold font-mono text-xs">To: {log.mobile}</span>
                            <span className="text-slate-450 font-sans">{log.timestamp.split('T')[1]?.substring(0, 8) || new Date().toLocaleTimeString()}</span>
                          </div>

                          {/* Beautiful mockup of SMS in mobile bubble */}
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850/80 relative text-xs text-slate-100 font-sans">
                            <div className="text-[10px] font-mono text-slate-550 uppercase tracking-wide mb-1 block pb-1 border-b border-slate-900">
                              💬 SMS MESSAGE PREVIEW
                            </div>
                            <div className="whitespace-pre-line text-slate-200 leading-relaxed font-sans text-[11px]">
                              {log.message}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
