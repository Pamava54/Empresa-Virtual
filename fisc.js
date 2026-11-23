/* =====================================================================
   FISC · parámetros tributarios y laborales (Colombia, 2026) y generadores
   de las estaciones 7 (IVA y retenciones), 8 (nómina) y 9 (ajustes y cierre).
   Empresas y cifras ficticias, con fines educativos.
   Si cambia una norma, se ajusta aquí en un solo lugar.
   ===================================================================== */
const FISC={
 uvt:52374,            // UVT 2026 (Resolución DIAN 000238 de 2025)
 smmlv:1750905,        // salario mínimo 2026 (Decreto 1469 de 2025)
 aux:249095,           // auxilio de transporte 2026 (Decreto 1470 de 2025)
 baseCompras:10, tarCompras:0.025,   // retención en compras: base 10 UVT, 2,5 % (declarantes)
 baseArr:10, tarArr:0.035,           // arrendamiento de inmuebles: base 10 UVT, 3,5 %
 tarIca:0.007,                       // ReteICA: tarifa DIDÁCTICA (en la vida real depende del municipio)
 saludE:0.04, pensionEmp:0.04,       // aportes del trabajador
 pensionE:0.12, arl:0.00522, caja:0.04, // aportes del empleador (riesgo I)
 ces:0.0833, intCes:0.01, prima:0.0833, vac:0.0417,
 renta:0.35, depMeses:36, provCartera:0.01
};
FISC.minBase=FISC.baseCompras*FISC.uvt;   // 523.740

const PUCX={
 "139905":"Provisión de deudores (cartera)","159220":"Depreciación acumulada – equipo de cómputo",
 "233550":"Servicios públicos por pagar","236530":"Retención en la fuente – arrendamientos",
 "236540":"Retención en la fuente – compras","236801":"ReteICA – impuesto de industria y comercio retenido",
 "237005":"Aportes a EPS (salud) por pagar","237006":"Aportes a ARL por pagar","237010":"Aportes a cajas de compensación por pagar",
 "238030":"Aportes a fondos de pensiones por pagar","240405":"Impuesto de renta por pagar",
 "250505":"Salarios por pagar","251005":"Cesantías consolidadas","251505":"Intereses sobre cesantías por pagar",
 "252005":"Prima de servicios por pagar","252505":"Vacaciones por pagar","360505":"Utilidad del ejercicio",
 "415595":"Ingresos por prestación de servicios","510527":"Auxilio de transporte","510530":"Cesantías (gasto)",
 "510533":"Intereses sobre cesantías (gasto)","510536":"Prima de servicios (gasto)","510539":"Vacaciones (gasto)",
 "510568":"Aportes a ARL (gasto)","510570":"Aportes a fondos de pensiones (gasto)","510572":"Aportes a cajas de compensación (gasto)",
 "516020":"Depreciación – equipo de cómputo","519910":"Provisión de cartera (gasto)","523560":"Publicidad y propaganda",
 "540505":"Impuesto de renta y complementarios","590505":"Ganancias y pérdidas"
};
const PUCT=Object.assign({},PUC,PUCX);
const PUCT_LIST=Object.keys(PUCT).sort();
const rd=x=>Math.round(x);

/* ---------------- ESTACIÓN 7 · IVA Y RETENCIONES ---------------- */
function ivaRet(n){
 const M=generarMes(n),H=k=>M.hechos.find(h=>h.k===k);
 const ops=[];
 const compra=(k,cuenta,nom,pago)=>{const h=H(k);const base=h.asiento.find(l=>l.c===cuenta).v,iva=h.asiento.find(l=>l.c==="240802").v;
  const ap=base>=FISC.minBase,rf=ap?rd(base*FISC.tarCompras):0,ica=ap?rd(base*FISC.tarIca):0,tot=base+iva;
  const as=[{c:cuenta,s:"D",v:base},{c:"240802",s:"D",v:iva}];
  if(rf)as.push({c:"236540",s:"H",v:rf});if(ica)as.push({c:"236801",s:"H",v:ica});
  as.push({c:pago,s:"H",v:tot-rf-ica});
  return{k,id:h.id,t:nom+" · "+h.doc.num,doc:h.doc,tercero:(h.vals&&h.vals.prov)||"Tecnología y Equipos del Tolima",tipo:"compra",base,iva,tot,ap,rf,ica,neto:tot-rf-ica,asiento:as,pago,
   pista:"Calcula la retención sobre la base (sin IVA). Va al Haber en retención en la fuente y en ReteICA; lo que se le paga o se le debe al tercero es el total menos las retenciones."};};
 ops.push(compra("compraCred1","143505","Compra de mercancía a crédito","220505"));
 ops.push(compra("compraCont","143505","Compra de mercancía de contado (cheque)","111005"));
 ops.push(compra("compraCred2","143505","Compra de mercancía a crédito","220505"));
 ops.push(compra("equipo","152805","Compra de computador a crédito","220505"));
 {const h=H("arriendo"),base=h.asiento[0].v,ap=base>=FISC.baseArr*FISC.uvt,rf=ap?rd(base*FISC.tarArr):0,ica=ap?rd(base*FISC.tarIca):0;
  const as=[{c:"512010",s:"D",v:base}];if(rf)as.push({c:"236530",s:"H",v:rf});if(ica)as.push({c:"236801",s:"H",v:ica});as.push({c:"111005",s:"H",v:base-rf-ica});
  ops.push({k:"arriendo",id:h.id,t:"Pago del arriendo · "+h.doc.num,doc:h.doc,tercero:"Inmobiliaria Centro Ibagué",tipo:"arriendo",base,iva:0,tot:base,ap,rf,ica,neto:base-rf-ica,asiento:as,pago:"111005",
   pista:"El arriendo de un inmueble tiene retención del 3,5 % si el pago llega a la base mínima. Se le paga al arrendador el valor menos las retenciones."});}
 const ivaGen=M.hechos.reduce((s,h)=>s+h.asiento.filter(l=>l.c==="240801").reduce((a,l)=>a+l.v,0),0);
 const ivaDesc=M.hechos.reduce((s,h)=>s+h.asiento.filter(l=>l.c==="240802").reduce((a,l)=>a+l.v,0),0);
 const rfCompras=ops.filter(o=>o.tipo==="compra").reduce((s,o)=>s+o.rf,0),rfArr=ops.filter(o=>o.tipo==="arriendo").reduce((s,o)=>s+o.rf,0);
 const icaTot=ops.reduce((s,o)=>s+o.ica,0);
 const saldo=ivaGen-ivaDesc;
 /* asientos que se piden (la 1.ª compra de mercancía que sí retiene, el computador y el arriendo) */
 const merc=ops.filter(o=>o.tipo==="compra"&&o.k!=="equipo");
 const a1=merc.find(o=>o.ap)||merc[0];
 const pedir=[a1,ops.find(o=>o.k==="equipo"),ops.find(o=>o.k==="arriendo")];
 return{n,empresa:M.emp.nombre,ops,ivaGen,ivaDesc,saldo,rfCompras,rfArr,rfTot:rfCompras+rfArr,icaTot,minBase:FISC.minBase,pedir,prod:M.prod};
}

/* ---------------- ESTACIÓN 8 · NÓMINA ---------------- */
function nomina(n){
 const R=mulberry32(hashStr("nom"+n)),M=generarMes(n);
 const nom=["Laura Gómez","Camilo Vargas","Sandra Díaz","Andrés Rojas","Marcela Ruiz","Julián Prada","Paola Reyes","Diego Salazar","Natalia Cruz","Felipe Ortiz","Carolina Mora","Sebastián Pardo"];
 const car=["Auxiliar de ventas","Auxiliar administrativo","Coordinador de punto de venta","Auxiliar de bodega","Cajero","Asesor comercial"];
 const pick=(a,k)=>a[(Math.floor(R()*a.length)+k)%a.length];
 const sals=[FISC.smmlv,Math.round(FISC.smmlv*(1.2+R()*0.7)/50000)*50000,Math.round(FISC.smmlv*(2.05+R()*0.35)/50000)*50000];
 const empl=sals.map((sal,i)=>{const aux=sal<=2*FISC.smmlv?FISC.aux:0,salud=rd(sal*FISC.saludE),pen=rd(sal*FISC.pensionEmp);
  return{nombre:nom[(hashStr("e"+n+i)+i*3)%nom.length],cargo:car[(hashStr("c"+n+i)+i)%car.length],sal,aux,dev:sal+aux,salud,pen,ded:salud+pen,neto:sal+aux-salud-pen};});
 // evitar nombres repetidos
 const usados=new Set();empl.forEach((e,i)=>{let k=0;while(usados.has(e.nombre)){e.nombre=nom[(hashStr("e"+n+i)+i*3+(++k))%nom.length];}usados.add(e.nombre);});
 const S=empl.reduce((s,e)=>s+e.sal,0),A=empl.reduce((s,e)=>s+e.aux,0),DEV=S+A;
 const salud=empl.reduce((s,e)=>s+e.salud,0),pen=empl.reduce((s,e)=>s+e.pen,0),neto=DEV-salud-pen;
 const penE=rd(S*FISC.pensionE),arl=rd(S*FISC.arl),caja=rd(S*FISC.caja);
 const ces=rd(DEV*FISC.ces),intc=rd(ces*FISC.intCes),prima=rd(DEV*FISC.prima),vac=rd(S*FISC.vac);
 const pila=salud+pen+penE+arl+caja;
 const as=[
  {id:"caus",t:"Causación de la nómina del mes",desc:"Se reconoce el gasto de sueldos y auxilio de transporte, lo descontado a los trabajadores (salud y pensión) y lo que queda por pagarles.",
   asiento:[{c:"510506",s:"D",v:S},{c:"510527",s:"D",v:A},{c:"237005",s:"H",v:salud},{c:"238030",s:"H",v:pen},{c:"250505",s:"H",v:neto}],
   pista:"Gasto (Debe): sueldos y auxilio de transporte. Haber: lo descontado al trabajador (salud y pensión) y el neto que se le debe (Salarios por pagar)."},
  {id:"pago",t:"Pago de la nómina por transferencia",desc:"Se paga a los trabajadores el neto desde el banco.",
   asiento:[{c:"250505",s:"D",v:neto},{c:"111005",s:"H",v:neto}],
   pista:"La deuda de salarios por pagar baja (Debe) y sale plata del banco (Haber)."},
  {id:"aportes",t:"Aportes del empleador (pensión, ARL y caja)",desc:"La empresa asume el 12 % de pensión, la ARL y el 4 % de la caja de compensación. Por ser sociedad y pagar menos de 10 salarios mínimos por trabajador, está exonerada de salud (8,5 %), SENA y ICBF.",
   asiento:[{c:"510570",s:"D",v:penE},{c:"510568",s:"D",v:arl},{c:"510572",s:"D",v:caja},{c:"238030",s:"H",v:penE},{c:"237006",s:"H",v:arl},{c:"237010",s:"H",v:caja}],
   pista:"Son gastos de la empresa (Debe: aportes a pensión, ARL y caja) y quedan por pagar (Haber)."},
  {id:"pila",t:"Pago de la seguridad social (planilla PILA)",desc:"Se paga desde el banco lo que se debe a salud, pensión, ARL y caja: lo descontado al trabajador más lo que aporta el empleador.",
   asiento:[{c:"237005",s:"D",v:salud},{c:"238030",s:"D",v:pen+penE},{c:"237006",s:"D",v:arl},{c:"237010",s:"D",v:caja},{c:"111005",s:"H",v:pila}],
   pista:"Se cancelan los pasivos (Debe): salud 4 %, pensión 4 % + 12 %, ARL y caja. Sale plata del banco (Haber) por el total."},
  {id:"prest",t:"Provisión de prestaciones sociales del mes",desc:"Cada mes se reconoce el gasto de cesantías, intereses, prima y vacaciones, aunque se paguen después.",
   asiento:[{c:"510530",s:"D",v:ces},{c:"510533",s:"D",v:intc},{c:"510536",s:"D",v:prima},{c:"510539",s:"D",v:vac},{c:"251005",s:"H",v:ces},{c:"251505",s:"H",v:intc},{c:"252005",s:"H",v:prima},{c:"252505",s:"H",v:vac}],
   pista:"Cada prestación es un gasto (Debe) y a la vez un pasivo (Haber) en su cuenta por pagar."}];
 return{n,empresa:M.emp.nombre,empl,S,A,DEV,salud,pen,neto,penE,arl,caja,ces,intc,prima,vac,pila,asientos:as,costoTotal:DEV+penE+arl+caja+ces+intc+prima+vac};
}

/* ---------------- ESTACIÓN 9 · AJUSTES Y CIERRE ---------------- */
function cierre(n){
 const M=generarMes(n),E=estados(n),er=E.er,f=E.esf;
 const eq=M.hechos.find(h=>h.k==="equipo").asiento[0].v;
 const ene=M.hechos.find(h=>h.k==="energia").asiento[0].v;
 let meses=FISC.depMeses;if(rd(eq/meses)>0.30*er.un)meses=60;   // empresas de utilidad pequeña: vida útil de 5 años
 const dep=rd(eq/meses);
 const acu=Math.max(1000,Math.min(Math.round(ene*0.5/1000)*1000,Math.floor(0.08*er.un/1000)*1000));
 const prov=Math.min(rd(f.cli*FISC.provCartera),Math.floor(0.08*er.un));
 const uai=er.un-dep-acu-prov,renta=Math.max(0,rd(uai*FISC.renta)),un=uai-renta;
 const aj=[
  {id:"dep",t:"Depreciación del computador (octubre)",desc:"El computador costó "+fmt(eq)+" y se depreciará en "+meses+" meses por línea recta. Registra la depreciación de un mes.",
   asiento:[{c:"516020",s:"D",v:dep},{c:"159220",s:"H",v:dep}],pista:"Depreciación mensual = costo ÷ "+meses+". Es un gasto (Debe) y disminuye el activo por la depreciación acumulada (Haber)."},
  {id:"acu",t:"Causación del acueducto de octubre",desc:"Llegó el aviso del servicio de agua de octubre por "+fmt(acu)+" y todavía no se ha pagado. El gasto es de octubre aunque se pague después.",
   asiento:[{c:"513525",s:"D",v:acu},{c:"233550",s:"H",v:acu}],pista:"Gasto de acueducto (Debe) y una cuenta por pagar de servicios públicos (Haber)."},
  {id:"prov",t:"Provisión de cartera (1 % de Clientes)",desc:"Por prudencia, la empresa provisiona el "+(FISC.provCartera*100)+" % de lo que le deben los clientes ("+fmt(f.cli)+").",
   asiento:[{c:"519910",s:"D",v:prov},{c:"139905",s:"H",v:prov}],pista:"Provisión = Clientes × 1 %. Gasto (Debe) y una cuenta que disminuye la cartera (Haber)."},
  {id:"renta",t:"Impuesto de renta del período (35 %)",desc:"Utilidad antes de impuestos con los ajustes: "+fmt(uai)+". Se provisiona el impuesto de renta a la tarifa del 35 %.",
   asiento:[{c:"540505",s:"D",v:renta},{c:"240405",s:"H",v:renta}],pista:"Impuesto = utilidad antes de impuestos × 35 %. Gasto (Debe) y pasivo por pagar (Haber)."}];
 const ing=er.ing,ifin=er.ifin;
 const gast=[["613595",er.cos],["510506",er.suel],["512010",er.arr],["513530",er.ene],["513535",er.tel],["519530",er.uti],["530505",er.gfin],["513525",acu],["516020",dep],["519910",prov],["540505",renta]].filter(x=>x[1]>0);
 const totG=gast.reduce((s,x)=>s+x[1],0);
 const cl=[
  {id:"ci",t:"Cierre de las cuentas de ingresos",desc:"Los ingresos se cancelan contra la cuenta Ganancias y pérdidas.",
   asiento:[{c:"413595",s:"D",v:ing}].concat(ifin>0?[{c:"421005",s:"D",v:ifin}]:[]).concat([{c:"590505",s:"H",v:ing+ifin}]),pista:"Las cuentas de ingresos tienen saldo en el Haber: para cancelarlas se debitan, y el total se acredita en Ganancias y pérdidas."},
  {id:"cg",t:"Cierre de costos y gastos",desc:"Los costos y gastos (incluidos los ajustes y el impuesto) se cancelan contra Ganancias y pérdidas.",
   asiento:[{c:"590505",s:"D",v:totG}].concat(gast.map(x=>({c:x[0],s:"H",v:x[1]}))),pista:"Los gastos tienen saldo en el Debe: se acreditan para cancelarlos y el total se debita en Ganancias y pérdidas."},
  {id:"ct",t:"Traslado de la utilidad al patrimonio",desc:"El saldo de Ganancias y pérdidas es la utilidad del período: se traslada a Utilidad del ejercicio.",
   asiento:[{c:"590505",s:"D",v:un},{c:"360505",s:"H",v:un}],pista:"Ganancias y pérdidas queda con saldo en el Haber (utilidad): se debita y se acredita Utilidad del ejercicio."}];
 const activos=f.act-dep-prov,pasivos=f.pas+acu+renta,patrimonio=f.cap+un;
 return{n,empresa:M.emp.nombre,eq,meses,dep,acu,prov,uai,renta,un,ing,ifin,gast,totG,ajustes:aj,cierres:cl,activos,pasivos,patrimonio,cuadra:activos===pasivos+patrimonio,cli:f.cli,unAntes:er.un,tarifa:FISC.renta};
}
