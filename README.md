# chopini

Marketplace d'achat et de vente de produits neufs et d'occasion (mode, beauté, électronique, maison, etc.).

## Structure
- `backend/` : API NestJS + Prisma + PostgreSQL
- `frontend/` : Next.js (App Router)

## Démarrage
```bash
docker compose up -d                 # base PostgreSQL
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npx prisma db seed                   # catégories de départ
npm run start:dev                    # http://localhost:3001

cd ../frontend
npm install
npm run dev                          # http://localhost:3000
```

## Endpoints (MVP)
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me` (Bearer token)
- `GET /categories`
- `GET /products?category=&condition=&minPrice=&maxPrice=&q=`
- `GET /products/:id`
- `POST /products` (authentifié)

## À faire
- Rôles et permissions (admin, modération)
- Upload d'images (Cloudinary / S3)
- Commandes, paiement (à la livraison, Konnect, Flouci)
- Messagerie, avis, signalements, modération
