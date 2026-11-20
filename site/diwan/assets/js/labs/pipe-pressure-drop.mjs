// تجربة: هبوط الضغط في أنبوب — دارسي–فايسباخ + سوامي–جاين
import { startLab } from "../lab-kit.mjs";

const RHO = 998;      // kg/m³ — ماء عند 20 °م
const MU = 0.001002;  // Pa·s
const EPS = 0.000045; // m — خشونة الفولاذ التجاري

export const compute = ({ diameter, flow, length }) => {
  const d = diameter / 1000;
  const area = (Math.PI * d * d) / 4;
  const v = flow / 1000 / area;
  const re = (RHO * v * d) / MU;
  const f = re < 2300 ? 64 / re : 0.25 / Math.log10(EPS / (3.7 * d) + 5.74 / re ** 0.9) ** 2;
  const drop = (f * (length / d) * RHO * v * v) / 2 / 1000;
  return { velocity: v, reynolds: re, drop, _warning: re >= 2300 && re < 4000 ? 'جريان انتقالي: قيمة فقد الضغط تقريبية؛ علاقة الاضطراب لا تحسم هذه المنطقة.' : '' };
};

if (typeof document !== "undefined") startLab(compute);
