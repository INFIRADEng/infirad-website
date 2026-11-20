// تجربة: الحمل الطبيعي — Nu = 0.59·Ra^(1/4)
import { startLab } from "../lab-kit.mjs";

export const compute = ({ dT, height, fluid }) => {
  const isWater = fluid === 'water';
  // Lienhard & Lienhard, AHTT 6e, Table A.3 (water at 305 K)
  // and Example 8.1 (air at 308 K). Fixed reference properties, not a property solver.
  const k = isWater ? 0.6184 : 0.02672;
  const nu = isWater ? 7.708e-7 : 1.643e-5;
  const alpha = isWater ? 1.487e-7 : 2.315e-5;
  const beta = isWater ? 0.000319 : 1 / 308;
  const pr = isWater ? 5.18 : 0.710;
  const H = height / 100;
  const ra = (9.81 * beta * Math.abs(dT) * Math.pow(H, 3)) / (nu * alpha);
  // This deliberately bounded laminar correlation is not extrapolated into turbulence.
  if (ra <= 0 || ra > 1e9) return { _error: 'رقم رالي خارج مجال العلاقة الصفحية المختارة (حتى 10⁹). غيّر الارتفاع أو فرق الحرارة؛ لا يستنتج النموذج معامل حمل مضطربًا من علاقة صفحية.' };
  // Churchill–Chu laminar vertical plate, AHTT Eq. (8.13a).
  const nuNum = 0.68 + 0.670 * ra ** 0.25 / (1 + (0.492 / pr) ** (9 / 16)) ** (4 / 9);
  return { h: (nuNum * k) / H, ra, nunum: nuNum, rise: Math.sqrt(9.81 * beta * Math.abs(dT) * H) };
};

if (typeof document !== "undefined") startLab(compute);
