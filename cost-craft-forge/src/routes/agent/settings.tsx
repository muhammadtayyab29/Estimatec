import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PortalLayout";
import { Field, Input, Button } from "@/components/shared/Forms";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/agent/settings")({ component: Page });

function Page() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Settings" />
      <div className="glass rounded-2xl p-6 max-w-lg space-y-4">
        <Field label="Name"><Input defaultValue={user?.name} /></Field>
        <Field label="Email"><Input defaultValue={user?.email} disabled /></Field>
        <Field label="Notifications"><label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked/> Email on new assignment</label></Field>
        <Button onClick={() => toast.success("Saved")}>Save</Button>
      </div>
    </>
  );
}
