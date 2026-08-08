import { productAppearances } from "./products";
import type { CompactSavedState, LayoutName, ProductId, SavedState } from "./types";

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

export function serializeDesignParam(keyColors: string[], currentLayout: LayoutName, currentProduct: ProductId): string {
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

export function deserializeDesignParam(value: string): SavedState | string[] | null {
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
