// مشغّل التجارب الموحّد — كل تجربة = مواصفة في content/experiments + دالة حساب واحدة.
//
// السبب: التجربة الأولى (السعة الحرارية) بُنيت يدويًا فأعجبت المالك، لكنها لا تتكرّر.
// عشر تجارب بهذا المستوى تحتاج عقدًا واحدًا: الحقول تُقرأ من صفحة التجربة نفسها
// (application/json)، والحساب دالة صغيرة في ملف الوحدة، والمكوّنات (شريط، مخرج،
// مقياس مرقّم) واحدة للجميع. فأي تجربة جديدة تُقاس بنفس المقاييس وتُصان في ملف واحد.

import { createGauge } from "./gauge.mjs";
import { mountScene } from "./scene.mjs";

const iso = (s) => `\u2068${s}\u2069`;

function fmt(n, decimals = 2) {
  if (!Number.isFinite(n)) return "—";
  const s = Math.abs(n) >= 1000 ? n.toFixed(0) : n.toFixed(decimals);
  return Number(s).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function readSpec() {
  const el = document.getElementById("lab-spec");
  if (!el) throw new Error("لا توجد مواصفة تجربة في الصفحة (#lab-spec)");
  return JSON.parse(el.textContent);
}

function controlHtml(c) {
  const from = c.from ?? c.min;
  const to = c.to ?? c.max;
  const step = c.step ?? 1;
  const value = c.value ?? from;
  const unit = c.unit ? ` <span class="u">${c.unit}</span>` : "";
  const shown = c.options
    ? (c.options.find((o) => o.value === value) ?? c.options[0]).label_ar
    : `${fmt(value, c.decimals ?? (step < 1 ? 2 : 0))}${unit}`;
  if (c.type === "select") {
    const opts = (c.options ?? [])
      .map((o) => `<option value="${o.value}"${o.value === value ? " selected" : ""}>${o.label_ar}</option>`)
      .join("");
    return `<label for="ctl-${c.id}">${c.label_ar}
      <select id="ctl-${c.id}" data-ctl="${c.id}" dir="rtl">${opts}</select>
      <output id="out-${c.id}" for="ctl-${c.id}">${shown}</output>
    </label>`;
  }
  return `<label for="ctl-${c.id}">${c.label_ar} <output id="out-${c.id}" for="ctl-${c.id}" dir="ltr">${shown}</output>
    <input id="ctl-${c.id}" data-ctl="${c.id}" type="range" min="${from}" max="${to}" step="${step}" value="${value}" dir="ltr" />
    ${c.hint_ar ? `<span class="ctl-hint">${c.hint_ar}</span>` : ""}
  </label>`;
}

function outputHtml(o) {
  const unit = o.unit ? ` <span class="u">${o.unit}</span>` : "";
  return `<div><span>${o.label_ar}</span> <output id="lab-out-${o.id}" dir="ltr"${o.live === false ? "" : ' aria-live="polite"'}>—</output>${unit}</div>`;
}

/**
 * يشغّل التجربة: يبني الضوابط والمخارج، ويستدعي compute عند كل تغيير.
 * compute(values, helpers) ⇒ { [outputId]: number|string, _gauge?: number }
 * أو يعيد { outputs: {...}, gauge: number, started: {gauge: number} }.
 */
export function startLab(compute, { mountId = "lab-root", gaugeId = "lab-gauge" } = {}) {
  const spec = readSpec();
  const mount = document.getElementById(mountId);
  if (!mount) throw new Error(`لا يوجد حاوية للضوابط (#${mountId})`);

  const controls = spec.controls ?? [];
  const outputs = spec.outputs ?? [];
  mount.innerHTML = controls.length ? `<div class="lab-controls">${controls.map(controlHtml).join("")}</div>` : "";

  // <select> قد يُنشأ من innerHTML بلا اختيار (selectedIndex = −1) فيعيد value = ""
  // فتُحسب التجربة على قيمة غير موجودة. نثبّت القيمة الابتدائية صراحةً.
  for (const c of controls) {
    if (c.type !== "select") continue;
    const el = mount.querySelector(`[data-ctl="${c.id}"]`);
    const want = String(c.value ?? c.options?.[0]?.value ?? "");
    if (el && (!el.value || el.selectedIndex < 0)) el.value = want;
  }

  const outHost = document.getElementById("lab-outputs");
  if (outHost) outHost.innerHTML = outputs.map(outputHtml).join("");

  const values = {};
  const read = () => {
    for (const c of controls) {
      const el = document.querySelector(`[data-ctl="${c.id}"]`);
      if (!el) continue;
      values[c.id] = el.tagName === "SELECT" ? el.value : Number(el.value);
      const shown = document.getElementById(`out-${c.id}`);
      if (shown) {
        if (c.options) shown.textContent = (c.options.find((o) => String(o.value) === String(el.value)) ?? {}).label_ar ?? "";
        else shown.textContent = `${fmt(Number(el.value), c.decimals ?? ((c.step ?? 1) < 1 ? 2 : 0))}${c.unit ? ` ${c.unit}` : ""}`;
      }
    }
    return values;
  };

  const gSpec = spec.gauge;
  const gauge = gSpec && document.getElementById(gaugeId)
    ? createGauge(document.getElementById(gaugeId), gSpec)
    : null;

  let started = null;
  // المشهد التوضيحي: يقرأ نفس قيم الضوابط ونفس أرقام المخرجات المحسوبة،
  // فلا يظهر في الرسم رقم لا يقوله الجدول.
  const sceneHost = document.getElementById("lab-scene");
  const scene = sceneHost && spec.scene && spec.scene.kind ? mountScene(sceneHost, spec.scene.kind) : null;
  const apply = () => {
    const v = read();
    let res;
    try {
      res = compute(v) ?? {};
    } catch (err) {
      console.error("خطأ في حساب التجربة:", err);
      return;
    }
    const outMap = res.outputs ? res.outputs : res;
    for (const o of outputs) {
      const el = document.getElementById(`lab-out-${o.id}`);
      if (!el) continue;
      const raw = outMap[o.id];
      el.textContent = typeof raw === "number" ? fmt(raw, o.decimals ?? 2) : (raw ?? "—");
    }
    if (gauge) {
      const gv = res.gauge ?? (gSpec.bind ? outMap[gSpec.bind] : undefined);
      if (Number.isFinite(gv)) {
        if (started === null) started = gv;
        gauge.set(gv);
      }
    }
    if (spec.note_ar) {
      const note = document.getElementById("lab-note");
      if (note && res.note) note.textContent = res.note;
    }
    if (scene) scene.update(v, outMap);
  };

  for (const c of controls) {
    const el = document.querySelector(`[data-ctl="${c.id}"]`);
    if (!el) continue;
    el.addEventListener("input", apply);
  }
  const reset = document.getElementById("lab-reset");
  if (reset) {
    reset.addEventListener("click", () => {
      for (const c of controls) {
        const el = document.querySelector(`[data-ctl="${c.id}"]`);
        if (!el) continue;
        el.value = c.value ?? c.from ?? c.min;
      }
      started = null;
      apply();
    });
  }
  apply();
  return { apply, values, gauge, spec };
}
