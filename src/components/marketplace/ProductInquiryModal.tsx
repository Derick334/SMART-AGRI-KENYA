import React, { useState } from 'react';
import { X, Send, MessageSquare, CheckCircle2, AlertCircle, Phone, User, Calendar } from 'lucide-react';
import { Product } from '../../types';
import { agriStore } from '../../services/store';

interface ProductInquiryModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ProductInquiryModal: React.FC<ProductInquiryModalProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !product) return null;

  const currentUser = agriStore.getCurrentUser();
  const [buyerName, setBuyerName] = useState(currentUser?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phone || '');
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || '');
  const [quantityNeeded, setQuantityNeeded] = useState('1');
  const [desiredDeliveryDate, setDesiredDeliveryDate] = useState('');
  const [message, setMessage] = useState(
    `Hello ${product.sellerName}, I am interested in purchasing ${product.title} from ${product.sellerCounty}. Is this available for delivery or farmgate inspection?`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim() || !message.trim()) {
      setError('Please fill in your name, contact phone, and inquiry message.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const inquiry = agriStore.addInquiry({
      productId: product.id,
      productTitle: product.title,
      sellerId: product.sellerId,
      buyerId: currentUser?.id || 'anon-buyer',
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      buyerEmail: buyerEmail.trim() || undefined,
      message: message.trim(),
      requestedQuantity: Number(quantityNeeded) || undefined,
      deliveryPreference: 'delivery',
    });

    // Also attempt server sync
    fetch(`/api/products/${product.id}/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry),
    }).catch(err => console.warn('Inquiry server sync fallback:', err));

    setIsSubmitting(false);
    setSubmitted(true);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E7DE] relative animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#252D27] flex items-center justify-center transition cursor-pointer border border-[#E2E7DE]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#EBF3ED] text-[#214E34] flex items-center justify-center border border-[#CFD7CA]">
            <MessageSquare className="w-5 h-5 text-[#367C46]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#214E34]">Contact Seller / Send Inquiry</h3>
            <p className="text-xs text-[#68756A]">Direct inquiry to {product.sellerName}</p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EBF3ED] text-[#367C46] flex items-center justify-center mx-auto border border-[#CFD7CA]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#214E34]">Inquiry Sent Successfully!</h4>
            <p className="text-xs text-[#68756A] max-w-sm mx-auto">
              Your inquiry has been relayed to <strong>{product.sellerName}</strong>. The seller will contact you via phone or SMS shortly.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="bg-[#367C46] hover:bg-[#2B6437] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#68756A] block">Product</span>
                <span className="text-xs font-bold text-[#214E34] line-clamp-1">{product.title}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#68756A] block">Listed Price</span>
                <span className="text-xs font-bold text-[#367C46]">KSh {product.priceKsh.toLocaleString()} /{product.unit}</span>
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Kiprono Kipkemoi"
                  className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">Your Phone (M-Pesa)</label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="e.g. 0712345678"
                  className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">Quantity Needed</label>
                <input
                  type="number"
                  min="1"
                  value={quantityNeeded}
                  onChange={(e) => setQuantityNeeded(e.target.value)}
                  className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">Desired Delivery Date</label>
                <input
                  type="date"
                  value={desiredDeliveryDate}
                  onChange={(e) => setDesiredDeliveryDate(e.target.value)}
                  className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#252D27] mb-1">Message for Seller</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46] resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-[#E2E7DE] text-xs font-semibold hover:bg-[#F7F6F0] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-lg bg-[#367C46] hover:bg-[#2B6437] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
