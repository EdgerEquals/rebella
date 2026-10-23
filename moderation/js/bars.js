// Static header/footer: the bars are position:fixed in CSS and never move.
// This only measures their heights so the page content is padded clear of them
// (e.g. when the Reset strip opens inside the header). It never moves the bars.
(function(){
  var root = document.documentElement;
  function set(){
    var h = document.getElementById("app-head"), f = document.getElementById("app-foot");
    if(h && h.offsetHeight) root.style.setProperty("--app-head-h", h.offsetHeight + "px");
    if(f && f.offsetHeight) root.style.setProperty("--app-foot-h", f.offsetHeight + "px");
  }
  set();
  if("ResizeObserver" in window){
    var ro = new ResizeObserver(set);
    ["app-head","app-foot"].forEach(function(id){ var el = document.getElementById(id); if(el) ro.observe(el); });
  }
  var app = document.getElementById("app");
  if(app && "MutationObserver" in window) new MutationObserver(set).observe(app, {attributes:true, attributeFilter:["hidden"]});
})();
