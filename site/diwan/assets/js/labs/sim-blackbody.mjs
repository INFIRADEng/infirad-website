// تجربة: إشعاع الجسم الأسود — q = ε·σ·A·(T⁴ − T_env⁴)
// كل سطح يشعّ بحسب حرارته المطلقة؛ الصافي هو الفرق بين الصادر والوارد.
import { startLab } from "../lab-kit.mjs";

const SIGMA = 5.670374419e-8; // W/(m²·K⁴)

export const compute = ({ emissivity, area, tempC, envC }) => {
  const T = tempC + 273.15;     // كلفن
  const Tenv = envC + 273.15;
  const qemit = emissivity * SIGMA * area * T ** 4;      // واط صادر
  const qabs = emissivity * SIGMA * area * Tenv ** 4;    // واط وارد
  const q = qemit - qabs;                                // واط صافٍ
  // إشارة الصافي مقصودة: إن كان المحيط أسخن، فالسطح يستقبل أكثر مما يشعّ. الشفافية أن يُقال ذلك لا أن يُقصّ الرقم عند الصفر.
  const warning =
    envC > tempC
      ? "المحيط أسخن من السطح: الصافي سالب، أي أن السطح يستقبل إشعاعًا أكثر مما يشعّ."
      : "";
  return warning ? { q, qemit, qabs, _warning: warning } : { q, qemit, qabs };
};

if (typeof document !== "undefined") startLab(compute);
