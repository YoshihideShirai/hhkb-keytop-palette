import { keytop } from "./catalog";
import { isAlphaKey, isHappyHackingKey, isJisHeartKey, isMarkerKey, isNumberKey, isUsHeartKey, isWhiteProductSpecialKey, normalizeLabel } from "./key-utils";
import { bodyColor, type LayoutName, type Preset } from "./types";

const usPresets: Preset[] = [
  {
    name: "中央印字 墨",
    sub: "やわらかな墨",
    colors: [keytop.sumi],
    make: () => keytop.sumi,
  },
  {
    name: "中央印字 白",
    sub: "くすみ白 + 特殊キー",
    colors: [keytop.white, keytop.whiteSpecial],
    make: ({ label, className }) => isWhiteProductSpecialKey(label, className) ? keytop.whiteSpecial : keytop.white,
  },
  {
    name: "桜",
    sub: "花びらの赤",
    colors: [bodyColor, keytop.sakura],
    make: ({ label }) => isAlphaKey(label) ? keytop.sakura : bodyColor,
  },
  {
    name: "花見三色団子",
    sub: "桜 / 山葵 / 蒲公英",
    colors: [bodyColor, keytop.sakura, keytop.wasabi, keytop.tanpopo],
    make: ({ label, rowIndex }) => {
      if (!isAlphaKey(label)) return bodyColor;
      if (rowIndex === 1) return keytop.sakura;
      if (rowIndex === 2) return keytop.wasabi;
      if (rowIndex === 3) return keytop.tanpopo;
      return bodyColor;
    },
  },
  {
    name: "蒲公英マーク",
    sub: "新年度の若葉マーク",
    colors: [bodyColor, keytop.tanpopo, keytop.wasabi],
    make: ({ rowIndex, columnIndex, rowLength }) => {
      const center = (rowLength - 1) / 2;
      const distance = Math.abs(columnIndex - center);
      if ((rowIndex === 1 || rowIndex === 2) && distance <= 1.5) return keytop.wasabi;
      if ((rowIndex === 2 || rowIndex === 3) && distance >= 2 && distance <= 4) return keytop.tanpopo;
      return bodyColor;
    },
  },
  {
    name: "藤グラデーション",
    sub: "数字キーグラデーション",
    colors: [bodyColor, keytop.sakura, keytop.tanpopo, keytop.wasabi, keytop.fuji, keytop.sora],
    make: ({ label, columnIndex }) => {
      if (!isNumberKey(label)) return bodyColor;
      const gradient = [keytop.sakura, keytop.tanpopo, keytop.wasabi, keytop.fuji, keytop.sora];
      return gradient[columnIndex % gradient.length];
    },
  },
  {
    name: "Happy Hacking",
    sub: "好きな言葉を桜で",
    colors: [bodyColor, keytop.sakura],
    make: ({ label }) => isHappyHackingKey(label) ? keytop.sakura : bodyColor,
  },
  {
    name: "目印キー",
    sub: "数字 / Fn を蒲公英に",
    colors: [bodyColor, keytop.tanpopo],
    make: ({ label }) => isNumberKey(label) || normalizeLabel(label) === "Fn" ? keytop.tanpopo : bodyColor,
  },
  {
    name: "ボーダー",
    sub: "山葵で視認性アップ",
    colors: [bodyColor, keytop.wasabi],
    make: ({ rowIndex }) => rowIndex === 1 || rowIndex === 3 ? keytop.wasabi : bodyColor,
  },
  {
    name: "縦グラデーション",
    sub: "カラーを縦方向に",
    colors: [bodyColor, keytop.sakura, keytop.tanpopo, keytop.wasabi, keytop.fuji, keytop.sora],
    make: ({ rowIndex, columnIndex }) => {
      const gradient = [keytop.sakura, keytop.tanpopo, keytop.wasabi, keytop.fuji, keytop.sora];
      return Math.abs(columnIndex - 7) <= 1 ? gradient[rowIndex] : bodyColor;
    },
  },
  {
    name: "ハート",
    sub: "桜のベスポジ",
    colors: [bodyColor, keytop.sakura],
    make: ({ rowIndex, label }) => isUsHeartKey(rowIndex, label) ? keytop.sakura : bodyColor,
  },
  {
    name: "Esc / Control",
    sub: "空と藤のアクセント",
    colors: [bodyColor, keytop.sora, keytop.fuji],
    make: ({ label }) => {
      const normalized = normalizeLabel(label);
      if (normalized === "Esc") return keytop.sora;
      if (normalized === "Control") return keytop.fuji;
      return bodyColor;
    },
  },
];

const jisPresets: Preset[] = [
  {
    name: "中央印字 墨",
    sub: "やわらかな墨",
    colors: [keytop.sumi],
    make: () => keytop.sumi,
  },
  {
    name: "中央印字 白",
    sub: "くすみ白 + 特殊キー",
    colors: [keytop.white, keytop.whiteSpecial],
    make: ({ label, className }) => isWhiteProductSpecialKey(label, className) ? keytop.whiteSpecial : keytop.white,
  },
  {
    name: "桜",
    sub: "花びらの赤",
    colors: [bodyColor, keytop.sakura],
    make: ({ label }) => isAlphaKey(label) ? keytop.sakura : bodyColor,
  },
  {
    name: "花見三色団子",
    sub: "桜 / 山葵 / 蒲公英",
    colors: [bodyColor, keytop.sakura, keytop.wasabi, keytop.tanpopo],
    make: ({ label, rowIndex }) => {
      if (!isAlphaKey(label)) return bodyColor;
      if (rowIndex === 1) return keytop.sakura;
      if (rowIndex === 2) return keytop.wasabi;
      if (rowIndex === 3) return keytop.tanpopo;
      return bodyColor;
    },
  },
  {
    name: "蒲公英マーク",
    sub: "新年度の若葉マーク",
    colors: [bodyColor, keytop.tanpopo, keytop.wasabi],
    make: ({ rowIndex, label }) => {
      const normalized = normalizeLabel(label);
      if (rowIndex === 1 && ["T", "Y", "U"].includes(normalized)) return keytop.wasabi;
      if (rowIndex === 2 && ["F", "G", "H", "J"].includes(normalized)) return keytop.wasabi;
      if (rowIndex === 2 && ["D", "K", "L"].includes(normalized)) return keytop.tanpopo;
      if (rowIndex === 3 && ["C", "V", "B", "N"].includes(normalized)) return keytop.tanpopo;
      return bodyColor;
    },
  },
  {
    name: "藤グラデーション",
    sub: "数字キーグラデーション",
    colors: [bodyColor, keytop.sakura, keytop.tanpopo, keytop.wasabi, keytop.fuji, keytop.sora],
    make: ({ label, columnIndex }) => {
      if (!isNumberKey(label)) return bodyColor;
      const gradient = [keytop.sakura, keytop.tanpopo, keytop.wasabi, keytop.fuji, keytop.sora];
      return gradient[columnIndex % gradient.length];
    },
  },
  {
    name: "Happy Hacking",
    sub: "好きな言葉を桜で",
    colors: [bodyColor, keytop.sakura],
    make: ({ label }) => isHappyHackingKey(label) ? keytop.sakura : bodyColor,
  },
  {
    name: "目印キー",
    sub: "数字 / Fn / 矢印を蒲公英に",
    colors: [bodyColor, keytop.tanpopo],
    make: ({ label, className }) => isMarkerKey(label, className) ? keytop.tanpopo : bodyColor,
  },
  {
    name: "ボーダー",
    sub: "山葵で視認性アップ",
    colors: [bodyColor, keytop.wasabi],
    make: ({ rowIndex }) => rowIndex === 1 || rowIndex === 3 ? keytop.wasabi : bodyColor,
  },
  {
    name: "縦グラデーション",
    sub: "カラーを縦方向に",
    colors: [bodyColor, keytop.sakura, keytop.tanpopo, keytop.wasabi, keytop.fuji, keytop.sora],
    make: ({ rowIndex, columnIndex }) => {
      const gradient = [keytop.sakura, keytop.tanpopo, keytop.wasabi, keytop.fuji, keytop.sora];
      return Math.abs(columnIndex - 7) <= 1 ? gradient[rowIndex] : bodyColor;
    },
  },
  {
    name: "ハート",
    sub: "空色のベスポジ",
    colors: [bodyColor, keytop.sora],
    make: ({ rowIndex, label }) => isJisHeartKey(rowIndex, label) ? keytop.sora : bodyColor,
  },
  {
    name: "Esc / Control",
    sub: "空と藤のアクセント",
    colors: [bodyColor, keytop.sora, keytop.fuji],
    make: ({ label }) => {
      const normalized = normalizeLabel(label);
      if (normalized === "Esc") return keytop.sora;
      if (normalized === "Control") return keytop.fuji;
      return bodyColor;
    },
  },
];

export const presetsByLayout: Record<LayoutName, Preset[]> = {
  us: usPresets,
  jis: jisPresets,
};
