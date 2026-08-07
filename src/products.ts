import type { ProductAppearance, ProductSeries } from "./types";

export const productAppearances: ProductAppearance[] = [
  { id: "hybrid-type-s-sumi", series: "HYBRID Type-S", colorName: "墨", colorValue: "#302f2c", keyColor: "#3b3b38", legendColor: "#151513", legendVariant: "standard-corner", legendContrast: "low", caseStyle: "hybrid", detail: "無線/有線・Type-S" },
  { id: "hybrid-type-s-white", series: "HYBRID Type-S", colorName: "白", colorValue: "#cac4b8", keyColor: "#ded9cf", legendColor: "#514c44", legendVariant: "standard-corner", legendContrast: "standard", caseStyle: "hybrid", detail: "無線/有線・Type-S" },
  { id: "hybrid-type-s-snow", series: "HYBRID Type-S", colorName: "雪", colorValue: "#f6f5ef", keyColor: "#f8f7f2", legendColor: "#6f6f68", legendVariant: "snow-center", legendContrast: "standard", caseStyle: "hybrid", detail: "無線/有線・Type-S" },
  { id: "hybrid-sumi", series: "HYBRID", colorName: "墨", colorValue: "#302f2c", keyColor: "#3b3b38", legendColor: "#151513", legendVariant: "standard-corner", legendContrast: "low", caseStyle: "hybrid", detail: "無線/有線" },
  { id: "hybrid-white", series: "HYBRID", colorName: "白", colorValue: "#cac4b8", keyColor: "#ded9cf", legendColor: "#514c44", legendVariant: "standard-corner", legendContrast: "standard", caseStyle: "hybrid", detail: "無線/有線" },
  { id: "classic-type-s-sumi", series: "Classic Type-S", colorName: "墨", colorValue: "#302f2c", keyColor: "#3b3b38", legendColor: "#151513", legendVariant: "standard-corner", legendContrast: "low", caseStyle: "classic", detail: "有線・Type-S" },
  { id: "classic-type-s-white", series: "Classic Type-S", colorName: "白", colorValue: "#cac4b8", keyColor: "#ded9cf", legendColor: "#514c44", legendVariant: "standard-corner", legendContrast: "standard", caseStyle: "classic", detail: "有線・Type-S" },
  { id: "classic-type-s-snow", series: "Classic Type-S", colorName: "雪", colorValue: "#f6f5ef", keyColor: "#f8f7f2", legendColor: "#6f6f68", legendVariant: "snow-center", legendContrast: "standard", caseStyle: "classic", detail: "有線・Type-S" },
  { id: "classic-sumi", series: "Classic", colorName: "墨", colorValue: "#302f2c", keyColor: "#3b3b38", legendColor: "#151513", legendVariant: "standard-corner", legendContrast: "low", caseStyle: "classic", detail: "有線" },
  { id: "classic-white", series: "Classic", colorName: "白", colorValue: "#cac4b8", keyColor: "#ded9cf", legendColor: "#514c44", legendVariant: "standard-corner", legendContrast: "standard", caseStyle: "classic", detail: "有線" },
  { id: "studio-sumi", series: "Studio", colorName: "墨", colorValue: "#2c2c29", keyColor: "#343431", legendColor: "#141412", legendVariant: "studio-center", legendContrast: "low", caseStyle: "studio", detail: "ポインティング搭載" },
  { id: "studio-snow", series: "Studio", colorName: "雪", colorValue: "#f2f1eb", keyColor: "#f6f5f0", legendColor: "#6b6b64", legendVariant: "studio-center", legendContrast: "standard", caseStyle: "studio", detail: "ポインティング搭載" },
];

export const productSeries: ProductSeries[] = ["HYBRID Type-S", "HYBRID", "Classic Type-S", "Classic", "Studio"];
