import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/data/mockData";
import { useState, type ReactNode } from "react";
import { LogOut, ChevronLeft } from "lucide-react";

export interface NavItem { to: string; label: string; icon: ReactNode; }

export function PortalLayout({
  role, title, items, children,
}: { role: Role; title: string; items: NavItem[]; children: ReactNode }) {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const accent = role === "admin" ? "gradient-admin" : role === "estimator" ? "gradient-estimator" : "gradient-agent";
  const badgeColor = role === "admin" ? "bg-[color:var(--admin)]" : role === "estimator" ? "bg-[color:var(--estimator)]" : "bg-[color:var(--agent)]";
  const logout = () => { signOut(); nav({ to: "/login" }); };

  return (
    <div className="min-h-screen w-full grid-bg">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 glass flex items-center justify-between px-4 py-3">
        <button onClick={() => setMobileOpen((v) => !v)} className="rounded-md border border-border px-3 py-1.5 text-sm">☰</button>
        <span className="font-semibold">{title}</span>
        <button onClick={logout} className="text-sm text-muted-foreground"><LogOut className="w-4 h-4" /></button>
      </div>

      <div className="flex">
        <aside
          className={`${mobileOpen ? "fixed inset-y-0 left-0 z-40" : "hidden"} md:flex md:static md:z-auto flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200`}
          style={{ width: collapsed ? 72 : 240 }}
        >
          <div className={`${accent} text-white px-4 py-5`}>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center font-bold">ET</div>
              {!collapsed && <div>
                <div className="text-xs uppercase tracking-wider opacity-80">EstimaTec</div>
                <div className="font-semibold leading-tight">{title}</div>
              </div>}
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {items.map((it) => {
              const active = currentPath === it.to || currentPath.startsWith(it.to + "/");
              return (
                <Link
                  key={it.to} to={it.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                           : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
                  }`}
                >
                  <span className="w-5 h-5 flex items-center justify-center shrink-0">{it.icon}</span>
                  {!collapsed && <span className="truncate">{it.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full text-white flex items-center justify-center text-sm font-medium ${badgeColor}`}>
                {user?.avatar}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{user?.name}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{role}</div>
                </div>
              )}
              {!collapsed && (
                <button onClick={logout} title="Logout" className="text-muted-foreground hover:text-foreground"><LogOut className="w-4 h-4" /></button>
              )}
            </div>
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="mt-3 hidden md:flex w-full items-center justify-center gap-1 rounded-md border border-border text-xs py-1.5 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
              {!collapsed && "Collapse"}
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-4 md:p-8 max-w-[1500px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
