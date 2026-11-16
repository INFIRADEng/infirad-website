// تجربة: فقد الحرارة عبر جدار — Q = U·A·ΔT
import { startLab } from "../lab-kit.mjs";

const R_FIXED = 0.06 + 0.147 + 0.05; // جبس + طوب + حجر: m²·K/W
const K_INSUL = 0.04;                // صوف صخري

startLab(({ insulation, area, deltaT }) => {
  const u = 1 / (R_FIXED + insulation / 1000 / K_INSUL);
  const q = u * area * deltaT;      // واط
  return { u, q, daily: (q * 24) / 1000 };
});
