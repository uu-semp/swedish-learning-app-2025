// ==============================================
// Owned by Team 05 — Medium Levels (4–6)
// ==============================================
"use strict";

const SAVE_KEY = "team05";
const $id = (s) => document.getElementById(s);
const show = (sel) => $(sel).removeClass("hidden");
const hide = (sel) => $(sel).addClass("hidden");

function shuffle(arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function chunk(arr,n){const o=[];for(let i=0;i<arr.length;i+=n)o.push(arr.slice(i,i+n));return o;}
function normalizeSv(s){return (s||"").trim().toLowerCase().replace(/^(en|ett)\s+/,"");}

// ---------------- save/load ----------------
function getSaved(){
  const bag=window.save.get(SAVE_KEY)||{};
  return bag.progress||{unlocked:4,completed:[],medium:{levelIdx:0,itemIdx:0}};
}
function putSaved(p){const bag=window.save.get(SAVE_KEY)||{};bag.progress=p;window.save.set(SAVE_KEY,bag);}

// ---------------- vocabulary data ----------------
function loadFurnitureItems(){
  const ids=(window.vocabulary.get_category&&window.vocabulary.get_category("furniture"))||[];
  const out=[];
  for(const id of ids){
    const v=window.vocabulary.get_vocab(id)||{};
    out.push({id,en:v.en||"",sv:v.sv||"",sv_pl:v.sv_pl||"",img:v.img||"",article:v.article||""});
  }
  return out.filter(x=>x.en||x.img);
}
function buildMediumLevels(all,perLevel=5){
  const usable=all.filter(x=>x.sv);
  const shuffled=shuffle(usable);
  const groups=chunk(shuffled,perLevel).slice(0,3); // levels 4–6
  return groups;
}

// Changed it here
function imageCandidates(raw) {
  // Accept many shapes and try several fallbacks
  const r = String(raw || "").trim();

  // absolute URL → just use it
  if (/^https?:\/\//i.test(r)) return [r];

  // strip leading "./" or "/" so we can build relative paths
  const s = r.replace(/^\.?\//, "").replace(/^\/+/, "");

  const c = new Set();

  // as-is (in case CSV already gives a good relative path)
  if (s) c.add(s);

  // If it already starts with "assets/", fix it relative to team05/
  if (s.startsWith("assets/")) c.add(`../${s}`);

  // If it starts with "images/" or "furniture/", prepend the known base
  if (s.startsWith("images/")) c.add(`../assets/${s}`);
  if (s.startsWith("furniture/")) c.add(`../assets/images/${s}`);

  // Common fallbacks when CSV only has a filename or subpath
  c.add(`../assets/images/${s}`);                 // e.g., bed.png or furniture/bed.png
  c.add(`../assets/images/furniture/${s}`);       // e.g., bed.png

  return Array.from(c);
}


// ---------------- ui state ----------------
const Medium={levels:[],items:[],idx:0,levelNumber:4};

// ---------------- core flow ----------------
function go(sel){["#start-screen","#level-select","#medium-screen","#win-screen","#intro-modal"].forEach(hide);show(sel);}

function updateProgressUI(p){
  const done=p.completed.length,total=3;
  $("#overall-progress").text(`Progress ${done}/${total} levels`);
  $(".level-btn").each(function(){
    const n=Number($(this).data("level"));
    $(this).removeClass("completed");
    if(p.completed.includes(n))$(this).addClass("completed");
  });
}

function mediumStart(level,p){
  Medium.levelNumber=level;
  const idx=level-4;
  Medium.items=Medium.levels[idx]||[];
  Medium.idx=0;
  $("#medium-level-number").text(level);
  $("#medium-progress").text(`0/${Medium.items.length}`);
  renderWord();
  go("#medium-screen");
}

function renderWord() {
  const slot = $("#medium-image-wrap").empty();
  $("#medium-feedback").text("");
  const cur = Medium.items[Medium.idx];
  if (!cur) return;

  // Changed it here — robust multi-candidate image loading
  const candidates = imageCandidates(cur.img);
  const alt = cur.en || "object";
  const placeholder = `https://via.placeholder.com/300x200?text=${encodeURIComponent(alt || "No Image")}`;

  const $img = $("<img>").attr({ alt });

  let i = 0;
  const tryNext = () => {
    if (i >= candidates.length) {
      console.warn("Image not found. Using placeholder:", placeholder, "for", cur);
      $img.attr("src", placeholder);
      return;
    }
    const src = candidates[i++];
    // tiny guard to avoid looping forever if placeholder errors (unlikely)
    if (src === placeholder) { $img.attr("src", placeholder); return; }
    $img.attr("src", src);
  };

  $img.on("error", () => {
    console.warn("Failed to load image, trying next candidate:", $img.attr("src"));
    tryNext();
  });

  tryNext(); // kick off the first candidate
  slot.append($img);

  $("#medium-progress").text(`${Medium.idx}/${Medium.items.length}`);
  $id("medium-answer").value = "";
  $id("medium-answer").focus();
}


function checkAnswer(p){
  const cur=Medium.items[Medium.idx];if(!cur)return;
  const user=normalizeSv($id("medium-answer").value);
  if(!user){$("#medium-feedback").text("Type an answer.");return;}
  const answers=[normalizeSv(cur.sv),normalizeSv(cur.sv_pl)];
  if(answers.includes(user)){
    $("#medium-feedback").text("✅ Correct!");
    Medium.idx++;
    if(Medium.idx>=Medium.items.length) levelComplete(Medium.levelNumber,p);
    else renderWord();
  }else{
    $("#medium-feedback").text("❌ Try again");
  }
}

function levelComplete(level,p){
  if(!p.completed.includes(level))p.completed.push(level);
  p.unlocked=Math.max(p.unlocked,level+1);
  putSaved(p);
  $("#win-title").text(`You completed Level ${level}!`);
  $("#win-progress-text").text(`Progress: ${p.completed.length}/3`);
  $("#win-next").off("click").on("click",()=>{const n=level+1;if(n<=6)mediumStart(n,p);else go("#level-select");});
  $("#win-menu").off("click").on("click",()=>go("#level-select"));
  go("#win-screen");
}

// ---------------- init ----------------
$(function(){
  const run=()=>{
    const items=loadFurnitureItems();
    Medium.levels=buildMediumLevels(items,5);
    const p=getSaved();
    updateProgressUI(p);

    $("#btn-start").on("click",()=>{updateProgressUI(getSaved());go("#level-select");});
    $("#btn-continue").on("click",()=>{
      const ps=getSaved();const next=[4,5,6].find(n=>!ps.completed.includes(n))||4;
      mediumStart(next,ps);
    });

    // Changed it here: Level screen instruction modal trigger
    $("#btn-level-instruction").on("click",()=>$("#intro-modal").removeClass("hidden"));
    $("#btn-intro").on("click",()=>$("#intro-modal").removeClass("hidden"));
    $("#close-intro").on("click",()=>$("#intro-modal").addClass("hidden"));

    $(".level-btn").on("click",function(){
      const lvl=Number($(this).data("level"));mediumStart(lvl,getSaved());
    });
    $("#btn-back-from-levels").on("click",()=>go("#start-screen"));
    $("#medium-back").on("click",()=>{updateProgressUI(getSaved());go("#level-select");});
    $("#medium-check").on("click",()=>checkAnswer(getSaved()));
    $(document).on("keydown",e=>{
      if(e.key==="Enter"&&$("#medium-screen:visible").length&&$("#medium-answer").is(":focus")){
        e.preventDefault();$("#medium-check").trigger("click");
      }
    });
    $("#win-menu").on("click",()=>go("#level-select"));
    go("#start-screen");
  };

  if(window.vocabulary&&typeof window.vocabulary.when_ready==="function")
    window.vocabulary.when_ready(run);
  else setTimeout(run,200);
});
