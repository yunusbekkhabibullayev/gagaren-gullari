import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MobileTabBar, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatSom, productImage, useProduct, useProducts, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Guldasta tafsilotlari — NASTARIN GULLARI" },
      { name: "description", content: "Gagarin shaharida gul va guldasta tafsilotlari hamda yetkazib berish buyurtmasi." },
    ],
  }),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <div className="font-display text-4xl">Buyum topilmadi</div>
        <Link to="/catalog" className="mt-6 inline-block underline">
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
  const { data: allProducts = [] } = useProducts();
  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState<string>("");
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product && !color) setColor(product.colors[0] ?? "");
  }, [product, color]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const imgs = [productImage(product)];
    if (product.image_url_2) {
      imgs.push(product.image_url_2);
    } else {
      imgs.push(productImage(product));
    }
    return imgs;
  }, [product]);
  const related = allProducts.filter((p: Product) => p.id !== product?.id).slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-7xl px-5 py-24 text-center text-muted-foreground">
          Yuklanmoqda…
        </div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="grid min-h-screen place-items-center px-5 text-center">
        <div>
          <div className="font-display text-4xl">Buyum topilmadi</div>
          <Link to="/catalog" className="mt-6 inline-block underline">
            Katalogga qaytish
          </Link>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    add(product, color, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };
  const handleBuyNow = () => {
    add(product, color, qty);
    navigate({ to: "/checkout" });
  };

  return (
    <div className="min-h-screen bg-background pb-32 sm:pb-0">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-5 pt-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Bosh
        </Link>
        <span className="mx-2">/</span>
        <Link to="/catalog" className="hover:text-foreground">
          Katalog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-8 md:grid-cols-2 md:py-14">
        {/* GALLERY with drag-to-rotate pseudo-3D */}
        <Gallery images={gallery} active={activeImg} setActive={setActiveImg} name={product.name} />

        {/* INFO */}
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            {product.workshop} · {product.category}
          </div>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">{product.name}</h1>
          <div className="mt-3 text-lg text-muted-foreground">{product.pattern}</div>

          <div className="mt-6 font-display text-3xl">{formatSom(product.price)}</div>

          <p className="mt-6 leading-relaxed text-muted-foreground">{product.story}</p>

          <div className="mt-8 space-y-5">
            <div>
              <div className="text-sm font-medium">Rang</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((c: string) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      color === c
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card hover:bg-secondary"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">Miqdor</div>
              <div className="inline-flex items-center rounded-full border border-border bg-card">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1.5">
                  −
                </button>
                <div className="w-10 text-center text-sm">{qty}</div>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-1.5">
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleAdd}
              className="flex-1 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition hover:opacity-90 sm:flex-none"
            >
              {added ? "Savatga qo'shildi ✓" : "Savatga qo'shish"}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 rounded-full border border-foreground px-6 py-3.5 text-sm font-medium transition hover:bg-secondary sm:flex-none"
            >
              Hoziroq sotib olish
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm">
            <Spec k="O'lcham" v={product.size || "Standart"} />
            <Spec k="Og'irlik" v={product.weight || "1.0 kg"} />
            <Spec k="Ustaxona" v={product.workshop || "Gollandiya"} />
            <Spec k="Tayyorlanish" v={product.preparation || "15–30 daqiqa (tayyor)"} />
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="font-display text-2xl sm:text-3xl">O'xshash buyumlar</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p: Product) => (
            <Link key={p.id} to="/product/$id" params={{ id: p.slug }} className="group block">
              <div className="aspect-square overflow-hidden rounded-2xl bg-card">
                <img
                  src={productImage(p)}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="truncate text-sm">{p.name}</div>
                <div className="shrink-0 text-sm font-semibold">{formatSom(p.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-muted-foreground">{k}</div>
      <div className="mt-0.5 font-medium">{v}</div>
    </div>
  );
}

function Gallery({
  images,
  active,
  setActive,
  name,
}: {
  images: string[];
  active: number;
  setActive: (n: number) => void;
  name: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startIdx = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onDown = (x: number) => {
      dragging.current = true;
      startX.current = x;
      startIdx.current = active;
    };
    const onMove = (x: number) => {
      if (!dragging.current) return;
      const dx = x - startX.current;
      const step = Math.round(dx / 40);
      const next = (((startIdx.current - step) % images.length) + images.length) % images.length;
      setActive(next);
    };
    const onUp = () => (dragging.current = false);

    const md = (e: MouseEvent) => onDown(e.clientX);
    const mm = (e: MouseEvent) => onMove(e.clientX);
    const td = (e: TouchEvent) => onDown(e.touches[0].clientX);
    const tm = (e: TouchEvent) => onMove(e.touches[0].clientX);

    el.addEventListener("mousedown", md);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", onUp);
    el.addEventListener("touchstart", td, { passive: true });
    el.addEventListener("touchmove", tm, { passive: true });
    el.addEventListener("touchend", onUp);
    return () => {
      el.removeEventListener("mousedown", md);
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("touchstart", td);
      el.removeEventListener("touchmove", tm);
      el.removeEventListener("touchend", onUp);
    };
  }, [active, images.length, setActive]);

  return (
    <div>
      <div
        ref={ref}
        className="relative aspect-square cursor-grab overflow-hidden rounded-[2rem] bg-card select-none active:cursor-grabbing"
      >
        <img
          src={images[active]}
          alt={name}
          className="pointer-events-none h-full w-full object-cover transition-opacity duration-300"
          draggable={false}
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/85 px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
          Barmoq bilan aylantiring
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`aspect-square overflow-hidden rounded-xl border transition ${
              i === active ? "border-foreground" : "border-border"
            }`}
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
