import { bodyColor, type ColorDefinition, type LayoutName, type ProductAppearance } from "./types";
import type { FixedPresetDefinition } from "./preset-format";
import { accessibleLegend } from "./keyboard-renderer";
import { isLayoutName } from "./product-helpers";
import { layouts } from "./catalog";

function isColorDefinition(value: unknown): value is ColorDefinition {
  return value === bodyColor || (typeof value === "string" && /^#[\da-f]{6}$/i.test(value));
}

function rowsFromDesign(layout: LayoutName, keyColors: string[]): string[][] {
  let index = 0;
  return layouts[layout].rows.map((row) => row.map(() => keyColors[index++]));
}

export function serializePresetFile(name: string, layout: LayoutName, product: ProductAppearance, keyColors: string[]): string {
  const sub = `${layouts[layout].name} / ${product.series} ${product.colorName}`;
  const rowLabels = layouts[layout].rows.map((row) => row.map(([legend]) => accessibleLegend(legend) || "スペース"));
  const rows = rowsFromDesign(layout, keyColors).map((colors, rowIndex) => ({
    keys: rowLabels[rowIndex],
    colors,
  }));

  return `${JSON.stringify({ name, sub, layout, rows }, null, 2)}\n`;
}

export function presetFileName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "");
  return `${slug || "hhkb-preset"}-${timestamp}.json`;
}

export function parseUploadedPreset(value: unknown): FixedPresetDefinition | null {
  if (!value || typeof value !== "object") return null;

  const preset = value as Partial<FixedPresetDefinition>;
  if (typeof preset.name !== "string" || !isLayoutName(preset.layout) || !Array.isArray(preset.rows)) {
    return null;
  }

  const layoutRows = layouts[preset.layout].rows;
  if (preset.rows.length !== layoutRows.length) {
    return null;
  }

  const rows = preset.rows.map((row, rowIndex) => {
    if (!row || typeof row !== "object" || !Array.isArray(row.colors)) {
      return null;
    }

    if (row.colors.length !== layoutRows[rowIndex].length || !row.colors.every(isColorDefinition)) {
      return null;
    }

    return {
      keys: Array.isArray(row.keys) && row.keys.every((key: unknown) => typeof key === "string") ? row.keys : undefined,
      colors: row.colors,
    };
  });

  if (rows.some((row) => row === null)) {
    return null;
  }

  return {
    name: preset.name.trim() || "アップロードした配色",
    sub: typeof preset.sub === "string" ? preset.sub : "アップロードしたプリセット",
    layout: preset.layout,
    rows: rows as FixedPresetDefinition["rows"],
  };
}
