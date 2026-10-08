import { useState, useEffect } from "react";
import { Download, WifiOff, X, Share, PlusSquare, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const INSTALL_DISMISS_KEY = "nastarin_pwa_install_dismissed";

export function PwaManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Service Worker Registratsiyasi
    if ("serviceWorker" in navigator) {
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

    const dismissed = localStorage.getItem(INSTALL_DISMISS_KEY) === "true";

    // 4. Install prompt tadbiri (Android/Chrome/Desktop)
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);

      if (!dismissed && !isStandalone) {
        const timeout = window.setTimeout(() => {
          setShowInstallBanner(true);
        }, 2500);

        return () => window.clearTimeout(timeout);
      }
    };

    // 5. App installed listener
    const handleAppInstalled = () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
      localStorage.setItem(INSTALL_DISMISS_KEY, "true");
      console.log("PWA ilovasi muvaffaqiyatli o'rnatildi");
    };

    // 6. Offline / Online holatlari
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isStandalone]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("Foydalanuvchi PWA ilovasini o'rnatishni qabul qildi");
      }
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      return;
    }

    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    setShowInstallBanner(false);
  };

  const handleDismissBanner = () => {
    setShowInstallBanner(false);
    setShowIosGuide(false);
    localStorage.setItem(INSTALL_DISMISS_KEY, "true");
  };

  return (
    <>
      {/* OFFLINE BAND / BANNER */}
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-center gap-2 bg-destructive px-4 py-2.5 text-center text-xs font-medium text-destructive-foreground shadow-md sm:text-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0 animate-pulse" />
          <span>Siz oflayn holatdasiz. Davom etish uchun tarmoqqa ulaning.</span>
        </div>
      )}

      {/* PWA INSTALL BANNER (Android / Desktop Chrome / Edge) */}
      {!isStandalone && showInstallBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-[90] max-w-md rounded-2xl border border-border bg-card p-4 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom sm:left-auto sm:right-6">
          <div className="flex items-start gap-3">
            <img
              src="/icon-192x192.png"
              alt="NASTARIN GULLARI Icon"
              className="h-12 w-12 shrink-0 rounded-xl border border-border/50 object-cover shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold tracking-tight text-foreground">
                NASTARIN ilovasini o'rnating
              </h4>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Telefoningiz ekraniga o'rnatib, gul yetkazib berish xizmatidan tez va qulay foydalaning.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  <Download className="h-3.5 w-3.5" />
                  O'rnatish
                </button>
                <button
                  onClick={handleDismissBanner}
                  className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary"
                >
                  Keyinroq
                </button>
              </div>
            </div>
            <button
              onClick={handleDismissBanner}
              aria-label="Bannerni yopish"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* iOS SAFARI INSTALLATION GUIDE DIALOG */}
      {showIosGuide && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-sm rounded-t-2xl border border-border bg-card p-6 shadow-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground">iPhone'ga o'rnatish</h3>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Safari brauzerida ushbu ilovani quyidagi 2 qadamda ekraningizga mobil ilova kabi qo'shishingiz mumkin:
            </p>

            <ol className="mt-4 space-y-3 text-xs font-medium text-foreground">
              <li className="flex items-start gap-3 rounded-xl border border-border/50 bg-secondary/50 p-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  1
                </div>
                <div className="space-y-0.5">
                  <p className="flex items-center gap-1.5 font-semibold">
                    Safari menyusida <Share className="h-4 w-4 text-primary" /> "Ulashish" tugmasini bosing
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3 rounded-xl border border-border/50 bg-secondary/50 p-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  2
                </div>
                <div className="space-y-0.5">
                  <p className="flex items-center gap-1.5 font-semibold">
                    Pastga surib, <PlusSquare className="h-4 w-4 text-primary" /> "Ekran yuziga qo'shish" opsiyasini tanlang
                  </p>
                </div>
              </li>
            </ol>

            <button
              onClick={() => setShowIosGuide(false)}
              className="mt-5 w-full rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Tushunarli
            </button>
          </div>
        </div>
      )}
    </>
  );
}
