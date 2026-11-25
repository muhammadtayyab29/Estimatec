import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { userService } from "@/services";
import { type User, type Role } from "@/data/mockData";
import { PageHeader } from "@/components/shared/PortalLayout";
import { Badge } from "@/components/shared/StatCard";
import { Button, Field, Input, Select } from "@/components/shared/Forms";
import { Modal } from "@/components/shared/Modal";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/admin/users")({ component: UsersPage });

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const reload = () => userService.list().then(setUsers);
  useEffect(() => { reload(); }, []);
  return (
    <>
      <PageHeader title="User Management" actions={<Button onClick={() => setOpen(true)}><UserPlus className="w-4 h-4"/> Invite</Button>} />
      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
            <tr className="text-left"><th className="px-4 py-3">User</th><th>Email</th><th>Role</th><th>Status</th><th className="text-right pr-4">Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className={`border-t border-border/60 ${u.status==="Inactive"?"opacity-50":""}`}>
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="text-xs text-muted-foreground">{u.email}</td>
                <td><Badge variant={u.role==="admin"?"purple":u.role==="estimator"?"blue":"teal"}>{u.role}</Badge></td>
                <td><Badge variant={u.status==="Active"?"green":"gray"}>{u.status}</Badge></td>
                <td className="text-right pr-4">
                  <Button size="sm" variant="outline" onClick={() => userService.toggleStatus(u.id).then(() => { toast.success("Updated"); reload(); })}>{u.status==="Active"?"Deactivate":"Activate"}</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <InviteModal open={open} onClose={() => setOpen(false)} onDone={() => { reload(); setOpen(false); }} />
    </>
  );
}
function InviteModal({ open, onClose, onDone }: any) {
  const [email, setEmail] = useState(""); const [role, setRole] = useState<Role>("estimator");
  return (
    <Modal open={open} onClose={onClose} title="Invite User"
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button>
      <Button onClick={() => { if (!email) return toast.warning("Email required"); userService.invite(email, role).then(() => { toast.success("Invited"); setEmail(""); onDone(); }); }}>Send</Button></>}>
      <div className="space-y-3">
        <Field label="Email"><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label="Role"><Select value={role} onChange={e => setRole(e.target.value as Role)}>
          <option value="admin">Admin</option><option value="estimator">Estimator</option><option value="agent">Agent</option>
        </Select></Field>
      </div>
    </Modal>
  );
}
