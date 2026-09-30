"use client";
import { FormEvent, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, CalendarClock, Printer, RotateCcw, ShieldCheck } from "lucide-react";
import { Answers, Result, diagnose, formatDate, status } from "../lib/diagnostic";

const CHECKOUT = process.env.NEXT_PUBLIC_CHECKOUT_URL;

type FieldDef = { name: keyof Answers; label: string; options: [string, string][] };
const FIELDS: FieldDef[] = [
  { name: "size", label: "Taille de l'entreprise", options: [["micro", "Micro-entreprise / indépendant"], ["pme", "TPE / PME (moins de 250 salariés)"], ["eti", "ETI (250 à 4 999 salariés)"], ["large", "Grande entreprise"]] },
  { name: "vat", label: "Situation TVA", options: [["vat", "Assujetti à la TVA"], ["franchise", "Franchise en base de TVA"], ["exempt", "Activité exonérée / non assujetti"]] },
  { name: "clients", label: "Type de clients", options: [["b2b", "Entreprises en France (B2B)"], ["b2c", "Particuliers (B2C)"], ["mixed", "Les deux ou clients étrangers"]] },
  { name: "tool", label: "Outil de facturation actuel", options: [["approved", "Logiciel compatible plateforme agréée"], ["unsure", "Logiciel, compatibilité inconnue"], ["accountant", "Mon expert-comptable s'en occupe"], ["manual", "Excel, Word ou papier"]] },
  { name: "platform", label: "Plateforme agréée déjà choisie ?", options: [["yes", "Oui"], ["no", "Non, pas encore"]] },
];

export default function Diagnostic() {
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    for (const fd of FIELDS) values[fd.name] = String(f.get(fd.name) ?? "");
    if (FIELDS.some((fd) => !values[fd.name])) {
      setError("Veuillez répondre à toutes les questions.");
      return;
    }
    setError("");
    setResult(diagnose(values as unknown as Answers));
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  function reset() {
    setResult(null);
    document.getElementById("diagnostic")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <section id="diagnostic" className="section noprint">
        <div className="container">
          <div className="sectionHead">
            <div className="eyebrow">Diagnostic gratuit</div>
            <h2>En 2 minutes, obtenez votre plan d'action.</h2>
            <p className="muted">Vos réponses restent dans votre navigateur : rien n'est envoyé ni enregistré.</p>
          </div>
          <form className="formCard" onSubmit={submit} noValidate>
            {error && <div className="error" role="alert">{error}</div>}
            <div className="formGrid">
              {FIELDS.map((fd) => (
                <div className="field" key={fd.name}>
                  <label htmlFor={fd.name}>{fd.label}</label>
                  <select id={fd.name} name={fd.name} defaultValue="">
                    <option value="" disabled>Choisir…</option>
                    {fd.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="formFooter">
              <button className="btn primary" type="submit">Voir mon diagnostic <ArrowRight size={17} /></button>
            </div>
          </form>
        </div>
      </section>

      {result && (
        <section id="result" className="section resultSection" ref={resultRef} aria-live="polite">
          <div className="container">
            <div className="result">
              <div className="resultCard">
                {result.outOfScope ? (
                  <span className="badge warn"><AlertTriangle size={15} /> À confirmer</span>
                ) : (
                  <span className={`badge ${result.level}`}><ShieldCheck size={15} /> {result.level === "ready" ? "Bien avancé" : result.level === "progress" ? "En progression" : "À démarrer"}</span>
                )}
                {!result.outOfScope && (
                  <>
                    <div className="bigScore">{result.score}<span className="of">/100</span></div>
                    <div className="progress" role="progressbar" aria-valuenow={result.score} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${result.score}%` }} /></div>
                    <ul className="breakdown">
                      {result.breakdown.map((b) => <li key={b.label}><span>{b.label}</span><strong>{b.points}/{b.max}</strong></li>)}
                    </ul>
                    <p className="muted small">Indicateur pédagogique : il ne constitue pas une certification de conformité.</p>
                  </>
                )}
                {result.deadlines.map((d) => {
                  const s = status(d.date);
                  return (
                    <div className="deadline" key={d.label}>
                      <strong><CalendarClock size={15} /> {formatDate(d.date)} <em className={s.inForce ? "tag now" : "tag soon"}>{s.label}</em></strong>
                      <span><b>{d.label}.</b> {d.text}</span>
                    </div>
                  );
                })}
              </div>

              <div className="resultCard">
                <h2 style={{ marginTop: 0 }}>{result.title}</h2>
                <p className="muted">Vos prochaines actions, par ordre de priorité.</p>
                {result.actions.map((x, i) => (
                  <div className="task" key={x.title}>
                    <div className="taskNum">{i + 1}</div>
                    <div>
                      <strong>{x.title}</strong>{" "}
                      <span className={`prio ${x.priority}`}>{x.priority === "high" ? "Prioritaire" : x.priority === "medium" ? "Important" : "À prévoir"}</span>
                      <div className="muted">{x.body}</div>
                    </div>
                  </div>
                ))}
                <div className="actions noprint">
                  <button className="btn secondary" onClick={() => window.print()}><Printer size={16} /> Imprimer / enregistrer en PDF</button>
                  <button className="btn secondary" onClick={reset}><RotateCcw size={16} /> Refaire le test</button>
                </div>
                {!result.outOfScope && (
                  <div className="priceBox noprint">
                    <div className="eyebrow">Rapport premium</div>
                    <h3 style={{ margin: "4px 0" }}>Checklist détaillée et personnalisée</h3>
                    <p className="muted">Plan pas à pas, modèles de courriers fournisseurs/clients, liens officiels.</p>
                    <div className="price">19 €</div>
                    {CHECKOUT ? (
                      <a className="btn primary" href={CHECKOUT} target="_blank" rel="noreferrer">Obtenir mon rapport <ArrowRight size={17} /></a>
                    ) : (
                      <button className="btn primary" disabled>Bientôt disponible</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
