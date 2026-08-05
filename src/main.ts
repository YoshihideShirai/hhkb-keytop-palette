import "@fortawesome/fontawesome-free/css/all.min.css";

import { colors, keytop, layouts } from "./catalog";
import { isWhiteProduct, isWhiteProductSpecialKey, textColor } from "./key-utils";
import { presetsByLayout } from "./presets";
import { productAppearances, productSeries } from "./products";
import {
  bodyColor,
  type ColorDefinition,
  type ColorOption,
  type CompactSavedState,
  type KeyContext,
  type KeyDefinition,
  type KeyIcon,
  type KeyLegend,
  type LayoutName,
  type ProductAppearance,
  type ProductId,
  type ProductSeries,
  type SavedState,
} from "./types";
import { queryElement } from "./utils/dom";

const keyboard = queryElement<HTMLDivElement>("#keyboard");
const palette = queryElement<HTMLDivElement>("#palette");
const modelSeries = queryElement<HTMLDivElement>("#modelSeries");
const bodyColors = queryElement<HTMLDivElement>("#bodyColors");
const presetsToggle = queryElement<HTMLButtonElement>("#presetsToggle");
const presetContainer = queryElement<HTMLDivElement>("#presets");
const selectedSwatch = queryElement<HTMLSpanElement>("#selectedSwatch");
const selectionText = queryElement<HTMLSpanElement>("#selectionText");
const customColor = queryElement<HTMLInputElement>("#customColor");
const customColorValue = queryElement<HTMLOutputElement>("#customColorValue");
const resetButton = queryElement<HTMLButtonElement>("#resetButton");
const saveButton = queryElement<HTMLButtonElement>("#saveButton");
const xShareButton = queryElement<HTMLButtonElement>("#xShareButton");
const shareButton = queryElement<HTMLButtonElement>("#shareButton");
const toastElement = queryElement<HTMLDivElement>("#toast");

let selected = colors[0];
let keyColors: string[] = [];
let currentLayout: LayoutName = "us";
let currentProduct: ProductId = "hybrid-type-s-sumi";
let savedDesigns: Partial<Record<LayoutName, string[]>> = {};
let toastTimer: number | undefined;

function setPresetsExpanded(expanded: boolean): void {
  presetsToggle.setAttribute("aria-expanded", String(expanded));
  presetContainer.hidden = !expanded;
}

presetsToggle.addEventListener("click", () => {
  setPresetsExpanded(presetsToggle.getAttribute("aria-expanded") !== "true");
});

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
    row.map(([legend, , className = ""], columnIndex) => ({
      index: index++,
      rowIndex,
      columnIndex,
      rowLength: row.length,
      label: accessibleLegend(legend),
      className,
    }))
  );
}

function accessibleLegend(legend: KeyLegend): string {
  return legend.accessibleLabel ?? [legend.primary, legend.secondary, legend.symbol, legend.icon].filter(Boolean).join(" ");
}

function createLegendIcon(icon: KeyIcon): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

  svg.setAttribute("class", "legend-icon-svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("aria-hidden", "true");
  use.setAttribute("href", `${new URL("key-icons.svg", document.baseURI).toString()}#legend-${icon}`);
  svg.append(use);

  return svg;
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
  keyboard.className = `keyboard keyboard-${currentLayout} keyboard-${product.caseStyle} legend-${product.legendVariant}`;
  keyboard.style.setProperty("--case-color", product.colorValue);
  keyboard.style.setProperty("--case-shadow", textColor(product.colorValue) === "#31312e" ? "#aaa79f" : "#181816");
  let index = 0;

  currentRows().forEach((row, rowIndex) => {
    const rowElement = document.createElement("div");
    rowElement.className = `key-row key-row-${rowIndex + 1}`;

    row.forEach(([legend, width, className = ""], columnIndex) => {
      const currentIndex = index++;
      const label = accessibleLegend(legend);
      const keyContext = { index: currentIndex, rowIndex, columnIndex, rowLength: row.length, label, className };
      const key = document.createElement("button");
      key.type = "button";
      key.className = `key${width >= 2 ? " key-wide" : ""}${className ? ` ${className}` : ""}`;
      key.setAttribute("aria-label", label ? `${label} キー` : "スペースキー");
      key.style.setProperty("--w", String(width));
      key.style.setProperty("--key-color", keyColors[currentIndex]);
      key.style.setProperty("--legend-color", keyColors[currentIndex] === product.keyColor ? product.legendColor : textColor(keyColors[currentIndex]));
      key.style.setProperty("--legend-opacity", keyColors[currentIndex] === product.keyColor && product.legendContrast === "low" ? ".48" : ".82");
      const keySide = document.createElement("span");
      keySide.className = "key-side";
      keySide.setAttribute("aria-hidden", "true");
      const keyTop = document.createElement("span");
      keyTop.className = "key-top";
      keyTop.setAttribute("aria-hidden", "true");
      const keyLabel = document.createElement("span");
      keyLabel.className = "key-label";
      if (legend.primary) {
        const primary = document.createElement("span");
        primary.className = "legend-primary";
        primary.textContent = legend.primary;
        keyLabel.append(primary);
      }
      if (legend.secondary) {
        const secondary = document.createElement("span");
        secondary.className = "legend-secondary";
        secondary.textContent = legend.secondary;
        keyLabel.append(secondary);
      }
      if (legend.symbol) {
        const symbol = document.createElement("span");
        symbol.className = "legend-symbol";
        symbol.textContent = legend.symbol;
        keyLabel.append(symbol);
      }
      if (legend.icon) {
        const icon = document.createElement("span");
        icon.className = "legend-icon";
        icon.append(createLegendIcon(legend.icon));
        keyLabel.append(icon);
      }
      keyTop.append(keyLabel);
      key.append(keySide, keyTop);
      key.addEventListener("click", () => {
        keyColors[currentIndex] = resolveColor(selected.value, keyContext);
        syncUserChangeToUrl();
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
  presetsByLayout[currentLayout].forEach((preset) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "preset";
    button.innerHTML = `<span><strong>${preset.name}</strong><small>${preset.sub}</small></span><span class="preset-colors">${preset.colors.map((color) => `<i style="--color:${resolveColor(color)}"></i>`).join("")}</span>`;
    button.addEventListener("click", () => {
      keyColors = currentKeyContexts().map((key) => resolveColor(preset.make(key), key));
      syncUserChangeToUrl();
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

function toBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
}

function encodeColorToken(color: string): string {
  return /^#[\da-f]{6}$/i.test(color) ? color.slice(1).toLowerCase() : color;
}

function decodeColorToken(color: string): string {
  return /^[\da-f]{6}$/i.test(color) ? `#${color}` : color;
}

function serializeDesignParam(): string {
  const dictionary = Array.from(new Set(keyColors));
  const indexes = keyColors.map((color) => dictionary.indexOf(color));
  const productIndex = productAppearances.findIndex((product) => product.id === currentProduct);
  const compact: CompactSavedState = {
    v: 1,
    l: currentLayout === "jis" ? "j" : "u",
    m: Math.max(productIndex, 0).toString(36),
    d: dictionary.map(encodeColorToken),
    i: toBase64Url(String.fromCharCode(...indexes)),
  };
  return toBase64Url(JSON.stringify(compact));
}

function deserializeDesignParam(value: string): SavedState | string[] | null {
  const stored = JSON.parse(fromBase64Url(value)) as CompactSavedState | SavedState | string[];

  if (Array.isArray(stored)) {
    return stored;
  }

  if (stored && typeof stored === "object" && "v" in stored && stored.v === 1) {
    const compact = stored as CompactSavedState;
    if (!Array.isArray(compact.d) || typeof compact.i !== "string") {
      return null;
    }

    const dictionary = compact.d.map(decodeColorToken);
    const colors = Array.from(fromBase64Url(compact.i), (char) => dictionary[char.charCodeAt(0)]);
    if (colors.some((color) => typeof color !== "string")) {
      return null;
    }

    const productIndex = compact.m ? parseInt(compact.m, 36) : 0;
    return {
      layout: compact.l === "j" ? "jis" : "us",
      product: productAppearances[Number.isNaN(productIndex) ? 0 : productIndex]?.id,
      colors,
    };
  }

  return stored as SavedState;
}

function updateUrl(): void {
  const url = new URL(location.href);
  url.searchParams.set("design", serializeDesignParam());
  history.replaceState(null, "", url);
}

function currentShareUrl(): string {
  updateUrl();
  return location.href;
}

function syncUserChangeToUrl(): void {
  updateUrl();
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
    const stored = query
      ? deserializeDesignParam(query)
      : JSON.parse(localStorage.getItem("hhkb-keytop-palette") || "null") as SavedState | string[] | null;

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

function selectProduct(product: string | undefined, applyFactoryColors = false, userInitiated = false): void {
  if (!isProductId(product)) return;

  currentProduct = product;
  if (applyFactoryColors) {
    keyColors = defaultColors();
  }

  renderAppearanceControls();

  renderKeyboard();
  if (userInitiated) {
    syncUserChangeToUrl();
  }

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
    selectProduct(next.id, true, true);
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
    button.addEventListener("click", () => selectProduct(product.id, true, true));
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

  renderPresets();
  renderKeyboard();
  syncUserChangeToUrl();
  toast(`${layouts[currentLayout].name}に切り替えました`);
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
  syncUserChangeToUrl();
  renderKeyboard();
  toast("デザインをリセットしました");
});

saveButton.addEventListener("click", () => {
  const persisted = save();
  toast(persisted ? "デザインを保存しました" : "保存は利用できません");
});

xShareButton.addEventListener("click", () => {
  const intentUrl = new URL("https://twitter.com/intent/tweet");
  intentUrl.searchParams.set("url", currentShareUrl());
  intentUrl.searchParams.set("text", "HHKB Keytop Paletteで配色を作りました");
  intentUrl.searchParams.set("hashtags", "hhkb");
  window.open(intentUrl.href, "_blank", "noopener,noreferrer");
});

shareButton.addEventListener("click", async () => {
  const shareUrl = currentShareUrl();

  try {
    await navigator.clipboard.writeText(shareUrl);
    toast("共有URLをコピーしました");
  } catch {
    window.prompt("このURLをコピーしてください", shareUrl);
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
