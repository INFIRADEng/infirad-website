// تجربة: الغاز المثالي — P = nRT/V
import { startLab } from "../lab-kit.mjs";

const R = 8.314; // J/(mol·K)

export const compute = ({ moles, celsius, liters }) => {
  const kelvin = celsius + 273.15;
  const pascals = (moles * R * kelvin) / (liters / 1000);
  return { pressure: pascals / 1000, kelvin };
};

if (typeof document !== "undefined") startLab(compute);
