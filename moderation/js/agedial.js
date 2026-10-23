// Bonnie's Dashboard: age dial line + family silhouette (display only).
// Reads the public age dial value (it holds only the number) from the simmie-chat site, same github.io origin.
// The page already shows 13 (mirrored at build time), so if the fetch fails nothing changes. No buttons, no pop-ups, sends nothing.
(function(){
  var box = document.getElementById("agedial"); if(!box) return;
  var out = document.getElementById("ad-age"), kb = document.getElementById("ad-kid-b"), kg = document.getElementById("ad-kid-g");
  // CDC 2000 stature-for-age 50th percentile (cm) at exact birthdays; dad = male median at 20.
  var DAD = 176.85, HB = {10:138.62,11:143.52,12:149.05,13:156.09,14:163.84,15:169.94,16:173.51}, HG = {10:137.99,11:143.98,12:151.19,13:157.15,14:160.39,15:161.86,16:162.55};
  function show(v){
    v = Math.round(+v); if(!(v >= 10 && v <= 16)) return;
    out.textContent = String(v); box.setAttribute("data-age", String(v));
    if(kb) kb.style.transform = "scale(" + (HB[v] / DAD).toFixed(4) + ")";
    if(kg) kg.style.transform = "scale(" + (HG[v] / DAD).toFixed(4) + ")";
  }
  show(box.getAttribute("data-age"));
  try{
    fetch("https://edgerequals.github.io/simmie-chat/age-dial.json?t=" + Date.now(), {cache:"no-store", credentials:"omit"})
      .then(function(r){ if(!r.ok) throw 0; return r.json(); })
      .then(function(j){ if(j && typeof j.age === "number") show(j.age); })
      .catch(function(){});
  }catch(e){}
})();
