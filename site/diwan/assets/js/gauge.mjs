// مقياس رقمي مشترك — كل تجارب الديوان تستخدمه فلا يعود هناك شريط بلا أرقام.
// يبني: شريطًا ممتلئًا، مؤشّر القيمة الحالية وفقاعةً تحملها، تدريجًا مرقّمًا،
// وسطرًا يقول «بدأت عند … · الآن … · الفرق …». القيمة تُقاس بالبكسل من النطاق،
// والدقة معروضة بالوحدات لا بالنسبة، لأن السؤال الذي يجيب عنه المقياس هو:
// «كم صارت الحرارة؟» لا «أين المؤشّر؟».
//
// الوصولية: role="meter" مع aria-valuenow/valuetext تُحدَّث مع كل حركة،
// والنص المرئي نفسه هو المصدر (لا قيمة مخفيّة تختلف عمّا يقرأه القارئ).

const NS = "http://www.w3.org/2000/svg";

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

/** خطوة تدريج مقروءة: خمس خطوات على الأكثر، من الأرقام التي يفهمها القارئ. */
export function niceStep(span, target = 5) {
  const raw = span / Math.max(1, target);
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const candidates = [1, 2, 2.5, 5, 10].map((m) => m * pow);
  return candidates.find((c) => c >= raw) ?? candidates[candidates.length - 1];
}

function fmt(value, decimals) {
  const d = decimals ?? (Math.abs(value) >= 100 ? 0 : Math.abs(value) >= 10 ? 1 : 2);
  return Number(value).toFixed(d);
}

/**
 * @param {HTMLElement} el حاوية فارغة
 * @param {{min:number,max:number,unit?:string,start?:number,step?:number,
 *          decimals?:number,label?:string,ticks?:number}} opts
 */
export function createGauge(el, opts) {
  if (!el) return { set() {}, el: null };
  const min = Number(opts.min);
  const max = Number(opts.max);
  const unit = opts.unit ?? "";
  const start = Number.isFinite(opts.start) ? Number(opts.start) : null;
  const step = opts.step ?? niceStep(max - min, opts.ticks ?? 5);
  const decimals = opts.decimals;
  const span = max - min || 1;
  const pct = (v) => ((clamp(v, min, max) - min) / span) * 100;

  el.classList.add("gauge");
  el.textContent = "";

  const head = document.createElement("div");
  head.className = "gauge-head";
  const legend = document.createElement("span");
  legend.className = "gauge-legend";
  legend.textContent = opts.label ?? `المقياس من ${fmt(min, decimals)} إلى ${fmt(max, decimals)} ${unit}`.trim();
  head.append(legend);

  const track = document.createElement("div");
  track.className = "gauge-track";
  track.setAttribute("dir", "ltr");

  const fill = document.createElement("div");
  fill.className = "gauge-fill";

  if (start !== null) {
    const from = document.createElement("div");
    from.className = "gauge-start";
    from.style.left = `${pct(start)}%`;
    from.setAttribute("aria-hidden", "true");
    track.append(from);
  }

  const now = document.createElement("div");
  now.className = "gauge-now";
  const bubble = document.createElement("span");
  bubble.className = "gauge-bubble";
  now.append(bubble);
  track.append(fill, now);

  const scale = document.createElement("div");
  scale.className = "gauge-scale";
  scale.setAttribute("dir", "ltr");
  scale.setAttribute("aria-hidden", "true");
  const ticks = [];
  const firstTick = Math.ceil(min / step) * step;
  for (let t = firstTick; t <= max + 1e-9; t += step) {
    const at = pct(t);
    const tick = document.createElement("span");
    tick.className = "gauge-tick";
    tick.style.left = `${at}%`;
    if (at < 1) tick.dataset.edge = "low";
    if (at > 99) tick.dataset.edge = "high";
    tick.textContent = step % 1 === 0 ? t.toFixed(0) : String(Number(t.toFixed(2)));
    scale.append(tick);
    ticks.push({ at, node: tick });
  }

  const caption = document.createElement("p");
  caption.className = "gauge-caption";
  caption.setAttribute("role", "meter");
  caption.setAttribute("aria-live", "polite");

  el.append(head, track, scale, caption);

  function set(value, { by } = {}) {
    // الرقم المعروض هو القيمة الحقيقية دائمًا؛ الحدّ يمسّ الهندسة وحدها.
    // قصّ النص إلى مدى المقياس يكذب على القارئ حين تخرج القيمة عن المدى.
    const raw = Number(value);
    const v = Number.isFinite(raw) ? raw : min;
    const c = clamp(v, min, max);
    const at = pct(c);
    const over = v > max + 1e-9 || v < min - 1e-9;
    fill.style.width = `${at}%`;
    now.style.left = `${at}%`;
    now.classList.toggle("is-low", at < 12);
    now.classList.toggle("is-high", at > 88);
    now.classList.toggle("is-over", over);
    bubble.textContent = `${fmt(v, decimals)} ${unit}`.trim();

    for (const t of ticks) {
      const hot = t.at <= at + 1e-6;
      t.node.classList.toggle("is-passed", hot);
    }

    const parts = [];
    const iso = (s) => `\u2068${s}\u2069`; // عزل ثنائي الاتجاه كي لا تتشابك الأرقام في نص عربي
    if (start !== null) {
      const diff = v - start;
      parts.push(`بدأت عند ${iso(`${fmt(start, decimals)} ${unit}`.trim())}`);
      parts.push(`الآن ${iso(`${fmt(v, decimals)} ${unit}`.trim())}`);
      parts.push(`الفرق ${iso(`${diff >= 0 ? "+" : "−"}${fmt(Math.abs(diff), decimals)} ${unit}`.trim())}`);
    } else {
      parts.push(`الآن ${iso(`${fmt(v, decimals)} ${unit}`.trim())}`);
    }
    if (by) parts.unshift(by);
    if (over) parts.push(v > max ? "أعلى من مدى المقياس" : "أدنى من مدى المقياس");
    caption.textContent = parts.join(" · ");

    caption.setAttribute("aria-valuemin", String(min));
    caption.setAttribute("aria-valuemax", String(max));
    caption.setAttribute("aria-valuenow", String(Number(v.toFixed(decimals ?? 2))));
    caption.setAttribute("aria-valuetext", `${fmt(v, decimals)} ${unit}`.trim());
  }

  return { set, el, pct };
}

/** يُهيّئ كل <div data-gauge="min,max,unit,start"> في الصفحة. */
export function mountGauges(root = document) {
  const out = new Map();
  for (const node of root.querySelectorAll("[data-gauge]")) {
    const parts = String(node.dataset.gauge).split(",");
    const gauge = createGauge(node, {
      min: Number(parts[0]),
      max: Number(parts[1]),
      unit: parts[2] ?? "",
      start: parts[3] !== undefined && parts[3] !== "" ? Number(parts[3]) : null,
      decimals: node.dataset.decimals ? Number(node.dataset.decimals) : undefined,
      step: node.dataset.step ? Number(node.dataset.step) : undefined,
      label: node.dataset.label || undefined,
    });
    if (node.id) out.set(node.id, gauge);
  }
  return out;
}

export { NS };
