"use client";

import React, { useState } from "react";
import { useNotificationStore, NotificationType } from "@/lib/store/useNotificationStore";
import { Bell, CheckCircle2, Trash2, Filter, AlertCircle, Activity, Stethoscope, CreditCard, FlaskConical, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore();
  const [filter, setFilter] = useState<"all" | "unread" | NotificationType>("all");

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case "emergency": return <AlertCircle className="w-5 h-5 text-emergency-red" />;
      case "appointment": return <Clock className="w-5 h-5 text-medical-blue" />;
      case "lab": return <FlaskConical className="w-5 h-5 text-teal-hms" />;
      case "billing": return <CreditCard className="w-5 h-5 text-warning-amber" />;
      case "system": return <Activity className="w-5 h-5 text-gray-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgForType = (type: NotificationType) => {
    switch (type) {
      case "emergency": return "bg-red-50";
      case "appointment": return "bg-blue-50";
      case "lab": return "bg-teal-50";
      case "billing": return "bg-amber-50";
      case "system": return "bg-gray-100";
      default: return "bg-gray-50";
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    return n.type === filter;
  });

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <HMSSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HMSHeader title="Notification Center" />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 mr-4">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-700">Filter:</span>
                </div>
                {(["all", "unread", "emergency", "appointment", "system"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all border",
                      filter === f 
                        ? "bg-medical-blue text-white border-medical-blue shadow-md shadow-medical-blue/20" 
                        : "bg-white text-gray-500 border-gray-200 hover:border-medical-blue hover:text-medical-blue"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={markAllAsRead}
                  disabled={notifications.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-medical-blue bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark All Read
                </button>
                <button 
                  onClick={clearAll}
                  disabled={notifications.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-emergency-red bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              {filteredNotifications.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-black text-gray-800 mb-2">No Notifications Found</h3>
                  <p className="text-gray-500 max-w-md">You're all caught up! There are no notifications matching your current filter criteria.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={cn(
                        "p-5 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row gap-4 sm:items-start group",
                        !notification.isRead ? "bg-blue-50/20" : ""
                      )}
                    >
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", getBgForType(notification.type))}>
                        {getIconForType(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <h4 className={cn("text-sm font-bold truncate", !notification.isRead ? "text-gray-900" : "text-gray-700")}>
                            {notification.title}
                          </h4>
                          <span className="text-[10px] font-bold text-gray-400 shrink-0 uppercase tracking-wider">
                            {new Date(notification.time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full",
                            !notification.isRead ? "bg-medical-blue text-white" : "bg-gray-100 text-gray-500"
                          )}>
                            {notification.isRead ? "Read" : "Unread"}
                          </span>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2.5 py-1 rounded-full border border-gray-200">
                            {notification.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-medical-blue hover:bg-blue-50 rounded-xl transition-colors tooltip-trigger"
                            title="Mark as Read"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-emergency-red hover:bg-red-50 rounded-xl transition-colors tooltip-trigger"
                          title="Delete Notification"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
