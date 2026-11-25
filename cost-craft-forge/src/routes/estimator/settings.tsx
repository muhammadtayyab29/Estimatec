import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PortalLayout";
import { Field, Input, Button } from "@/components/shared/Forms";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/estimator/settings")({ component: Page });

function Page() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Settings" />
      <div className="glass rounded-2xl p-6 max-w-lg space-y-4">
        <Field label="Name"><Input defaultValue={user?.name} /></Field>
        <Field label="Email"><Input defaultValue={user?.email} disabled /></Field>
        <Field label="New Password"><Input type="password" placeholder="••••••" /></Field>
        <Button onClick={() => toast.success("Saved")}>Save</Button>
      </div>
    </>
  );
}
