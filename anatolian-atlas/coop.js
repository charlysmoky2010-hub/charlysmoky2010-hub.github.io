/* Anatolian Atlas Cooperative — online read-only status + authenticated applicant/member portal.
 * Client only carries Supabase PUBLISHABLE key, never service role. No auto outreach or payments. */
const API="https://vlgibwclecuhnnrgycnx.supabase.co/functions/v1/anatolian-atlas-store";
const PROJECT="https://vlgibwclecuhnnrgycnx.supabase.co";
const PUBLISHABLE="sb_publishable_AE6_88Ue_rI9s7kDpibajw_SnhMJJNL";
const lang=document.documentElement.lang==="de"?"de":"en";
const de=lang==="de", el=id=>document.getElementById(id);
const msg={
en:{server:"Live cooperative service is temporarily unavailable.",none:"No published member motions yet. Real proposals will appear after participants are reviewed.",login:"Sign in to begin a producer application.",verify:"Account request submitted. Check your email for confirmation, then sign in to complete the application. This has not made you a cooperative member.",authfail:"Authentication was not completed. Check email confirmation and credentials.",signin:"You are signed in. Your private application status is loading.",applied:"Your producer application was received for human review. This is not legal cooperative membership.",active:"Your pilot participant account is active. You can propose motions and vote on eligible published motions.",restricted:"Motions and voting require independently reviewed participant status.",consent:"Consent and both your craft and name are required.",saved:"Application recorded successfully. Membership is not automatic.",motion:"Draft motion recorded. It becomes visible only after independent review.",voted:"Your vote has been recorded. This vote cannot be changed.",bad:"The requested action could not be completed.",empty:"No eligible voting window is open.",open:"Voting open",draft:"Draft",closed:"Closed"},
de:{server:"Der Kooperationsdienst ist vorübergehend nicht erreichbar.",none:"Bisher gibt es keine veröffentlichten Mitgliedsanträge zur Abstimmung. Echte Beschlüsse erscheinen nach der Prüfung der Teilnehmenden.",login:"Melde dich an, um eine Werkstattbewerbung zu starten.",verify:"Kontoregistrierung beantragt. Bitte E-Mail bestätigen und dann anmelden. Dies ist noch keine Genossenschaftsmitgliedschaft.",authfail:"Anmeldung fehlgeschlagen. Prüfe Bestätigung und Zugangsdaten.",signin:"Du bist angemeldet. Der Status der Bewerbung wird abgerufen.",applied:"Deine Bewerbung ist für die menschliche Prüfung eingegangen. Es handelt sich nicht um eine rechtliche Genossenschaftsmitgliedschaft.",active:"Du bist für den Pilotbetrieb geprüft. Du kannst Vorschläge einreichen und über offene Anträge abstimmen.",restricted:"Anträge und Abstimmungen sind geprüften Teilnehmenden vorbehalten.",consent:"Einwilligung, Name und Handwerksart sind erforderlich.",saved:"Bewerbung gespeichert. Die Mitgliedschaft ist nicht automatisch.",motion:"Beschlussentwurf gespeichert. Erst nach separater Prüfung wird er öffentlich.",voted:"Deine Stimme wurde unveränderlich erfasst.",bad:"Der Vorgang konnte nicht ausgeführt werden.",empty:"Derzeit ist keine Abstimmung geöffnet.",open:"Abstimmung offen",draft:"Entwurf",closed:"Geschlossen"}};
const t=msg[lang];
let auth=null,client=null,current=null,currentMember=null,motions=[];
function feedback(text,error=false){const x=el("account-feedback");if(x){x.textContent=text;x.className="feedback "+(error?"error":"success");}}
function text(id,value){const x=el(id);if(x)x.textContent=String(value);}
async function request(action,method="GET",data=null,withAuth=false){
 const headers={"Accept":"application/json"};
 if(data!==null)headers["Content-Type"]="application/json";
 if(withAuth){
  const result=await client.auth.getSession();
  const token=result?.data?.session?.access_token;
  if(!token)throw Error("AUTH_REQUIRED");
  headers["Authorization"]="Bearer "+token;
 }
 const result=await fetch(API+"?action=coop_"+action,{method,headers,body:data!==null?JSON.stringify(data):undefined,cache:"no-store"});
 let content;try{content=await result.json()}catch{throw Error("BAD_RESPONSE")}
 if(!result.ok||!content?.ok)throw Error(content?.error||"HTTP_"+result.status);
 return content;
}
async function refreshStats(){
 try{
  const data=await request("status");
  const countMap={"coop-active":data.active_participants,"coop-applications":data.applications_under_review,
  "coop-motions":data.motions_registered,"coop-revenue":data.provider_verified_revenue_entries,
  "coop-votes":data.ballots_recorded,"coop-policy":data.approved_distribution_policies,
  "coop-interests":data.maker_interest_records};
  for(const [id,value] of Object.entries(countMap))text(id,Number.isFinite(value)?value:"?");
  const x=el("coop-live");if(x)x.textContent=de?"Echtzeitstatus: geprüft · Keine rechtliche eG":"Live record: verified · Not a legal eG";
 }catch(_){text("coop-live",t.server);for(const id of ["coop-active","coop-applications","coop-motions","coop-revenue","coop-votes","coop-policy","coop-interests"])text(id,"—");}
}
async function refreshMotions(){
 const container=el("public-motions");
 if(!container)return;
 try{
  const data=await request("motions");motions=data.motions||[];container.replaceChildren();
  if(!motions.length){const p=document.createElement("p");p.className="muted";p.textContent=t.none;container.append(p);return;}
  for(const m of motions){
   const article=document.createElement("article");article.className="motion";
   const heading=document.createElement("h4");heading.textContent=m.title;
   const paragraph=document.createElement("p");paragraph.textContent=m.detail;
   const sub=document.createElement("small");sub.textContent=String(m.status).toUpperCase()+" · "+(m.closes_at?new Date(m.closes_at).toLocaleDateString(lang):"");
   article.append(heading,paragraph,sub);
   const eligible=currentMember?.status==="active"&&m.status==="open"&&m.closes_at&&Date.parse(m.closes_at)>Date.now();
   if(eligible){
    const row=document.createElement("div");row.className="vote-options";
    for(const [option,label] of [["yes",de?"Ja":"Yes"],["no",de?"Nein":"No"],["abstain",de?"Enthaltung":"Abstain"]]){
     const btn=document.createElement("button");btn.textContent=label;btn.type="button";
     btn.addEventListener("click",async()=>{
      btn.disabled=true;try{await request("vote","POST",{proposal_id:m.id,position:option},true);feedback(t.voted);await refreshStats();}
      catch(e){feedback(t.bad+" ("+String(e?.message||"unknown")+")",true);}finally{btn.disabled=false;}
     });row.append(btn);
    }article.append(row);
   }
   container.append(article);
  }
 }catch(_){container.textContent=t.server;}
}
function show(id,value){const x=el(id);if(x)x.hidden=!value;}
async function refreshMembership(){
 if(!client)return;
 const {data}=await client.auth.getSession();current=data?.session?.user||null;
 const online=!!current;
 show("guest-form",!online);show("signed-in",online);
 if(!online){show("application-form",false);show("motion-form",false);text("member-status",t.login);currentMember=null;await refreshMotions();return;}
 text("member-status",t.signin);
 try{
  const record=await request("me","GET",null,true);currentMember=record.application;
  if(!currentMember){text("member-status",de?"Noch kein Mitgliedsantrag. Bewerbung kann ausgefüllt werden.":"No applicant record yet. You can submit a producer application.");show("application-form",true);show("motion-form",false);}
  else{
   show("application-form",false);
   const active=currentMember.status==="active";
   text("member-status",(active?t.active:t.applied)+" · "+currentMember.status);
   show("motion-form",active);
  }
 }catch(e){currentMember=null;show("application-form",false);show("motion-form",false);text("member-status",t.authfail);}
 await refreshMotions();
}
async function ready(){
 await Promise.all([refreshStats(),refreshMotions()]);
 try{
  const sdk=await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.95.0/+esm");
  client=sdk.createClient(PROJECT,PUBLISHABLE,{auth:{detectSessionInUrl:true,autoRefreshToken:true,persistSession:true}});
  client.auth.onAuthStateChange((_event,_session)=>{queueMicrotask(()=>refreshMembership());});
  await refreshMembership();
  text("auth-note",de?"Konten und Anmeldung über Supabase Auth. Kein Passwort wird an Anatolian Atlas gesendet.":"Accounts and sign-in via Supabase Auth. Anatolian Atlas never receives your password.");
 }catch(_){feedback(de?"Anmeldung ist vorübergehend nicht erreichbar.":"Login is temporarily unavailable.",true);text("auth-note",t.server);}
 const sign=el("login-form");
 sign?.addEventListener("submit",async(e)=>{
  e.preventDefault();if(!client)return;const fd=new FormData(sign);const email=String(fd.get("email")||"").trim();const password=String(fd.get("password")||"");
  if(!email||password.length<8){feedback(de?"Bitte gültige E-Mail und mindestens 8 Zeichen Passwort.":"Enter a valid email and a password of at least 8 characters.",true);return;}
  const submit=sign.querySelector("button[type=submit]");if(submit)submit.disabled=true;
  try{const r=await client.auth.signInWithPassword({email,password});if(r.error)throw r.error;feedback(t.signin);await refreshMembership();}
  catch(_){feedback(t.authfail,true);}finally{if(submit)submit.disabled=false;}
 });
 el("register-account")?.addEventListener("click",async()=>{
  if(!client)return;const fd=new FormData(el("login-form")),email=String(fd.get("email")||"").trim(),password=String(fd.get("password")||"");
  if(!email||password.length<8){feedback(de?"E-Mail und Passwort mit mindestens 8 Zeichen erforderlich.":"An email and a password of at least 8 characters are required.",true);return;}
  const btn=el("register-account");btn.disabled=true;
  try{
    const {error}=await client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname}});
    if(error)throw error;feedback(t.verify);
  }catch(_){feedback(t.authfail,true);}finally{btn.disabled=false;}
 });
 el("logout")?.addEventListener("click",async()=>{if(client){await client.auth.signOut();currentMember=null;feedback("");await refreshMembership();}});
 const applicant=el("application-form");
 applicant?.addEventListener("submit",async(e)=>{
  e.preventDefault();if(!client)return;const fd=new FormData(applicant);
  const payload={display_name:String(fd.get("name")||"").trim(),craft_area:String(fd.get("craft")||"").trim(),
    location_country:String(fd.get("country")||"").trim(),role:String(fd.get("role")||"producer"),consent:fd.get("consent")==="on"};
  if(!payload.consent||payload.display_name.length<2||payload.craft_area.length<2){feedback(t.consent,true);return;}
  const btn=applicant.querySelector('button[type="submit"]');if(btn)btn.disabled=true;
  try{await request("apply","POST",payload,true);feedback(t.saved);await refreshMembership();await refreshStats();}
  catch(e){feedback(t.bad+" ("+String(e?.message||"unknown")+")",true);}finally{if(btn)btn.disabled=false;}
 });
 const motion=el("motion-form");
 motion?.addEventListener("submit",async(e)=>{
  e.preventDefault();const fd=new FormData(motion),title=String(fd.get("title")||"").trim(),detail=String(fd.get("detail")||"").trim();
  if(title.length<12||detail.length<30){feedback(t.bad,true);return;}
  const btn=motion.querySelector('button[type="submit"]');if(btn)btn.disabled=true;
  try{await request("propose","POST",{title,detail},true);motion.reset();feedback(t.motion);await refreshStats();}
  catch(e){feedback(t.bad+" ("+String(e?.message||"unknown")+")",true);}finally{if(btn)btn.disabled=false;}
 });
}
ready();
