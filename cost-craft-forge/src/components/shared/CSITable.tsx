import { useEffect, useState } from "react";
import { quotationService } from "@/services";
import { type CSILine, formatMoney } from "@/data/mockData";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function CSITable({ projectId, showChart = true }: { projectId: string; showChart?: boolean }) {
  const [data, setData] = useState<{ lines: CSILine[]; detection: any } | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    quotationService.breakdown(projectId).then(setData);
  }, [projectId]);

  if (!data) return <div className="glass rounded-xl p-8 text-center text-muted-foreground">Loading breakdown…</div>;

  const byDiv = data.lines.reduce<Record<string, CSILine[]>>((acc, l) => {
    (acc[l.division] ||= []).push(l); return acc;
  }, {});
  const total = data.lines.reduce((s, l) => s + l.total, 0);
  const chartData = Object.entries(byDiv).map(([div, ls]) => ({
    div, total: ls.reduce((s, l) => s + l.total, 0),
  }));

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Division / Item</th>
              <th className="text-right px-4 py-3">Qty</th>
              <th className="text-left px-4 py-3">Unit</th>
              <th className="text-right px-4 py-3">Unit Cost</th>
              <th className="text-right px-4 py-3">CCI</th>
              <th className="text-right px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(byDiv).map(([div, lines]) => {
              const subTotal = lines.reduce((s, l) => s + l.total, 0);
              const isOpen = open[div] ?? true;
              return (
                <>
                  <tr key={div} className="bg-secondary/30 cursor-pointer hover:bg-secondary/50"
                      onClick={() => setOpen((s) => ({ ...s, [div]: !isOpen }))}>
                    <td className="px-4 py-2.5 font-medium" colSpan={5}>
                      <span className="inline-block w-4">{isOpen ? "▾" : "▸"}</span> {div}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-semibold">{formatMoney(subTotal)}</td>
                  </tr>
                  {isOpen && lines.map((l, i) => (
                    <tr key={div + i} className="border-t border-border/60">
                      <td className="px-4 py-2.5 pl-10">{l.item}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{l.qty.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{l.unit}</td>
                      <td className="px-4 py-2.5 text-right font-mono">${l.unitCost.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">{l.cci}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{formatMoney(l.total)}</td>
                    </tr>
                  ))}
                </>
              );
            })}
            <tr className="border-t-2 border-primary/40 bg-primary/5">
              <td className="px-4 py-3 font-semibold" colSpan={5}>Grand Total</td>
              <td className="px-4 py-3 text-right font-mono text-lg font-bold text-primary">{formatMoney(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {showChart && (
        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-semibold mb-3">Cost by Division</div>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.025 70)" />
                <XAxis dataKey="div" stroke="oklch(0.50 0.03 55)" fontSize={12} />
                <YAxis stroke="oklch(0.50 0.03 55)" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid oklch(0.88 0.025 70)", borderRadius: 8 }}
                  formatter={(v: any) => formatMoney(Number(v))}
                />
                <Bar dataKey="total" fill="oklch(0.38 0.06 55)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
