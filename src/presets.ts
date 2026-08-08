import { type FixedPresetModule, presetFromRows } from "./preset-format";
import type { LayoutName, Preset } from "./types";

const fixedPresetModules = import.meta.glob<FixedPresetModule>(
  "./presets/*.json",
  { eager: true },
);

const fixedPresetsByLayout = Object.entries(fixedPresetModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .reduce<Record<LayoutName, Preset[]>>(
    (presetsByLayout, [, { default: preset }]) => {
      presetsByLayout[preset.layout].push(presetFromRows(preset));
      return presetsByLayout;
    },
    { us: [], jis: [] },
  );

export const presetsByLayout: Record<LayoutName, Preset[]> =
  fixedPresetsByLayout;
