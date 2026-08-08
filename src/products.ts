import type { ProductAppearance, ProductSeries } from "./types";

export const productAppearances: ProductAppearance[] = [
  { id: "hybrid-type-s-sumi", series: "HYBRID Type-S", colorName: "墨", colorValue: "#2d2d2a", keyColor: "#383835", legendColor: "#171715", legendVariant: "standard-corner", legendContrast: "low", caseStyle: "hybrid", detail: "無線/有線・Type-S" },
  { id: "hybrid-type-s-white", series: "HYBRID Type-S", colorName: "白", colorValue: "#c7c1b6", keyColor: "#ddd8cf", legendColor: "#4a453e", legendVariant: "standard-corner", legendContrast: "standard", caseStyle: "hybrid", detail: "無線/有線・Type-S" },
  { id: "hybrid-type-s-snow", series: "HYBRID Type-S", colorName: "雪", colorValue: "#f3f2ed", keyColor: "#f7f6f1", legendColor: "#65645f", legendVariant: "snow-center", legendContrast: "standard", caseStyle: "hybrid", detail: "無線/有線・Type-S" },
  { id: "hybrid-sumi", series: "HYBRID", colorName: "墨", colorValue: "#2d2d2a", keyColor: "#383835", legendColor: "#171715", legendVariant: "standard-corner", legendContrast: "low", caseStyle: "hybrid", detail: "無線/有線" },
  { id: "hybrid-white", series: "HYBRID", colorName: "白", colorValue: "#c7c1b6", keyColor: "#ddd8cf", legendColor: "#4a453e", legendVariant: "standard-corner", legendContrast: "standard", caseStyle: "hybrid", detail: "無線/有線" },
  { id: "classic-type-s-sumi", series: "Classic Type-S", colorName: "墨", colorValue: "#2d2d2a", keyColor: "#383835", legendColor: "#171715", legendVariant: "standard-corner", legendContrast: "low", caseStyle: "classic", detail: "有線・Type-S" },
  { id: "classic-type-s-white", series: "Classic Type-S", colorName: "白", colorValue: "#c7c1b6", keyColor: "#ddd8cf", legendColor: "#4a453e", legendVariant: "standard-corner", legendContrast: "standard", caseStyle: "classic", detail: "有線・Type-S" },
  { id: "classic-type-s-snow", series: "Classic Type-S", colorName: "雪", colorValue: "#f3f2ed", keyColor: "#f7f6f1", legendColor: "#65645f", legendVariant: "snow-center", legendContrast: "standard", caseStyle: "classic", detail: "有線・Type-S" },
  { id: "classic-sumi", series: "Classic", colorName: "墨", colorValue: "#2d2d2a", keyColor: "#383835", legendColor: "#171715", legendVariant: "standard-corner", legendContrast: "low", caseStyle: "classic", detail: "有線" },
  { id: "classic-white", series: "Classic", colorName: "白", colorValue: "#c7c1b6", keyColor: "#ddd8cf", legendColor: "#4a453e", legendVariant: "standard-corner", legendContrast: "standard", caseStyle: "classic", detail: "有線" },
  { id: "studio-sumi", series: "Studio", colorName: "墨", colorValue: "#292927", keyColor: "#343431", legendColor: "#151513", legendVariant: "studio-center", legendContrast: "low", caseStyle: "studio", detail: "ポインティング搭載" },
  { id: "studio-snow", series: "Studio", colorName: "雪", colorValue: "#f1f0eb", keyColor: "#f6f5f0", legendColor: "#63625d", legendVariant: "studio-center", legendContrast: "standard", caseStyle: "studio", detail: "ポインティング搭載" },
];

export const productSeries: ProductSeries[] = ["HYBRID Type-S", "HYBRID", "Classic Type-S", "Classic", "Studio"];
