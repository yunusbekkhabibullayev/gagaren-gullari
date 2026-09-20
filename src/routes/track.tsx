import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MobileTabBar, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatSom } from "@/lib/products";
import { trackOrder, type TrackedOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Buyurtmani kuzatish — NASTARIN GULLARI" },
      {
        name: "description",
        content: "Buyurtma raqami va telefon raqamingiz orqali buyurtmangiz holatini tekshiring.",
      },
      { property: "og:title", content: "Buyurtmani kuzatish — NASTARIN GULLARI" },
      {
        property: "og:description",
        content: "Buyurtmangiz qayerda? Holatini bir daqiqada bilib oling.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackPage,
});

const STEPS = [
  { key: "new", label: "Qabul qilindi" },
  { key: "confirmed", label: "Tasdiqlandi" },
  { key: "shipped", label: "Yo'lda" },
  { key: "delivered", label: "Yetkazildi" },
] as const;

const STATUS_LABEL: Record<string, string> = {
  new: "Qabul qilindi",
  confirmed: "Tasdiqlandi",
  shipped: "Yo'lda",
  delivered: "Yetkazildi",
  cancelled: "Bekor qilindi",
};

function TrackPage() {
  const track = useServerFn(trackOrder);
  const [notFound, setNotFound] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const lookup = useMutation({
    mutationFn: (vars: { orderNumber: string; phone: string }) => track({ data: vars }),
    onSuccess: (res) => {
      setOrder(res.order);
      setNotFound(!res.order);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const orderNumber = String(fd.get("orderNumber") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    if (orderNumber.length < 3 || phone.replace(/\D/g, "").length < 7) {
      setOrder(null);
      setNotFound(true);
      return;
    }
    setOrder(null);
    setNotFound(false);
    lookup.mutate({ orderNumber, phone });
  };

  const cancelled = order?.status === "cancelled";
  const activeIndex = order ? STEPS.findIndex((s) => s.key === order.status) : -1;

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-0">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-5 pt-10 sm:pt-16">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Kuzatish</div>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">Buyurtmangiz qayerda?</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Buyurtma raqami va rasmiylashtirishda kiritgan telefon raqamingizni yozing.
        </p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            name="orderNumber"
            placeholder="SO-XXXXXX"
            className="rounded-full border border-border bg-card px-5 py-3 text-sm outline-none transition focus:border-foreground"
          />
          <input
            name="phone"
            type="tel"
            placeholder="+998 90 000 00 00"
            className="rounded-full border border-border bg-card px-5 py-3 text-sm outline-none transition focus:border-foreground"
          />
          <button
            type="submit"
            disabled={lookup.isPending}
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
          >
            {lookup.isPending ? "Qidirilmoqda…" : "Tekshirish"}
          </button>
        </form>

        {notFound && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            Bunday buyurtma topilmadi. Raqam va telefonni tekshirib, qayta urinib ko'ring.
          </div>
        )}
        {lookup.isError && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-sm text-red-600">
            Xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.
          </div>
        )}

        {order && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="font-display text-2xl">{order.orderNumber}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("uz-UZ")}
              </div>
            </div>

            {cancelled ? (
              <div className="mt-5 rounded-2xl bg-secondary px-4 py-3 text-sm">
                Buyurtma bekor qilingan. Savollar bo'lsa biz bilan bog'laning.
              </div>
            ) : (
              <ol className="mt-6 grid gap-4 sm:grid-cols-4">
                {STEPS.map((s, i) => {
                  const done = i <= activeIndex;
                  return (
                    <li key={s.key} className="flex items-center gap-3 sm:block">
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-medium ${
                          done
                            ? "bg-[color:var(--terracotta)] text-background"
                            : "border border-border text-muted-foreground"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={`text-sm sm:mt-2 sm:block ${done ? "" : "text-muted-foreground"}`}
                      >
                        {s.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="mt-6 text-sm text-muted-foreground">
              Holat:{" "}
              <span className="font-medium text-foreground">
                {STATUS_LABEL[order.status] ?? order.status}
              </span>
              {" · "}Shahar: <span className="text-foreground">{order.city}</span>
            </div>

            <ul className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
              {order.items.map((l, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  {l.image && (
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-background">
                      <img src={l.image} alt="" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{l.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {l.color ? `${l.color} × ` : "× "}
                      {l.qty}
                    </div>
                  </div>
                  <div className="shrink-0 font-medium">{formatSom(l.price * l.qty)}</div>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Yetkazib berish</dt>
                <dd>{order.shipping === 0 ? "Bepul" : formatSom(order.shipping)}</dd>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <dt>Jami</dt>
                <dd>{formatSom(order.total)}</dd>
              </div>
            </dl>
          </div>
        )}
      </section>
      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}
