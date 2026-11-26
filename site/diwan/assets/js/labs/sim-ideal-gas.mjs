// تجربة: الغاز المثالي — P·V = n·R·T
// الضغط والحجم والحرارة المطلقة مرتبطة بمعادلة واحدة؛ لا يبقى منها شيء حرًّا.
import { startLab } from "../lab-kit.mjs";
import { readInputs } from "./input-guard.mjs";

const R = 8.314; // J/(mol·K)

// المدى مطابق لضوابط content/experiments/sim-ideal-gas.json؛
// الحجم الموجب شرط رياضي في المعادلة، وفارق الحرارة عن الصفر المطلق محجوز بالمدى.
const INPUTS = [
  { id: "moles", label: "عدد المولات", unit: "مول", min: 0.1, max: 5 },
  { id: "liters", label: "الحجم", unit: "لتر", min: 5, max: 100 },
  { id: "tempC", label: "الحرارة", unit: "°م", min: -50, max: 300 },
];

export const compute = (values) => {
  const input = readInputs(values, INPUTS);
  if (input._error) return input;
  const { moles, liters, tempC } = input;
  const T = tempC + 273.15;          // كلفن
  const V = liters / 1000;           // م³
  const pressure = (moles * R * T) / V / 1000; // kPa
  return { pressure, kelvin: T, volume: V };
};

if (typeof document !== "undefined") startLab(compute);
