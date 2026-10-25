import React, { useState } from 'react';
import { X, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { agriStore } from '../../services/store';

interface ProductReportModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductReportModal: React.FC<ProductReportModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  const currentUser = agriStore.getCurrentUser();
  const [reason, setReason] = useState<'counterfeit' | 'wrong_price' | 'unverified_claims' | 'unresponsive_seller' | 'offensive_content' | 'other'>('wrong_price');
  const [details, setDetails] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    const report = agriStore.addReport({
      productId: product.id,
      productTitle: product.title,
      reporterId: currentUser?.id || 'anon-reporter',
      reporterName: reporterContact.trim() || currentUser?.name || 'Concerned Member',
      reason,
      details: details.trim(),
    });

    fetch(`/api/products/${product.id}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    }).catch(err => console.warn('Report server sync fallback:', err));

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E7DE] relative animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#252D27] flex items-center justify-center transition cursor-pointer border border-[#E2E7DE]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#214E34]">Report Listing</h3>
            <p className="text-xs text-[#68756A]">Flag suspicious or inaccurate agricultural listing</p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EBF3ED] text-[#367C46] flex items-center justify-center mx-auto border border-[#CFD7CA]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#214E34]">Report Received</h4>
            <p className="text-xs text-[#68756A] max-w-sm mx-auto">
              Our agricultural trust and safety moderation team will investigate this listing against Kenyan agricultural trading standards.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="bg-[#367C46] hover:bg-[#2B6437] text-white text-xs font-bold px-5 py-2 rounded-lg cursor-pointer transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="p-2.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] text-xs">
              <span className="text-[#68756A] block">Reporting Listing:</span>
              <span className="font-bold text-[#214E34] line-clamp-1">{product.title}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#252D27] mb-1">Reason for Report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
              >
                <option value="wrong_price">Unrealistic or Fraudulent Price</option>
                <option value="counterfeit">Counterfeit or Fake Input/Seed</option>
                <option value="unverified_claims">Unverified Certification or Health Claims</option>
                <option value="unresponsive_seller">Seller Unresponsive or Fake Location</option>
                <option value="offensive_content">Inappropriate or Offensive Listing</option>
                <option value="other">Other Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#252D27] mb-1">Detailed Explanation</label>
              <textarea
                rows={3}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain what is misleading, inaccurate or suspicious about this agricultural listing..."
                className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#252D27] mb-1">Your Phone / Email (Optional)</label>
              <input
                type="text"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                placeholder="For compliance follow-up if needed"
                className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
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
                className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Submit Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
