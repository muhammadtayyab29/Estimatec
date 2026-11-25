import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { agentService } from "@/services";
import { type FlaggedItem, findProject } from "@/data/mockData";
import { PageHeader } from "@/components/shared/PortalLayout";
import { Button } from "@/components/shared/Forms";
import { statusBadge } from "@/components/shared/StatCard";
import { toast } from "sonner";

export const Route = createFileRoute("/agent/flagged")({ component: Page });

function Page() {
  const [items, setItems] = useState<FlaggedItem[]>([]);
  const reload = () => agentService.flagged().then(setItems);
  useEffect(() => { reload(); }, []);
  return (
    <>
      <PageHeader title="Flagged Items" />
      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
            <tr className="text-left"><th className="px-4 py-3">Project</th><th>Reason</th><th>Status</th><th>Flagged</th><th className="text-right pr-4">Actions</th></tr>
          </thead>
          <tbody>
            {items.map(f => (
              <tr key={f.id} className="border-t border-border/60">
                <td className="px-4 py-3 font-medium">{findProject(f.projectId)?.name}</td>
                <td className="text-muted-foreground">{f.reason}</td>
                <td>{statusBadge(f.status)}</td>
                <td className="text-xs text-muted-foreground">{f.flaggedAt.slice(0,10)}</td>
                <td className="text-right pr-4"><Button size="sm" variant="outline" onClick={() => agentService.removeFlag(f.id).then(() => { toast.success("Flag removed"); reload(); })}>Remove Flag</Button></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No flagged items.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
