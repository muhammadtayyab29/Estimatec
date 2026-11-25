import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { activityService } from "@/services";
import { type Activity, findUser, findProject } from "@/data/mockData";
import { PageHeader } from "@/components/shared/PortalLayout";
import { Badge } from "@/components/shared/StatCard";
import { Input, Select } from "@/components/shared/Forms";

export const Route = createFileRoute("/admin/activity")({ component: ActivityLog });

function ActivityLog() {
  const [items, setItems] = useState<Activity[]>([]);
  const [filter, setFilter] = useState("all"); const [search, setSearch] = useState("");
  useEffect(() => { activityService.list().then(setItems); }, []);
  const filtered = useMemo(() => items.filter(a => {
    const u = findUser(a.userId); const p = a.projectId ? findProject(a.projectId) : null;
    const s = (u?.name + " " + a.action + " " + (p?.name??"")).toLowerCase();
    return (filter==="all"||a.role===filter) && s.includes(search.toLowerCase());
  }), [items, filter, search]);
  return (
    <>
      <PageHeader title="Activity Log" />
      <div className="glass rounded-2xl p-4 mb-4 flex flex-wrap gap-3">
        <Input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} className="max-w-sm"/>
        <Select value={filter} onChange={e=>setFilter(e.target.value)} className="max-w-[200px]">
          <option value="all">All</option><option value="admin">Admin</option><option value="estimator">Estimator</option><option value="agent">Agent</option>
        </Select>
      </div>
      <div className="glass rounded-2xl divide-y divide-border">
        {filtered.map(a => {
          const u = findUser(a.userId); const p = a.projectId ? findProject(a.projectId) : null;
          return (
            <div key={a.id} className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">{u?.avatar}</div>
              <div className="flex-1"><div className="text-sm"><span className="font-medium">{u?.name}</span> <Badge variant={a.role==="admin"?"purple":a.role==="estimator"?"blue":"teal"}>{a.role}</Badge></div>
                <div className="text-sm text-muted-foreground">{a.action}{p && <> · {p.name}</>}</div></div>
              <time className="text-xs text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</time>
            </div>
          );
        })}
      </div>
    </>
  );
}
