// تجربة: الغاز المثالي — P·V = n·R·T
// الضغط والحجم والحرارة المطلقة مرتبطة بمعادلة واحدة؛ لا يبقى منها شيء حرًّا.
import { startLab } from "../lab-kit.mjs";

const R = 8.314; // J/(mol·K)

export const compute = ({ moles, liters, tempC }) => {
  const T = tempC + 273.15;          // كلفن
  const V = liters / 1000;           // م³
  const pressure = (moles * R * T) / V / 1000; // kPa
  return { pressure, kelvin: T, volume: V };
};

if (typeof document !== "undefined") startLab(compute);
