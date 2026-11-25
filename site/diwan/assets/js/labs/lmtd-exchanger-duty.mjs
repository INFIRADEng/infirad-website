// تجربة: حمل المبادل من فرق الحرارة اللوغاريتمي — Q = U·A·LMTD
import { startLab } from "../lab-kit.mjs";
import { readInputs } from "./input-guard.mjs";

// المدى مطابق لضوابط content/experiments/lmtd-exchanger-duty.json؛
// الفحص هنا وقت الحساب لا وقت البناء، لأن الصفحة المنشورة تُقبل فيها قيم من خارج الحقول.
const INPUTS = [
  { id: "thi", label: "حرارة دخول الساخن", unit: "°م", min: 120, max: 180 },
  { id: "tho", label: "حرارة خروج الساخن", unit: "°م", min: 60, max: 110 },
  { id: "tci", label: "حرارة دخول البارد", unit: "°م", min: 10, max: 35 },
  { id: "tco", label: "حرارة خروج البارد", unit: "°م", min: 40, max: 70 },
  { id: "area", label: "مساحة التبادل", unit: "م²", min: 2, max: 40 },
  { id: "ucoef", label: "معامل الانتقال الكلي U", unit: "واط/م²·ك", min: 200, max: 900 },
];

export const compute = (values) => {
  const input = readInputs(values, INPUTS);
  if (input._error) return input;
  const { thi, tho, tci, tco, area, ucoef } = input;
  const dT1 = thi - tco;            // طرف ساخن الدخول مقابل بارد الخروج
  const dT2 = tho - tci;            // ساخن الخروج مقابل بارد الدخول
  if (dT1 <= 0 || dT2 <= 0 || thi < tho || tco < tci) return { _error: 'ترتيب درجات الحرارة غير صالح لمبادل معاكس ينقل الحرارة من الساخن إلى البارد. يلزم فرق موجب عند الطرفين.' };
  const near = Math.abs(dT1 - dT2) < 1e-6;
  const dTlm = near ? dT1 : (dT1 - dT2) / Math.log(dT1 / dT2);
  const qW = ucoef * area * dTlm;   // واط
  return { dT1, dT2, dTlm, u: ucoef, q: qW, duty: qW / 1000 };
};

if (typeof document !== "undefined") startLab(compute);
