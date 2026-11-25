import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { estimationService } from "@/services";
import { pipelineSteps, formatMoney } from "@/data/mockData";
import { PageHeader } from "@/components/shared/PortalLayout";
import { Button } from "@/components/shared/Forms";
import { CSITable } from "@/components/shared/CSITable";
import { toast } from "sonner";
import { Play, Square, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/estimator/estimate")({ component: Page });

function Page() {
  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [showConfetti, setConfetti] = useState(false);
  const ctrl = useRef<{ cancel: () => void } | null>(null);

  const start = () => {
    setActive(-1); setProgress(0); setDone(false);
    ctrl.current = estimationService.run("p1",
      (i, step) => { setActive(i); setProgress(step.progress); },
      () => { setDone(true); setConfetti(true); setTimeout(() => setConfetti(false), 2000); toast.success("Estimation complete"); }
    );
  };
  const cancel = () => { ctrl.current?.cancel(); setActive(-1); setProgress(0); setDone(false); toast.info("Cancelled"); };

  return (
    <>
      <PageHeader title="Run AI Estimation" subtitle="Riverside Office Tower · 10001 (CCI 1.30)"
        actions={done
          ? <Button variant="outline" onClick={start}>Run Again</Button>
          : active < 0
            ? <Button onClick={start}><Play className="w-4 h-4"/> Run Estimation</Button>
            : <Button variant="danger" onClick={cancel}><Square className="w-4 h-4"/> Cancel</Button>} />

      <div className="glass rounded-2xl p-6 mb-6 relative overflow-hidden">
        {showConfetti && [...Array(20)].map((_,i) => (
          <span key={i} className="absolute top-0 animate-confetti" style={{ left: `${5+i*5}%`, color: ["#6B4423","#A0744A","#5A7D3A","#C8841A"][i%4], fontSize: 18 }}>●</span>
        ))}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1.5"><span className="font-medium">Overall Progress</span><span className="font-mono">{progress}%</span></div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500" style={{ width: `${progress}%` }}/></div>
        </div>
        <ol className="space-y-4">
          {pipelineSteps.map((s, i) => {
            const isActive = i === active && !done; const isDone = i < active || done;
            return (
              <li key={i} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 transition ${
                  isDone ? "bg-[color:var(--success)] text-white" :
                  isActive ? "bg-primary text-white animate-pulse-ring" :
                  "bg-secondary text-muted-foreground"}`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5"/> : <span>{s.icon}</span>}
                </div>
                <div className="flex-1 pt-2">
                  <div className={`text-sm font-medium ${isActive || isDone ? "text-foreground" : "text-muted-foreground"}`}>{s.message}</div>
                  {(isActive || isDone) && <div className="text-xs text-muted-foreground mt-0.5">{isDone ? "Completed" : "In progress…"}</div>}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {done && (
        <div className="animate-slide-up">
          <div className="glass rounded-2xl p-6 mb-6 border-2 border-[color:var(--success)]/30">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Quotation Preview</div>
            <div className="text-4xl font-bold text-[color:var(--success)] mt-1 font-mono">{formatMoney(202303)}</div>
            <div className="text-sm text-muted-foreground mt-2">Top items: Slab Concrete, Window Openings, Flooring</div>
          </div>
          <CSITable projectId="p1" />
        </div>
      )}
    </>
  );
}
