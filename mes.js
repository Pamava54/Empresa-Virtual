/* =====================================================================
   MES DE OPERACIONES · generador de hechos económicos por empresa
   Cada empresa vive el mismo mes (octubre de 2026) con cifras propias.
   Las demás estaciones (libros, conciliación, inventarios, estados) usan estos mismos hechos.
   Empresas y cifras ficticias, con fines educativos.
   ===================================================================== */

const PUC={
 "110505":"Caja general","111005":"Bancos – Moneda nacional","130505":"Clientes nacionales",
 "143505":"Mercancías no fabricadas por la empresa","152805":"Equipos de procesamiento de datos",
 "220505":"Proveedores nacionales","240801":"IVA generado","240802":"IVA descontable",
 "310505":"Capital autorizado (capital suscrito y pagado)","413595":"Ingresos por venta de mercancías",
 "510506":"Sueldos","512010":"Arrendamientos – construcciones y edificaciones","513525":"Acueducto y alcantarillado",
 "513530":"Energía eléctrica","513535":"Teléfono e internet","519530":"Útiles, papelería y fotocopias",
 "421005":"Ingresos financieros – intereses","530505":"Gastos bancarios","613595":"Costo de ventas – comercio"
};
const PUC_LIST=Object.keys(PUC).sort();

const FLAVOR={
 1:["útiles escolares y papelería",["Distribuidora Norma Útiles","Papeles del Tolima Ltda.","Importadora Escolar S.A.S."],["Colegio San Simón","Jardín Los Pitufos"]],
 2:["materiales de ferretería y construcción",["Aceros del Centro S.A.","Pinturas Colorín S.A.S.","Distribuidora Herramax"],["Constructora Horizonte","Obras y Diseños S.A.S."]],
 3:["víveres y abarrotes",["Lácteos La Pradera","Distribuidora Alimentos del Sur","Bebidas Nacional S.A."],["Restaurante El Fogón","Hotel Real Ibagué"]],
 4:["medicamentos y productos de salud",["Laboratorios Andes","Mayorista Salud Total","Cosméticos Belleza Pura"],["Clínica San José","Hogar Geriátrico Esperanza"]],
 5:["harinas, lácteos e insumos de panadería",["Harinas del Tolima","Lácteos La Pradera","Empaques y Más S.A.S."],["Cafetería Aroma","Colegio Santa Ana"]],
 6:["carnes, verduras e insumos de cocina",["Carnes Frescas Ltda.","Plaza Mayorista de Ibagué","Gases del Centro S.A."],["Empresa Eventos Pijao","Hotel Campestre"]],
 7:["prendas de vestir y accesorios",["Confecciones Primavera","Textiles Andinos","Calzado Colombia S.A."],["Colegio Técnico Industrial","Cliente Laura Gómez"]],
 8:["repuestos y lubricantes",["Autopartes del Valle","Lubricantes Andinos","Llantas y Rines S.A.S."],["Transportes Andinos","Flota Taxis Ibagué"]],
 9:["insumos odontológicos",["Dental Supply S.A.S.","Laboratorio Prótesis Ibagué","Insumos Médicos del Centro"],["Medicina prepagada convenio","Empresa convenio Textiles"]],
 10:["productos lácteos",["Ganaderos Unidos","Empaques Plásticos S.A.","Combustibles del Tolima"],["Supermercado El Ahorro","Cafetería Aroma"]],
 11:["paquetes y servicios turísticos",["Hotel Cañón del Combeima","Transportes Turísticos Andes","Operador Mayorista Colombia"],["Grupo familiar Pérez","Colegio Santa Ana"]],
 12:["productos de belleza y capilares",["Cosméticos Belleza Pura","Distribuidora Capilar","Insumos Estéticos S.A.S."],["Empresa Eventos Luna","Cliente Sandra Díaz"]],
 13:["helados, café y desechables",["Lácteos La Pradera","Café Selecto S.A.","Desechables y Empaques"],["Colegio Santa Ana","Eventos Infantiles Arcoíris"]],
 14:["celulares y accesorios",["Importadora Tech Mundo","Accesorios Digitales S.A.S.","Distribuidora Móvil del Sur"],["Empresa Seguridad Total","Cliente Camilo Vargas"]],
 15:["alimentos y accesorios para mascotas",["Concentrados del Sur","Distribuidora Mascotas S.A.S.","Laboratorio Veterinario Andes"],["Criadero Los Pinos","Cliente Marcela Ruiz"]],
 16:["suplementos y equipos de entrenamiento",["Nutrición Deportiva S.A.","Equipos Fitness Colombia","Distribuidora Vital"],["Empresa convenio Textiles","Colegio Técnico Industrial"]],
 17:["insumos de lavandería",["Químicos del Centro","Detergentes Brisa S.A.S.","Empaques y Más S.A.S."],["Hotel Real Ibagué","Clínica San José"]],
 18:["flores e insumos de floristería",["Flores del Tolima","Cultivos La Sabana","Empaques y Más S.A.S."],["Eventos Luna","Hotel Campestre"]],
 19:["monturas y lentes",["Ópticas Mayorista S.A.","Lentes Andinos","Estuches y Accesorios S.A.S."],["Empresa convenio Textiles","Colegio Santa Ana"]],
 20:["libros y papelería",["Editorial Andina","Distribuidora de Libros del Sur","Papeles del Tolima Ltda."],["Colegio San Simón","Biblioteca Municipal"]],
 21:["víveres y abarrotes",["Lácteos La Pradera","Distribuidora Alimentos del Sur","Bebidas Nacional S.A."],["Restaurante El Fogón","Hotel Real Ibagué"]]
};

function nitDe(texto){const h=hashStr("nit"+texto);const x=String(800000000+(h%199999999));return x.slice(0,3)+"."+x.slice(3,6)+"."+x.slice(6,9)+"-"+(h%10);}
const MESX={nom:"octubre",Nom:"Octubre",abr:"oct.",anio:2026,ronda:0,ant:"Septiembre"};
function dia(d){return String(d).padStart(2,"0")+" "+MESX.abr+" "+MESX.anio;}

function generarMes(n){
 const R=mulberry32(hashStr("mes#"+n+(MESX.ronda?"r"+MESX.ronda:"")));
 const ri=(a,b)=>a+Math.floor(R()*(b-a+1));
 const F=FLAVOR[n],prod=F[0],PV=F[1],CL=F[2];
 const emp=EMPRESAS[n-1];
 const esc=1.2+R()*0.9;
 const rr=(lo,hi,step)=>Math.max(step,Math.round((lo+R()*(hi-lo))*esc/step)*step);
 const iva=b=>Math.round(b*0.19);
 const miNit=emp.nit;
 let fc=ri(100,800),fv=ri(1000,4000),ce=ri(200,900),rc=ri(300,900),ck=ri(1010,3900);

 // ---- cifras base ----
 const q1=ri(12,60),u1=rr(8000,60000,50),c1=q1*u1;
 const q2=ri(8,40),u2=rr(9000,70000,50),c2=q2*u2;
 const q3=ri(10,50),u3=rr(8000,65000,50),c3=q3*u3;
 const Pc=c1+c2+c3;
 const S=Math.round(Pc*0.95/1000)*1000;
 // ---- ventas en unidades (para el kardex): precio de venta por unidad y cantidades ----
 const QT=q1+q2+q3,avg0=Pc/QT;
 const pv=Math.max(50,Math.round(avg0*(1.30+R()*0.2)/50)*50);
 const Qs=Math.max(8,Math.round(S/pv));
 const cap=Math.floor(0.85*(q1+q2));
 const eu0=Math.min(Math.round(Qs*0.72),cap);
 const qs1=Math.max(2,Math.round(eu0*30/72)),qs2=Math.max(2,Math.round(eu0*22/72)),qs3=Math.max(2,eu0-qs1-qs2);
 const eu=qs1+qs2+qs3;
 const qs4=Math.max(2,Math.min(Math.round(eu*28/72),QT-eu-Math.max(2,Math.floor(0.1*QT))));
 const s1=qs1*pv,s2=qs2*pv,s3=qs3*pv,s4=qs4*pv;
 const tot=b=>b+iva(b);
 const sTotal=s1+s2+s3+s4;
 const KD=calcKardex({q1,u1,q2,u2,q3,u3,qs1,qs2,qs3,qs4});
 const costo=KD.costo;
 const eq=rr(1200000,3500000,10000);
 // gastos del mes en proporción a la utilidad bruta (para que la empresa tenga un resultado realista)
 const ub=sTotal-costo,gt=ub*(0.50+R()*0.22),fl=Math.min(1,gt/400000);
 const arr=Math.max(Math.round(100000*fl/1000)*1000,Math.round(gt*0.30/10000)*10000),nom=Math.max(Math.round(200000*fl/1000)*1000,Math.round(gt*0.42/10000)*10000),ene=Math.max(Math.round(40000*fl/1000)*1000,Math.round(gt*0.12/1000)*1000),net=Math.max(Math.round(30000*fl/1000)*1000,Math.round(gt*0.10/1000)*1000),util=Math.max(Math.round(15000*fl/1000)*1000,Math.round(gt*0.06/1000)*1000);
 const pagoProv=Math.round(tot(c1)*0.6/1000)*1000;
 const cobro1=Math.round(tot(s1)*0.5/1000)*1000;
 const cobro2=Math.round(tot(s4)*0.4/1000)*1000;
 const Ac=rr(1500000,3000000,50000);
 const consig=Math.round(0.6*(Ac+tot(s2))/1000)*1000;
 const bankOut=tot(c2)+pagoProv+arr+ene+net+nom;
 const Ab=Math.ceil((bankOut+500000)/100000)*100000;
 const capital=Ac+Ab;

 const H=[];
 const add=h=>{h.id=H.length+1;H.push(h);return h;};
 const P=(a,b)=>[a,b];
 const filaBase=(desc,q,u)=>[[desc,q,u,q*u]];
 const D=(tit,num,d,partes,filas,tt,nota)=>({tit,num,fecha:dia(d),partes,filas,tot:tt,nota});

 add({k:"aportes",dia:1,t:"Constitución: aportes de los socios",
  doc:D("ACTA DE CONSTITUCIÓN · RECIBO DE APORTES","AC-001",1,[P("Empresa",emp.nombre),P("NIT",miNit),P("Socios","Aportes iniciales"),P("Fecha",dia(1))],null,
   [["Aporte en efectivo (caja)",fmt(Ac)],["Aporte consignado en banco",fmt(Ab)],["Capital total aportado",fmt(capital)]],"Los socios aportan para iniciar operaciones. El efectivo queda en la caja y el resto en la cuenta bancaria."),
  asiento:[{c:"110505",s:"D",v:Ac},{c:"111005",s:"D",v:Ab},{c:"310505",s:"H",v:capital}],
  pista:"Lo que entra a la empresa va al Debe (caja y bancos). Lo que aportan los socios se acredita en el capital."});

 add({k:"compraCred1",dia:2,t:"Compra de "+prod+" a crédito",
  doc:D("FACTURA DE COMPRA","FC-"+(fc++),2,[P("Proveedor",PV[0]),P("NIT proveedor",nitDe(PV[0])),P("Comprador",emp.nombre),P("Forma de pago","Crédito a 30 días")],
   filaBase("Mercancía: "+prod,q1,u1),[["Subtotal",fmt(c1)],["IVA 19%",fmt(iva(c1))],["TOTAL A PAGAR",fmt(tot(c1))]]),
  asiento:[{c:"143505",s:"D",v:c1},{c:"240802",s:"D",v:iva(c1)},{c:"220505",s:"H",v:tot(c1)}],
  pista:"La mercancía entra a inventarios por su valor sin IVA. El IVA de la compra es descontable (Debe). Se debe el total al proveedor.",
  vals:{prov:PV[0],base:c1,iva:iva(c1),total:tot(c1)}});

 add({k:"compraCont",dia:3,t:"Compra de "+prod+" de contado (cheque)",
  doc:D("FACTURA DE COMPRA","FC-"+(fc++),3,[P("Proveedor",PV[1]),P("NIT proveedor",nitDe(PV[1])),P("Comprador",emp.nombre),P("Forma de pago","Contado · cheque No. "+(ck++)+" ("+emp.banco.n+")")],
   filaBase("Mercancía: "+prod,q2,u2),[["Subtotal",fmt(c2)],["IVA 19%",fmt(iva(c2))],["TOTAL PAGADO",fmt(tot(c2))]]),
  asiento:[{c:"143505",s:"D",v:c2},{c:"240802",s:"D",v:iva(c2)},{c:"111005",s:"H",v:tot(c2)}],
  pista:"Igual que la compra a crédito, pero como se pagó con cheque sale plata del banco (Haber).",
  vals:{prov:PV[1],base:c2,iva:iva(c2),total:tot(c2)}});

 add({k:"ventaEf",dia:5,t:"Venta de contado en efectivo",
  doc:D("FACTURA DE VENTA","FV-"+(fv++),5,[P("Vendedor",emp.nombre),P("NIT",miNit),P("Cliente","Ventas de mostrador"),P("Forma de pago","Contado · efectivo")],
   filaBase("Venta de "+prod,qs2,pv),[["Subtotal",fmt(s2)],["IVA 19%",fmt(iva(s2))],["TOTAL RECIBIDO",fmt(tot(s2))]]),
  asiento:[{c:"110505",s:"D",v:tot(s2)},{c:"413595",s:"H",v:s2},{c:"240801",s:"H",v:iva(s2)}],
  pista:"Entra efectivo (Debe en caja por el total). La venta es un ingreso y el IVA cobrado es IVA generado, ambos en el Haber.",
  vals:{base:s2,iva:iva(s2),total:tot(s2)}});

 add({k:"ventaCred1",dia:6,t:"Venta a crédito a "+CL[0],
  doc:D("FACTURA DE VENTA","FV-"+(fv++),6,[P("Vendedor",emp.nombre),P("NIT",miNit),P("Cliente",CL[0]),P("Forma de pago","Crédito a 30 días")],
   filaBase("Venta de "+prod,qs1,pv),[["Subtotal",fmt(s1)],["IVA 19%",fmt(iva(s1))],["TOTAL A COBRAR",fmt(tot(s1))]]),
  asiento:[{c:"130505",s:"D",v:tot(s1)},{c:"413595",s:"H",v:s1},{c:"240801",s:"H",v:iva(s1)}],
  pista:"Como no se cobra todavía, no entra plata: el cliente nos debe (Clientes, en el Debe por el total).",
  vals:{cli:CL[0],base:s1,iva:iva(s1),total:tot(s1)}});

 add({k:"arriendo",dia:8,t:"Pago del arriendo del local",
  doc:D("COMPROBANTE DE EGRESO","CE-"+(ce++),8,[P("Pagado a","Inmobiliaria Centro Ibagué"),P("Concepto","Arriendo del local · "+MESX.nom),P("Medio de pago","Transferencia · "+emp.banco.n),P("Empresa",emp.nombre)],null,[["VALOR PAGADO",fmt(arr)]]),
  asiento:[{c:"512010",s:"D",v:arr},{c:"111005",s:"H",v:arr}],
  pista:"El arriendo es un gasto (Debe). Salió plata del banco (Haber)."});

 add({k:"energia",dia:9,t:"Pago del servicio de energía",
  doc:D("FACTURA DE SERVICIO PÚBLICO","SP-"+ri(10000,99999),9,[P("Empresa de energía","Energía del Tolima S.A. E.S.P."),P("Cliente",emp.nombre),P("Periodo",MESX.ant+"–"+MESX.nom),P("Medio de pago","Pago PSE · "+emp.banco.n)],null,[["VALOR PAGADO",fmt(ene)]]),
  asiento:[{c:"513530",s:"D",v:ene},{c:"111005",s:"H",v:ene}],
  pista:"Los servicios públicos son un gasto (Debe). Se pagó desde el banco (Haber)."});

 add({k:"consig",dia:10,t:"Consignación de efectivo al banco",
  doc:D("VOLANTE DE CONSIGNACIÓN","VC-"+ri(1000,9999),10,[P("Banco",emp.banco.n),P("Cuenta",emp.cuenta),P("Titular",emp.nombre),P("Concepto","Consignación en efectivo")],null,[["VALOR CONSIGNADO",fmt(consig)]],"El dinero sale de la caja y entra al banco."),
  asiento:[{c:"111005",s:"D",v:consig},{c:"110505",s:"H",v:consig}],
  pista:"Es un movimiento entre dos cuentas de la misma empresa: entra al banco (Debe) y sale de la caja (Haber).",
  vals:{valor:consig}});

 add({k:"pagoProv",dia:12,t:"Pago parcial a "+PV[0]+" (cheque)",
  doc:D("COMPROBANTE DE EGRESO","CE-"+(ce++),12,[P("Pagado a",PV[0]),P("Concepto","Abono a la factura "+H[1].doc.num),P("Medio de pago","Cheque No. "+(ck++)+" · "+emp.banco.n),P("Empresa",emp.nombre)],null,[["VALOR DEL ABONO",fmt(pagoProv)]],"Es un abono: todavía queda saldo pendiente con el proveedor."),
  asiento:[{c:"220505",s:"D",v:pagoProv},{c:"111005",s:"H",v:pagoProv}],
  pista:"Al pagar una deuda, la deuda disminuye (Proveedores en el Debe) y sale plata del banco (Haber).",
  vals:{prov:PV[0],valor:pagoProv}});

 add({k:"equipo",dia:14,t:"Compra de un computador a crédito",
  doc:D("FACTURA DE COMPRA","FC-"+(fc++),14,[P("Proveedor","Tecnología y Equipos del Tolima"),P("NIT proveedor",nitDe("TecEq")),P("Comprador",emp.nombre),P("Forma de pago","Crédito a 60 días")],
   filaBase("Equipo de cómputo para la administración",1,eq),[["Subtotal",fmt(eq)],["IVA 19%",fmt(iva(eq))],["TOTAL A PAGAR",fmt(tot(eq))]],"Se usará varios años en la empresa, por eso no es un gasto: es un activo."),
  asiento:[{c:"152805",s:"D",v:eq},{c:"240802",s:"D",v:iva(eq)},{c:"220505",s:"H",v:tot(eq)}],
  pista:"Un equipo que se usa por años es un activo (Equipos de procesamiento de datos). El IVA es descontable y se debe el total."});

 add({k:"nomina",dia:15,t:"Pago de la nómina",
  doc:D("PLANILLA DE NÓMINA","NM-"+ri(100,999),15,[P("Empresa",emp.nombre),P("Periodo",MESX.Nom+" "+MESX.anio),P("Medio de pago","Transferencia · "+emp.banco.n),P("Empleados","Personal de la empresa")],null,[["TOTAL SUELDOS PAGADOS",fmt(nom)]],"Para este ejercicio se registra solo el sueldo pagado (sin prestaciones ni aportes)."),
  asiento:[{c:"510506",s:"D",v:nom},{c:"111005",s:"H",v:nom}],
  pista:"Los sueldos son un gasto (Debe) y se pagaron desde el banco (Haber)."});

 add({k:"ventaBco",dia:16,t:"Venta pagada con datáfono (entra al banco)",
  doc:D("FACTURA DE VENTA","FV-"+(fv++),16,[P("Vendedor",emp.nombre),P("NIT",miNit),P("Cliente","Ventas de mostrador"),P("Forma de pago","Tarjeta · el valor se abona en el banco")],
   filaBase("Venta de "+prod,qs3,pv),[["Subtotal",fmt(s3)],["IVA 19%",fmt(iva(s3))],["TOTAL ABONADO AL BANCO",fmt(tot(s3))]]),
  asiento:[{c:"111005",s:"D",v:tot(s3)},{c:"413595",s:"H",v:s3},{c:"240801",s:"H",v:iva(s3)}],
  pista:"Igual que la venta de contado, pero el dinero entra al banco y no a la caja.",
  vals:{base:s3,iva:iva(s3),total:tot(s3)}});

 add({k:"compraCred2",dia:18,t:"Compra de "+prod+" a crédito",
  doc:D("FACTURA DE COMPRA","FC-"+(fc++),18,[P("Proveedor",PV[2]),P("NIT proveedor",nitDe(PV[2])),P("Comprador",emp.nombre),P("Forma de pago","Crédito a 30 días")],
   filaBase("Mercancía: "+prod,q3,u3),[["Subtotal",fmt(c3)],["IVA 19%",fmt(iva(c3))],["TOTAL A PAGAR",fmt(tot(c3))]]),
  asiento:[{c:"143505",s:"D",v:c3},{c:"240802",s:"D",v:iva(c3)},{c:"220505",s:"H",v:tot(c3)}],
  pista:"Mercancía por su valor sin IVA, IVA descontable y el total a Proveedores.",
  vals:{prov:PV[2],base:c3,iva:iva(c3),total:tot(c3)}});

 add({k:"ventaCred2",dia:20,t:"Venta a crédito a "+CL[1],
  doc:D("FACTURA DE VENTA","FV-"+(fv++),20,[P("Vendedor",emp.nombre),P("NIT",miNit),P("Cliente",CL[1]),P("Forma de pago","Crédito a 30 días")],
   filaBase("Venta de "+prod,qs4,pv),[["Subtotal",fmt(s4)],["IVA 19%",fmt(iva(s4))],["TOTAL A COBRAR",fmt(tot(s4))]]),
  asiento:[{c:"130505",s:"D",v:tot(s4)},{c:"413595",s:"H",v:s4},{c:"240801",s:"H",v:iva(s4)}],
  pista:"El cliente queda debiendo el total (Clientes al Debe). Ingreso e IVA generado al Haber.",
  vals:{cli:CL[1],base:s4,iva:iva(s4),total:tot(s4)}});

 add({k:"internet",dia:22,t:"Pago de internet y teléfono",
  doc:D("FACTURA DE SERVICIO","SP-"+ri(10000,99999),22,[P("Empresa de telecomunicaciones","Comunicaciones del Centro S.A."),P("Cliente",emp.nombre),P("Servicio","Internet y telefonía"),P("Medio de pago","Pago PSE · "+emp.banco.n)],null,[["VALOR PAGADO",fmt(net)]]),
  asiento:[{c:"513535",s:"D",v:net},{c:"111005",s:"H",v:net}],
  pista:"Gasto de internet y teléfono (Debe) pagado desde el banco (Haber)."});

 add({k:"utiles",dia:25,t:"Compra de papelería para la oficina (efectivo)",
  doc:D("RECIBO DE CAJA MENOR","CM-"+ri(100,999),25,[P("Pagado a","Papelería La Esquina"),P("Concepto","Útiles de oficina y fotocopias"),P("Medio de pago","Efectivo de la caja"),P("Empresa",emp.nombre)],null,[["VALOR PAGADO",fmt(util)]]),
  asiento:[{c:"519530",s:"D",v:util},{c:"110505",s:"H",v:util}],
  pista:"Gasto de papelería (Debe) pagado con efectivo de la caja (Haber)."});

 add({k:"cobro1",dia:27,t:"Cobro parcial a "+CL[0]+" (transferencia)",
  doc:D("RECIBO DE CAJA","RC-"+(rc++),27,[P("Recibido de",CL[0]),P("Concepto","Abono a la factura "+H[4].doc.num),P("Medio","Transferencia a "+emp.banco.n),P("Empresa",emp.nombre)],null,[["VALOR RECIBIDO",fmt(cobro1)]],"Es un abono: el cliente aún debe el resto."),
  asiento:[{c:"111005",s:"D",v:cobro1},{c:"130505",s:"H",v:cobro1}],
  pista:"Entra plata al banco (Debe) y la deuda del cliente baja (Clientes al Haber).",
  vals:{cli:CL[0],valor:cobro1}});

 add({k:"cobro2",dia:28,t:"Cobro parcial a "+CL[1]+" (efectivo)",
  doc:D("RECIBO DE CAJA","RC-"+(rc++),28,[P("Recibido de",CL[1]),P("Concepto","Abono a la factura "+H[13].doc.num),P("Medio","Efectivo"),P("Empresa",emp.nombre)],null,[["VALOR RECIBIDO",fmt(cobro2)]]),
  asiento:[{c:"110505",s:"D",v:cobro2},{c:"130505",s:"H",v:cobro2}],
  pista:"Entra efectivo a la caja (Debe) y la deuda del cliente baja (Clientes al Haber)."});

 add({k:"costo",dia:30,t:"Costo de las ventas del mes",
  doc:D("REPORTE DE INVENTARIO PERMANENTE (KARDEX)","KD-"+MESX.nom.slice(0,3).toUpperCase(),30,[P("Empresa",emp.nombre),P("Periodo",MESX.Nom+" "+MESX.anio),P("Producto","Mercancía: "+prod),P("Método","Promedio ponderado")],null,[["COSTO DE LA MERCANCÍA VENDIDA",fmt(costo)]],"Al vender, la mercancía sale del inventario y se reconoce su costo."),
  asiento:[{c:"613595",s:"D",v:costo},{c:"143505",s:"H",v:costo}],
  pista:"El costo de ventas es un gasto (Debe) y la mercancía vendida sale del inventario (Haber)."});

 return{n,emp,hechos:H,resumen:{capital,Ac,Ab,Pc,sTotal,costo,ivaGen:iva(s1)+iva(s2)+iva(s3)+iva(s4)},prod,PV,CL,inv:{q:[q1,q2,q3],u:[u1,u2,u3],pv,qs:{ventaEf:qs2,ventaCred1:qs1,ventaBco:qs3,ventaCred2:qs4}}};
}


/* =====================================================================
   CONCILIACIÓN BANCARIA · extracto del banco y ajustes (estación 3)
   Se calcula con los MISMOS movimientos de la cuenta Bancos (111005) de los 19 hechos.
   ===================================================================== */
function conciliar(n){
 const M=generarMes(n),emp=M.emp,R=mulberry32(hashStr("conc"+n));
 const ri=(a,b)=>a+Math.floor(R()*(b-a+1));
 const num=h=>{const m=(h.doc.partes.map(p=>p[1]).join(" ").match(/[Cc]heque No\. (\d+)/));return m?m[1]:"";};
 const dOct=d=>String(d).padStart(2,"0")+" "+MESX.abr+" "+MESX.anio;
 /* movimientos del libro de bancos (en orden de fecha) */
 const L=[];let sal=0;
 M.hechos.forEach(h=>{const l=h.asiento.find(x=>x.c==="111005");if(!l)return;
  const d=l.s==="D"?l.v:0,hh=l.s==="H"?l.v:0;sal+=d-hh;
  let con=h.t;
  if(h.k==="compraCont"||h.k==="pagoProv")con="Cheque No. "+num(h)+" · "+h.t.replace(/ \(cheque\)/,"");
  L.push({id:"L"+h.id,hecho:h.id,k:h.k,dia:h.dia,fecha:h.doc.fecha,concepto:con,d,h:hh,saldo:sal,cheque:num(h)});});
 /* partidas conciliatorias de esta empresa */
 const kCheque=(n%2===0)?"pagoProv":"compraCont";
 const kTransito="cobro1";
 const nd=Math.round(ri(14000,32000)/100)*100,nc=Math.round(ri(3000,12000)/100)*100;
 /* extracto del banco */
 const E=[];
 L.forEach(m=>{
  if(m.k===kCheque||m.k===kTransito)return;               // no aparecen en el extracto
  let dia=m.dia,con=m.concepto;
  if(m.k==="compraCont"||m.k==="pagoProv"){dia=Math.min(30,m.dia+ri(2,5));con="Cheque pagado No. "+m.cheque;}
  else if(m.k==="aportes")con="Consignación inicial";
  else if(m.k==="consig")con="Consignación en efectivo";
  else if(m.k==="ventaBco"){dia=m.dia+1;con="Abono ventas con tarjeta (datáfono)";}
  else if(m.k==="arriendo")con="Transferencia · arriendo del local";
  else if(m.k==="energia")con="Pago PSE · energía";
  else if(m.k==="nomina")con="Transferencia · nómina";
  else if(m.k==="internet")con="Pago PSE · internet y teléfono";
  E.push({id:"E"+m.id,ref:m.id,dia,fecha:dOct(dia),concepto:con,d:m.h,c:m.d});   // d = retiro (débito del banco), c = depósito (crédito del banco)
 });
 E.push({id:"END",ref:"ND",dia:30,fecha:dOct(30),concepto:"Cuota de manejo de la cuenta",d:nd,c:0});
 E.push({id:"ENC",ref:"NC",dia:30,fecha:dOct(30),concepto:"Intereses de la cuenta",d:0,c:nc});
 E.sort((a,b)=>a.dia-b.dia||(a.id<b.id?-1:1));
 let s2=0;E.forEach(e=>{s2+=e.c-e.d;e.saldo=s2;});
 const pc=L.find(m=>m.k===kCheque),pt=L.find(m=>m.k===kTransito);
 const cheques=[pc],transito=[pt];
 const sumCh=pc.h,sumTr=pt.d;
 const extC=s2+sumTr-sumCh,libC=sal+nc-nd;
 return{n,banco:emp.banco.n,cuenta:emp.cuenta,empresa:emp.nombre,
  libros:L,extracto:E,saldoLibros:sal,saldoExtracto:s2,
  cheques,transito,sumCheques:sumCh,sumTransito:sumTr,nd,nc,
  concil:extC,conciliadoLibros:libC,cuadra:extC===libC,
  ajustes:[
   {k:"nd",t:"Nota débito: cuota de manejo de la cuenta",valor:nd,fecha:dOct(30),asiento:[{c:"530505",s:"D",v:nd},{c:"111005",s:"H",v:nd}],pista:"El banco cobró un gasto: los gastos bancarios van al Debe y como sale plata del banco, Bancos va al Haber."},
   {k:"nc",t:"Nota crédito: intereses ganados",valor:nc,fecha:dOct(30),asiento:[{c:"111005",s:"D",v:nc},{c:"421005",s:"H",v:nc}],pista:"El banco abonó intereses: entra plata al banco (Debe) y es un ingreso financiero (Haber)."}
  ]};
}


/* =====================================================================
   KARDEX · inventario permanente por promedio ponderado (estación 4)
   Costo unitario de salida = saldo en valor / saldo en unidades, redondeado al peso.
   ===================================================================== */
function calcKardex(p){
 const seq=[["compraCred1","C",p.q1,p.u1,2],["compraCont","C",p.q2,p.u2,3],["ventaEf","V",p.qs2,0,5],["ventaCred1","V",p.qs1,0,6],["ventaBco","V",p.qs3,0,16],["compraCred2","C",p.q3,p.u3,18],["ventaCred2","V",p.qs4,0,20]];
 let sq=0,sv=0,costo=0;const L=[];
 seq.forEach(x=>{
  const l={k:x[0],tipo:x[1],dia:x[4],q:x[2]};
  if(x[1]==="C"){l.cu=x[3];l.cv=x[2]*x[3];sq+=x[2];sv+=l.cv;}
  else{l.cu=Math.round(sv/sq);l.cv=x[2]*l.cu;sq-=x[2];sv-=l.cv;costo+=l.cv;}
  l.sq=sq;l.sv=sv;l.su=sq>0?Math.round(sv/sq):0;L.push(l);
 });
 return{lineas:L,costo,sq,sv};
}
function kardex(n){
 const M=generarMes(n),I=M.inv;
 const K=calcKardex({q1:I.q[0],u1:I.u[0],q2:I.q[1],u2:I.u[1],q3:I.q[2],u3:I.u[2],qs1:I.qs.ventaCred1,qs2:I.qs.ventaEf,qs3:I.qs.ventaBco,qs4:I.qs.ventaCred2});
 K.lineas.forEach(l=>{const h=M.hechos.find(z=>z.k===l.k);l.hecho=h.id;l.doc=h.doc.num;l.fecha=h.doc.fecha;l.det=l.tipo==="C"?"Compra · "+(h.vals.prov||""):"Venta · "+(l.k==="ventaEf"?"mostrador (efectivo)":l.k==="ventaBco"?"mostrador (datáfono)":h.vals.cli);});
 K.empresa=M.emp.nombre;K.prod=M.prod;K.pv=I.pv;K.ventasBase=M.hechos.filter(h=>/^venta/.test(h.k)).reduce((a,h)=>a+h.vals.base,0);
 K.compras=K.lineas.filter(l=>l.tipo==="C").reduce((a,l)=>a+l.cv,0);
 K.uVendidas=K.lineas.filter(l=>l.tipo==="V").reduce((a,l)=>a+l.q,0);
 K.uCompradas=K.lineas.filter(l=>l.tipo==="C").reduce((a,l)=>a+l.q,0);
 return K;
}

/* =====================================================================
   ESTADOS FINANCIEROS (estación 5)
   Parten de los 19 hechos + los 2 ajustes del banco de la estación 3.
   Sin impuesto de renta ni depreciación (simplificación didáctica).
   ===================================================================== */
function estados(n){
 const M=generarMes(n),K=kardex(n),C=conciliar(n);
 const a={};const add=(c,s,v)=>{a[c]=(a[c]||0)+(s==="D"?v:-v);};
 M.hechos.forEach(h=>h.asiento.forEach(l=>add(l.c,l.s,l.v)));
 C.ajustes.forEach(x=>x.asiento.forEach(l=>add(l.c,l.s,l.v)));
 const sd=c=>a[c]||0;
 const bal=Object.keys(a).sort().map(c=>({c,nom:PUC[c],d:a[c]>0?a[c]:0,h:a[c]<0?-a[c]:0}));
 const E={n,empresa:M.emp.nombre,bal,
  sumD:bal.reduce((s,x)=>s+x.d,0),sumH:bal.reduce((s,x)=>s+x.h,0)};
 /* estado de resultados */
 const er={ing:-sd("413595"),cos:sd("613595"),suel:sd("510506"),arr:sd("512010"),ene:sd("513530"),tel:sd("513535"),uti:sd("519530"),ifin:-sd("421005"),gfin:sd("530505")};
 er.ub=er.ing-er.cos;er.tga=er.suel+er.arr+er.ene+er.tel+er.uti;er.uop=er.ub-er.tga;er.un=er.uop+er.ifin-er.gfin;
 E.er=er;
 /* cambios en el patrimonio */
 const pat={ini:0,aportes:-sd("310505"),util:er.un};pat.fin=pat.ini+pat.aportes+pat.util;E.pat=pat;
 /* situación financiera */
 const f={caja:sd("110505"),banco:sd("111005"),cli:sd("130505"),inv:sd("143505"),ivad:sd("240802"),eq:sd("152805"),prov:-sd("220505"),ivag:-sd("240801"),cap:-sd("310505"),util:er.un};
 f.efe=f.caja+f.banco;f.ac=f.efe+f.cli+f.inv+f.ivad;f.act=f.ac+f.eq;f.pas=f.prov+f.ivag;f.pat=f.cap+f.util;f.pp=f.pas+f.pat;f.cuadra=f.act===f.pp;E.esf=f;
 /* flujo de efectivo (método directo) */
 const cat={aportes:"fin",ventaEf:"cob",ventaBco:"cob",cobro1:"cob",cobro2:"cob",compraCont:"prov",pagoProv:"prov",arriendo:"gas",energia:"gas",internet:"gas",utiles:"gas",nomina:"nom"};
 const fe={cob:0,prov:0,gas:0,nom:0,int:C.nc,bco:C.nd,inv:0,fin:0};
 M.hechos.forEach(h=>{const c=cat[h.k];if(!c)return;const d=h.asiento.filter(l=>l.c==="110505"||l.c==="111005").reduce((s,l)=>s+(l.s==="D"?l.v:-l.v),0);
  if(c==="cob")fe.cob+=d;else if(c==="fin")fe.fin+=d;else fe[c]+=-d;});
 fe.op=fe.cob-fe.prov-fe.gas-fe.nom+fe.int-fe.bco;fe.var=fe.op+fe.inv+fe.fin;fe.ini=0;fe.final=fe.ini+fe.var;fe.cuadra=fe.final===f.efe;E.fe=fe;
 E.notas={caja:f.caja,banco:f.banco,inv:f.inv,metodo:"p",cli:f.cli,prov:f.prov};
 return E;
}
