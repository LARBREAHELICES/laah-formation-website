// src/App.tsx
import { useEffect } from "react"
import { useFormationStore } from "@/stores/useFormation"

export default function App() {
  const { formations, formation, loading, error, fetchFormations, fetchFormation } =
    useFormationStore();

  // Récupère toutes les formations au montage
  useEffect(() => {
    fetchFormations();
  }, [fetchFormations]);

  // Exemple : récupère la première formation en détail (si elle existe)
  useEffect(() => {
    if (formations.length) {
      fetchFormation(formations[0].id);
    }
  }, [formations, fetchFormation]);

  if (loading) return <p>Chargement…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <main className="p-4">
      {/* Liste des formations */}
      <h1 className="text-2xl font-bold mb-4">Liste des formations</h1>
      <ul className="mb-8">
        {formations.map((f) => (
          <li key={f.id} className="mb-2">
            <button
              className="text-blue-600 underline"
              onClick={() => fetchFormation(f.id)}
            >
              {f.title}
            </button>
          </li>
        ))}
      </ul>

      {/* Détail d'une formation */}
      {formation && (
        <>
          <h2 className="text-xl font-semibold mb-2">Détail</h2>
          <p><strong>Titre :</strong> {formation.title}</p>
          <p><strong>Slug :</strong> {formation.slug}</p>
          <p><strong>Durée :</strong> {formation.duration_hours} h</p>
          <p><strong>Objectifs :</strong> {formation.objectives}</p>
        </>
      )}
    </main>
  );
}