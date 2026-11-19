// تجربة: حرارة الخليط — ميزان الطاقة
import { startLab } from "../lab-kit.mjs";

startLab(({ m1, t1 }) => {
  const m2 = 250, t2 = 20, c = 4.18;          // كتلة ثانية الماء البارد
  const T = (m1 * c * t1 + m2 * c * t2) / (m1 * c + m2 * c);
  return { mix: T, shift: T - t2, m2: m2 };
});
