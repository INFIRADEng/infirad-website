// مشاهد واقعية تفاعلية للمعمل — «أين ترى هذا المبدأ في الحياة؟»
//
// السبب: «المعمل» كان أرقامًا ومقياسًا فقط. طالب المدرسة يفهم المبدأ حين يرى
// المضخة ترفع الماء، والجسر يفتح فراغه، والبخار يخرج من القدر. فالرسم هنا
// يُبنى من **نفس أرقام التجربة** في كل إطار، وكل رقم معروض عليه محسوب لا مكتوب.
//
// العقد:
//   SCENES[kind](values, out, t) ⇒ قائمة أوامر رسم (ops)
//   values = قيم الضوابط · out = مخرجات التجربة المحسوبة · t = الزمن للحركة
//   وكل op كائن بسيط: {t:"rect"|"circle"|"line"|"path"|"poly"|"text", ...}
//
// القواعد الملزِمة: لا نص تحت 17px · لا نص دوّار · الرقم بلون الحبر لا بلون الشكل ·
// وكل نص يبقى داخل اللوحة (الأرقام تُقصّ إلى حدّ هندسي فقط، وقيمتها الحقيقية في المخرجات).

import { SCIENCE_SCENES } from './scientific-scenes.mjs';
export const W = 760;
export const H = 330;

export const P = {
  ink: "#1b2a2f",
  muted: "#5d7079",
  line: "#cbd5d9",
  paper: "#ffffff",
  accent: "#0e7490",
  warm: "#c2410c",
  ochre: "#a16207",
  navy: "#1e3a5f",
  green: "#0a7a4a",
  sky: "#e8f3f8",
  water: "#a8d5e6",
  waterHot: "#e9a892",
  steel: "#94a3b8",
  stone: "#d6cfc7",
  soil: "#cbb79c",
};

const n = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);
const clamp = (x, a, b) => Math.min(b, Math.max(a, n(x)));
export const iso = (s) => `\u2068${s}\u2069`;
export const num = (x, d = 1) =>
  Number.isFinite(Number(x))
    ? Number(x).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })
    : "—";

// ── أدوات الرسم ─────────────────────────────────────────────────────────
const rect = (x, y, w, h, o = {}) => ({ t: "rect", x, y, w: Math.max(0, w), h: Math.max(0, h), ...o });
const circle = (cx, cy, r, o = {}) => ({ t: "circle", cx, cy, r: Math.max(0, r), ...o });
const line = (x1, y1, x2, y2, o = {}) => ({ t: "line", x1, y1, x2, y2, ...o });
const path = (d, o = {}) => ({ t: "path", d, ...o });
const poly = (points, o = {}) => ({ t: "poly", points, ...o });

// نص عربي: arRight يُثبّت الحافة اليمنى ويمتد يسارًا، arLeft العكس. الأرقام تُركَّز دائمًا.
const arRight = (x, y, s, o = {}) => ({ t: "text", x, y, s, anchor: "start", dir: "rtl", ...o });
const arLeft = (x, y, s, o = {}) => ({ t: "text", x, y, s, anchor: "end", dir: "rtl", ...o });
const mid = (x, y, s, o = {}) => ({ t: "text", x, y, s, anchor: "middle", dir: "rtl", ...o });

// سهم سميك الاتجاه (للتدفّق والحرارة)
function arrow(x1, y1, x2, y2, o = {}) {
  const { stroke = P.muted, width = 3, head = 9 } = o;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const hx1 = x2 - head * Math.cos(ang - 0.42);
  const hy1 = y2 - head * Math.sin(ang - 0.42);
  const hx2 = x2 - head * Math.cos(ang + 0.42);
  const hy2 = y2 - head * Math.sin(ang + 0.42);
  return [
    line(x1, y1, x2, y2, { stroke, width }),
    poly(`${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}`, { fill: stroke }),
  ];
}

const clamp01 = (x) => clamp(x, 0, 1);

// ── 1) قدر على نار: السعة الحرارية ───────────────────────────────────────
function kettle(v, out, t) {
  const ops = [];
  const T = clamp(out.temp ?? out.final ?? 20, -20, 400);
  const T0 = 20;
  const hot = clamp((T - T0) / 80, 0, 1);
  const wcol = hot > 0.55 ? P.waterHot : P.water;
  // الطاولة والنار
  ops.push(rect(0, 268, W, 62, { fill: "#f6f7f8" }));
  ops.push(line(0, 268, W, 268, { stroke: P.line, width: 2 }));
  const fx = 250, fw = 120;
  for (let i = 0; i < 5; i++) {
    const jitter = Math.sin(t / 180 + i) * 4;
    ops.push(poly(`${fx + 12 + i * 22},${262} ${fx + 18 + i * 22},${238 + jitter} ${fx + 24 + i * 22},${262}`,
      { fill: i % 2 ? P.ochre : P.warm, opacity: 0.9 }));
  }
  // القدر والوعاء الداخلي
  ops.push(rect(200, 150, 220, 108, { fill: P.steel, stroke: P.muted, width: 2, rx: 10 }));
  const level = clamp(0.25 + hot * 0.3, 0.1, 0.95);
  const wh = 96 * level;
  ops.push(rect(206, 252 - wh, 208, wh, { fill: wcol, rx: 6 }));
  // سطح الماء المتموّج
  ops.push(path(`M206 ${252 - wh} q26 -6 52 0 q26 6 52 0 q26 -6 52 0 q26 6 52 0`,
    { stroke: hot > 0.6 ? P.warm : P.accent, width: 2.5, fill: "none" }));
  // بخار عند الغليان
  if (T > 95) {
    for (let i = 0; i < 4; i++) {
      const ph = (t / 700 + i * 0.25) % 1;
      ops.push(circle(240 + i * 42, 150 - ph * 80, 7 + ph * 12, { fill: "#ffffff", opacity: 0.65 - ph * 0.45, stroke: P.line }));
    }
    ops.push(arRight(420, 118, "بخار يخرج عند الغليان", { size: 17, fill: P.muted }));
  }
  // ميزان حرارة بجانب القدر
  const tx = 470;
  ops.push(rect(tx, 110, 26, 150, { fill: "#ffffff", stroke: P.muted, width: 2, rx: 13 }));
  const fillH = clamp((T + 20) / 220, 0.02, 1) * 138;
  ops.push(rect(tx + 5, 254 - fillH, 16, fillH, { fill: hot > 0.55 ? P.warm : P.accent, rx: 8 }));
  ops.push(circle(tx + 13, 268, 18, { fill: hot > 0.55 ? P.warm : P.accent, stroke: P.muted }));
  for (const [val, y] of [[0, 254], [50, 222], [100, 190]]) {
    ops.push(line(tx + 26, y, tx + 38, y, { stroke: P.line, width: 2 }));
    ops.push(arLeft(tx + 42, y + 6, iso(`${val} °م`), { size: 17, fill: P.muted }));
  }
  // قراءة الحرارة والطاقة
  ops.push(mid(tx + 13, 84, iso(`${num(T, 1)} °م`), { size: 24, weight: 700, fill: P.ink }));
  ops.push(arRight(W - 24, 300, "الماء يسخن: اللون والفقاعة يتبعان الحرارة المحسوبة", { size: 17, fill: P.muted }));
  return ops;
}

// ── 2) بندول: الزمن الدوري ──────────────────────────────────────────────
function pendulum(v, out, t) {
  const ops = [];
  const L = clamp(v.length ?? 1, 0.2, 4);
  const per = clamp(out.period ?? 2, 0.2, 8);
  const ang = 0.42 * Math.cos((2 * Math.PI * t) / (per * 1000));
  const px = 380, py = 40, len = 40 + (L / 4) * 190;
  const bx = px + Math.sin(ang) * len;
  const by = py + Math.cos(ang) * len;
  ops.push(line(0, 300, W, 300, { stroke: P.line, width: 2 }));
  ops.push(rect(0, 300, W, 30, { fill: "#f6f7f8" }));
  ops.push(rect(px - 60, py - 16, 120, 16, { fill: P.navy, rx: 4 }));
  ops.push(line(px, py, bx, by, { stroke: P.muted, width: 3 }));
  ops.push(circle(bx, by, 20, { fill: P.warm, stroke: P.ink, width: 2 }));
  // قوس الحركة
  ops.push(path(`M${px + Math.sin(-0.42) * len} ${py + Math.cos(-0.42) * len} A${len} ${len} 0 0 0 ${px + Math.sin(0.42) * len} ${py + Math.cos(0.42) * len}`,
    { stroke: P.line, width: 2, dash: "6 8", fill: "none" }));
  // مسطرة الطول
  ops.push(line(px - 90, py, px - 90, py + len, { stroke: P.accent, width: 2 }));
  ops.push(line(px - 96, py, px - 84, py, { stroke: P.accent, width: 2 }));
  ops.push(line(px - 96, py + len, px - 84, py + len, { stroke: P.accent, width: 2 }));
  ops.push(mid(px - 90, py + len / 2, iso(`${num(L, 2)} م`), { size: 20, weight: 700, fill: P.ink }));
  ops.push(mid(bx, by + 52, iso(`T = ${num(per, 2)} ث`), { size: 22, weight: 700, fill: P.ink }));
  ops.push(arRight(W - 24, 58, "البندول يتحرك بالزمن الدوري المحسوب نفسه", { size: 17, fill: P.muted }));
  ops.push(arRight(W - 24, 86, "الطول أطول ⇒ التباطؤ أكبر ⇒ الدورة أطول", { size: 17, fill: P.muted }));
  return ops;
}

// ── 3) أسطوانة ومكبس: قانون الغاز ───────────────────────────────────────
function piston(v, out, t) {
  const ops = [];
  const Vol = clamp(v.liters ?? 24.5, 5, 50);
  const nMol = clamp(v.moles ?? 1, 0.1, 5);
  const Pm = clamp(out.pressure ?? 100, 10, 2000);
  ops.push(line(0, 286, W, 286, { stroke: P.line, width: 2 }));
  ops.push(rect(0, 286, W, 44, { fill: "#f6f7f8" }));
  const x0 = 150, y0 = 60, cylW = 300, cylH = 210;
  ops.push(rect(x0, y0, cylW, cylH, { fill: P.sky, stroke: P.muted, width: 2, rx: 6 }));
  const fillFrac = clamp(Vol / 50, 0.12, 0.95);
  const gasX = x0 + cylW - cylW * fillFrac;
  ops.push(rect(gasX, y0 + 6, cylW * fillFrac - 6, cylH - 12, { fill: "#ffffff", opacity: 0.55 }));
  // جزيئات متحركة داخل الحجم المتاح
  const count = Math.round(6 + nMol * 4);
  for (let i = 0; i < count; i++) {
    const sp = 0.35 + (i % 3) * 0.12;
    const gx = gasX + 24 + ((Math.sin(t / (900 * sp) + i * 2.1) * 0.5 + 0.5) * (cylW * fillFrac - 48));
    const gy = y0 + 30 + ((Math.cos(t / (1100 * sp) + i * 1.7) * 0.5 + 0.5) * (cylH - 60));
    ops.push(circle(gx, gy, 5, { fill: P.accent, opacity: 0.85 }));
  }
  // المكبس
  const pistonX = gasX - 16;
  ops.push(rect(pistonX, y0 + 6, 16, cylH - 12, { fill: P.steel, stroke: P.ink, width: 2, rx: 3 }));
  ops.push(rect(pistonX + 16, y0 + cylH / 2 - 8, 70, 16, { fill: P.navy, rx: 4 }));
  // أسهم الضغط على الجدار
  for (let i = 0; i < 3; i++) {
    const yy = y0 + 50 + i * 60;
    const push = 26 + clamp(Pm / 1200, 0, 1) * 40;
    ops.push(...arrow(pistonX - 4, yy, pistonX - 4 - push, yy, { stroke: P.warm, width: 3 }));
  }
  ops.push(mid(x0 + cylW / 2, 40, "الغاز داخل الأسطوانة", { size: 17, fill: P.muted }));
  ops.push(mid(pistonX - 90, y0 + cylH / 2 - 24, iso(`V = ${num(Vol, 1)} ل`), { size: 20, weight: 700, fill: P.ink }));
  ops.push(mid(x0 + 90, y0 + cylH + 44, iso(`P = ${num(Pm, 0)} ك.ب`), { size: 22, weight: 700, fill: P.ink }));
  ops.push(arRight(W - 24, 300, "الجزيئات تضرب الجدار، والمكبس يبيّن الحجم", { size: 17, fill: P.muted }));
  return ops;
}

// ── 4) قدر على جبل: الغليان مع الضغط ────────────────────────────────────
function potAltitude(v, out, t) {
  const ops = [];
  const patm = clamp(v.pressure ?? 101.3, 10, 200);
  const Tb = clamp(out.boil ?? 100, 40, 160);
  const alt = clamp(((101.3 - patm) / 68) * 5000, 0, 5000); // ارتفاع مُشار إليه فقط
  ops.push(rect(0, 250, W, 80, { fill: P.soil }));
  ops.push(poly(`0,250 120,150 220,250`, { fill: P.stone, stroke: P.muted, width: 2 }));
  ops.push(poly(`60,250 150,120 260,250`, { fill: "#e7e2dc", stroke: P.muted, width: 2 }));
  // القدر أعلى الجبل
  const px = 150, py = 118;
  ops.push(rect(px - 46, py - 34, 92, 44, { fill: P.steel, stroke: P.muted, width: 2, rx: 8 }));
  ops.push(rect(px - 40, py - 28, 80, 32, { fill: Tb > 105 ? P.waterHot : P.water, rx: 5 }));
  for (let i = 0; i < 3; i++) {
    const ph = (t / 600 + i * 0.33) % 1;
    ops.push(circle(px - 22 + i * 22, py - 40 - ph * 46, 6 + ph * 10, { fill: "#ffffff", opacity: 0.7 - ph * 0.5, stroke: P.line }));
  }
  ops.push(line(px, py, px, py - 70, { stroke: P.muted, width: 2, dash: "5 6" }));
  ops.push(arRight(px + 10, py - 76, iso(`${num(alt, 0)} م`), { size: 18, fill: P.muted }));
  // مقياس الضغط + الترمومتر
  const gx = 430;
  ops.push(circle(gx, 150, 54, { fill: "#ffffff", stroke: P.muted, width: 3 }));
  const frac = clamp((patm - 10) / 190, 0, 1);
  const a = -Math.PI * 0.75 + frac * Math.PI * 1.5;
  ops.push(line(gx, 150, gx + Math.cos(a) * 42, 150 + Math.sin(a) * 42, { stroke: P.warm, width: 4 }));
  ops.push(mid(gx, 214, iso(`${num(patm, 0)} ك.ب`), { size: 20, weight: 700, fill: P.ink }));
  ops.push(arRight(gx - 80, 150, "ضغط الهواء", { size: 17, fill: P.muted }));
  ops.push(mid(gx, 68, iso(`يغلي عند ${num(Tb, 1)} °م`), { size: 24, weight: 700, fill: P.ink }));
  ops.push(arRight(W - 24, 44, "كلما صعدت قلّ الضغط، فغلا الماء قبل 100 °م", { size: 17, fill: P.muted }));
  ops.push(arRight(W - 24, 300, alt > 3000 ? "أعلى الجبل: ماء يغلي فاترًا ولا ينضج الطعام جيدًا" : "عند البحر: الماء يغلي عند 100 °م تقريبًا",
    { size: 17, fill: P.muted }));
  return ops;
}

// ── 5) جسر بفواصل تمدد ─────────────────────────────────────────────────
function bridge(v, out, t) {
  const ops = [];
  const dl = clamp(out.elongation ?? 48, 0, 400); // مم
  const gap = 6 + clamp(dl, 0, 400) * 0.22;
  const deckY = 190, deckH = 26;
  // النهر تحته
  ops.push(rect(0, 252, W, 78, { fill: P.sky }));
  ops.push(path(`M0 268 q40 -8 80 0 q40 8 80 0 q40 -8 80 0 q40 8 80 0 q40 -8 80 0 q40 8 80 0 q40 -8 80 0 q40 8 80 0`,
    { stroke: P.accent, width: 3, fill: "none" }));
  // دعامتان
  for (const bx of [150, 610]) {
    ops.push(rect(bx - 20, deckY + deckH, 40, 60, { fill: P.stone, stroke: P.muted, width: 2 }));
  }
  // الجسر نصفان بفاصل يتّسع مع التمدد
  const midX = W / 2;
  const leftW = midX - gap / 2 - 20;
  const rightW = midX + gap / 2 - 20;
  ops.push(rect(20, deckY, leftW - 20, deckH, { fill: P.steel, stroke: P.ink, width: 2, rx: 4 }));
  ops.push(rect(midX + gap / 2, deckY, W - 20 - (midX + gap / 2), deckH, { fill: P.steel, stroke: P.ink, width: 2, rx: 4 }));
  // أسنان الفاصل
  ops.push(rect(midX - gap / 2 - 14, deckY + 4, 14, deckH - 8, { fill: P.navy, rx: 2 }));
  ops.push(rect(midX + gap / 2, deckY + 4, 14, deckH - 8, { fill: P.navy, rx: 2 }));
  ops.push(line(midX, deckY - 26, midX, deckY + deckH + 6, { stroke: P.ochre, width: 2, dash: "4 5" }));
  ops.push(mid(midX, deckY - 34, "فاصل تمدّد", { size: 20, weight: 700, fill: P.ink }));
  ops.push(mid(midX, deckY - 58, "يتّسع بقدر استطالة الجسر", { size: 17, fill: P.muted }));
  // سيارة تعبر (حركة تُظهر الفاصل عمليًا)
  const carX = 40 + ((t / 34) % (W - 80));
  ops.push(rect(carX, deckY - 26, 54, 18, { fill: P.warm, rx: 6 }));
  ops.push(rect(carX + 8, deckY - 38, 30, 12, { fill: P.warm, rx: 5 }));
  ops.push(circle(carX + 12, deckY + 2, 7, { fill: P.ink }));
  ops.push(circle(carX + 42, deckY + 2, 7, { fill: P.ink }));
  // بطاقة الاستطالة الكلية
  ops.push(arRight(W - 30, 40, "الجسر الطويل يتمدّد صيفًا؛ الفاصل يمنع التكسّر", { size: 17, fill: P.muted }));
  ops.push(mid(120, 318, iso(`ΔL = ${num(dl, 1)} مم`), { size: 22, weight: 700, fill: P.ink }));
  ops.push(arRight(W - 30, 300, "لو مُنع التمدد، صار الفراغ كلفة إجهاد في الخرسانة", { size: 17, fill: P.muted }));
  return ops;
}

// ── 6) مضخة ترفع الماء ─────────────────────────────────────────────────
function pump(v, out, t) {
  const ops = [];
  const Hlift = clamp(v.head ?? 50, 5, 200);
  const Q = clamp(v.flow ?? 40, 1, 100);
  const Pk = clamp(out.shaft ?? out.hydraulic ?? 0, 0, 500);
  // بئر أسفل + خزان أعلى
  ops.push(rect(0, 268, W, 62, { fill: P.soil }));
  const wellX = 90, tankX = 560;
  ops.push(rect(wellX - 60, 214, 120, 54, { fill: P.sky, stroke: P.muted, width: 2, rx: 6 }));
  ops.push(rect(wellX - 54, 236, 108, 26, { fill: P.water, rx: 4 }));
  ops.push(arRight(wellX + 60, 200, "بئر", { size: 17, fill: P.muted }));
  // أنبوب صاعد على شكل حرف L
  const pipeTop = 60;
  ops.push(path(`M${wellX} 236 L${wellX} ${pipeTop} L${tankX - 30} ${pipeTop}`, { stroke: P.steel, width: 16, fill: "none" }));
  ops.push(path(`M${wellX} 236 L${wellX} ${pipeTop} L${tankX - 30} ${pipeTop}`, { stroke: "#ffffff", width: 8, fill: "none", opacity: 0.55 }));
  // ماء متحرك داخل الأنبوب (سرعة ∝ التدفق)
  const speed = 2600 / (Q + 4);
  for (let i = 0; i < 7; i++) {
    const ph = ((t / speed) + i / 7) % 1;
    const yUp = 236 - ph * (236 - pipeTop);
    ops.push(circle(wellX, yUp, 4.5, { fill: P.accent, opacity: 0.9 }));
    if (ph > 0.82) {
      const fx2 = wellX + ((ph - 0.82) / 0.18) * (tankX - 30 - wellX);
      ops.push(circle(fx2, pipeTop, 4.5, { fill: P.accent, opacity: 0.9 }));
    }
  }
  // المضخة
  ops.push(circle(wellX, 268, 30, { fill: "#ffffff", stroke: P.ink, width: 3 }));
  for (let i = 0; i < 4; i++) {
    const a = t / (140 / Math.max(0.4, Q / 12)) + (i * Math.PI) / 2;
    ops.push(line(wellX, 268, wellX + Math.cos(a) * 22, 268 + Math.sin(a) * 22, { stroke: P.accent, width: 4 }));
  }
  ops.push(arRight(wellX + 34, 316, "مضخة", { size: 17, fill: P.muted }));
  // الخزان أعلى
  const tankY = pipeTop - 46;
  ops.push(rect(tankX, tankY, 150, 60, { fill: "#ffffff", stroke: P.muted, width: 2, rx: 6 }));
  ops.push(rect(tankX + 6, tankY + 10, 138, 44, { fill: P.water, rx: 4 }));
  ops.push(arRight(tankX + 150, tankY + 78, "خزان أعلى السطح", { size: 17, fill: P.muted }));
  // عمود الارتفاع
  ops.push(line(tankX + 176, pipeTop, tankX + 176, 268, { stroke: P.accent, width: 2 }));
  ops.push(line(tankX + 168, pipeTop, tankX + 184, pipeTop, { stroke: P.accent, width: 2 }));
  ops.push(line(tankX + 168, 268, tankX + 184, 268, { stroke: P.accent, width: 2 }));
  ops.push(mid(tankX + 176, (pipeTop + 268) / 2, iso(`${num(Hlift, 0)} م`), { size: 20, weight: 700, fill: P.ink }));
  // البطاقة الرقمية: في الفراغ أسفل الأنبوب الصاعد، بعيدًا عن خط الأنبوب
  ops.push(arRight(360, 128, iso(`القدرة = ${num(Pk, 2)} ك.و`), { size: 24, weight: 700, fill: P.ink }));
  ops.push(arRight(360, 158, iso(`التدفق = ${num(Q, 0)} ل/ث`), { size: 18, fill: P.muted }));
  ops.push(arRight(W - 24, 300, "المضخة ترفع الماء: طاقة تُخزَّن كارتفاع", { size: 17, fill: P.muted }));
  return ops;
}

// ── 7) أنبوب بضيق: هبوط الضغط ───────────────────────────────────────────
function pipeNarrow(v, out, t) {
  const ops = [];
  const dp = clamp(out.drop ?? 30, 0, 5000);
  const vel = clamp(out.velocity ?? 1, 0, 20);
  const ratio = 0.5; // تضييق المقطع إلى النصف ⇒ السرعة تتضاعف (حفظ الكتلة)
  const cy = 170, rIn = 46, rTh = rIn * ratio;
  const x1 = 60, x2 = 420, x3 = 700;
  ops.push(rect(x1, cy - rIn, x2 - x1, rIn * 2, { fill: P.sky, stroke: P.muted, width: 3 }));
  ops.push(rect(x2, cy - rTh, x3 - x2, rTh * 2, { fill: P.sky, stroke: P.muted, width: 3 }));
  // جزيئات: أسرع داخل الضيق (نفس التدفق، مقطع أصغر)
  const span = x3 - x1;
  for (let i = 0; i < 14; i++) {
    let x = x1 + ((t / 22 + i * 52) % span);
    const inNarrow = x > x2;
    const py = cy + Math.sin(t / 220 + i) * (inNarrow ? rTh - 12 : rIn - 14);
    ops.push(circle(x, py, 4.5, { fill: inNarrow ? P.warm : P.accent, opacity: 0.9 }));
  }
  // أسهم السرعة: قبل وبعد
  const vy = cy + rIn + 34;
  ops.push(...arrow(x1 + 30, vy, x1 + 30 + 40 + vel * 8, vy, { stroke: P.accent, width: 4 }));
  ops.push(mid(x1 + 120, vy + 30, iso(`السرعة قبل = ${num(vel, 2)} م/ث`), { size: 18, weight: 700, fill: P.ink }));
  ops.push(...arrow(x2 + 40, vy, x2 + 40 + (40 + vel * 8) * 2, vy, { stroke: P.warm, width: 4 }));
  ops.push(mid(x2 + 170, vy + 30, iso(`داخل الضيق = ${num(vel * 2, 2)} م/ث`), { size: 18, weight: 700, fill: P.ink }));
  ops.push(arLeft(x1 + 4, cy - rIn - 16, "قبل", { size: 17, fill: P.muted }));
  ops.push(arLeft(x2 + 6, cy - rTh - 16, "بعد التضييق", { size: 17, fill: P.muted }));
  ops.push(mid(W / 2, 46, iso(`Δp = ${num(dp, 1)} ك.ب على طول الأنبوب`), { size: 24, weight: 700, fill: P.ink }));
  ops.push(arRight(W - 24, 300, "الضيق يسرّع الجريان ويهبط بالضغط — هذا سبب فقد الضغط في الشبكات", { size: 17, fill: P.muted }));
  return ops;
}

// ── 8) جدار بطبقات: فقد الحرارة ────────────────────────────────────────
function wall(v, out, t) {
  const ops = [];
  const u = clamp(out.u ?? 1, 0, 20);          // W/m²·K
  const q = clamp(out.q ?? 300, 0, 1e6);       // واط كلي
  const dT = clamp(v.deltaT ?? 15, 1, 40);
  const ins = clamp(v.insulation ?? 50, 20, 150); // مم
  const tin = 24;                              // افتراض النموذج: الداخل 24 °م
  const tout = tin - dT;
  ops.push(rect(0, 0, W, H, { fill: "#fbfcfd" }));
  const wallY = 66, wallH = 186;
  // سماكة العزل تُرسم من قيمة المنزلق نفسها: عزل أسمك ⇒ شريط أعرض
  const insW = 34 + ((ins - 20) / 130) * 96;
  const layers = [
    { w: 36, fill: "#f1e9df", label: "جبس" },
    { w: insW, fill: P.ochre, label: "عزل" },
    { w: 110, fill: P.stone, label: "خرسانة" },
  ];
  const total = layers.reduce((a, l) => a + l.w, 0);
  let lx = W / 2 - total / 2;
  for (const l of layers) {
    ops.push(rect(lx, wallY, l.w, wallH, { fill: l.fill, stroke: P.muted, width: 1.5, opacity: 0.9 }));
    ops.push(mid(lx + l.w / 2, wallY + wallH - 12, l.label, { size: 17, fill: P.ink }));
    lx += l.w;
  }
  const wallX = W / 2 - total / 2;
  // أسهم حرارة: عددها وكثافتها ∝ الفيض المحسوب
  const nArrows = clamp(Math.round(u * 1.6), 1, 7);
  for (let i = 0; i < nArrows; i++) {
    const yy = wallY + 24 + (i * (wallH - 46)) / Math.max(1, nArrows - 1);
    const ph = Math.sin(t / 420 + i) * 6;
    ops.push(...arrow(wallX - 96, yy + ph, wallX - 12, yy + ph, { stroke: P.warm, width: 3 + clamp01(u / 4) * 4 }));
    ops.push(...arrow(wallX + total + 12, yy + ph, wallX + total + 96, yy + ph, { stroke: P.warm, width: 3 + clamp01(u / 4) * 4 }));
  }
  // أرقام الغرفتين
  ops.push(mid(wallX - 70, wallY + wallH + 30, iso(`${num(tin, 1)} °م`), { size: 22, weight: 700, fill: P.ink }));
  ops.push(arRight(wallX - 96, wallY + wallH + 2, "داخل", { size: 17, fill: P.muted }));
  ops.push(mid(wallX + total + 70, wallY + wallH + 30, iso(`${num(tout, 1)} °م`), { size: 22, weight: 700, fill: P.ink }));
  ops.push(arLeft(wallX + total + 44, wallY + wallH + 2, "خارج", { size: 17, fill: P.muted }));
  ops.push(mid(W / 2, 36, iso(`U = ${num(u, 2)} و/م²·ك · الفقد = ${num(q, 0)} واط`), { size: 22, weight: 700, fill: P.ink }));
  ops.push(mid(W / 2, wallY - 6, iso(`سماكة العزل ${num(ins, 0)} مم`), { size: 18, fill: P.muted }));
  ops.push(arRight(W - 24, 306, "العزل الأسمك يقلّل U فتقلّ الأسهم — هذا معنى مقاومة الجدار", { size: 17, fill: P.muted }));
  return ops;
}

// ── 9) صفيحة تحت الشمس: توازن الإشعاع ──────────────────────────────────
function plateSun(v, out, t) {
  const ops = [];
  const Teq = clamp(out.kelvin ?? 300, 150, 900); // كلفن
  const Tcel = clamp(out.celsius ?? Teq - 273.15, -130, 650);
  const sunX = 110, sunY = 110;
  ops.push(circle(sunX, sunY, 44, { fill: "#f6c04a", stroke: P.ochre, width: 3 }));
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + t / 2600;
    ops.push(line(sunX + Math.cos(a) * 52, sunY + Math.sin(a) * 52, sunX + Math.cos(a) * 70, sunY + Math.sin(a) * 70,
      { stroke: P.ochre, width: 3 }));
  }
  // أشعة واردة
  for (let i = 0; i < 4; i++) {
    const yy = 70 + i * 34;
    ops.push(...arrow(sunX + 74, yy, 430, yy + 40, { stroke: P.ochre, width: 4 }));
  }
  // الصفيحة
  ops.push(rect(430, 150, 26, 130, { fill: P.navy, stroke: P.ink, width: 2, rx: 4 }));
  ops.push(mid(470, 140, "الصفيحة", { size: 17, fill: P.muted }));
  // إشعاع صادر: أطوال الأسهم ∝ T⁴
  const frac = clamp((Teq - 150) / 750, 0.05, 1);
  for (let i = 0; i < 4; i++) {
    const yy = 170 + i * 28;
    ops.push(...arrow(470, yy, 470 + 40 + frac * 150, yy - 22, { stroke: P.warm, width: 4 }));
  }
  ops.push(mid(600, 92, iso(`${num(Teq, 0)} كلفن`), { size: 26, weight: 700, fill: P.ink }));
  ops.push(mid(600, 118, iso(`${num(Tcel, 1)} °م`), { size: 20, weight: 700, fill: P.ink }));
  ops.push(arRight(W - 24, 300, "الوارد من الشمس = الصادر من الصفيحة عند التوازن", { size: 17, fill: P.muted }));
  ops.push(arRight(W - 24, 44, "صفيحة في الفضاء: تسخن حتى تتوازن", { size: 17, fill: P.muted }));
  return ops;
}

// ── 10) مبرد امتزاز: دورة COP ──────────────────────────────────────────
function chiller(v, out, t) {
  const ops = [];
  const cop = clamp(out.cop ?? 0.6, 0, 3);
  const tdrive = clamp(v.desorb ?? 85, 50, 120);   // حرارة تسخين السرير
  const tcool = clamp(v.loading ?? 12, 4, 20);     // حمل التبريد
  ops.push(rect(0, 0, W, H, { fill: "#fbfcfd" }));
  const boxW = 170, boxH = 84;
  const boxes = [
    { x: 60, y: 60, label: "سرير امتزاز", fill: P.ochre },
    { x: 300, y: 60, label: "مكثّف", fill: P.warm },
    { x: 300, y: 200, label: "مبخّر", fill: P.accent },
    { x: 60, y: 200, label: "ماص", fill: P.green },
  ];
  for (const b of boxes) {
    ops.push(rect(b.x, b.y, boxW, boxH, { fill: "#ffffff", stroke: b.fill, width: 3, rx: 10 }));
    ops.push(mid(b.x + boxW / 2, b.y + boxH / 2 + 7, b.label, { size: 19, weight: 700, fill: P.ink }));
  }
  // أسهم الدورة
  const pulse = 0.6 + 0.4 * Math.sin(t / 420);
  const links = [
    [230, 102, 300, 102, P.ochre],
    [385, 144, 385, 200, P.warm],
    [300, 242, 230, 242, P.accent],
    [145, 200, 145, 144, P.green],
  ];
  for (const [x1, y1, x2, y2, col] of links) {
    ops.push(...arrow(x1, y1, x2, y2, { stroke: col, width: 3 + pulse * 2 }));
  }
  // بطاقة الأرقام
  ops.push(arRight(W - 40, 120, iso(`COP = ${num(cop, 2)}`), { size: 28, weight: 700, fill: P.ink }));
  ops.push(arRight(W - 40, 154, iso(`تدوير عند ${num(tdrive, 0)} °م`), { size: 19, fill: P.muted }));
  ops.push(arRight(W - 40, 184, "حرارة منخفضة تُرفع", { size: 17, fill: P.muted }));
  ops.push(arRight(W - 40, 210, "بحرارة الشمس لا بالكهرباء", { size: 17, fill: P.muted }));
  ops.push(arRight(W - 24, 316, "المبخّر يأخذ الحرارة، وCOP يقيس ما كسبناه مقابل ما صرفناه", { size: 17, fill: P.muted }));
  return ops;
}

export const SCENES = {
  kettle, pendulum, piston, "pot-altitude": potAltitude, bridge, pump,
  pipe: pipeNarrow, wall, "plate-sun": plateSun, chiller, ...SCIENCE_SCENES,
};

// ── العارض: ops ⇒ SVG ──────────────────────────────────────────────────
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function opSvg(o) {
  const st = (a = {}) => {
    const p = [];
    if (a.stroke) p.push(`stroke="${a.stroke}"`);
    if (a.width != null) p.push(`stroke-width="${a.width}"`);
    if (a.dash) p.push(`stroke-dasharray="${a.dash}"`);
    if (a.fill) p.push(`fill="${a.fill}"`);
    else if (o.t !== "line" && o.t !== "path") p.push('fill="none"');
    if (a.fill === "none") p.push('fill="none"');
    if (a.opacity != null) p.push(`opacity="${a.opacity}"`);
    if (a.rx != null) p.push(`rx="${a.rx}"`);
    p.push('stroke-linecap="round"');
    if ((o.t === "poly" || o.t === "path") && a.fill && a.fill !== "none") p.push('stroke-linejoin="round"');
    return p.join(" ");
  };
  const f = (v) => (Math.round(Number(v) * 10) / 10).toString();
  if (o.t === "rect") return `<rect x="${f(o.x)}" y="${f(o.y)}" width="${f(o.w)}" height="${f(o.h)}" ${st(o)}/>`;
  if (o.t === "circle") return `<circle cx="${f(o.cx)}" cy="${f(o.cy)}" r="${f(o.r)}" ${st(o)}/>`;
  if (o.t === "line") return `<line x1="${f(o.x1)}" y1="${f(o.y1)}" x2="${f(o.x2)}" y2="${f(o.y2)}" ${st(o)}/>`;
  if (o.t === "path") return `<path d="${o.d}" ${st(o)}/>`;
  if (o.t === "poly") return `<polygon points="${o.points}" ${st(o)}/>`;
  if (o.t === "text") {
    const size = Math.max(17, o.size ?? 17);
    return `<text x="${f(o.x)}" y="${f(o.y)}" font-size="${size}" font-weight="${o.weight ?? 400}" fill="${o.fill ?? P.ink}" text-anchor="${o.anchor ?? "middle"}" direction="${o.dir ?? "rtl"}">${esc(o.s)}</text>`;
  }
  return "";
}

export function renderOps(ops) {
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-hidden="true" focusable="false"
  style="display:block;max-width:${W}px;height:auto;margin-inline:auto">
  <rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff"/>
  ${ops.map(opSvg).join("\n  ")}
</svg>`;
}

/**
 * يبني أوامر رسم مشهد واحد بلا DOM — يستخدمه الاختبار وبوابات الفحص.
 * يعيد null إن كان النوع غير معروف.
 */
export function sceneOps(kind, values, out, t) {
  const fn = SCENES[kind];
  if (!fn) return null;
  return fn(values || {}, out || {}, t || 0);
}

export const SCENE_KINDS = Object.keys(SCENES);
export const SCENE_BOX = { W, H };

/**
 * يركّب مشهدًا حيًّا في حاوية ويعيد { update, stop }.
 * update(values, out) يعيد الرسم من الأرقام الجديدة؛ والحركة تُحدَّث ~24 إطارًا/ثانية.
 */
export function mountScene(host, kind) {
  const draw = SCENES[kind];
  if (!host || !draw) return null;
  let vals = {};
  let outs = {};
  let raf = 0;
  let last = 0;
  let paused = false;
  let time = 0;
  const frame = (ts) => {
    raf = requestAnimationFrame(frame);
    if (document.hidden || paused) { last = ts; return; }
    if (ts - last < 40) return; // ≈24 إطارًا
    time += Math.min(100, ts - last);
    last = ts;
    try {
      host.innerHTML = renderOps(draw(vals, outs, time));
    } catch (err) {
      console.error("خطأ في رسم المشهد:", err);
      cancelAnimationFrame(raf);
    }
  };
  host.classList.add("lab-scene");
  // احترام تقليل الحركة: مشهد ساكن بلا إطارات (نفس المعلومات، بلا نبض)
  const still = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  paused = still;
  host.innerHTML = renderOps(draw(vals, outs, 0));
  raf = requestAnimationFrame(frame);
  return {
    update(values, out) {
      vals = values ?? {};
      outs = out ?? {};
      // ارسم فورًا: الإطار المتكرر يتوقف حين تكون الصفحة غير مرئية،
      // فلا تُترك قيمة قديمة معروضة بعد تغيير المنزلق.
      host.innerHTML = renderOps(draw(vals, outs, time));
    },
    setPaused(value) { paused = Boolean(value); },
    stop() {
      cancelAnimationFrame(raf);
    },
  };
}
