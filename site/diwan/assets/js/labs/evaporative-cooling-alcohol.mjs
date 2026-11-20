// تجربة: التبريد بالتبخر — Q = ṁ·L
import { startLab } from "../lab-kit.mjs";

const LAT = { ethanol: 841, water: 2260, acetone: 518, isopropanol: 732 };

export const compute = ({ rate, liquid }) => {
  const L = LAT[liquid] || LAT.ethanol;
  const mdot = rate / 1000 / 60;       // غرام/دقيقة ← كغ/ث
  const q = mdot * L * 1000;           // واط
  return { watts: q, latent: L, grams_hour: rate * 60 };
};

if (typeof document !== "undefined") startLab(compute);
