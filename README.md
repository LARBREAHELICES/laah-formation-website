

docker exec -it fastapi_laah bash


## Migrations

```bash
# Revenir à l'état initial
alembic downgrade base

# création d'une nouvelle migration 
alembic revision -m "add user_term associations"

# lancer les migrations
alembic upgrade head

# initialisation
alembic downgrade base
alembic upgrade head

alembic current

alembic history
alembic downgrade -1

# plus explicite pour annuler la migration 
alembic downgrade abcd1234efgh

# pensez à relancer les migrations
alembic upgrade head
```

# Usecase (Antoine)

Usecase : "Création du endpoint pour récupérer les formations au format JSON"

# Usecase (Emilien)

Usecase : « Création de la page d’accueil React – affichage des formations »

Objectif livrable  
Un composant React affichant la liste des formations (titre, description, prix, etc.) récupérées via l’API FastAPI, dans une première mise en page responsive.

Acteurs  
- Front-end dev (toi / collègue)  
- API FastAPI déjà up (`GET /api/formations`)

Pré-requis  
1. Le monorepo est cloné (`pnpm install` déjà fait).  
2. API lancée : `docker compose up api` → `http://localhost:8000/docs` OK.  
3. Route API `GET /api/formations` renvoie  
   ```json
   [
     {
       "id": 1,
       "title": "React 19 & TypeScript",
       "description": "...",
       "total_amount": 1290,
       "classroom_student_counts": 12,
       "rate": "★★★★☆"
     }
   ]
   ```

Étapes détaillées

1. Générer le squelette de la page
   ```bash
   cd apps/front
   pnpm add -D @tanstack/react-query axios   # client HTTP + cache
   pnpm create @tanstack/router  # si pas encore fait
   ```

2. Créer le service API  
   `src/services/formations.ts`
   ```ts
   import axios from 'axios';
   import type { Formation } from '@/types/formation';

   export const fetchFormations = async (): Promise<Formation[]> =>
     axios.get('/api/formations').then(r => r.data);
   ```

   `src/types/formation.ts`
   ```ts
   export interface Formation {
     id: number;
     title: string;
     description: string;
     total_amount: number;
     classroom_student_counts: number;
     rate: string | null;
   }
   ```

3. Composant React  
   `src/pages/HomePage.tsx`
   ```tsx
   import { useQuery } from '@tanstack/react-query';
   import { fetchFormations } from '@/services/formations';

   export default function HomePage() {
     const { data, isLoading, error } = useQuery({
       queryKey: ['formations'],
       queryFn: fetchFormations,
     });

     if (isLoading) return <p>Chargement…</p>;
     if (error) return <p>Erreur API</p>;

     return (
       <main className="mx-auto max-w-4xl p-4">
         <h1 className="text-3xl font-bold mb-6">Nos formations</h1>
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           {data?.map(f => (
             <article
               key={f.id}
               className="border rounded p-4 shadow hover:shadow-lg"
             >
               <h2 className="text-xl font-semibold">{f.title}</h2>
               <p className="text-sm text-gray-600 mt-1">{f.description}</p>
               <p className="mt-2 font-bold">{f.total_amount} €</p>
               <p className="text-sm">
                 {f.classroom_student_counts} places déjà prises
               </p>
               {f.rate && <p className="text-yellow-500">{f.rate}</p>}
             </article>
           ))}
         </div>
       </main>
     );
   }
   ```

4. Ajouter la route  
   `src/routes/__root.tsx`
   ```tsx
   import { createRootRoute } from '@tanstack/react-router';
   import HomePage from '@/pages/HomePage';

   export const Route = createRootRoute({
     component: () => <HomePage />,
   });
   ```

5. Lancer le front en dev
   ```bash
   pnpm dev
   ```
   → http://localhost:5173 affiche la grille des formations.

Critères d’acceptation (Definition of Done)  
✅ Page accessible `/` sans erreur console  
✅ Liste chargée via `GET /api/formations` (React Query)  
✅ Responsive (Tailwind ou autre)  
✅ Code dans `apps/front/src/pages/HomePage.tsx` + services typés  
✅ MR ouverte avec screenshots dark/light mode

Temps estimé  
- 30 min si l'API fonctionne et que le projet React Router est déjà configuré.


## Organisation 

```bash
git checkout feature/ma-feature
git pull origin main 

# merge la branch distante main dans feature
git fetch origin
git merge origin/main

git checkout main
# au cas où y a autre chose qui est arrivée entre temps 
git pull origin main

git merge feature/ma-feature

git branch -d feature/ma-feature
git push origin main
```