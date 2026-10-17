import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';
import { CartItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  userCounty?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  userCounty = 'Nairobi',
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.priceKsh * item.quantity, 
    0
  );
  const estimatedShipping = cartItems.reduce(
    (sum, item) => sum + (item.selectedDelivery === 'delivery' ? item.shippingCostKsh : 0), 
    0
  );
  const grandTotal = subtotal + estimatedShipping;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="font-bold text-base text-stone-900">
                Your Produce & Livestock Cart
              </h2>
              <p className="text-[11px] text-stone-500">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 hover:bg-stone-100 text-stone-600 flex items-center justify-center transition cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-300 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-stone-800 text-sm mb-1">Your cart is empty</h3>
              <p className="text-xs text-stone-500 max-w-xs mb-4">
                Explore our fresh harvest, certified seeds, or pedigree dairy cattle to place an order.
              </p>
              <button
                onClick={onClose}
                className="bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-800 transition cursor-pointer"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs flex gap-3 relative group"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-18 h-18 rounded-xl object-cover border border-stone-200 shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {item.product.category}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 transition p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-bold text-stone-900 text-xs line-clamp-1 mt-0.5">
                      {item.product.title}
                    </h4>

                    <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span>{item.product.sellerCounty}</span>
                      <span>•</span>
                      <span>KSh {item.product.priceKsh.toLocaleString()} / {item.product.unit}</span>
                    </div>
                  </div>

                  {/* Quantity & Subtotal */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 font-bold text-xs flex items-center justify-center transition cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-stone-800 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 font-bold text-xs flex items-center justify-center transition cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-bold text-xs text-emerald-950">
                      KSh {(item.product.priceKsh * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Calculations & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-stone-900">
                  KSh {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  Estimated Delivery Fee ({userCounty}):
                </span>
                <span className="font-semibold text-stone-900">
                  {estimatedShipping > 0 ? `KSh ${estimatedShipping.toLocaleString()}` : 'Free / Self-Pickup'}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-extrabold text-stone-950">
                <span>Total Amount:</span>
                <span className="text-emerald-900 text-base">
                  KSh {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-800/20 transition cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-emerald-300" />
            </button>

            <p className="text-[10px] text-center text-stone-500">
              🔒 Protected by SMART-AGRI Kenyan Escrow. Funds released only after delivery inspection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
