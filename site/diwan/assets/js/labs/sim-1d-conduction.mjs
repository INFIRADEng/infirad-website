// تجربة: التوصيل أحادي البعد عبر جدار — Q = k·A·ΔT/L
// الحرارة تعبر الجدار بمعدل يتناسب مع الموصولية والمساحة، ويعاكس السماكة.
import { startLab } from "../lab-kit.mjs";

export const compute = ({ k, area, deltaT, length }) => {
  const L = length / 1000;              // مم ⇒ م
  const resistance = L / (k * area);    // K/W
  const q = (k * area * deltaT) / L;    // واط
  const flux = q / area;                // W/m²
  return { q, flux, resistance };
};

if (typeof document !== "undefined") startLab(compute);
