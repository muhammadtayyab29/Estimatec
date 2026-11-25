import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { agentService } from "@/services";
import { type Comment, findProject, findUser } from "@/data/mockData";
import { PageHeader } from "@/components/shared/PortalLayout";

export const Route = createFileRoute("/agent/notes")({ component: Page });

function Page() {
  const [comments, setComments] = useState<Comment[]>([]);
  useEffect(() => { agentService.comments().then(setComments); }, []);
  const byProject = comments.reduce<Record<string, Comment[]>>((acc, c) => {
    (acc[c.projectId] ||= []).push(c); return acc;
  }, {});
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <>
      <PageHeader title="Notes & Comments" />
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(byProject).map(([pid, cs]) => {
          const last = cs[cs.length-1]; const p = findProject(pid); const isOpen = open[pid];
          return (
            <div key={pid} className="glass rounded-2xl p-5">
              <div className="flex justify-between items-start">
                <div><div className="font-medium">{p?.name}</div><div className="text-xs text-muted-foreground">{cs.length} comment{cs.length>1?"s":""}</div></div>
                <button onClick={() => setOpen({...open, [pid]: !isOpen})} className="text-xs text-accent">{isOpen?"Close":"Open"} Thread</button>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">"{last.text}"</div>
              {isOpen && <div className="mt-4 space-y-3 border-t border-border pt-3">
                {cs.map(c => {
                  const u = findUser(c.userId);
                  return <div key={c.id} className="text-sm"><div className="font-medium">{u?.name} <span className="text-xs text-muted-foreground font-normal">{new Date(c.timestamp).toLocaleString()}</span></div><div className="text-muted-foreground">{c.text}</div></div>;
                })}
              </div>}
            </div>
          );
        })}
      </div>
    </>
  );
}
