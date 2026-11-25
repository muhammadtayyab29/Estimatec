import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { authService } from "@/services";
import { useAuth, homeForRole } from "@/context/AuthContext";
import { Button, Field, Input } from "@/components/shared/Forms";
import { toast } from "sonner";
import { type Role } from "@/data/mockData";

export const Route = createFileRoute("/signup")({ component: SignupPage });

function SignupPage() {
  const { user, signIn } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("agent");
  const [loading, setLoading] = useState(false);

  if (user) return <Link to={homeForRole(user.role)}>Go to Dashboard</Link>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user, token } = await authService.signup(email, password, name, role);
      signIn(user, token);
      toast.success(`Account created! Welcome, ${user.name}`);
      nav({ to: homeForRole(user.role) });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create account");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 grid-bg animate-blueprint opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-transparent to-accent/10" />

      <div className="relative z-10 w-full max-w-md glass rounded-3xl p-8 shadow-2xl animate-slide-up">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">ET</div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Create Account</h1>
          <p className="text-sm text-muted-foreground">Join EstimaTec today</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="Full Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@estimatec.com" required />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" minLength={6} required />
          </Field>
          <Field label="Role">
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value as Role)}
              className="flex h-10 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="admin">Admin</option>
              <option value="estimator">Estimator</option>
              <option value="agent">Agent</option>
            </select>
          </Field>
          <Button type="submit" disabled={loading} className="w-full mt-2" size="lg">
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-5 text-[13px] text-muted-foreground text-center">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
