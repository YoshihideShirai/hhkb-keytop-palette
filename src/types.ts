export type KeyIcon =
  | "diamond"
  | "arrow-up"
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "hhkb-mark"
  | "non-convert"
  | "convert";

export interface KeyLegend {
  primary: string;
  secondary?: string;
  front?: string;
  /** Non-textual or uncommon marks that should be rendered as text. */
  symbol?: string;
  /** Icon identifier for non-textual HHKB legends rendered with SVG. */
  icon?: KeyIcon;
  accessibleLabel?: string;
}

export type KeyDefinition = readonly [legend: KeyLegend, width: number, className?: string];
export type LayoutName = "us" | "jis";
export type ProductSeries = "HYBRID Type-S" | "HYBRID" | "Classic Type-S" | "Classic" | "Studio";
export type ProductId =
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

export interface ColorOption {
  name: string;
  value: ColorDefinition;
}

export interface Layout {
  name: string;
  rows: KeyDefinition[][];
}

export interface Preset {
  name: string;
  sub: string;
  colors: ColorDefinition[];
  make: (key: KeyContext) => ColorDefinition;
}

export interface KeyContext {
  index: number;
  rowIndex: number;
  columnIndex: number;
  rowLength: number;
  label: string;
  className: string;
}

export interface ProductAppearance {
  id: ProductId;
  series: ProductSeries;
  colorName: string;
  colorValue: string;
  keyColor: string;
  legendColor: string;
  legendVariant: LegendVariant;
  legendContrast: "standard" | "low";
  caseStyle: "classic" | "hybrid" | "studio";
  detail: string;
}

export const legendVariants = ["standard-corner", "snow-center", "anniversary-center", "studio-center"] as const;
export type LegendVariant = (typeof legendVariants)[number];

export interface SavedState {
  layout?: string;
  colors?: string[];
  designs?: Partial<Record<LayoutName, string[]>>;
  product?: string;
}

export interface CompactSavedState {
  v?: number;
  l?: string;
  m?: string;
  d?: string[];
  i?: string;
}

export const bodyColor = "__body_color__" as const;
export type ColorDefinition = string | typeof bodyColor;
