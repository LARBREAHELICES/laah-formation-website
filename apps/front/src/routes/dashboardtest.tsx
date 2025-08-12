// routes/dashboard.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/useAuth";

export const Route = createFileRoute("/dashboardtest")({
  beforeLoad: async () => {
    const { user, isLoading, fetchMe } = useAuthStore.getState();

    // Si pas encore chargé, on tente de récupérer l'utilisateur
    if (!user && !isLoading) {
      await fetchMe();
    }

    // Toujours pas d'utilisateur => on redirige
    if (!useAuthStore.getState().user) {
      throw redirect({ to: "/authtest" });
    }
  },
  component: Dashboard,
});

function Dashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div>
      <h1>Bienvenue {user?.fullname}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
