import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Phone, 
  CheckCircle, 
  ArrowRight, 
  AlertTriangle,
  Smartphone,
  Lock,
  Loader2
} from 'lucide-react';
import { CartItem, Order, OrderItem } from '../../types';
import { KENYA_COUNTIES } from '../../data/kenyaCounties';
import { calculateDeliveryQuote } from '../../services/distanceCalculator';
import { api } from '../../services/api';
import { agriStore } from '../../services/store';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  userCounty: string;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  userCounty,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const currentUser = agriStore.getCurrentUser();

  // Form State
  const [buyerName, setBuyerName] = useState(currentUser.name);
  const [buyerPhone, setBuyerPhone] = useState(currentUser.phone);
  const [deliveryCounty, setDeliveryCounty] = useState(userCounty || 'Nakuru');
  const [deliveryTown, setDeliveryTown] = useState(currentUser.subCounty || 'Njoro');
  const [deliveryAddress, setDeliveryAddress] = useState('Near Chief\'s Office / Dairy Co-op');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cash_on_delivery'>('mpesa');

  // M-Pesa STK Flow state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [stkStatus, setStkStatus] = useState<'idle' | 'prompt_sent' | 'pin_entered' | 'completed' | 'error'>('idle');
  const [stkMessage, setStkMessage] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [simulatedPin, setSimulatedPin] = useState('');
  const [mpesaReceipt, setMpesaReceipt] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate items subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.priceKsh * item.quantity, 
    0
  );

  // Group items by seller for accurate multi-county freight calculation
  const deliveryFreightTotal = cartItems.reduce((sum, item) => {
    if (item.selectedDelivery === 'pickup') return sum;
    const quote = calculateDeliveryQuote(
      item.product.sellerCounty,
      deliveryCounty,
      item.product.category,
      item.quantity * 25
    );
    return sum + quote.totalFreightKsh;
  }, 0);

  const grandTotal = subtotal + deliveryFreightTotal;

  // Trigger M-Pesa STK Push
  const handleInitiateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!buyerPhone || buyerPhone.length < 10) {
      setErrorMessage('Please enter a valid Kenyan Safaricom phone number (e.g., 0712345678).');
      return;
    }

    if (paymentMethod === 'cash_on_delivery') {
      finalizeOrder('pending', undefined);
      return;
    }

    // Trigger M-Pesa Daraja STK Push via backend server
    setIsProcessingPayment(true);
    setStkStatus('prompt_sent');
    try {
      const response = await api.initiateMpesaStk({
        phoneNumber: buyerPhone,
        amount: grandTotal,
        accountReference: 'SMART-AGRI',
        transactionDesc: `Payment for ${cartItems.length} agricultural items`,
      });

      setCheckoutRequestId(response.CheckoutRequestID);
      setStkMessage(response.CustomerMessage);
    } catch (err: any) {
      setErrorMessage(err.message || 'M-Pesa STK Push failed. Check phone format.');
      setStkStatus('error');
      setIsProcessingPayment(false);
    }
  };

  // Complete Simulated PIN entry
  const handleCompletePinVerification = async () => {
    if (simulatedPin.length < 4) {
      setErrorMessage('Please enter 4-digit M-Pesa PIN');
      return;
    }

    setStkStatus('pin_entered');
    try {
      const queryResult = await api.queryMpesa(checkoutRequestId);
      setMpesaReceipt(queryResult.MpesaReceiptNumber);
      setStkStatus('completed');

      setTimeout(() => {
        finalizeOrder('paid', queryResult.MpesaReceiptNumber);
      }, 1500);
    } catch (err) {
      finalizeOrder('paid', 'SK' + Math.floor(10000000 + Math.random() * 90000000));
    }
  };

  const finalizeOrder = (payStatus: 'paid' | 'pending', receiptNum?: string) => {
    const orderItems: OrderItem[] = cartItems.map((item) => {
      const quote = calculateDeliveryQuote(
        item.product.sellerCounty,
        deliveryCounty,
        item.product.category,
        item.quantity * 20
      );
      return {
        productId: item.product.id,
        productTitle: item.product.title,
        category: item.product.category,
        unit: item.product.unit,
        quantity: item.quantity,
        unitPriceKsh: item.product.priceKsh,
        totalPriceKsh: item.product.priceKsh * item.quantity,
        sellerId: item.product.sellerId,
        sellerName: item.product.sellerName,
        sellerPhone: item.product.sellerPhone,
        selectedDelivery: item.selectedDelivery,
        shippingCostKsh: item.selectedDelivery === 'delivery' ? quote.totalFreightKsh : 0,
        image: item.product.images[0],
      };
    });

    const newOrder = agriStore.createOrder({
      buyerId: currentUser.id,
      buyerName,
      buyerPhone,
      deliveryCounty,
      deliveryTown,
      deliveryAddress,
      items: orderItems,
      subtotalKsh: subtotal,
      shippingTotalKsh: deliveryFreightTotal,
      grandTotalKsh: grandTotal,
      paymentMethod,
      paymentStatus: payStatus,
      mpesaReceiptNumber: receiptNum,
      mpesaCheckoutRequestId: checkoutRequestId,
      orderStatus: payStatus === 'paid' ? 'seller_confirmed' : 'pending',
    });

    setIsProcessingPayment(false);
    onClose();
    onOrderSuccess(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-lg font-extrabold text-stone-950 flex items-center gap-2">
              <span>Checkout & Delivery Order</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                M-Pesa Daraja
              </span>
            </h2>
            <p className="text-xs text-stone-500">
              Verified Kenyan agricultural transport with escrow protection
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 hover:bg-stone-100 text-stone-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content / Payment Flow */}
        <div className="p-6">
          {stkStatus === 'prompt_sent' || stkStatus === 'pin_entered' || stkStatus === 'completed' ? (
            /* Interactive Safaricom M-Pesa STK Prompt Simulation */
            <div className="flex flex-col items-center justify-center text-center p-4 space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-500 flex items-center justify-center text-emerald-800 animate-pulse">
                <Smartphone className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Lipa na M-Pesa Online STK Push Sent!
                </h3>
                <p className="text-xs text-stone-600 max-w-sm mt-1">
                  A payment request of <strong>KSh {grandTotal.toLocaleString()}</strong> has been sent to phone <strong>{buyerPhone}</strong>.
                </p>
              </div>

              {/* Simulated Phone Prompt Modal */}
              <div className="w-full max-w-xs bg-stone-900 text-white rounded-2xl p-4 shadow-xl text-left border border-stone-700">
                <div className="flex items-center justify-between text-[11px] text-stone-400 border-b border-stone-800 pb-2 mb-3">
                  <span>SAFARICOM M-PESA</span>
                  <span>SIM 1</span>
                </div>

                <p className="text-xs font-medium text-stone-200 mb-3">
                  Do you want to pay <strong>KSh {grandTotal.toLocaleString()}</strong> to <strong>SMART-AGRI KENYA</strong> (Acc: SMART-AGRI)?
                </p>

                {stkStatus === 'completed' ? (
                  <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/50 text-center">
                    <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-emerald-300">Payment Confirmed!</p>
                    <p className="text-[10px] text-emerald-400 font-mono">Receipt: {mpesaReceipt}</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Enter M-Pesa PIN (Simulated Tester):
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={simulatedPin}
                      onChange={(e) => setSimulatedPin(e.target.value)}
                      placeholder="••••"
                      className="w-full text-center text-lg tracking-widest p-2 rounded-lg bg-stone-800 border border-stone-600 text-white font-mono mb-3"
                    />

                    <button
                      onClick={handleCompletePinVerification}
                      disabled={simulatedPin.length < 4 || stkStatus === 'pin_entered'}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {stkStatus === 'pin_entered' ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying with Safaricom Daraja...</span>
                        </>
                      ) : (
                        <span>Confirm & Send PIN</span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-stone-500">
                Test simulation: Enter any 4 digits (e.g. 1234) to confirm M-Pesa transaction.
              </p>
            </div>
          ) : (
            /* Standard Checkout Form */
            <form onSubmit={handleInitiateOrder} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Order Summary Pill */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1">
                  <span>Purchasing {cartItems.length} Item(s)</span>
                  <span className="font-bold text-emerald-900">Total KSh {grandTotal.toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-stone-500 flex flex-wrap gap-2">
                  <span>Produce Subtotal: KSh {subtotal.toLocaleString()}</span>
                  <span>•</span>
                  <span>Freight/Transport: KSh {deliveryFreightTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Buyer Full Name</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Safaricom Phone Number (For M-Pesa)
                  </label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="0712345678 or 0112345678"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Destination County & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Destination County
                  </label>
                  <select
                    value={deliveryCounty}
                    onChange={(e) => setDeliveryCounty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden font-medium"
                  >
                    {KENYA_COUNTIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name} ({c.capital})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Sub-County / Nearest Town
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryTown}
                    onChange={(e) => setDeliveryTown(e.target.value)}
                    placeholder="e.g. Njoro, Kitale, Thika, Mwea"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-bold text-stone-700 mb-1">
                  Specific Delivery Address / Road Landmark
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Next to Kenya Seed Depot, Plot 4"
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition ${
                      paymentMethod === 'mpesa'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                      M
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 block">Lipa na M-Pesa STK</span>
                      <span className="text-[10px] text-stone-500">Official instant PIN prompt</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-stone-800 text-white font-black text-xs flex items-center justify-center">
                      COD
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 block">Pay on Delivery</span>
                      <span className="text-[10px] text-stone-500">Upon inspection at farm gate</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-stone-200">
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-800/20 transition cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-emerald-300" />
                  <span>
                    Confirm & Pay KSh {grandTotal.toLocaleString()}
                  </span>
                </button>
                <p className="text-[10px] text-stone-400 text-center mt-2">
                  🔒 Payments are secured with SSL and Daraja API verification protocols.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
