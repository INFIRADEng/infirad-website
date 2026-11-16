// تجربة: التمدد الحراري — ΔL = α·L·ΔT
import { startLab } from "../lab-kit.mjs";

const ALPHA = { steel: 12e-6, aluminium: 23e-6, concrete: 10e-6 };
const E = { steel: 200e9, aluminium: 69e9, concrete: 30e9 }; // Pa

startLab(({ material, length, deltaT }) => {
  const a = ALPHA[material] ?? ALPHA.steel;
  const dl = a * length * deltaT;              // متر
  const stress = (E[material] ?? E.steel) * a * deltaT / 1e6; // ميجاباسكال لو مُنع التمدد
  return { elongation: dl * 1000, stress };
});
