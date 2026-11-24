// تجربة: الحمل الحراري الطبيعي — Ra = g·β·ΔT·L³/(ν·α) ، h من Nu
// المائع القريب من السطح الساخن يخفّ فيصعد، ويحلّ محله بارد: الحمل يبدأ من فرق كثافة.
import { startLab } from "../lab-kit.mjs";

const G = 9.81;          // م/ث²
const BETA = 1 / 300;    // 1/K — تقريب الغاز المثالي عند ~300 كلفن
const NU = 1.57e-5;      // م²/ث — لزوجة الهواء الحركية
const ALPHA = 2.22e-5;   // م²/ث — الانتشارية الحرارية للهواء
const K_AIR = 0.0263;    // W/(m·K)

export const compute = ({ dT, length }) => {
  const L = length / 1000;                       // مم ⇒ م
  const ra = (G * BETA * dT * L ** 3) / (NU * ALPHA);
  // صفيحة رأسية: Nu = 0.59·Ra^(1/4) للجريان الصفحي (10^4 < Ra < 10^9)
  const nusselt = 0.59 * Math.pow(Math.max(ra, 1), 0.25);
  const h = (nusselt * K_AIR) / L;               // W/(m²·K)
  const flux = h * dT;                           // W/m²
  // حدود الارتباط: لا يمثّل النموذج جريانًا مضطربًا ولا هواءً ساكنًا، ولا يُعرض رقم خارج مداه كأنه قياس.
  const warning =
    ra < 1e4
      ? "رقم رايلي أقل من 10⁴: الهواء حول السطح شبه ساكن، والارتباط الصفحي خارج مداه — الرقم استقراء لا قياس."
      : ra > 1e9
        ? "رقم رايلي فوق 10⁹: الجريان صار مضطربًا، والارتباط الصفحي يقلّل معامل الحمل — الرقم استقراء لا قياس."
        : "";
  return warning ? { ra, nusselt, h, flux, _warning: warning } : { ra, nusselt, h, flux };
};

if (typeof document !== "undefined") startLab(compute);
