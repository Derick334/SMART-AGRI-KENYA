import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Plus, 
  MapPin, 
  Flag, 
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';
import { ForumPost } from '../types';
import { agriStore } from '../services/store';

export const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>(agriStore.getForumPosts());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPostModal, setShowPostModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportedTitle, setReportedTitle] = useState('');

  // New post form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ForumPost['category']>('General Farming');
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const currentUser = agriStore.getCurrentUser();

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    agriStore.addForumPost({
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorCounty: currentUser.county,
      title,
      content,
      category,
      isVerifiedFarmer: currentUser.isVerified,
    });

    setPosts(agriStore.getForumPosts());
    setTitle('');
    setContent('');
    setShowPostModal(false);
  };

  const handleLike = (id: string) => {
    agriStore.likePost(id);
    setPosts(agriStore.getForumPosts());
  };

  const filtered = posts.filter(p => selectedCategory === 'all' || p.category === selectedCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {noticeMessage && (
        <div className="p-3.5 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] text-xs font-semibold rounded-lg flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <span>{noticeMessage}</span>
          </div>
          <button
            onClick={() => setNoticeMessage(null)}
            className="text-[#68756A] hover:text-[#252D27] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Banner */}
      <div className="bg-linear-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-4 h-4" />
            <span>National Agricultural Community & Baraza</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kenya Farmer Community Forum
          </h1>
          <p className="text-xs text-stone-300 mt-1 max-w-xl leading-relaxed">
            Connect with verified farmers, agronomists, and buyers across all 47 counties. Share field innovations, dairy management breakthroughs, and report suspicious traders.
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-stone-950 font-black text-xs px-5 py-3 rounded-2xl transition shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Start a Discussion</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        {['all', 'General Farming', 'Dairy & Livestock', 'Crop Protection', 'Market & Pricing', 'Smart Irrigation'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat === 'all' ? 'All Discussions' : cat}
          </button>
        ))}
      </div>

      {/* Discussions Feed */}
      <div className="space-y-4">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="p-5 sm:p-6 bg-white rounded-3xl border border-stone-200 shadow-xs hover:border-emerald-600/50 transition space-y-3"
          >
            {/* Author Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  {post.authorName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-stone-900">{post.authorName}</span>
                    {post.isVerifiedFarmer && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    {post.authorCounty} County • {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {post.category}
                </span>

                <button
                  onClick={() => {
                    setReportedTitle(post.title);
                    setShowReportModal(true);
                  }}
                  className="text-stone-400 hover:text-rose-600 p-1 transition cursor-pointer"
                  title="Report suspicious post or listing"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 mb-1">
                {post.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            {/* Engagement Row */}
            <div className="pt-3 border-t border-stone-100 flex items-center gap-4 text-xs text-stone-500">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1.5 text-stone-600 hover:text-rose-600 font-semibold transition cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-rose-50 text-rose-500" />
                <span>{post.likes} Helpful</span>
              </button>

              <div className="flex items-center gap-1.5 font-semibold">
                <MessageSquare className="w-4 h-4 text-stone-400" />
                <span>{post.repliesCount} Replies</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-900">Create Community Discussion</h3>
              <button onClick={() => setShowPostModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Discussion Topic Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best practice for curing onions in Baringo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden cursor-pointer"
                >
                  <option value="General Farming">General Farming</option>
                  <option value="Dairy & Livestock">Dairy & Livestock</option>
                  <option value="Crop Protection">Crop Protection</option>
                  <option value="Market & Pricing">Market & Pricing</option>
                  <option value="Smart Irrigation">Smart Irrigation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Message & Field Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your practical experience, questions, or crop observations..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl shadow-xs cursor-pointer"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Suspicious Seller Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-stone-900">Report to Platform Moderators</h3>
            </div>

            <p className="text-xs text-stone-600">
              Reporting: <strong>"{reportedTitle}"</strong>
            </p>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-stone-700">Reason for Report:</label>
              <select className="w-full p-2.5 rounded-xl border border-stone-300">
                <option>Fraudulent or counterfeit seeds / input claim</option>
                <option>Misleading livestock health or age</option>
                <option>Unregistered chemical / dangerous recommendation</option>
                <option>Harassment or spam</option>
              </select>

              <textarea
                rows={3}
                placeholder="Provide additional context for the administrator review..."
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setNoticeMessage('Complaint successfully lodged with the SMART-AGRI Kenya Security and Moderation Desk.');
                  setShowReportModal(false);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
