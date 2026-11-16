// تجربة: قدرة مضخة — P = ρ·g·H·Q/η
import { startLab } from "../lab-kit.mjs";

const RHO = 998, G = 9.81;

startLab(({ flow, head, efficiency }) => {
  const hydraulic = RHO * G * head * (flow / 1000);   // واط
  const shaft = hydraulic / efficiency;
  return { hydraulic: hydraulic / 1000, shaft: shaft / 1000, perM3: shaft / 3600 / (flow / 1000) / 1000 };
});
