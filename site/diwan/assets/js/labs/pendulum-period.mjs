// تجربة: زمن البندول البسيط — T = 2π√(L/g)
import { startLab } from "../lab-kit.mjs";

const G = 9.81; // m/s²

startLab(({ length }) => {
  const period = 2 * Math.PI * Math.sqrt(length / G);
  return { period, perMinute: 60 / period };
});
