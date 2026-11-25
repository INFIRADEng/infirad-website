// تجربة: الحرارة الكامنة — Q = m · L
// الطاقة اللازمة لتغيير الطور لا ترفع الحرارة: تُستهلك في كسر الروابط بين الجزيئات.
import { startLab } from "../lab-kit.mjs";
import { readInputs } from "./input-guard.mjs";

// الحرارة الكامنة النوعية لكل مادة (kJ/kg) — قيم مرجعية معيارية
const LATENT = {
  water: { fusion: 334, vaporization: 2260, label: "ماء" },
  ethanol: { fusion: 108, vaporization: 855, label: "إيثانول" },
  nitrogen: { fusion: 25.7, vaporization: 199, label: "نيتروجين" },
};

// المادة والطور يُفحصان كخيارين مغلقين: مادة مجهولة لا تصير ماءً بصمت،
// والطور المكتوب خطأً لا يُحسب انصهارًا بصمت.
const INPUTS = [
  { id: "mass", label: "الكتلة", unit: "كجم", min: 0.1, max: 5 },
  { id: "substance", label: "المادة", choices: Object.keys(LATENT) },
  { id: "phase", label: "الطور", choices: ["fusion", "vaporization"] },
];

export const compute = (values) => {
  const input = readInputs(values, INPUTS);
  if (input._error) return input;
  const { mass, substance, phase } = input;
  const mat = LATENT[substance];
  const L = phase === "vaporization" ? mat.vaporization : mat.fusion;
  const q = mass * L;                 // kJ
  const qJ = q * 1000;                // جول
  // الزمن اللازم عند قدرة تسخين 1000 واط
  const seconds = qJ / 1000;
  return { q, qJ, seconds, L };
};

if (typeof document !== "undefined") startLab(compute);
