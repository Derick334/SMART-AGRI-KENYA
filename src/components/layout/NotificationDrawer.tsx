import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  CloudRain, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap, 
  ShoppingBag,
  ExternalLink,
  Clock,
  Filter
} from 'lucide-react';
import { InAppNotification } from '../../types';
import { agriStore } from '../../services/store';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
  onSelectNotification?: (notif: InAppNotification) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectNotification,
}) => {
  const [notifications, setNotifications] = useState<InAppNotification[]>(agriStore.getNotifications());
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    const update = () => setNotifications(agriStore.getNotifications());
    return agriStore.subscribe(update);
  }, []);

  if (!isOpen) return null;

  const handleMarkRead = (id: string) => {
    agriStore.markNotificationRead(id);
  };

  const handleMarkAllRead = () => {
    agriStore.markAllNotificationsRead();
  };

  const filtered = filterCategory === 'all'
    ? notifications
    : notifications.filter(n => n.category === filterCategory);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const categoryIcons: Record<string, any> = {
    system: Sparkles,
    weather: CloudRain,
    membership: ShieldCheck,
    consultation: Clock,
    marketplace: ShoppingBag,
    training: GraduationCap
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-2xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#E2E7DE] flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#E2E7DE] flex items-center justify-between bg-[#F7F6F0]">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Bell className="w-5 h-5 text-[#214E34]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D6A545] border-2 border-white" />
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#214E34]">Platform Notifications</h3>
                <span className="text-[11px] text-[#68756A]">{unreadCount} unread update{unreadCount === 1 ? '' : 's'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-[#367C46] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark All Read</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-[#68756A] hover:text-[#252D27] rounded-lg hover:bg-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="p-3 border-b border-[#E2E7DE] bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {['all', 'weather', 'membership', 'consultation', 'training'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-semibold capitalize shrink-0 transition cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-[#214E34] text-white shadow-xs'
                    : 'bg-[#F7F6F0] text-[#68756A] hover:bg-[#EBF3ED]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-[#68756A] text-xs">
                <Bell className="w-8 h-8 text-[#CFD7CA] mx-auto mb-2" />
                <p className="font-bold text-[#252D27]">No notifications in this view</p>
                <p className="text-[11px] mt-0.5">You are fully up to date with agricultural alerts.</p>
              </div>
            ) : (
              filtered.map((item) => {
                const Icon = categoryIcons[item.category] || Sparkles;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all text-xs space-y-1.5 ${
                      item.isRead 
                        ? 'bg-white border-[#E2E7DE]' 
                        : 'bg-[#FCF8EE] border-[#D6A545]/40 shadow-xs ring-1 ring-[#D6A545]/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-[#EBF3ED] text-[#214E34] flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 text-[#367C46]" />
                        </div>
                        <h4 className="font-extrabold text-[#252D27]">{item.title}</h4>
                      </div>
                      <span className="text-[10px] text-[#68756A] shrink-0 font-mono">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-[#4D574F] text-[11px] leading-relaxed">
                      {item.message}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[11px]">
                      {item.linkTab && onNavigateTab ? (
                        <button
                          onClick={() => {
                            onNavigateTab(item.linkTab!);
                            onClose();
                            handleMarkRead(item.id);
                          }}
                          className="font-bold text-[#214E34] hover:text-[#367C46] flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Tool</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      ) : <span />}

                      {!item.isRead && (
                        <button
                          onClick={() => handleMarkRead(item.id)}
                          className="text-[#68756A] hover:text-[#214E34] font-medium cursor-pointer"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
