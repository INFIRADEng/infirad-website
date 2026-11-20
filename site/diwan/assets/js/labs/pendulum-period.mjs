// تجربة: زمن البندول البسيط — T = 2π√(L/g)
import { startLab } from "../lab-kit.mjs";

const G = 9.81; // m/s²

export const compute = ({ length }) => {
  const period = 2 * Math.PI * Math.sqrt(length / G);
  return { period, perMinute: 60 / period };
};

if (typeof document !== "undefined") startLab(compute);
