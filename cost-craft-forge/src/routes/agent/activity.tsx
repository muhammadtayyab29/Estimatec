import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { activityService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { type Activity, findProject } from "@/data/mockData";
import { PageHeader } from "@/components/shared/PortalLayout";

export const Route = createFileRoute("/agent/activity")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [items, setItems] = useState<Activity[]>([]);
  useEffect(() => { if (user) activityService.byUser(user.id).then(setItems); }, [user]);
  return (
    <>
      <PageHeader title="My Activity" />
      <div className="glass rounded-2xl divide-y divide-border">
        {items.map(a => {
          const p = a.projectId ? findProject(a.projectId) : null;
          return (
            <div key={a.id} className="p-4 flex justify-between items-start">
              <div><div className="text-sm font-medium">{a.action}</div>{p && <div className="text-xs text-muted-foreground">{p.name}</div>}</div>
              <time className="text-xs text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</time>
            </div>
          );
        })}
        {items.length === 0 && <div className="p-8 text-center text-muted-foreground">No activity yet.</div>}
      </div>
    </>
  );
}
