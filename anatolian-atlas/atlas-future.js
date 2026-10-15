/* Anatolian Atlas — 3D craft constellations + private rule-based sourcing */
(()=>{"use strict";
const lang=document.documentElement.lang==="de"?"de":"en";
const tr={
en:{
names:{ebru:"Ebru",iznik:"İznik",telkari:"Telkari",textile:"Anatolian weave"},
titles:{ebru:"Fluid memory",iznik:"Geometric resonance",telkari:"Filigree intelligence",textile:"Woven time"},
summary:{ebru:"Each Ebru work is transferred from water to paper. Confirm whether the offered artwork is an original or a reproduction, and ask for the maker's attribution.",iznik:"Decorative ceramic motifs alone do not prove origin. Confirm the actual studio, production method, glaze and suitability for intended use.",telkari:"Filigree's intricate form does not by itself confirm silver content or workshop provenance. Request material and maker evidence.",textile:"Confirm fibre composition, weaving method, dimensions, dye information and care before choosing a textile."},
check:{ebru:["Original artwork, reproduction or demonstration?","Artist, work photograph, paper and pigment details"],iznik:["Actual workshop and item photographs","Glaze, dimensions and food-contact evidence if required"],telkari:["Metal composition and any reliable hallmark evidence","Workshop attribution and care instructions"],textile:["Exact fibres, measurements and care instructions","Handwoven vs machine-made; dyes and provenance"]},
purpose:{gift:"For a gift, confirm delivery dates, protective packaging and returns.",interior:"For interiors, check dimensions, installation and ongoing care.",collecting:"For collecting, request edition status, dated provenance and artist evidence.",wholesale:"For trade orders, confirm MOQ, capacity, written pricing and relevant product compliance."},
dest:{de:"For Germany, confirm total import/landed costs, seller identity and applicable consumer rules.",eu:"For EU delivery, clarify seller location, applicable taxes, product requirements and shipping responsibility.",world:"For delivery outside the EU, check duties, customs restrictions and transport insurance."},
title:"Your sourcing evidence route",status:"RESEARCH MODE · SUPPLY UNVERIFIED",
warning:"No maker or product for purchase has been verified here. This local guide does not invent a supplier or recommend a purchase.",
private:"Private by design. Your selections remain in this browser; an enquiry is sent only if you separately open and use the existing form."
},
de:{
names:{ebru:"Ebru",iznik:"İznik",telkari:"Telkari",textile:"Anatolisches Gewebe"},
titles:{ebru:"Fließende Erinnerung",iznik:"Geometrische Resonanz",telkari:"Filigrane Intelligenz",textile:"Gewebte Zeit"},
summary:{ebru:"Ebru entsteht durch das Übertragen von Mustern vom Wasser auf Papier. Bitte Originalstatus und künstlerische Urheberschaft prüfen.",iznik:"Ein keramisches Muster beweist nicht den Herstellungsort. Bitte Werkstatt, Herstellungsart, Glasur und Verwendungszweck klären.",telkari:"Filigrane Formen belegen weder Silbergehalt noch Werkstattzuordnung. Material- und Herkunftsnachweise erfragen.",textile:"Vor dem Kauf Faserzusammensetzung, Webtechnik, Maße, Färbung und Pflegeangaben prüfen."},
check:{ebru:["Original, Reproduktion oder Vorführung?","Künstlernachweis, Foto, Papier- und Pigmentangaben"],iznik:["Tatsächliche Werkstatt und Fotos des Werkstücks","Glasur, Maße und ggf. Eignung für Lebensmittelkontakt"],telkari:["Legierung und belastbare Material- oder Punzenangaben","Werkstattnachweis und Pflegehinweise"],textile:["Genaue Fasern, Maße und Pflege","Handarbeit oder Maschinenware? Färbung und Herkunft"]},
purpose:{gift:"Für Geschenke Liefertermin, sichere Verpackung und Rückgaberechte prüfen.",interior:"Für Innenräume Maße, Aufhängung bzw. Installation und Pflege klären.",collecting:"Für Sammlungen Edition, datierte Provenienz und Werkstattnachweis erfragen.",wholesale:"Für Handel Mindestbestellmenge, Kapazität, Konditionen und Produktkonformität prüfen."},
dest:{de:"Für Deutschland Endpreis, Einfuhrkosten, Verkäuferidentität und Verbraucherrecht klären.",eu:"Bei EU-Lieferungen Verkäuferstandort, Steuern, Produktrecht und Versandverantwortung prüfen.",world:"Für Nicht-EU-Ziele Zoll, Einfuhrbeschränkungen und Transportversicherung prüfen."},
title:"Dein Herkunfts- und Anfrageweg",status:"RECHERCHE · LIEFERBARKEIT UNBESTÄTIGT",
warning:"Keine Werkstatt oder kaufbare Ware wurde hier verifiziert. Die lokale Entscheidungshilfe erfindet keine Lieferanten und gibt keine Kaufempfehlung.",
private:"Datensparsam: Die Auswahl bleibt im Browser. Eine Anfrage wird erst über das bestehende Formular freiwillig gesendet."
}};
const t=tr[lang],keys=["ebru","iznik","telkari","textile"];
const model={craft:"ebru",purpose:"gift",destination:"de"};
const canvas=document.getElementById("atlas-canvas");
const el=id=>document.getElementById(id);
let change3d=()=>{};
function render(){
const out=el("intel-result");if(!out)return;
const title=out.querySelector("[data-out-title]"),desc=out.querySelector("[data-out-summary]"),list=out.querySelector("[data-out-list]"),flag=out.querySelector("[data-out-status]"),warning=out.querySelector("[data-out-disclosure]");
if(title)title.textContent=t.title+" · "+t.names[model.craft];
if(desc)desc.textContent=t.summary[model.craft];
if(flag)flag.textContent=t.status;if(warning)warning.textContent=t.warning;
if(list){const items=[...t.check[model.craft],t.purpose[model.purpose],t.dest[model.destination]];
list.replaceChildren(...items.map(item=>{const li=document.createElement("li");li.textContent=item;return li;}));}
}
function setCraft(v){
if(!keys.includes(v))return;
model.craft=v;
document.querySelectorAll("[data-scene]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.scene===v)));
document.querySelectorAll('[data-choice="craft"]').forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.value===v)));
if(el("stage-title"))el("stage-title").textContent=t.titles[v];
if(el("stage-index"))el("stage-index").textContent=String(keys.indexOf(v)+1).padStart(2,"0")+" / 04";
change3d(v);render();
}
document.querySelectorAll("[data-scene]").forEach(b=>b.addEventListener("click",()=>setCraft(b.dataset.scene)));
document.querySelectorAll("[data-choice]").forEach(b=>b.addEventListener("click",()=>{
let k=b.dataset.choice,v=b.dataset.value;
if(k==="craft"){setCraft(v);return;}
if(k!=="purpose"||!["gift","interior","collecting","wholesale"].includes(v))return;
model.purpose=v;
document.querySelectorAll('[data-choice="purpose"]').forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
render();
}));
document.querySelectorAll("article[data-craft]").forEach(card=>{
const b=card.querySelector(".craft-explore");
if(!b)return;
b.addEventListener("click",()=>{setCraft(card.dataset.craft);el("intelligence")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});});
});
const select=el("intel-destination");if(select)select.addEventListener("change",()=>{
if(["de","eu","world"].includes(select.value)){model.destination=select.value;render();}
});
const notice=document.querySelector("[data-intel-privacy]");if(notice)notice.textContent=t.private;
setCraft("ebru");
/* Native WebGL 3-D geometry, zero external dependencies. Illustrative, not a physical-product scan. */
if(!canvas)return;
let gl=null;
try{gl=canvas.getContext("webgl",{alpha:true,depth:false,antialias:false,preserveDrawingBuffer:false,powerPreference:"low-power"});}catch(_){}
if(!gl)return;
const vert=[
"attribute vec4 point;",
"uniform float ratio, density;",
"uniform vec2 turn;",
"varying float depthColor;",
"void main(){",
"vec3 p=point.xyz;",
"float a=cos(turn.x),b=sin(turn.x),c=cos(turn.y),d=sin(turn.y);",
"p=vec3(a*p.x+b*p.z,p.y,-b*p.x+a*p.z);",
"p=vec3(p.x,c*p.y-d*p.z,d*p.y+c*p.z);",
"float z=4.4-p.z;",
"gl_Position=vec4(p.x*2.7/(z*ratio),p.y*2.7/z,p.z*.1,1.);",
"gl_PointSize=min(9.,density*(1.8+point.w*3.4)*4.4/z);",
"depthColor=clamp(.25+(p.z+2.)*.20,.12,1.);",
"}"].join("\n");
const frag=[
"precision mediump float;",
"uniform vec3 tint;",
"varying float depthColor;",
"void main(){",
"float r=length(gl_PointCoord*2.-1.);",
"float a=1.-smoothstep(.28,1.,r);",
"gl_FragColor=vec4(tint,depthColor*a*.92);",
"}"].join("\n");
function compile(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null;}
const vertexShader=compile(gl.VERTEX_SHADER,vert),fragmentShader=compile(gl.FRAGMENT_SHADER,frag);
if(!vertexShader||!fragmentShader)return;
const prog=gl.createProgram();
gl.attachShader(prog,vertexShader);gl.attachShader(prog,fragmentShader);gl.linkProgram(prog);
if(!gl.getProgramParameter(prog,gl.LINK_STATUS))return;
const loc={
point:gl.getAttribLocation(prog,"point"),
ratio:gl.getUniformLocation(prog,"ratio"),
density:gl.getUniformLocation(prog,"density"),
turn:gl.getUniformLocation(prog,"turn"),
tint:gl.getUniformLocation(prog,"tint")
};
const buffer=gl.createBuffer(),palette={ebru:[.44,.93,.81],iznik:[.54,.8,.99],telkari:[.98,.71,.44],textile:[.99,.61,.65]};
let count=0,scene="ebru",a=.4,b=-.25,aimA=a,aimB=b,last=0,running=false,onscreen=true,drag=false,px=0,py=0;
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
function build(k){
const data=[],N=1700;
let seed=7713+keys.indexOf(k)*11579;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return (seed>>>0)/4294967296;};
for(let i=0;i<N;i++){
const u=random(),v=random(),t=u*6.283185,tw=v*2-1;
let x=0,y=0,z=0;
if(k==="ebru"){
const theta=t+tw*2.9,rad=(1.35+.14*Math.sin(t*7+tw*9))*Math.sqrt(1-tw*tw);
x=rad*Math.cos(theta);y=rad*Math.sin(theta);z=tw*1.28+.16*Math.sin(t*6);
}else if(k==="iznik"){
const theta=t,rad=.22+v*1.48;
x=rad*Math.cos(theta);y=rad*Math.sin(theta);z=.42*Math.sin(theta*8)*(1-rad/1.8)+.2*Math.cos(rad*12);
}else if(k==="telkari"){
const theta=(i/N)*6.283185*3,rad=1.05+.44*Math.cos(3*theta);
x=(rad+(v-.5)*.07)*Math.cos(2*theta);
y=(rad+(v-.5)*.07)*Math.sin(2*theta);
z=.62*Math.sin(3*theta)+(u-.5)*.13;
}else{
const gx=i%50/49*3-1.5,gy=Math.floor(i/50)/33*3-1.5;
x=gx;y=gy;z=.19*Math.sin(gx*10)+.19*Math.cos(gy*10)+.15*Math.cos((gx+gy)*6)+(i%2)*.09;
}
data.push(x,y,z,.23+random()*.77);
}
return new Float32Array(data);
}
function setScene(k){
scene=k;
const data=build(k);count=data.length/4;
gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
if(reduce.matches){requestAnimationFrame(draw);}else kick();
}
change3d=setScene;
function draw(now){
if(document.hidden||!onscreen){running=false;return;}
const r=canvas.getBoundingClientRect();
if(r.width<5||r.height<5){running=false;return;}
const scale=Math.min(1.5,window.devicePixelRatio||1),w=Math.min(1100,Math.round(r.width*scale)),h=Math.min(1100,Math.round(r.height*scale));
if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
const dt=Math.min(40,Math.max(0,now-last||16));last=now;
if(!reduce.matches)aimA+=dt*.00012;
a+=(aimA-a)*.075;b+=(aimB-b)*.075;
gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
gl.useProgram(prog);
gl.uniform1f(loc.ratio,w/h);gl.uniform1f(loc.density,scale);
gl.uniform2f(loc.turn,a,b);gl.uniform3fv(loc.tint,palette[scene]);
gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(loc.point);
gl.vertexAttribPointer(loc.point,4,gl.FLOAT,false,0,0);
gl.drawArrays(gl.POINTS,0,count);
if(!reduce.matches)requestAnimationFrame(draw);
else running=false;
}
function kick(){if(!running&&onscreen&&!document.hidden){running=true;last=0;requestAnimationFrame(draw);}}
if("IntersectionObserver" in window){new IntersectionObserver(entries=>{onscreen=!!entries[0]?.isIntersecting;if(onscreen)kick();},{threshold:.01}).observe(canvas);}
document.addEventListener("visibilitychange",()=>{if(!document.hidden)kick();});
canvas.addEventListener("pointerdown",e=>{if(e.button!==0)return;drag=true;px=e.clientX;py=e.clientY;canvas.setPointerCapture?.(e.pointerId);});
canvas.addEventListener("pointermove",e=>{if(!drag)return;aimA+=(e.clientX-px)*.008;aimB=Math.max(-1.2,Math.min(1.2,aimB+(e.clientY-py)*.006));px=e.clientX;py=e.clientY;if(reduce.matches)requestAnimationFrame(draw);});
canvas.addEventListener("pointerup",()=>{drag=false;});
canvas.addEventListener("pointercancel",()=>{drag=false;});
canvas.addEventListener("webglcontextlost",e=>{e.preventDefault();running=false;canvas.classList.remove("is-ready");});
setScene(model.craft);canvas.classList.add("is-ready");
})();