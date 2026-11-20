// تجربة: إذابة الجليد — الحرارة الكامنة للانصهار
import { startLab } from "../lab-kit.mjs";

export const compute = ({ mass }) => {
  const m = mass / 1000;                     // كغ
  const qIce = m * 2.05 * 15;                // -15 ← 0 °م
  const qFus = m * 334;                      // الانصهار عند 0 °م
  const qWater = m * 4.18 * 20;              // 0 ← 20 °م
  const total = qIce + qFus + qWater;
  return { total, fusion: qFus, minutes: total / 2.1 / 60 }; // kJ/(kJ/s) gives seconds; convert to minutes
};

if (typeof document !== "undefined") startLab(compute);
