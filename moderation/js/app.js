// Rebella moderation dashboard. Static only: gate + localStorage decisions.
(function(){
  "use strict";
  var CFG = window.REBELLA_GATE || {unset:true};
  var ITEMS = window.REBELLA_ITEMS || [];
  var SKEY = "rebella-mod-session";          // sessionStorage: unlocked for this tab session
  var DKEY = "rebella-mod-decisions-v1";     // localStorage: decisions (this browser only)
  var CAT = {"Make It":"c-make","Big Questions":"c-questions","Mind & Body":"c-mind","Your World":"c-world","Read Watch Listen":"c-rwl","Your Voice":"c-voice"};
  var $ = function(s){return document.querySelector(s);};
  var filter = "pending", rejectId = null;

  function hex(buf){return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,"0");}).join("");}
  function fromHex(h){var a=new Uint8Array(h.length/2);for(var i=0;i<a.length;i++)a[i]=parseInt(h.substr(i*2,2),16);return a;}
  function safeEq(a,b){if(a.length!==b.length)return false;var r=0;for(var i=0;i<a.length;i++)r|=a.charCodeAt(i)^b.charCodeAt(i);return r===0;}

  async function derive(code){
    var key = await crypto.subtle.importKey("raw", new TextEncoder().encode(code), "PBKDF2", false, ["deriveBits"]);
    var bits = await crypto.subtle.deriveBits({name:"PBKDF2", hash:"SHA-256", salt:fromHex(CFG.salt), iterations:CFG.iterations}, key, 256);
    return hex(bits);
  }

  function isUnlocked(){ return !CFG.unset && sessionStorage.getItem(SKEY) === CFG.hash; }
  function show(){
    var ok = isUnlocked();
    $("#gate").hidden = ok; $("#app").hidden = !ok;
    document.body.classList.toggle("locked", !ok);
    if(ok) render(); else setTimeout(function(){ $("#passcode").focus(); }, 0);
  }

  // ---------- gate ----------
  var fails = 0;
  $("#gate-form").addEventListener("submit", async function(e){
    e.preventDefault();
    var msg = $("#gate-msg"), input = $("#passcode");
    msg.className = "gate-msg";
    if(CFG.unset){ msg.className="gate-msg warn"; msg.textContent="Passcode not set up yet. Run build_gate.py first."; return; }
    if(!window.crypto || !crypto.subtle){ msg.textContent="This page needs HTTPS to check the passcode."; return; }
    var btn = this.querySelector("button"); btn.disabled = true; msg.textContent = "Checking...";
    try{
      var h = await derive(input.value.trim());
      if(safeEq(h, CFG.hash)){ sessionStorage.setItem(SKEY, CFG.hash); input.value=""; msg.textContent=""; fails=0; show(); }
      else { fails++; input.value=""; msg.textContent="That passcode didn't work."; await new Promise(function(r){setTimeout(r, Math.min(4000, 400*fails));}); }
    } finally { btn.disabled = false; if(!isUnlocked()) input.focus(); }
  });
  $("#lock").addEventListener("click", function(){ sessionStorage.removeItem(SKEY); show(); });

  // ---------- decisions ----------
  function load(){ try{ return JSON.parse(localStorage.getItem(DKEY)) || {}; }catch(e){ return {}; } }
  function save(d){ localStorage.setItem(DKEY, JSON.stringify(d)); }
  function statusOf(d,id){ return d[id] ? d[id].status : "pending"; }
  function decide(id, status, reason){
    var d = load();
    if(status === "pending") delete d[id];
    else d[id] = {status:status, reason:reason||"", decidedAt:new Date().toISOString()};
    save(d); render();
  }

  function el(tag, cls, text){ var n=document.createElement(tag); if(cls)n.className=cls; if(text!=null)n.textContent=text; return n; }
  function btn(label, cls, fn){ var b=el("button","btn "+cls,label); b.type="button"; b.addEventListener("click",fn); return b; }

  function card(it, d){
    var st = statusOf(d, it.id), rec = d[it.id];
    var a = el("article", "item " + (CAT[it.category]||"c-make"));
    var top = el("div","top"), left = el("div");
    left.appendChild(el("span","tag",it.category));
    left.appendChild(el("span","type",it.type));
    top.appendChild(left);
    var r = el("div"); var ex = el("span","example","Example"); ex.style.marginRight=".4rem";
    r.appendChild(ex); r.appendChild(el("span","status "+st, st)); top.appendChild(r);
    a.appendChild(top);
    a.appendChild(el("h3",null,it.title));
    a.appendChild(el("p","src","Source: "+it.source));
    a.appendChild(el("p","sum",it.summary));
    var dl = el("dl"); dl.appendChild(el("dt",null,"Suggested age:"));
    dl.appendChild(el("dd","age"+(/not/i.test(it.age)?" bad":""),it.age));
    a.appendChild(dl);
    var ul = el("ul","flags");
    if(!it.flags.length) ul.appendChild(el("li","none","No flags"));
    it.flags.forEach(function(f){ ul.appendChild(el("li",null,"\u26A0 "+f)); });
    a.appendChild(ul);
    if(rec){
      var when = new Date(rec.decidedAt).toLocaleString("en-AU",{dateStyle:"medium",timeStyle:"short"});
      a.appendChild(el("p","decision",(st==="approved"?"Approved ":"Rejected ")+when+(rec.reason?" \u2014 "+rec.reason:"")));
    }
    var acts = el("div","actions");
    if(st === "pending"){
      acts.appendChild(btn("\u2713 Approve","btn-approve",function(){ decide(it.id,"approved"); }));
      acts.appendChild(btn("\u2715 Reject","btn-primary",function(){ openReject(it); }));
    } else {
      acts.appendChild(btn("\u21B6 Undo","btn-secondary",function(){ decide(it.id,"pending"); }));
    }
    a.appendChild(acts);
    return a;
  }

  function render(){
    var d = load(), q = $("#queue"), counts = {pending:0,approved:0,rejected:0,all:ITEMS.length};
    ITEMS.forEach(function(it){ counts[statusOf(d,it.id)]++; });
    Object.keys(counts).forEach(function(k){ $("#c-"+k).textContent = counts[k]; });
    document.querySelectorAll(".tab").forEach(function(t){ t.setAttribute("aria-selected", t.dataset.filter===filter ? "true":"false"); });
    q.textContent = "";
    var shown = ITEMS.filter(function(it){ return filter==="all" || statusOf(d,it.id)===filter; });
    shown.forEach(function(it){ q.appendChild(card(it,d)); });
    $("#empty").hidden = shown.length > 0;
  }

  document.querySelectorAll(".tab").forEach(function(t){
    t.addEventListener("click", function(){ filter = t.dataset.filter; render(); });
  });

  // ---------- reject dialog ----------
  var dlg = $("#reject-dlg");
  function openReject(it){
    rejectId = it.id; $("#reject-title").textContent = it.title;
    $("#reason").value = ""; $("#reason-pick").value = "";
    if(dlg.showModal) dlg.showModal(); else { var r = prompt("Reason (optional)"); if(r!==null) decide(it.id,"rejected",r); }
  }
  dlg.addEventListener("close", function(){
    if(dlg.returnValue === "ok" && rejectId){
      var reason = [$("#reason-pick").value, $("#reason").value.trim()].filter(Boolean).join(": ");
      decide(rejectId, "rejected", reason);
    }
    rejectId = null;
  });

  // ---------- export / reset ----------
  $("#export").addEventListener("click", function(){
    var d = load();
    var out = {exportedAt:new Date().toISOString(), note:"EXAMPLE data from the Rebella moderation prototype", decisions:
      ITEMS.map(function(it){ var r=d[it.id]||{}; return {id:it.id,title:it.title,source:it.source,type:it.type,category:it.category,status:r.status||"pending",reason:r.reason||"",decidedAt:r.decidedAt||null}; })};
    var blob = new Blob([JSON.stringify(out,null,2)],{type:"application/json"});
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "rebella-decisions-"+new Date().toISOString().slice(0,10)+".json";
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1000);
  });
  $("#reset").addEventListener("click", function(){
    if(confirm("Clear every decision saved in this browser?")){ localStorage.removeItem(DKEY); render(); }
  });

  show();
})();
