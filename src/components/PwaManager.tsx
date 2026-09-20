import { useState, useEffect } from "react";
import { Download, WifiOff, X, Share, PlusSquare, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Service Worker Registratsiyasi
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("PWA Service Worker muvaffaqiyatli ro'yxatdan o'tdi:", registration.scope);
          })
          .catch((error) => {
            console.error("Service Worker registratsiyasida xatolik:", error);
          });
      });
    }

    // 2. Standalone (ekranga o'rnatilgan) holatini aniqlash
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes("android-app://");

      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();

    // 3. iOS qurilmasini aniqlash
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIos(isIosDevice);

    // 4. Install prompt tadbiri (Android/Chrome/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Agar foydalanuvchi avvalroq yopmagan bo'lsa, bannerni ko'rsatish
      const dismissed = localStorage.getItem("nastarin_pwa_install_dismissed");
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 5. App installed listener
    const handleAppInstalled = () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
      console.log("PWA ilovasi muvaffaqiyatli o'rnatildi");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // 6. Offline / Online holatlari
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof navigator !== "undefined") {
      setIsOffline(!navigator.onLine);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("Foydalanuvchi PWA ilovasini o'rnatishni qabul qildi");
      }
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  const handleDismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem("nastarin_pwa_install_dismissed", "true");
  };

  return (
    <>
      {/* OFFLINE BAND / BANNER */}
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-0 left-0 right-0 z-[100] bg-destructive text-destructive-foreground px-4 py-2.5 text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-md animate-in slide-in-from-top duration-300"
        >
          <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
          <span>Siz oflayn holatdasiz. Davom etish uchun tarmoqqa ulaning.</span>
        </div>
      )}

      {/* PWA INSTALL BANNER (Android / Desktop Chrome / Edge) */}
      {showInstallBanner && !isStandalone && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[90] bg-card border border-border shadow-2xl rounded-2xl p-4 transition-all duration-300 animate-in slide-in-from-bottom duration-500 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <img
              src="/icon-192x192.png"
              alt="NASTARIN GULLARI Icon"
              className="w-12 h-12 rounded-xl object-cover shadow-sm border border-border/50 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground tracking-tight">
                NASTARIN ilovasini o'rnating
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Telefoningiz ekraniga o'rnatib, gul yetkazib berish xizmatidan tez va qulay foydalaning.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  O'rnatish
                </button>
                <button
                  onClick={handleDismissBanner}
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Keyinroq
                </button>
              </div>
            </div>
            <button
              onClick={handleDismissBanner}
              aria-label="Bannerni yopish"
              className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* iOS SAFARI INSTALLATION GUIDE DIALOG */}
      {showIosGuide && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground text-base">iPhone'ga o'rnatish</h3>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Safari brauzerida ushbu ilovani quyidagi 2 qadamda ekraningizga mobil ilova kabi qo'shishingiz mumkin:
            </p>

            <ol className="space-y-3 text-xs text-foreground font-medium">
              <li className="flex items-start gap-3 bg-secondary/50 p-2.5 rounded-xl border border-border/50">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                  1
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold flex items-center gap-1.5">
                    Safari menyusida <Share className="w-4 h-4 text-primary inline" /> "Ulashish" (Share) tugmasini bosing
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3 bg-secondary/50 p-2.5 rounded-xl border border-border/50">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                  2
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold flex items-center gap-1.5">
                    Pastga surib, <PlusSquare className="w-4 h-4 text-primary inline" /> "Ekran yuziga qo'shish" (Add to Home Screen) opsiyasini tanlang
                  </p>
                </div>
              </li>
            </ol>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:bg-primary/90 transition-colors"
            >
              Tushunarli
            </button>
          </div>
        </div>
      )}
    </>
  );
}
