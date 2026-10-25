import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  FileText, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  DollarSign, 
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { agriStore } from '../services/store';
import { Order } from '../types';

export const BuyerDashboardPage: React.FC = () => {
  const currentUser = agriStore.getCurrentUser();
  const [orders, setOrders] = useState<Order[]>(agriStore.getOrders());
  const [activeTab, setActiveTab] = useState<'orders' | 'rfq' | 'watchlist' | 'escrow'>('orders');
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [rfqNotice, setRfqNotice] = useState<string | null>(null);

  // New RFQ State
  const [rfqCrop, setRfqCrop] = useState('Shangi Potatoes');
  const [rfqQuantity, setRfqQuantity] = useState('50 Tonnes');
  const [rfqDeliveryLocation, setRfqDeliveryLocation] = useState('Mombasa Wholesale Kongowea Market');
  const [rfqTargetPrice, setRfqTargetPrice] = useState('3200 per 90kg bag');
  const [rfqNotes, setRfqNotes] = useState('Looking for Grade 1 washed potatoes, weekly supply contract with escrow guarantee.');

  const [rfqList, setRfqList] = useState([
    {
      id: 'rfq-101',
      crop: 'Shangi Potatoes (Grade 1)',
      quantity: '50 Tonnes / Week',
      destination: 'Kongowea Market, Mombasa',
      targetPrice: 'KSh 3,200 / 90kg bag',
      responsesCount: 6,
      status: 'Open for Bids',
      postedDate: '2026-10-18',
    },
    {
      id: 'rfq-102',
      crop: 'Fresh Soya Beans',
      quantity: '10 Tonnes',
      destination: 'Nairobi Industrial Area',
      targetPrice: 'KSh 85 / kg',
      responsesCount: 3,
      status: 'Contract Awarded',
      postedDate: '2026-10-14',
    }
  ]);

  const handleCreateRfq = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: `rfq-${Date.now().toString().slice(-4)}`,
      crop: rfqCrop,
      quantity: rfqQuantity,
      destination: rfqDeliveryLocation,
      targetPrice: rfqTargetPrice,
      responsesCount: 0,
      status: 'Open for Bids',
      postedDate: new Date().toISOString().split('T')[0],
    };
    setRfqList([newEntry, ...rfqList]);
    setShowRfqModal(false);
    setRfqNotice(`RFQ tender for ${rfqCrop} broadcasted to all verified farmers in relevant counties!`);
    setTimeout(() => setRfqNotice(null), 5000);
  };

  const handleConfirmDelivery = (orderId: string) => {
    agriStore.updateOrderStatus(orderId, 'delivered');
    setOrders(agriStore.getOrders());
    setRfqNotice('Goods receipt confirmed! Escrow funds released to farmer and transporter.');
    setTimeout(() => setRfqNotice(null), 5000);
  };

  const totalSpent = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.grandTotalKsh : 0), 0);
  const inTransitCount = orders.filter(o => o.orderStatus === 'in_transit' || o.orderStatus === 'seller_confirmed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Feedback Banner */}
      {rfqNotice && (
        <div className="p-3.5 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] text-xs font-semibold rounded-lg flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <span>{rfqNotice}</span>
          </div>
          <button onClick={() => setRfqNotice(null)} className="text-[#214E34] p-1 cursor-pointer">✕</button>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] font-extrabold text-2xl flex items-center justify-center overflow-hidden shrink-0">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              currentUser.name.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-[#EBF3ED] text-[#214E34] px-2.5 py-0.5 rounded border border-[#CFD7CA]">
                Verified Commercial Buyer
              </span>
              <span className="text-[11px] font-medium text-[#68756A] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {currentUser.county} County ({currentUser.town || 'Kenya'})
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#214E34] mt-1">{currentUser.name}</h1>
            <p className="text-xs text-[#68756A]">
              {currentUser.organizationName || 'Coastal Fresh Produce Wholesalers'} · Safaricom: <span className="font-mono">{currentUser.phone}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowRfqModal(true)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-[#367C46] hover:bg-[#2B6437] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Bulk Buying RFQ</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Orders Placed</span>
            <ShoppingBag className="w-4 h-4 text-[#367C46]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">{orders.length}</div>
          <div className="text-[11px] text-[#367C46] font-semibold mt-1">Direct from registered farms</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">In Transit / Dispatch</span>
            <Truck className="w-4 h-4 text-[#D6A545]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">{inTransitCount}</div>
          <div className="text-[11px] text-[#D6A545] font-semibold mt-1">Live KeNHA tracking active</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">M-Pesa Escrow Spend</span>
            <DollarSign className="w-4 h-4 text-[#367C46]" />
          </div>
          <div className="text-2xl font-extrabold text-[#214E34]">
            KSh {totalSpent.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#68756A] mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#367C46]" /> 100% Escrow Protected
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Active RFQs</span>
            <FileText className="w-4 h-4 text-[#214E34]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">{rfqList.length}</div>
          <div className="text-[11px] text-[#367C46] font-semibold mt-1">9 farmer responses received</div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#E2E7DE] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer ${
            activeTab === 'orders' 
              ? 'bg-[#214E34] text-white shadow-xs' 
              : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
          }`}
        >
          My Orders & Delivery Tracking ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('rfq')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer ${
            activeTab === 'rfq' 
              ? 'bg-[#214E34] text-white shadow-xs' 
              : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
          }`}
        >
          Bulk Purchase Tenders (RFQs)
        </button>
        <button
          onClick={() => setActiveTab('escrow')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer ${
            activeTab === 'escrow' 
              ? 'bg-[#214E34] text-white shadow-xs' 
              : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
          }`}
        >
          M-Pesa Escrow Guarantee
        </button>
      </div>

      {/* Tab: Orders & Live Tracking */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-5 border border-[#E2E7DE] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E7DE] gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#214E34]">{order.orderNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      order.orderStatus === 'delivered'
                        ? 'bg-[#EBF3ED] text-[#214E34]'
                        : 'bg-[#FCF8EE] text-[#79543A]'
                    }`}>
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold bg-[#EBF3ED] text-[#367C46] px-2 py-0.5 rounded">
                      M-Pesa Paid ({order.mpesaReceiptNumber || 'SK89021M'})
                    </span>
                  </div>
                  <div className="text-[11px] text-[#68756A] mt-0.5">
                    Destination: {order.deliveryTown}, {order.deliveryCounty} County · Date: {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-[#214E34]">
                    Total: KSh {order.grandTotalKsh.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#68756A]">
                    Freight included: KSh {order.shippingTotalKsh.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.productTitle} className="w-10 h-10 object-cover rounded-md border border-[#E2E7DE]" />
                      <div>
                        <div className="font-bold text-[#252D27]">{item.productTitle}</div>
                        <div className="text-[11px] text-[#68756A]">
                          Qty: {item.quantity} × {item.unit} · Seller: {item.sellerName} ({item.sellerPhone})
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-[#252D27]">
                      KSh {item.totalPriceKsh.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Transporter Details & Tracking */}
              {order.transporterDetails && (
                <div className="bg-[#F7F6F0] p-3 rounded-lg border border-[#E2E7DE] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#367C46] shrink-0" />
                    <div>
                      <span className="font-bold text-[#252D27]">Assigned Transporter:</span> {order.transporterDetails.name} ({order.transporterDetails.vehiclePlate} · {order.transporterDetails.vehicleType})
                    </div>
                  </div>
                  <a
                    href={`tel:${order.transporterDetails.phone}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#367C46] hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Driver ({order.transporterDetails.phone})
                  </a>
                </div>
              )}

              {/* Action Button */}
              {order.orderStatus !== 'delivered' && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleConfirmDelivery(order.id)}
                    className="inline-flex items-center gap-2 bg-[#214E34] hover:bg-[#183C27] text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D6A545]" />
                    <span>Confirm Goods Received & Release Escrow</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab: Bulk Purchase RFQs */}
      {activeTab === 'rfq' && (
        <div className="bg-white rounded-xl p-6 border border-[#E2E7DE] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
            <div>
              <h2 className="text-base font-bold text-[#214E34]">Broadcasted Bulk Buying Tenders</h2>
              <p className="text-xs text-[#68756A]">Farmers receive instant SMS/WhatsApp alerts for your commodity tenders</p>
            </div>
            <button
              onClick={() => setShowRfqModal(true)}
              className="bg-[#367C46] hover:bg-[#2B6437] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Tender</span>
            </button>
          </div>

          <div className="divide-y divide-[#E2E7DE]">
            {rfqList.map((rfq) => (
              <div key={rfq.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#68756A]">{rfq.id}</span>
                    <span className="font-extrabold text-sm text-[#252D27]">{rfq.crop}</span>
                    <span className="bg-[#EBF3ED] text-[#214E34] text-[10px] font-bold px-2 py-0.5 rounded">
                      {rfq.status}
                    </span>
                  </div>
                  <div className="text-[#68756A] space-x-3">
                    <span>Required Volume: <strong className="text-[#252D27]">{rfq.quantity}</strong></span>
                    <span>Target Price: <strong className="text-[#214E34]">{rfq.targetPrice}</strong></span>
                    <span>Delivery: <strong className="text-[#252D27]">{rfq.destination}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-bold text-[#367C46]">{rfq.responsesCount} Bids from Farmers</span>
                    <div className="text-[10px] text-[#68756A]">Posted {rfq.postedDate}</div>
                  </div>
                  <button className="bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#214E34] font-bold px-3 py-1.5 rounded-lg border border-[#E2E7DE] transition cursor-pointer">
                    Review Farmer Bids
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Escrow Guarantee */}
      {activeTab === 'escrow' && (
        <div className="bg-white rounded-xl p-6 border border-[#E2E7DE] shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E2E7DE]">
            <div className="w-10 h-10 rounded-lg bg-[#EBF3ED] text-[#214E34] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#367C46]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#214E34]">M-Pesa Escrow Protection Protocol</h2>
              <p className="text-xs text-[#68756A]">Funds are held securely by SMART-AGRI KENYA until you verify produce quantity and moisture content at delivery</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#367C46] text-white font-bold flex items-center justify-center text-xs">1</span>
              <h3 className="font-bold text-[#252D27]">1. Payment Locked</h3>
              <p className="text-[#68756A]">You pay via Safaricom M-Pesa STK Push. Money does not go to the farmer immediately.</p>
            </div>

            <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#367C46] text-white font-bold flex items-center justify-center text-xs">2</span>
              <h3 className="font-bold text-[#252D27]">2. Monitored Freight</h3>
              <p className="text-[#68756A]">Licensed transporter picks up the produce, verified with weighbridge weight slips.</p>
            </div>

            <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#367C46] text-white font-bold flex items-center justify-center text-xs">3</span>
              <h3 className="font-bold text-[#252D27]">3. Inspection & Release</h3>
              <p className="text-[#68756A]">You inspect produce on delivery. Click 'Confirm Delivery' and funds release immediately.</p>
            </div>
          </div>
        </div>
      )}

      {/* RFQ Modal */}
      {showRfqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E2E7DE] shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
              <h3 className="text-base font-bold text-[#214E34]">Post Bulk Commodity Tender (RFQ)</h3>
              <button onClick={() => setShowRfqModal(false)} className="text-[#68756A] hover:text-[#252D27] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateRfq} className="space-y-3">
              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Crop / Agricultural Produce</label>
                <input
                  type="text"
                  required
                  value={rfqCrop}
                  onChange={(e) => setRfqCrop(e.target.value)}
                  placeholder="e.g. Shangi Potatoes, Dry Maize (H614), Red Bulb Onions"
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#252D27] mb-1">Target Volume / Quantity</label>
                  <input
                    type="text"
                    required
                    value={rfqQuantity}
                    onChange={(e) => setRfqQuantity(e.target.value)}
                    placeholder="e.g. 50 Tonnes, 500 Bags"
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#252D27] mb-1">Target Price</label>
                  <input
                    type="text"
                    required
                    value={rfqTargetPrice}
                    onChange={(e) => setRfqTargetPrice(e.target.value)}
                    placeholder="e.g. KSh 3,200 / bag"
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Delivery Destination</label>
                <input
                  type="text"
                  required
                  value={rfqDeliveryLocation}
                  onChange={(e) => setRfqDeliveryLocation(e.target.value)}
                  placeholder="e.g. Kongowea Market Mombasa or Nairobi Wakulima"
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Specifications & Quality Standard</label>
                <textarea
                  rows={3}
                  value={rfqNotes}
                  onChange={(e) => setRfqNotes(e.target.value)}
                  placeholder="Moisture content under 13.5%, Grade 1 size, sorting requirements"
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRfqModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#E2E7DE] text-[#68756A] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#367C46] hover:bg-[#2B6437] text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Broadcast Tender to Farmers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
