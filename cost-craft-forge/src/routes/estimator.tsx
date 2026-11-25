import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuth, homeForRole } from "@/context/AuthContext";
import { PortalLayout } from "@/components/shared/PortalLayout";
import { Home, FolderKanban, Upload, Cpu, DollarSign, ListChecks, Settings } from "lucide-react";

export const Route = createFileRoute("/estimator")({ component: EstLayout });

const items = [
  { to: "/estimator/dashboard", label: "My Dashboard", icon: <Home className="w-4 h-4" /> },
  { to: "/estimator/projects", label: "My Projects", icon: <FolderKanban className="w-4 h-4" /> },
  { to: "/estimator/upload", label: "Upload Drawing", icon: <Upload className="w-4 h-4" /> },
  { to: "/estimator/estimate", label: "Run Estimation", icon: <Cpu className="w-4 h-4" /> },
  { to: "/estimator/quotations", label: "My Quotations", icon: <DollarSign className="w-4 h-4" /> },
  { to: "/estimator/activity", label: "Activity", icon: <ListChecks className="w-4 h-4" /> },
  { to: "/estimator/settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

function EstLayout() {
  const { user, loading } = useAuth();
  if (!loading && !user) return <Navigate to="/login" />;
  if (!loading && user && user.role !== "estimator") return <Navigate to={homeForRole(user.role)} />;
  return <PortalLayout role="estimator" title="Estimator Portal" items={items}>{loading ? <div className="p-6 text-muted-foreground">Loading…</div> : <Outlet />}</PortalLayout>;
}
