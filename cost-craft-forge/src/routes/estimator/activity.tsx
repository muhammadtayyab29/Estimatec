import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { activityService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { type Activity, findUser, findProject } from "@/data/mockData";
import { PageHeader } from "@/components/shared/PortalLayout";

export const Route = createFileRoute("/estimator/activity")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [items, setItems] = useState<Activity[]>([]);
  useEffect(() => { if (user) activityService.byUser(user.id).then(setItems); }, [user]);
  return (
    <>
      <PageHeader title="My Activity" />
      <div className="glass rounded-2xl divide-y divide-border">
        {items.map(a => {
          const u = findUser(a.userId); const p = a.projectId ? findProject(a.projectId) : null;
          return (
            <div key={a.id} className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">{u?.avatar}</div>
              <div className="flex-1"><div className="text-sm font-medium">{a.action}</div>{p && <div className="text-xs text-muted-foreground">{p.name}</div>}</div>
              <time className="text-xs text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</time>
            </div>
          );
        })}
        {items.length === 0 && <div className="p-8 text-center text-muted-foreground">No activity yet.</div>}
      </div>
    </>
  );
}
