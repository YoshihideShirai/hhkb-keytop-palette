import { layouts } from "./catalog";
import { textColor } from "./key-utils";
import type { KeyContext, KeyIcon, KeyLegend, LayoutName, ProductAppearance } from "./types";

export function accessibleLegend(legend: KeyLegend): string {
  return legend.accessibleLabel ?? [legend.primary, legend.secondary, legend.front, legend.symbol, legend.icon].filter(Boolean).join(" ");
}

export function keyContextsForLayout(layout: LayoutName): KeyContext[] {
  let index = 0;
  return layouts[layout].rows.flatMap((row, rowIndex) =>
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

export interface RenderKeyboardOptions {
  keyboard: HTMLDivElement;
  layout: LayoutName;
  keyColors: string[];
  product: ProductAppearance;
  defaultColorForKey: (key: KeyContext) => string;
  resolveSelectedColor: (key: KeyContext) => string;
  onKeyColorsChange: (keyColors: string[]) => void;
}

export function renderKeyboard({
  keyboard,
  layout,
  keyColors,
  product,
  defaultColorForKey,
  resolveSelectedColor,
  onKeyColorsChange,
}: RenderKeyboardOptions): void {
  keyboard.innerHTML = "";
  keyboard.className = `keyboard keyboard-${layout} keyboard-${product.caseStyle} keyboard-product-${product.id} legend-${product.legendVariant}`;
  keyboard.style.setProperty("--case-color", product.colorValue);
  keyboard.style.setProperty("--case-shadow", textColor(product.colorValue) === "#31312e" ? "#aaa79f" : "#181816");
  let index = 0;

  layouts[layout].rows.forEach((row, rowIndex) => {
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
      if (legend.front) {
        const front = document.createElement("span");
        front.className = "legend-front";
        front.textContent = legend.front;
        keyLabel.append(front);
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
        const selectedColor = resolveSelectedColor(keyContext);
        const nextKeyColors = [...keyColors];
        nextKeyColors[currentIndex] = keyColors[currentIndex] === selectedColor ? defaultColorForKey(keyContext) : selectedColor;
        onKeyColorsChange(nextKeyColors);
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
  badge.textContent = product.series.startsWith("HYBRID") ? "HHKB Professional HYBRID" : "HHKB";
  badge.setAttribute("aria-hidden", "true");
  keyboard.append(badge);

  if (product.series.includes("Type-S")) {
    const gradeBadge = document.createElement("span");
    gradeBadge.className = "keyboard-grade-badge";
    gradeBadge.textContent = "Type-S";
    gradeBadge.setAttribute("aria-hidden", "true");
    keyboard.append(gradeBadge);
  }

  keyboard.setAttribute("aria-label", `HHKB ${product.series} ${product.colorName} ${layouts[layout].name}`);
}
