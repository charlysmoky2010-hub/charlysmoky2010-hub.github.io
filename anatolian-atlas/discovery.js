/* ATLAS DISCOVERY / evidence planner: rules-based, on-device, zero network calls.
   No human identity, prices, warehouse stock, provenance certification or AI-generated sellers. */
(()=>{"use strict";
const de=document.documentElement.lang==="de";
const $=id=>document.getElementById(id);
const info={
 en:{
  crafts:{
   ceramics:{name:"Ceramics & glazed tableware",proof:[
    "Identify the actual maker and legal seller; distinguish workshop provenance from a retailer's country-of-origin claim.",
    "Request material and glaze specifications; verify food-contact compliance before offering bowls for food use.",
    "Match a real stock unit, size, finish, reference photos and dispatch time to the quoted SKU."
   ]},
   textile:{name:"Handwoven textiles",proof:[
    "Distinguish handwoven, machine-made and mixed production with workshop/process evidence.",
    "Request fibre content, dyes, care and country-of-origin information; verify any safety or labelling obligations.",
    "Verify dimensions, colour variation and a dated photo of the available piece before committing to delivery."
   ]},
   filigree:{name:"Filigree & metalwork",proof:[
    "Verify material composition and any silver purity or hallmark claims with suitable documentation.",
    "Check the maker identity, hand-work processes, accurate dimensions, and any EU product or nickel restrictions.",
    "Request insured shipment terms, returns/repair responsibilities and condition evidence."
   ]},
   ebru:{name:"Ebru & marbled works",proof:[
    "Identify the actual artist; distinguish one-off original art, reproduction and digital or workshop services.",
    "Document media, paper, dimensions, signed provenance and reproduction/display permissions.",
    "Verify preservation, protective packaging, transit liability and available inventory."
   ]}
  },
  uses:{
   retail:"Retail sourcing",interior:"Interior design",gallery:"Gallery / collections",hospitality:"Hotel or hospitality procurement"
  },
  regions:{de:"Germany",eu:"European Union"},
  basics:[
   "Verify seller-of-record legal details and the destination-specific sales terms before any purchase.",
   "Request an itemised, current quote stating price, taxes, shipping, returns and delivery responsibility.",
   "Record only seller-authorised order references and carrier events; a tracking scan does not prove customer satisfaction.",
   "Obtain written permission before reusing any third-party photographs or describing a merchant as a platform partner."
  ],
  extras:{
   retail:"Check consumer information, product category labelling, authenticity representations and return exposure.",
   interior:"Check sample approval, batch consistency, installation context and replacement availability.",
   gallery:"Check artist attribution, edition/original status, display and resale permissions.",
   hospitality:"Check procurement quantity, cleaning requirements, lead time, replacement and suitability for commercial use."
  },
  title:"Your evidence checklist",intro:"A local research outline—not a supplier verification certificate.",
  done:"Checklist ready. No answers were uploaded or saved.",
  copy:"Copy checklist",copied:"Copied",failed:"Select the checklist above and copy it manually.",
  status:"Preliminary buyer research only. No product availability, partnership or price is implied."
 },
 de:{
  crafts:{
   ceramics:{name:"Keramik & glasiertes Geschirr",proof:[
    "Tatsächlichen Hersteller und rechtlichen Verkäufer getrennt identifizieren; Werkstatt-Herkunft nicht aus Shop-Länderangaben ableiten.",
    "Material- und Glasurangaben einholen; Eignung für Lebensmittelkontakt bei Geschirr unabhängig prüfen.",
    "Größe, Dekor, aktuelle Fotos, realen Bestand und Lieferzeit mit der Artikelnummer abgleichen."
   ]},
   textile:{name:"Handgewebte Textilien",proof:[
    "Handweberei, maschinelle oder gemischte Fertigung mithilfe von Prozess- und Werkstattnachweisen unterscheiden.",
    "Faserzusammensetzung, Färbung, Pflege, Herkunft sowie relevante Kennzeichnungspflichten prüfen.",
    "Maße, Farbabweichungen und ein aktuelles Foto des tatsächlich verfügbaren Stücks verifizieren."
   ]},
   filigree:{name:"Filigran- & Metallarbeiten",proof:[
    "Material, Silbergehalt und Punzierung nur nach geeignetem Nachweis übernehmen.",
    "Hersteller, Fertigungsschritte, Maße und relevante EU-Produktsicherheitsanforderungen prüfen.",
    "Versicherten Versand, Rückgabe- und Reparaturpflichten sowie Zustandsnachweise klären."
   ]},
   ebru:{name:"Ebru & Marmorkunst",proof:[
    "Künstler und Unikate identifizieren; Original, Reproduktion und digitales Werk voneinander trennen.",
    "Material, Papier, Format, Signatur sowie Nutzungs- und Reproduktionsrechte dokumentieren.",
    "Konservierung, sichere Verpackung, Transportrisiko und tatsächliche Verfügbarkeit prüfen."
   ]}
  },
  uses:{
   retail:"Sortiment im Einzelhandel",interior:"Innenarchitektur",gallery:"Galerie / Sammlung",hospitality:"Hotel / Gastgewerbe"
  },
  regions:{de:"Deutschland",eu:"Europäische Union"},
  basics:[
   "Vertraglichen Verkäufer und Zielland-bezogene Kaufbedingungen vor der Bestellung nachweisen.",
   "Aktuelles Einzelangebot mit Preis, Steuern, Versand, Widerruf und Lieferverantwortung anfordern.",
   "Nur zulässig freigegebene Bestellnummern und Paketdienstereignisse nutzen; ein Paketscan ist keine Kundenzufriedenheit.",
   "Vor Nutzung fremder Produktbilder oder behaupteter Händlerpartnerschaften eine schriftliche Erlaubnis einholen."
  ],
  extras:{
   retail:"Verbraucherinformationen, Produktkennzeichnung, Echtheitsaussagen und Retourenrisiken prüfen.",
   interior:"Musterfreigabe, Chargenkonstanz, Montagebedingungen und Ersatzverfügbarkeit prüfen.",
   gallery:"Künstlernennung, Originalstatus, Ausstellung und Weiterverkaufsrechte prüfen.",
   hospitality:"Mengen, Reinigung, Lieferzeiten, Ersatz und gewerbliche Eignung prüfen."
  },
  title:"Ihre Nachweis-Checkliste",intro:"Nur eine lokale Recherchestruktur, keine Zertifizierung eines Lieferanten.",
  done:"Checkliste erstellt. Es wurden keine Antworten übertragen oder gespeichert.",
  copy:"Checkliste kopieren",copied:"Kopiert",failed:"Bitte Text oben markieren und manuell kopieren.",
  status:"Vorläufige Einkaufsrecherche. Keine Aussage über Bestand, Partnerschaft oder verbindliche Preise."
 }
};
const d=info[de?"de":"en"];
const form=$("evidence-form");
if(!form)return;
let currentText="";
const selects=[["craft",d.crafts],["use",d.uses],["region",d.regions]];
function safeOption(select,label,value){const option=document.createElement("option");option.value=value;option.textContent=label;select.appendChild(option);}
for(const [id,entries] of selects){
 const select=$(id);if(!select)continue;
 for(const [value,valueData] of Object.entries(entries)){
  safeOption(select,typeof valueData==="string"?valueData:valueData.name,value);
 }
}
form.addEventListener("submit",event=>{
 event.preventDefault();
 const craft=$("craft")?.value,usage=$("use")?.value,region=$("region")?.value;
 if(!d.crafts[craft]||!d.uses[usage]||!d.regions[region])return;
 const items=[...d.crafts[craft].proof,d.extras[usage],...d.basics];
 const section=$("evidence-result");section.replaceChildren();
 const title=document.createElement("h3");title.textContent=d.title;
 const label=document.createElement("p");label.className="sub";label.textContent=d.intro;
 const sub=document.createElement("p");sub.className="sub";
 sub.textContent=d.crafts[craft].name+" · "+d.uses[usage]+" · "+d.regions[region];
 const list=document.createElement("ol");
 for(const item of items){const li=document.createElement("li");li.textContent=item;list.appendChild(li);}
 const controls=document.createElement("div");controls.className="copyrow";
 const button=document.createElement("button");button.className="btn light";button.type="button";button.textContent=d.copy;
 const note=document.createElement("small");note.setAttribute("role","status");
 currentText="ATLAS DISCOVERY — "+d.title+"\n"+sub.textContent+"\n\n"+items.map((x,i)=>(i+1)+". "+x).join("\n")+"\n\n"+d.status;
 button.addEventListener("click",async()=>{
  try{if(!navigator.clipboard?.writeText)throw Error("clipboard_unavailable");await navigator.clipboard.writeText(currentText);note.textContent=d.copied;}catch{note.textContent=d.failed;}
 });
 controls.append(button,note);section.append(title,label,sub,list,controls);
 section.hidden=false;section.scrollIntoView({behavior:"smooth",block:"nearest"});
 const stat=$("planner-status");if(stat)stat.textContent=d.done;
});
})();