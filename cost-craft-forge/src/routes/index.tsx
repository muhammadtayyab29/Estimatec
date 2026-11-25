import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth, homeForRole } from "@/context/AuthContext";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  return <Navigate to={user ? homeForRole(user.role) : "/login"} />;
}
