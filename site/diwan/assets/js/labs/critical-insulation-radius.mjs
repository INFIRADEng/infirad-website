// تجربة: فقد الحرارة من أنبوب معزول — r_cr = k/h
import { startLab } from "../lab-kit.mjs";

const DT = 100;   // كلفن — فرق حرارة الأنبوب والوسط

startLab(({ r1mm, tmm, kc, hcoef }) => {
  const r1 = r1mm / 1000;
  const r2 = (r1mm + tmm) / 1000;
  const rcr = kc / hcoef;                                   // م
  const rCond = Math.log(r2 / r1) / (2 * Math.PI * kc);      // K·m/W
  const rConv = 1 / (2 * Math.PI * r2 * hcoef);              // K·m/W
  const q = DT / (rCond + rConv);                            // واط لكل متر
  return { rcr: rcr * 1000, q, u: hcoef };
});
