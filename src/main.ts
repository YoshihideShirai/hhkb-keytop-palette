type KeyDefinition = readonly [label: string, width: number, className?: string];
type LayoutName = "us" | "jis";
type ProductId =
  | "hybrid-type-s-sumi"
  | "hybrid-type-s-white"
  | "hybrid-type-s-snow"
  | "hybrid-sumi"
  | "hybrid-white"
  | "classic-type-s-sumi"
  | "classic-type-s-white"
  | "classic-type-s-snow"
  | "classic-sumi"
  | "classic-white"
  | "studio-sumi"
  | "studio-snow";

interface ColorOption {
  name: string;
  value: string;
}

interface Layout {
  name: string;
  rows: KeyDefinition[][];
}

interface Preset {
  name: string;
  sub: string;
  colors: string[];
  make: (index: number, label: string) => string;
}

interface ProductAppearance {
  id: ProductId;
  series: string;
  colorName: string;
  colorValue: string;
  keyColor: string;
  legendColor: string;
  legendPlacement: "corner" | "center";
  caseStyle: "classic" | "hybrid" | "studio";
  detail: string;
}

interface SavedState {
  layout?: string;
  colors?: string[];
  designs?: Partial<Record<LayoutName, string[]>>;
  product?: string;
}

const colors: ColorOption[] = [
  { name: "Sumi", value: "#3b3b38" },
  { name: "Ivory", value: "#e7e3d8" },
  { name: "Snow", value: "#f5f4ef" },
  { name: "Brick", value: "#b54d3d" },
  { name: "Sakura", value: "#db9b99" },
  { name: "Mustard", value: "#d3a73e" },
  { name: "Moss", value: "#727a4e" },
  { name: "Aoi", value: "#4a6f83" },
];

const layouts: Record<LayoutName, Layout> = {
  us: {
    name: "英語配列",
    rows: [
      [["Esc", 1], ["1\n!", 1], ["2\n@", 1], ["3\n#", 1], ["4\n$", 1], ["5\n%", 1], ["6\n^", 1], ["7\n&", 1], ["8\n*", 1], ["9\n(", 1], ["0\n)", 1], ["-\n_", 1], ["=\n+", 1], ["\\\n|", 1], ["`\n~", 1]],
      [["Tab", 1.5], ["Q", 1], ["W", 1], ["E", 1], ["R", 1], ["T", 1], ["Y", 1], ["U", 1], ["I", 1], ["O", 1], ["P", 1], ["[\n{", 1], ["]\n}", 1], ["Delete", 1.5]],
      [["Control", 1.75], ["A", 1], ["S", 1], ["D", 1], ["F", 1], ["G", 1], ["H", 1], ["J", 1], ["K", 1], ["L", 1], [";\n:", 1], ["'\n\"", 1], ["Return", 2.25]],
      [["Shift", 2.25], ["Z", 1], ["X", 1], ["C", 1], ["V", 1], ["B", 1], ["N", 1], ["M", 1], [",\n<", 1], [".\n>", 1], ["/\n?", 1], ["Shift", 2.75]],
      [["Fn", 1.25], ["Alt", 1.25], ["◇", 1.25], ["", 6, "space"], ["◇", 1.25], ["Alt", 1.25], ["Fn", 1.25]],
    ],
  },
  jis: {
    name: "日本語配列",
    rows: [
      [["Esc", 1], ["1\n!", 1], ["2\n\"", 1], ["3\n#", 1], ["4\n$", 1], ["5\n%", 1], ["6\n&", 1], ["7\n'", 1], ["8\n(", 1], ["9\n)", 1], ["0", 1], ["-\n=", 1], ["^\n~", 1], ["¥\n|", 1], ["`", 1]],
      [["Tab", 1.5], ["Q", 1], ["W", 1], ["E", 1], ["R", 1], ["T", 1], ["Y", 1], ["U", 1], ["I", 1], ["O", 1], ["P", 1], ["@\n`", 1], ["[\n{", 1], ["Backspace", 1.5]],
      [["Control", 1.75], ["A", 1], ["S", 1], ["D", 1], ["F", 1], ["G", 1], ["H", 1], ["J", 1], ["K", 1], ["L", 1], [";\n+", 1], [":\n*", 1], ["]\n}", 1], ["Enter", 1.25]],
      [["Shift", 2], ["Z", 1], ["X", 1], ["C", 1], ["V", 1], ["B", 1], ["N", 1], ["M", 1], [",\n<", 1], [".\n>", 1], ["/\n?", 1], ["\\\n_", 1], ["Shift", 2]],
      [["Fn", 1], ["◇", 1], ["Alt", 1], ["無変換", 1.25], ["", 3.5, "space"], ["変換", 1.25], ["かな", 1], ["Alt", 1], ["◇", 1], ["Fn", 1]],
    ],
  },
};

const presets: Preset[] = [
  {
    name: "Classic",
    sub: "静かな定番",
    colors: ["#e7e3d8", "#3b3b38", "#b54d3d"],
    make: (_, label) => label === "Esc" ? "#b54d3d" : (/[A-Z]/.test(label) && label.length === 1 ? "#e7e3d8" : "#3b3b38"),
  },
  {
    name: "Bloom",
    sub: "やわらかな春",
    colors: ["#f5f4ef", "#db9b99", "#727a4e"],
    make: (i, label) => label === "Esc" || label === "Return" ? "#727a4e" : (i % 7 === 0 ? "#db9b99" : "#f5f4ef"),
  },
  {
    name: "Night Shift",
    sub: "深夜の集中",
    colors: ["#3b3b38", "#4a6f83", "#d3a73e"],
    make: (_, label) => label === "Esc" ? "#d3a73e" : (["Control", "Shift", "Fn", "Alt", "◇"].includes(label) ? "#4a6f83" : "#3b3b38"),
  },
];

const productAppearances: ProductAppearance[] = [
  { id: "hybrid-type-s-sumi", series: "HYBRID Type-S", colorName: "墨", colorValue: "#302f2c", keyColor: "#3b3b38", legendColor: "#151513", legendPlacement: "corner", caseStyle: "hybrid", detail: "無線/有線・Type-S" },
  { id: "hybrid-type-s-white", series: "HYBRID Type-S", colorName: "白", colorValue: "#d8d2c5", keyColor: "#e7e3d8", legendColor: "#565047", legendPlacement: "corner", caseStyle: "hybrid", detail: "無線/有線・Type-S" },
  { id: "hybrid-type-s-snow", series: "HYBRID Type-S", colorName: "雪", colorValue: "#f6f5ef", keyColor: "#f8f7f2", legendColor: "#6f6f68", legendPlacement: "center", caseStyle: "hybrid", detail: "無線/有線・Type-S" },
  { id: "hybrid-sumi", series: "HYBRID", colorName: "墨", colorValue: "#302f2c", keyColor: "#3b3b38", legendColor: "#151513", legendPlacement: "corner", caseStyle: "hybrid", detail: "無線/有線" },
  { id: "hybrid-white", series: "HYBRID", colorName: "白", colorValue: "#d8d2c5", keyColor: "#e7e3d8", legendColor: "#565047", legendPlacement: "corner", caseStyle: "hybrid", detail: "無線/有線" },
  { id: "classic-type-s-sumi", series: "Classic Type-S", colorName: "墨", colorValue: "#302f2c", keyColor: "#3b3b38", legendColor: "#151513", legendPlacement: "center", caseStyle: "classic", detail: "有線・Type-S" },
  { id: "classic-type-s-white", series: "Classic Type-S", colorName: "白", colorValue: "#d8d2c5", keyColor: "#e7e3d8", legendColor: "#565047", legendPlacement: "center", caseStyle: "classic", detail: "有線・Type-S" },
  { id: "classic-type-s-snow", series: "Classic Type-S", colorName: "雪", colorValue: "#f6f5ef", keyColor: "#f8f7f2", legendColor: "#6f6f68", legendPlacement: "center", caseStyle: "classic", detail: "有線・Type-S" },
  { id: "classic-sumi", series: "Classic", colorName: "墨", colorValue: "#302f2c", keyColor: "#3b3b38", legendColor: "#151513", legendPlacement: "corner", caseStyle: "classic", detail: "有線" },
  { id: "classic-white", series: "Classic", colorName: "白", colorValue: "#d8d2c5", keyColor: "#e7e3d8", legendColor: "#565047", legendPlacement: "corner", caseStyle: "classic", detail: "有線" },
  { id: "studio-sumi", series: "Studio", colorName: "墨", colorValue: "#2c2c29", keyColor: "#343431", legendColor: "#141412", legendPlacement: "center", caseStyle: "studio", detail: "ポインティング搭載" },
  { id: "studio-snow", series: "Studio", colorName: "雪", colorValue: "#f2f1eb", keyColor: "#f6f5f0", legendColor: "#6b6b64", legendPlacement: "center", caseStyle: "studio", detail: "ポインティング搭載" },
];

const keyboard = queryElement<HTMLDivElement>("#keyboard");
const palette = queryElement<HTMLDivElement>("#palette");
const products = queryElement<HTMLDivElement>("#products");
const presetContainer = queryElement<HTMLDivElement>("#presets");
const selectedSwatch = queryElement<HTMLSpanElement>("#selectedSwatch");
const selectionText = queryElement<HTMLSpanElement>("#selectionText");
const customColor = queryElement<HTMLInputElement>("#customColor");
const customColorValue = queryElement<HTMLOutputElement>("#customColorValue");
const resetButton = queryElement<HTMLButtonElement>("#resetButton");
const shareButton = queryElement<HTMLButtonElement>("#shareButton");
const toastElement = queryElement<HTMLDivElement>("#toast");

let selected = colors[0];
let keyColors: string[] = [];
let currentLayout: LayoutName = "us";
let currentProduct: ProductId = "hybrid-type-s-sumi";
let savedDesigns: Partial<Record<LayoutName, string[]>> = {};
let toastTimer: number | undefined;

function queryElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing element: ${selector}`);
  }
  return element;
}

function isLayoutName(value: unknown): value is LayoutName {
  return typeof value === "string" && value in layouts;
}

function isProductId(value: unknown): value is ProductId {
  return typeof value === "string" && productAppearances.some((product) => product.id === value);
}

function currentProductAppearance(): ProductAppearance {
  return productAppearances.find((product) => product.id === currentProduct) ?? productAppearances[0];
}

function currentRows(): KeyDefinition[][] {
  return layouts[currentLayout].rows;
}

function textColor(hex: string): string {
  const rgb = hex.slice(1).match(/.{2}/g)?.map((value) => parseInt(value, 16));
  if (!rgb || rgb.length < 3 || rgb.some(Number.isNaN)) {
    return "#31312e";
  }
  return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 > 155 ? "#31312e" : "#f8f6ef";
}

function renderKeyboard(): void {
  const product = currentProductAppearance();
  keyboard.innerHTML = "";
  keyboard.className = `keyboard keyboard-${product.caseStyle} legend-${product.legendPlacement}`;
  keyboard.style.setProperty("--case-color", product.colorValue);
  keyboard.style.setProperty("--case-shadow", textColor(product.colorValue) === "#31312e" ? "#aaa79f" : "#181816");
  let index = 0;

  currentRows().forEach((row) => {
    const rowElement = document.createElement("div");
    rowElement.className = "key-row";

    row.forEach(([label, width, className = ""]) => {
      const currentIndex = index++;
      const key = document.createElement("button");
      key.type = "button";
      key.className = `key ${className}`;
      key.textContent = label;
      key.setAttribute("aria-label", label ? `${label} キー` : "スペースキー");
      key.style.setProperty("--w", String(width));
      key.style.setProperty("--key-color", keyColors[currentIndex]);
      key.style.setProperty("--legend-color", keyColors[currentIndex] === product.keyColor ? product.legendColor : textColor(keyColors[currentIndex]));
      key.addEventListener("click", () => {
        keyColors[currentIndex] = selected.value;
        save();
        renderKeyboard();
      });
      rowElement.append(key);
    });

    keyboard.append(rowElement);
  });

  if (product.caseStyle === "studio") {
    const pointer = document.createElement("span");
    pointer.className = "pointing-stick";
    pointer.setAttribute("aria-hidden", "true");
    keyboard.append(pointer);
  }

  keyboard.setAttribute("aria-label", `HHKB ${product.series} ${product.colorName} ${layouts[currentLayout].name}`);
}

function chooseColor(color: ColorOption, isCustom = false): void {
  selected = color;
  document.querySelectorAll<HTMLButtonElement>(".color-button").forEach((button) => {
    button.classList.toggle("active", !isCustom && button.dataset.value === color.value);
  });
  selectedSwatch.style.background = color.value;
  selectionText.textContent = `選択中: ${color.name}`;
}

colors.forEach((color) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "color-button";
  button.dataset.value = color.value;
  button.setAttribute("role", "radio");
  button.innerHTML = `<span class="color-dot" style="--color:${color.value}"></span>${color.name}`;
  button.addEventListener("click", () => chooseColor(color));
  palette.append(button);
});

presets.forEach((preset) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "preset";
  button.innerHTML = `<span><strong>${preset.name}</strong><small>${preset.sub}</small></span><span class="preset-colors">${preset.colors.map((color) => `<i style="--color:${color}"></i>`).join("")}</span>`;
  button.addEventListener("click", () => {
    let i = 0;
    keyColors = currentRows().flat().map(([label]) => preset.make(i++, label));
    save();
    renderKeyboard();
    toast(`${preset.name} を適用しました`);
  });
  presetContainer.append(button);
});

productAppearances.forEach((product) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "product";
  button.dataset.product = product.id;
  button.setAttribute("aria-pressed", "false");
  button.innerHTML = `<span class="product-swatch" style="--color:${product.colorValue}"></span><span><strong>${product.series}</strong><small>${product.colorName} / ${product.detail}</small></span>`;
  button.addEventListener("click", () => selectProduct(product.id, true));
  products.append(button);
});

function defaultColors(): string[] {
  const product = currentProductAppearance();
  return currentRows().flat().map(() => product.keyColor);
}

function save(): boolean {
  savedDesigns[currentLayout] = keyColors;
  try {
    localStorage.setItem("hhkb-keytop-palette", JSON.stringify({ layout: currentLayout, product: currentProduct, designs: savedDesigns }));
    return true;
  } catch {
    return false;
  }
}

function toast(message: string): void {
  toastElement.textContent = message;
  toastElement.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastElement.classList.remove("show"), 2400);
}

function load(): void {
  const query = new URLSearchParams(location.search).get("design");

  try {
    const source = query ? atob(query) : localStorage.getItem("hhkb-keytop-palette");
    const stored = source ? JSON.parse(source) as SavedState | string[] : null;

    if (Array.isArray(stored)) {
      savedDesigns.us = stored;
    } else if (stored && typeof stored === "object") {
      currentLayout = isLayoutName(stored.layout) ? stored.layout : "us";
      currentProduct = isProductId(stored.product) ? stored.product : "hybrid-type-s-sumi";
      savedDesigns = stored.designs || { [currentLayout]: stored.colors };
    }

    const values = savedDesigns[currentLayout];
    keyColors = Array.isArray(values) && values.length === currentRows().flat().length ? values : defaultColors();
  } catch {
    keyColors = defaultColors();
  }
}

function selectProduct(product: string | undefined, applyFactoryColors = false): void {
  if (!isProductId(product)) return;

  currentProduct = product;
  if (applyFactoryColors) {
    keyColors = defaultColors();
  }

  document.querySelectorAll<HTMLButtonElement>(".product").forEach((button) => {
    const active = button.dataset.product === currentProduct;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  renderKeyboard();
  save();

  if (applyFactoryColors) {
    const appearance = currentProductAppearance();
    toast(`${appearance.series} ${appearance.colorName} の外観にしました`);
  }
}

function selectLayout(layout: string | undefined): void {
  if (!isLayoutName(layout) || layout === currentLayout) return;

  savedDesigns[currentLayout] = keyColors;
  currentLayout = layout;
  const saved = savedDesigns[currentLayout];
  keyColors = Array.isArray(saved) && saved.length === currentRows().flat().length ? saved : defaultColors();

  document.querySelectorAll<HTMLButtonElement>(".layout-button").forEach((button) => {
    const active = button.dataset.layout === currentLayout;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  renderKeyboard();
  const persisted = save();
  toast(persisted ? `${layouts[currentLayout].name}に切り替えました` : `${layouts[currentLayout].name}に切り替えました（保存は利用できません）`);
}

document.querySelectorAll<HTMLButtonElement>(".layout-button").forEach((button) => {
  button.addEventListener("click", () => selectLayout(button.dataset.layout));
});

customColor.addEventListener("input", (event) => {
  const value = (event.target as HTMLInputElement).value.toUpperCase();
  customColorValue.value = value;
  chooseColor({ name: value, value }, true);
});

resetButton.addEventListener("click", () => {
  keyColors = defaultColors();
  save();
  renderKeyboard();
  toast("デザインをリセットしました");
});

shareButton.addEventListener("click", async () => {
  const url = new URL(location.href);
  url.searchParams.set("design", btoa(JSON.stringify({ layout: currentLayout, product: currentProduct, colors: keyColors })));
  history.replaceState(null, "", url);

  try {
    await navigator.clipboard.writeText(url.href);
    toast("共有URLをコピーしました");
  } catch {
    window.prompt("このURLをコピーしてください", url.href);
  }
});

load();
selectProduct(currentProduct);
document.querySelectorAll<HTMLButtonElement>(".layout-button").forEach((button) => {
  const active = button.dataset.layout === currentLayout;
  button.classList.toggle("active", active);
  button.setAttribute("aria-pressed", String(active));
});
chooseColor(selected);
renderKeyboard();
