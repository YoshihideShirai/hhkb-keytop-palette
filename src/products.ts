import type { ProductAppearance, ProductSeries } from "./types";

export const productAppearances: ProductAppearance[] = [
  { id: "hybrid-type-s-sumi", series: "HYBRID Type-S", colorName: "墨", colorValue: "#302f2c", keyColor: "#3b3b38", legendColor: "#151513", legendPlacement: "corner", caseStyle: "hybrid", detail: "無線/有線・Type-S" },
  { id: "hybrid-type-s-white", series: "HYBRID Type-S", colorName: "白", colorValue: "#d8d2c5", keyColor: "#e7e3d8", legendColor: "#565047", legendPlacement: "corner", caseStyle: "hybrid", detail: "無線/有線・Type-S" },
  { id: "hybrid-type-s-snow", series: "HYBRID Type-S", colorName: "雪", colorValue: "#f6f5ef", keyColor: "#f8f7f2", legendColor: "#6f6f68", legendPlacement: "center", caseStyle: "hybrid", detail: "無線/有線・Type-S" },
  { id: "hybrid-sumi", series: "HYBRID", colorName: "墨", colorValue: "#302f2c", keyColor: "#3b3b38", legendColor: "#151513", legendPlacement: "corner", caseStyle: "hybrid", detail: "無線/有線" },
  { id: "hybrid-white", series: "HYBRID", colorName: "白", colorValue: "#d8d2c5", keyColor: "#e7e3d8", legendColor: "#565047", legendPlacement: "corner", caseStyle: "hybrid", detail: "無線/有線" },
  { id: "classic-type-s-sumi", series: "Classic Type-S", colorName: "墨", colorValue: "#302f2c", keyColor: "#3b3b38", legendColor: "#151513", legendPlacement: "center", caseStyle: "classic", detail: "有線・Type-S" },
  { id: "classic-type-s-white", series: "Classic Type-S", colorName: "白", colorValue: "#d8d2c5", keyColor: "#e7e3d8", legendColor: "#565047", legendPlacement: "center", caseStyle: "classic", detail: "有線・Type-S" },
  { id: "classic-type-s-snow", series: "Classic Type-S", colorName: "雪", colorValue: "#f6f5ef", keyColor: "#f8f7f2", legendColor: "#6f6f68", legendPlacement: "center", caseStyle: "classic", detail: "有線・Type-S" },
  { id: "classic-sumi", series: "Classic", colorName: "墨", colorValue: "#302f2c", keyColor: "#3b3b38", legendColor: "#151513", legendPlacement: "corner", caseStyle: "classic", detail: "有線" },
  { id: "classic-white", series: "Classic", colorName: "白", colorValue: "#d8d2c5", keyColor: "#e7e3d8", legendColor: "#565047", legendPlacement: "corner", caseStyle: "classic", detail: "有線" },
  { id: "studio-sumi", series: "Studio", colorName: "墨", colorValue: "#2c2c29", keyColor: "#343431", legendColor: "#141412", legendPlacement: "center", caseStyle: "studio", detail: "ポインティング搭載" },
  { id: "studio-snow", series: "Studio", colorName: "雪", colorValue: "#f2f1eb", keyColor: "#f6f5f0", legendColor: "#6b6b64", legendPlacement: "center", caseStyle: "studio", detail: "ポインティング搭載" },
];

export const productSeries: ProductSeries[] = ["HYBRID Type-S", "HYBRID", "Classic Type-S", "Classic", "Studio"];
