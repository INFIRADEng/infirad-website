// تجربة: الرطوبة النسبية من ميزان الحرارة الجاف والمبلل
import { startLab } from "../lab-kit.mjs";

const es = (t) => 0.6108 * Math.exp((17.27 * t) / (t + 237.3));

export const compute = ({ twet, tdry = 35 }) => {
  const p = 101.325;
  let e = es(twet) - 0.00066 * (1 + 0.00115 * twet) * p * (tdry - twet);
  if (twet > tdry || e <= 0 || e > es(tdry)) return { _error: 'هذا الزوج من قراءتي الجاف والمبلل غير ممكن ضمن الصيغة والضغط المستخدمين. ارفع حرارة المبلل أو اجعلها دون حرارة الجاف.' };
  const rh = (e / es(tdry)) * 100;
  const lg = Math.log(e / 0.6108);
  return { rh, e: e, esat: es(tdry), dew: (lg * 237.3) / (17.27 - lg) };
};

if (typeof document !== "undefined") startLab(compute);
