// تجربة: تمدد بالون بالحرارة — V ∝ T عند ضغط ثابت
import { startLab } from "../lab-kit.mjs";

startLab(({ temp }) => {
  const t0 = 20, c0 = 30;                    // محيط 30 سم عند 20 °م
  const r0 = c0 / (2 * Math.PI);
  const vRatio = (temp + 273.15) / (t0 + 273.15);
  const r = r0 * Math.cbrt(vRatio);           // نصف القطر ∝ T^(1/3)
  return { circ: 2 * Math.PI * r, kelvin: temp + 273.15, vratio: vRatio };
});
