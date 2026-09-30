import { diagnose, valid } from "../../lib/diagnostic";
import PrintButton from "../../components/PrintButton";

export default async function Merci({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams; const key = process.env.STRIPE_SECRET_KEY;
  let paid = false, meta: Record<string, string> = {};
  if (session_id && key && /^cs_[A-Za-z0-9_]+$/.test(session_id)) {
    const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${session_id}`, { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" });
    if (r.ok) { const j = await r.json(); paid = j.payment_status === "paid"; meta = j.metadata ?? {}; }
  }
  if (!paid || !valid(meta)) return <div className="c"><div className="card"><h2>Paiement non vérifié</h2><p className="muted">Si vous avez payé, contactez-nous avec votre reçu Stripe.</p></div></div>;
  const r = diagnose(meta);
  return (<div className="c"><div className="nav">Facture<b>Ready</b></div><div className="card">
    <div className="eyebrow">Rapport personnalisé</div><h1 style={{ fontSize: 34 }}>{r.title}</h1>
    <p><strong>Score de préparation : {r.score}/100</strong> — <span className="muted">{r.summary}</span></p>
    <h3>Échéances</h3>{r.deadlines.map(d => <div className="dl" key={d.date}><strong>{d.date}</strong>{d.passed ? " (dépassée)" : ""}<div className="muted">{d.text}</div></div>)}
    <h3>Vos actions</h3>{r.actions.map((a, i) => <div className="task" key={a.title}><div className="n">{i + 1}</div><div><strong>{a.title}</strong><div className="muted">{a.body}</div></div></div>)}
    <h3>Sources officielles</h3><p className="muted">impots.gouv.fr · economie.gouv.fr · service-public.fr</p>
    <PrintButton /></div></div>);
}
