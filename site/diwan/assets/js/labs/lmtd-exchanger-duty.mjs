// تجربة: حمل المبادل من فرق الحرارة اللوغاريتمي — Q = U·A·LMTD
import { startLab } from "../lab-kit.mjs";

startLab(({ thi, tho, tci, tco, area, ucoef }) => {
  const dT1 = thi - tco;            // طرف ساخن الدخول مقابل بارد الخروج
  const dT2 = tho - tci;            // ساخن الخروج مقابل بارد الدخول
  const near = Math.abs(dT1 - dT2) < 1e-6;
  const dTlm = near ? dT1 : (dT1 - dT2) / Math.log(dT1 / dT2);
  const qW = ucoef * area * dTlm;   // واط
  return { dT1, dT2, dTlm, u: ucoef, q: qW, duty: qW / 1000 };
});
