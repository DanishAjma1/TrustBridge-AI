import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";
import toast from "react-hot-toast";
import { playNotificationSound } from "../utils/notificationSound";
import { initNotificationAudio } from "../utils/notificationSound";

interface Notification {
    _id: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    link?: string;
    sender?: {
        name: string;
        email: string;
        role: string;
    };
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearAll: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    subscribePush: () => Promise<void>;
    unsubscribePush: () => Promise<void>;
    isPushSupported: boolean;
    isPushSubscribed: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const URL = import.meta.env.VITE_BACKEND_URL;
    const [isPushSupported, setIsPushSupported] = useState<boolean>(false);
    const [isPushSubscribed, setIsPushSubscribed] = useState<boolean>(false);

    useEffect(() => {
        setIsPushSupported(typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window);
    }, []);

    async function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    const subscribePush = async () => {
        if (!user?.userId) throw new Error('Not authenticated');
        if (!isPushSupported) throw new Error('Push not supported in this browser');

        try {
            // Request notification permission first
            if (typeof Notification !== 'undefined') {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') throw new Error('Notification permission denied');
            }
            // Register service worker; try common fallback path used in dev-dist
            let reg: ServiceWorkerRegistration | undefined;
            try {
                reg = await navigator.serviceWorker.register('/sw.js');
            } catch {
                reg = await navigator.serviceWorker.register('/dev-dist/sw.js');
            }
            const vapidPublic = import.meta.env.VITE_VAPID_PUBLIC_KEY;
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: await urlBase64ToUint8Array(vapidPublic)
            });

            const token = localStorage.getItem('token');
            await axios.post(`${URL}/notifications/subscribe`, { userId: user.userId, subscription: sub }, { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
            setIsPushSubscribed(true);
            toast.success('Subscribed to push notifications');
        } catch (err) {
            console.error('Push subscribe error', err);
            toast.error(((err as unknown as { message?: string })?.message) || 'Failed to subscribe to push');
            throw err;
        }
    };

    // On mount, check current service worker registration and subscription
    useEffect(() => {
        const checkSubscription = async () => {
            if (!isPushSupported) return;
            try {
                const regs = await navigator.serviceWorker.getRegistrations();
                let foundSub = false;
                for (const r of regs) {
                    try {
                        const s = await r.pushManager.getSubscription();
                        if (s) { foundSub = true; break; }
                        } catch {
                            // ignore per-registration errors
                        }
                }
                setIsPushSubscribed(foundSub);
            } catch (err) {
                console.error('Error checking push subscription', err);
                setIsPushSubscribed(false);
            }
        };
        checkSubscription();
    }, [isPushSupported]);

    const unsubscribePush = async () => {
        if (!user?.userId) throw new Error('Not authenticated');
        try {
            const reg = await navigator.serviceWorker.getRegistration();
            if (reg) {
                const sub = await reg.pushManager.getSubscription();
                if (sub) await sub.unsubscribe();
            }
            const token = localStorage.getItem('token');
            await axios.post(`${URL}/notifications/unsubscribe`, { userId: user.userId }, { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
            setIsPushSubscribed(false);
            toast.success('Unsubscribed from push notifications');
        } catch (err) {
            console.error('Push unsubscribe error', err);
            toast.error('Failed to unsubscribe from push');
            throw err;
        }
    };

    const fetchNotifications = useCallback(async () => {
        if (!user?.userId) {
            setNotifications([]);
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${URL}/admin/notifications/${user.userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.userId, URL]);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
            setIsLoading(false);
        }
    }, [user, fetchNotifications]);

    // Real-time notification listener
    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (notification: Notification) => {
            console.log('🔔 Real-time notification received:', notification);
            
            // Add notification to the top of the list
            setNotifications(prev => [notification, ...prev]);
            
            // Show toast notification
            toast(
                <div className="flex items-start gap-3">
                    <div className="flex-1">
                        <p className="font-medium text-sm">{notification.message}</p>
                        {notification.sender && (
                            <p className="text-xs text-gray-500 mt-1">
                                From: {notification.sender.name}
                            </p>
                        )}
                    </div>
                </div>,
                {
                    icon: '🔔',
                    duration: 5000,
                    position: 'top-right',
                    style: {
                        maxWidth: '400px',
                    },
                }
            );

            // Play notification sound (optional)
            playNotificationSound();
        };

        socket.on('new-notification', handleNewNotification);

        return () => {
            socket.off('new-notification', handleNewNotification);
        };
    }, [socket]);

    // Listen for messages from the service worker (push events when page is open)
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;
        const handler = (event: MessageEvent) => {
            try {
                const data = event.data;
                if (data && data.type === 'push') {
                    // play sound and optionally show a toast when SW forwards push
                    playNotificationSound();
                    if (data.payload && data.payload.message) {
                        toast(data.payload.message, { icon: '🔔', duration: 4000 });
                    }
                }
            } catch {
                // ignore
            }
        };
        navigator.serviceWorker.addEventListener('message', handler as EventListener);
        return () => navigator.serviceWorker.removeEventListener('message', handler as EventListener);
    }, []);

    // Ensure audio is unlocked on first user interaction so sounds can play
    useEffect(() => {
        const unlock = async () => {
            try {
                await initNotificationAudio();
            } catch {
                // ignore
            }
            document.removeEventListener('pointerdown', unlock);
            document.removeEventListener('click', unlock);
        };
        document.addEventListener('pointerdown', unlock, { once: true });
        document.addEventListener('click', unlock, { once: true });
        // also try immediately in case already allowed
        initNotificationAudio().catch(() => {});
    }, []);

    const markAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev =>
            prev.map(n => n._id === id ? { ...n, isRead: true } : n)
        );

        try {
            const token = localStorage.getItem("token");
            await axios.put(`${URL}/admin/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
            // Rollback if needed, but for isRead it's often okay to just stay "read" unless strictly critical
            // fetchNotifications(); // Re-fetch on error to be safe
        }
    };

    const markAllAsRead = async () => {
        if (!user?.userId) return;

        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

        try {
            const token = localStorage.getItem("token");
            await axios.put(`${URL}/admin/notifications/read-all/${user.userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error marking all as read:", error);
            fetchNotifications();
        }
    };

    const clearAll = async () => {
        if (!user?.userId) return;

        const originalNotifications = [...notifications];
        // Optimistic update
        setNotifications([]);

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${URL}/admin/notifications/${user.userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Notifications cleared");
        } catch (error) {
            console.error("Error clearing notifications:", error);
            setNotifications(originalNotifications);
            toast.error("Failed to clear notifications");
        }
    };

    const deleteNotification = async (id: string) => {
        const originalNotifications = [...notifications];
        // Optimistic update
        setNotifications(prev => prev.filter(n => n._id !== id));

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${URL}/admin/notifications/item/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error deleting notification:", error);
            setNotifications(originalNotifications);
            toast.error("Failed to delete notification");
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const value = {
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        clearAll,
        deleteNotification,
        subscribePush,
        unsubscribePush,
        isPushSupported,
        isPushSubscribed,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};
