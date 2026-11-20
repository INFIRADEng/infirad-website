import { createGauge } from './gauge.mjs';
import { mountScene } from './scene.mjs';
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const fmt = (n,d=2) => Number.isFinite(n) ? (Math.abs(n)>1e6 || (n!==0 && Math.abs(n)<0.001) ? n.toExponential(2) : n.toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d})) : '—';
const axisFmt=n=>Math.abs(n)>=10000?n.toExponential(1):fmt(n,Math.abs(n)>=1000?0:2);
export function evaluateModel(compute, values, outputs) {
  try {
    const result=compute({...values});
    if(result?._error) return {error:result._error};
    const data=result?.outputs??result;
    if(!data || outputs.some(o=>!Number.isFinite(data[o.id]))) return {error:'تعذر حساب نتيجة صالحة لهذه المدخلات. راجع القيم وحدود النموذج.'};
    return {data,warning:result._warning??'',note:result.note??''};
  } catch { return {error:'تعذر حساب هذه الحالة. راجع المدخلات وحدود النموذج.'}; }
}
export function sampleModel(compute,values,control,output,outputs,count=61) {
  const lo=control.min??control.from,hi=control.max??control.to;
  return Array.from({length:count},(_,i)=>{const x=lo+(hi-lo)*i/(count-1),r=evaluateModel(compute,{...values,[control.id]:x},outputs);return {x,y:r.error?null:r.data[output.id]};});
}
function controlHtml(c) {
  const label=esc(c.label_ar),id=esc(c.id);
  if(c.type==='select') return `<div class="lab-control"><label for="ctl-${id}">${label}</label><select id="ctl-${id}" data-ctl="${id}">${c.options.map(o=>`<option value="${esc(o.value)}">${esc(o.label_ar)}</option>`).join('')}</select></div>`;
  const min=c.min??c.from,max=c.max??c.to;
  return `<div class="lab-control"><label for="num-${id}">${label} <span class="muted">${esc(c.unit)}</span></label><input type="number" id="num-${id}" data-number="${id}" min="${min}" max="${max}" step="any" value="${c.value}" dir="ltr"><input aria-label="${label} — منزلق" id="ctl-${id}" data-ctl="${id}" type="range" min="${min}" max="${max}" step="${c.step??1}" value="${c.value}" dir="ltr"><div class="control-limits" dir="ltr"><span>${min}</span><span>${max}</span></div>${c.hint_ar?`<p class="ctl-hint">${esc(c.hint_ar)}</p>`:''}</div>`;
}
export function startLab(compute,{mountId='lab-root',gaugeId='lab-gauge'}={}) {
  const spec=JSON.parse(document.getElementById('lab-spec').textContent),controls=spec.controls,outputs=spec.outputs,learn=spec.learning;
  const defaults=Object.fromEntries(controls.map(c=>[c.id,c.value])),values={...defaults};
  const mount=document.getElementById(mountId);
  mount.innerHTML=`<div class="lab-question"><strong>توقّع قبل أن تغيّر</strong><p>${esc(learn.question_ar)}</p></div><div class="lab-presets" aria-label="حالات جاهزة للمقارنة">${learn.scenarios.map((s,i)=>`<button type="button" data-scenario="${i}">${esc(s.label_ar)}</button>`).join('')}</div><div class="lab-controls">${controls.map(controlHtml).join('')}</div>`;
  for(const c of controls) mount.querySelector(`[data-ctl="${c.id}"]`).value=c.value;
  const outHost=document.getElementById('lab-outputs');
  outHost.innerHTML=outputs.map(o=>`<div><span>${esc(o.label_ar)}</span><span class="lab-measure" dir="ltr"><output id="lab-out-${o.id}">—</output> <span class="u">${esc(o.unit)}</span></span><small id="diff-${o.id}" class="lab-diff"></small></div>`).join('');
  const status=document.createElement('p'); status.id='lab-status';status.setAttribute('role','status');status.className='lab-status';mount.after(status);
  const defaultResult=evaluateModel(compute,defaults,outputs);
  let baseline=defaultResult,baselineValues={...defaults},current=defaultResult;
  const gSpec=spec.gauge,gaugeHost=document.getElementById(gaugeId);
  const gauge=gSpec?createGauge(gaugeHost,{...gSpec,start:defaultResult.data?.[gSpec.bind]}):null;
  const sceneHost=document.getElementById('lab-scene'),scene=sceneHost&&spec.scene?mountScene(sceneHost,spec.scene.kind):null;
  const summary=document.createElement('div');summary.className='lab-observation';summary.setAttribute('aria-live','polite');outHost.after(summary);
  const compare=document.createElement('div');compare.className='lab-actions';compare.innerHTML='<button type="button" id="lab-pin">ثبّت هذه الحالة للمقارنة</button><button type="button" id="lab-motion" aria-pressed="false">إيقاف الحركة</button><span id="lab-baseline"></span>';
  sceneHost?.parentElement.after(compare);
  let paused=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion=compare.querySelector('#lab-motion');
  if(paused){motion.textContent='تشغيل الحركة';motion.setAttribute('aria-pressed','true');}
  motion.addEventListener('click',()=>{paused=!paused;scene?.setPaused(paused);motion.textContent=paused?'تشغيل الحركة':'إيقاف الحركة';motion.setAttribute('aria-pressed',String(paused));});
  const curve=document.createElement('section');curve.className='lab-curve';
  curve.innerHTML=`<h2>كيف تتغير النتيجة؟</h2><p>يتغير مدخل واحد على المنحنى، وتبقى بقية المدخلات عند قيمها الحالية. النقطة الملوّنة هي الحالة الحالية. الفراغ يعني أن العلاقة غير صالحة في ذلك المدى.</p><div class="curve-selectors"><label>المدخل <select id="curve-input">${controls.filter(c=>c.type!=='select').map(c=>`<option value="${esc(c.id)}">${esc(c.label_ar)} (${esc(c.unit)})</option>`).join('')}</select></label><label>النتيجة <select id="curve-output">${outputs.map(o=>`<option value="${esc(o.id)}">${esc(o.label_ar)} (${esc(o.unit)})</option>`).join('')}</select></label></div><div class="curve-scroll" id="curve-graphic"></div><p id="curve-caption"></p><div class="table-scroll"><table class="facts"><caption>قيم محسوبة من المنحنى</caption><thead><tr><th>المدخل</th><th>النتيجة</th></tr></thead><tbody id="curve-table"></tbody></table></div>`;
  compare.after(curve);curve.querySelector('#curve-input').value=learn.input;curve.querySelector('#curve-output').value=learn.output;
  const describe=v=>controls.map(c=>`${c.label_ar}: ${c.type==='select'?c.options.find(o=>String(o.value)===String(v[c.id]))?.label_ar:fmt(v[c.id],c.decimals??2)} ${c.unit??''}`).join(' · ');
  function updateCurve(){
    const c=controls.find(c=>c.id===curve.querySelector('#curve-input').value),o=outputs.find(o=>o.id===curve.querySelector('#curve-output').value);if(!c||!o)return;
    const points=sampleModel(compute,values,c,o,outputs),finite=points.filter(p=>p.y!==null),graphic=curve.querySelector('#curve-graphic');
    if(!finite.length){graphic.textContent='لا توجد قيم صالحة في المدى الحالي. غيّر بقية المدخلات.';curve.querySelector('#curve-table').textContent='';return;}
    const lo=c.min??c.from,hi=c.max??c.to;let ymin=Math.min(...finite.map(p=>p.y)),ymax=Math.max(...finite.map(p=>p.y));const pad=(ymax-ymin||Math.max(1,Math.abs(ymax)*.1))*.08;ymin-=pad;ymax+=pad;
    const px=x=>85+(x-lo)/(hi-lo)*620,py=y=>235-(y-ymin)/(ymax-ymin)*190;
    let d='',pen=false;for(const p of points){if(p.y===null){pen=false;continue;}d+=`${pen?'L':'M'}${px(p.x).toFixed(2)},${py(p.y).toFixed(2)} `;pen=true;}
    const cy=current.data?.[o.id];
    graphic.innerHTML=`<svg viewBox="0 0 760 285" role="img" aria-label="${esc(o.label_ar)} مقابل ${esc(c.label_ar)}" style="font-size:18px" dir="ltr"><path d="M85 40V235H705" fill="none" stroke="#64748b" stroke-width="2"/><path d="${d}" fill="none" stroke="#007f79" stroke-width="4"/><text x="76" y="54" text-anchor="end">${axisFmt(ymax)}</text><text x="76" y="237" text-anchor="end">${axisFmt(ymin)}</text><text x="85" y="267">${fmt(lo,2)}</text><text x="705" y="267" text-anchor="end">${fmt(hi,2)}</text>${Number.isFinite(cy)?`<circle cx="${px(values[c.id])}" cy="${py(cy)}" r="7" fill="#be481c" stroke="white" stroke-width="2"/>`:''}</svg>`;
    curve.querySelector('#curve-caption').textContent=`الأفقي: ${c.label_ar} (${c.unit||'بلا وحدة'}) · الرأسي: ${o.label_ar} (${o.unit||'بلا وحدة'}).`;
    curve.querySelector('#curve-table').innerHTML=[lo,values[c.id],hi].map(x=>{const r=evaluateModel(compute,{...values,[c.id]:x},outputs);return `<tr><td><bdi>${fmt(x,c.decimals??2)} ${esc(c.unit)}</bdi></td><td>${r.error?'خارج مجال النموذج':`<bdi>${fmt(r.data[o.id],o.decimals??2)} ${esc(o.unit)}</bdi>`}</td></tr>`;}).join('');
  }
  function apply(){
    const invalid=mount.querySelector('[aria-invalid="true"]');
    current=invalid?{error:`أدخل قيمة صالحة ضمن المدى الظاهر للحقل قبل قراءة النتائج.`}:evaluateModel(compute,values,outputs);status.hidden=!current.error&&!current.warning;status.textContent=current.error||current.warning||'';
    curve.hidden=!!invalid;
    if(gaugeHost)gaugeHost.hidden=!!current.error;if(sceneHost)sceneHost.hidden=!!current.error;compare.querySelector('#lab-pin').disabled=!!current.error;
    for(const o of outputs){document.getElementById(`lab-out-${o.id}`).textContent=current.error?'—':fmt(current.data[o.id],o.decimals??2);const b=baseline.data?.[o.id];document.getElementById(`diff-${o.id}`).textContent=!current.error&&Number.isFinite(b)?`الفرق عن المقارنة: ${current.data[o.id]-b>=0?'+':''}\u2068${fmt(current.data[o.id]-b,o.decimals??2)} ${o.unit||''}\u2069`:'';}
    if(!current.error){gauge?.set(current.data[gSpec.bind]);scene?.update(values,current.data);}
    const o=outputs.find(o=>o.id===learn.output);summary.textContent=current.error?'عدّل المدخلات للعودة إلى مجال الحساب.':`${o.label_ar} الآن: \u2068${fmt(current.data[o.id],o.decimals??2)} ${o.unit||''}\u2069. ${learn.explanation_ar}`;
    compare.querySelector('#lab-baseline').textContent='حالة المقارنة: '+describe(baselineValues);updateCurve();
  }
  const sync=()=>{for(const c of controls){mount.querySelector(`[data-ctl="${c.id}"]`).value=values[c.id];const n=mount.querySelector(`[data-number="${c.id}"]`);if(n){n.value=values[c.id];n.removeAttribute('aria-invalid');}}};
  for(const c of controls){
    const slider=mount.querySelector(`[data-ctl="${c.id}"]`),number=mount.querySelector(`[data-number="${c.id}"]`);
    slider.addEventListener('input',()=>{values[c.id]=c.type==='select'?slider.value:Number(slider.value);if(number){number.value=slider.value;number.removeAttribute('aria-invalid');}apply();});
    number?.addEventListener('input',()=>{if(!number.validity.valid||number.value===''){number.setAttribute('aria-invalid','true');status.hidden=false;status.textContent=`أدخل ${c.label_ar} ضمن المدى ${c.min??c.from} إلى ${c.max??c.to}.`;for(const o of outputs){document.getElementById(`lab-out-${o.id}`).textContent='—';document.getElementById(`diff-${o.id}`).textContent='';}if(gaugeHost)gaugeHost.hidden=true;if(sceneHost)sceneHost.hidden=true;summary.textContent='أكمل المدخل قبل قراءة النتيجة.';compare.querySelector('#lab-pin').disabled=true;return;}number.removeAttribute('aria-invalid');values[c.id]=Number(number.value);slider.value=number.value;apply();});
  }
  for(const button of mount.querySelectorAll('[data-scenario]'))button.addEventListener('click',()=>{Object.assign(values,defaults,learn.scenarios[Number(button.dataset.scenario)].values);sync();apply();});
  compare.querySelector('#lab-pin').addEventListener('click',()=>{if(current.error)return;baseline=current;baselineValues={...values};apply();});
  for(const select of curve.querySelectorAll('select'))select.addEventListener('change',updateCurve);
  document.getElementById('lab-reset')?.addEventListener('click',()=>{Object.assign(values,defaults);baseline=defaultResult;baselineValues={...defaults};sync();apply();});
  apply();return {apply,values,spec,gauge};
}
