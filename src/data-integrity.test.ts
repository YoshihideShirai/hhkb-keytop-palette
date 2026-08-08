import { describe, expect, it } from "vitest";

import { layouts } from "./catalog";
import { presetsByLayout } from "./presets";
import { productAppearances, productSeries } from "./products";
import { type KeyContext, type LayoutName, legendVariants } from "./types";

function keyContexts(layoutName: LayoutName): KeyContext[] {
  let index = 0;
  return layouts[layoutName].rows.flatMap((row, rowIndex) =>
    row.map(([legend, , className = ""], columnIndex) => ({
      index: index++,
      rowIndex,
      columnIndex,
      rowLength: row.length,
      label:
        legend.accessibleLabel ??
        [
          legend.primary,
          legend.secondary,
          legend.front,
          legend.symbol,
          legend.icon,
        ]
          .filter(Boolean)
          .join(" "),
      className,
    })),
  );
}

describe("keyboard catalog", () => {
  it.each(Object.entries(layouts))(
    "defines valid keys for the %s layout",
    (_name, layout) => {
      expect(layout.rows).toHaveLength(5);
      expect(layout.rows.flat().length).toBeGreaterThan(0);

      layout.rows.flat().forEach(([, width]) => {
        expect(width).toBeGreaterThanOrEqual(0);
      });
    },
  );

  it.each(Object.entries(layouts))(
    "provides structured legends for every visible %s key",
    (_name, layout) => {
      layout.rows.flat().forEach(([legend, , className]) => {
        if (className === "spacer" || className === "space") return;
        expect(legend.primary || legend.symbol || legend.icon).toBeTruthy();
        expect(
          [
            legend.primary,
            legend.secondary,
            legend.front,
            legend.symbol,
            legend.icon,
          ]
            .filter(Boolean)
            .every((part) => !part?.includes("\n")),
        ).toBe(true);
      });
    },
  );

  it("matches the official US modifier placement", () => {
    const shiftRowLabels = layouts.us.rows[3].map(
      ([legend]) => legend.accessibleLabel ?? legend.primary,
    );
    const bottomRowLabels = layouts.us.rows[4].map(
      ([legend]) => legend.accessibleLabel ?? legend.primary,
    );
    const bottomRowWidths = layouts.us.rows[4].map(([, width]) => width);

    expect(shiftRowLabels).toEqual([
      "Shift",
      "Z",
      "X",
      "C",
      "V",
      "B",
      "N",
      "M",
      ",",
      ".",
      "/",
      "Shift",
      "Fn",
    ]);
    expect(bottomRowLabels).toEqual(["Alt", "◇", "スペース", "◇", "Alt"]);
    expect(bottomRowWidths).toEqual([1, 1.5, 6, 1.5, 1]);
  });

  it("matches the physical JIS bottom-row key positions and arrow cluster", () => {
    const bottomRow = layouts.jis.rows[4];
    const labels = bottomRow.map(
      ([legend]) => legend.accessibleLabel ?? legend.primary,
    );
    const startPositions = bottomRow.map((_, index) =>
      bottomRow.slice(0, index).reduce((total, [, width]) => total + width, 0),
    );

    expect(labels).toEqual([
      "Fn",
      "スペース",
      "半角/全角",
      "◇",
      "Alt",
      "無変換",
      "スペース",
      "変換",
      "かな",
      "Alt",
      "Fn",
      "←",
      "↓",
      "→",
    ]);
    expect(startPositions).toEqual([
      0, 1, 1.5, 2.5, 3.5, 4.5, 5.5, 8, 9, 10, 11, 12, 13, 14,
    ]);

    const upArrowPosition = layouts.jis.rows[3]
      .slice(0, -2)
      .reduce((total, [, width]) => total + width, 0);
    expect(upArrowPosition).toBe(startPositions[12]);
  });

  it("keeps row unit widths aligned to the HHKB key grid", () => {
    const rowWidths = (layoutName: LayoutName) =>
      layouts[layoutName].rows.map((row) =>
        row.reduce((total, [, width]) => total + width, 0),
      );

    expect(rowWidths("us")).toEqual([15, 15, 15, 15, 11]);
    expect(rowWidths("jis")).toEqual([15, 15, 13.75, 15, 15]);
  });
});

describe("product catalog", () => {
  it("uses unique product IDs and represents every series", () => {
    const productIds = productAppearances.map(({ id }) => id);
    expect(new Set(productIds).size).toBe(productIds.length);

    productSeries.forEach((series) => {
      expect(
        productAppearances.some((product) => product.series === series),
      ).toBe(true);
    });
  });

  it("assigns a supported model-specific legend variant to every product", () => {
    productAppearances.forEach(({ legendVariant }) => {
      expect(legendVariants).toContain(legendVariant);
    });
  });

  it("keeps traditional Classic Type-S colors corner-printed and Snow center-printed", () => {
    expect(
      productAppearances.find(({ id }) => id === "classic-type-s-sumi")
        ?.legendVariant,
    ).toBe("standard-corner");
    expect(
      productAppearances.find(({ id }) => id === "classic-type-s-white")
        ?.legendVariant,
    ).toBe("standard-corner");
    expect(
      productAppearances.find(({ id }) => id === "classic-type-s-snow")
        ?.legendVariant,
    ).toBe("snow-center");
  });
});

describe("presets", () => {
  it.each(Object.keys(layouts) as LayoutName[])(
    "only produces declared colors for the %s layout",
    (layoutName) => {
      const contexts = keyContexts(layoutName);

      presetsByLayout[layoutName].forEach((preset) => {
        expect(preset.colors.length).toBeGreaterThan(0);
        contexts.forEach((key) => {
          expect(preset.colors).toContain(preset.make(key));
        });
      });
    },
  );
});
