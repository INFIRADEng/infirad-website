// حارس مدخلات وحدات المعمل — طبقة التشغيل لا طبقة المواصفة.
// lib/lab-contract.mjs يفحص المواصفة وقت البناء والاستيراد (المدى، الخطوة، القيمة الافتراضية)،
// لكن `compute()` تُستدعى أيضًا بلا HTML: من مولّد الرسوم، ومن أدوات الأرقام، ومن الاختبارات.
// القاعدة: خارج المدى المعلن لا تُعاد قيمة بديلة صامتة ولا NaN — تُعاد رسالة عربية صريحة.

const rangeText = (spec) => `${spec.min}–${spec.max}${spec.unit ? ` ${spec.unit}` : ""}`;

/**
 * يقرأ قيم الضوابط ويتحقق منها قبل الحساب.
 * يُرجع كائنًا بالقيم الرقمية عند الصلاح، أو `{ _error }` برسالة عربية عند أول مدخل غير صالح.
 * specs: [{ id, label, min, max, unit }] للرقمي، أو [{ id, label, choices: [...] }] للاختياري.
 */
export function readInputs(values, specs) {
  const out = {};
  for (const spec of specs) {
    const raw = values == null ? undefined : values[spec.id];
    if (spec.choices) {
      if (!spec.choices.includes(raw)) {
        const shown = raw === undefined || raw === null || raw === "" ? "—" : String(raw).slice(0, 24);
        return { _error: `${spec.label}: الخيار «${shown}» غير معروف.` };
      }
      out[spec.id] = raw;
      continue;
    }
    if (raw === undefined || raw === null || (typeof raw === "string" && raw.trim() === "")) {
      return { _error: `${spec.label}: الحقل فارغ. أدخل رقمًا بين ${rangeText(spec)}.` };
    }
    if (typeof raw !== "number" && typeof raw !== "string") {
      return { _error: `${spec.label}: المدخل ليس رقمًا. أدخل رقمًا بين ${rangeText(spec)}.` };
    }
    const n = typeof raw === "number" ? raw : Number(raw.trim());
    if (!Number.isFinite(n)) {
      return { _error: `${spec.label}: «${String(raw).trim().slice(0, 24)}» ليس رقمًا صالحًا. أدخل رقمًا بين ${rangeText(spec)}.` };
    }
    if (!Number.isFinite(spec.min) || !Number.isFinite(spec.max) || !(spec.max > spec.min)) {
      return { _error: `${spec.label}: مدى النموذج غير صالح (أدنى ${spec.min}، أعلى ${spec.max}) — لا يمكن الحكم على القيمة.` };
    }
    if (n < spec.min || n > spec.max) {
      return { _error: `${spec.label}: ${n} خارج المدى المسموح ${rangeText(spec)}.` };
    }
    out[spec.id] = n;
  }
  return out;
}
