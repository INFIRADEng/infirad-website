// تجربة: توصيل الحرارة في قضيب — زمن الانتشار L²/α
import { startLab } from "../lab-kit.mjs";

const MAT = {
  // AHTT 6e Tables A.1–A.2: pure copper/aluminium, 0.5% carbon steel, soda-lime glass.
  copper:     { k: 398,  alpha: 1.157e-4 },
  aluminium:  { k: 237,  alpha: 9.61e-5 },
  steel:      { k: 54,   alpha: 1.47e-5 },
  glass:      { k: 1.1, alpha: 1.1 / (2480 * 750) },
};

export const compute = ({ len, mat }) => {
  const m = MAT[mat] || MAT.steel;
  const L = len / 1000;
  const t = (L * L) / m.alpha;         // رتبة قدر زمن الانتشار
  return { sec: t, mins: t / 60, k: m.k, alpha: m.alpha * 1e6 };
};

if (typeof document !== "undefined") startLab(compute);
