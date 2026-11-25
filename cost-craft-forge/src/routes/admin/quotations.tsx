import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { quotationService } from "@/services";
import { type Quotation, findProject, findUser, formatMoney } from "@/data/mockData";
import { PageHeader } from "@/components/shared/PortalLayout";
import { Button, Textarea, Field } from "@/components/shared/Forms";
import { statusBadge } from "@/components/shared/StatCard";
import { Modal } from "@/components/shared/Modal";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/admin/quotations")({ component: AllQuotations });

function AllQuotations() {
  const [items, setItems] = useState<Quotation[]>([]);
  const [rej, setRej] = useState<Quotation | null>(null);
  const [reason, setReason] = useState("");
  const reload = () => quotationService.list().then(setItems);
  useEffect(() => { reload(); }, []);
  return (
    <>
      <PageHeader title="All Quotations" />
      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
            <tr className="text-left"><th className="px-4 py-3">Quote</th><th>Project</th><th>Estimator</th><th>Status</th><th className="text-right">Total</th><th className="text-right pr-4">Actions</th></tr>
          </thead>
          <tbody>
            {items.map(q => {
              const p = findProject(q.projectId);
              const display = q.adminStatus === "Approved" ? "Admin Approved"
                : q.adminStatus === "Rejected" ? "Rejected"
                : q.agentStatus === "Flagged" ? "Flagged"
                : q.agentStatus === "Approved" ? "Agent Approved" : "Pending Review";
              return (
                <tr key={q.id} className="border-t border-border/60">
                  <td className="px-4 py-3 font-mono text-xs">{q.id}</td>
                  <td className="font-medium">{p?.name}</td>
                  <td>{p ? findUser(p.estimatorId)?.name : "—"}</td>
                  <td>{statusBadge(display)}</td>
                  <td className="text-right font-mono">{formatMoney(q.total)}</td>
                  <td className="text-right pr-4">
                    <Button size="sm" variant="success" onClick={() => quotationService.approveAdmin(q.id).then(() => { toast.success("Approved"); reload(); })} disabled={q.adminStatus==="Approved"}><Check className="w-3.5 h-3.5"/></Button>{" "}
                    <Button size="sm" variant="danger" onClick={() => setRej(q)} disabled={q.adminStatus==="Rejected"}><X className="w-3.5 h-3.5"/></Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal open={!!rej} onClose={() => setRej(null)} title="Reject Quotation"
        footer={<><Button variant="outline" onClick={() => setRej(null)}>Cancel</Button>
        <Button variant="danger" onClick={() => { if (!reason) return toast.warning("Reason required"); quotationService.rejectAdmin(rej!.id).then(() => { toast.success("Rejected"); setRej(null); setReason(""); reload(); }); }}>Reject</Button></>}>
        <Field label="Reason"><Textarea rows={4} value={reason} onChange={e => setReason(e.target.value)} /></Field>
      </Modal>
    </>
  );
}
