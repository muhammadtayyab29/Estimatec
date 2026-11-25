import { createFileRoute, useNavigate, Navigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { authService } from "@/services";
import { useAuth, homeForRole } from "@/context/AuthContext";
import { Button, Field, Input } from "@/components/shared/Forms";
import { toast } from "sonner";
import { demoCreds, type Role } from "@/data/mockData";
import { Shield, Ruler, Handshake } from "lucide-react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { user, signIn } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={homeForRole(user.role)} />;

  const fillDemo = (role: Role) => {
    setEmail(demoCreds[role].email);
    setPassword(demoCreds[role].password);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user, token } = await authService.login(email, password);
      signIn(user, token);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      nav({ to: homeForRole(user.role) });
    } catch {
      toast.error("Invalid email or password");
    } finally { setLoading(false); }
  };

  const pills: { role: Role; label: string; icon: React.ReactNode; cls: string }[] = [
    { role: "admin", label: "Admin", icon: <Shield className="w-4 h-4" />, cls: "gradient-admin" },
    { role: "estimator", label: "Estimator", icon: <Ruler className="w-4 h-4" />, cls: "gradient-estimator" },
    { role: "agent", label: "Agent", icon: <Handshake className="w-4 h-4" />, cls: "gradient-agent" },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 grid-bg animate-blueprint opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-transparent to-accent/10" />

      <div className="relative z-10 w-full max-w-md glass rounded-3xl p-8 shadow-2xl animate-slide-up">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">ET</div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">EstimaTec</h1>
          <p className="text-sm text-muted-foreground">AI-powered construction cost estimation</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {pills.map((p) => (
            <button key={p.role} type="button" onClick={() => fillDemo(p.role)}
              className={`${p.cls} text-white rounded-xl p-2.5 flex flex-col items-center gap-1 text-xs font-medium hover:opacity-90 transition`}>
              {p.icon}
              {p.label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@estimatec.com" required />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required />
          </Field>
          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "Sign In"}
          </Button>
        </form>

        <div className="mt-5 text-[13px] text-muted-foreground text-center">
          Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign Up</Link>
        </div>

        <div className="mt-3 text-[11px] text-muted-foreground text-center">
          Demo credentials: pick a role pill above to auto-fill.
        </div>
      </div>
    </div>
  );
}
