import "@fortawesome/fontawesome-free/css/all.min.css";

import { colors, keytop, layouts } from "./catalog";
import { deserializeDesignParam, serializeDesignParam } from "./design-codec";
import { elements } from "./dom-elements";
import { isWhiteProduct, isWhiteProductSpecialKey } from "./key-utils";
import {
  keyContextsForLayout,
  renderKeyboard as renderKeyboardElement,
} from "./keyboard-renderer";
import {
  parseUploadedPreset,
  presetFileName,
  serializePresetFile,
} from "./preset-file";
import type { FixedPresetDefinition } from "./preset-format";
import { presetsByLayout } from "./presets";
import {
  defaultProductForSeries,
  isLayoutName,
  isProductId,
  productsForSeries,
} from "./product-helpers";
import { productAppearances, productSeries } from "./products";
import {
  bodyColor,
  type ColorDefinition,
  type ColorOption,
  type KeyContext,
  type LayoutName,
  type ProductAppearance,
  type ProductId,
  type ProductSeries,
  type SavedState,
} from "./types";

const {
  keyboard,
  palette,
  modelSeries,
  bodyColors,
  presetsToggle,
  presetContainer,
  selectedSwatch,
  selectionText,
  customColor,
  customColorValue,
  resetButton,
  saveButton,
  loadButton,
  downloadPresetButton,
  uploadPresetButton,
  uploadPresetInput,
  xShareButton,
  shareButton,
  menuButton,
  headerMenu,
  toastElement,
} = elements;

let selected = colors[0];
let keyColors: ColorDefinition[] = [];
let currentLayout: LayoutName = "us";
let currentProduct: ProductId = "hybrid-type-s-white";
let savedDesigns: Partial<Record<LayoutName, ColorDefinition[]>> = {};
let toastTimer: number | undefined;

const defaultProduct: ProductId = "hybrid-type-s-white";

function currentProductAppearance(): ProductAppearance {
  return (
    productAppearances.find((product) => product.id === currentProduct) ??
    productAppearances[0]
  );
}

function currentKeyContexts(): KeyContext[] {
  return keyContextsForLayout(currentLayout);
}

function defaultColorForKey({
  label,
  className,
}: Pick<KeyContext, "label" | "className">): string {
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

function resolvedKeyColors(): string[] {
  const contexts = currentKeyContexts();
  return keyColors.map((color, index) => resolveColor(color, contexts[index]));
}

function renderKeyboard(): void {
  const contexts = currentKeyContexts();
  const displayKeyColors = resolvedKeyColors();

  renderKeyboardElement({
    keyboard,
    layout: currentLayout,
    keyColors: displayKeyColors,
    product: currentProductAppearance(),
    defaultColorForKey,
    resolveSelectedColor: (key) => resolveColor(selected.value, key),
    onKeyColorsChange: (nextKeyColors) => {
      keyColors = nextKeyColors.map((color, index) => {
        if (color === displayKeyColors[index]) {
          return keyColors[index];
        }

        return selected.value === bodyColor &&
          color === resolveColor(bodyColor, contexts[index])
          ? bodyColor
          : color;
      });
      syncUserChangeToUrl();
      renderKeyboard();
    },
  });
}

function chooseColor(color: ColorOption, isCustom = false): void {
  selected = color;
  document
    .querySelectorAll<HTMLButtonElement>(".color-button")
    .forEach((button) => {
      button.classList.toggle(
        "active",
        !isCustom && button.dataset.value === color.value,
      );
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
      keyColors = currentKeyContexts().map((key) => preset.make(key));
      syncUserChangeToUrl();
      renderKeyboard();
      toast(`${preset.name} を適用しました`);
    });
    presetContainer.append(button);
  });
}

function defaultColors(): ColorDefinition[] {
  return currentKeyContexts().map(() => bodyColor);
}

function save(): boolean {
  savedDesigns[currentLayout] = keyColors;
  try {
    localStorage.setItem(
      "hhkb-keytop-palette",
      JSON.stringify({
        layout: currentLayout,
        product: currentProduct,
        designs: savedDesigns,
      }),
    );
    return true;
  } catch {
    return false;
  }
}

function renderLayoutControls(): void {
  document
    .querySelectorAll<HTMLButtonElement>(".layout-button")
    .forEach((button) => {
      const active = button.dataset.layout === currentLayout;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
}

function applyStoredDesign(stored: SavedState | string[] | null): boolean {
  let nextLayout: LayoutName = "us";
  let nextProduct: ProductId = defaultProduct;
  let nextSavedDesigns: Partial<Record<LayoutName, ColorDefinition[]>> = {};

  if (Array.isArray(stored)) {
    nextSavedDesigns.us = stored;
  } else if (stored && typeof stored === "object") {
    nextLayout = isLayoutName(stored.layout) ? stored.layout : "us";
    nextProduct = isProductId(stored.product) ? stored.product : defaultProduct;
    nextSavedDesigns =
      stored.designs ||
      (Array.isArray(stored.colors) ? { [nextLayout]: stored.colors } : {});
  } else {
    return false;
  }

  const values = nextSavedDesigns[nextLayout];
  if (
    !Array.isArray(values) ||
    values.length !== layouts[nextLayout].rows.flat().length ||
    values.some((value) => typeof value !== "string")
  ) {
    return false;
  }

  currentLayout = nextLayout;
  currentProduct = nextProduct;
  savedDesigns = nextSavedDesigns;
  keyColors = values;
  return true;
}

function updateUrl(): void {
  const url = new URL(location.href);
  url.searchParams.set(
    "design",
    serializeDesignParam(keyColors, currentLayout, currentProduct),
  );
  history.replaceState(null, "", url);
}

function currentShareUrl(): string {
  updateUrl();
  const url = new URL(location.pathname, location.origin);
  url.searchParams.set(
    "design",
    serializeDesignParam(keyColors, currentLayout, currentProduct),
  );
  return url.href;
}

function syncUserChangeToUrl(): void {
  updateUrl();
}

function toast(message: string): void {
  toastElement.textContent = message;
  toastElement.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(
    () => toastElement.classList.remove("show"),
    2400,
  );
}

function load(): void {
  const query = new URLSearchParams(location.search).get("design");

  try {
    const stored = query
      ? deserializeDesignParam(query)
      : (JSON.parse(localStorage.getItem("hhkb-keytop-palette") || "null") as
          | SavedState
          | string[]
          | null);

    if (!applyStoredDesign(stored)) {
      keyColors = defaultColors();
    }
  } catch {
    keyColors = defaultColors();
  }
}

function loadBrowserSavedDesign(): void {
  try {
    const stored = JSON.parse(
      localStorage.getItem("hhkb-keytop-palette") || "null",
    ) as SavedState | string[] | null;
    if (!applyStoredDesign(stored)) {
      toast("ブラウザ保存したデザインがありません");
      return;
    }

    renderLayoutControls();
    selectProduct(currentProduct);
    syncUserChangeToUrl();
    toast("ブラウザ保存を読み込みました");
  } catch {
    toast("ブラウザ保存を読み込めません");
  }
}

function selectProduct(
  product: string | undefined,
  applyFactoryColors = false,
  userInitiated = false,
): void {
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
  const next = defaultProductForSeries(series);

  if (next) {
    selectProduct(next.id, true, true);
  }
}

function renderAppearanceControls(): void {
  const current = currentProductAppearance();

  document
    .querySelectorAll<HTMLButtonElement>(".model-button")
    .forEach((button) => {
      const active = button.dataset.series === current.series;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

  bodyColors.innerHTML = "";
  productsForSeries(current.series).forEach((product) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "body-color";
    button.dataset.product = product.id;
    button.setAttribute("aria-pressed", String(product.id === currentProduct));
    button.innerHTML = `<span class="body-color-swatch" style="--color:${product.colorValue}"></span><span>${product.colorName}</span>`;
    button.classList.toggle("active", product.id === currentProduct);
    button.addEventListener("click", () =>
      selectProduct(product.id, true, true),
    );
    bodyColors.append(button);
  });

  document
    .querySelectorAll<HTMLButtonElement>(".body-color")
    .forEach((button) => {
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
  keyColors =
    Array.isArray(saved) &&
    saved.length === layouts[currentLayout].rows.flat().length
      ? saved
      : defaultColors();

  renderLayoutControls();

  renderPresets();
  renderKeyboard();
  syncUserChangeToUrl();
  toast(`${layouts[currentLayout].name}に切り替えました`);
}

function downloadPresetFile(): void {
  const name = window.prompt("プリセット名", "作成した配色")?.trim();
  if (!name) return;

  const blob = new Blob(
    [
      serializePresetFile(
        name,
        currentLayout,
        currentProductAppearance(),
        keyColors,
      ),
    ],
    { type: "application/json;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = presetFileName(name);
  link.click();
  URL.revokeObjectURL(url);
  toast("プリセットファイルをダウンロードしました");
}

function applyUploadedPreset(preset: FixedPresetDefinition): void {
  savedDesigns[currentLayout] = keyColors;
  currentLayout = preset.layout;

  keyColors = preset.rows.flatMap((row) => row.colors);
  savedDesigns[currentLayout] = keyColors;

  renderLayoutControls();

  renderPresets();
  renderKeyboard();
  syncUserChangeToUrl();
  toast(`${preset.name} をアップロードしました`);
}

async function uploadPresetFile(file: File | undefined): Promise<void> {
  if (!file) return;

  try {
    const preset = parseUploadedPreset(JSON.parse(await file.text()));
    if (!preset) {
      toast("プリセットファイルを読み込めません");
      return;
    }

    applyUploadedPreset(preset);
  } catch {
    toast("プリセットファイルを読み込めません");
  }
}

function setHeaderMenuOpen(open: boolean, restoreFocus = false): void {
  menuButton.setAttribute("aria-expanded", String(open));
  headerMenu.hidden = !open;

  if (open) {
    headerMenu.querySelector<HTMLElement>("button, a[href]")?.focus();
  } else if (restoreFocus) {
    menuButton.focus();
  }
}

function setPresetsExpanded(expanded: boolean): void {
  presetsToggle.setAttribute("aria-expanded", String(expanded));
  presetContainer.hidden = !expanded;
}

function renderProductSeriesControls(): void {
  productSeries.forEach((series) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "product model-button";
    button.dataset.series = series;
    button.setAttribute("aria-pressed", "false");
    const representative = defaultProductForSeries(series);
    button.innerHTML = `<span class="product-swatch" style="--color:${representative?.colorValue ?? "#cac4b8"}"></span><span><strong>${series}</strong><small>${representative?.detail ?? ""}</small></span>`;
    button.addEventListener("click", () => selectSeries(series));
    modelSeries.append(button);
  });
}

function bindEvents(): void {
  menuButton.addEventListener("click", () => {
    setHeaderMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
  });

  headerMenu.addEventListener("click", (event) => {
    if (
      event.target instanceof Element &&
      event.target.closest("button, a[href]")
    )
      setHeaderMenuOpen(false, true);
  });

  document.addEventListener("click", (event) => {
    if (
      menuButton.getAttribute("aria-expanded") === "true" &&
      event.target instanceof Element &&
      !event.target.closest(".header-actions")
    ) {
      setHeaderMenuOpen(false, true);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      setHeaderMenuOpen(false, true);
    }
  });

  presetsToggle.addEventListener("click", () => {
    setPresetsExpanded(presetsToggle.getAttribute("aria-expanded") !== "true");
  });

  document
    .querySelectorAll<HTMLButtonElement>(".layout-button")
    .forEach((button) => {
      button.addEventListener("click", () =>
        selectLayout(button.dataset.layout),
      );
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
    toast(
      persisted ? "ブラウザに保存しました" : "ブラウザ保存は利用できません",
    );
  });

  loadButton.addEventListener("click", loadBrowserSavedDesign);

  downloadPresetButton.addEventListener("click", downloadPresetFile);

  uploadPresetButton.addEventListener("click", () => {
    uploadPresetInput.click();
  });

  uploadPresetInput.addEventListener("change", () => {
    void uploadPresetFile(uploadPresetInput.files?.[0]);
    uploadPresetInput.value = "";
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
}

function initialize(): void {
  renderProductSeriesControls();
  bindEvents();
  setHeaderMenuOpen(false);
  load();
  selectProduct(currentProduct);
  renderLayoutControls();
  chooseColor(selected);
  renderKeyboard();
}

initialize();
