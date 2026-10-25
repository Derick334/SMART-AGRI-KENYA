import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  DollarSign, 
  Phone, 
  PlusCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { agriStore } from '../services/store';
import { Order } from '../types';

export const TransporterDashboardPage: React.FC = () => {
  const currentUser = agriStore.getCurrentUser();
  const [orders, setOrders] = useState<Order[]>(agriStore.getOrders());
  const [activeTab, setActiveTab] = useState<'dispatches' | 'fleet' | 'routes'>('dispatches');
  const [notice, setNotice] = useState<string | null>(null);

  const [fleet] = useState([
    {
      plate: 'KDG 492X',
      model: 'Isuzu NPR 3-Tonne Canter (Insulated Box)',
      driver: 'Joseph Waweru (Owner)',
      capacity: '3,500 Kg',
      status: 'On Highway Route (A104)',
      rateKm: 'KSh 110/km',
    },
    {
      plate: 'KDA 184M',
      model: 'Toyota Probox Farm Van',
      driver: 'Peter Karanja',
      capacity: '600 Kg',
      status: 'Available in Nakuru Town',
      rateKm: 'KSh 55/km',
    },
    {
      plate: 'KCR 882B',
      model: 'Mitsubishi Fuso 10-Tonne High-Sided Truck',
      driver: 'Moses Cheruiyot',
      capacity: '10,000 Kg',
      status: 'Loading at Kitale Depot',
      rateKm: 'KSh 185/km',
    }
  ]);

  const handleUpdateTrip = (orderId: string, nextStatus: Order['orderStatus']) => {
    agriStore.updateOrderStatus(orderId, nextStatus);
    setOrders(agriStore.getOrders());
    setNotice(`Dispatch status for #${orderId} updated to ${nextStatus.replace('_', ' ').toUpperCase()}! Notified seller and buyer via SMS.`);
    setTimeout(() => setNotice(null), 5000);
  };

  const activeDispatches = orders.filter(o => o.orderStatus === 'in_transit' || o.orderStatus === 'seller_confirmed');
  const totalFreightEarned = orders.reduce((sum, o) => sum + o.shippingTotalKsh, 0) + 14500;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {notice && (
        <div className="p-3.5 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] text-xs font-semibold rounded-lg flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-[#214E34] p-1 cursor-pointer">✕</button>
        </div>
      )}

      {/* Transporter Profile Header */}
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
              <span className="text-[11px] font-bold uppercase tracking-wider bg-[#EBF3ED] text-[#214E34] px-2.5 py-0.5 rounded border border-[#CFD7CA] flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#367C46]" /> NTSA Licensed Agricultural Carrier
              </span>
              <span className="text-[11px] font-medium text-[#68756A] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Base: {currentUser.county} County
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#214E34] mt-1">
              {currentUser.organizationName || 'Rift Transporters SACCO'}
            </h1>
            <p className="text-xs text-[#68756A]">
              Fleet Manager: {currentUser.name} · NTSA SACCO License: <span className="font-mono font-bold text-[#252D27]">{currentUser.licenseNumber || 'NTSA-COM-7712'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-[#FCF8EE] text-[#79543A] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#E2E7DE] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D6A545]" /> KeNHA Highway Weighbridge Cleared
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Active Dispatches</span>
            <Navigation className="w-4 h-4 text-[#367C46]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">{activeDispatches.length}</div>
          <div className="text-[11px] text-[#367C46] font-semibold mt-1">Cargo in transit</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Fleet Vehicles Active</span>
            <Truck className="w-4 h-4 text-[#D6A545]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">{fleet.length}</div>
          <div className="text-[11px] text-[#D6A545] font-semibold mt-1">GPS telemetry online</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Highway Distance Covered</span>
            <MapPin className="w-4 h-4 text-[#214E34]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">1,420 Km</div>
          <div className="text-[11px] text-[#68756A] mt-1">Northern Corridor routes</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Freight Revenue Ledger</span>
            <DollarSign className="w-4 h-4 text-[#367C46]" />
          </div>
          <div className="text-2xl font-extrabold text-[#214E34]">
            KSh {totalFreightEarned.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#367C46] font-semibold mt-1">Guaranteed escrow payout</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E7DE] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('dispatches')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer ${
            activeTab === 'dispatches' 
              ? 'bg-[#214E34] text-white shadow-xs' 
              : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
          }`}
        >
          Active Farm Cargo Deliveries ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('fleet')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer ${
            activeTab === 'fleet' 
              ? 'bg-[#214E34] text-white shadow-xs' 
              : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
          }`}
        >
          Registered Fleet Vehicles ({fleet.length})
        </button>
      </div>

      {/* Dispatches Tab */}
      {activeTab === 'dispatches' && (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-white rounded-xl p-5 border border-[#E2E7DE] shadow-xs space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#E2E7DE] gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#214E34]">{ord.orderNumber}</span>
                    <span className="bg-[#EBF3ED] text-[#214E34] font-bold text-[10px] px-2 py-0.5 rounded capitalize">
                      {ord.orderStatus.replace('_', ' ')}
                    </span>
                    <span className="bg-[#FCF8EE] text-[#79543A] font-bold text-[10px] px-2 py-0.5 rounded">
                      Freight Fee: KSh {ord.shippingTotalKsh.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#68756A] mt-0.5">
                    Consignee: <strong>{ord.buyerName}</strong> ({ord.buyerPhone}) · Deliver to: {ord.deliveryAddress}, {ord.deliveryCounty}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-[#252D27]">Assigned: KDG 492X (3-Tonne Canter)</div>
                  <div className="text-[10px] text-[#68756A]">Driver: Joseph Waweru</div>
                </div>
              </div>

              {/* Manifest Items */}
              <div className="p-3 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] space-y-1">
                <span className="font-bold text-[#252D27] block">Cargo Manifest:</span>
                {ord.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[#68756A]">
                    <span>· {it.quantity} × {it.unit} of {it.productTitle}</span>
                    <span>Origin: {it.sellerName} ({it.sellerPhone})</span>
                  </div>
                ))}
              </div>

              {/* Trip Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E2E7DE]">
                <span className="text-[11px] text-[#68756A]">
                  Waypoint: Highway A104 Timboroa / Salgaa corridor
                </span>

                <div className="flex items-center gap-2">
                  {ord.orderStatus === 'seller_confirmed' && (
                    <button
                      onClick={() => handleUpdateTrip(ord.id, 'in_transit')}
                      className="bg-[#367C46] hover:bg-[#2B6437] text-white px-3 py-1.5 rounded-lg font-bold transition shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Start Highway Transit</span>
                    </button>
                  )}

                  {ord.orderStatus === 'in_transit' && (
                    <button
                      onClick={() => handleUpdateTrip(ord.id, 'delivered')}
                      className="bg-[#214E34] hover:bg-[#183C27] text-white px-3 py-1.5 rounded-lg font-bold transition shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D6A545]" />
                      <span>Mark Delivered to Buyer</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fleet Vehicles Tab */}
      {activeTab === 'fleet' && (
        <div className="bg-white rounded-xl border border-[#E2E7DE] shadow-xs overflow-hidden text-xs">
          <div className="p-4 border-b border-[#E2E7DE] flex items-center justify-between">
            <span className="font-bold text-[#214E34]">Carrier Fleet Manifest</span>
            <button className="bg-[#367C46] text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register Vehicle</span>
            </button>
          </div>

          <table className="w-full text-left">
            <thead className="bg-[#F7F6F0] text-[#68756A] font-semibold border-b border-[#E2E7DE]">
              <tr>
                <th className="p-3">Plate & Model</th>
                <th className="p-3">Assigned Driver</th>
                <th className="p-3">Payload Capacity</th>
                <th className="p-3">Kilometer Tariff</th>
                <th className="p-3">Live Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E7DE]">
              {fleet.map((veh, idx) => (
                <tr key={idx} className="hover:bg-[#FDFCF7]">
                  <td className="p-3">
                    <span className="font-mono font-bold text-[#214E34]">{veh.plate}</span>
                    <div className="text-[11px] text-[#68756A]">{veh.model}</div>
                  </td>
                  <td className="p-3 font-medium text-[#252D27]">{veh.driver}</td>
                  <td className="p-3 text-[#252D27]">{veh.capacity}</td>
                  <td className="p-3 font-mono font-bold text-[#367C46]">{veh.rateKm}</td>
                  <td className="p-3">
                    <span className="bg-[#EBF3ED] text-[#214E34] text-[10px] font-bold px-2 py-0.5 rounded">
                      {veh.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
