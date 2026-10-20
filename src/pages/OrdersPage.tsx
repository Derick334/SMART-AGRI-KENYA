import React, { useState } from 'react';
import { 
  Truck, 
  CheckCircle2, 
  Phone, 
  Package
} from 'lucide-react';
import { Order } from '../types';
import { agriStore } from '../services/store';

export const OrdersPage: React.FC = () => {
  const [orders] = useState<Order[]>(agriStore.getOrders());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#367C46] text-xs font-bold uppercase tracking-wider mb-2">
            <Truck className="w-4 h-4 text-[#367C46]" />
            <span>National Agricultural Logistics & Delivery Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
            Orders, Shipments & Livestock Movements
          </h1>
          <p className="text-xs sm:text-sm text-[#68756A] mt-1.5 max-w-xl leading-relaxed">
            Monitor farm produce and livestock shipments across KeNHA paved highway corridors with real-time status updates and M-Pesa Daraja payment reconciliation.
          </p>
        </div>

        <div className="bg-[#F7F6F0] px-4 py-3 rounded-lg border border-[#E2E7DE] text-right">
          <span className="text-[10px] text-[#68756A] uppercase font-bold block">Your Active Orders</span>
          <span className="text-xl font-extrabold text-[#214E34] tabular-nums">{orders.length} Shipments</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-[#E2E7DE]">
          <Package className="w-12 h-12 text-[#68756A] mx-auto mb-3" />
          <h3 className="font-bold text-sm text-[#252D27] mb-1">No Orders Placed Yet</h3>
          <p className="text-xs text-[#68756A] max-w-sm mx-auto">
            Browse the marketplace or livestock section to purchase produce and certified farm inputs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Orders List (Left) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-[#68756A] uppercase tracking-wider">
              Recent Farm Orders
            </h3>

            {orders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => setSelectedOrder(ord)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  selectedOrder?.id === ord.id
                    ? 'border-[#367C46] bg-[#EBF3ED] shadow-xs'
                    : 'border-[#E2E7DE] bg-white hover:bg-[#F7F6F0]'
                }`}
              >
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-mono font-bold text-[#252D27]">{ord.orderNumber}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    ord.orderStatus === 'delivered'
                      ? 'bg-[#EBF3ED] text-[#214E34]'
                      : ord.orderStatus === 'in_transit'
                      ? 'bg-[#FCF8EE] text-[#79543A]'
                      : 'bg-[#F7F6F0] text-[#252D27]'
                  }`}>
                    {ord.orderStatus.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-[#252D27] font-medium">
                  {ord.items.length} item{ord.items.length !== 1 ? 's' : ''}: {ord.items[0]?.productTitle}
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#68756A] mt-2 pt-2 border-t border-[#E2E7DE]">
                  <span>To: {ord.deliveryTown}, {ord.deliveryCounty}</span>
                  <span className="font-extrabold text-[#214E34] tabular-nums">
                    KSh {ord.grandTotalKsh.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Details & Tracking (Right) */}
          <div className="lg:col-span-8">
            {selectedOrder && (
              <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs space-y-6">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E7DE]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#68756A] tracking-wider block">
                      Shipment Details
                    </span>
                    <h2 className="text-xl font-extrabold text-[#214E34] mt-0.5">
                      Order #{selectedOrder.orderNumber}
                    </h2>
                    <p className="text-xs text-[#68756A]">
                      Placed: {new Date(selectedOrder.createdAt).toLocaleDateString()} at {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#68756A] block font-medium">Total Paid (M-Pesa Escrow)</span>
                    <span className="text-xl font-extrabold text-[#214E34] tabular-nums">
                      KSh {selectedOrder.grandTotalKsh.toLocaleString()}
                    </span>
                    {selectedOrder.mpesaReceiptNumber && (
                      <span className="text-[10px] font-mono text-[#367C46] block font-bold">
                        Receipt: {selectedOrder.mpesaReceiptNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tracking Stepper */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#214E34] uppercase tracking-wider">
                    Live Highway Transit Timeline
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {selectedOrder.trackingSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                          step.completed
                            ? 'bg-[#EBF3ED] border-[#CFD7CA] text-[#214E34]'
                            : 'bg-[#F7F6F0] border-[#E2E7DE] text-[#68756A]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-bold mb-1">
                            <CheckCircle2 className={`w-3.5 h-3.5 ${step.completed ? 'text-[#367C46]' : 'text-[#68756A]'}`} />
                            <span>{step.label}</span>
                          </div>
                          <p className="text-[11px] leading-snug">{step.description}</p>
                        </div>
                        <span className="text-[10px] text-[#68756A] block mt-2 font-mono">
                          {step.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transporter / Driver Details */}
                {selectedOrder.transporterDetails && (
                  <div className="p-4 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#214E34] text-white flex items-center justify-center shrink-0">
                        <Truck className="w-5 h-5 text-[#D6A545]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#68756A] uppercase block">
                          Assigned Transporter
                        </span>
                        <p className="font-bold text-[#252D27] text-sm">
                          {selectedOrder.transporterDetails.name} · {selectedOrder.transporterDetails.vehiclePlate}
                        </p>
                        <p className="text-[11px] text-[#68756A]">
                          {selectedOrder.transporterDetails.vehicleType} (Vetted Carrier)
                        </p>
                      </div>
                    </div>

                    <a
                      href={`tel:${selectedOrder.transporterDetails.phone}`}
                      className="bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Driver ({selectedOrder.transporterDetails.phone})</span>
                    </a>
                  </div>
                )}

                {/* Items in Order */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#214E34] uppercase tracking-wider">
                    Purchased Goods
                  </h4>

                  <div className="divide-y divide-[#E2E7DE] border border-[#E2E7DE] rounded-lg overflow-hidden">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs bg-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover border border-[#E2E7DE]"
                          />
                          <div>
                            <span className="font-bold text-[#252D27] block">{item.productTitle}</span>
                            <span className="text-[11px] text-[#68756A]">
                              Qty: {item.quantity} {item.unit} · Producer: {item.sellerName}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-sm text-[#252D27] tabular-nums">
                            KSh {item.totalPriceKsh.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#68756A] block">
                            Freight: KSh {item.shippingCostKsh.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="p-4 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] text-xs">
                  <span className="font-bold text-[#252D27] block mb-1">
                    Delivery Destination & Receiver
                  </span>
                  <p className="text-[#252D27]">
                    Recipient: <strong>{selectedOrder.buyerName}</strong> ({selectedOrder.buyerPhone})
                  </p>
                  <p className="text-[#68756A] mt-0.5">
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
