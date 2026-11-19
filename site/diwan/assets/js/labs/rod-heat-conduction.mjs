// تجربة: توصيل الحرارة في قضيب — زمن الانتشار L²/α
import { startLab } from "../lab-kit.mjs";

const MAT = {
  copper:     { k: 401,  alpha: 1.17e-4 },
  aluminium:  { k: 237,  alpha: 9.7e-5 },
  steel:      { k: 50,   alpha: 4.5e-5 },
  glass:      { k: 1.05, alpha: 8.0e-6 },
};

startLab(({ len, mat }) => {
  const m = MAT[mat] || MAT.steel;
  const L = len / 1000;
  const t = (L * L) / m.alpha;         // رتبة قدر زمن الانتشار
  return { sec: t, mins: t / 60, k: m.k, alpha: m.alpha * 1e6 };
});
