# FactureReady
Diagnostic gratuit → rapport à 19 € (Stripe Checkout, sans base de données : la page /merci revérifie le paiement auprès de Stripe).
## Lancer
    cp .env.example .env.local   # renseigner STRIPE_SECRET_KEY (mode test) et NEXT_PUBLIC_SITE_URL
    npm install && npm run dev
## Déployer : Vercel (ajouter les 2 variables d'environnement).
## Avant de vendre
- Faire relire les règles (lib/diagnostic.ts) par un expert-comptable ; dater les infos.
- Ajouter mentions légales, CGV (droit de rétractation contenu numérique), politique de confidentialité.
- Ajouter un email de reçu (Resend) et des pages SEO ciblées (« facture électronique micro-entrepreneur », etc.).
