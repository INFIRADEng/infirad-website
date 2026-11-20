// تجربة: تصريف فتحة قياس — Q = Cd·A·√(2Δp/ρ)
import { startLab } from "../lab-kit.mjs";

const RHO = 998;   // kg/m³ — ماء عند 20 °م
const CD = 0.62;   // معامل التصريف لفتحة حادة الحواف

export const compute = ({ bore, dp }) => {
  const d = bore / 1000;
  const a0 = (Math.PI * d * d) / 4;         // مساحة الفتحة م²
  const p = dp * 1000;                      // باسكال
  const v = Math.sqrt((2 * p) / RHO);       // سرعة الجريان في الفتحة
  const qm3 = CD * a0 * v;                  // m³/s
  return { velocity: v, drop: dp, flow: qm3 * 1000 };
};

if (typeof document !== "undefined") startLab(compute);
