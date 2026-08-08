import {
  bodyColor,
  type ColorDefinition,
  type LayoutName,
  type Preset,
} from "./types";

export interface FixedPresetDefinition {
  name: string;
  sub: string;
  layout: LayoutName;
  rows: readonly FixedPresetRow[];
}

export interface FixedPresetRow {
  keys?: readonly string[];
  colors: readonly ColorDefinition[];
}

export interface FixedPresetModule {
  default: FixedPresetDefinition;
}

export function presetFromRows(definition: FixedPresetDefinition): Preset {
  const flatColors = definition.rows.flatMap((row) => row.colors);
  const colors = Array.from(new Set(flatColors));

  return {
    name: definition.name,
    sub: definition.sub,
    colors: colors.length > 0 ? colors : [bodyColor],
    make: ({ rowIndex, columnIndex }) =>
      definition.rows[rowIndex]?.colors[columnIndex] ?? bodyColor,
  };
}
