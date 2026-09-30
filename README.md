# FactureReady

Diagnostic gratuit de préparation à la facturation électronique (France). Next.js 15 + TypeScript, sans backend.

## Lancer
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Paiement du rapport premium
Créez un Payment Link Stripe, puis copiez `.env.example` en `.env.local` et renseignez `NEXT_PUBLIC_CHECKOUT_URL`. Sans cette variable, le bouton affiche « Bientôt disponible ».

## Où modifier quoi
- `lib/diagnostic.ts` : dates, règles de scoring, actions.
- `components/Diagnostic.tsx` : formulaire et affichage du résultat.
- `app/mentions-legales`, `app/confidentialite` : à compléter avant mise en ligne.

## Avant la mise en production
Faire relire les règles par un expert-comptable, dater les informations, ajouter analytics respectueux de la vie privée, puis déployer sur Vercel.
