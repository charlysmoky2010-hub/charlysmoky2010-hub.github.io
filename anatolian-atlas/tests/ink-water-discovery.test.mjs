// Run: node --test anatolian-atlas/tests/ink-water-discovery.test.mjs
// Uses inert simulated releases, never sends payment, publishes or downloads a product.
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {join, dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {runInNewContext} from "node:vm";

const dir=join(dirname(fileURLToPath(import.meta.url)), "..");
const read=name=>readFileSync(join(dir,name),"utf8");
const guide=read("ebru-flower-motifs.html");
const store=read("ink-water.html");
const homepage=read("index.html");
const free=read("free-wave-exercise.html");
const gate=read("ink-water-sales-gate.js");
const release=JSON.parse(read("ink-water-release.json"));
const sitemap=read("../sitemap.xml");

test("seven flower rows are presented with five explicitly named languages",()=>{
  assert.equal((guide.match(/<tr><td lang="tr">/g)||[]).length,7);
  assert.equal((guide.match(/<td lang="es">/g)||[]).length,7);
  for(const lang of ['lang="tr"','lang="de"','lang="en"','lang="el"','lang="es"']){
    assert.ok(guide.includes(lang),lang);
  }
  for(const flower of ["Lale","Karanfil","Sümbül","Gül","Menekşe","Gelincik","Papatya"]){
    assert.ok(guide.includes(">"+flower+"</td>"),flower);
  }
});

test("heritage references, honest digital disclosure and no paid preview",()=>{
  assert.ok(guide.includes("https://ich.unesco.org/en/RL/traditional-turkish-art-of-ebru-00644"));
  assert.ok(guide.includes("https://yakegm.ktb.gov.tr/TR-345124/ebru-turkish-art-of-marbling.html"));
  assert.match(guide,/NOT HANDMADE EBRU/);
  assert.match(guide,/does not teach authentic water-marbling/);
  assert.match(guide,/not available for checkout yet/);
  assert.doesNotMatch(guide,/href="https:\/\/ko-fi\.com\/s\//);
});

test("existing owned pages link to the new discovery page",()=>{
  for (const html of [homepage,store,free]){
    assert.ok(html.includes('href="ebru-flower-motifs.html"'));
  }
  assert.ok(guide.includes('href="free-wave-exercise.html"'));
  assert.ok(guide.includes('href="ink-water.html"'));
  assert.ok(guide.includes('src="./ink-water-sales-gate.js"'));
});

test("production release stays blocked and sale readiness is not fabricated",()=>{
  assert.equal(release.state,"prelaunch");
  assert.equal(release.checkout_url,null);
  for (const field of ["owner_release_approved","verified_paid_fulfillment","verified_product_rights","verified_merchant_compliance"]){
    assert.equal(release[field],false);
  }
});

function runGate(config){
  const cta={href:"",textContent:"",target:"",rel:"",
    setAttribute(k,v){this[k]=v;},removeAttribute(k){delete this[k];}};
  const status={textContent:""};
  const sandbox={
    document:{getElementById(id){return id==="paid-cta"?cta:id==="sales-gate-status"?status:null;}},
    URL,
    fetch(){return Promise.resolve({ok:true,json:()=>Promise.resolve(config)});}
  };
  runInNewContext(gate,sandbox,{timeout:1000});
  return Promise.resolve().then(()=>Promise.resolve()).then(()=>Promise.resolve())
   .then(()=>({cta,status}));
}
const paidReady={
  ...release,state:"live",checkout_url:"https://ko-fi.com/s/ABCdE12345",
  owner_release_approved:true,verified_paid_fulfillment:true,
  verified_product_rights:true,verified_merchant_compliance:true
};
test("simulated prelaunch keeps free route, no generic tip as payment",async()=>{
  const {cta,status}=await runGate(release);
  assert.equal(cta.href,"free-wave-exercise.html");
  assert.match(status.textContent,/No payment is taken here/);
});
test("synthetic owner-approved and verified checkout gates correctly",async()=>{
  const {cta,status}=await runGate(paidReady);
  assert.equal(cta.href,paidReady.checkout_url);
  assert.match(status.textContent,/Ko-fi/);
});
test("missing legal gate and malicious checkout URL both fail closed",async()=>{
  for(const modified of [
    {...paidReady,verified_merchant_compliance:false},
    {...paidReady,checkout_url:"https://ko-fi.com.evil.example/s/ABCdE12345"},
    {...paidReady,checkout_url:"https://ko-fi.com/s/ABCdE12345?redirect=evil"},
    {...paidReady,display_price_eur:1},
  ]){
    const {cta,status}=await runGate(modified);
    assert.equal(cta.href,"free-wave-exercise.html");
    assert.match(status.textContent,/No payment/);
  }
});


test("sitemap contains the current product, exercise and new glossary",()=>{
 for(const path of ["ink-water.html","free-wave-exercise.html","ebru-flower-motifs.html"]){
  assert.ok(sitemap.includes("<loc>https://charlysmoky2010-hub.github.io/anatolian-atlas/"+path+"</loc>"),path);
 }
});


test("Japanese Suminagashi is documented with original script and credible museum",()=>{
  assert.ok(guide.includes('id="traditions"'));
  assert.ok(guide.includes('墨流し'));
  assert.ok(guide.includes('Suminagashi'));
  assert.ok(guide.includes("https://www.metmuseum.org/perspectives/playing-with-paper"));
  assert.ok(guide.includes("twelfth century"));
  assert.ok(guide.includes("ink is floated on water") || guide.includes("Ink is floated on water"));
  assert.ok(guide.includes("not automatically an authentic handmade Suminagashi piece"));
});

test("Spanish marmoleado has correct bookbinding terms and distinguishes heritage",()=>{
  for(const term of ["Papel jaspeado","papel de aguas","papel al baño","book endpapers"]){
    assert.ok(guide.toLowerCase().includes(term.toLowerCase()),term);
  }
  assert.ok(guide.includes("https://www.ucm.es/quidestliber/marmoleado"));
  assert.ok(guide.includes("https://www.cultura.gob.es/cultura/archivos/difusion/mc-difusion/encuadernaciones-artisticas/papeles-pintados/papeles-jaspeados.html"));
  assert.match(guide,/wider European paper-marbling tradition/);
  assert.match(guide,/not a separate claim that all such marbling originated in Spain/);
});

test("new international tradition is educational, not a made-up purchasable SKU",()=>{
  assert.match(guide,/INK &amp; WATER/);
  assert.ok(guide.includes("not available for checkout yet"));
  assert.equal(release.state,"prelaunch");
  assert.equal(release.checkout_url,null);
  const schemaTag=guide.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
  assert.ok(schemaTag,"Article schema must be present");
  const schema=JSON.parse(schemaTag[1]);
  for(const code of ["tr","en","de","el","es"]){
    assert.ok(schema.inLanguage.includes(code),code);
  }
});
