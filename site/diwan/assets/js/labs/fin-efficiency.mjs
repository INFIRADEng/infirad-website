// تجربة: كفاءة زعنفة مستقيمة — η = tanh(mL)/(mL)
import { startLab } from "../lab-kit.mjs";

const K = 205;      // W/m·K — ألمنيوم
const DT = 50;      // كلفن — فرق الحرارة بين القاعدة والوسط
const WIDTH = 0.2;  // م — عرض الزعنفة

export const compute = ({ length, thick, hcoef }) => {
  const t = thick / 1000;
  const L = length / 1000;
  const m = Math.sqrt((2 * hcoef) / (K * t));   // 1/m — محيط/مساحة ≈ 2/t
  const mL = m * L;
  const eta = mL < 1e-6 ? 1 : Math.tanh(mL) / mL;
  const qIdeal = hcoef * (2 * WIDTH * L) * DT;  // واط لو كانت كلها عند حرارة القاعدة
  return { mL, eta: eta * 100, u: hcoef, q: eta * qIdeal };
};

if (typeof document !== "undefined") startLab(compute);
