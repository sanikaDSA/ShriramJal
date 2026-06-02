import React, { useState } from 'react';
import { Database, Workflow, MapPin, Milestone, Table2, UserCheck, CreditCard, ShoppingBag, Award, Eye, ArrowLeft } from 'lucide-react';
import { User, Product, Address, Coupon, DeliveryBoy, Order, OrderItem } from '../types';

interface ArchitecturePanelProps {
  users: User[];
  products: Product[];
  orders: Order[];
  orderItems: OrderItem[];
  addresses: Address[];
  coupons: Coupon[];
  deliveryBoys: DeliveryBoy[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ArchitecturePanel: React.FC<ArchitecturePanelProps> = ({
  users,
  products,
  orders,
  orderItems,
  addresses,
  coupons,
  deliveryBoys,
  activeTab,
  setActiveTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'er' | 'flow' | 'journey' | 'wireframe'>('er');

  // Helper count for active items
  const dbLineCounts = {
    users: users.length,
    products: products.length,
    orders: orders.length,
    orderItems: orderItems.length,
    addresses: addresses.length,
    payments: orders.length, // synced 1-to-1
    deliveryBoys: deliveryBoys.length,
    coupons: coupons.length
  };

  return (
    <div id="architecture-panel" className="bg-[#0f172a] text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden my-8">
      {/* Console Header */}
      <div className="bg-[#1e293b] px-6 py-4 flex flex-col lg:flex-row items-center justify-between border-b border-slate-800 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full lg:w-auto gap-4">
          <div className="flex items-center space-x-3 text-cyan-400">
            <Database className="w-6 h-6 animate-pulse" />
            <div>
              <h2 className="text-lg font-bold font-sans tracking-tight text-white">System Architecture & Blueprint Console</h2>
              <p className="text-xs text-slate-400">Interactive live mapping of relational schemas, user lifecycles & design flow</p>
            </div>
          </div>

          {setActiveTab && (
            <button
              onClick={() => setActiveTab('store')}
              className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900 hover:bg-slate-850 transition-colors text-xs font-bold text-cyan-400 cursor-pointer w-fit animate-pulse"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>🏡 Back to Storefront</span>
            </button>
          )}
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 mt-4 md:mt-0 space-x-1">
          <button
            onClick={() => setActiveSubTab('er')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-2 ${
              activeSubTab === 'er'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            <span>Database schema (ERD)</span>
            <span className="bg-slate-850 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold leading-none">
              {Object.values(dbLineCounts).reduce((a, b) => a + b, 0)} Rows
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('flow')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-2 ${
              activeSubTab === 'flow'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Website Flow Diagram</span>
          </button>
          <button
            onClick={() => setActiveSubTab('journey')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-2 ${
              activeSubTab === 'journey'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Milestone className="w-3.5 h-3.5" />
            <span>User Journey Map</span>
          </button>
          <button
            onClick={() => setActiveSubTab('wireframe')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-2 ${
              activeSubTab === 'wireframe'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>High-Fidelity Wireframes</span>
          </button>
        </div>
      </div>

      {/* Main Console Content */}
      <div className="p-6">
        {/* TAB 1: RELATIONAL ERD SCHEMA */}
        {activeSubTab === 'er' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-400/10 text-emerald-400 mb-2">
                  Live DB Sandbox: Connected
                </span>
                <p className="text-xs text-slate-300">
                  The data shown in the tables below transitions in real-time as you trigger checkout, apply coupons, add items, or override order status in the Admin dashboard.
                </p>
              </div>
              <div className="hidden lg:flex space-x-4 text-xs font-mono">
                <div className="text-center bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 block">TABLES</span>
                  <span className="text-cyan-400 font-bold text-base">8 Active</span>
                </div>
                <div className="text-center bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 block">DATABASE</span>
                  <span className="text-blue-400 font-bold text-base">MySQL / Relational</span>
                </div>
              </div>
            </div>

            {/* Interactive Grid of Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* TABLE: Users */}
              <div className="bg-[#131d35] border border-cyan-500/30 rounded-xl overflow-hidden hover:border-cyan-400/60 transition-all">
                <div className="bg-cyan-950/60 px-4 py-2 border-b border-cyan-900/30 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-cyan-300">tbl_users (MySQL)</span>
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.2 rounded font-bold">{dbLineCounts.users} rows</span>
                </div>
                <div className="p-3 text-[11px] font-mono space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-amber-400">🔑 id [PK]</span>
                    <span className="text-slate-400">VARCHAR(45)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>name</span>
                    <span className="text-slate-400">VARCHAR(100)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>email</span>
                    <span className="text-slate-400">VARCHAR(125)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>phone</span>
                    <span className="text-slate-400">VARCHAR(15)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>role</span>
                    <span className="text-slate-400">ENUM('admin', 'customer')</span>
                  </div>
                  {/* Collapsible live inspector preview */}
                  <div className="mt-3 bg-slate-950 p-2 rounded text-[10px] border border-slate-800 text-slate-300 max-h-20 overflow-y-auto">
                    <span className="text-cyan-400 font-bold">Live Rows:</span>
                    {users.map(u => (
                      <div key={u.id} className="border-t border-slate-900 pt-1 mt-1">
                        [{u.id}] {u.name} ({u.role})
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TABLE: Products */}
              <div className="bg-[#131d35] border border-cyan-500/30 rounded-xl overflow-hidden hover:border-cyan-400/60 transition-all">
                <div className="bg-cyan-950/60 px-4 py-2 border-b border-cyan-900/30 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-cyan-300">tbl_products</span>
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.2 rounded font-bold">{dbLineCounts.products} rows</span>
                </div>
                <div className="p-3 text-[11px] font-mono space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-amber-400">🔑 id [PK]</span>
                    <span className="text-slate-400">VARCHAR(45)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>name</span>
                    <span className="text-slate-400">VARCHAR(150)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>type</span>
                    <span className="text-slate-400">VARCHAR(15)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>capacity</span>
                    <span className="text-slate-400">VARCHAR(10)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>price</span>
                    <span className="text-slate-400">DECIMAL(10,2)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>stock</span>
                    <span className="text-slate-400">INT</span>
                  </div>
                  {/* Collapsible live inspector preview */}
                  <div className="mt-2 bg-slate-950 p-2 rounded text-[10px] border border-slate-800 text-slate-300 max-h-20 overflow-y-auto">
                    <span className="text-cyan-400 font-bold">Dynamic Catalog:</span>
                    {products.slice(0, 3).map(p => (
                      <div key={p.id} className="border-t border-slate-900 pt-1 mt-1">
                        [{p.id}] {p.capacity} • ₹{p.price} (Qty: {p.stock})
                      </div>
                    ))}
                    <div className="text-[9px] text-slate-500 pt-1 text-center">+{products.length - 3} more rows</div>
                  </div>
                </div>
              </div>

              {/* TABLE: Addresses */}
              <div className="bg-[#131d35] border border-cyan-500/30 rounded-xl overflow-hidden hover:border-cyan-400/60 transition-all">
                <div className="bg-cyan-950/60 px-4 py-2 border-b border-cyan-900/30 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-cyan-300">tbl_addresses</span>
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.2 rounded font-bold">{dbLineCounts.addresses} rows</span>
                </div>
                <div className="p-3 text-[11px] font-mono space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-amber-400">🔑 id [PK]</span>
                    <span className="text-slate-400">VARCHAR(45)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-teal-400">🔗 user_id [FK]</span>
                    <span className="text-slate-400">VARCHAR(45)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>label</span>
                    <span className="text-slate-400">VARCHAR(20)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>address_line</span>
                    <span className="text-slate-400">TEXT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>lat, lng</span>
                    <span className="text-slate-400">DECIMAL(10,6)</span>
                  </div>
                  {/* Collapsible live inspector preview */}
                  <div className="mt-3 bg-slate-950 p-2 rounded text-[10px] border border-slate-800 text-slate-300 max-h-20 overflow-y-auto">
                    <span className="text-cyan-400 font-bold">Addresses:</span>
                    {addresses.map(a => (
                      <div key={a.id} className="border-t border-slate-900 pt-1 mt-1 truncate">
                        [{a.label}] {a.address_line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TABLE: Coupons */}
              <div className="bg-[#131d35] border border-cyan-500/30 rounded-xl overflow-hidden hover:border-cyan-400/60 transition-all">
                <div className="bg-cyan-950/60 px-4 py-2 border-b border-cyan-900/30 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-cyan-300">tbl_coupons</span>
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.2 rounded font-bold">{dbLineCounts.coupons} rows</span>
                </div>
                <div className="p-3 text-[11px] font-mono space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-amber-400">🔑 id [PK]</span>
                    <span className="text-slate-400">VARCHAR(45)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="font-bold">code [UNIQUE]</span>
                    <span className="text-slate-400">VARCHAR(20)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>discount_percent</span>
                    <span className="text-slate-400">INT</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>min_amount</span>
                    <span className="text-slate-400">DECIMAL(8,2)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>is_active</span>
                    <span className="text-slate-400">BOOLEAN</span>
                  </div>
                  {/* Collapsible live inspector preview */}
                  <div className="mt-3 bg-slate-950 p-2 rounded text-[10px] border border-slate-800 text-slate-300 max-h-25 overflow-y-auto">
                    <span className="text-cyan-400 font-bold font-mono">Promo Catalogue:</span>
                    {coupons.map(c => (
                      <div key={c.id} className="border-t border-slate-900 pt-1 mt-1 flex justify-between">
                        <span>{c.code} ({c.discount_percent}%)</span>
                        <span className={c.is_active ? 'text-emerald-400' : 'text-rose-450'}>{c.is_active ? 'ACTIVE' : 'INACTIVE'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TABLE: Orders */}
              <div className="bg-[#131d35] border border-cyan-500/30 rounded-xl overflow-hidden hover:border-cyan-400/60 transition-all">
                <div className="bg-cyan-950/60 px-4 py-2 border-b border-cyan-900/30 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-cyan-300">tbl_orders</span>
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.2 rounded font-bold">{dbLineCounts.orders} rows</span>
                </div>
                <div className="p-3 text-[11px] font-mono space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-amber-400">🔑 id [PK]</span>
                    <span className="text-slate-400">VARCHAR(45)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-teal-400">🔗 user_id [FK]</span>
                    <span className="text-slate-400">VARCHAR(45)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-teal-400">🔗 address_id [FK]</span>
                    <span className="text-slate-400">VARCHAR(45)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>total_amount</span>
                    <span className="text-slate-400">DECIMAL(10,2)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>status</span>
                    <span className="text-slate-300 font-bold">VARCHAR(30)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-teal-400">🔗 delivery_boy_id [FK]</span>
                    <span className="text-slate-400">VARCHAR(45)</span>
                  </div>
                  {/* Collapsible live inspector preview */}
                  <div className="mt-3 bg-slate-950 p-2 rounded text-[10px] border border-slate-800 text-slate-300 max-h-20 overflow-y-auto">
                    <span className="text-cyan-400 font-bold">Active Records:</span>
                    {orders.map(o => (
                      <div key={o.id} className="border-t border-slate-900 pt-1 mt-1 flex justify-between">
                        <span>{o.id}: ₹{o.total_amount}</span>
                        <span className="text-cyan-300 uppercase">{o.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TABLE: Order Items */}
              <div className="bg-[#131d35] border border-cyan-500/30 rounded-xl overflow-hidden hover:border-cyan-400/60 transition-all">
                <div className="bg-cyan-950/60 px-4 py-2 border-b border-cyan-900/30 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-cyan-300">tbl_order_items</span>
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.2 rounded font-bold">{dbLineCounts.orderItems} rows</span>
                </div>
                <div className="p-3 text-[11px] font-mono space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-amber-400">🔑 id [PK]</span>
                    <span className="text-slate-400">VARCHAR(45)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-teal-400">🔗 order_id [FK]</span>
                    <span className="text-slate-400">VARCHAR(45)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-teal-400">🔗 product_id [FK]</span>
                    <span className="text-slate-400">VARCHAR(45)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>quantity</span>
                    <span className="text-slate-400">INT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>price</span>
                    <span className="text-slate-400">DECIMAL(10,2)</span>
                  </div>
                  {/* Collapsible live inspector preview */}
                  <div className="mt-3 bg-slate-950 p-2 rounded text-[10px] border border-slate-800 text-slate-300 max-h-20 overflow-y-auto">
                    <span className="text-cyan-400 font-bold text-[9px]">Sales breakdown:</span>
                    {orderItems.slice(0, 4).map((oi, idx) => (
                      <div key={oi.id || idx} className="border-t border-slate-900 pt-1 mt-1 text-[9px] flex justify-between">
                        <span>Order {oi.order_id}</span>
                        <span>{oi.quantity}x • Min ₹{oi.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TABLE: Payments */}
              <div className="bg-[#131d35] border border-cyan-500/30 rounded-xl overflow-hidden hover:border-cyan-400/60 transition-all">
                <div className="bg-cyan-950/60 px-4 py-2 border-b border-cyan-900/30 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-cyan-300">tbl_payments</span>
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.2 rounded font-bold">{dbLineCounts.payments} rows</span>
                </div>
                <div className="p-3 text-[11px] font-mono space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-amber-400">🔑 id [PK]</span>
                    <span className="text-slate-400">VARCHAR(45)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-teal-400">🔗 order_id [FK]</span>
                    <span className="text-slate-400">VARCHAR(45)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>payment_method</span>
                    <span className="text-slate-400">VARCHAR(30)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>amount</span>
                    <span className="text-slate-400">DECIMAL(10,2)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>payment_status</span>
                    <span className="text-slate-400">VARCHAR(20)</span>
                  </div>
                  {/* Collapsible live inspector preview */}
                  <div className="mt-3 bg-slate-950 p-2 rounded text-[10px] border border-slate-800 text-slate-300 max-h-20 overflow-y-auto">
                    <span className="text-cyan-400 font-bold">Ledger Transactions:</span>
                    {orders.map(o => (
                      <div key={o.id} className="border-t border-slate-900 pt-1 mt-1 text-[9px] flex justify-between">
                        <span>{o.id}: {o.payment_method.toUpperCase()}</span>
                        <span className={o.payment_status === 'success' ? 'text-emerald-400' : 'text-amber-450'}>{o.payment_status.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TABLE: Delivery Boys */}
              <div className="bg-[#131d35] border border-cyan-500/30 rounded-xl overflow-hidden hover:border-cyan-400/60 transition-all">
                <div className="bg-cyan-950/60 px-4 py-2 border-b border-cyan-900/30 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-cyan-300">tbl_delivery_boys</span>
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.2 rounded font-bold">{dbLineCounts.deliveryBoys} rows</span>
                </div>
                <div className="p-3 text-[11px] font-mono space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-amber-400">🔑 id [PK]</span>
                    <span className="text-slate-400">VARCHAR(45)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>name</span>
                    <span className="text-slate-400">VARCHAR(100)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>vehicle_no</span>
                    <span className="text-slate-400">VARCHAR(20)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>status</span>
                    <span className="text-slate-400">VARCHAR(15)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>rating</span>
                    <span className="text-slate-400">DECIMAL(2,1)</span>
                  </div>
                  {/* Collapsible live inspector preview */}
                  <div className="mt-3 bg-slate-950 p-2 rounded text-[10px] border border-slate-800 text-slate-300 max-h-20 overflow-y-auto">
                    <span className="text-cyan-400 font-bold">Fleet boys:</span>
                    {deliveryBoys.map(db => (
                      <div key={db.id} className="border-t border-slate-900 pt-1 mt-1 text-[9px] flex justify-between">
                        <span>{db.name} ({db.status})</span>
                        <span>{db.rating}★</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Schema Relations and Keys Info Card */}
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
              <h4 className="font-bold text-slate-200">MySQL Foreign Key Relations Cascade Constraints:</h4>
              <ul className="list-disc leading-relaxed pl-5 space-y-1">
                <li><code className="text-cyan-300">tbl_addresses.user_id</code> references <code className="text-cyan-300">tbl_users.id</code> on Delete CASCADE.</li>
                <li><code className="text-cyan-300">tbl_orders.user_id</code> references <code className="text-cyan-300">tbl_users.id</code> (holds client tracking constraints).</li>
                <li><code className="text-cyan-300">tbl_order_items.order_id</code> references <code className="text-cyan-300">tbl_orders.id</code> and <code className="text-cyan-300">tbl_products.id</code>, tracking detailed breakdown constraints.</li>
                <li><code className="text-cyan-300">tbl_payments.order_id</code> references <code className="text-cyan-300">tbl_orders.id</code>, mapping billing transactions dynamically.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: SYSTEM USER FLOW DIAGRAM */}
        {activeSubTab === 'flow' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-mono">Website Flow & Ordering Pipeline</h3>
            <p className="text-xs text-slate-300">
              The flowchart below maps the entire user interface routing and data propagation logic from the moment a customer enters "Shriram Jal" up to delivery.
            </p>

            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row items-stretch justify-between text-xs font-sans text-slate-300">
              
              {/* Step 1 */}
              <div className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all">
                <div>
                  <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 flex items-center justify-center font-bold font-mono text-[11px]">1</span>
                    <h4 className="font-bold text-white">Homepage & Brand Entry</h4>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Customer explores organic water standards, hygiene certifications, and coverage locations. Tapping "Book Now" prompts direct catalog routing.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-950 text-slate-500 uppercase font-mono text-[9px] tracking-widest">
                  Action: Routing
                </div>
              </div>

              {/* Connector */}
              <div className="self-center flex items-center justify-center py-2 lg:py-0 lg:px-2">
                <span className="text-slate-600 font-bold text-lg rotate-90 lg:rotate-0">➔</span>
              </div>

              {/* Step 2 */}
              <div className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all">
                <div>
                  <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 flex items-center justify-center font-bold font-mono text-[11px]">2</span>
                    <h4 className="font-bold text-white">Water Type & Size Selector</h4>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Interactive selection of Cold vs Normal, size cans (20L, 10L, 5L, 1L). Increments cart variables and hydrates localized state arrays.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-950 text-slate-500 uppercase font-mono text-[9px] tracking-widest">
                  Action: Add to Cart
                </div>
              </div>

              {/* Connector */}
              <div className="self-center flex items-center justify-center py-2 lg:py-0 lg:px-2">
                <span className="text-slate-600 font-bold text-lg rotate-90 lg:rotate-0">➔</span>
              </div>

              {/* Step 3 */}
              <div className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all">
                <div>
                  <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 flex items-center justify-center font-bold font-mono text-[11px]">3</span>
                    <h4 className="font-bold text-white">Secure Address & Slot Picker</h4>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    User picks address in Google Maps tracker, picks preferred delivery time slot, and applies dynamic discount promo coupons (validation script).
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-950 text-slate-500 uppercase font-mono text-[9px] tracking-widest">
                  Action: Checkout Detail
                </div>
              </div>

              {/* Connector */}
              <div className="self-center flex items-center justify-center py-2 lg:py-0 lg:px-2">
                <span className="text-slate-600 font-bold text-lg rotate-90 lg:rotate-0">➔</span>
              </div>

              {/* Step 4 */}
              <div className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all">
                <div>
                  <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 flex items-center justify-center font-bold font-mono text-[11px]">4</span>
                    <h4 className="font-bold text-white">Razorpay Secure Gate</h4>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Interactive simulated Razorpay modal takes payment triggers (UPI/Card/COD). On receipt of payload, write triggers to tbl_payments & tbl_orders.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-950 text-slate-500 uppercase font-mono text-[9px] tracking-widest">
                  Action: Settlement
                </div>
              </div>

              {/* Connector */}
              <div className="self-center flex items-center justify-center py-2 lg:py-0 lg:px-2">
                <span className="text-slate-600 font-bold text-lg rotate-90 lg:rotate-0">➔</span>
              </div>

              {/* Step 5 */}
              <div className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all">
                <div>
                  <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 flex items-center justify-center font-bold font-mono text-[11px]">5</span>
                    <h4 className="font-bold text-white">Live Route Dispatch</h4>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Automatic assignation rules assign active Delivery Boy (e.g. Rajesh Kumar). Plot coordinates and update status timeline live!
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-950 text-slate-500 uppercase font-mono text-[9px] tracking-widest">
                  Action: Status Loop
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: USER JOURNEY MAP */}
        {activeSubTab === 'journey' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider font-mono">Customer vs. Delivery Boy Journey Map</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-200">
                    <th className="p-3 font-semibold">JOURNEY FLOW</th>
                    <th className="p-3 font-semibold">CUSTOMER JOURNEY (Sanika Gurav)</th>
                    <th className="p-3 font-semibold">DELIVERY BOY JOURNEY (Rajesh Kumar)</th>
                    <th className="p-3 font-semibold">SYSTEM TRANSITIONS (MySQL + WebSockets)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-350">
                  <tr>
                    <td className="p-3 font-bold text-white">1. Demand Stage</td>
                    <td className="p-3">Sanika realizes household needs cooking & pure normal 20L water cans immediately. Enters applet.</td>
                    <td className="p-3">Rajesh rests in neighborhood hub, marked as <span className="text-emerald-400">Idle</span> on delivery application.</td>
                    <td className="p-3 text-cyan-300 font-mono">GET /api/catalog hydrate product list values</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">2. Cart & Promo</td>
                    <td className="p-3">Adds two 20L Normal Cans and one 5L Chilled Tap, applies coupon <code className="text-amber-300">JAL20</code> reducing cost.</td>
                    <td className="p-3">Holds position, expecting push notifications.</td>
                    <td className="p-3 text-cyan-300 font-mono">Validate values, check tbl_coupons active flag</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">3. Payment Confirmation</td>
                    <td className="p-3">Sanika selects SBS road address, triggers mock UPI payment through simulated gateway.</td>
                    <td className="p-3">Reciprocates app ring; order assigned based on coordinates mapping metrics.</td>
                    <td className="p-3 text-cyan-300 font-mono">Insert tbl_orders, insert tbl_payments State: SUCCESS</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">4. Tracking State</td>
                    <td className="p-3">Watches beautiful visual map showing Rajesh moving on the route stream details.</td>
                    <td className="p-3">Collects cans, loads auto-rickshaw, navigates, updates to <span className="text-indigo-400">Out For Delivery</span>.</td>
                    <td className="p-3 text-cyan-300 font-mono">tbl_orders status update, trigger socket broadcast</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: HIGH-FIDELITY WIREFRAMES */}
        {activeSubTab === 'wireframe' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider font-mono">System Wireframe Blueprints</h3>
            <p className="text-xs text-slate-300">
              Hand-designed system schematics illustrating essential UI boxes, grid constraints, and card flex values.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Wireframe 1: Cart Calculation Structure */}
              <div className="bg-slate-950 p-4 rounded-xl border border-dashed border-slate-700">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                  <span className="font-mono text-[10px] text-slate-500">WIRE-WIDGET: CART_BREAKDOWN</span>
                  <span className="text-[9px] bg-slate-900 px-1 py-0.5 rounded text-indigo-300 font-mono">v1.1</span>
                </div>
                <div className="space-y-2 text-[11px] font-mono">
                  {/* Visual bounding boxes */}
                  <div className="border border-slate-800 p-2 text-center text-slate-500 rounded bg-slate-900/40">
                    [Selected Can Card x2: Price ₹100]
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1">
                    <span>Subtotal:</span>
                    <span>₹100.00</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Coupon Applied (JAL20):</span>
                    <span className="text-emerald-400">-₹20.00</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Delivery Charges:</span>
                    <span>₹20.00</span>
                  </div>
                  <div className="border-t border-dashed border-slate-800 my-2" />
                  <div className="flex justify-between text-slate-200 font-bold">
                    <span>Grand Settled Total:</span>
                    <span>₹100.00</span>
                  </div>
                  <div className="bg-cyan-950 text-cyan-100 text-center p-2 rounded text-xs font-bold font-sans mt-3 cursor-not-allowed">
                    PROCEED_TO_PAYMENT_BUTTON
                  </div>
                </div>
              </div>

              {/* Wireframe 2: Map Live tracking route element */}
              <div className="bg-slate-950 p-4 rounded-xl border border-dashed border-slate-700">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                  <span className="font-mono text-[10px] text-slate-500">WIRE-WIDGET: LIVE_TRACK_COORDS</span>
                  <span className="text-[9px] bg-slate-900 px-1 py-0.5 rounded text-indigo-300 font-mono">v1.0</span>
                </div>
                {/* Simulated tracking element */}
                <div className="space-y-4 font-mono text-[11px]">
                  <div className="relative border border-slate-800 h-28 rounded bg-slate-900/50 flex flex-col justify-between p-2 overflowing-hidden">
                    <div className="flex justify-between items-center z-10">
                      <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold text-[9px] uppercase">GPS LOCK</span>
                    </div>
                    {/* Simulated horizontal track */}
                    <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-800 -translate-y-1/2 flex items-center justify-between">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-100 animate-ping" />
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex justify-between items-center pt-2 text-[10px] text-slate-400 font-sans mt-auto">
                      <span>Hub (S.B. Road)</span>
                      <span>Delivery boy (On Moto)</span>
                      <span>Sanika's Home</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Driver Partner:</span>
                    <span className="text-cyan-400">Rajesh Kumar (+91 90123 45678)</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
