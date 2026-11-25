import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuth, homeForRole } from "@/context/AuthContext";
import { PortalLayout } from "@/components/shared/PortalLayout";
import { Home, FolderKanban, DollarSign, Flag, MessageSquare, ListChecks, Settings } from "lucide-react";

export const Route = createFileRoute("/agent")({ component: AgentLayout });

const items = [
  { to: "/agent/dashboard", label: "My Dashboard", icon: <Home className="w-4 h-4" /> },
  { to: "/agent/projects", label: "Assigned Projects", icon: <FolderKanban className="w-4 h-4" /> },
  { to: "/agent/reviews", label: "Quotation Reviews", icon: <DollarSign className="w-4 h-4" /> },
  { to: "/agent/flagged", label: "Flagged Items", icon: <Flag className="w-4 h-4" /> },
  { to: "/agent/notes", label: "Notes & Comments", icon: <MessageSquare className="w-4 h-4" /> },
  { to: "/agent/activity", label: "My Activity", icon: <ListChecks className="w-4 h-4" /> },
  { to: "/agent/settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

function AgentLayout() {
  const { user, loading } = useAuth();
  if (!loading && !user) return <Navigate to="/login" />;
  if (!loading && user && user.role !== "agent") return <Navigate to={homeForRole(user.role)} />;
  return <PortalLayout role="agent" title="Agent Portal" items={items}>{loading ? <div className="p-6 text-muted-foreground">Loading…</div> : <Outlet />}</PortalLayout>;
}
