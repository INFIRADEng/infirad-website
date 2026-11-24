// تجربة: فرق الحرارة الوسطي اللوغاريتمي — Q = U·A·LMTD
// في المبادل يتبدّل فرق الحرارة على طول المسار، فالمتوسط الحسابي يبالغ في القدرة.
import { startLab } from "../lab-kit.mjs";

export const compute = ({ thi, tho, tci, tco, u, area }) => {
  // مبادل معاكس الجريان: الطرفان عند المدخل والمخرج
  const dT1 = thi - tco;
  const dT2 = tho - tci;
  // فرقان متساويان ⇒ النهاية اللوغاريتمية غير معرّفة، والقيمة الحدّية = dT1
  const lmtd = Math.abs(dT1 - dT2) < 1e-9 ? dT1 : (dT1 - dT2) / Math.log(dT1 / dT2);
  const duty = (u * area * lmtd) / 1000;   // kW
  return { dT1, dT2, lmtd, duty };
};

if (typeof document !== "undefined") startLab(compute);
