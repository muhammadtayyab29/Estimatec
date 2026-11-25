import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { projectService, quotationService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { type Project, type Quotation, findUser, formatMoney } from "@/data/mockData";
import { StatCard, statusBadge } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PortalLayout";
import { Button } from "@/components/shared/Forms";

export const Route = createFileRoute("/agent/dashboard")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotes, setQuotes] = useState<Quotation[]>([]);
  useEffect(() => { if (user) { projectService.byAgent(user.id).then(setProjects); quotationService.byAgent(user.id).then(setQuotes); } }, [user]);
  const pending = quotes.filter(q => q.agentStatus === "Pending").length;
  const approved = quotes.filter(q => q.agentStatus === "Approved").length;
  const flagged = quotes.filter(q => q.agentStatus === "Flagged").length;
  return (
    <>
      <PageHeader title="My Dashboard" subtitle={`Welcome back, ${user?.name.split(" ")[0]}`} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Assigned Projects" value={projects.length} />
        <StatCard label="Pending Reviews" value={pending} accent="warning" />
        <StatCard label="Approved" value={approved} accent="success" />
        <StatCard label="Flagged" value={flagged} accent="destructive" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="font-semibold">My Assigned Projects</h3>
          {projects.map(p => (
            <div key={p.id} className={`glass rounded-2xl p-5 border-l-4 ${p.status==="Approved"?"border-l-[color:var(--success)]":p.status==="Completed"?"border-l-[color:var(--agent)]":"border-l-[color:var(--warning)]"}`}>
              <div className="flex justify-between items-start"><div><div className="font-medium">{p.name}</div><div className="text-xs text-muted-foreground">{p.client} · {p.zip}</div></div>{statusBadge(p.status)}</div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Estimator: {findUser(p.estimatorId)?.name}</span>
                <Link to="/agent/reviews"><Button size="sm">Review Now</Button></Link>
              </div>
            </div>
          ))}
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold mb-3">Review Queue</h3>
          <div className="space-y-2">
            {quotes.filter(q => q.agentStatus === "Pending").map(q => {
              const p = projects.find(x => x.id === q.projectId);
              return (
                <div key={q.id} className="flex items-center justify-between border-b border-border pb-2">
                  <div><div className="text-sm font-medium">{p?.name}</div><div className="text-xs font-mono text-muted-foreground">{formatMoney(q.total)}</div></div>
                  <Link to="/agent/reviews"><Button size="sm" variant="outline">Review</Button></Link>
                </div>
              );
            })}
            {quotes.filter(q => q.agentStatus === "Pending").length === 0 && <div className="text-sm text-muted-foreground">No pending reviews.</div>}
          </div>
        </div>
      </div>
    </>
  );
}
