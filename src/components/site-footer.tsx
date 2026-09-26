import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer id="aloqa" className="mt-24" style={{ background: "#1C0D14" }}>
      {/* Top gradient accent */}
      <div style={{ height: "3px", background: "linear-gradient(90deg, #8B3A5C 0%, #c06090 50%, #8B3A5C 100%)" }} />

      <div className="mx-auto max-w-7xl px-5 pt-16 pb-10">
        {/* Main grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div
              className="text-xl font-semibold tracking-tight"
              style={{ color: "#F5F1E8", fontFamily: "'Poppins','Inter',sans-serif" }}
            >
              NASTARIN GULLARI
            </div>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(245,241,232,0.55)" }}>
              Premium turda yig'ilgan mualliflik guldastalar. Gagarin bo'ylab 24/7 bepul yetkazib berish xizmati mavjud.
            </p>

            {/* Social buttons — text only, no icons */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com/nastarin_gullari.gagarin"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 hover:opacity-80"
                style={{ background: "rgba(139,58,92,0.20)", color: "#F5F1E8", border: "1px solid rgba(139,58,92,0.40)" }}
              >
                Instagram
              </a>
              <a
                href="https://t.me/nastarin_gullari.gagarin"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 hover:opacity-80"
                style={{ background: "rgba(139,58,92,0.20)", color: "#F5F1E8", border: "1px solid rgba(139,58,92,0.40)" }}
              >
                Telegram
              </a>
            </div>
          </div>

          {/* Contact column */}
          <div>
            <div
              className="text-xs uppercase tracking-widest font-semibold mb-6"
              style={{ color: "#8B3A5C" }}
            >
              Bog'lanish
            </div>
            <ul className="space-y-4 text-sm" style={{ color: "rgba(245,241,232,0.65)" }}>
              <li>
                <a
                  href="https://www.instagram.com/nastarin_gullari.gagarin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-150 hover:opacity-80"
                  style={{ color: "rgba(245,241,232,0.65)" }}
                >
                  @nastarin_gullari.gagarin
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/nastarin_gullari.gagarin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-150 hover:opacity-80"
                  style={{ color: "rgba(245,241,232,0.65)" }}
                >
                  @nastarin_gullari.gagarin
                </a>
              </li>
              <li style={{ color: "rgba(245,241,232,0.65)" }}>Har kuni 24/7 xizmati mavjud</li>
              <li style={{ color: "rgba(245,241,232,0.65)" }}>Soliq binosining yonida – Gagarin</li>
            </ul>
          </div>

          {/* Navigation column */}
          <div>
            <div
              className="text-xs uppercase tracking-widest font-semibold mb-6"
              style={{ color: "#8B3A5C" }}
            >
              Navigatsiya
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="transition-all duration-150 hover:opacity-80"
                  style={{ color: "rgba(245,241,232,0.65)" }}
                >
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="transition-all duration-150 hover:opacity-80"
                  style={{ color: "rgba(245,241,232,0.65)" }}
                >
                  Gullar katalogi
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="transition-all duration-150 hover:opacity-80"
                  style={{ color: "rgba(245,241,232,0.65)" }}
                >
                  Buyurtmani kuzatish
                </Link>
              </li>
            </ul>
          </div>

          {/* Guarantee column */}
          <div>
            <div
              className="text-xs uppercase tracking-widest font-semibold mb-6"
              style={{ color: "#8B3A5C" }}
            >
              Kafolat & Xizmat
            </div>
            <ul className="space-y-3 text-sm" style={{ color: "rgba(245,241,232,0.65)" }}>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "#8B3A5C" }} />
                100% Yangi gullar kafolati
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "#8B3A5C" }} />
                2 soatda tezkor yetkazib berish
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "#8B3A5C" }} />
                Rasm va video hisobot
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "#8B3A5C" }} />
                Bepul tabriknoma karta
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 mb-6" style={{ height: "1px", background: "rgba(245,241,232,0.08)" }} />

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs" style={{ color: "rgba(245,241,232,0.35)" }}>
            © {new Date().getFullYear()} NASTARIN GULLARI. Barcha huquqlar himoyalangan.
          </div>
          <div className="flex items-center gap-6 text-xs" style={{ color: "rgba(245,241,232,0.35)" }}>
            <a
              href="https://www.instagram.com/nastarin_gullari.gagarin"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition"
              style={{ color: "rgba(245,241,232,0.35)" }}
            >
              Instagram
            </a>
            <a
              href="https://t.me/nastarin_gullari.gagarin"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition"
              style={{ color: "rgba(245,241,232,0.35)" }}
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
