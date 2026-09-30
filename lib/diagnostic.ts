export type Answers = { size: string; vat: string; b2b: string; software: string };
export type Action = { title: string; body: string };
export type Result = { score: number; title: string; summary: string; deadlines: { date: string; text: string; passed: boolean }[]; actions: Action[] };

export const SIZES: Record<string, string> = { micro: "micro-entreprise / TPE", pme: "PME", eti: "ETI", large: "grande entreprise" };
const NOW = () => new Date();

export function valid(a: Partial<Answers>): a is Answers {
  return !!a.size && a.size in SIZES && ["yes", "no"].includes(a.vat ?? "") && ["yes", "no"].includes(a.b2b ?? "") && ["yes", "no"].includes(a.software ?? "");
}

export function diagnose(a: Answers): Result {
  const big = a.size === "eti" || a.size === "large";
  const d1 = new Date("2026-09-01"), d2 = new Date("2027-09-01");
  const deadlines = [
    { date: "1er septembre 2026", text: "Réception des factures électroniques obligatoire pour toutes les entreprises" + (big ? ", ainsi que l'émission et l'e-reporting pour votre catégorie." : "."), passed: NOW() >= d1 },
    ...(big ? [] : [{ date: "1er septembre 2027", text: "Émission de factures électroniques et e-reporting obligatoires pour votre catégorie.", passed: NOW() >= d2 }]),
  ];
  let score = 40; const actions: Action[] = [];
  if (a.software === "yes") { score += 20; actions.push({ title: "Interroger votre éditeur", body: "Demandez s'il est (ou sera) raccordé à une plateforme agréée (PA), et quels formats il gère (Factur-X, UBL, CII)." }); }
  else actions.push({ title: "Choisir un outil de facturation", body: "Sélectionnez un logiciel raccordé à une plateforme agréée. Comparez les offres avant de vous engager." });
  actions.push({ title: "Choisir et déclarer votre plateforme agréée", body: "Chaque entreprise doit désigner une plateforme agréée pour recevoir ses factures, et l'indiquer dans l'annuaire de la réforme." });
  if (a.vat === "yes") score += 10; else actions.push({ title: "Vérifier votre régime de TVA", body: "La réception s'applique aussi aux assujettis non redevables (franchise en base). L'e-reporting et l'émission dépendent de votre situation : confirmez-la avec votre expert-comptable." });
  if (a.b2b === "yes") { score += 10; actions.push({ title: "Mettre à jour vos mentions", body: "Vérifiez les nouvelles mentions obligatoires : SIREN du client, adresse de livraison si différente, nature de l'opération (biens, services), option TVA sur les débits." }); }
  else actions.push({ title: "Cartographier vos flux", body: "Identifiez ce qui relève du B2B France (facturation électronique) et du B2C / international (e-reporting)." });
  actions.push({ title: "Faire un test de bout en bout", body: "Émettez et recevez une facture test, vérifiez les statuts et l'archivage." });
  if (big) score += 10; else score += 5;
  return { score: Math.min(score, 100), title: `Plan d'action — ${SIZES[a.size]}`, summary: "Indicateur pédagogique de préparation. Ce n'est pas une certification de conformité.", deadlines, actions };
}
