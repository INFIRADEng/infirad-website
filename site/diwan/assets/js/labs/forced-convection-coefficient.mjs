// تجربة: معامل الحمل الحراري بالحمل القسري — Dittus–Boelter
// ماء عند 40 °م: ρ = 992 kg/m³ · μ = 0.000653 Pa·s · k = 0.631 W/m·K · Pr = 4.32
import { startLab } from "../lab-kit.mjs";

const RHO = 992, MU = 0.000653, K = 0.631, PR = 4.32;

export const compute = ({ flow, diameter }) => {
  const d = diameter / 1000;
  const area = (Math.PI * d * d) / 4;
  const v = flow / 1000 / area;
  const re = (RHO * v * d) / MU;
  if (re < 10000) return { _error: 'رينولدز أقل من 10,000: علاقة Dittus–Boelter هنا مخصصة للجريان المضطرب المكتمل. زد التدفق أو قلل القطر؛ لا تعرض هذه الصفحة تقديرًا صفحيًا بهذه العلاقة.' };
  const nu = 0.023 * re ** 0.8 * PR ** 0.4;
  const h = (nu * K) / d;           // W/m²·K
  return { velocity: v, reynolds: re, nusselt: nu, u: h, q: h };
};

if (typeof document !== "undefined") startLab(compute);
