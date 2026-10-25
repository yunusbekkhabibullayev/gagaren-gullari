import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  Share2,
  Heart,
  MessageCircle,
  Star,
  Flame,
  Truck,
  ShieldCheck,
  Check,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { MobileTabBar, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatSom, productImage, useProduct, useProducts, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { getLiveProductStock } from "@/lib/stock";
import { toast } from "sonner";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Guldasta tafsilotlari — NASTARIN GULLARI" },
      {
        name: "description",
        content: "Do'stlik shaharida premium gul va guldastalar tafsilotlari va 24/7 tezkor yetkazib berish.",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-5 text-center bg-[#FFF9FA]">
      <div className="space-y-4">
        <div className="text-4xl">🌸</div>
        <h1 className="text-2xl font-bold text-gray-900">Guldasta topilmadi</h1>
        <Link
          to="/catalog"
          className="inline-flex rounded-full bg-[#E94B77] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#D43D68]"
        >
          Katalogga qaytish
        </Link>
      </div>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts = [] } = useProducts(1, 8);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const navigate = useNavigate();
  const [liveStock, setLiveStock] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!product) return;

    void (async () => {
      const stock = await getLiveProductStock(product);
      if (mounted) setLiveStock(stock);
    })();

    return () => {
      mounted = false;
    };
  }, [product]);

  const availableStock = liveStock ?? product?.stock ?? 10;
  const isOutOfStock = availableStock <= 0;

  const gallery = useMemo(() => {
    if (!product) return [];
    const imgs = [productImage(product)];
    if (product.image_url_2) {
      imgs.push(product.image_url_2);
    }
    return imgs;
  }, [product]);

  const related = allProducts.filter((p: Product) => p.id !== product?.id).slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9FA]">
        <SiteHeader />
        <div className="mx-auto max-w-lg px-4 py-8 animate-pulse space-y-6">
          <div className="aspect-[4/5] rounded-3xl bg-pink-100/50" />
          <div className="h-6 w-3/4 rounded-lg bg-pink-100/50" />
          <div className="h-4 w-1/2 rounded bg-pink-100/50" />
          <div className="h-28 rounded-2xl bg-pink-100/40" />
        </div>
        <MobileTabBar />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="grid min-h-screen place-items-center px-5 text-center bg-[#FFF9FA]">
        <div className="space-y-4">
          <div className="text-4xl">🌸</div>
          <h1 className="text-2xl font-bold text-gray-900">Mahsulot topilmadi</h1>
          <Link
            to="/catalog"
            className="inline-flex rounded-full bg-[#E94B77] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#D43D68]"
          >
            Katalogga qaytish
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    add(product, product.colors[0] || "Standart", qty);
    setAdded(true);
    toast.success(`"${product.name}" savatga muvaffaqiyatli qo'shildi! 🌸`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `${product.name} — Nastarin Gullari do'konida`,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Havola nusxalandi!");
    }
  };

  // Simulated original price and 20% discount
  const originalPrice = Math.round(product.price * 1.25);

  return (
    <div className="min-h-screen bg-[#FFF9FA] text-[#1F2937] pb-32 sm:pb-16 font-sans">
      <SiteHeader />

      <main className="mx-auto max-w-xl px-4 sm:px-6 pt-4 space-y-5">
        {/* ── Top Navigation Bar (Screen 3 Header) ── */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            aria-label="Orqaga"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-pink-100 shadow-sm text-gray-700 hover:bg-pink-50 active:scale-95 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              aria-label="Ulashish"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-pink-100 shadow-sm text-gray-700 hover:bg-pink-50 active:scale-95 transition"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsLiked(!isLiked);
                toast.success(isLiked ? "Sevimlilardan o'chirildi" : "Sevimlilarga qo'shildi! ❤️");
              }}
              aria-label="Sevimlilar"
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-white border border-pink-100 shadow-sm transition active:scale-95 ${
                isLiked ? "text-[#E94B77]" : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-[#E94B77]" : ""}`} />
            </button>
          </div>
        </div>

        {/* ── Photo Gallery Container (Screen 3 style) ── */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] bg-white border border-pink-100 shadow-md">
          <img
            src={gallery[activeImg] || productImage(product)}
            alt={product.name}
            className="h-full w-full object-cover transition-all duration-500"
            onError={(e) => {
              e.currentTarget.src = "/flowers/flower-atirgul.jpg";
            }}
          />

          {/* Page Counter Pill (e.g. 2/5 like Screen 3) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-white shadow-sm">
            {activeImg + 1} / {Math.max(gallery.length, 1)}
          </div>
        </div>

        {/* ── Florist / Brand Card (Screen 3 Florist Tag) ── */}
        <div className="flex items-center justify-between rounded-2xl bg-white p-3.5 border border-pink-100 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#E94B77] to-[#F8759C] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              N
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-none">
                Nastarin Florist
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Do'stlik shahri, Markaziy 14</p>
            </div>
          </div>

          <a
            href="https://t.me/nastarin_gullari_dostlik"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3.5 py-1.5 text-xs font-bold text-[#E94B77] border border-pink-100 hover:bg-[#E94B77] hover:text-white transition active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat</span>
          </a>
        </div>

        {/* ── Rating & Title (Screen 3 Title & Badges) ── */}
        <div className="space-y-2">
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
              <span>4.9</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 font-medium">(232 reviews / baholar)</span>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
            {product.name}
          </h1>

          {/* Badges (🔥 385 | Limited Time | Free Shipping) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-amber-800 border border-amber-200">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>385 xarid</span>
            </span>
            <span className="inline-flex items-center rounded-full bg-pink-50 px-2.5 py-1 text-[#E94B77] border border-pink-100">
              Cheklangan partiya
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 border border-emerald-200">
              <Truck className="w-3.5 h-3.5" />
              <span>Bepul yetkazish</span>
            </span>
          </div>

          {/* Pricing with Discount Tag */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-2xl font-extrabold text-[#E94B77]">
              {formatSom(product.price)}
            </span>
            <span className="text-sm text-gray-400 line-through">
              {formatSom(originalPrice)}
            </span>
            <span className="rounded-full bg-[#E94B77]/10 px-2 py-0.5 text-xs font-bold text-[#E94B77]">
              -20% Chegirma
            </span>
          </div>
        </div>

        {/* ── Product Details Soft Cream Card (Screen 3 style) ── */}
        <div className="rounded-2xl bg-[#FFFBF2] p-4 sm:p-5 border border-[#F5EAD4] space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-800">
            Product Details / Mahsulot tafsilotlari
          </h3>
          <ul className="space-y-2 text-xs text-gray-700 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-[#E94B77]">•</span>
              <span><strong>Gul turi:</strong> {product.category || "Tabiiy yangi atirgullar"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E94B77]">•</span>
              <span><strong>Terish uslubi:</strong> {product.pattern || "Mualliflik qo'l mehnati (Hand-tied Bouquet)"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E94B77]">•</span>
              <span><strong>Qadoqlanishi:</strong> Premium dizaynerlik ipak qog'ozi va lenta</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E94B77]">•</span>
              <span><strong>Yangilik kafolati:</strong> 5–7 kun davomida yangi va xushbo'y saqlanadi</span>
            </li>
          </ul>
        </div>

        {/* Description paragraph */}
        <p className="text-xs text-gray-600 leading-relaxed font-normal">
          {product.story ||
            "Har bir guldasta floristlarimiz tomonidan alohida mehr bilan yig'iladi. Bayramlar, tug'ilgan kunlar yoki sevimli insoningizga kutilmagan sovg'a uchun eng go'zal tanlov."}
        </p>

        {/* ── Related Items ── */}
        <div className="pt-6 space-y-3">
          <h3 className="text-sm font-bold text-gray-900">O'xshash guldastalar</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.slug }}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white p-2.5 border border-pink-100 shadow-sm"
              >
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-pink-50">
                  <img
                    src={productImage(p)}
                    alt={p.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="mt-2 text-xs font-bold text-gray-900 line-clamp-1">{p.name}</div>
                <div className="text-xs font-extrabold text-[#E94B77] mt-0.5">{formatSom(p.price)}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* ── STICKY BOTTOM ACTION BAR (Matching Screen 3 Bottom Bar) ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-100 py-3 px-4 shadow-[0_-8px_25px_rgba(0,0,0,0.06)]">
        <div className="mx-auto max-w-xl flex items-center gap-3">
          {/* Stepper Counter Pill (−  1  +) */}
          <div className="flex items-center rounded-full border border-pink-200 bg-[#FFF9FA] px-2 py-1 shadow-inner">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-full text-base font-bold text-gray-700 hover:bg-pink-100 transition active:scale-95 disabled:opacity-30"
              aria-label="Kamaytirish"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-extrabold text-gray-900">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-base font-bold text-gray-700 hover:bg-pink-100 transition active:scale-95"
              aria-label="Ko'paytirish"
            >
              +
            </button>
          </div>

          {/* Wide Rounded-Full Pink Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 flex items-center justify-center gap-2 rounded-full py-3.5 px-6 text-sm sm:text-base font-extrabold text-white shadow-xl transition-all active:scale-95 cursor-pointer ${
              added
                ? "bg-emerald-600 shadow-emerald-600/30"
                : "bg-[#E94B77] hover:bg-[#D43D68] shadow-[#E94B77]/35"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" />
                <span>Qo'shildi!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart / Savatga qo'shish</span>
              </>
            )}
          </button>
        </div>
      </div>

      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}
