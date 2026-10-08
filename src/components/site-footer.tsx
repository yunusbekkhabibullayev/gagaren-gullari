import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer id="aloqa" className="hidden md:block mt-24" style={{ background: "#D84C73" }}>
      {/* Top accent bar */}
      <div style={{ height: "3px", background: "rgba(255,255,255,0.3)" }} />

      <div className="mx-auto max-w-7xl px-5 pt-16 pb-10">
        {/* Main grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div
              className="text-xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: "'Poppins','Inter',sans-serif" }}
            >
              NASTARIN GULLARI
            </div>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.90)" }}>
              Premium turda yig'ilgan mualliflik guldastalar. Do'stlik bo'ylab 24/7 bepul yetkazib berish xizmati mavjud.
            </p>

            {/* Social Icon Buttons */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com/nastarin_gullari.dostlik"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white bg-white/20 border border-white/30 transition-all duration-200 hover:bg-white hover:text-[#D84C73] hover:scale-110 shadow-sm"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://t.me/nastarin_gullari.dostlik"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white bg-white/20 border border-white/30 transition-all duration-200 hover:bg-white hover:text-[#D84C73] hover:scale-110 shadow-sm"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contact column */}
          <div>
            <div
              className="text-xs uppercase tracking-widest font-bold text-white mb-6"
            >
              Bog'lanish
            </div>
            <ul className="space-y-4 text-sm" style={{ color: "rgba(255,255,255,0.92)" }}>
              <li>
                <a
                  href="https://www.instagram.com/nastarin_gullari.dostlik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-150 hover:underline"
                  style={{ color: "#FFFFFF" }}
                >
                  @nastarin_gullari.dostlik
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/nastarin_gullari.dostlik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-150 hover:underline"
                  style={{ color: "#FFFFFF" }}
                >
                  @nastarin_gullari.dostlik
                </a>
              </li>
              <li style={{ color: "#FFFFFF" }}>Har kuni 24/7 xizmati mavjud</li>
              <li style={{ color: "#FFFFFF" }}>Soliq binosining yonida – Do'stlik</li>
            </ul>
          </div>

          {/* Navigation column */}
          <div>
            <div
              className="text-xs uppercase tracking-widest font-bold text-white mb-6"
            >
              Navigatsiya
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="transition-all duration-150 hover:underline"
                  style={{ color: "#FFFFFF" }}
                >
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="transition-all duration-150 hover:underline"
                  style={{ color: "#FFFFFF" }}
                >
                  Gullar katalogi
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="transition-all duration-150 hover:underline"
                  style={{ color: "#FFFFFF" }}
                >
                  Buyurtmani kuzatish
                </Link>
              </li>
            </ul>
          </div>

          {/* Guarantee column */}
          <div>
            <div
              className="text-xs uppercase tracking-widest font-bold text-white mb-6"
            >
              Kafolat & Xizmat
            </div>
            <ul className="space-y-3 text-sm" style={{ color: "#FFFFFF" }}>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-white" />
                100% Yangi gullar kafolati
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-white" />
                2 soatda tezkor yetkazib berish
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-white" />
                Rasm va video hisobot
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-white" />
                Bepul tabriknoma karta
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 mb-6" style={{ height: "1px", background: "rgba(255,255,255,0.25)" }} />

        {/* Bottom bar */}
        <div className="flex items-center justify-center">
          <div className="text-xs text-white/90 text-center">
            © {new Date().getFullYear()} NASTARIN GULLARI. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </div>
    </footer>
  );
}
