// تجربة: الرطوبة النسبية من ميزان الحرارة الجاف والمبلل
import { startLab } from "../lab-kit.mjs";

const es = (t) => 0.6108 * Math.exp((17.27 * t) / (t + 237.3));

startLab(({ twet, tdry }) => {
  const p = 101.325;
  let e = es(twet) - 0.00066 * (1 + 0.00115 * twet) * p * (tdry - twet);
  if (e < 0) e = 0;
  const rh = (e / es(tdry)) * 100;
  const lg = Math.log(e / 0.6108);
  return { rh: Math.min(rh, 100), e: e, esat: es(tdry), dew: (lg * 237.3) / (17.27 - lg) };
});
