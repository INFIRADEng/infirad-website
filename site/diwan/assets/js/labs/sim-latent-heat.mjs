// تجربة: الحرارة الكامنة — Q = m · L
// الطاقة اللازمة لتغيير الطور لا ترفع الحرارة: تُستهلك في كسر الروابط بين الجزيئات.
import { startLab } from "../lab-kit.mjs";

// الحرارة الكامنة النوعية لكل مادة (kJ/kg) — قيم مرجعية معيارية
const LATENT = {
  water: { fusion: 334, vaporization: 2260, label: "ماء" },
  ethanol: { fusion: 108, vaporization: 855, label: "إيثانول" },
  nitrogen: { fusion: 25.7, vaporization: 199, label: "نيتروجين" },
};

export const compute = ({ mass, substance, phase }) => {
  const mat = LATENT[substance] ?? LATENT.water;
  const L = phase === "vaporization" ? mat.vaporization : mat.fusion;
  const q = mass * L;                 // kJ
  const qJ = q * 1000;                // جول
  // الزمن اللازم عند قدرة تسخين 1000 واط
  const seconds = qJ / 1000;
  return { q, qJ, seconds, L };
};

if (typeof document !== "undefined") startLab(compute);
