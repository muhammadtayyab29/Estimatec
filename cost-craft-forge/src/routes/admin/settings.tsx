import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shared/PortalLayout";
import { Button, Field, Input } from "@/components/shared/Forms";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

function SettingsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"profile"|"system"|"api">("profile");
  return (
    <>
      <PageHeader title="Settings" />
      <div className="flex gap-2 border-b border-border mb-6">
        {(["profile","system","api"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 ${tab===t?"border-primary text-primary":"border-transparent text-muted-foreground"}`}>
            {t==="api"?"API Info":t[0].toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>
      {tab==="profile" && <div className="glass rounded-2xl p-6 max-w-lg space-y-4">
        <Field label="Name"><Input defaultValue={user?.name}/></Field>
        <Field label="Email"><Input defaultValue={user?.email} disabled/></Field>
        <Button onClick={() => toast.success("Saved")}>Save</Button>
      </div>}
      {tab==="system" && <div className="glass rounded-2xl p-6 max-w-lg space-y-4">
        <Field label="Platform Name"><Input defaultValue="EstimaTec"/></Field>
        <Field label="Default CCI Region"><Input defaultValue="National Average"/></Field>
        <Button onClick={() => toast.success("System config saved")}>Save</Button>
      </div>}
      {tab==="api" && <div className="glass rounded-2xl p-6 max-w-lg font-mono text-sm space-y-2">
        <div><span className="text-muted-foreground">Base:</span> http://localhost:8000</div>
        <div><span className="text-muted-foreground">WS:</span> ws://localhost:8000</div>
        <div className="flex items-center gap-2 text-[color:var(--success)]"><span className="w-2 h-2 rounded-full bg-[color:var(--success)] animate-pulse"/> Connected</div>
      </div>}
    </>
  );
}
