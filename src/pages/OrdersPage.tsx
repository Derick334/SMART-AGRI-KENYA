import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Receipt, 
  ShieldCheck, 
  ArrowRight,
  Package,
  AlertCircle
} from 'lucide-react';
import { Order } from '../types';
import { agriStore } from '../services/store';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(agriStore.getOrders());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Truck className="w-4 h-4" />
            <span>National Agricultural Logistics & Delivery Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Orders, Shipments & Livestock Movements
          </h1>
          <p className="text-xs text-stone-300 mt-1 max-w-xl leading-relaxed">
            Monitor farm produce and animal shipments across KeNHA paved highway corridors with real-time status updates and M-Pesa Daraja payment reconciliation.
          </p>
        </div>

        <div className="bg-stone-800 px-4 py-3 rounded-2xl border border-stone-700 text-right">
          <span className="text-[10px] text-stone-400 uppercase font-bold block">Your Active Orders</span>
          <span className="text-xl font-black text-emerald-400">{orders.length} Shipments</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-bold text-sm text-stone-900 mb-1">No Orders Placed Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Browse the marketplace or livestock section to purchase produce and certified farm inputs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Orders List (Left) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Recent Farm Orders
            </h3>

            {orders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => setSelectedOrder(ord)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  selectedOrder?.id === ord.id
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-mono font-bold text-stone-900">{ord.orderNumber}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    ord.orderStatus === 'delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ord.orderStatus === 'in_transit'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ord.orderStatus.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-stone-600 font-medium">
                  {ord.items.length} item{ord.items.length !== 1 ? 's' : ''}: {ord.items[0]?.productTitle}
                </p>

                <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 pt-2 border-t border-stone-100">
                  <span>To: {ord.deliveryTown}, {ord.deliveryCounty}</span>
                  <span className="font-black text-emerald-950">
                    KSh {ord.grandTotalKsh.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Details & Tracking (Right) */}
          <div className="lg:col-span-8">
            {selectedOrder && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Shipment Details
                    </span>
                    <h2 className="text-xl font-black text-stone-950">
                      Order #{selectedOrder.orderNumber}
                    </h2>
                    <p className="text-xs text-stone-500">
                      Placed: {new Date(selectedOrder.createdAt).toLocaleDateString()} at {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block font-medium">Total Paid (M-Pesa Escrow)</span>
                    <span className="text-xl font-black text-emerald-950">
                      KSh {selectedOrder.grandTotalKsh.toLocaleString()}
                    </span>
                    {selectedOrder.mpesaReceiptNumber && (
                      <span className="text-[10px] font-mono text-emerald-700 block font-bold">
                        Receipt: {selectedOrder.mpesaReceiptNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tracking Stepper */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Live Highway Transit Timeline
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {selectedOrder.trackingSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border text-xs flex flex-col justify-between ${
                          step.completed
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                            : 'bg-stone-50 border-stone-200 text-stone-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-bold mb-1">
                            <CheckCircle2 className={`w-4 h-4 ${step.completed ? 'text-emerald-600' : 'text-stone-300'}`} />
                            <span>{step.label}</span>
                          </div>
                          <p className="text-[11px] leading-snug">{step.description}</p>
                        </div>
                        <span className="text-[10px] text-stone-400 block mt-2 font-mono">
                          {step.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transporter / Driver Details */}
                {selectedOrder.transporterDetails && (
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase block">
                          Assigned Transporter
                        </span>
                        <p className="font-bold text-stone-900 text-sm">
                          {selectedOrder.transporterDetails.name} • {selectedOrder.transporterDetails.vehiclePlate}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {selectedOrder.transporterDetails.vehicleType} (Vetted Carrier)
                        </p>
                      </div>
                    </div>

                    <a
                      href={`tel:${selectedOrder.transporterDetails.phone}`}
                      className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Driver ({selectedOrder.transporterDetails.phone})</span>
                    </a>
                  </div>
                )}

                {/* Items in Order */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Purchased Goods
                  </h4>

                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs bg-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block">{item.productTitle}</span>
                            <span className="text-[11px] text-stone-500">
                              Qty: {item.quantity} {item.unit} • Sold by {item.sellerName}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-sm text-stone-900">
                            KSh {item.totalPriceKsh.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-stone-400 block">
                            Freight: KSh {item.shippingCostKsh.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                  <span className="font-bold text-stone-900 block mb-1">
                    Delivery Destination & Receiver
                  </span>
                  <p className="text-stone-700">
                    Recipient: <strong>{selectedOrder.buyerName}</strong> ({selectedOrder.buyerPhone})
                  </p>
                  <p className="text-stone-600 mt-0.5">
                    Location: {selectedOrder.deliveryAddress}, {selectedOrder.deliveryTown}, {selectedOrder.deliveryCounty} County
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
