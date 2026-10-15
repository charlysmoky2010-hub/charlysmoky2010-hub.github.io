/* ATLAS 02 — honest, browser-local provenance guide + actual triangulated 3D material studies.
  Uses pinned Three.js only for WebGL rendering. No analytics, storage, user-data requests or fabricated inventory. */
(()=>{"use strict";
const de=document.documentElement.lang==="de";
const catalog=[
{key:"iznik",name:"İznik",object:de?"Kobalt & Keramik":"Cobalt & clay",material:de?"GLASIERTE KERAMIK / DIGITALE MATERIALSTUDIE":"GLAZED CERAMIC / DIGITAL MATERIAL STUDY"},
{key:"telkari",name:"Telkari",object:de?"Silberfäden":"Threads of silver",material:de?"METALL / DIGITALE MATERIALSTUDIE":"METAL / DIGITAL MATERIAL STUDY"},
{key:"ebru",name:"Ebru",object:de?"Flüssige Erinnerung":"Liquid memory",material:de?"PIGMENT AUF WASSER / DIGITALE MATERIALSTUDIE":"PIGMENT ON WATER / DIGITAL MATERIAL STUDY"},
{key:"textile",name:de?"Gewebe":"Weaving",object:de?"Die gewebte Zeit":"Time, woven",material:de?"TEXTIL / DIGITALE MATERIALSTUDIE":"FIBRE / DIGITAL MATERIAL STUDY"}
];
const guide={
en:{
iznik:{desc:"A traditional motif is not proof of İznik origin. Ask who made the specific ceramic piece and what it is made for.",checks:["Obtain the real workshop name and production location.","Ask for photographs of the exact object, dimensions and glaze information.","If for food contact, request appropriate suitability documentation."]},
telkari:{desc:"Intricate silverwork can be beautiful without being verified as authentic Telkari or sterling silver.",checks:["Check the actual metal composition and any supporting hallmark.","Request named workshop attribution and photos of the specific piece.","Check care, skin-contact suitability and shipping terms."]},
ebru:{desc:"Ebru is an artwork or practice: establish whether an offered piece is an original, a print or a workshop experience.",checks:["Confirm the artist and original-versus-reproduction status.","Ask about paper, pigments, dimensions and framed or unframed delivery.","Agree safe packaging and any handling requirements."]},
textile:{desc:"A traditional weaving pattern is not a guarantee of where or how a textile was produced.",checks:["Ask about fibre, dimensions, dye and cleaning instructions.","Confirm handwoven, loom-made or mass-produced status.","Identify seller, workshop and care or return responsibilities."]},
purposes:{gift:"A gift needs a written delivery window, suitable packaging and clear return terms.",interior:"For interiors, check weight, dimensions, installation and long-term care.",collector:"For collectors, provenance, unique/edition status and artist attribution matter.",trade:"For wholesale, require a realistic MOQ, production lead time, compliance and written trade terms."},
dest:{de:"For delivery to Germany, check total landed price, shipping liability and applicable import or consumer rules.",eu:"For EU delivery, verify seller country, relevant taxes, product requirements and delivery obligations.",world:"For non-EU delivery, check customs restrictions, duties, insurance and local product rules."},
intro:"The evidence we would require",unverified:"No supplier or purchasable object is independently verified on Anatolian Atlas. This checklist assesses questions, not a seller.",local:"All selections stay in your browser. Nothing is submitted until you use the separate enquiry form.",self:"Your own notes; not independently verified",selfProgress:"Evidence noted by you",fallback:"Interactive 3D is unavailable in this browser. The material archive and sourcing guide still work."
},
de:{
iznik:{desc:"Ein traditionelles Motiv beweist nicht den Produktionsort İznik. Die konkrete Werkstatt und Verwendung des Stücks sollten geklärt sein.",checks:["Werkstattname und tatsächlichen Herstellungsort erfragen.","Fotos des konkreten Stücks, Maße und Glasurinformationen einholen.","Bei Lebensmittelkontakt die entsprechende Eignung nachweisen lassen."]},
telkari:{desc:"Filigranes Silberhandwerk ist nicht automatisch geprüftes Telkari oder Sterlingsilber.",checks:["Tatsächliche Metallzusammensetzung und belastbare Punzen erfragen.","Werkstattnachweis und Fotos des konkreten Stücks einholen.","Pflege, Hautverträglichkeit und Versandbedingungen klären."]},
ebru:{desc:"Bei Ebru muss geklärt sein, ob es um ein Original, einen Druck oder einen Workshop geht.",checks:["Künstler und Status als Original oder Reproduktion prüfen.","Papier, Pigmente, Maße und Rahmung klären.","Sichere Verpackung und Handhabung vereinbaren."]},
textile:{desc:"Ein traditionelles Muster belegt weder Herstellungsort noch Produktionsweise des Textils.",checks:["Fasern, Maße, Färbung und Pflegehinweise erfragen.","Handgewebte oder maschinelle Herstellung nachvollziehen.","Verkäufer, Werkstatt sowie Rückgabe und Pflege klären."]},
purposes:{gift:"Für Geschenke Lieferfrist, sichere Verpackung und Rückgabe vereinbaren.",interior:"Für die Einrichtung Gewicht, Maße, Montage und Pflege klären.",collector:"Für eine Sammlung sind Provenienz, Edition und Urheberschaft entscheidend.",trade:"Im Großhandel MOQ, Herstellungsdauer, Konformität und schriftliche Konditionen klären."},
dest:{de:"Für Deutschland Gesamtpreis, Transporthaftung, Einfuhr und Verbraucherrecht prüfen.",eu:"Für EU-Lieferungen Verkäuferland, Steuern, Produktrecht und Lieferpflichten prüfen.",world:"Bei Lieferungen außerhalb der EU Zoll, Einfuhrregeln, Versicherung und Produktvorschriften beachten."},
intro:"Diese Nachweise benötigen wir",unverified:"Aktuell gibt es auf Anatolian Atlas keinen unabhängig bestätigten Lieferanten und kein nachgewiesen kaufbares Objekt. Dies ist eine Prüfliste, keine Händlerbewertung.",local:"Alle Eingaben bleiben im Browser. Erst das getrennte Anfrageformular kann Daten versenden.",self:"Deine Angaben; nicht unabhängig geprüft",selfProgress:"Von dir markierte Angaben",fallback:"Interaktives 3D ist in diesem Browser nicht verfügbar. Materialarchiv und Suchhilfe funktionieren weiterhin."
}};
const t=guide[de?"de":"en"];
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let active="iznik",changed=()=>{};
const selected={purpose:"gift",dest:"de",evidence:new Set()};
function choose(key){
if(!catalog.some(x=>x.key===key))return;
active=key;
const found=catalog.find(x=>x.key===key);
const name=$("#object-title"),mat=$("#object-material"),idx=$("#object-index");
if(name)name.textContent=found.object;
if(mat)mat.textContent=found.material;
if(idx)idx.textContent=String(catalog.indexOf(found)+1).padStart(2,"0")+" / 04";
$$("[data-object]").forEach(el=>el.setAttribute("aria-pressed",String(el.dataset.object===key)));
$$("[data-collection]").forEach(el=>el.setAttribute("aria-current",String(el.dataset.collection===key)));
changed(key);updateGuide();
}
$$("[data-object]").forEach(button=>button.addEventListener("click",()=>choose(button.dataset.object)));
$$("[data-collection]").forEach(item=>{const fn=()=>{choose(item.dataset.collection);$("#viewer")?.scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"});};item.addEventListener("click",fn);item.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();fn();}});});
$$("[data-purpose]").forEach(button=>button.addEventListener("click",()=>{selected.purpose=button.dataset.purpose;$$("[data-purpose]").forEach(x=>x.setAttribute("aria-pressed",String(x===button)));updateGuide();}));
$("#destination")?.addEventListener("change",e=>{if(t.dest[e.target.value]){selected.dest=e.target.value;updateGuide();}});
$$("[data-self-check]").forEach(input=>input.addEventListener("change",()=>{if(input.checked)selected.evidence.add(input.value);else selected.evidence.delete(input.value);updateGuide();}));
function updateGuide(){
const entry=t[active];
if($("#result-name"))$("#result-name").textContent=t.intro+" / "+catalog.find(x=>x.key===active).name;
if($("#result-desc"))$("#result-desc").textContent=entry.desc;
const list=$("#result-list");
if(list){const li=[...entry.checks,t.purposes[selected.purpose],t.dest[selected.dest]].map(item=>{const el=document.createElement("li");el.textContent=item;return el;});list.replaceChildren(...li);}
if($("#result-caution"))$("#result-caution").textContent=t.unverified;
if($("#privacy-note"))$("#privacy-note").textContent=t.local;
if($("#personal-grade"))$("#personal-grade").textContent=selected.evidence.size+" / 3 — "+t.selfProgress;
if($("#grade-note"))$("#grade-note").textContent=t.self;
}
choose("iznik");
const viewer=$("#viewer"),canvas=$("#object-stage");
if(!viewer||!canvas)return;
let scene,camera,renderer,study,controls,raf=0,visible=true,drag=false,lastX=0,lastY=0;
let yaw=-.35,pitch=.05,targetYaw=yaw,targetPitch=pitch;
const unsupported=()=>{
viewer.classList.add("fallback");const status=$("#fallback-status");if(status)status.textContent=t.fallback;};
(async()=>{
let THREE;
try{THREE=await import("https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js");}catch(_){unsupported();return;}
try{
scene=new THREE.Scene();
camera=new THREE.PerspectiveCamera(38,1,.1,200);
camera.position.set(0,.12,8.8);camera.lookAt(0,0,0);
renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"low-power",preserveDrawingBuffer:false});
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.16;
const hemisphere=new THREE.HemisphereLight(0xfff5e5,0x183251,3.6);scene.add(hemisphere);
const key=new THREE.DirectionalLight(0xffdec3,5.0);key.position.set(4,7,7);scene.add(key);
const fill=new THREE.DirectionalLight(0x80b4ff,2.7);fill.position.set(-7,2,-4);scene.add(fill);
const rim=new THREE.PointLight(0xf9d4a1,90,20);rim.position.set(-3,-1,4);scene.add(rim);
const spot=new THREE.SpotLight(0xffffff,100,30,.8,.8);spot.position.set(5,2,1);scene.add(spot);
study=new THREE.Group();scene.add(study);
const shadowCanvas=document.createElement("canvas");shadowCanvas.width=128;shadowCanvas.height=128;
const ctx=shadowCanvas.getContext("2d"),grad=ctx.createRadialGradient(64,64,4,64,64,64);
grad.addColorStop(0,"rgba(0,0,0,0.5)");grad.addColorStop(.42,"rgba(0,0,0,0.19)");grad.addColorStop(1,"rgba(0,0,0,0)");
ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);
const shTex=new THREE.CanvasTexture(shadowCanvas);
const shadow=new THREE.Mesh(new THREE.PlaneGeometry(4.6,2.8),new THREE.MeshBasicMaterial({map:shTex,transparent:true,depthWrite:false,opacity:.78}));
shadow.rotation.x=-Math.PI/2;shadow.position.y=-2.05;scene.add(shadow);
const backdropRing=new THREE.Mesh(new THREE.TorusGeometry(2.56,.004,4,160),new THREE.MeshBasicMaterial({color:0xb2a890,transparent:true,opacity:.14}));
backdropRing.position.z=-1.28;scene.add(backdropRing);
function ceramicTexture(){
const canvas=document.createElement("canvas");canvas.width=1536;canvas.height=1024;
const c=canvas.getContext("2d");c.fillStyle="#f3ebdb";c.fillRect(0,0,1536,1024);
c.lineCap="round";c.lineJoin="round";
for(const y of [40,65,180,208,775,802,935,957]){
c.strokeStyle=y%2?"#28466b":"#184d8f";c.lineWidth=y%2?3:6;c.beginPath();c.moveTo(0,y);c.lineTo(1536,y);c.stroke();}
for(let i=0;i<12;i++){
let x=i*128+64;
c.save();c.translate(x,510);
c.strokeStyle="#1e4d90";c.lineWidth=5;
c.beginPath();c.moveTo(0,230);c.bezierCurveTo(29,85,-28,-60,0,-227);c.stroke();
for(const j of [-1,1]){
c.save();c.scale(j,1);
for(let k=0;k<3;k++){
let y=-112+k*96;
c.beginPath();c.moveTo(0,y+30);c.bezierCurveTo(63,y-12,67,y-67,8,y-32);c.bezierCurveTo(23,y-8,32,y+5,0,y+30);c.stroke();
}
c.restore();
}
c.fillStyle="#2868a5";c.beginPath();
c.moveTo(0,-246);c.bezierCurveTo(23,-228,23,-181,0,-163);c.bezierCurveTo(-23,-181,-23,-228,0,-246);c.fill();
c.strokeStyle="#91a9c7";c.lineWidth=2;
c.beginPath();c.arc(0,0,49,0,Math.PI*2);c.stroke();
c.restore();
}
for(let x=0;x<1536;x+=22){c.fillStyle="rgba(38,77,118,.09)";c.fillRect(x,0,1,1024);}
const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=THREE.RepeatWrapping;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return texture;
}
function iznik(){
const g=new THREE.Group();
const points=[[.34,-1.85],[.5,-1.79],[.74,-1.65],[.98,-1.31],[1.16,-.88],[1.19,-.31],[1.15,.25],[1.01,.75],[.82,1.05],[.58,1.20],[.49,1.38],[.51,1.62],[.65,1.70],[.66,1.78],[.57,1.8],[.52,1.73]].map(([x,y])=>new THREE.Vector2(x,y));
const body=new THREE.Mesh(new THREE.LatheGeometry(points,128),new THREE.MeshPhysicalMaterial({
map:ceramicTexture(),roughness:.22,metalness:0,clearcoat:.9,clearcoatRoughness:.11,side:THREE.DoubleSide
}));
g.add(body);
const cobalt=new THREE.MeshPhysicalMaterial({color:0x1d4577,roughness:.22,clearcoat:1});
const rim=new THREE.Mesh(new THREE.TorusGeometry(.615,.061,14,100),cobalt);rim.rotation.x=Math.PI/2;rim.position.y=1.765;g.add(rim);
const inside=new THREE.Mesh(new THREE.CircleGeometry(.555,100),new THREE.MeshStandardMaterial({color:0x172c43,roughness:.48,side:THREE.DoubleSide}));inside.rotation.x=-Math.PI/2;inside.position.y=1.725;g.add(inside);
const foot=new THREE.Mesh(new THREE.TorusGeometry(.39,.033,10,90),cobalt);foot.rotation.x=Math.PI/2;foot.position.y=-1.825;g.add(foot);
return g;
}
function telkari(){
const g=new THREE.Group(),silver=new THREE.MeshPhysicalMaterial({color:0xd5c6b0,metalness:.83,roughness:.26,clearcoat:.5});
const deep=new THREE.MeshPhysicalMaterial({color:0x183c61,metalness:.35,roughness:.2,clearcoat:.65});
function torus(r,wire,rot=0){const mesh=new THREE.Mesh(new THREE.TorusGeometry(r,wire,12,120),silver);mesh.rotation.z=rot;g.add(mesh);return mesh;}
torus(1.45,.044);torus(1.32,.019);torus(.22,.028);torus(.12,.027);
for(let k=0;k<12;k++){
const phi=k*Math.PI/6;
const pts=[];
for(let j=0;j<150;j++){
const a=j/149*4.15,rad=.56-(j/149)*.51;
const px=.78+Math.cos(a)*rad,py=Math.sin(a)*rad;
pts.push(new THREE.Vector3(Math.cos(phi)*px-Math.sin(phi)*py,Math.sin(phi)*px+Math.cos(phi)*py,.095*Math.sin(a*1.7)));
}
g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),150,.024,7,false),silver));
const bead=new THREE.Mesh(new THREE.SphereGeometry(.068,12,10),silver);bead.position.set(Math.cos(phi)*1.19,Math.sin(phi)*1.19,.12);g.add(bead);
}
const stone=new THREE.Mesh(new THREE.SphereGeometry(.19,28,18),deep);stone.scale.z=.6;stone.position.z=.15;g.add(stone);
const hook=new THREE.Mesh(new THREE.TorusGeometry(.18,.042,12,32),silver);hook.position.y=1.63;g.add(hook);
g.rotation.x=-.12;return g;
}
function ebru(){
const canvas=document.createElement("canvas");canvas.width=700;canvas.height=700;
const c=canvas.getContext("2d");
const img=c.createImageData(700,700),colours=[[31,47,74],[184,110,73],[224,193,136],[72,111,121],[233,222,195]];
for(let y=0;y<700;y++)for(let x=0;x<700;x++){
const nx=(x-350)/350,ny=(y-350)/350;
const warp=ny*2.8+Math.sin(nx*9+ny*4)*.35;
const f=Math.sin(nx*18+Math.sin(warp*5)*3+Math.cos((nx+ny)*11)*.35)+Math.cos(warp*16-nx*9);
const z=(Math.sin(f*2.7)+1)/2;let n=Math.min(4,Math.floor(z*4.9));const i=(x+y*700)*4;
img.data[i]=colours[n][0];img.data[i+1]=colours[n][1];img.data[i+2]=colours[n][2];img.data[i+3]=255;
}
c.putImageData(img,0,0);
const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
const g=new THREE.Group(),surface=new THREE.Mesh(new THREE.CircleGeometry(1.55,120),new THREE.MeshPhysicalMaterial({map:texture,roughness:.3,metalness:.04,clearcoat:.8,side:THREE.DoubleSide}));g.add(surface);
const ceramic=new THREE.MeshPhysicalMaterial({color:0x3c4145,metalness:.16,roughness:.33,clearcoat:.65});
const rim=new THREE.Mesh(new THREE.TorusGeometry(1.58,.115,14,128),ceramic);g.add(rim);
const outer=new THREE.Mesh(new THREE.CylinderGeometry(1.58,1.3,.42,110,1,true),ceramic);outer.rotation.x=Math.PI/2;outer.position.z=-.19;g.add(outer);
g.rotation.x=-.31;g.rotation.y=.04;return g;
}
function textile(){
const canvas=document.createElement("canvas");canvas.width=1024;canvas.height=1024;
const c=canvas.getContext("2d");
c.fillStyle="#b4a38b";c.fillRect(0,0,1024,1024);
for(let y=0;y<1024;y+=11){
c.fillStyle=y%22===0?"#d7c5a8":"#83715d";c.fillRect(0,y,1024,2);
}
for(let x=0;x<1024;x+=13){
c.strokeStyle="rgba(53,45,40,.3)";c.lineWidth=2;c.beginPath();c.moveTo(x,0);c.lineTo(x,1024);c.stroke();
}
for(let x=110;x<1024;x+=210){for(let y=90;y<1024;y+=210){
c.strokeStyle="#2f5c76";c.lineWidth=15;c.beginPath();c.moveTo(x,y-78);c.lineTo(x+78,y);c.lineTo(x,y+78);c.lineTo(x-78,y);c.closePath();c.stroke();
c.strokeStyle="#764d42";c.lineWidth=6;c.strokeRect(x-29,y-29,58,58);
}}
const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
const positions=[],indices=[],nx=75,ny=110;
for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
const x=(i/nx-.5)*2.95,y=(j/ny-.5)*3.65;
const z=.16*Math.sin(x*3.7)+.15*Math.sin(y*4.2+x*2.1)+.09*Math.sin(x*9+y*2);
positions.push(x,y,z);}
for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
const a=j*(nx+1)+i,b=a+1,d=a+(nx+1),e=d+1;indices.push(a,d,b,b,d,e);
}
const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));geo.setIndex(indices);
const uv=[];for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++)uv.push(i/nx,j/ny);
geo.setAttribute("uv",new THREE.Float32BufferAttribute(uv,2));geo.computeVertexNormals();
const g=new THREE.Group();
g.add(new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:texture,roughness:.9,side:THREE.DoubleSide,metalness:0})));
for(const side of [-1,1]){
const pts=[];for(let j=0;j<=ny;j++){const k=j*(nx+1)+(side===1?nx:0);pts.push(new THREE.Vector3(positions[k*3],positions[k*3+1],positions[k*3+2]+.03));}
g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),100,.022,5),new THREE.MeshStandardMaterial({color:0xbca57e,roughness:.64})));
}
g.rotation.y=-.12;g.rotation.z=-.085;return g;
}
const creators={iznik,telkari,ebru,textile};
let current=null;
function dispose(root){root.traverse(obj=>{if(obj.geometry)obj.geometry.dispose();if(obj.material){const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>{if(m.map)m.map.dispose();m.dispose();});}});}
function switchModel(key){if(!creators[key])return;if(current){study.remove(current);dispose(current);}current=creators[key]();study.add(current);requestDraw();}
changed=switchModel;switchModel(active);
let dt=0,old=0;
function size(){const rect=canvas.getBoundingClientRect();if(rect.width<5||rect.height<5)return false;const w=Math.round(rect.width),h=Math.round(rect.height);renderer.setSize(w,h,false);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));camera.aspect=w/h;camera.updateProjectionMatrix();return true;}
function requestDraw(){if(!reduce&&visible&&!document.hidden&&!raf)raf=requestAnimationFrame(frame);else if(reduce&&visible&&!document.hidden)requestAnimationFrame(frame);}
function frame(ms){
raf=0;if(!visible||document.hidden||!size())return;
if(!reduce){dt=Math.min(40,(ms-old)||16);targetYaw+=dt*.00010;old=ms;}
yaw+=(targetYaw-yaw)*.07;pitch+=(targetPitch-pitch)*.08;
study.rotation.set(pitch,yaw,0);
renderer.render(scene,camera);
if(!reduce&&visible&&!document.hidden)raf=requestAnimationFrame(frame);
}
if("IntersectionObserver" in window)new IntersectionObserver(e=>{visible=!!e[0]?.isIntersecting;if(visible)requestDraw();else if(raf){cancelAnimationFrame(raf);raf=0;}},{threshold:.02}).observe(viewer);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)requestDraw();else if(raf){cancelAnimationFrame(raf);raf=0;}});
canvas.addEventListener("pointerdown",e=>{if(e.button!==0)return;drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);});
canvas.addEventListener("pointermove",e=>{if(!drag)return;targetYaw+=(e.clientX-lastX)*.008;targetPitch=Math.max(-.65,Math.min(.65,targetPitch+(e.clientY-lastY)*.005));lastX=e.clientX;lastY=e.clientY;requestDraw();});
canvas.addEventListener("pointerup",()=>{drag=false;});canvas.addEventListener("pointercancel",()=>{drag=false;});
canvas.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();targetYaw+=(e.key==="ArrowLeft"?-.16:.16);requestDraw();}});
window.addEventListener("resize",requestDraw,{passive:true});
canvas.addEventListener("webglcontextlost",e=>{e.preventDefault();if(raf)cancelAnimationFrame(raf);unsupported();});
viewer.classList.add("ready");requestDraw();
}catch(e){unsupported();}
})();
})();