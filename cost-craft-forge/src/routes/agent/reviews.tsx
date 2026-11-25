import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { agentService, quotationService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { type Comment, findUser, aiDetection } from "@/data/mockData";
import { PageHeader } from "@/components/shared/PortalLayout";
import { CSITable } from "@/components/shared/CSITable";
import { Button, Field, Textarea } from "@/components/shared/Forms";
import { Modal } from "@/components/shared/Modal";
import { toast } from "sonner";
import { Check, Flag, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/agent/reviews")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [flagOpen, setFlagOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  useEffect(() => { agentService.byProject("p1").then(setComments); }, []);

  return (
    <>
      <PageHeader title="Quotation Review — Riverside Office Tower" subtitle="Submitted by James Foster · Zip 10001" />

      <div className="grid lg:grid-cols-4 gap-4 mb-4">
        <div className="lg:col-span-3"><CSITable projectId="p1" /></div>
        <div className="glass rounded-2xl p-5 h-fit">
          <h3 className="font-semibold mb-3">AI Detection Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Walls</span><span className="font-mono">{aiDetection.walls}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Doors</span><span className="font-mono">{aiDetection.doors}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Windows</span><span className="font-mono">{aiDetection.windows}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Slabs</span><span className="font-mono">{aiDetection.slabs}</span></div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 mb-24">
        <h3 className="font-semibold mb-3">Comments</h3>
        <div className="space-y-3">
          {comments.map(c => {
            const u = findUser(c.userId);
            return (
              <div key={c.id} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-medium shrink-0">{u?.avatar}</div>
                <div className="flex-1"><div className="text-sm"><span className="font-medium">{u?.name}</span> <span className="text-xs text-muted-foreground">{new Date(c.timestamp).toLocaleString()}</span></div><div className="text-sm text-muted-foreground">{c.text}</div></div>
              </div>
            );
          })}
        </div>
        {showComment && (
          <div className="mt-4 border-t border-border pt-4 animate-slide-up">
            <Textarea rows={3} placeholder="Add a comment…" value={newComment} onChange={e => setNewComment(e.target.value)} />
            <div className="mt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowComment(false)}>Cancel</Button>
              <Button onClick={() => { if (!newComment || !user) return; agentService.addComment("p1", user.id, newComment).then(c => { setComments([...comments, c]); setNewComment(""); setShowComment(false); toast.success("Comment posted"); }); }}>Post Comment</Button>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-[240px] glass border-t border-border p-4 z-20">
        <div className="max-w-[1500px] mx-auto flex flex-wrap gap-2 justify-end">
          <Button variant="ghost" onClick={() => setShowComment(true)}><MessageSquare className="w-4 h-4"/> Add Comment</Button>
          <Button variant="danger" onClick={() => setFlagOpen(true)}><Flag className="w-4 h-4"/> Flag for Revision</Button>
          <Button variant="success" onClick={() => quotationService.approveAgent("q1").then(() => toast.success("Quotation approved"))}><Check className="w-4 h-4"/> Approve Quotation</Button>
        </div>
      </div>

      <Modal open={flagOpen} onClose={() => setFlagOpen(false)} title="Flag for Revision"
        footer={<><Button variant="outline" onClick={() => setFlagOpen(false)}>Cancel</Button>
        <Button variant="danger" onClick={() => { if (!reason) return toast.warning("Reason required"); quotationService.flagAgent("q1", reason).then(() => { toast.success("Quotation flagged"); setFlagOpen(false); setReason(""); }); }}>Flag</Button></>}>
        <Field label="Describe the issue"><Textarea rows={4} value={reason} onChange={e => setReason(e.target.value)} /></Field>
      </Modal>
    </>
  );
}
