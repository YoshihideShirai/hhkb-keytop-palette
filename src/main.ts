type KeyDefinition = readonly [label: string, width: number, className?: string];
type LayoutName = "us" | "jis";
type ProductSeries = "HYBRID Type-S" | "HYBRID" | "Classic Type-S" | "Classic" | "Studio";
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
  value: ColorDefinition;
}

interface Layout {
  name: string;
  rows: KeyDefinition[][];
}

interface Preset {
  name: string;
  sub: string;
  colors: ColorDefinition[];
  make: (key: KeyContext) => ColorDefinition;
}

interface KeyContext {
  index: number;
  rowIndex: number;
  columnIndex: number;
  rowLength: number;
  label: string;
  className: string;
}

interface ProductAppearance {
  id: ProductId;
  series: ProductSeries;
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

const bodyColor = "__body_color__" as const;
type ColorDefinition = string | typeof bodyColor;

const colors: ColorOption[] = [
  { name: "本体カラー", value: bodyColor },
  { name: "墨", value: "#3b3b38" },
  { name: "白", value: "#e7e3d8" },
  { name: "白 特殊キー", value: "#b7b3a8" },
  { name: "雪", value: "#f8f7f2" },
  { name: "桜", value: "#f1c6c9" },
  { name: "山葵", value: "#b8c58a" },
  { name: "蒲公英", value: "#f0c94b" },
  { name: "藤", value: "#c8b2d8" },
  { name: "空", value: "#a9d2e8" },
  { name: "灰", value: "#8b8b84" },
];

const keytop = {
  sumi: "#3b3b38",
  white: "#e7e3d8",
  whiteSpecial: "#b7b3a8",
  snow: "#f8f7f2",
  sakura: "#f1c6c9",
  wasabi: "#b8c58a",
  tanpopo: "#f0c94b",
  fuji: "#c8b2d8",
  sora: "#a9d2e8",
};

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
      [["Esc", 1], ["1\n!", 1], ["2\n\"", 1], ["3\n#", 1], ["4\n$", 1], ["5\n%", 1], ["6\n&", 1], ["7\n'", 1], ["8\n(", 1], ["9\n)", 1], ["0", 1], ["-\n=", 1], ["^\n~", 1], ["¥\n|", 1], ["BS", 1]],
      [["Tab", 1.5], ["Q", 1], ["W", 1], ["E", 1], ["R", 1], ["T", 1], ["Y", 1], ["U", 1], ["I", 1], ["O", 1], ["P", 1], ["@\n`", 1], ["[\n{", 1], ["", 0, "spacer"], ["Enter", 1.5, "jis-enter"]],
      [["Control", 1.75], ["A", 1], ["S", 1], ["D", 1], ["F", 1], ["G", 1], ["H", 1], ["J", 1], ["K", 1], ["L", 1], [";\n+", 1], [":\n*", 1], ["]\n}", 1]],
      [["Shift", 2], ["Z", 1], ["X", 1], ["C", 1], ["V", 1], ["B", 1], ["N", 1], ["M", 1], [",\n<", 1], [".\n>", 1], ["/\n?", 1], ["\\\n_", 1], ["", 0, "spacer"], ["↑", 1, "arrow"], ["Shift", 1]],
      [["Fn", 1], ["", 0.25, "spacer"], ["半角\n/全角", 1], ["◇", 1], ["Alt", 1], ["無変換", 1], ["", 2.5, "space"], ["変換", 1], ["かな", 1], ["Alt", 1], ["Fn", 1], ["", 0.25, "spacer"], ["←", 1, "arrow"], ["↓", 1, "arrow"], ["→", 1, "arrow"]],
    ],
  },
};

const presets: Preset[] = [
  {
    name: "中央印字 墨",
    sub: "ミニマムな墨",
    colors: [keytop.sumi],
    make: () => keytop.sumi,
  },
  {
    name: "中央印字 白",
    sub: "白 + 特殊キー",
    colors: [keytop.white, keytop.whiteSpecial],
    make: ({ label, className }) => isWhiteProductSpecialKey(label, className) ? keytop.whiteSpecial : keytop.white,
  },
  {
    name: "桜アクセント",
    sub: "Esc / Control",
    colors: [bodyColor, keytop.sakura],
    make: ({ label }) => ["Esc", "Control"].includes(normalizeLabel(label)) ? keytop.sakura : bodyColor,
  },
  {
    name: "山葵アクセント",
    sub: "桜と花見団子",
    colors: [bodyColor, keytop.sakura, keytop.wasabi, keytop.tanpopo],
    make: ({ label, columnIndex }) => {
      const normalized = normalizeLabel(label);
      if (["Esc", "Control"].includes(normalized)) return keytop.sakura;
      if (["Return", "Enter", "BS", "Delete"].includes(normalized)) return keytop.wasabi;
      if (columnIndex >= 5 && columnIndex <= 7) return keytop.tanpopo;
      return bodyColor;
    },
  },
  {
    name: "蒲公英マーク",
    sub: "若葉マーク風",
    colors: [bodyColor, keytop.tanpopo, keytop.wasabi],
    make: ({ rowIndex, columnIndex, rowLength }) => {
      const center = (rowLength - 1) / 2;
      const distance = Math.abs(columnIndex - center);
      if ((rowIndex === 1 || rowIndex === 2) && distance <= 1.5) return keytop.wasabi;
      if ((rowIndex === 2 || rowIndex === 3) && distance >= 2 && distance <= 4) return keytop.tanpopo;
      return bodyColor;
    },
  },
  {
    name: "藤グラデーション",
    sub: "数字キーに淡色",
    colors: [bodyColor, keytop.sakura, keytop.tanpopo, keytop.wasabi, keytop.fuji, keytop.sora],
    make: ({ label, columnIndex }) => {
      if (!isNumberKey(label)) return bodyColor;
      const gradient = [keytop.sakura, keytop.tanpopo, keytop.wasabi, keytop.fuji, keytop.sora];
      return gradient[columnIndex % gradient.length];
    },
  },
  {
    name: "空カーソル",
    sub: "矢印 / Fn / 数字",
    colors: [bodyColor, keytop.sora],
    make: ({ label, className }) => isMarkerKey(label, className) ? keytop.sora : bodyColor,
  },
  {
    name: "Happy Hacking",
    sub: "好きな言葉を表現",
    colors: [bodyColor, keytop.sakura],
    make: ({ label }) => {
      const normalized = normalizeLabel(label);
      return normalized && "HAPPYCKING".includes(normalized) ? keytop.sakura : bodyColor;
    },
  },
  {
    name: "ボーダー",
    sub: "段ごとに色分け",
    colors: [bodyColor, keytop.wasabi],
    make: ({ rowIndex }) => rowIndex === 1 || rowIndex === 3 ? keytop.wasabi : bodyColor,
  },
  {
    name: "縦グラデーション",
    sub: "縦方向に配置",
    colors: [bodyColor, keytop.sakura, keytop.tanpopo, keytop.wasabi, keytop.fuji, keytop.sora],
    make: ({ rowIndex, columnIndex }) => {
      const gradient = [keytop.sakura, keytop.tanpopo, keytop.wasabi, keytop.fuji, keytop.sora];
      return Math.abs(columnIndex - 7) <= 1 ? gradient[rowIndex] : bodyColor;
    },
  },
  {
    name: "ハート",
    sub: "記事のベスポジ",
    colors: [bodyColor, keytop.sakura],
    make: ({ rowIndex, label }) => isHeartKey(rowIndex, label) ? keytop.sakura : bodyColor,
  },
  {
    name: "Esc / Control",
    sub: "周辺アイテムと色合わせ",
    colors: [bodyColor, keytop.sora, keytop.fuji],
    make: ({ label }) => {
      const normalized = normalizeLabel(label);
      if (normalized === "Esc") return keytop.sora;
      if (normalized === "Control") return keytop.fuji;
      return bodyColor;
    },
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

const productSeries: ProductSeries[] = ["HYBRID Type-S", "HYBRID", "Classic Type-S", "Classic", "Studio"];

const keyboard = queryElement<HTMLDivElement>("#keyboard");
const palette = queryElement<HTMLDivElement>("#palette");
const modelSeries = queryElement<HTMLDivElement>("#modelSeries");
const bodyColors = queryElement<HTMLDivElement>("#bodyColors");
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

function productsForCurrentSeries(): ProductAppearance[] {
  const currentSeries = currentProductAppearance().series;
  return productAppearances.filter((product) => product.series === currentSeries);
}

function currentRows(): KeyDefinition[][] {
  return layouts[currentLayout].rows;
}

function currentKeyContexts(): KeyContext[] {
  let index = 0;
  return currentRows().flatMap((row, rowIndex) =>
    row.map(([label, , className = ""], columnIndex) => ({
      index: index++,
      rowIndex,
      columnIndex,
      rowLength: row.length,
      label,
      className,
    }))
  );
}

function normalizeLabel(label: string): string {
  return label.split("\n")[0];
}

function isNumberKey(label: string): boolean {
  return /^\d/.test(normalizeLabel(label));
}

function isMarkerKey(label: string, className: string): boolean {
  const normalized = normalizeLabel(label);
  return className === "arrow" || normalized === "Fn" || isNumberKey(label);
}

function isHeartKey(rowIndex: number, label: string): boolean {
  const normalized = normalizeLabel(label);
  const heartRows = [
    ["7", "8", "0", "-"],
    ["Y", "U", "I", "O", "P", "@", "["],
    ["H", "J", "K", "L", ";"],
    ["M", ",", "."],
    ["かな"],
  ];
  return heartRows[rowIndex]?.includes(normalized) ?? false;
}

function isWhiteProduct(product: ProductAppearance): boolean {
  return product.colorName === "白";
}

function isWhiteProductSpecialKey(label: string, className: string): boolean {
  const normalized = normalizeLabel(label);
  return className === "space" || [
    "Esc",
    "Tab",
    "Delete",
    "BS",
    "Control",
    "Return",
    "Enter",
    "Shift",
    "Fn",
    "Alt",
    "◇",
    "半角",
    "無変換",
    "変換",
    "かな",
    "↑",
    "←",
    "↓",
    "→",
  ].includes(normalized);
}

function textColor(hex: string): string {
  const rgb = hex.slice(1).match(/.{2}/g)?.map((value) => parseInt(value, 16));
  if (!rgb || rgb.length < 3 || rgb.some(Number.isNaN)) {
    return "#31312e";
  }
  return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 > 155 ? "#31312e" : "#f8f6ef";
}

function defaultColorForKey({ label, className }: Pick<KeyContext, "label" | "className">): string {
  const product = currentProductAppearance();
  if (isWhiteProduct(product) && isWhiteProductSpecialKey(label, className)) {
    return keytop.whiteSpecial;
  }
  return product.keyColor;
}

function resolveColor(color: ColorDefinition, key?: KeyContext): string {
  if (color !== bodyColor) {
    return color;
  }
  return key ? defaultColorForKey(key) : currentProductAppearance().keyColor;
}

function renderKeyboard(): void {
  const product = currentProductAppearance();
  keyboard.innerHTML = "";
  keyboard.className = `keyboard keyboard-${currentLayout} keyboard-${product.caseStyle} legend-${product.legendPlacement}`;
  keyboard.style.setProperty("--case-color", product.colorValue);
  keyboard.style.setProperty("--case-shadow", textColor(product.colorValue) === "#31312e" ? "#aaa79f" : "#181816");
  let index = 0;

  currentRows().forEach((row, rowIndex) => {
    const rowElement = document.createElement("div");
    rowElement.className = "key-row";

    row.forEach(([label, width, className = ""], columnIndex) => {
      const currentIndex = index++;
      const keyContext = { index: currentIndex, rowIndex, columnIndex, rowLength: row.length, label, className };
      const key = document.createElement("button");
      key.type = "button";
      key.className = `key ${className}`;
      key.setAttribute("aria-label", label ? `${label} キー` : "スペースキー");
      key.style.setProperty("--w", String(width));
      key.style.setProperty("--key-color", keyColors[currentIndex]);
      key.style.setProperty("--legend-color", keyColors[currentIndex] === product.keyColor ? product.legendColor : textColor(keyColors[currentIndex]));
      const keyLabel = document.createElement("span");
      keyLabel.className = "key-label";
      keyLabel.textContent = label;
      key.append(keyLabel);
      key.addEventListener("click", () => {
        keyColors[currentIndex] = resolveColor(selected.value, keyContext);
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

    const mouseButtons = document.createElement("span");
    mouseButtons.className = "studio-mouse-buttons";
    mouseButtons.setAttribute("aria-hidden", "true");
    keyboard.append(mouseButtons);
  }

  const badge = document.createElement("span");
  badge.className = "keyboard-badge";
  badge.textContent = "HHKB";
  badge.setAttribute("aria-hidden", "true");
  keyboard.append(badge);

  keyboard.setAttribute("aria-label", `HHKB ${product.series} ${product.colorName} ${layouts[currentLayout].name}`);
}

function chooseColor(color: ColorOption, isCustom = false): void {
  selected = color;
  document.querySelectorAll<HTMLButtonElement>(".color-button").forEach((button) => {
    button.classList.toggle("active", !isCustom && button.dataset.value === color.value);
  });
  selectedSwatch.style.background = resolveColor(color.value);
  selectionText.textContent = `選択中: ${color.name}`;
}

function renderPalette(): void {
  palette.innerHTML = "";
  colors.forEach((color) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "color-button";
    button.dataset.value = color.value;
    button.setAttribute("role", "radio");
    button.innerHTML = `<span class="color-dot" style="--color:${resolveColor(color.value)}"></span>${color.name}`;
    button.classList.toggle("active", selected.value === color.value);
    button.addEventListener("click", () => chooseColor(color));
    palette.append(button);
  });
}

function renderPresets(): void {
  presetContainer.innerHTML = "";
  presets.forEach((preset) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "preset";
    button.innerHTML = `<span><strong>${preset.name}</strong><small>${preset.sub}</small></span><span class="preset-colors">${preset.colors.map((color) => `<i style="--color:${resolveColor(color)}"></i>`).join("")}</span>`;
    button.addEventListener("click", () => {
      keyColors = currentKeyContexts().map((key) => resolveColor(preset.make(key), key));
      save();
      renderKeyboard();
      toast(`${preset.name} を適用しました`);
    });
    presetContainer.append(button);
  });
}

productSeries.forEach((series) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "product model-button";
  button.dataset.series = series;
  button.setAttribute("aria-pressed", "false");
  const representative = productAppearances.find((product) => product.series === series);
  button.innerHTML = `<span class="product-swatch" style="--color:${representative?.colorValue ?? "#d8d2c5"}"></span><span><strong>${series}</strong><small>${representative?.detail ?? ""}</small></span>`;
  button.addEventListener("click", () => selectSeries(series));
  modelSeries.append(button);
});

function defaultColors(): string[] {
  return currentKeyContexts().map(defaultColorForKey);
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

  renderAppearanceControls();

  renderKeyboard();
  save();

  if (applyFactoryColors) {
    const appearance = currentProductAppearance();
    toast(`${appearance.series} ${appearance.colorName} の外観にしました`);
  }
}

function selectSeries(series: ProductSeries): void {
  const current = currentProductAppearance();
  const next = productAppearances.find((product) => product.series === series && product.colorName === current.colorName)
    ?? productAppearances.find((product) => product.series === series);

  if (next) {
    selectProduct(next.id, true);
  }
}

function renderAppearanceControls(): void {
  const current = currentProductAppearance();

  document.querySelectorAll<HTMLButtonElement>(".model-button").forEach((button) => {
    const active = button.dataset.series === current.series;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  bodyColors.innerHTML = "";
  productsForCurrentSeries().forEach((product) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "body-color";
    button.dataset.product = product.id;
    button.setAttribute("aria-pressed", String(product.id === currentProduct));
    button.innerHTML = `<span class="body-color-swatch" style="--color:${product.colorValue}"></span><span>${product.colorName}</span>`;
    button.classList.toggle("active", product.id === currentProduct);
    button.addEventListener("click", () => selectProduct(product.id, true));
    bodyColors.append(button);
  });

  document.querySelectorAll<HTMLButtonElement>(".body-color").forEach((button) => {
    const active = button.dataset.product === currentProduct;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  renderPalette();
  renderPresets();
  chooseColor(selected);
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
