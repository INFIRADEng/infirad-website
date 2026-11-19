// تجربة: قانون نيوتن للتبريد — T(t) = T_env + (T0 − T_env)·e^(−kt)
import { startLab } from "../lab-kit.mjs";

startLab(({ k, minutes }) => {
  const T0 = 90, Tenv = 25;
  const T = Tenv + (T0 - Tenv) * Math.exp(-k * minutes);
  return { temp: T, tau: 1 / k, drop: T0 - T, half: Math.log(2) / k };
});
