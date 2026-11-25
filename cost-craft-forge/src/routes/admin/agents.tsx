import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { agentService, projectService } from "@/services";
import { type Project, type User, findUser, users } from "@/data/mockData";
import { PageHeader } from "@/components/shared/PortalLayout";
import { Button, Select } from "@/components/shared/Forms";
import { statusBadge } from "@/components/shared/StatCard";
import { toast } from "sonner";
import { Zap } from "lucide-react";

export const Route = createFileRoute("/admin/agents")({ component: AgentsPage });

function AgentsPage() {
  const [agents, setAgents] = useState<User[]>([]);
  const [load, setLoad] = useState<Record<string, number>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const reload = () => { agentService.list().then(setAgents); agentService.workload().then(setLoad); projectService.list().then(setProjects); };
  useEffect(() => { reload(); }, []);
  return (
    <>
      <PageHeader title="Agent Assignments" actions={<Button onClick={() => agentService.autoAssign().then(n => { toast.success(`${n} projects auto-assigned`); reload(); })}><Zap className="w-4 h-4"/> Auto-Assign</Button>} />
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {agents.map(a => {
          const count = load[a.id] ?? 0;
          return (
            <div key={a.id} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[color:var(--agent)] text-white flex items-center justify-center font-medium">{a.avatar}</div>
                <div className="flex-1"><div className="font-medium">{a.name}</div><div className="text-xs text-muted-foreground">{count<5?"Available":"Busy"}</div></div>
              </div>
              <div className="mt-3"><div className="text-xs text-muted-foreground mb-1">{count}/5 active</div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-[color:var(--agent)]" style={{ width: `${Math.min(100,count/5*100)}%` }}/></div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground"><tr className="text-left"><th className="px-4 py-3">Project</th><th>Estimator</th><th>Agent</th><th>Status</th></tr></thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-t border-border/60">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td>{findUser(p.estimatorId)?.name}</td>
                <td><Select value={p.agentId || ""} onChange={e => projectService.assignAgent(p.id, e.target.value || null).then(() => { toast.success("Saved"); reload(); })} className="max-w-[200px]">
                  <option value="">— Unassigned —</option>{users.filter(u=>u.role==="agent").map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </Select></td>
                <td>{statusBadge(p.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
