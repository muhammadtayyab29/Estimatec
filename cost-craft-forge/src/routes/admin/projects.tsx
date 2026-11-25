import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { projectService, cciService, userService } from "@/services";
import { type Project, type User, findUser, formatMoney } from "@/data/mockData";
import { PageHeader } from "@/components/shared/PortalLayout";
import { statusBadge } from "@/components/shared/StatCard";
import { Button, Field, Input, Select, Textarea } from "@/components/shared/Forms";
import { Modal } from "@/components/shared/Modal";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Plus, Trash2, Eye, Pencil } from "lucide-react";

export const Route = createFileRoute("/admin/projects")({ component: AllProjects });

function AllProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newOpen, setNewOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState<Project | null>(null);
  const reload = () => projectService.list().then(setProjects);
  useEffect(() => { reload(); }, []);
  const filtered = useMemo(() => projects.filter(p =>
    (statusFilter === "all" || p.status === statusFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase()))
  ), [projects, search, statusFilter]);
  const del = (id: string) => { if (confirm("Delete?")) projectService.delete(id).then(() => { toast.success("Deleted"); reload(); }); };
  return (
    <>
      <PageHeader title="All Projects" actions={<Button onClick={() => setNewOpen(true)}><Plus className="w-4 h-4"/> New Project</Button>} />
      <div className="glass rounded-2xl p-4 mb-4 flex flex-wrap gap-3">
        <Input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="max-w-[180px]">
          <option value="all">All statuses</option>
          {["Draft","Uploaded","Processing","Completed","Approved"].map(s => <option key={s}>{s}</option>)}
        </Select>
      </div>
      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
            <tr className="text-left"><th className="px-4 py-3">Project</th><th>Zip</th><th>Estimator</th><th>Agent</th><th>Status</th><th className="text-right">Value</th><th className="text-right pr-4">Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-t border-border/60">
                <td className="px-4 py-3 font-medium">{p.name}<div className="text-xs text-muted-foreground">{p.client}</div></td>
                <td className="font-mono">{p.zip}</td>
                <td>{findUser(p.estimatorId)?.name}</td>
                <td>{p.agentId ? findUser(p.agentId)?.name : <span className="text-muted-foreground">—</span>}</td>
                <td>{statusBadge(p.status)}</td>
                <td className="text-right font-mono">{formatMoney(p.estValue)}</td>
                <td className="text-right pr-4">
                  <Link to="/admin/quotations"><Button size="sm" variant="ghost"><Eye className="w-3.5 h-3.5"/></Button></Link>
                  <Button size="sm" variant="ghost" onClick={() => setAssignOpen(p)}><Pencil className="w-3.5 h-3.5"/></Button>
                  <Button size="sm" variant="ghost" onClick={() => del(p.id)}><Trash2 className="w-3.5 h-3.5"/></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <NewProjectModal open={newOpen} onClose={() => setNewOpen(false)} onCreated={() => { reload(); setNewOpen(false); }} />
      <AssignModal project={assignOpen} onClose={() => setAssignOpen(null)} onSaved={() => { reload(); setAssignOpen(null); }} />
    </>
  );
}
function NewProjectModal({ open, onClose, onCreated }: any) {
  const { user: currentUser } = useAuth();
  const [f, setF] = useState({ name: "", client: "", zip: "", estimatorId: "", agentId: "", description: "" });
  const [cci, setCci] = useState<number | null>(null);
  const [estimators, setEstimators] = useState<User[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Load real users from the backend when the modal opens
  useEffect(() => {
    if (!open) return;
    userService.byRole("estimator").then((data: any) => setEstimators(data ?? []));
    userService.byRole("agent").then((data: any) => setAgents(data ?? []));
  }, [open]);

  // Default estimatorId to the current logged-in user's real UUID
  useEffect(() => {
    if (currentUser?.id) setF(prev => ({ ...prev, estimatorId: currentUser.id }));
  }, [currentUser]);

  useEffect(() => { if (f.zip.length >= 5) cciService.factor(f.zip).then(setCci); }, [f.zip]);

  const handleCreate = async () => {
    if (!f.name.trim() || !f.client.trim() || !f.zip.trim()) {
      toast.error("Name, Client, and Zip are required.");
      return;
    }
    if (!f.estimatorId) {
      toast.error("Please select an estimator.");
      return;
    }
    setLoading(true);
    try {
      await projectService.create({ ...f, agentId: f.agentId || null });
      toast.success("Project created successfully!");
      setF({ name: "", client: "", zip: "", estimatorId: currentUser?.id ?? "", agentId: "", description: "" });
      onCreated();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to create project. Please check the details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="New Project"
      footer={<><Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
      <Button onClick={handleCreate} disabled={loading}>{loading ? "Creating…" : "Create"}</Button></>}>
      <div className="space-y-3">
        <Field label="Name"><Input value={f.name} onChange={e => setF({...f, name: e.target.value})}/></Field>
        <Field label="Client"><Input value={f.client} onChange={e => setF({...f, client: e.target.value})}/></Field>
        <Field label="Zip" hint={cci ? `CCI: ${cci}` : ""}><Input value={f.zip} onChange={e => setF({...f, zip: e.target.value})}/></Field>
        <Field label="Estimator">
          <Select value={f.estimatorId} onChange={e => setF({...f, estimatorId: e.target.value})}>
            <option value="">— Select Estimator —</option>
            {estimators.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </Select>
        </Field>
        <Field label="Agent">
          <Select value={f.agentId} onChange={e => setF({...f, agentId: e.target.value})}>
            <option value="">— Unassigned —</option>
            {agents.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </Select>
        </Field>
        <Field label="Description"><Textarea rows={3} value={f.description} onChange={e => setF({...f, description: e.target.value})}/></Field>
      </div>
    </Modal>
  );
}
function AssignModal({ project, onClose, onSaved }: any) {
  const [agentId, setAgentId] = useState("");
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => { setAgentId(project?.agentId || ""); }, [project]);
  useEffect(() => {
    if (project) userService.byRole("agent").then((data: any) => setAgents(data ?? []));
  }, [project]);
  if (!project) return null;
  return (
    <Modal open={!!project} onClose={onClose} title={`Assign Agent — ${project.name}`}
      footer={<><Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
      <Button disabled={loading} onClick={async () => {
        setLoading(true);
        try {
          await projectService.assignAgent(project.id, agentId || null);
          toast.success("Agent assigned!");
          onSaved();
        } catch (err: any) {
          toast.error(err?.message ?? "Failed to assign agent.");
        } finally { setLoading(false); }
      }}>{loading ? "Saving…" : "Save"}</Button></>}>
      <Field label="Agent">
        <Select value={agentId} onChange={e => setAgentId(e.target.value)}>
          <option value="">— Unassigned —</option>
          {agents.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </Select>
      </Field>
    </Modal>
  );
}
