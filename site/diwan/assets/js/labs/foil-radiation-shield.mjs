// تجربة: العزل بورق الألمنيوم — q = ε·σ·A·(T⁴ − T_s⁴)
import { startLab } from "../lab-kit.mjs";

const SIGMA = 5.670374419e-8;

startLab(({ eps, area, temp }) => {
  const T = temp + 273.15, Ts = 25 + 273.15;
  const q = eps * SIGMA * (area / 10000) * (Math.pow(T, 4) - Math.pow(Ts, 4));
  return { watts: q, emissivity: eps, kelvin: T };
});
