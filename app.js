const colors = [
  { name: "Sumi", value: "#3b3b38" }, { name: "Ivory", value: "#e7e3d8" },
  { name: "Snow", value: "#f5f4ef" }, { name: "Brick", value: "#b54d3d" },
  { name: "Sakura", value: "#db9b99" }, { name: "Mustard", value: "#d3a73e" },
  { name: "Moss", value: "#727a4e" }, { name: "Aoi", value: "#4a6f83" },
];

const layouts = {
us: { name: "英語配列", rows: [
  [["Esc",1],["1\n!",1],["2\n@",1],["3\n#",1],["4\n$",1],["5\n%",1],["6\n^",1],["7\n&",1],["8\n*",1],["9\n(",1],["0\n)",1],["-\n_",1],["=\n+",1],["\\\n|",1],["`\n~",1]],
  [["Tab",1.5],["Q",1],["W",1],["E",1],["R",1],["T",1],["Y",1],["U",1],["I",1],["O",1],["P",1],["[\n{",1],["]\n}",1],["Delete",1.5]],
  [["Control",1.75],["A",1],["S",1],["D",1],["F",1],["G",1],["H",1],["J",1],["K",1],["L",1],[";\n:",1],["'\n\"",1],["Return",2.25]],
  [["Shift",2.25],["Z",1],["X",1],["C",1],["V",1],["B",1],["N",1],["M",1],[",\n<",1],[".\n>",1],["/\n?",1],["Shift",2.75]],
  [["Fn",1.25],["Alt",1.25],["◇",1.25],["",6,"space"],["◇",1.25],["Alt",1.25],["Fn",1.25]],
]},
jis: { name: "日本語配列", rows: [
  [["Esc",1],["1\n!",1],["2\n\"",1],["3\n#",1],["4\n$",1],["5\n%",1],["6\n&",1],["7\n'",1],["8\n(",1],["9\n)",1],["0",1],["-\n=",1],["^\n~",1],["¥\n|",1],["`",1]],
  [["Tab",1.5],["Q",1],["W",1],["E",1],["R",1],["T",1],["Y",1],["U",1],["I",1],["O",1],["P",1],["@\n`",1],["[\n{",1],["Backspace",1.5]],
  [["Control",1.75],["A",1],["S",1],["D",1],["F",1],["G",1],["H",1],["J",1],["K",1],["L",1],[";\n+",1],[":\n*",1],["]\n}",1],["Enter",1.25]],
  [["Shift",2],["Z",1],["X",1],["C",1],["V",1],["B",1],["N",1],["M",1],[",\n<",1],[".\n>",1],["/\n?",1],["\\\n_",1],["Shift",2]],
  [["Fn",1],["◇",1],["Alt",1],["無変換",1.25],["",3.5,"space"],["変換",1.25],["かな",1],["Alt",1],["◇",1],["Fn",1]],
]},
};

const presets = [
  { name: "Classic", sub: "静かな定番", colors: ["#e7e3d8", "#3b3b38", "#b54d3d"], make: (_, label) => label === "Esc" ? "#b54d3d" : (/[A-Z]/.test(label) && label.length === 1 ? "#e7e3d8" : "#3b3b38") },
  { name: "Bloom", sub: "やわらかな春", colors: ["#f5f4ef", "#db9b99", "#727a4e"], make: (i, label) => label === "Esc" || label === "Return" ? "#727a4e" : (i % 7 === 0 ? "#db9b99" : "#f5f4ef") },
  { name: "Night Shift", sub: "深夜の集中", colors: ["#3b3b38", "#4a6f83", "#d3a73e"], make: (_, label) => label === "Esc" ? "#d3a73e" : (["Control","Shift","Fn","Alt","◇"].includes(label) ? "#4a6f83" : "#3b3b38") },
];

const keyboard = document.querySelector("#keyboard");
const palette = document.querySelector("#palette");
const presetContainer = document.querySelector("#presets");
let selected = colors[0];
let keyColors = [];
let currentLayout = "us";
let savedDesigns = {};

function currentRows() { return layouts[currentLayout].rows; }

function textColor(hex) {
  const rgb = hex.slice(1).match(/.{2}/g).map(v => parseInt(v, 16));
  return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 > 155 ? "#31312e" : "#f8f6ef";
}

function renderKeyboard() {
  keyboard.innerHTML = "";
  let index = 0;
  currentRows().forEach((row) => {
    const rowElement = document.createElement("div"); rowElement.className = "key-row";
    row.forEach(([label, width, className = ""]) => {
      const currentIndex = index++;
      const key = document.createElement("button");
      key.type = "button"; key.className = `key ${className}`; key.textContent = label;
      key.setAttribute("aria-label", label ? `${label} キー` : "スペースキー");
      key.style.setProperty("--w", width); key.style.setProperty("--key-color", keyColors[currentIndex]); key.style.setProperty("--legend-color", textColor(keyColors[currentIndex]));
      key.addEventListener("click", () => { keyColors[currentIndex] = selected.value; save(); renderKeyboard(); });
      rowElement.append(key);
    });
    keyboard.append(rowElement);
  });
  keyboard.setAttribute("aria-label", `HHKB ${layouts[currentLayout].name}`);
}

function chooseColor(color, isCustom = false) {
  selected = color;
  document.querySelectorAll(".color-button").forEach(button => button.classList.toggle("active", !isCustom && button.dataset.value === color.value));
  document.querySelector("#selectedSwatch").style.background = color.value;
  document.querySelector("#selectionText").textContent = `選択中: ${color.name}`;
}

colors.forEach((color) => {
  const button = document.createElement("button"); button.type = "button"; button.className = "color-button"; button.dataset.value = color.value; button.setAttribute("role", "radio");
  button.innerHTML = `<span class="color-dot" style="--color:${color.value}"></span>${color.name}`;
  button.addEventListener("click", () => chooseColor(color)); palette.append(button);
});

presets.forEach((preset) => {
  const button = document.createElement("button"); button.type = "button"; button.className = "preset";
  button.innerHTML = `<span><strong>${preset.name}</strong><small>${preset.sub}</small></span><span class="preset-colors">${preset.colors.map(color => `<i style="--color:${color}"></i>`).join("")}</span>`;
  button.addEventListener("click", () => { let i = 0; keyColors = currentRows().flat().map(([label]) => preset.make(i++, label)); save(); renderKeyboard(); toast(`${preset.name} を適用しました`); });
  presetContainer.append(button);
});

function defaultColors() { let i = 0; return currentRows().flat().map(([label]) => presets[0].make(i++, label)); }
function save() {
  savedDesigns[currentLayout] = keyColors;
  try {
    localStorage.setItem("hhkb-keytop-palette", JSON.stringify({ layout: currentLayout, designs: savedDesigns }));
    return true;
  } catch {
    return false;
  }
}
function toast(message) { const el = document.querySelector("#toast"); el.textContent = message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("show"), 2400); }

function load() {
  const query = new URLSearchParams(location.search).get("design");
  try {
    const stored = query ? JSON.parse(atob(query)) : JSON.parse(localStorage.getItem("hhkb-keytop-palette"));
    if (Array.isArray(stored)) savedDesigns.us = stored;
    else if (stored && typeof stored === "object") {
      currentLayout = layouts[stored.layout] ? stored.layout : "us";
      savedDesigns = stored.designs || { [currentLayout]: stored.colors };
    }
    const values = savedDesigns[currentLayout];
    keyColors = Array.isArray(values) && values.length === currentRows().flat().length ? values : defaultColors();
  } catch { keyColors = defaultColors(); }
}

function selectLayout(layout) {
  if (!layouts[layout] || layout === currentLayout) return;
  savedDesigns[currentLayout] = keyColors;
  currentLayout = layout;
  const saved = savedDesigns[currentLayout];
  keyColors = Array.isArray(saved) && saved.length === currentRows().flat().length ? saved : defaultColors();
  document.querySelectorAll(".layout-button").forEach((button) => {
    const active = button.dataset.layout === currentLayout;
    button.classList.toggle("active", active); button.setAttribute("aria-pressed", active);
  });
  renderKeyboard();
  const persisted = save();
  toast(persisted ? `${layouts[currentLayout].name}に切り替えました` : `${layouts[currentLayout].name}に切り替えました（保存は利用できません）`);
}

document.querySelectorAll(".layout-button").forEach((button) => button.addEventListener("click", () => selectLayout(button.dataset.layout)));

document.querySelector("#customColor").addEventListener("input", (event) => {
  const value = event.target.value.toUpperCase(); document.querySelector("#customColorValue").value = value; chooseColor({ name: value, value }, true);
});
document.querySelector("#resetButton").addEventListener("click", () => { keyColors = defaultColors(); save(); renderKeyboard(); toast("デザインをリセットしました"); });
document.querySelector("#shareButton").addEventListener("click", async () => {
  const url = new URL(location.href); url.searchParams.set("design", btoa(JSON.stringify({ layout: currentLayout, colors: keyColors }))); history.replaceState(null, "", url);
  try { await navigator.clipboard.writeText(url.href); toast("共有URLをコピーしました"); }
  catch { prompt("このURLをコピーしてください", url.href); }
});

load();
document.querySelectorAll(".layout-button").forEach((button) => {
  const active = button.dataset.layout === currentLayout;
  button.classList.toggle("active", active); button.setAttribute("aria-pressed", active);
});
chooseColor(selected); renderKeyboard();
