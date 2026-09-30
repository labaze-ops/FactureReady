"use client";
import { FormEvent, useState } from "react";
import { diagnose, valid, Result, Answers } from "../lib/diagnostic";

export default function Diagnostic() {
  const [res, setRes] = useState<Result | null>(null);
  const [ans, setAns] = useState<Answers | null>(null);
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr("");
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Partial<Answers>;
    if (!valid(f)) return setErr("Veuillez compléter tous les champs.");
    setAns(f); setRes(diagnose(f));
    setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }), 50);
  }
  async function buy() {
    if (!ans) return; setBusy(true); setErr("");
    try {
      const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(ans) });
      const j = await r.json(); if (!r.ok || !j.url) throw new Error(j.error || "Paiement indisponible");
      window.location.href = j.url;
    } catch (x) { setErr((x as Error).message); setBusy(false); }
  }
  const Sel = ({ id, label, opts }: { id: string; label: string; opts: [string, string][] }) => (
    <div className="field"><label htmlFor={id}>{label}</label>
      <select id={id} name={id} defaultValue=""><option value="" disabled>Choisir…</option>{opts.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></div>);

  return (<>
    <form id="diagnostic" className="card" onSubmit={submit}>
      <div className="eyebrow">Diagnostic gratuit · 2 minutes</div><h2>Quelle est votre situation ?</h2>
      {err && !res && <div className="err" role="alert">{err}</div>}
      <div className="grid">
        <Sel id="size" label="Taille de l'entreprise" opts={[["micro", "Micro-entreprise / TPE (< 50 salariés)"], ["pme", "PME"], ["eti", "ETI"], ["large", "Grande entreprise"]]} />
        <Sel id="vat" label="Assujetti à la TVA ?" opts={[["yes", "Oui"], ["no", "Non / franchise en base"]]} />
        <Sel id="b2b" label="Clients professionnels en France ?" opts={[["yes", "Oui"], ["no", "Non"]]} />
        <Sel id="software" label="Logiciel de facturation ?" opts={[["yes", "Oui"], ["no", "Non"]]} />
      </div>
      <p><button className="btn" type="submit">Voir mon diagnostic</button></p>
    </form>
    {res && <section id="result" className="card" aria-live="polite">
      <div className="eyebrow">Résultat</div><div className="score">{res.score}<small className="muted" style={{ fontSize: 18 }}>/100</small></div>
      <div className="bar"><i style={{ width: `${res.score}%` }} /></div><p className="muted">{res.summary}</p>
      <h3>Échéances</h3>{res.deadlines.map(d => <div className="dl" key={d.date}><strong>{d.date}</strong> <span className={d.passed ? "tag" : "tag ok"}>{d.passed ? "ÉCHÉANCE DÉPASSÉE" : "À VENIR"}</span><div className="muted">{d.text}</div></div>)}
      <h3>Aperçu du plan d'action</h3>{res.actions.slice(0, 2).map((a, i) => <div className="task" key={a.title}><div className="n">{i + 1}</div><div><strong>{a.title}</strong><div className="muted">{a.body}</div></div></div>)}
      <div className="card" style={{ background: "#f0f6ff" }}>
        <div className="eyebrow">Rapport complet</div><h3>Checklist imprimable / PDF personnalisée</h3>
        <p className="muted">Toutes les actions, échéances et sources officielles.</p><div className="price">19 €</div>
        {err && <div className="err" role="alert">{err}</div>}
        <button className="btn" onClick={buy} disabled={busy}>{busy ? "Redirection…" : "Obtenir mon rapport"}</button>
      </div>
    </section>}
  </>);
}
