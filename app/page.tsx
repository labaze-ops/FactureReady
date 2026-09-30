import Diagnostic from "../components/Diagnostic";
export default function Home() {
  return (<div className="c">
    <div className="nav">Facture<b>Ready</b></div>
    <div className="eyebrow">France · Réforme de la facturation électronique</div>
    <h1>Sachez exactement quoi préparer.</h1>
    <p className="lead">Un diagnostic clair en 2 minutes, puis un plan d'action adapté à votre entreprise. Sans jargon.</p>
    <Diagnostic />
    <div className="card"><strong>Outil d'information uniquement.</strong> <span className="muted">FactureReady ne constitue ni un conseil juridique ou fiscal, ni une certification de conformité. Vérifiez votre situation auprès de <a href="https://www.impots.gouv.fr/professionnel/la-facturation-electronique" target="_blank" rel="noreferrer">impots.gouv.fr</a> ou de votre expert-comptable.</span></div>
    <div className="foot">© FactureReady · Ajoutez ici mentions légales, CGV, confidentialité.</div>
  </div>);
}
