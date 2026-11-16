// تجربة: كيف تؤثر الكتلة في تسخين الماء؟
// ميزان طاقة بسيط: Q كله إلى الماء السائل، بلا فقد ولا تغيّر طور.
// c = 4,186 J/(kg·K) — OpenStax, College Physics §14.2.

import { startLab } from "../lab-kit.mjs";

const C_WATER = 4186; // J/(kg·K)
const T_START = 20; // °C — يطابق gauge.start في مواصفة التجربة

startLab(({ mass, energy }) => {
  const dT = (energy * 1000) / (mass * C_WATER);
  return { delta: dT, final: T_START + dT };
});
