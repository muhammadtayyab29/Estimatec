import { useEffect, useState } from "react";

export function AnimatedNumber({ value, prefix = "", suffix = "", duration = 900 }: {
  value: number; prefix?: string; suffix?: string; duration?: number;
}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setV(value * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return (
    <span className="font-mono tabular-nums">
      {prefix}{Math.round(v).toLocaleString()}{suffix}
    </span>
  );
}

export function StatCard({
  label, value, prefix, suffix, accent = "primary",
}: {
  label: string; value: number; prefix?: string; suffix?: string;
  accent?: "primary" | "accent" | "success" | "warning" | "destructive";
}) {
  const ring = {
    primary: "ring-primary/20", accent: "ring-accent/30",
    success: "ring-[color:var(--success)]/30",
    warning: "ring-[color:var(--warning)]/30",
    destructive: "ring-destructive/30",
  }[accent];
  return (
    <div className={`glass rounded-2xl p-5 ring-1 ${ring} animate-fade-in`}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-foreground">
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </div>
    </div>
  );
}

export function Badge({
  children, variant = "default",
}: { children: React.ReactNode; variant?: "default" | "amber" | "teal" | "green" | "red" | "blue" | "purple" | "gray" }) {
  const map: Record<string, string> = {
    default: "bg-secondary text-secondary-foreground",
    amber:   "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
    teal:    "bg-[color:var(--agent)]/20 text-[color:var(--agent)]",
    green:   "bg-[color:var(--success)]/15 text-[color:var(--success)]",
    red:     "bg-destructive/15 text-destructive",
    blue:    "bg-[color:var(--estimator)]/15 text-[color:var(--estimator)]",
    purple:  "bg-[color:var(--admin)]/15 text-[color:var(--admin)]",
    gray:    "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[variant]}`}>
      {children}
    </span>
  );
}

export function statusBadge(status: string) {
  const m: Record<string, "amber"|"teal"|"green"|"red"|"blue"|"gray"|"purple"|"default"> = {
    "Draft": "gray", "Uploaded": "blue", "Processing": "amber",
    "Completed": "teal", "Approved": "green",
    "Pending Review": "amber", "Agent Approved": "teal", "Admin Approved": "green",
    "Flagged": "red", "Rejected": "red", "Pending": "gray",
    "Awaiting Estimator Fix": "amber", "Resubmitted": "blue", "Resolved": "green",
    "Active": "green", "Inactive": "gray",
    "No Quotation Yet": "gray",
  };
  return <Badge variant={m[status] ?? "default"}>{status}</Badge>;
}
