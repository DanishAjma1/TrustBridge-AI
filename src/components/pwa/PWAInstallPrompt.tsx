import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { X, Download, Share, PlusSquare, Menu } from "lucide-react";

// Minimal typing for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "pwa_prompt_dismissed";

export const PWAInstallPrompt: React.FC = () => {
  const { user } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [canShowAfterDelay, setCanShowAfterDelay] = useState(false);
  const [platform, setPlatform] = useState<'chrome' | 'ios' | 'firefox' | 'other'>('other');

  useEffect(() => {
    // Detect Platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isFirefox = /firefox/.test(userAgent);
    
    // Set platform state
    if (isIOS) setPlatform('ios');
    else if (isFirefox) setPlatform('firefox');
    else setPlatform('chrome'); // Default to chrome logic for others

    // Hide if already installed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // Handle Chrome/Edge/Android
    const handler = (e: Event) => {
      e.preventDefault();
      const bpEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(bpEvent);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, [user]);

  // When user logs in, reset dismissal and start a delay before showing the prompt
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (user) {
      // Don't auto-reset dismiss key to avoid spamming on every login if declared dismissed
      // sessionStorage.removeItem(DISMISS_KEY); 
      setCanShowAfterDelay(false);
      // Wait ~8s after login to avoid showing during initial toast/navigation
      timer = setTimeout(() => setCanShowAfterDelay(true), 8000);
    } else {
      setCanShowAfterDelay(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [user]);

  // Show prompt logic
  useEffect(() => {
    const dismissed = sessionStorage.getItem(DISMISS_KEY) === "true";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
    
    if (user && canShowAfterDelay && !dismissed && !isStandalone) {
       if (deferredPrompt) {
         setVisible(true); // Chrome/Edge
       } else if (platform === 'ios' || platform === 'firefox') {
         setVisible(true); // iOS/Firefox manual instructions
       }
    }
  }, [user, deferredPrompt, canShowAfterDelay, platform]);

  const handleInstall = async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
        setVisible(false);
        setDeferredPrompt(null);
        } else {
        sessionStorage.setItem(DISMISS_KEY, "true");
        setVisible(false);
        }
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-[10000] px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative p-6 space-y-4 animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleDismiss}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
            <img
              src="/logo-192x192.png"
              alt="TrustBridge logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Install TrustBridge AI</h3>
            <p className="text-sm text-gray-500">Add to home screen for quick access</p>
          </div>
        </div>

        {/* Content based on platform */}
        <div className="pt-2">
            {deferredPrompt ? (
                // Chrome / Edge / Supported Browser
                 <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Install TrustBridge AI as an app on your device for a better experience. Get quick access and offline support.
                    </p>
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleDismiss}
                            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                        >
                            Not now
                        </button>
                        <button
                            onClick={handleInstall}
                            className="flex-[2] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-lg shadow-blue-500/20 text-sm"
                        >
                            <Download size={18} />
                            <span>Install App</span>
                        </button>
                    </div>
                 </div>
            ) : platform === 'ios' ? (
                // iOS Instructions
                <div className="space-y-3">
                     <p className="text-sm text-gray-600">
                        To install this app on your iPhone or iPad:
                    </p>
                    <ol className="text-sm text-gray-700 space-y-3 list-none p-0 bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <li className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">1</span>
                            <span>Tap the <Share size={16} className="inline mx-1 text-blue-500" /> <span className="font-semibold">Share</span> button in Safari.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">2</span>
                             <span>Scroll down and tap <span className="font-semibold inline-flex items-center gap-1 text-gray-900">Add to Home Screen <PlusSquare size={16} /></span>.</span>
                        </li>
                    </ol>
                    <button
                        onClick={handleDismiss}
                        className="w-full mt-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                    >
                        Got it
                    </button>
                </div>
            ) : platform === 'firefox' ? (
                 // Firefox Instructions (Android)
                 <div className="space-y-3">
                     <p className="text-sm text-gray-600">
                        To install this app in Firefox:
                    </p>
                    <ol className="text-sm text-gray-700 space-y-3 list-none p-0 bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <li className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">1</span>
                            <span>Tap the <span className="font-semibold inline-flex items-center gap-1">Menu <Menu size={14} /></span> (three dots) next to the URL bar.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">2</span>
                             <span>Select <span className="font-semibold text-gray-900">Install</span>.</span>
                        </li>
                    </ol>
                     <button
                        onClick={handleDismiss}
                        className="w-full mt-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                    >
                        Got it
                    </button>
                </div>
            ) : (
                // Fallback for other browsers (Samsung Internet etc usually support deferredPrompt, so this is catch-all)
                <div className="space-y-4">
                     <p className="text-sm text-gray-600">
                        To install, open your browser options and look for <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong>.
                    </p>
                     <button
                        onClick={handleDismiss}
                         className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
