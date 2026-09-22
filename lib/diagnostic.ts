export type Answers = { size:string; vat:string; b2b:string; software:string };
export type Result = { score:number; title:string; summary:string; actions:{title:string;body:string}[] };

const names:Record<string,string>={micro:"micro-entreprise",pme:"PME",eti:"ETI",large:"grande entreprise"};

export function diagnose(a:Answers):Result{
 let score=55; const actions:{title:string;body:string}[]=[];
 if(a.software==="yes") score+=15;
 else actions.push({title:"Vérifier votre logiciel de facturation",body:"Demandez à votre éditeur comment il gère la réception, l'émission et les flux liés à la réforme."});
 if(a.vat==="yes") score+=10;
 else actions.push({title:"Vérifier votre situation TVA",body:"Votre situation peut modifier les obligations applicables. Vérifiez votre cas avec une source officielle ou votre expert-comptable."});
 if(a.b2b==="yes") score+=10;
 else actions.push({title:"Cartographier vos flux",body:"Identifiez vos clients B2B/B2C, fournisseurs et flux internationaux afin de savoir quelles données et procédures préparer."});
 if(a.software==="yes") actions.push({title:"Tester votre chaîne de facturation",body:"Vérifiez les données obligatoires, les statuts, l'archivage et la capacité de réception de votre solution."});
 if(!actions.length) actions.push({title:"Faire un test de bout en bout",body:"Réalisez un scénario complet avant l'échéance applicable à votre entreprise."});
 return {score:Math.min(score,100),title:`Diagnostic pour votre ${names[a.size]}`,summary:"Indicateur pédagogique : il ne constitue pas une certification de conformité.",actions};
}
