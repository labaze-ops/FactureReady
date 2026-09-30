import { ArrowRight, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import Diagnostic from "../components/Diagnostic";

export default function Home() {
  return (
    <>
      <header className="noprint"><div className="container nav"><div className="logo">Facture<span>Ready</span></div><a className="navlink" href="#diagnostic">Faire le diagnostic</a></div></header>
      <main>
        <section className="hero noprint"><div className="container heroGrid">
          <div>
            <div className="eyebrow">Facturation électronique · France · 2026–2027</div>
            <h1>Sachez quoi préparer pour la facturation électronique.</h1>
            <p className="lead">La réception des factures électroniques est obligatoire depuis le 1er septembre 2026. Faites le point en 2 minutes et obtenez un plan d'action clair.</p>
            <div className="actions"><a className="btn primary" href="#diagnostic">Démarrer gratuitement <ArrowRight size={17} /></a><a className="btn secondary" href="#how">Comment ça marche</a></div>
            <p className="micro">Outil d'information et de préparation, pas une certification de conformité.</p>
          </div>
          <div className="heroCard">
            <div className="eyebrow">Les échéances</div>
            <div className="check"><CheckCircle2 /><div><strong>1er sept. 2026 · Réception</strong><div className="muted">Toutes les entreprises assujetties à la TVA</div></div></div>
            <div className="check"><Clock3 /><div><strong>1er sept. 2026 · Émission</strong><div className="muted">Grandes entreprises et ETI</div></div></div>
            <div className="check"><ShieldCheck /><div><strong>1er sept. 2027 · Émission</strong><div className="muted">PME, TPE, micro-entreprises</div></div></div>
          </div>
        </div></section>

        <section id="how" className="section noprint"><div className="container">
          <div className="sectionHead"><div className="eyebrow">Simple par conception</div><h2>Trois étapes, aucune inscription.</h2><p className="muted">Transformer une réforme complexe en quelques décisions concrètes.</p></div>
          <div className="stats">
            <div className="stat"><strong>1. Situation</strong><span>5 questions sur votre entreprise</span></div>
            <div className="stat"><strong>2. Échéances</strong><span>les dates qui vous concernent</span></div>
            <div className="stat"><strong>3. Actions</strong><span>une liste priorisée à imprimer</span></div>
          </div>
        </div></section>

        <Diagnostic />

        <section className="section noprint"><div className="container"><div className="resultCard">
          <div className="eyebrow">Important</div>
          <h2>Un outil d'aide à la préparation</h2>
          <p className="muted">Les obligations dépendent de votre situation. FactureReady ne remplace ni l'administration ni votre expert-comptable et ne constitue pas une certification de conformité. Dernière vérification du calendrier : septembre 2026.</p>
          <a className="btn secondary" href="https://www.economie.gouv.fr/tout-savoir-sur-la-facturation-electronique-pour-les-entreprises" target="_blank" rel="noreferrer">Informations officielles <ArrowRight size={17} /></a>
        </div></div></section>
      </main>
      <footer className="footer noprint"><div className="container">FactureReady · Informations générales uniquement · <a href="/mentions-legales">Mentions légales</a> · <a href="/confidentialite">Confidentialité</a></div></footer>
    </>
  );
}
