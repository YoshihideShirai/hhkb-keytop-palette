import { bodyColor, type ColorOption, type KeyDefinition, type KeyIcon, type KeyLegend, type Layout, type LayoutName } from "./types";

function key(primary: string, width: number, className?: string, secondary?: string, accessibleLabel?: string): KeyDefinition {
  return [{ primary, ...(secondary ? { secondary } : {}), ...(accessibleLabel ? { accessibleLabel } : {}) }, width, className];
}

function icon(icon: KeyIcon, accessibleLabel: string, width: number, className?: string): KeyDefinition {
  return [{ primary: "", icon, accessibleLabel }, width, className];
}

const blankLegend: KeyLegend = { primary: "", accessibleLabel: "スペース" };

export const colors: ColorOption[] = [
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

export const keytop = {
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

export const layouts: Record<LayoutName, Layout> = {
  us: {
    name: "英語配列",
    rows: [
      [key("Esc", 1), key("1", 1, undefined, "!"), key("2", 1, undefined, "@"), key("3", 1, undefined, "#"), key("4", 1, undefined, "$"), key("5", 1, undefined, "%"), key("6", 1, undefined, "^"), key("7", 1, undefined, "&"), key("8", 1, undefined, "*"), key("9", 1, undefined, "("), key("0", 1, undefined, ")"), key("-", 1, undefined, "_"), key("=", 1, undefined, "+"), key("\\", 1, undefined, "|"), key("`", 1, undefined, "~")],
      [key("Tab", 1.5), ..."QWERTYUIOP".split("").map((label) => key(label, 1)), key("[", 1, undefined, "{"), key("]", 1, undefined, "}"), key("Delete", 1.5)],
      [key("Control", 1.75), ..."ASDFGHJKL".split("").map((label) => key(label, 1)), key(";", 1, undefined, ":"), key("'", 1, undefined, '"'), key("Return", 2.25)],
      [key("Shift", 2.25), ..."ZXCVBNM".split("").map((label) => key(label, 1)), key(",", 1, undefined, "<"), key(".", 1, undefined, ">"), key("/", 1, undefined, "?"), key("Shift", 2.75)],
      [key("Fn", 1.25), key("Alt", 1.25, undefined, "Opt"), icon("diamond", "◇", 1.25), [blankLegend, 6, "space"], icon("diamond", "◇", 1.25), key("Alt", 1.25, undefined, "Opt"), key("Fn", 1.25)],
    ],
  },
  jis: {
    name: "日本語配列",
    rows: [
      [key("Esc", 1), key("1", 1, undefined, "!"), key("2", 1, undefined, '"'), key("3", 1, undefined, "#"), key("4", 1, undefined, "$"), key("5", 1, undefined, "%"), key("6", 1, undefined, "&"), key("7", 1, undefined, "'"), key("8", 1, undefined, "("), key("9", 1, undefined, ")"), key("0", 1), key("-", 1, undefined, "="), key("^", 1, undefined, "~"), key("¥", 1, undefined, "|"), key("BS", 1)],
      [key("Tab", 1.5), ..."QWERTYUIOP".split("").map((label) => key(label, 1)), key("@", 1, undefined, "`"), key("[", 1, undefined, "{"), [blankLegend, 0, "spacer"], key("Enter", 1.5, "jis-enter")],
      [key("Control", 1.75), ..."ASDFGHJKL".split("").map((label) => key(label, 1)), key(";", 1, undefined, "+"), key(":", 1, undefined, "*"), key("]", 1, undefined, "}")],
      [key("Shift", 2), ..."ZXCVBNM".split("").map((label) => key(label, 1)), key(",", 1, undefined, "<"), key(".", 1, undefined, ">"), key("/", 1, undefined, "?"), key("\\", 1, undefined, "_"), [blankLegend, 0, "spacer"], icon("arrow-up", "↑", 1, "arrow"), key("Shift", 1)],
      [key("Fn", 1), [blankLegend, .25, "spacer"], icon("input-mode", "半角/全角", 1, "jis-ime-icon"), icon("diamond", "◇", 1), key("Alt", 1, undefined, "Opt"), icon("non-convert", "無変換", 1, "jis-ime-icon"), [blankLegend, 2.5, "space"], icon("convert", "変換", 1, "jis-ime-icon"), key("Kana", 1, undefined, undefined, "かな"), key("Alt", 1, undefined, "Opt"), key("Fn", 1), [blankLegend, .25, "spacer"], icon("arrow-left", "←", 1, "arrow"), icon("arrow-down", "↓", 1, "arrow"), icon("arrow-right", "→", 1, "arrow")],
    ],
  },
};
