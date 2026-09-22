 "use client";
import {FormEvent, useState} from "react";
import {ArrowRight, CheckCircle2, Clock3, ShieldCheck} from "lucide-react";
import {diagnose, Result} from "../lib/diagnostic";

export default function Diagnostic(){
 const [result,setResult]=useState<Result|null>(null); const [error,setError]=useState("");
 function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault(); setError("");
  const f=new FormData(e.currentTarget);
  const size=String(f.get("size")||""),vat=String(f.get("vat")||""),b2b=String(f.get("b2b")||""),software=String(f.get("software")||"");
  if(!size||!vat||!b2b||!software){setError("Veuillez compléter tous les champs.");return}
  setResult(diagnose({size,vat,b2b,software}));
  setTimeout(()=>document.getElementById("result")?.scrollIntoView({behavior:"smooth"}),50);
 }
 return <section id="diagnostic" className="section">
  <div className="container">
   <div className="sectionHead"><div className="eyebrow">Diagnostic gratuit</div><h2>En 2 minutes, obtenez votre plan d'action.</h2><p className="muted">Aucune installation. Vos réponses servent uniquement à personnaliser le diagnostic dans cette version.</p></div>
   <form className="formCard" onSubmit={submit}>
    {error&&<div className="error" role="alert">{error}</div>}
    <div className="formGrid">
     <div className="field"><label htmlFor="size">Taille de l'entreprise</label><select id="size" name="size" defaultValue=""><option value="" disabled>Choisir…</option><option value="micro">Micro-entreprise</option><option value="pme">PME</option><option value="eti">ETI</option><option value="large">Grande entreprise</option></select></div>
     <div className="field"><label htmlFor="vat">Assujettissement à la TVA</label><select id="vat" name="vat" defaultValue=""><option value="" disabled>Choisir…</option><option value="yes">Oui</option><option value="no">Non / exonéré</option></select></div>
     <div className="field"><label htmlFor="b2b">Clients B2B en France</label><select id="b2b" name="b2b" defaultValue=""><option value="" disabled>Choisir…</option><option value="yes">Oui</option><option value="no">Non</option></select></div>
     <div className="field"><label htmlFor="software">Logiciel de facturation</label><select id="software" name="software" defaultValue=""><option value="" disabled>Choisir…</option><option value="yes">Oui</option><option value="no">Non</option></select></div>
    </div>
    <div className="formFooter"><button className="btn primary" type="submit">Voir mon diagnostic <ArrowRight size={17}/></button></div>
   </form>
  </div>
 </section>
}

export function DiagnosticResult({result}:{result:Result}){
 return <section id="result" className="section">
  <div className="container">
   <div className="result">
    <div className="resultCard">
      <span className="badge"><ShieldCheck size={15}/> Diagnostic terminé</span>
      <div className="bigScore">{result.score}<span style={{fontSize:18,color:"#526276"}}>/100</span></div>
      <h3>Votre préparation</h3><div className="progress"><i style={{width:`${result.score}%`}}/></div><p className="muted">{result.summary}</p>
      <div className="deadline"><strong>1er septembre 2026</strong><span>Réception électronique pour les entreprises concernées.</span></div>
      <div className="deadline"><strong>1er septembre 2027</strong><span>Émission électronique et e-reporting pour les PME et micro-entreprises concernées.</span></div>
    </div>
    <div className="resultCard">
      <h2 style={{marginTop:0}}>{result.title}</h2><p className="muted">Voici les prochaines actions à vérifier.</p>
      {result.actions.map((x,i)=><div className="task" key={x.title}><div className="taskNum">{i+1}</div><div><strong>{x.title}</strong><div className="muted">{x.body}</div></div></div>)}
      <div className="priceBox"><div className="eyebrow">Rapport premium</div><h3 style={{marginBottom:4}}>Votre checklist PDF personnalisée</h3><p className="muted">Synthèse, échéances, actions et sources officielles à conserver.</p><div className="price">19 €</div><button className="btn primary" onClick={()=>alert("MVP : connecter ce bouton à Stripe Checkout.")}>Obtenir mon rapport <ArrowRight size={17}/></button></div>
    </div>
   </div>
  </div>
 </section>
}
