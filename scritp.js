const DESIGNS = [
    {t:"Modern Sliding Gate",      c:"Gates",     src:"images/gate-1.jpg",    h:420},
    {t:"Laser-Cut Panel Fence",    c:"Gates",     src:"images/fence-1.jpg",   h:300},
    {t:"Floating Steel Staircase", c:"Stairs",    src:"images/stairs-1.jpg",  h:480},
    {t:"Glass &amp; Steel Railing",c:"Railings",  src:"images/railing-1.jpg", h:320},
    {t:"Black Swing Gate",         c:"Gates",     src:"images/gate-2.jpg",    h:380},
    {t:"Spiral Staircase",         c:"Stairs",    src:"images/stairs-2.jpg",  h:440},
    {t:"Roof Truss Frame",         c:"Structural",src:"images/truss-1.jpg",   h:300},
    {t:"Balcony Balustrade",       c:"Railings",  src:"images/railing-2.jpg", h:360},
    {t:"Mezzanine Steel Floor",    c:"Structural",src:"images/steel-1.jpg",   h:400},
    {t:"Decorative Window Grill",  c:"Gates",     src:"images/grill-1.jpg",   h:330},
    {t:"Industrial Storage Rack",  c:"Industrial",src:"images/industrial-1.jpg",h:360},
    {t:"Carport Steel Canopy",     c:"Structural",src:"images/carport-1.jpg", h:340},
    {t:"Minimal Handrail",         c:"Railings",  src:"images/railing-3.jpg", h:300},
    {t:"Workshop Steel Building",  c:"Structural",src:"images/building-1.jpg",h:420},
    {t:"Custom Metal Door",        c:"Gates",     src:"images/door-1.jpg",    h:450},
    {t:"Hopper &amp; Tank Fabrication",c:"Industrial",src:"images/industrial-2.jpg",h:320},
    {t:"Metal Garden Furniture",   c:"Custom",    src:"images/custom-1.jpg",  h:340},
    {t:"Feature Wall Screen",      c:"Custom",    src:"images/custom-2.jpg",  h:410},
    {t:"Steel Pergola",            c:"Custom",    src:"images/custom-3.jpg",  h:360},
    {t:"Staircase with Glass",     c:"Stairs",    src:"images/stairs-3.jpg",  h:380}
];

const COLORS = ["#3a2a1f","#26323b","#3b2430","#27352b","#38301f","#2a2a3d"];
const ICON = '<svg class="icon"><use href="#i-image"/></svg>';

document.getElementById("yr").textContent = new Date().getFullYear();
const burger = document.getElementById("burger");
if (burger) burger.onclick = () => document.getElementById("menu").classList.toggle("open");

/* ---- saved pins (per visitor) ---- */
let saved = [];
try { saved = JSON.parse(localStorage.getItem("saved") || "[]"); } catch(e) {}
const persist = () => { try { localStorage.setItem("saved", JSON.stringify(saved)); } catch(e) {} };

function media(d, i, forceH){
  const wrap = document.createElement("div");
  const img = new Image();
  img.src = d.src; img.alt = d.t.replace(/&amp;/g,"&"); img.loading = "lazy";
  img.onerror = () => {
    wrap.innerHTML = '<div class="ph" style="height:'+(forceH||d.h)+'px;background:linear-gradient(160deg,'+COLORS[i%COLORS.length]+',#101417)">'+
      '<div>'+ICON+'<div>'+d.t+'</div></div></div>';
  };
  wrap.appendChild(img);
  return wrap;
}

/* ---- home page: featured tiles ---- */
const featured = document.getElementById("featured");
if (featured){
  [0,2,3,5,8,13].forEach((n,k)=>{
    const d = DESIGNS[n];
    const a = document.createElement("a");
    a.href = "gallery.html"; a.className = "tile";
    a.style.background = "linear-gradient(160deg,"+COLORS[k%COLORS.length]+",#101417)";
    const im = new Image(); im.src = d.src; im.alt = d.t; im.onerror = () => im.remove();
    a.appendChild(im);
    a.insertAdjacentHTML("beforeend","<span>"+d.t+"</span>");
    featured.appendChild(a);
  });
  const form = document.getElementById("quote");
  form.onsubmit = e => {
    e.preventDefault();
    const f = new FormData(form);
    const text = "Hello, I'd like a quote.\nName: "+f.get("name")+"\nPhone: "+f.get("phone")+"\nType: "+f.get("type")+"\nDetails: "+f.get("msg");
    /* CHANGE THE NUMBER (country code, no + or spaces) */
    window.open("https://wa.me/256778676138?text="+encodeURIComponent(text), "_blank");
  };
}

/* ---- gallery page: Pinterest-style masonry ---- */
const grid = document.getElementById("grid");
if (grid){
  const cats = ["All", ...new Set(DESIGNS.map(d=>d.c)), "Saved"];
  let cat = "All", term = "";
  const chips = document.getElementById("chips");
  cats.forEach(c=>{
    const b = document.createElement("button");
    b.className = "chip"+(c==="All"?" on":""); b.textContent = c;
    b.onclick = () => { cat = c; [...chips.children].forEach(x=>x.classList.toggle("on",x===b)); render(); };
    chips.appendChild(b);
  });
  document.getElementById("q").oninput = e => { term = e.target.value.toLowerCase(); render(); };

  function render(){
    grid.innerHTML = ""; let n = 0;
    DESIGNS.forEach((d,i)=>{
        const name = d.t.replace(/&amp;/g,"&");
        if (cat==="Saved" && !saved.includes(i)) return;
        if (cat!=="All" && cat!=="Saved" && d.c!==cat) return;
        if (term && !(name+" "+d.c).toLowerCase().includes(term)) return;
        n++;
        const pin = document.createElement("div"); pin.className = "pin";
        pin.appendChild(media(d,i));
        const ov = document.createElement("div"); ov.className = "overlay";
        ov.innerHTML = '<div class="top"><span>'+d.c+'</span></div><div class="bottom">'+d.t+'</div>';
        const save = document.createElement("button");
        save.className = "save"+(saved.includes(i)?" done":""); save.textContent = saved.includes(i)?"Saved":"Save";
        save.onclick = e => { e.stopPropagation(); toggle(i); render(); };
        ov.querySelector(".top").appendChild(save);
        pin.appendChild(ov);
        pin.onclick = () => openLb(i);
        grid.appendChild(pin);
    });
    document.getElementById("empty").style.display = n ? "none" : "block";
  }
  function toggle(i){ saved = saved.includes(i) ? saved.filter(x=>x!==i) : [...saved,i]; persist(); }

  const lb = document.getElementById("lb");
  function openLb(i){
    const d = DESIGNS[i];
    const m = document.getElementById("lbMedia"); m.innerHTML = ""; m.appendChild(media(d,i,420));
    document.getElementById("lbCat").textContent = d.c;
    document.getElementById("lbTitle").innerHTML = d.t;
    const s = document.getElementById("lbSave");
    const paint = () => s.textContent = saved.includes(i) ? "Saved ✓" : "Save";
    paint(); s.onclick = () => { toggle(i); paint(); render(); };
    lb.classList.add("open");
  }
  const close = () => lb.classList.remove("open");
  document.getElementById("lbClose").onclick = close;
  lb.onclick = e => { if (e.target===lb) close(); };
  document.addEventListener("keydown", e => { if (e.key==="Escape") close(); });
  render();
}