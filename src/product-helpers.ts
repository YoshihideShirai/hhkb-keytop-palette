import { layouts } from "./catalog";
import { productAppearances } from "./products";
import type {
  LayoutName,
  ProductAppearance,
  ProductId,
  ProductSeries,
} from "./types";

const bodyColorOrder = ["白", "墨", "雪"];

export function isLayoutName(value: unknown): value is LayoutName {
  return typeof value === "string" && value in layouts;
}

export function isProductId(value: unknown): value is ProductId {
  return (
    typeof value === "string" &&
    productAppearances.some((product) => product.id === value)
  );
}

export function productsForSeries(series: ProductSeries): ProductAppearance[] {
  return productAppearances
    .filter((product) => product.series === series)
    .sort(
      (a, b) =>
        bodyColorOrder.indexOf(a.colorName) -
        bodyColorOrder.indexOf(b.colorName),
    );
}

export function defaultProductForSeries(
  series: ProductSeries,
): ProductAppearance | undefined {
  return (
    productAppearances.find(
      (product) => product.series === series && product.colorName === "白",
    ) ?? productAppearances.find((product) => product.series === series)
  );
}
