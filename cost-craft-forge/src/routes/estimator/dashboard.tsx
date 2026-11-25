import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { projectService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { type Project, findUser, formatMoney } from "@/data/mockData";
import { StatCard, statusBadge } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PortalLayout";
import { Button } from "@/components/shared/Forms";
import { Plus, Upload, Cpu } from "lucide-react";

export const Route = createFileRoute("/estimator/dashboard")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => { if (user) projectService.byEstimator(user.id).then(setProjects); }, [user]);
  const total = projects.reduce((s,p) => s + p.estValue, 0);
  const completed = projects.filter(p => p.status === "Completed" || p.status === "Approved").length;
  return (
    <>
      <PageHeader title="My Dashboard" subtitle={`Welcome back, ${user?.name.split(" ")[0]}`} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="My Projects" value={projects.length} />
        <StatCard label="Estimations Run" value={completed} accent="accent" />
        <StatCard label="Avg Accuracy" value={93.7} suffix="%" accent="success" />
        <StatCard label="My Total Value" value={total} prefix="$" accent="warning" />
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Link to="/estimator/projects"><div className="glass rounded-2xl p-6 hover:shadow-lg transition cursor-pointer"><Plus className="w-6 h-6 text-primary mb-2"/><div className="font-semibold">New Project</div><div className="text-xs text-muted-foreground">Start a fresh estimate</div></div></Link>
        <Link to="/estimator/upload"><div className="glass rounded-2xl p-6 hover:shadow-lg transition cursor-pointer"><Upload className="w-6 h-6 text-accent mb-2"/><div className="font-semibold">Upload Drawing</div><div className="text-xs text-muted-foreground">Add a PDF/PNG/JPG</div></div></Link>
        <Link to="/estimator/estimate"><div className="glass rounded-2xl p-6 hover:shadow-lg transition cursor-pointer"><Cpu className="w-6 h-6 text-[color:var(--success)] mb-2"/><div className="font-semibold">Run Estimation</div><div className="text-xs text-muted-foreground">Trigger the AI pipeline</div></div></Link>
      </div>
      <div className="glass rounded-2xl p-5 overflow-x-auto">
        <h3 className="font-semibold mb-3">My Active Projects</h3>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground"><tr className="text-left"><th className="py-2">Project</th><th>Zip</th><th>Status</th><th>Agent</th><th className="text-right">Value</th><th></th></tr></thead>
          <tbody>
            {projects.slice(0,5).map(p => (
              <tr key={p.id} className="border-t border-border/60">
                <td className="py-2.5 font-medium">{p.name}</td>
                <td className="font-mono">{p.zip}</td>
                <td>{statusBadge(p.status)}</td>
                <td>{p.agentId ? findUser(p.agentId)?.name : <span className="text-muted-foreground">Pending</span>}</td>
                <td className="text-right font-mono">{formatMoney(p.estValue)}</td>
                <td className="text-right"><Link to="/estimator/estimate"><Button size="sm" variant="outline">Estimate</Button></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
