import type { ProductAppearance } from "./types";

export function normalizeLabel(label: string): string {
  return label.split(/[\n\s/]+/)[0];
}

export function isNumberKey(label: string): boolean {
  return /^\d/.test(normalizeLabel(label));
}

export function isAlphaKey(label: string): boolean {
  return /^[A-Z]$/.test(normalizeLabel(label));
}

export function isHappyHackingKey(label: string): boolean {
  const normalized = normalizeLabel(label);
  return normalized !== "" && "HAPPYCKING".includes(normalized);
}

export function isMarkerKey(label: string, className: string): boolean {
  const normalized = normalizeLabel(label);
  return className === "arrow" || normalized === "Fn" || isNumberKey(label);
}

export function isUsHeartKey(rowIndex: number, label: string): boolean {
  const normalized = normalizeLabel(label);
  const heartRows = [
    ["8", "9", "-", "="],
    ["U", "I", "O", "P", "[", "]"],
    ["J", "K", "L", ";", "'"],
    ["M", ",", ".", "/"],
    ["◇"],
  ];
  return heartRows[rowIndex]?.includes(normalized) ?? false;
}

export function isJisHeartKey(rowIndex: number, label: string): boolean {
  const normalized = normalizeLabel(label);
  const heartRows = [
    ["7", "8", "0", "-"],
    ["Y", "U", "I", "O", "P", "@"],
    ["H", "J", "K", "L", ";"],
    ["M", ",", "."],
    ["Kana", "かな"],
  ];
  return heartRows[rowIndex]?.includes(normalized) ?? false;
}

export function isWhiteProduct(product: ProductAppearance): boolean {
  return product.colorName === "白";
}

export function isWhiteProductSpecialKey(label: string, className: string): boolean {
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
    "半角/全角",
    "Kana",
    "無変換",
    "変換",
    "かな",
    "↑",
    "←",
    "↓",
    "→",
  ].includes(normalized);
}

export function textColor(hex: string): string {
  const rgb = hex.slice(1).match(/.{2}/g)?.map((value) => parseInt(value, 16));
  if (!rgb || rgb.length < 3 || rgb.some(Number.isNaN)) {
    return "#31312e";
  }
  return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 > 155 ? "#31312e" : "#f8f6ef";
}
