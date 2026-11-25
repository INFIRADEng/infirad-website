// تجربة: التوصيل أحادي البعد عبر جدار — Q = k·A·ΔT/L
// الحرارة تعبر الجدار بمعدل يتناسب مع الموصولية والمساحة، ويعاكس السماكة.
import { startLab } from "../lab-kit.mjs";
import { readInputs } from "./input-guard.mjs";

// المدى مطابق لضوابط content/experiments/sim-1d-conduction.json؛
// tests/lab-input-validation.test.mjs يقارن الاثنين فيفشل الاختبار إن انحرف أحدهما.
const INPUTS = [
  { id: "k", label: "الموصولية", unit: "W/(m·K)", min: 0.02, max: 400 },
  { id: "area", label: "المساحة", unit: "م²", min: 1, max: 100 },
  { id: "deltaT", label: "فارق الحرارة", unit: "ك", min: 1, max: 100 },
  { id: "length", label: "السماكة", unit: "مم", min: 10, max: 500 },
];

export const compute = (values) => {
  const input = readInputs(values, INPUTS);
  if (input._error) return input;
  const { k, area, deltaT, length } = input;
  const L = length / 1000;              // مم ⇒ م
  const resistance = L / (k * area);    // K/W
  const q = (k * area * deltaT) / L;    // واط
  const flux = q / area;                // W/m²
  return { q, flux, resistance };
};

if (typeof document !== "undefined") startLab(compute);
