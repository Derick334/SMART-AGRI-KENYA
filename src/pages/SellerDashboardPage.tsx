import React, { useState } from 'react';
import { 
  Package, 
  PlusCircle, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Truck, 
  Tag, 
  FileCheck,
  Eye,
  Trash2
} from 'lucide-react';
import { agriStore } from '../services/store';
import { Product, ProductCategory } from '../types';

export const SellerDashboardPage: React.FC = () => {
  const currentUser = agriStore.getCurrentUser();
  const [products, setProducts] = useState<Product[]>(agriStore.getProducts());
  const [orders, setOrders] = useState(agriStore.getOrders());
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'payouts'>('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // New Product Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('inputs');
  const [priceKsh, setPriceKsh] = useState(1800);
  const [unit, setUnit] = useState('50kg bag');
  const [quantityAvailable, setQuantityAvailable] = useState(100);
  const [brand, setBrand] = useState('Kenya Seed Company');
  const [certificationInfo, setCertificationInfo] = useState('KEPHIS Certified Standard Seed (Lot #2026/KE/894)');
  const [imageUrl, setImageUrl] = useState('/assets/services/certified_farm_inputs.jpg');

  // Filter products by this seller or sample items for supplier
  const myInventory = products.filter(p => 
    p.sellerId === currentUser.id || 
    p.category === 'inputs' || 
    p.category === 'equipment' ||
    p.sellerName.includes('Agrovet')
  );

  const totalInventoryValue = myInventory.reduce((sum, p) => sum + (p.priceKsh * p.quantityAvailable), 0);
  const lowStockCount = myInventory.filter(p => p.quantityAvailable <= 10).length;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd = agriStore.addProduct({
      title,
      description,
      category,
      subcategory: category === 'inputs' ? 'Certified Seeds & Nutrition' : 'Machinery & Tools',
      priceKsh: Number(priceKsh),
      unit,
      quantityAvailable: Number(quantityAvailable),
      minimumOrder: 1,
      brand,
      certificationInfo,
      sellerId: currentUser.id,
      sellerName: currentUser.organizationName || currentUser.name,
      sellerPhone: currentUser.phone,
      sellerCounty: currentUser.county,
      sellerSubCounty: currentUser.subCounty || 'Eldoret',
      images: [imageUrl],
      isVerifiedSeller: true,
      rating: 4.9,
      reviewsCount: 12,
      deliveryOptions: ['pickup', 'carrier_dispatch'],
      status: 'active',
    });

    setProducts(agriStore.getProducts());
    setShowAddModal(false);
    setNotice(`"${newProd.title}" listed in SMART-AGRI KENYA marketplace with KEPHIS verification badge!`);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleDispatchOrder = (orderId: string) => {
    agriStore.updateOrderStatus(orderId, 'seller_confirmed');
    setOrders(agriStore.getOrders());
    setNotice('Order packaged! Assigned to Rift Transporters SACCO for pickup and dispatch.');
    setTimeout(() => setNotice(null), 5000);
  };

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

      {/* Supplier Profile Header */}
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
                <FileCheck className="w-3.5 h-3.5 text-[#367C46]" /> KEPHIS Licensed Supplier
              </span>
              <span className="text-[11px] font-medium text-[#68756A] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {currentUser.county} County
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#214E34] mt-1">
              {currentUser.organizationName || 'Rift Valley Agrovet Wholesalers'}
            </h1>
            <p className="text-xs text-[#68756A]">
              Director: {currentUser.name} · License: <span className="font-mono font-bold text-[#252D27]">{currentUser.licenseNumber || 'KEPHIS-AGR-8821'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-[#367C46] hover:bg-[#2B6437] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Stock Listing</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Active Stock SKUs</span>
            <Package className="w-4 h-4 text-[#367C46]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">{myInventory.length}</div>
          <div className="text-[11px] text-[#367C46] font-semibold mt-1">All KEPHIS tag compliant</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Inventory Asset Value</span>
            <DollarSign className="w-4 h-4 text-[#214E34]" />
          </div>
          <div className="text-2xl font-extrabold text-[#214E34]">
            KSh {totalInventoryValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#68756A] mt-1">Available in Eldoret warehouse</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Pending Orders</span>
            <Truck className="w-4 h-4 text-[#D6A545]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">
            {orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'seller_confirmed').length}
          </div>
          <div className="text-[11px] text-[#D6A545] font-semibold mt-1">Ready for transporter dispatch</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">{lowStockCount}</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">Reorder from manufacturers</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E7DE] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer ${
            activeTab === 'inventory' 
              ? 'bg-[#214E34] text-white shadow-xs' 
              : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
          }`}
        >
          Inventory Catalog ({myInventory.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer ${
            activeTab === 'orders' 
              ? 'bg-[#214E34] text-white shadow-xs' 
              : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
          }`}
        >
          Customer Orders Fulfillment
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer ${
            activeTab === 'payouts' 
              ? 'bg-[#214E34] text-white shadow-xs' 
              : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
          }`}
        >
          M-Pesa Business Disbursements
        </button>
      </div>

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-xl border border-[#E2E7DE] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E7DE] flex items-center justify-between text-xs">
            <span className="font-bold text-[#214E34]">Certified Seed, Fertilizer & Agricultural Inputs</span>
            <span className="text-[#68756A]">Showing {myInventory.length} SKUs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F0] text-[#68756A] font-semibold border-b border-[#E2E7DE]">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Brand & Certification</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3">Stock Level</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E7DE]">
                {myInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FDFCF7] transition">
                    <td className="p-3 flex items-center gap-3">
                      <img src={item.images[0]} alt={item.title} className="w-10 h-10 object-cover rounded-md border border-[#E2E7DE]" />
                      <div>
                        <div className="font-bold text-[#252D27]">{item.title}</div>
                        <div className="text-[11px] text-[#68756A]">Unit: {item.unit}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-[#252D27]">{item.brand || 'Certified Agro'}</div>
                      <div className="text-[10px] text-[#367C46] flex items-center gap-1 font-mono">
                        <Tag className="w-3 h-3" /> {item.certificationInfo || 'KEPHIS Standard'}
                      </div>
                    </td>
                    <td className="p-3 font-bold text-[#214E34]">
                      KSh {item.priceKsh.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className={`font-mono font-bold ${item.quantityAvailable <= 10 ? 'text-amber-600' : 'text-[#252D27]'}`}>
                        {item.quantityAvailable} units
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="bg-[#EBF3ED] text-[#214E34] text-[10px] font-bold px-2 py-0.5 rounded">
                        Active In Store
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button 
                        onClick={() => {
                          agriStore.deleteProduct(item.id);
                          setProducts(agriStore.getProducts());
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        title="Remove Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Orders Fulfillment Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded-xl p-5 border border-[#E2E7DE] shadow-xs space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#E2E7DE] gap-2">
                <div>
                  <span className="font-mono font-bold text-[#214E34] text-sm">{o.orderNumber}</span>
                  <span className="ml-2 font-semibold text-[#252D27]">Buyer: {o.buyerName} ({o.buyerPhone})</span>
                  <div className="text-[11px] text-[#68756A]">Delivery to: {o.deliveryTown}, {o.deliveryCounty} County</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-[#214E34]">Total: KSh {o.grandTotalKsh.toLocaleString()}</div>
                  <span className="text-[10px] font-bold bg-[#EBF3ED] text-[#367C46] px-2 py-0.5 rounded">
                    M-Pesa Escrow Deposited
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                {o.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[#68756A]">
                    <span>{it.quantity} × {it.unit} of {it.productTitle}</span>
                    <span className="font-semibold text-[#252D27]">KSh {it.totalPriceKsh.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E2E7DE]">
                <span className="text-[11px] font-semibold text-[#68756A]">
                  Status: <strong className="text-[#214E34] uppercase">{o.orderStatus.replace('_', ' ')}</strong>
                </span>

                {o.orderStatus === 'pending' && (
                  <button
                    onClick={() => handleDispatchOrder(o.id)}
                    className="inline-flex items-center gap-1.5 bg-[#367C46] hover:bg-[#2B6437] text-white px-4 py-2 rounded-lg font-bold shadow-xs cursor-pointer transition"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Package & Dispatch to Transporter</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-xl p-6 border border-[#E2E7DE] shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
            <div>
              <h2 className="text-base font-bold text-[#214E34]">M-Pesa Business Settlement Ledger</h2>
              <p className="text-[#68756A]">Disbursed directly to your Safaricom Paybill or Till Number upon buyer confirmation</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#68756A] uppercase">Cleared Balance</span>
              <div className="text-lg font-black text-[#214E34]">KSh 148,200</div>
            </div>
          </div>

          <div className="divide-y divide-[#E2E7DE]">
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#252D27]">M-Pesa B2C Payout - SA-KE-2026-9041</div>
                <div className="text-[11px] text-[#68756A]">Receipt: SK72910M4 · Disbursed to Till 882910</div>
              </div>
              <span className="font-bold text-[#367C46]">+ KSh 5,800</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#252D27]">M-Pesa B2C Payout - Bulk Maize Seed Order</div>
                <div className="text-[11px] text-[#68756A]">Receipt: SK61902K1 · Disbursed to Till 882910</div>
              </div>
              <span className="font-bold text-[#367C46]">+ KSh 34,800</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E2E7DE] shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
              <h3 className="text-base font-bold text-[#214E34]">Add Certified Farm Input Listing</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#68756A] hover:text-[#252D27] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Certified Seed Maize - Kenya Seed H614D (2kg)"
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#252D27] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                  >
                    <option value="inputs">Certified Farm Inputs</option>
                    <option value="equipment">Machinery & Irrigation</option>
                    <option value="seedlings">Seedlings & Nursery</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#252D27] mb-1">Manufacturer / Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Kenya Seed, Simlaw, Yara"
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#252D27] mb-1">Unit Price (KSh)</label>
                  <input
                    type="number"
                    required
                    value={priceKsh}
                    onChange={(e) => setPriceKsh(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#252D27] mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. 50kg bag, 2kg packet"
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#252D27] mb-1">Available Qty</label>
                  <input
                    type="number"
                    required
                    value={quantityAvailable}
                    onChange={(e) => setQuantityAvailable(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Certification & Batch Tag</label>
                <input
                  type="text"
                  value={certificationInfo}
                  onChange={(e) => setCertificationInfo(e.target.value)}
                  placeholder="e.g. KEPHIS Certified / PCPB Registration Number"
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Description & Application Advice</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Recommended agro-ecological zones, germination rate, active formulation..."
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#E2E7DE] text-[#68756A] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#367C46] hover:bg-[#2B6437] text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Save & Publish Stock Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
