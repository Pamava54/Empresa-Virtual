
/* =====================================================================
   EMPRESA VIRTUAL PAMAVA · núcleo de la ruta contable
   Empresas y cifras ficticias, con fines educativos.
   ===================================================================== */

/* ---- 1. CONFIGURACIÓN ---- */
const CFG={
 marca:"PAMAVA soluciones",
 notaMinima:3.5,                 // nota para aprobar una estación (sobre 5.0)
 salt:"PAMAVA-EV|",
 /* Pega aquí tu firebaseConfig cuando lo tengas. Mientras sea null, todo se guarda solo en este equipo. */
 firebaseConfig:{apiKey:"AIzaSyDt7g3908OPnnHOtSXaa48mEQRYyyU58sI",authDomain:"pamava-ruleta.firebaseapp.com",databaseURL:"https://pamava-ruleta-default-rtdb.firebaseio.com",projectId:"pamava-ruleta",storageBucket:"pamava-ruleta.firebasestorage.app",messagingSenderId:"197228563038",appId:"1:197228563038:web:72c6674deeb867979ec2cf"},
 /* Huellas (SHA-256) de los códigos y de la clave docente. Los códigos reales están en Codigos_empresa_virtual.txt */
 hashes:{"codes":["332c7ee4331cf3b378cb0d280628518179c53028a4d500e90cef1cde986a1fd6","1daa6882770808baebd17e4cd93ac613b68a83b0d9625a016a593754d0ae59fa","7b053cce9ce7360027ce3efe893ca3236e651c44f465b633191493c3e5acc9d2","2fe6ef26b972c4e4618e4d97b9b7ba68df689c5350cc053b0868f0617f44609c","f2e03d680d943df1efe2f7db7700e8af33413ebf20896d5ee8246f0a20217fb3","77f454771886fa18e3fbe608ab091fc667a766f81c6388cd62d442398270c195","33a4fe15aa9fd54517b47037ce6680246c00c61640e5bdd4c1902828a989f8f5","aa06cfd6cde4ad5eaae40298f11cbbd9ffd5d3ff44001b29097d6b4351e3caec","a37778d664b9597d6e66f52d2110d9d9b02f06676b93d2969433e0c3b3e4036d","466f461c0fb8d917ad9c14c48a9cc47ed4f033624a49ebaf4e816d9374ce35d8","59496c7e78d1da2012506c2ad8de0eb846f3dc110a1667e4c09e61ae1aa82390","23057f3fe4c73d6ec3dd391e2915009e2649993fa0964cd37c2a8f9547e3fd14","378470043726a481abeecdfd10ed8689ec319ceec7858cd36f42b0081602e01d","55522de45ddea6e37c3bca2d0ff5211051a683507dbdaecf9b2bc4724924f6af","1ac64c702d253a373b0f264cb397ae980804120532d353cbb147ddbb5e4d9891","0e43cb6f8fb4107b53e79afcd24cddc66b516147dac7352bc040f625fe87ca4c","600c8157e4c03fe207b9ca28c09bc504abc89189dc0e162484ccdbfb615a444f","76f69cb2186b961088761476890c5996c1a81ef5459a7848e36b50d3fde2ce90","2433a1e3e2574f1a88ad11db5de7d2b73e17788163ff322e29b07adfd4f20322","90ab92e0f7b668238992b4d061be3d5bff6eef0c973e3359c56edfab6014522a","40f88d6d6868cc64d5e9e3f856a9af446e21e7905e1965af278ca4bffeb5ac0a"],"doc":"19cd1b1a7ad741ce8f02ed1a8dc62a632c5ae8680f77508a05a5abdd195708fb"}
};

const BANCOS=[{n:"Banco Andino",c:"#0f766e"},{n:"Banco Cóndor",c:"#1d4ed8"},{n:"Banco Pijao",c:"#b45309"},{n:"Banco Nevado",c:"#6d28d9"}];
const ESTACIONES=[
 {n:1,ic:"🧾",t:"Asientos contables",d:"Contabiliza los hechos económicos del mes de tu empresa."},
 {n:2,ic:"📚",t:"Libros contables",d:"Pasa tus asientos al libro diario y al mayor, y saca el balance de prueba."},
 {n:3,ic:"🏦",t:"Conciliación bancaria",d:"Concilia el extracto del banco con tu libro de bancos."},
 {n:4,ic:"📦",t:"Inventarios y compras",d:"Lleva el kardex y controla las compras del mes."},
 {n:5,ic:"📊",t:"Estados financieros",d:"Arma los estados financieros con tu balance de prueba."},
 {n:6,ic:"💻",t:"Simulador contable PAMAVA",d:"Registra todo el mes en el programa contable."},
 {n:7,ic:"💸",t:"IVA y retenciones",d:"Calcula retención en la fuente y ReteICA, contabilízalas y arma tu resumen de IVA."},
 {n:8,ic:"👥",t:"Nómina y seguridad social",d:"Liquida la nómina, los aportes y las prestaciones sociales, y contabilízalas."},
 {n:9,ic:"🔒",t:"Ajustes y cierre del período",d:"Registra los ajustes de fin de mes y cierra la contabilidad."}
];

/* 20 empresas fijas para estudiantes (+ la 21, de práctica del docente) */
const EMPRESAS=[
 ["Papelería Aprende S.A.S.","Papelería y útiles escolares"],
 ["Ferretería El Tornillo Ltda.","Ferretería y materiales"],
 ["Minimercado La Esquina S.A.S.","Minimercado y víveres"],
 ["Droguería Vida Sana S.A.S.","Droguería y salud"],
 ["Panadería Pan Caliente","Panadería y pastelería"],
 ["Restaurante Sabor Tolimense S.A.S.","Restaurante de comida típica"],
 ["Moda Joven Boutique S.A.S.","Ropa y accesorios"],
 ["Taller Auto Servicio El Pistón","Taller mecánico y repuestos"],
 ["Consultorio Odontológico Sonrisa S.A.S.","Servicios odontológicos"],
 ["Distribuidora Lácteos del Tolima S.A.S.","Distribución de lácteos"],
 ["Agencia de Viajes Rutas del Tolima","Agencia de viajes y turismo"],
 ["Salón de Belleza Estilo Propio","Peluquería y estética"],
 ["Heladería Dolce Freddo S.A.S.","Heladería y cafetería"],
 ["Cel Express Tecnología S.A.S.","Celulares y accesorios"],
 ["Veterinaria Patitas S.A.S.","Veterinaria y alimentos para mascotas"],
 ["Gimnasio Fuerza Total S.A.S.","Gimnasio y entrenamiento"],
 ["Lavandería Brisa Limpia","Lavandería y tintorería"],
 ["Floristería Pétalos y Más","Floristería y detalles"],
 ["Óptica Visión Clara S.A.S.","Óptica y salud visual"],
 ["Librería El Quijote Ltda.","Librería y papelería"],
 ["Minimercado Pamava (práctica del docente)","Minimercado · empresa de práctica del docente"]
].map((e,i)=>({n:i+1,nombre:e[0],sector:e[1],doc:i===20}));

EMPRESAS.forEach((e,i)=>{e.banco=BANCOS[i%4];e.nit=nit(e.n);const h=hashStr("cta"+e.n);e.cuenta=String(1000+(h%8999))+"-"+String(100000+((h>>>9)%899999));});
/* ---- 2. UTILIDADES ---- */
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
async function sha(s){const b=new TextEncoder().encode(CFG.salt+s.trim().toUpperCase());const h=await crypto.subtle.digest("SHA-256",b);return Array.from(new Uint8Array(h)).map(x=>x.toString(16).padStart(2,"0")).join("");}
function toast(t){const d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2800);}
function nit(n){let h=2166136261;const s="nit"+n;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}h>>>=0;const x=String(900000000+(h%99999999));return x.slice(0,3)+"."+x.slice(3,6)+"."+x.slice(6,9)+"-"+(h%10);}
function fecha(ts){if(!ts)return"—";const d=new Date(ts);return d.toLocaleDateString("es-CO")+" "+d.toLocaleTimeString("es-CO",{hour:"2-digit",minute:"2-digit"});}

/* ---- 3. ALMACENAMIENTO (Firebase si hay configuración; si no, este equipo) ---- */
const Store={
 mode:"local",db:null,err:null,
 async init(){
  if(!CFG.firebaseConfig)return;
  try{
   const load=src=>new Promise((ok,no)=>{const x=document.createElement("script");x.src=src;x.onload=ok;x.onerror=no;document.head.appendChild(x);});
   await load("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
   await load("https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js");
   if(!firebase.apps.length)firebase.initializeApp(CFG.firebaseConfig);
   this.db=firebase.database();this.mode="firebase";
  }catch(e){console.error(e);this.mode="local";this.err="No se pudo cargar Firebase";toast("No se pudo conectar con la nube; se guardará solo en este equipo.");}
 },
 key(n){return"pamava_ev_v1_"+n;},
 ref(n){return this.db.ref("ev_empresas/"+n);},
 fallo(e){console.error(e);this.err=(e&&(e.code||e.message))||"error";toast("⚠ Nube: "+this.err);},
 async get(n){
  if(this.mode==="firebase"){
   try{const s=await this.ref(n).once("value");return s.exists()?s.val():null;}catch(e){this.fallo(e);return null;}
  }
  try{const j=localStorage.getItem(this.key(n));return j?JSON.parse(j):null;}catch(e){return null;}
 },
 async set(n,data){
  data.actualizado=Date.now();
  const limpio=JSON.parse(JSON.stringify(data));
  if(this.mode==="firebase"){try{await this.ref(n).set(limpio);}catch(e){this.fallo(e);}return;}
  try{localStorage.setItem(this.key(n),JSON.stringify(limpio));}catch(e){}
 },
 async del(n){
  try{localStorage.removeItem("pv2_d_ev"+n);localStorage.removeItem("pamava_ev_sim_res_"+n);}catch(e){}
  if(this.mode==="firebase"){try{await this.ref(n).remove();await this.db.ref("ev_sim/"+n).remove();}catch(e){this.fallo(e);}return;}
  try{localStorage.removeItem(this.key(n));}catch(e){}
 },
 async all(){
  const out={};
  if(this.mode==="firebase"){
   try{const s=await this.db.ref("ev_empresas").once("value");const v=s.val()||{};
    for(let n=1;n<=EMPRESAS.length;n++){if(v[n])out[n]=normalizar(v[n]);}}catch(e){this.fallo(e);}
   return out;
  }
  for(const e of EMPRESAS){const d=await this.get(e.n);if(d)out[e.n]=normalizar(d);}
  return out;
 },
 async probar(){
  if(this.mode!=="firebase")return"Modo local: no hay conexión con la nube configurada.";
  try{const r=this.db.ref("ev_meta/ping");await r.set(Date.now());const s=await r.once("value");return s.exists()?"✅ Conectado a la nube (Realtime Database) y con permiso de lectura y escritura.":"⚠ Se escribió pero no se pudo leer.";}
  catch(e){return"❌ Sin acceso: "+(e.code||e.message)+". Revisa las reglas de Realtime Database.";}
 }
};
/* Realtime Database no guarda listas ni objetos vacíos: se reponen al leer */
function normalizar(d){
 if(!d)return d;
 d.estaciones=d.estaciones||{};
 ESTACIONES.forEach(s=>{
  const e=d.estaciones[s.n]||(d.estaciones[s.n]={estado:s.n===1?"abierta":"bloqueada"});
  if(e.nota===undefined)e.nota=null;
  if(!Array.isArray(e.intentos))e.intentos=e.intentos?Object.values(e.intentos):[];
 });
 /* si una estación ya está aprobada y la siguiente quedó bloqueada (datos anteriores a la ampliación), se abre */
 for(let k=2;k<=ESTACIONES.length;k++){if(d.estaciones[k-1].estado==="aprobada"&&d.estaciones[k].estado==="bloqueada")d.estaciones[k].estado="abierta";}
 d.trabajo=d.trabajo||{};
 d.alumno=d.alumno||"";
 return d;
}
function nuevoEstado(){
 const est={};ESTACIONES.forEach(s=>{est[s.n]={estado:s.n===1?"abierta":"bloqueada",nota:null,intentos:[]};});
 return{alumno:"",estaciones:est,trabajo:{},creado:Date.now()};
}
async function cargar(n){let d=await Store.get(n);if(!d){d=nuevoEstado();await Store.set(n,d);}return normalizar(d);}
function progreso(d){return ESTACIONES.filter(s=>d.estaciones[s.n]&&d.estaciones[s.n].estado==="aprobada").length;}
function actual(d){const s=ESTACIONES.find(x=>d.estaciones[x.n].estado==="abierta");return s?s.n:(progreso(d)===ESTACIONES.length?ESTACIONES.length+1:0);}
function aprobar(d,n,nota){
 const e=d.estaciones[n];e.estado="aprobada";e.nota=nota;
 const sig=d.estaciones[n+1];if(sig&&sig.estado==="bloqueada")sig.estado="abierta";
}


/* ---- sesión compartida entre páginas ---- */
function sesionGet(){try{return JSON.parse(sessionStorage.getItem("pamava_ev_ses"));}catch(e){return null;}}
function sesionSet(o){try{if(o)sessionStorage.setItem("pamava_ev_ses",JSON.stringify(o));else sessionStorage.removeItem("pamava_ev_ses");}catch(e){}}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function fmt(n){const s=String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g,".");return(n<0?"-":"")+"$"+s;}
function parseM(s){if(s==null)return 0;s=String(s).trim();if(!s)return 0;const d=s.replace(/[^\d]/g,"");return d?parseInt(d,10):0;}

/* ---- detalle de una evaluación (para el reporte del docente): texto sin cifras + acierto ---- */
function detEv(EV){return EV.qs.map((q,i)=>({k:EV.v+(i+1),t:String(q.t).replace(/[A-Z]{2,3}-\d+/g,"#").replace(/\$\s?\d[\d\.,]*/g,"#").replace(/\b\d{1,3}(?:\.\d{3})+\b/g,"#").replace(/\b(?!20\d\d\b)\d{4,}\b/g,"#").slice(0,120),ok:(EV.ans[i]!==undefined&&q.o[EV.ans[i]]&&q.o[EV.ans[i]].ok)?1:0}));}
