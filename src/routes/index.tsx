import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileTabBar, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatSom, productImage, useProducts, type Product } from "@/lib/products";
import { useCategories } from "@/lib/categories";
import heroImg from "@/assets/flower-hero.jpg";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gagaren Gullari — Mirzacho'l tumani gul yetkazib berish" },
      {
        name: "description",
        content:
          "Yangi buketlar, atirgullar, tuvakdagi o'simliklar va sovg'a to'plamlari. Mirzacho'l tumani bo'ylab 2 soatda yetkazamiz.",
      },
      { property: "og:title", content: "Gagaren Gullari — Mirzacho'l tumani gul yetkazib berish" },
      {
        property: "og:description",
        content: "Har kuni yangi kelgan gullardan yig'ilgan buketlar. 2 soat ichida yetkazib berish.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const featured = products.slice(0, 4);

  const categoryImages: Record<string, string> = {};
  for (const c of categories) {
    const p = products.find((x: Product) => x.category === c.name);
    if (p) categoryImages[c.name] = productImage(p);
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-10 pb-16 sm:pt-20 sm:pb-28 md:grid-cols-2">
          <div className="relative z-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--terracotta)]" />
              Mirzacho'l tumani
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
              Gullar bilan
              <br />
              <span className="italic text-[color:var(--terracotta)]">aytilgan so'z</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Har kuni ertalab yangi kelgan gullardan yig'ilgan buketlar. Yetkazish kunini va
              vaqtini o'zingiz tanlaysiz.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
              >
                Buketlarni ko'rish →
              </Link>
              <a
                href="#hunar"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition hover:bg-secondary"
              >
                Yetkazib berish
              </a>
            </div>

            <div className="mt-12 grid max-w-md grid-cols-3 gap-6 text-sm">
              <Stat label="Yetkazish" value="15 daqiqa" />
              <Stat label="Florist" value="8" />
              <Stat label="Buket" value={products.length > 0 ? `${products.length}+` : "..."}  />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-full bg-[color:var(--saffron)]/25 blur-3xl" />
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-card shadow-2xl">
              <img
                src={heroImg}
                alt="Pushti va krem atirgullardan yig'ilgan buket"
                width={1408}
                height={1408}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card px-5 py-4 shadow-xl sm:block">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Bugun</div>
              <div className="mt-1 font-display text-xl">Yangi kelgan gullar</div>
            </div>
          </div>
        </div>
        <div className="petal-divider" aria-hidden />
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Kolleksiya</div>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Kategoriyalar</h2>
          </div>
          <Link to="/catalog" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Barchasi →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/catalog"
              search={{ cat: c.name } as never}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-card"
            >
              <img
                src={categoryImages[c.name] || heroImg}
                alt={c.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <div className="font-display text-lg">{c.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Mashhur</div>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Floristlar tanlagan</h2>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p: Product) => (
            <Link key={p.id} to="/product/$id" params={{ id: p.slug }} className="group block">
              <div className="aspect-square overflow-hidden rounded-2xl bg-card">
                <img
                  src={productImage(p)}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{p.name}</div>
                  <div className="truncate text-sm text-muted-foreground">{p.pattern}</div>
                </div>
                <div className="shrink-0 text-sm font-semibold">{formatSom(p.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>



      {/* DELIVERY / STUDIO */}
      <section id="hunar" className="mx-auto mt-10 max-w-7xl px-5">
        <div className="grid overflow-hidden rounded-[2rem] bg-card md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-auto flex items-center justify-center p-8">
            <img
              src={logoImg}
              alt="Gagaren Gullari logo"
              className="h-56 w-56 object-contain"
            />
          </div>
          <div className="p-8 sm:p-14">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Qanday ishlaymiz</div>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Ertalab kesilgan gul — kechqurun sizda
            </h2>
            <p className="mt-5 text-muted-foreground">
              Gullar har kuni ertalab yangi partiyada keladi. Florist buketni buyurtmangizdan keyin
              yig'adi, suv va o'ram bilan salqin holatda yetkazamiz. Yetkazish kuni va vaqt oralig'ini
              buyurtma berayotganda o'zingiz belgilaysiz.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-sm">
              <Step n="01" t="Tanlang" d="Katalogdan buket" />
              <Step n="02" t="Vaqt" d="Kun va soat oralig'i" />
              <Step n="03" t="Yetkazish" d="Kuryer qo'lma-qo'l" />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <h2 className="font-display text-3xl sm:text-4xl">Mijozlar fikri</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-card p-6">
              <blockquote className="text-[15px] leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-5 text-sm text-muted-foreground">
                — {t.name}, {t.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-3xl">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function Step({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div>
      <div className="font-display text-xl text-[color:var(--terracotta)]">{n}</div>
      <div className="mt-2 font-medium">{t}</div>
      <div className="text-muted-foreground">{d}</div>
    </div>
  );
}

const TESTIMONIALS = [
  {
    name: "Malika",
    city: "Mirzacho'l",
    quote:
      "Buket aynan so'ragan vaqtimda yetib keldi, gullar juda yangi edi. Opamga sovg'a qildim — xursand bo'ldi.",
  },
  {
    name: "Jasur",
    city: "Mirzacho'l",
    quote:
      "25 ta qizil atirgul buyurtma qildim, rasmdagidan ham chiroyli chiqdi. Kuryer aniq soatda keldi.",
  },
  {
    name: "Nodira",
    city: "Mirzacho'l",
    quote: "Tuvakdagi o'simlikni ofisga oldim. O'ramigacha ozoda va chiroyli qilib berishdi.",
  },
];
