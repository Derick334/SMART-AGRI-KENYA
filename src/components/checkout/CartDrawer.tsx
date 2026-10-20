import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  MapPin, 
  ShieldCheck 
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#E2E7DE]">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E7DE] flex items-center justify-between bg-[#F7F6F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EBF3ED] text-[#214E34] flex items-center justify-center border border-[#CFD7CA]">
              <ShoppingBag className="w-4 h-4 text-[#367C46]" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-[#214E34]">
                Your Produce & Livestock Cart
              </h2>
              <p className="text-[11px] text-[#68756A]">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-[#E2E7DE] hover:bg-[#EBF3ED] text-[#252D27] flex items-center justify-center transition cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#68756A]">
              <div className="w-14 h-14 rounded-full bg-[#F7F6F0] flex items-center justify-center text-[#68756A] mb-3 border border-[#E2E7DE]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#252D27] text-sm mb-1">Your cart is empty</h3>
              <p className="text-xs text-[#68756A] max-w-xs mb-4">
                Explore our fresh harvest, certified seeds, or pedigree dairy cattle to place an order.
              </p>
              <button
                onClick={onClose}
                className="bg-[#367C46] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#2B6437] transition cursor-pointer shadow-xs"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="p-3 bg-white rounded-lg border border-[#E2E7DE] shadow-xs flex gap-3 relative group"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-lg object-cover border border-[#E2E7DE] shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase text-[#214E34] bg-[#EBF3ED] px-1.5 py-0.5 rounded border border-[#CFD7CA]">
                        {item.product.category}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#68756A] hover:text-[#79543A] transition p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-bold text-[#252D27] text-xs line-clamp-1 mt-0.5">
                      {item.product.title}
                    </h4>

                    <div className="flex items-center gap-1 text-[10px] text-[#68756A] mt-0.5">
                      <MapPin className="w-3 h-3 text-[#367C46] shrink-0" />
                      <span>{item.product.sellerCounty}</span>
                      <span>•</span>
                      <span>KSh {item.product.priceKsh.toLocaleString()} / {item.product.unit}</span>
                    </div>
                  </div>

                  {/* Quantity & Subtotal */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E2E7DE] mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-[#F7F6F0] hover:bg-[#EBF3ED] border border-[#E2E7DE] font-bold text-xs flex items-center justify-center transition cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-[#252D27] w-6 text-center tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-[#F7F6F0] hover:bg-[#EBF3ED] border border-[#E2E7DE] font-bold text-xs flex items-center justify-center transition cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-bold text-xs text-[#214E34] tabular-nums">
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
          <div className="p-4 sm:p-5 border-t border-[#E2E7DE] bg-[#F7F6F0] space-y-3">
            <div className="space-y-1.5 text-xs text-[#68756A]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-[#252D27] tabular-nums">
                  KSh {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#367C46]" />
                  Estimated Delivery Fee ({userCounty}):
                </span>
                <span className="font-semibold text-[#252D27] tabular-nums">
                  {estimatedShipping > 0 ? `KSh ${estimatedShipping.toLocaleString()}` : 'Free / Self-Pickup'}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E2E7DE] flex justify-between text-sm font-extrabold text-[#214E34]">
                <span>Total Amount:</span>
                <span className="text-base tabular-nums">
                  KSh {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#68756A]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#367C46]" />
              <span>Protected by SMART-AGRI Kenyan Escrow</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
