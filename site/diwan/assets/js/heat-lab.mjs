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
  const meter = document.getElementById("lab-meter");

  function update() {
    const { delta, temperature } = heatWater(mass.valueAsNumber, energy.valueAsNumber);
    massValue.value = `${mass.valueAsNumber.toFixed(1)} kg`;
    energyValue.value = `${energy.valueAsNumber} kJ`;
    deltaValue.value = `${delta.toFixed(2)} °C`;
    finalValue.value = `${temperature.toFixed(2)} °C`;
    meter.value = temperature;
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
