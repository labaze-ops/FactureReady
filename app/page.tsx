import {ArrowRight, CheckCircle2, Clock3, ShieldCheck} from "lucide-react";
import Diagnostic, {DiagnosticResult} from "../components/Diagnostic";

export default function Home(){
 return <>
  <header><div className="container nav"><div className="logo">Facture<span>Ready</span></div><a className="navlink" href="#diagnostic">Faire le diagnostic</a></div></header>
  <main>
   <section className="hero"><div className="container heroGrid">
    <div><div className="eyebrow">Préparation · France · 2026–2027</div>
      <h1>Sachez quoi préparer pour la facturation électronique.</h1>
      <p className="lead">Un diagnostic clair en 2 minutes, puis un plan d'action adapté à votre entreprise. Sans jargon, sans installation.</p>
      <div className="actions"><a className="btn primary" href="#diagnostic">Démarrer gratuitement <ArrowRight size={17}/></a><a className="btn secondary" href="#how">Comment ça marche</a></div>
      <p className="micro">Outil d'information et de préparation — pas une certification de conformité.</p>
    </div>
    <div className="heroCard"><div className="scoreRow"><div><div className="eyebrow">Aperçu</div><div className="score">78<small>/100</small></div></div><span className="badge"><CheckCircle2 size={15}/> Prêt à progresser</span></div><div className="progress"><i/></div>
      <div className="check"><CheckCircle2/><div><strong>Réception</strong><div className="muted">Échéance à vérifier</div></div></div>
      <div className="check"><Clock3/><div><strong>Émission</strong><div className="muted">Préparation 2027</div></div></div>
      <div className="check"><ShieldCheck/><div><strong>Checklist</strong><div className="muted">3 actions recommandées</div></div></div>
    </div>
   </div></section>

   <section id="how" className="section"><div className="container"><div className="sectionHead"><div className="eyebrow">Simple par conception</div><h2>Un produit utile, pas un logiciel de plus.</h2><p className="muted">L'objectif est de transformer une réforme complexe en quelques décisions concrètes.</p></div>
    <div className="stats"><div className="stat"><strong>2 min</strong><span>pour le diagnostic</span></div><div className="stat"><strong>3 étapes</strong><span>situation → échéances → actions</span></div><div className="stat"><strong>19 €</strong><span>pour le rapport premium</span></div></div>
   </div></section>

   <Diagnostic/>

   <section className="section"><div className="container"><div className="resultCard"><div className="eyebrow">Important</div><h2>Un outil d'aide à la préparation</h2><p className="muted">Les obligations peuvent dépendre de votre situation. FactureReady ne remplace ni l'administration, ni votre expert-comptable, et ne constitue pas une certification de conformité.</p><a className="btn secondary" href="https://www.economie.gouv.fr/tout-savoir-sur-la-facturation-electronique-pour-les-entreprises" target="_blank" rel="noreferrer">Voir les informations officielles <ArrowRight size={17}/></a></div></div></section>
  </main>
  <footer className="footer"><div className="container">FactureReady · MVP · Informations générales uniquement.</div></footer>
 </>;
}
