// تجربة: توازن إشعاعي لكوكب — T = [S(1−a)/(4σε)]^¼
import { startLab } from "../lab-kit.mjs";

const S = 1361;        // W/m² ثابت شمسي
const SIGMA = 5.670374419e-8;

startLab(({ albedo, emissivity }) => {
  const kelvin = ((S * (1 - albedo)) / (4 * SIGMA * emissivity)) ** 0.25;
  return { kelvin, celsius: kelvin - 273.15 };
});
