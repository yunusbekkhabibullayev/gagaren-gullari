import { Link } from "@tanstack/react-router";
import { Instagram, Send, Phone, MapPin, Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer id="aloqa" className="mt-24 border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="petal-divider mb-10" aria-hidden />
        <div className="grid gap-10 sm:grid-cols-4">
          <div className="sm:col-span-1">
            <div className="font-display text-xl font-semibold">NASTARIN GULLARI</div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Premium turda yig'ilgan mualliflik guldastalar. Gagarin bo'ylab 24/7 bepul
              yetkazib berish xizmati mavjud.
            </p>
            {/* Social Media Links */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.instagram.com/nastarin_gullari.gagarin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-[#e0526c] transition hover:bg-[#e0526c] hover:text-white"
                title="Instagram @nastarin_gullari.gagarin"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/nastarin_gullari.gagarin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition hover:bg-sky-600 hover:text-white"
                title="Telegram @nastarin_gullari.gagarin"
              >
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold">Bog'lanish</div>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-[#e0526c]" />
                <a
                  href="https://www.instagram.com/nastarin_gullari.gagarin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground hover:underline font-medium"
                >
                  @nastarin_gullari.gagarin
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Send className="h-4 w-4 text-sky-500" />
                <a
                  href="https://t.me/nastarin_gullari.gagarin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground hover:underline font-medium"
                >
                  @nastarin_gullari.gagarin
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-500" />
                <span>Har kuni 24/7 xizmati mavjud</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-500" />
                <span>Soliq binosining yonida - Gagarin</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold">Navigatsiya</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="underline-offset-4 hover:text-foreground hover:underline">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  Gullar katalogi
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  Buyurtmani kuzatish
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold">Kafolat & Xizmat</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>✓ 100% Yangi gullar kafolati</li>
              <li>✓ 2 soatda tezkor yetkazib berish</li>
              <li>✓ Rasm va vido hisobot</li>
              <li>✓ Bepul tabriknoma karta</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-6 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} NASTARIN GULLARI. Barcha huquqlar himoyalangan.</div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/nastarin_gullari.gagarin"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Instagram
            </a>
            <span>•</span>
            <a
              href="https://t.me/nastarin_gullari.gagarin"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
