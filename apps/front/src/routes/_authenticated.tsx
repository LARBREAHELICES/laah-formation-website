// routes/dashboard.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/useAuth";

export const Route = createFileRoute("/_authenticated")({
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
})