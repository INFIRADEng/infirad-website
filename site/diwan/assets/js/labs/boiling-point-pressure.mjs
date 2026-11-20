// تجربة: درجة الغليان مقابل الضغط — معادلة أنطوان للماء
import { startLab } from "../lab-kit.mjs";

// log10(P mmHg) = 8.07131 − 1730.63 / (233.426 + T °C)
function boilingPoint(pressureKpa) {
  const mmhg = pressureKpa * 7.50062;
  let lo = 1, hi = 374;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const p = 10 ** (8.07131 - 1730.63 / (233.426 + mid));
    if (p < mmhg) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

export const compute = ({ pressure }) => {
  const t = boilingPoint(pressure);
  return { boil: t, drop: 100 - t };
};

if (typeof document !== "undefined") startLab(compute);
