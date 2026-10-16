/* Live, evidence-only commerce operating status. NO customer/merchant personal data, tracking or transaction initiators. */
(()=>{
 "use strict";
 const url="https://vlgibwclecuhnnrgycnx.supabase.co/functions/v1/anatolian-atlas-store?action=trade_status";
 const lang=document.documentElement.lang==="de"?"de":"en",de=lang==="de";
 const labels={
 en:{ready:"Database counters connected",fail:"Live counters unavailable — no status assumed",now:"Observed at",pending:"Not active — legal and verification gates",status:"Operational readiness: evidence gates pending"},
 de:{ready:"Echte Datenbankzähler verbunden",fail:"Live-Zähler nicht erreichbar – kein Status wird angenommen",now:"Abgerufen",pending:"Nicht aktiv – rechtliche Prüfung und Nachweise fehlen",status:"Betriebsbereitschaft: Prüfungen noch offen"}};
 const message=labels[lang];
 const put=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=String(v)};
 async function load(){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),9000);
  try{
   const response=await fetch(url,{method:"GET",cache:"no-store",signal:controller.signal,headers:{Accept:"application/json"}});
   if(!response.ok)throw Error("API "+response.status);
   const o=await response.json();
   if(!o?.ok||o?.commerce_mode!=="independent_EU_seller_of_record")throw Error("STATUS_INVALID");
   const values={
    researched:o.research_only_candidates,
    sellers:o.verified_independent_sellers,
    listings:o.approved_real_product_referrals,
    orders:o.externally_confirmed_orders,
    shipped:o.carrier_proven_deliveries,
    received:o.buyer_confirmed_receipts,
    satisfaction:o.consented_customer_satisfaction_records,
    disputes:o.unresolved_post_sale_cases,
    optins:o.opt_in_partner_requests
   };
   for(const [id,val] of Object.entries(values)){if(typeof val!=="number"||!Number.isInteger(val)||val<0)throw Error("INVALID_COUNT");put("metric-"+id,val);}
   put("live-message",message.ready);document.getElementById("live-indicator")?.classList.remove("offline");
   if(o.read_at){const date=new Date(o.read_at);if(!Number.isNaN(date.getTime()))put("live-time",message.now+" "+date.toLocaleString(de?"de-DE":"en-GB"));}
   const approved=!!o.partner_application_enabled;
   put("intake-state",approved?(de?"Geöffnet":"Open"):message.pending);
   if(o.live_checkout_enabled===true||o.provider_order_ingestion_enabled===true){
    put("operations-alert",de?"Statuswechsel melden: Händler- und Zahlungsprüfung erforderlich.":"Status change requires seller and payment verification.");
   }
  }catch(error){
   put("live-message",message.fail);document.getElementById("live-indicator")?.classList.add("offline");
   for(const key of ["researched","sellers","listings","orders","shipped","received","satisfaction","disputes","optins"])put("metric-"+key,"—");
  }finally{clearTimeout(timeout);}
 }
 load();
})();