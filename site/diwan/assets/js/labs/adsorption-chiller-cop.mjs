// تجربة: دورة تبريد بالامتزاز — حرارة 85 °م تنتج برودة، بلا ضاغط
import { startLab } from "../lab-kit.mjs";

const H_FG = 2489;   // kJ/kg تبخّر الماء عند 5 °م
const H_ADS = 3200;  // kJ/kg حرارة امتزاز عكسية على السيليكا جل
const CP_BED = 0.92; // kJ/(kg·K)

export const compute = ({ loading, desorb }) => {
  const qEvap = loading * H_FG;                     // برودة منتجة لكل كجم مادة
  const qIn = loading * H_ADS + CP_BED * (desorb - 35);
  return { cop: qEvap / qIn, cooling: qEvap };
};

if (typeof document !== "undefined") startLab(compute);
