import { Link } from "@tanstack/react-router";
import { Check, Flower2 } from "lucide-react";
import heroBouquetImg from "@/assets/hero-bouquet.png";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden w-full min-h-[600px] md:min-h-[650px] lg:min-h-[700px] flex items-center justify-center hero-bg-anim"
      style={{
        background: "linear-gradient(135deg, rgba(139, 58, 92, 0.95) 0%, rgba(255, 255, 255, 0.2) 100%)",
        zIndex: 1,
      }}
    >
      {/* Texture / Soft blurred floral background overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${heroBouquetImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.07,
          filter: "blur(8px)",
        }}
        aria-hidden="true"
      />

      {/* Decorative Subtle SVG Flower Pattern Overlay (5-8% opacity) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(#8B3A5C 1px, transparent 1px), radial-gradient(#F4D35E 1px, #ffffff 1px)`,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-12 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 min-h-[600px] lg:min-h-[660px]">
          
          {/* ── TYPOGRAPHY SECTION (LEFT SIDE - 55%) ── */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center items-start text-left z-10">
            {/* Top pill badge */}
            <div className="hero-headline-anim inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs uppercase tracking-widest bg-white/60 backdrop-blur-sm border border-[#8B3A5C]/20 text-[#8B3A5C] mb-4">
              <span className="h-2 w-2 rounded-full bg-[#8B3A5C] animate-pulse" />
              Gagarin shaharida premium gul yetkazish
            </div>

            {/* Main Headline */}
            <h1
              className="hero-headline-anim text-[36px] sm:text-[48px] lg:text-[64px] font-bold text-[#1A1A1A] leading-[1.2] tracking-[-1px] m-0"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Gullar bilan
              <br />
              <span className="text-[#8B3A5C] italic font-normal">aytilgan so'z</span>
            </h1>

            {/* Subheadline */}
            <p
              className="hero-subheadline-anim text-[14px] sm:text-[16px] text-[#666666] leading-[1.6] max-w-[450px] mt-6 mb-0"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Har kuni ertalab yangi kelgan gullardan yig'ilgan buketlar. Yetkazish kunini va vaqtini o'zingiz tanlaysiz.
            </p>

            {/* CTA Button Group */}
            <div className="hero-buttons-anim mt-[40px] flex flex-wrap sm:flex-nowrap items-center gap-4 w-full sm:w-auto">
              <Link to="/catalog" className="btn-primary-luxe w-full sm:w-auto">
                Buketlarni ko'rish →
              </Link>
              <a href="#hunar" className="btn-secondary-luxe w-full sm:w-auto">
                Yetkazib berish
              </a>
            </div>

            {/* Stat counters badge below CTAs */}
            <div className="hero-buttons-anim mt-10 pt-6 border-t border-[#8B3A5C]/15 flex items-center gap-8 text-xs text-[#666666]">
              <div>
                <span className="block text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Poppins', sans-serif" }}>15 min</span>
                <span>Tezkor elatish</span>
              </div>
              <div className="w-[1px] h-8 bg-[#8B3A5C]/15" />
              <div>
                <span className="block text-xl font-bold text-[#8B3A5C]" style={{ fontFamily: "'Poppins', sans-serif" }}>100%</span>
                <span>Yangi tabiat gullari</span>
              </div>
              <div className="w-[1px] h-8 bg-[#8B3A5C]/15" />
              <div>
                <span className="block text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Poppins', sans-serif" }}>24/7</span>
                <span>Yetkazib berish</span>
              </div>
            </div>
          </div>

          {/* ── VISUAL SECTION (RIGHT SIDE - 45%) ── */}
          <div className="w-full lg:w-[45%] flex items-center justify-center lg:justify-end relative py-4 lg:py-0 z-20">
            {/* Background Decorative Accent Elements */}
            
            {/* Top-left corner accent circle: #F4D35E, 60px diameter, 20% opacity */}
            <div
              className="absolute -top-4 -left-4 sm:left-4 md:left-12 lg:-left-6 w-[60px] h-[60px] rounded-full accent-rotate-anim pointer-events-none"
              style={{
                backgroundColor: "#F4D35E",
                opacity: 0.2,
                zIndex: 5,
              }}
              aria-hidden="true"
            />

            {/* Bottom-right corner accent circle: #8B3A5C, 80px diameter, 15% opacity */}
            <div
              className="absolute -bottom-6 right-2 sm:right-10 lg:-right-4 w-[80px] h-[80px] rounded-full accent-rotate-anim pointer-events-none"
              style={{
                backgroundColor: "#8B3A5C",
                opacity: 0.15,
                zIndex: 5,
              }}
              aria-hidden="true"
            />

            {/* Decorative flower icon top-right: 40px, #8B3A5C color, opacity 30% */}
            <div
              className="absolute top-2 right-4 lg:right-2 text-[#8B3A5C] opacity-30 pointer-events-none z-10"
              aria-hidden="true"
            >
              <Flower2 size={40} />
            </div>

            {/* Hero Image Card */}
            <div className="hero-card-anim relative w-full sm:w-[320px] lg:w-[380px] h-[350px] sm:h-[420px] lg:h-[480px] z-20">
              <div className="hero-image-wrapper w-full h-full bg-white rounded-[16px] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.12)] relative overflow-hidden">
                <img
                  src={heroBouquetImg}
                  alt="NASTARIN GULLARI Premium Buket"
                  className="w-full h-full object-cover rounded-[12px]"
                  loading="eager"
                  decoding="async"
                />

                {/* Subtle shine overlay effect */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-[16px] bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                  aria-hidden="true"
                />

                {/* Floating Badge Overlay */}
                <div
                  className="absolute bottom-[20px] left-[20px] bg-white/90 backdrop-blur-[10px] px-5 py-3 rounded-[20px] flex items-center gap-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-white/50 z-30"
                >
                  <div className="w-5 h-5 rounded-full bg-[#8B3A5C]/10 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#8B3A5C]" strokeWidth={3} />
                  </div>
                  <span
                    className="text-[12px] font-semibold text-[#1A1A1A] whitespace-nowrap"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    100% Yangi Gullar
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
