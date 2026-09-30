export type Size = "micro" | "pme" | "eti" | "large";
export type Vat = "vat" | "franchise" | "exempt";
export type Clients = "b2b" | "b2c" | "mixed";
export type Tool = "approved" | "unsure" | "manual" | "accountant";
export type Platform = "yes" | "no";

export type Answers = { size: Size; vat: Vat; clients: Clients; tool: Tool; platform: Platform };
export type Deadline = { label: string; date: string; text: string };
export type Action = { title: string; body: string; priority: "high" | "medium" | "low" };
export type Breakdown = { label: string; points: number; max: number };
export type Result = {
  score: number;
  level: "start" | "progress" | "ready";
  title: string;
  outOfScope: boolean;
  deadlines: Deadline[];
  actions: Action[];
  breakdown: Breakdown[];
};

export const SIZE_LABEL: Record<Size, string> = {
  micro: "micro-entreprise / indépendant",
  pme: "PME / TPE",
  eti: "ETI",
  large: "grande entreprise",
};

const RECEPTION = "2026-09-01";
const EMISSION_LARGE = "2026-09-01";
const EMISSION_SMALL = "2027-09-01";

export function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function status(iso: string, now: Date = new Date()) {
  const d = new Date(iso + "T00:00:00");
  const days = Math.ceil((d.getTime() - now.getTime()) / 86_400_000);
  if (days <= 0) return { inForce: true, label: "En vigueur" };
  return { inForce: false, label: days === 1 ? "Demain" : `Dans ${days} jours` };
}

export function diagnose(a: Answers): Result {
  const largeEmitter = a.size === "eti" || a.size === "large";
  const outOfScope = a.vat === "exempt";

  const deadlines: Deadline[] = [
    { label: "Réception des factures électroniques", date: RECEPTION, text: "Obligatoire pour toutes les entreprises assujetties à la TVA, quelle que soit leur taille." },
    {
      label: "Émission des factures électroniques et e-reporting",
      date: largeEmitter ? EMISSION_LARGE : EMISSION_SMALL,
      text: largeEmitter ? "Obligatoire pour les grandes entreprises et les ETI." : "Obligatoire pour les PME, TPE, micro-entreprises et indépendants.",
    },
  ];

  if (outOfScope) {
    return {
      score: 0, level: "start", outOfScope: true, deadlines: [], breakdown: [],
      title: "Votre activité semble hors du champ de la réforme",
      actions: [{
        title: "Confirmer votre situation",
        body: "Les activités exonérées de TVA ne sont en principe pas concernées, mais certaines situations mixtes existent. Confirmez avec votre expert-comptable ou sur impots.gouv.fr.",
        priority: "high",
      }],
    };
  }

  const breakdown: Breakdown[] = [];
  const actions: Action[] = [];

  const pf = a.platform === "yes" ? 35 : 0;
  breakdown.push({ label: "Plateforme agréée choisie", points: pf, max: 35 });
  if (a.platform === "no") actions.push({
    title: "Choisir une plateforme agréée",
    body: "La réception (et bientôt l'émission) passe par une plateforme agréée. Consultez la liste officielle sur impots.gouv.fr, comparez les offres et rattachez votre entreprise à l'annuaire.",
    priority: "high",
  });

  const toolPoints: Record<Tool, number> = { approved: 35, accountant: 25, unsure: 10, manual: 0 };
  breakdown.push({ label: "Outil de facturation adapté", points: toolPoints[a.tool], max: 35 });
  if (a.tool === "manual") actions.push({
    title: "Abandonner Excel/Word pour un outil de facturation",
    body: "Des factures créées à la main ne produisent pas de format structuré (Factur-X, UBL, CII). Un logiciel raccordé à une plateforme agréée devient nécessaire.",
    priority: "high",
  });
  else if (a.tool === "unsure") actions.push({
    title: "Interroger votre éditeur",
    body: "Demandez : quel format structuré, quelle plateforme agréée partenaire, à quelle date, et à quel coût.",
    priority: "high",
  });
  else if (a.tool === "accountant") actions.push({
    title: "Clarifier le rôle de votre expert-comptable",
    body: "Vérifiez s'il émet et reçoit les factures pour vous, via quelle plateforme, et comment vous accédez à vos factures reçues.",
    priority: "medium",
  });
  else actions.push({
    title: "Tester la chaîne complète",
    body: "Vérifiez les mentions obligatoires (SIREN client, catégorie d'opération, adresse de livraison si différente), les statuts de cycle de vie et l'archivage.",
    priority: "medium",
  });

  const clientPoints: Record<Clients, number> = { b2b: 30, mixed: 20, b2c: 20 };
  breakdown.push({ label: "Flux clients identifiés", points: clientPoints[a.clients], max: 30 });
  if (a.clients === "b2c") actions.push({
    title: "Préparer l'e-reporting (ventes aux particuliers)",
    body: "Vos ventes B2C ne nécessitent pas de facture électronique, mais leurs données doivent être transmises à l'administration.",
    priority: "medium",
  });
  else if (a.clients === "mixed") actions.push({
    title: "Séparer vos flux B2B et B2C",
    body: "Les ventes B2B en France relèvent de la facture électronique ; les ventes B2C et internationales de l'e-reporting. Cartographiez chaque flux.",
    priority: "medium",
  });

  if (a.vat === "franchise") actions.push({
    title: "Vérifier votre franchise en base de TVA",
    body: "La franchise en base ne vous dispense pas forcément des obligations de réception. Confirmez votre cas auprès de l'administration ou de votre comptable.",
    priority: "medium",
  });

  actions.push({
    title: "Informer clients et fournisseurs",
    body: "Communiquez votre plateforme de réception à vos fournisseurs et récupérez celle de vos clients pour être prêt le jour de l'émission.",
    priority: "low",
  });

  const score = breakdown.reduce((s, b) => s + b.points, 0);
  const level = score >= 80 ? "ready" : score >= 45 ? "progress" : "start";
  const order = { high: 0, medium: 1, low: 2 };
  actions.sort((x, y) => order[x.priority] - order[y.priority]);

  return { score, level, title: `Diagnostic — ${SIZE_LABEL[a.size]}`, outOfScope, deadlines, actions, breakdown };
}
