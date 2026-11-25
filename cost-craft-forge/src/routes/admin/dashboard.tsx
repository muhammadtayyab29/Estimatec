import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { projectService, userService } from "@/services";
import { type Project, findUser, formatMoney } from "@/data/mockData";
import { StatCard, statusBadge } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PortalLayout";
import { Button } from "@/components/shared/Forms";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Plus, UserPlus, FileText } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({ component: AdminDashboard });

const COLORS = ["oklch(0.38 0.06 55)","oklch(0.58 0.09 55)","oklch(0.68 0.07 70)","oklch(0.55 0.13 130)","oklch(0.45 0.10 30)"];

function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [agents, setAgents] = useState(0);
  useEffect(() => {
    projectService.list().then(setProjects);
    userService.byRole("agent").then((a) => setAgents(a.filter(u => u.status === "Active").length));
  }, []);
  const totalValue = projects.reduce((s, p) => s + (p.estValue ?? 0), 0);
  const completed = projects.filter(p => p.status === "Completed" || p.status === "Approved").length;
  const divChart = [
    { div: "Div 03", value: 46965 }, { div: "Div 04", value: 41250 },
    { div: "Div 05", value: 8854 }, { div: "Div 08", value: 48112 }, { div: "Div 09", value: 57122 },
  ];
  const statusChart = (["Draft","Uploaded","Processing","Completed","Approved"] as const).map((s,i) => ({
    name: s, value: projects.filter(p => p.status === s).length, fill: COLORS[i],
  }));
  return (
    <>
      <PageHeader title="Admin Dashboard" subtitle="System-wide view of EstimaTec activity" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Projects" value={projects.length} />
        <StatCard label="Estimations Run" value={completed} accent="accent" />
        <StatCard label="Active Agents" value={agents} accent="success" />
        <StatCard label="Total Platform Value" value={totalValue} prefix="$" accent="warning" />
      </div>
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <h3 className="font-semibold mb-3">Estimated Cost by CSI Division</h3>
          <div style={{ width:"100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={divChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.025 70)" />
                <XAxis dataKey="div" fontSize={12} /><YAxis fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v:any) => formatMoney(Number(v))} contentStyle={{ borderRadius: 8 }} />
                <Bar dataKey="value" fill="oklch(0.38 0.06 55)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold mb-3">Project Status</h3>
          <div style={{ width:"100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusChart} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {statusChart.map((e,i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-5 overflow-x-auto">
          <h3 className="font-semibold mb-3">Recent Projects</h3>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase">
              <tr className="text-left"><th className="py-2">Project</th><th>Estimator</th><th>Agent</th><th>Status</th><th className="text-right">Est. Value</th></tr>
            </thead>
            <tbody>
              {projects.slice(0,6).map(p => (
                <tr key={p.id} className="border-t border-border/60">
                  <td className="py-2.5 font-medium">{p.name}</td>
                  <td>{findUser(p.estimatorId)?.name}</td>
                  <td>{p.agentId ? findUser(p.agentId)?.name : <span className="text-muted-foreground">—</span>}</td>
                  <td>{statusBadge(p.status)}</td>
                  <td className="text-right font-mono">{formatMoney(p.estValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="glass rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold">Quick Actions</h3>
          <Link to="/admin/projects"><Button className="w-full justify-start"><Plus className="w-4 h-4" /> New Project</Button></Link>
          <Link to="/admin/users"><Button variant="outline" className="w-full justify-start"><UserPlus className="w-4 h-4" /> Invite User</Button></Link>
          <Link to="/admin/quotations"><Button variant="outline" className="w-full justify-start"><FileText className="w-4 h-4" /> View Quotations</Button></Link>
        </div>
      </div>
    </>
  );
}
