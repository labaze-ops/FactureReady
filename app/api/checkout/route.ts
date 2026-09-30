import { NextResponse } from "next/server";
import { valid } from "../../../lib/diagnostic";

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY, site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!key || !site) return NextResponse.json({ error: "Paiement non configuré." }, { status: 503 });
  const a = await req.json().catch(() => ({}));
  if (!valid(a)) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  const p = new URLSearchParams({
    mode: "payment", "payment_method_types[0]": "card", "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "eur", "line_items[0][price_data][unit_amount]": "1900",
    "line_items[0][price_data][product_data][name]": "FactureReady — Rapport personnalisé",
    success_url: `${site}/merci?session_id={CHECKOUT_SESSION_ID}`, cancel_url: site,
    "metadata[size]": a.size, "metadata[vat]": a.vat, "metadata[b2b]": a.b2b, "metadata[software]": a.software,
  });
  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" }, body: p });
  const j = await r.json();
  if (!r.ok) return NextResponse.json({ error: "Erreur Stripe." }, { status: 502 });
  return NextResponse.json({ url: j.url });
}
