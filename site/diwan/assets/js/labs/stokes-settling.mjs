// تجربة: ترسيب ستوكس — كم تستغرق حبة رمل لتهبط القاع؟
// v_t = Δρ · g · d² / (18 μ) — محاكاة تعليمية لا قياس فيزيائي حقيقي.
// g = 9.81 m/s² — OpenStax, College Physics §12.6.

import { startLab } from "../lab-kit.mjs";

const G = 9.81; // m/s²
const FALL = 0.1; // m — ارتفاع النزول (10 سم)
const RE_LIMIT = 0.1; // حدّ صلاحية نموذج ستوكس
const RHO_F = 1000; // kg/m³ — كثافة الماء (20 °م): رقم رينولدز يُحسب بكثافة السائل لا بفرق الكثافة

const compute = ({ particle_d, density_gap, viscosity }) => {
  const d = (particle_d ?? 0) / 1000; // مم → م
  const drho = density_gap ?? 0; // kg/m³
  const mu = (viscosity ?? 0) / 1000; // mPa·s → Pa·s
  const vt = (drho * G * d * d) / (18 * mu); // m/s
  const reynolds = (RHO_F * vt * d) / mu;
  const settling_time = FALL / vt; // s
  const stokes_valid = reynolds < RE_LIMIT ? 1 : 0;
  return {
    terminal_velocity: vt * 1000, // مم/ث
    reynolds,
    settling_time,
    stokes_valid,
    _warning: stokes_valid ? "" : "خارج حدّ ستوكس: Re ≥ 0.1 — السرعة الحقيقية أقل من هذا التقدير",
  };
};

if (typeof document !== "undefined") startLab(compute);
export { compute };
