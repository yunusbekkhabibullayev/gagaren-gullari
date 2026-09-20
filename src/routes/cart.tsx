import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MobileTabBar, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCart } from "@/lib/cart";
import { formatSom } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Savat — NASTARIN GULLARI" },
      { name: "description", content: "Sizning tanlagan guldastalaringiz va sovg'alaringiz savati." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, count, setQty, remove, hydrated } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-32 sm:pb-0">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-5 pt-10 sm:pt-16">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Savat</div>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">Sizning tanlovingiz</h1>
        <p className="mt-3 text-muted-foreground">
          {hydrated ? `${count} ta buyum` : "Yuklanmoqda..."}
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-5 py-10 md:grid-cols-[1fr_360px]">
        <div>
          {hydrated && items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-14 text-center">
              <div className="font-display text-2xl">Savat bo'sh</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Katalogdan yoqqan buyumingizni tanlang.
              </p>
              <Link
                to="/catalog"
                className="mt-6 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
              >
                Katalogga o'tish
              </Link>
            </div>
          )}

          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {items.map((l) => (
              <li key={`${l.slug}-${l.color}`} className="flex gap-4 p-4 sm:p-5">
                <Link
                  to="/product/$id"
                  params={{ id: l.slug }}
                  className="block h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-background sm:h-28 sm:w-28"
                >
                  <img src={l.image} alt={l.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to="/product/$id"
                        params={{ id: l.slug }}
                        className="truncate font-medium hover:underline"
                      >
                        {l.name}
                      </Link>
                      <div className="mt-0.5 truncate text-xs text-muted-foreground">
                        {l.workshop} · {l.color}
                      </div>
                    </div>
                    <button
                      onClick={() => remove(l.slug, l.color)}
                      className="shrink-0 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      O'chirish
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                    <div className="inline-flex items-center rounded-full border border-border bg-background">
                      <button
                        onClick={() => setQty(l.slug, l.color, l.qty - 1)}
                        className="px-3 py-1.5"
                      >
                        −
                      </button>
                      <div className="w-8 text-center text-sm">{l.qty}</div>
                      <button
                        onClick={() => setQty(l.slug, l.color, l.qty + 1)}
                        className="px-3 py-1.5"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm font-semibold">{formatSom(l.price * l.qty)}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6">
          <div className="font-display text-xl">Buyurtma xulosasi</div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Buyumlar</dt>
              <dd>{count}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Yetkazish</dt>
              <dd>Checkoutda hisoblanadi</dd>
            </div>
            <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
              <dt>Jami</dt>
              <dd>{formatSom(subtotal)}</dd>
            </div>
          </dl>
          <button
            disabled={!hydrated || items.length === 0}
            onClick={() => navigate({ to: "/checkout" })}
            className="mt-6 w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Checkoutga o'tish →
          </button>
          <Link
            to="/catalog"
            className="mt-3 block text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Xarid davom ettirish
          </Link>
        </aside>
      </section>

      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}
