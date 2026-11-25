import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuth, homeForRole } from "@/context/AuthContext";
import { PortalLayout } from "@/components/shared/PortalLayout";
import { Home, FolderKanban, DollarSign, Users, Handshake, ListChecks, Settings } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
  { to: "/admin/projects", label: "All Projects", icon: <FolderKanban className="w-4 h-4" /> },
  { to: "/admin/quotations", label: "All Quotations", icon: <DollarSign className="w-4 h-4" /> },
  { to: "/admin/users", label: "User Management", icon: <Users className="w-4 h-4" /> },
  { to: "/admin/agents", label: "Agent Assignments", icon: <Handshake className="w-4 h-4" /> },
  { to: "/admin/activity", label: "Activity Log", icon: <ListChecks className="w-4 h-4" /> },
  { to: "/admin/settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

function AdminLayout() {
  const { user, loading } = useAuth();
  if (!loading && !user) return <Navigate to="/login" />;
  if (!loading && user && user.role !== "admin") return <Navigate to={homeForRole(user.role)} />;
  return <PortalLayout role="admin" title="Admin Portal" items={items}>{loading ? <div className="p-6 text-muted-foreground">Loading…</div> : <Outlet />}</PortalLayout>;
}
