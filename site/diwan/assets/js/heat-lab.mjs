import { createGauge } from "./gauge.mjs";

export const WATER_C = 4186; // J/(kg·K) — OpenStax 14.2
export const T_START = 20; // °C
export const SCALE_MAX = 45; // °C — سقف المقياس المرسوم

export function heatWater(massKg, energyKj) {
  const delta = energyKj * 1000 / (massKg * 4186);
  return { delta, temperature: 20 + delta };
}


function bindLab() {
  const mass = document.getElementById("lab-mass");
  if (!mass) return;
  const energy = document.getElementById("lab-energy");
  const massValue = document.getElementById("lab-mass-value");
  const energyValue = document.getElementById("lab-energy-value");
  const deltaValue = document.getElementById("lab-delta");
  const finalValue = document.getElementById("lab-final");

  const gauge = createGauge(document.getElementById("lab-gauge"), {
    min: T_START,
    max: SCALE_MAX,
    unit: "°C",
    start: T_START,
    decimals: 2,
    label: "درجة حرارة الماء — المقياس من 20 إلى 45 °C",
  });

  function update() {
    const { delta, temperature } = heatWater(mass.valueAsNumber, energy.valueAsNumber);
    massValue.value = `${mass.valueAsNumber.toFixed(1)} kg`;
    energyValue.value = `${energy.valueAsNumber} kJ`;
    deltaValue.value = `${delta.toFixed(2)} °C`;
    finalValue.value = `${temperature.toFixed(2)} °C`;
    gauge.set(temperature);
  }

  mass.addEventListener("input", update);
  energy.addEventListener("input", update);
  document.getElementById("lab-reset").addEventListener("click", () => {
    mass.value = mass.defaultValue;
    energy.value = energy.defaultValue;
    update();
  });
  update();
}

if (typeof document !== "undefined") bindLab();
