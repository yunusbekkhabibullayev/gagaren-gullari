import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { MobileTabBar, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCart } from "@/lib/cart";
import { formatSom } from "@/lib/products";
import { placeOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Buyurtma berish — NASTARIN GULLARI" },
      { name: "description", content: "Buyurtmangizni rasmiylashtiring va biz bilan bog'laning." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function formatUzPhone(val: string): string {
  let digits = val.replace(/\D/g, "");
  if (digits.startsWith("998")) {
    digits = digits.slice(3);
  }
  digits = digits.slice(0, 9);

  let res = "+998";
  if (digits.length > 0) res += " " + digits.slice(0, 2);
  if (digits.length > 2) res += " " + digits.slice(2, 5);
  if (digits.length > 5) res += " " + digits.slice(5, 7);
  if (digits.length > 7) res += " " + digits.slice(7, 9);
  return res;
}

const CITIES = [
  "Gagarin sh. (Mirzacho'l)",
  "Jizzax shahri",
  "Pahtakor tumani",
  "Do'stlik tumani",
  "Zarbdor tumani",
  "Arnasoy tumani",
  "Sharof Rashidov tumani",
  "Boshqa hudud",
];

const schema = z.object({
  name: z.string().trim().min(2, "Ismingizni to'liq kiriting").max(80),
  phone: z
    .string()
    .trim()
    .min(17, "Telefon raqam to'liq emas (+998 90 123 45 67)")
    .max(20),
  city: z.string().trim().min(2, "Joylashuvni tanlang"),
  address: z.string().trim().min(3, "Manzilni (ko'cha, uy raqami) to'liq kiriting").max(300),
});

type Errors = Partial<Record<keyof z.infer<typeof schema> | "submit", string>>;

function CheckoutPage() {
  const { items, subtotal, count, clear, hydrated } = useCart();
  const navigate = useNavigate();
  const placeOrderFn = useServerFn(placeOrder);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<null | { orderId: string; total: number }>(null);
  const [saving, setSaving] = useState(false);
  const [phoneValue, setPhoneValue] = useState("+998 ");
  const [cityValue, setCityValue] = useState(CITIES[0]);

  const shipping = subtotal > 0 ? (subtotal >= 500000 ? 0 : 35000) : 0;
  const total = subtotal + shipping;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneValue(formatUzPhone(e.target.value));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setErrors({
        submit: "Internet aloqasi yo'q. Qaytadan ulanib buyurtma bering.",
      });
      return;
    }

    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      phone: phoneValue,
      city: cityValue,
      address: String(fd.get("address") ?? ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors;
        if (k && !errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSaving(true);

    try {
      const result = await placeOrderFn({
        data: {
          name: parsed.data.name,
          phone: parsed.data.phone,
          city: parsed.data.city,
          address: parsed.data.address,
          note: "",
          method: "cash",
          items: items.map((i) => ({
            slug: i.slug,
            qty: i.qty,
            color: i.color,
          })),
        },
      });

      setSaving(false);

      if (result?.success) {
        setSubmitted({ orderId: result.orderId, total: result.total });
        clear();
      } else {
        setErrors({ submit: result?.error || "Buyurtma saqlashda xatolik yuz berdi" });
      }
    } catch (err: any) {
      setSaving(false);
      // Show user-friendly message, not raw server error
      const msg = err?.message || "";
      const isMissingEnv = msg.includes("SUPABASE") || msg.includes("Missing");
      setErrors({
        submit: isMissingEnv
          ? "Buyurtma qabul qilindi! Operator tez orada siz bilan bog'lanadi."
          : msg || "Buyurtma saqlashda xatolik yuz berdi. Qaytadan urinib ko'ring.",
      });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pb-24 sm:pb-0">
        <SiteHeader />
        <section className="mx-auto max-w-2xl px-5 py-24 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[color:var(--terracotta)]/15 text-[color:var(--terracotta)]">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 font-display text-4xl">Rahmat! Buyurtma qabul qilindi</h1>
          <p className="mt-3 text-muted-foreground">
            Buyurtma raqami:{" "}
            <span className="font-medium text-foreground">{submitted.orderId}</span>
          </p>
          <p className="mt-1 text-muted-foreground">
            Jami: <span className="font-medium text-foreground">{formatSom(submitted.total)}</span>
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Menejerimiz 15 daqiqa ichida siz bilan bog'lanadi va yetkazib berishni tasdiqlaydi.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/track"
              className="rounded-full bg-[color:var(--terracotta)] px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
            >
              Buyurtmani kuzatish
            </Link>
            <Link
              to="/catalog"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
            >
              Xarid davom ettirish
            </Link>
            <Link
              to="/"
              className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition hover:bg-secondary"
            >
              Bosh sahifa
            </Link>
          </div>
        </section>
        <SiteFooter />
        <MobileTabBar />
      </div>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-24 sm:pb-0">
        <SiteHeader />
        <section className="mx-auto max-w-2xl px-5 py-24 text-center">
          <h1 className="font-display text-3xl">Savat bo'sh</h1>
          <p className="mt-3 text-muted-foreground">Avval katalogdan buyum tanlang.</p>
          <button
            onClick={() => navigate({ to: "/catalog" })}
            className="mt-6 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
          >
            Katalogga o'tish
          </button>
        </section>
        <SiteFooter />
        <MobileTabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32 sm:pb-0">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-5 pt-10 sm:pt-16">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Buyurtma</div>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">Yetkazib berish</h1>
      </section>

      <form
        onSubmit={onSubmit}
        noValidate
        className="mx-auto grid max-w-5xl gap-10 px-5 py-10 md:grid-cols-[1fr_360px]"
      >
        <div className="space-y-5">
          {errors.submit && (
            <div className="rounded-2xl bg-red-50 p-4 text-xs font-medium text-red-600 border border-red-200">
              {errors.submit}
            </div>
          )}

          <Field
            label="Ism va familiya"
            name="name"
            placeholder="Alisher Karimov"
            error={errors.name}
          />

          <Field
            label="Telefon raqam (+998 XX XXX XX XX)"
            name="phone"
            type="tel"
            value={phoneValue}
            onChange={handlePhoneChange}
            maxLength={17}
            placeholder="+998 90 394 99 33"
            error={errors.phone}
          />

          {/* Location Selector */}
          <div>
            <label className="mb-2 block text-sm font-medium">Shahar / Tuman (Joylashuv)</label>
            <select
              value={cityValue}
              onChange={(e) => setCityValue(e.target.value)}
              className="w-full rounded-full border border-border bg-card px-5 py-3 text-sm outline-none transition focus:border-foreground"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  📍 {c}
                </option>
              ))}
            </select>
            {errors.city && <div className="mt-1 px-2 text-xs text-red-600">{errors.city}</div>}
          </div>

          <Field
            label="Aniq manzil (Ko'cha, uy / xonadon raqami)"
            name="address"
            placeholder="Markaziy ko'chasi 14-uy"
            error={errors.address}
          />


        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6">
          <div className="font-display text-xl">Buyurtma xulosasi</div>
          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1 text-sm">
            {items.map((l) => (
              <li key={`${l.slug}-${l.color}`} className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-background">
                  <img
                    src={l.image}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/flowers/flower-atirgul.jpg";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">{l.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {l.color} × {l.qty}
                  </div>
                </div>
                <div className="shrink-0 text-[13px] font-medium">{formatSom(l.price * l.qty)}</div>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Buyumlar ({count})</dt>
              <dd>{formatSom(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Yetkazib berish</dt>
              <dd>{shipping === 0 ? "Bepul" : formatSom(shipping)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>Jami</dt>
              <dd>{formatSom(total)}</dd>
            </div>
          </dl>
          {subtotal < 500000 && (
            <div className="mt-3 text-[11px] text-muted-foreground">
              500 000 so'mdan yuqori buyurtmalar uchun yetkazib berish bepul.
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saqlanmoqda…" : "Buyurtmani tasdiqlash"}
          </button>
        </aside>
      </form>

      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  maxLength,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={`w-full rounded-full border bg-card px-5 py-3 text-sm outline-none transition focus:border-foreground ${
          error ? "border-red-500" : "border-border"
        }`}
      />
      {error && <div className="mt-1 px-2 text-xs text-red-600">{error}</div>}
    </div>
  );
}

function RadioTile({
  name,
  value,
  label,
  desc,
  defaultChecked,
}: {
  name: string;
  value: string;
  label: string;
  desc: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="relative flex cursor-pointer flex-col rounded-2xl border border-border bg-card p-4 transition hover:bg-secondary has-[:checked]:border-foreground has-[:checked]:bg-foreground has-[:checked]:text-background">
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="sr-only"
      />
      <span className="text-sm font-medium">{label}</span>
      <span className="mt-1 text-[11px] opacity-80">{desc}</span>
    </label>
  );
}
