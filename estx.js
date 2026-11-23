/* =====================================================================
   ESTX · armazón común de las estaciones 7, 8 y 9
   Tareas de tipo "form" (casillas con cifras) o "as" (asientos contables),
   con pistas, "Ver solución" tras 2 fallos y evaluación A/B de 5 preguntas.
   ===================================================================== */
let SES=null,EMP=null,D=null,T=null,TAB="guia",EV=null,FB={};
const X={ne:0,key:"",ic:"",titulo:"",tareas:[],defs:{},guia:()=>"",construir:null,sub:()=>"",sigTxt:""};

function guardar(){return Store.set(EMP.n,D);}
function esDoc(){return SES&&SES.rol==="doc";}
function aprobada(){return D.estaciones[X.ne].estado==="aprobada";}
function okT(id){return !!(T[id]&&T[id].ok);}
function listos(){return X.tareas.filter(t=>okT(t.id)).length;}
function completo(){return listos()===X.tareas.length;}
function verOk(o){return !o.ok&&!o.seen&&((o.tries||0)>=2||esDoc());}
function keep(fn){const y=window.scrollY;fn();window.scrollTo(0,y);}
function shuf(arr,seed){const R=mulberry32(seed);const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function numOpts(ok,ds,raw,step){const set=[ok];ds.forEach(x=>{if(x>0&&!set.includes(x))set.push(x);});let q=1;const st=step||(raw?1:1000);while(set.length<4){const x=ok+q*st;if(x>0&&!set.includes(x))set.push(x);q++;}return set.slice(0,4).map(x=>({t:raw?String(x):fmt(x),ok:x===ok}));}
function docHtml(d){
 return`<div class="doc"><div class="dh"><b>${esc(d.tit)}</b><span>No. ${esc(d.num)} · ${esc(d.fecha)}</span></div>
 <div class="dp">${d.partes.map(p=>`<div><span class="mu">${esc(p[0])}:</span> <b>${esc(p[1])}</b></div>`).join("")}</div>
 ${d.filas?`<table><thead><tr><th>Descripción</th><th class="n">Cant.</th><th class="n">Vr. unitario</th><th class="n">Vr. total</th></tr></thead><tbody>${d.filas.map(f=>`<tr><td>${esc(f[0])}</td><td class="n">${f[1]}</td><td class="n">${fmt(f[2])}</td><td class="n">${fmt(f[3])}</td></tr>`).join("")}</tbody></table>`:""}
 <div class="tt">${d.tot.map((t,i)=>`<div class="${i===d.tot.length-1?"t":""}"><span>${esc(t[0])}</span><span>${esc(t[1])}</span></div>`).join("")}</div>
 ${d.nota?`<div class="nt">ℹ️ ${esc(d.nota)}</div>`:""}</div>`;
}

async function estInit(cfg,after){
 Object.assign(X,cfg);
 await Store.init();
 SES=sesionGet();
 if(!SES||!SES.n){location.href="index.html";return;}
 EMP=EMPRESAS[SES.n-1];
 D=await cargar(EMP.n);
 if(D.estaciones[X.ne].estado==="bloqueada"&&!esDoc()){location.href="index.html";return;}
 T=D.trabajo[X.key]=D.trabajo[X.key]||{};
 if(after)await after();
 render();
}

function render(){
 const nl=listos(),nt=X.tareas.length;
 $("#app").innerHTML=`
 <div class="top"><div><span class="brand">PAMAVA soluciones</span><div class="sm mu">${esc(D.alumno||"Docente")} · ${esc(EMP.nombre)}</div></div>
  <button class="gr" onclick="location.href='index.html'">← Volver a la ruta</button></div>
 ${esDoc()?`<div class="note w sm">🧑‍🏫 Modo docente: estás probando la empresa ${EMP.n}. Verás siempre el botón “Ver solución”.</div>`:""}
 <div class="card"><h2>${X.ic} Estación ${X.ne} · ${esc(X.titulo)}</h2>
  <div class="sm mu">Empresa ${EMP.n} · ${esc(EMP.nombre)} · ${esc(X.sub())}</div>
  <div style="margin-top:8px" class="sm mu">Tareas completadas: ${nl} de ${nt}</div><div class="bar"><i style="width:${nl/nt*100}%"></i></div>
  ${aprobada()?`<div class="note"><b>✅ Estación aprobada</b> con nota ${Number(D.estaciones[X.ne].nota).toFixed(1)}. Puedes repasar todo lo que quieras.</div>`:""}
 </div>
 <div class="toolbar" id="tabs">
  <button class="${TAB==="guia"?"":"gr"}" data-t="guia">📘 Guía</button>
  ${X.tareas.map((t,i)=>`<button class="${TAB===t.id?"":"gr"}" data-t="${t.id}">${t.ic||""} ${i+1}. ${esc(t.t)}${okT(t.id)?" ✅":""}</button>`).join("")}
  <button class="${TAB==="eval"?"":"gr"}" data-t="eval">📝 Evaluación</button>
 </div>
 <div id="view"></div>
 <div class="wmk">© ${CFG.marca} · Empresas y cifras ficticias</div>`;
 document.querySelectorAll("#tabs [data-t]").forEach(b=>b.onclick=()=>{TAB=b.dataset.t;EV=null;render();window.scrollTo(0,0);});
 $("#view").innerHTML=TAB==="guia"?X.guia():TAB==="eval"?vEval():vTask(TAB);
 bindX();
}

/* ---------------- tareas ---------------- */
function vTask(id){
 const idx=X.tareas.findIndex(t=>t.id===id),def=X.defs[id];
 if(idx>0&&!okT(X.tareas[idx-1].id)&&!esDoc())return`<div class="card"><h3>🔒 Primero termina la tarea anterior</h3><p class="mu">Completa la tarea “${esc(X.tareas[idx-1].t)}”.</p></div>`;
 const o=T[id]||(T[id]={});
 const sig=X.tareas[idx+1],sigId=sig?sig.id:"eval",sigTxt=sig?("Ir a la tarea "+(idx+2)+" →"):"Ir a la evaluación →";
 return def.tipo==="as"?vAs(id,def,o,sigId,sigTxt):vForm(id,def,o,sigId,sigTxt);
}

/* --- tipo "form": casillas con cifras --- */
function fieldHtml(id,f,o,fb,dis){
 const val=(o.v&&o.v[f.k])||"",cl=fb?(fb[f.k]?"ok":"bad"):"";
 if(f.sel)return`<select data-fx="${id}|${f.k}" class="${cl}" ${dis}>${f.sel.map(s=>`<option value="${s[0]}" ${val===s[0]?"selected":""}>${esc(s[1])}</option>`).join("")}</select>`;
 return`<input inputmode="numeric" data-fx="${id}|${f.k}" value="${esc(val)}" class="${cl}" ${dis}>`;
}
function fexpTxt(f){const e=f.exp();return f.sel?(f.sel.find(s=>s[0]===e)||["",""])[1]:(f.raw?String(e):fmt(e));}
function vForm(id,def,o,sigId,sigTxt){
 o.v=o.v||{};const fb=FB[id],dis=o.ok?"disabled":"",gs=def.groups();
 const cards=gs.map(g=>`<div class="hc">${g.titulo?`<h3><span>${esc(g.titulo)}</span>${g.chip?`<span class="pill">${esc(g.chip)}</span>`:""}</h3>`:""}${g.doc?docHtml(g.doc):""}${g.info?`<div class="sm mu" style="margin:6px 0">${g.info}</div>`:""}
  <div class="g3">${g.fields.map(f=>`<div><label>${esc(f.lab)}</label>${fieldHtml(id,f,o,fb,dis)}</div>`).join("")}</div></div>`).join("");
 const sol=o.seen&&!o.ok?`<div class="note sm"><b>Solución:</b><table style="margin-top:4px">${gs.map(g=>`<tr><td colspan="2"><b>${esc(g.titulo||"")}</b></td></tr>`+g.fields.map(f=>`<tr><td>${esc(f.lab)}</td><td style="text-align:right">${esc(fexpTxt(f))}</td></tr>`).join("")).join("")}</table>Corrige y pulsa Revisar.</div>`:"";
 return`${def.intro?`<div class="note">${def.intro}</div>`:""}${cards}
 <div class="card">${o.ok?`<div class="note sm">✅ ${def.okMsg?def.okMsg():"¡Correcto!"}</div><div class="c"><button data-t2="${sigId}">${sigTxt}</button></div>`:`<div class="toolbar"><button data-chkf="${id}">✔ Revisar</button>${verOk(o)?`<button class="gr" data-seef="${id}">👁 Ver solución</button>`:""}</div>`}
 ${fb&&!o.ok?`<div class="note r sm">Hay valores incorrectos (en rojo). <b>Pista:</b> ${def.pista}</div>`:""}${sol}</div>`;
}
function checkForm(id){
 const def=X.defs[id],o=T[id];o.v=o.v||{};const fb={};let todo=true;
 def.groups().forEach(g=>g.fields.forEach(f=>{const v=o.v[f.k];
  const good=f.sel?(v===f.exp()):(Math.abs(parseM(v)-f.exp())<=(f.tol||0)&&String(v||"").trim()!=="");
  fb[f.k]=good;if(!good)todo=false;}));
 return{fb,todo};
}

/* --- tipo "as": asientos contables --- */
function lineas(id,it){const o=T[id];o.a=o.a||{};if(!o.a[it.id]){o.a[it.id]=[];const n=Math.max(2,it.asiento.length);for(let i=0;i<n;i++)o.a[it.id].push({c:"",d:"",h:""});}return o.a[it.id];}
function evaluarAs(id,it,tol){
 const L=lineas(id,it),t=tol||0;
 const vals=L.map(l=>{const d=parseM(l.d),hh=parseM(l.h);return{c:l.c,s:d>0&&hh===0?"D":(hh>0&&d===0?"H":""),v:d>0?d:hh,lleno:!!(l.c||d||hh)};});
 const used=[],res=vals.map(()=>null);let found=0;
 it.asiento.forEach(e=>{for(let i=0;i<vals.length;i++){if(used[i])continue;const x=vals[i];if(x.c===e.c&&x.s===e.s&&Math.abs(x.v-e.v)<=t){used[i]=1;res[i]=true;found++;break;}}});
 vals.forEach((x,i)=>{if(res[i]===null&&x.lleno)res[i]=false;});
 const llenos=vals.filter(x=>x.lleno).length;
 const sd=vals.filter(x=>x.s==="D").reduce((s,x)=>s+x.v,0),sh=vals.filter(x=>x.s==="H").reduce((s,x)=>s+x.v,0);
 return{ok:found===it.asiento.length&&llenos===it.asiento.length,found,total:it.asiento.length,lineOk:res,cuadra:Math.abs(sd-sh)<=t*2&&sd>0,sd,sh};
}
function vAs(id,def,o,sigId,sigTxt){
 o.iok=o.iok||{};o.it=o.it||{};o.is=o.is||{};
 const items=def.items(),cuentas=def.cuentas||PUCT_LIST;
 const opts=sel=>`<option value="">— cuenta —</option>`+cuentas.map(c=>`<option value="${c}" ${sel===c?"selected":""}>${c} · ${PUCT[c]}</option>`).join("");
 const cards=items.map((it,k)=>{
  const L=lineas(id,it),done=o.iok[it.id],seen=o.is[it.id],fb=(FB[id]||{})[it.id];
  const lns=L.map((l,i)=>{const cl=fb&&fb.lineOk&&fb.lineOk[i]===true?"ok":(fb&&fb.lineOk&&fb.lineOk[i]===false?"bad":"");
   return`<div class="ln"><select data-as="${id}|${it.id}|${i}|c" class="${cl}" ${done?"disabled":""}>${opts(l.c)}</select>
   <input inputmode="numeric" placeholder="Debe" data-as="${id}|${it.id}|${i}|d" value="${esc(l.d)}" class="${cl}" ${done?"disabled":""}>
   <input inputmode="numeric" placeholder="Haber" data-as="${id}|${it.id}|${i}|h" value="${esc(l.h)}" class="${cl}" ${done?"disabled":""}></div>`;}).join("");
  const msg=fb&&!done?`<div class="note r sm">${!fb.cuadra&&(fb.sd||fb.sh)?"El Debe ("+fmt(fb.sd)+") y el Haber ("+fmt(fb.sh)+") no son iguales. ":""}Tienes <b>${fb.found} de ${fb.total}</b> líneas correctas. <b>Pista:</b> ${esc(it.pista)}</div>`:"";
  const puedeVer=!done&&!seen&&((o.it[it.id]||0)>=2||esDoc());
  const sol=seen&&!done?`<div class="note sm"><b>Asiento correcto:</b><table style="margin-top:4px">${it.asiento.map(l=>`<tr><td>${l.c} · ${PUCT[l.c]}</td><td class="n" style="text-align:right">${l.s==="D"?fmt(l.v):""}</td><td class="n" style="text-align:right">${l.s==="H"?fmt(l.v):""}</td></tr>`).join("")}</table></div><div class="note sm">Corrige tu asiento y pulsa <b>✔ Revisar</b>.</div>`:"";
  return`<div class="hc ${done?"done":""}"><h3><span>${k+1}. ${esc(it.t)}</span>${done?`<span class="pill ok">✅ Correcto</span>`:seen?`<span class="pill w">👁 Visto</span>`:""}</h3>
  ${it.doc?docHtml(it.doc):""}${it.desc?`<div class="note sm">${esc(it.desc)}</div>`:""}
  ${it.datos?`<div class="sm" style="margin:6px 0">${it.datos}</div>`:""}
  <div style="margin-top:8px"><b>Tu asiento:</b>${lns}
  ${done?"":`<div class="toolbar"><button class="sec s" data-asadd="${id}|${it.id}">+ línea</button><button data-aschk="${id}|${it.id}">✔ Revisar</button>${puedeVer?`<button class="gr" data-assee="${id}|${it.id}">👁 Ver asiento correcto</button>`:""}</div>`}
  ${msg}${sol}</div></div>`;}).join("");
 const hechos=items.filter(it=>o.iok[it.id]).length;
 return`${def.intro?`<div class="note">${def.intro}</div>`:""}${cards}
 <div class="card c">${o.ok?`<b>✅ ¡Todos los asientos están correctos!</b><div style="margin-top:8px"><button data-t2="${sigId}">${sigTxt}</button></div>`:`<span class="mu">Llevas ${hechos} de ${items.length} asientos correctos.</span>`}</div>`;
}

/* ---------------- evaluación ---------------- */
function vEval(){
 const est=D.estaciones[X.ne];
 if(!completo()&&!esDoc())return`<div class="card"><h3>🔒 La evaluación se abre al completar las tareas</h3><p class="mu">Te faltan ${X.tareas.length-listos()}.</p></div>`;
 if(!EV){const n=est.intentos.filter(x=>!x.manual).length,v=(n%2===0)?"A":"B";EV={v,qs:X.construir(v,hashStr("ev"+X.ne+"-"+EMP.n+v+n)),ans:{},fin:false};}
 const ya=est.estado==="aprobada"?`<div class="note sm">Ya aprobaste esta estación (${Number(est.nota).toFixed(1)}). Puedes presentar la evaluación otra vez para practicar; tu nota aprobada se conserva.</div>`:"";
 const qs=EV.qs.map((q,i)=>{const cl=EV.fin?(EV.ans[i]!==undefined&&q.o[EV.ans[i]].ok?"okq":"badq"):"";
  return`<div class="q ${cl}"><b>${i+1}. ${esc(q.t)}</b>${q.o.map((o,j)=>`<label><input type="radio" name="q${i}" data-q="${i}" value="${j}" ${EV.ans[i]===j?"checked":""} ${EV.fin?"disabled":""}> ${esc(o.t)}</label>`).join("")}${EV.fin?`<div class="sm mu" style="margin-top:6px">💡 ${esc(q.e)}</div>`:""}</div>`;}).join("");
 let res="";
 if(EV.fin){const nota=EV.nota,pasa=nota>=CFG.notaMinima,ultima=X.ne===ESTACIONES.length;
  res=`<div class="card c"><div class="big">${nota.toFixed(1)} <span class="mu" style="font-size:18px">/ 5.0</span></div><h2>${pasa?(ultima?"🏆 ¡Terminaste toda la ruta!":"🎉 ¡Aprobaste la estación "+X.ne+"!"):"Aún no alcanzas "+CFG.notaMinima.toFixed(1)}</h2>
  <p class="mu">${pasa?(ultima?"Completaste las 9 estaciones de la Empresa Virtual. Ya puedes descargar tu constancia.":X.sigTxt):"Repasa tus tareas y presenta la versión "+(EV.v==="A"?"B":"A")+", que trae preguntas diferentes."}</p>
  <div class="toolbar" style="justify-content:center">${pasa?`<button onclick="location.href='index.html'">Ir a la ruta →</button>${ultima?`<button class="sec" onclick="window.open('constancia.html','_blank')">🎓 Ver mi constancia</button>`:""}`:`<button data-retry="1">Intentar de nuevo</button>`}<button class="gr" data-t2="guia">Repasar la guía</button></div></div>`;}
 return`<div class="card"><h3>📝 Evaluación · versión ${EV.v}</h3><p class="sm mu">5 preguntas sobre tu empresa. Cada una vale 1.0. Para pasar necesitas ${CFG.notaMinima.toFixed(1)} o más.</p>${ya}</div>${EV.fin?res:""}${qs}${EV.fin?"":`<div class="c"><button data-send="1">Enviar respuestas</button></div>`}`;
}

/* ---------------- eventos ---------------- */
function bindX(){
 document.querySelectorAll("[data-t2]").forEach(b=>b.onclick=()=>{TAB=b.dataset.t2;EV=null;render();window.scrollTo(0,0);});
 document.querySelectorAll("[data-fx]").forEach(el=>{const ch=()=>{const [id,k]=el.dataset.fx.split("|");T[id].v=T[id].v||{};T[id].v[k]=el.value;el.classList.remove("ok","bad");guardar();};el.oninput=ch;el.onchange=ch;});
 document.querySelectorAll("[data-chkf]").forEach(b=>b.onclick=async()=>{const id=b.dataset.chkf,r=checkForm(id);FB[id]=r.fb;if(r.todo)T[id].ok=1;else T[id].tries=(T[id].tries||0)+1;await guardar();keep(render);});
 document.querySelectorAll("[data-seef]").forEach(b=>b.onclick=async()=>{T[b.dataset.seef].seen=1;await guardar();keep(render);});
 document.querySelectorAll("[data-as]").forEach(el=>{const ch=()=>{const [id,iid,i,f]=el.dataset.as.split("|");const it=X.defs[id].items().find(z=>z.id===iid);lineas(id,it)[+i][f]=el.value;el.classList.remove("ok","bad");guardar();};el.oninput=ch;el.onchange=ch;});
 document.querySelectorAll("[data-asadd]").forEach(b=>b.onclick=()=>{const [id,iid]=b.dataset.asadd.split("|");const it=X.defs[id].items().find(z=>z.id===iid);const L=lineas(id,it);if(L.length<it.asiento.length+3){L.push({c:"",d:"",h:""});guardar();keep(render);}});
 document.querySelectorAll("[data-aschk]").forEach(b=>b.onclick=async()=>{
  const [id,iid]=b.dataset.aschk.split("|");const def=X.defs[id],it=def.items().find(z=>z.id===iid),o=T[id];
  const r=evaluarAs(id,it,def.tol);FB[id]=FB[id]||{};FB[id][iid]=r;
  if(r.ok){o.iok[iid]=1;if(def.items().every(z=>o.iok[z.id]))o.ok=1;}else o.it[iid]=(o.it[iid]||0)+1;
  await guardar();keep(render);});
 document.querySelectorAll("[data-assee]").forEach(b=>b.onclick=async()=>{const [id,iid]=b.dataset.assee.split("|");T[id].is[iid]=1;await guardar();keep(render);});
 document.querySelectorAll("input[data-q]").forEach(r=>r.onchange=()=>{EV.ans[+r.dataset.q]=+r.value;});
 const sd=document.querySelector("[data-send]");if(sd)sd.onclick=async()=>{
  if(Object.keys(EV.ans).length<EV.qs.length){toast("Responde las 5 preguntas.");return;}
  let ok=0;EV.qs.forEach((q,i)=>{if(q.o[EV.ans[i]].ok)ok++;});
  EV.nota=ok;EV.fin=true;const est=D.estaciones[X.ne];est.intentos.push({v:EV.v,nota:ok,fecha:Date.now(),det:detEv(EV)});
  if(ok>=CFG.notaMinima&&est.estado!=="aprobada")aprobar(D,X.ne,ok);
  await guardar();keep(render);window.scrollTo(0,0);};
 const rt=document.querySelector("[data-retry]");if(rt)rt.onclick=()=>{EV=null;render();window.scrollTo(0,0);};
}
