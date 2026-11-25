import { clsx, type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export function useCounter(target: number, duration = 900) {
  // Lightweight animated counter — returns current value
  // (kept local to avoid pulling extra deps)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [v, set] = (require("react") as typeof import("react")).useState(0);
  (require("react") as typeof import("react")).useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      set(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}
