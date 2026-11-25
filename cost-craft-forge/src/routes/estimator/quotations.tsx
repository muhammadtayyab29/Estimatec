import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { quotationService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { type Quotation, findProject, formatMoney } from "@/data/mockData";
import { PageHeader } from "@/components/shared/PortalLayout";
import { statusBadge } from "@/components/shared/StatCard";

export const Route = createFileRoute("/estimator/quotations")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [items, setItems] = useState<Quotation[]>([]);
  useEffect(() => { if (user) quotationService.byEstimator(user.id).then(setItems); }, [user]);
  return (
    <>
      <PageHeader title="My Quotations" />
      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
            <tr className="text-left"><th className="px-4 py-3">ID</th><th>Project</th><th>Agent</th><th>Admin</th><th className="text-right">Total</th><th>Generated</th></tr>
          </thead>
          <tbody>
            {items.map(q => (
              <tr key={q.id} className="border-t border-border/60">
                <td className="px-4 py-3 font-mono text-xs">{q.id}</td>
                <td className="font-medium">{findProject(q.projectId)?.name}</td>
                <td>{statusBadge(q.agentStatus === "Approved" ? "Agent Approved" : q.agentStatus === "Flagged" ? "Flagged" : "Pending")}</td>
                <td>{statusBadge(q.adminStatus === "Approved" ? "Admin Approved" : q.adminStatus === "Rejected" ? "Rejected" : "Pending")}</td>
                <td className="text-right font-mono">{formatMoney(q.total)}</td>
                <td className="text-xs text-muted-foreground">{q.generatedAt.slice(0,10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
