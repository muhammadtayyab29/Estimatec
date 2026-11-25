import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { projectService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { type Project, findUser } from "@/data/mockData";
import { PageHeader } from "@/components/shared/PortalLayout";
import { statusBadge } from "@/components/shared/StatCard";
import { Button } from "@/components/shared/Forms";

export const Route = createFileRoute("/agent/projects")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => { if (user) projectService.byAgent(user.id).then(setProjects); }, [user]);
  return (
    <>
      <PageHeader title="Assigned Projects" />
      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
            <tr className="text-left"><th className="px-4 py-3">Project</th><th>Zip</th><th>Estimator</th><th>Status</th><th className="text-right pr-4">Actions</th></tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-t border-border/60">
                <td className="px-4 py-3 font-medium">{p.name}<div className="text-xs text-muted-foreground">{p.client}</div></td>
                <td className="font-mono">{p.zip}</td>
                <td>{findUser(p.estimatorId)?.name}</td>
                <td>{statusBadge(p.status)}</td>
                <td className="text-right pr-4"><Link to="/agent/reviews"><Button size="sm" variant="outline">Review</Button></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
