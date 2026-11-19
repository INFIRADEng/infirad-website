// تجربة: الحمل الطبيعي — Nu = 0.59·Ra^(1/4)
import { startLab } from "../lab-kit.mjs";

startLab(({ dT, height, fluid }) => {
  const isWater = fluid < 0.5;
  const k = isWater ? 0.598 : 0.026;
  const nu = isWater ? 1.0e-6 : 1.9e-5;
  const alpha = isWater ? 2.2e-7 : 2.2e-5;
  const tMean = 32.5 + 273.15;
  const beta = 1 / tMean;
  const H = height / 100;
  const ra = (9.81 * beta * Math.abs(dT) * Math.pow(H, 3)) / (nu * alpha);
  const nuNum = ra > 1e4 ? 0.59 * Math.pow(ra, 0.25) : 1;
  return { h: (nuNum * k) / H, ra: ra, nunum: nuNum, rise: Math.sqrt(9.81 * beta * Math.abs(dT) * H) };
});
