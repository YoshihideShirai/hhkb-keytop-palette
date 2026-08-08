import {
  bodyColor,
  type ColorOption,
  type KeyDefinition,
  type KeyIcon,
  type KeyLegend,
  type Layout,
  type LayoutName,
} from "./types";

function key(
  primary: string,
  width: number,
  className?: string,
  secondary?: string,
  accessibleLabel?: string,
  front?: string,
): KeyDefinition {
  return [
    {
      primary,
      ...(secondary ? { secondary } : {}),
      ...(front ? { front } : {}),
      ...(accessibleLabel ? { accessibleLabel } : {}),
    },
    width,
    className,
  ];
}

function fkey(
  primary: string,
  width: number,
  className?: string,
  secondary?: string,
  front?: string,
): KeyDefinition {
  return key(primary, width, className, secondary, undefined, front);
}

function icon(
  icon: KeyIcon,
  accessibleLabel: string,
  width: number,
  className?: string,
): KeyDefinition {
  return [{ primary: "", icon, accessibleLabel }, width, className];
}

const blankLegend: KeyLegend = { primary: "", accessibleLabel: "スペース" };

export const colors: ColorOption[] = [
  { name: "本体カラー", value: bodyColor },
  { name: "墨", value: "#3b3b38" },
  { name: "白", value: "#ded9cf" },
  { name: "白 特殊キー", value: "#aaa69c" },
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
  white: "#ded9cf",
  whiteSpecial: "#aaa69c",
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
      [
        fkey("Esc", 1, "legend-center-left", undefined, "Power"),
        fkey("1", 1, undefined, "!", "F1"),
        fkey("2", 1, undefined, "@", "F2"),
        fkey("3", 1, undefined, "#", "F3"),
        fkey("4", 1, undefined, "$", "F4"),
        fkey("5", 1, undefined, "%", "F5"),
        fkey("6", 1, undefined, "^", "F6"),
        fkey("7", 1, undefined, "&", "F7"),
        fkey("8", 1, undefined, "*", "F8"),
        fkey("9", 1, undefined, "(", "F9"),
        fkey("0", 1, undefined, ")", "F10"),
        fkey("-", 1, undefined, "_", "F11"),
        fkey("=", 1, undefined, "+", "F12"),
        fkey("\\", 1, undefined, "|", "Ins"),
        fkey("`", 1, undefined, "~", "Del"),
      ],
      [
        fkey("Tab", 1.5, "legend-center-left", undefined, "Caps"),
        ..."QWERTYUIOP".split("").map((label) => key(label, 1)),
        fkey("[", 1, undefined, "{", "↑"),
        fkey("]", 1, undefined, "}", "PgUp"),
        fkey("Delete", 1.5, "legend-center-left", undefined, "BS"),
      ],
      [
        key("Control", 1.75, "legend-center-left"),
        fkey("A", 1, undefined, undefined, "Vol_Dn"),
        fkey("S", 1, undefined, undefined, "Vol_Up"),
        fkey("D", 1, undefined, undefined, "Mute"),
        fkey("F", 1, undefined, undefined, "Eject"),
        ..."GHJ".split("").map((label) => key(label, 1)),
        fkey("K", 1, undefined, undefined, "Home"),
        fkey("L", 1, undefined, undefined, "PgDn"),
        fkey(";", 1, undefined, ":", "←"),
        fkey("'", 1, undefined, '"', "→"),
        fkey("Return", 2.25, "legend-center-left", undefined, "Enter"),
      ],
      [
        key("Shift", 2.25, "legend-center-left"),
        ..."ZXCVBNM".split("").map((label) => key(label, 1)),
        fkey(",", 1, undefined, "<", "End"),
        fkey(".", 1, undefined, ">", "↓"),
        key("/", 1, undefined, "?"),
        key("Shift", 1.75, "legend-center-left"),
        key("Fn", 1, "legend-center-left"),
      ],
      [
        key("Alt", 1, "legend-modifier-stack", "Opt"),
        icon("diamond", "◇", 1.5, "legend-center"),
        [blankLegend, 6, "space"],
        icon("diamond", "◇", 1.5, "legend-center"),
        key("Alt", 1, "legend-modifier-stack", "Opt"),
      ],
    ],
  },
  jis: {
    name: "日本語配列",
    rows: [
      [
        fkey("Esc", 1, "legend-center-left", undefined, "Power"),
        fkey("1", 1, undefined, "!", "F1"),
        fkey("2", 1, undefined, '"', "F2"),
        fkey("3", 1, undefined, "#", "F3"),
        fkey("4", 1, undefined, "$", "F4"),
        fkey("5", 1, undefined, "%", "F5"),
        fkey("6", 1, undefined, "&", "F6"),
        fkey("7", 1, undefined, "'", "F7"),
        fkey("8", 1, undefined, "(", "F8"),
        fkey("9", 1, undefined, ")", "F9"),
        fkey("0", 1, undefined, undefined, "F10"),
        fkey("-", 1, undefined, "=", "F11"),
        fkey("^", 1, undefined, "~", "F12"),
        fkey("¥", 1, undefined, "|", "Ins"),
        fkey("BS", 1, "legend-center-left", undefined, "Del"),
      ],
      [
        fkey("Tab", 1.5, "legend-center-left", undefined, "Caps"),
        ..."QWERTYUIOP".split("").map((label) => key(label, 1)),
        fkey("@", 1, undefined, "`", "PSc/SRq"),
        fkey("[", 1, undefined, "{", "ScrLk"),
        [blankLegend, 0, "spacer"],
        fkey("Enter", 1.5, "jis-enter legend-center-left", undefined, "Enter"),
      ],
      [
        key("Control", 1.75, "legend-center-left"),
        fkey("A", 1, undefined, undefined, "Vol_Dn"),
        fkey("S", 1, undefined, undefined, "Vol_Up"),
        fkey("D", 1, undefined, undefined, "Mute"),
        fkey("F", 1, undefined, undefined, "Eject"),
        ..."GHJ".split("").map((label) => key(label, 1)),
        fkey("K", 1, undefined, undefined, "Home"),
        fkey("L", 1, undefined, undefined, "PgUp"),
        fkey(";", 1, undefined, "+", "←"),
        fkey(":", 1, undefined, "*", "→"),
        key("]", 1, undefined, "}"),
      ],
      [
        key("Shift", 2, "legend-center-left"),
        ..."ZXCVBNM".split("").map((label) => key(label, 1)),
        fkey(",", 1, undefined, "<", "End"),
        fkey(".", 1, undefined, ">", "PgDn"),
        key("/", 1, undefined, "?"),
        key("\\", 1, undefined, "_"),
        [blankLegend, 0, "spacer"],
        icon("arrow-up", "↑", 1, "arrow"),
        key("Shift", 1, "legend-center-left"),
      ],
      [
        key("Fn", 1, "legend-center-left"),
        [blankLegend, 0.25, "spacer"],
        icon(
          "hhkb-mark",
          "半角/全角",
          1,
          "jis-ime-icon hhkb-mark-key legend-center",
        ),
        icon("diamond", "◇", 1, "legend-center"),
        key("Alt", 1, "legend-modifier-stack", "Opt"),
        icon("non-convert", "無変換", 1, "jis-ime-icon legend-center"),
        [blankLegend, 2.5, "space"],
        icon("convert", "変換", 1, "jis-ime-icon legend-center"),
        key("Kana", 1, undefined, undefined, "かな"),
        key("Alt", 1, "legend-modifier-stack", "Opt"),
        key("Fn", 1, "legend-center-left"),
        [blankLegend, 0.25, "spacer"],
        icon("arrow-left", "←", 1, "arrow"),
        icon("arrow-down", "↓", 1, "arrow"),
        icon("arrow-right", "→", 1, "arrow"),
      ],
    ],
  },
};
