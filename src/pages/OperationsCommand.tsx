import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import {
  Truck,
  Search,
  Filter,
  CheckCircle2,
  AlertOctagon,
  Clock,
  PhoneCall,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Package,
  Check,
  Send,
  HelpCircle,
} from 'lucide-react';

export const OperationsCommand: React.FC = () => {
  const {
    orders,
    selectedCity,
    selectedOrderId,
    setSelectedOrderId,
    selectedOrder,
    resolveOrder,
    escalateOrder,
    contactStoreForOrder,
    notifyCustomerForOrder,
    tickets,
    deliveries,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Delayed' | 'Active' | 'Resolved' | 'Cancelled'>('All');

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesCity = selectedCity === 'All' || o.city === selectedCity;
      let matchesStatus = true;
      if (statusFilter === 'Delayed') matchesStatus = o.isDelayed || o.status === 'Delayed';
      else if (statusFilter === 'Active') matchesStatus = o.resolutionStatus === 'Active';
      else if (statusFilter === 'Resolved') matchesStatus = o.resolutionStatus === 'Resolved';
      else if (statusFilter === 'Cancelled') matchesStatus = o.status === 'Cancelled' || o.status === 'Store Rejected';

      const matchesSearch =
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.storeName.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCity && matchesStatus && matchesSearch;
    });
  }, [orders, selectedCity, statusFilter, searchTerm]);

  // Find linked delivery and ticket
  const activeDelivery = useMemo(() => {
    if (!selectedOrder) return null;
    return deliveries.find(d => d.orderId === selectedOrder.id);
  }, [deliveries, selectedOrder]);

  const activeTicket = useMemo(() => {
    if (!selectedOrder) return null;
    return tickets.find(t => t.orderId === selectedOrder.id);
  }, [tickets, selectedOrder]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">OPERATIONS COMMAND</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
              Live At-Risk Order Triage
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time fulfillment resolution: intercept delayed dispatches and stockouts before customer cancels.
          </p>
        </div>

        {/* Quick status tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['All', 'Active', 'Delayed', 'Resolved', 'Cancelled'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID (e.g. NC10482), Customer Name, or Store..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 self-center">
          Showing <span className="font-bold text-white">{filteredOrders.length}</span> orders
        </div>
      </div>

      {/* Main Grid: Orders Table & Order Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Orders Table (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Fulfillment Queue
            </span>
            <span className="text-[11px] text-slate-500">Click an order to triage</span>
          </div>

          <div className="overflow-x-auto max-h-[720px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 sticky top-0 z-10 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Store</th>
                  <th className="py-3 px-3">Value</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-normal">
                {filteredOrders.map(ord => {
                  const isSelected = selectedOrder?.id === ord.id;
                  let statusBadge = 'bg-slate-800 text-slate-300 border-slate-700';
                  if (ord.resolutionStatus === 'Resolved') statusBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold';
                  else if (ord.status === 'Delayed') statusBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
                  else if (ord.status === 'Cancelled' || ord.status === 'Store Rejected') statusBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/40';

                  return (
                    <tr
                      key={ord.id}
                      onClick={() => setSelectedOrderId(ord.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-indigo-950/40 border-l-4 border-l-indigo-500'
                          : 'hover:bg-slate-900/50'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        <div className="flex items-center gap-1.5">
                          <span>#{ord.id}</span>
                          {ord.riskSeverity === 'HIGH' && ord.resolutionStatus === 'Active' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">{ord.orderDate}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-200">{ord.customerName}</div>
                        <div className="text-[10px] text-slate-400">{ord.city}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="text-slate-300 truncate max-w-[120px]" title={ord.storeName}>{ord.storeName}</div>
                        <div className="text-[10px] text-slate-500">ETA: {ord.estimatedMinutes}m</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-semibold text-white">
                        ₹{ord.orderValue}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] border ${statusBadge}`}>
                          {ord.resolutionStatus === 'Resolved' ? 'Resolved' : ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {ord.resolutionStatus === 'Resolved' ? (
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                            <Check className="w-3.5 h-3.5" /> Resolved
                          </span>
                        ) : (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              resolveOrder(ord.id);
                            }}
                            className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Order Detail Drawer (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl space-y-5 sticky top-20">
          {selectedOrder ? (
            <>
              {/* Order Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold font-mono text-white">Order #{selectedOrder.id}</h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                        selectedOrder.resolutionStatus === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : selectedOrder.status === 'Delayed'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {selectedOrder.resolutionStatus === 'Resolved' ? 'Resolved' : selectedOrder.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>{selectedOrder.customerName}</span>
                    <span>•</span>
                    <span className="text-slate-300">{selectedOrder.storeName}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-white font-mono">₹{selectedOrder.orderValue}</div>
                  <div className="text-[10px] text-slate-400">{selectedOrder.orderDate}</div>
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Basket Line Items</span>
                  <span className="text-[10px] text-slate-400">{selectedOrder.items.length} items</span>
                </div>
                <div className="space-y-1.5">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-400">Qty: {item.quantity} • ₹{item.price}</div>
                        {item.substitutedWith && (
                          <div className="text-[10px] text-amber-400 mt-0.5">
                            Substituted with: {item.substitutedWith}
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.status === 'Available'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : item.status === 'Unavailable'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Root Cause & Fulfillment Telemetry */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Root Cause & Risk Explanation</span>
                  <span className="text-rose-400 font-bold uppercase">{selectedOrder.riskSeverity} Risk</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedOrder.rootCause || 'Order delayed due to merchant preparation bottleneck.'}
                </p>

                {activeDelivery && (
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div>
                      <strong className="text-slate-300">Rider Assigned:</strong> {activeDelivery.riderName}
                    </div>
                    <div>
                      <strong className="text-slate-300">Delivery Delay:</strong> +{activeDelivery.delayMinutes} mins past ETA
                    </div>
                    {activeDelivery.delayReason && (
                      <div className="text-amber-300 italic">"{activeDelivery.delayReason}"</div>
                    )}
                  </div>
                )}
              </div>

              {/* Working Resolution Actions Bar (Mandatory Section 15) */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Operational Control Actions:
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => contactStoreForOrder(selectedOrder.id)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                    <span>Contact Store</span>
                  </button>

                  <button
                    onClick={() => notifyCustomerForOrder(selectedOrder.id)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Notify Customer</span>
                  </button>

                  <button
                    onClick={() => escalateOrder(selectedOrder.id)}
                    disabled={selectedOrder.resolutionStatus === 'Escalated'}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 transition-colors disabled:opacity-50"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{selectedOrder.resolutionStatus === 'Escalated' ? 'Escalated' : 'Escalate'}</span>
                  </button>

                  <button
                    onClick={() => resolveOrder(selectedOrder.id)}
                    disabled={selectedOrder.resolutionStatus === 'Resolved'}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{selectedOrder.resolutionStatus === 'Resolved' ? 'Resolved' : 'Resolve Order'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Select an order from the active queue to view diagnostic timeline and actions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
