import { describe, expect, it } from "vitest";

import { layouts } from "./catalog";
import { deserializeDesignParam, serializeDesignParam } from "./design-codec";
import {
  accessibleLegend,
  keyClassName,
  keyContextsForLayout,
} from "./keyboard-renderer";
import { parseUploadedPreset, serializePresetFile } from "./preset-file";
import {
  defaultProductForSeries,
  isLayoutName,
  isProductId,
  productsForSeries,
} from "./product-helpers";
import { productAppearances } from "./products";
import {
  bodyColor,
  type ColorDefinition,
  type ProductAppearance,
} from "./types";

function base64UrlJson(value: unknown): string {
  return btoa(JSON.stringify(value))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function colorsForLayout(layout: keyof typeof layouts): string[] {
  return layouts[layout].rows.flatMap((row, rowIndex) =>
    row.map((_, columnIndex) =>
      (rowIndex + columnIndex) % 2 === 0 ? "#f1c6c9" : "#3b3b38",
    ),
  );
}

function fixedPresetRows(
  layout: keyof typeof layouts,
  color: ColorDefinition = "#f1c6c9",
) {
  return layouts[layout].rows.map((row) => ({
    keys: row.map(([legend]) => accessibleLegend(legend)),
    colors: row.map(() => color),
  }));
}

describe("design URL codec", () => {
  it("keeps the reported JIS share URL compatible with the physical layout", () => {
    const reportedDesign =
      "eyJ2IjoxLCJsIjoiaiIsIm0iOiI5IiwiZCI6WyJfX2JvZHlfY29sb3JfXyJdLCJpIjoiQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUEifQ";
    const decoded = deserializeDesignParam(reportedDesign);

    expect(decoded).not.toBeNull();
    expect(Array.isArray(decoded)).toBe(false);
    if (!decoded || Array.isArray(decoded)) return;

    expect(decoded.layout).toBe("jis");
    expect(decoded.product).toBe("classic-white");
    expect(decoded.colors).toHaveLength(73);
    expect(layouts.jis.rows.flat()).toHaveLength(73);
  });

  it("round-trips the compact share format without losing layout, product, or key colors", () => {
    const colors = colorsForLayout("jis");
    const encoded = serializeDesignParam(colors, "jis", "classic-type-s-snow");

    expect(deserializeDesignParam(encoded)).toEqual({
      layout: "jis",
      product: "classic-type-s-snow",
      colors,
    });
  });

  it("keeps compatibility with legacy shared JSON payloads", () => {
    const legacyColors = colorsForLayout("us");
    const legacyState = {
      layout: "us",
      product: "hybrid-white",
      colors: legacyColors,
    };

    expect(deserializeDesignParam(base64UrlJson(legacyState))).toEqual(
      legacyState,
    );
    expect(deserializeDesignParam(base64UrlJson(legacyColors))).toEqual(
      legacyColors,
    );
  });
});

describe("preset file format", () => {
  it("serializes the current design with stable layout metadata and row labels", () => {
    const product = productAppearances.find(
      (appearance) => appearance.id === "hybrid-type-s-white",
    ) as ProductAppearance;
    const colors = colorsForLayout("us");
    const preset = JSON.parse(
      serializePresetFile("My Layout", "us", product, colors),
    ) as {
      name: string;
      sub: string;
      layout: string;
      rows: Array<{ keys: string[]; colors: string[] }>;
    };

    expect(preset.name).toBe("My Layout");
    expect(preset.sub).toBe("英語配列 / HYBRID Type-S 白");
    expect(preset.layout).toBe("us");
    expect(preset.rows).toHaveLength(layouts.us.rows.length);
    expect(preset.rows[0].keys.slice(0, 3)).toEqual([
      "Esc Power",
      "1 ! F1",
      "2 @ F2",
    ]);
    expect(preset.rows.flatMap((row) => row.colors)).toEqual(colors);
  });

  it("accepts fixed presets that match the declared layout shape", () => {
    const preset = parseUploadedPreset({
      name: "  ",
      layout: "jis",
      rows: fixedPresetRows("jis", bodyColor),
    });

    expect(preset?.name).toBe("アップロードした配色");
    expect(preset?.sub).toBe("アップロードしたプリセット");
    expect(preset?.rows.flatMap((row) => row.colors)).toHaveLength(
      layouts.jis.rows.flat().length,
    );
    expect(preset?.rows[0].colors[0]).toBe(bodyColor);
  });

  it("rejects uploaded presets with unknown layouts, wrong row sizes, or invalid colors", () => {
    expect(
      parseUploadedPreset({
        name: "Bad layout",
        layout: "uk",
        rows: fixedPresetRows("us"),
      }),
    ).toBeNull();
    expect(
      parseUploadedPreset({
        name: "Missing row",
        layout: "us",
        rows: fixedPresetRows("us").slice(1),
      }),
    ).toBeNull();

    const invalidColorRows = fixedPresetRows("us");
    invalidColorRows[0] = {
      ...invalidColorRows[0],
      colors: ["red", ...invalidColorRows[0].colors.slice(1)],
    };
    expect(
      parseUploadedPreset({
        name: "Bad color",
        layout: "us",
        rows: invalidColorRows,
      }),
    ).toBeNull();
  });
});

describe("catalog helper boundaries", () => {
  it("uses catalog-backed guards for layouts and products", () => {
    expect(isLayoutName("us")).toBe(true);
    expect(isLayoutName("jis")).toBe(true);
    expect(isLayoutName("uk")).toBe(false);
    expect(isProductId("studio-snow")).toBe(true);
    expect(isProductId("studio-white")).toBe(false);
  });

  it("chooses the white product as a series default when one exists, otherwise falls back within the same series", () => {
    expect(defaultProductForSeries("HYBRID Type-S")?.id).toBe(
      "hybrid-type-s-white",
    );
    expect(defaultProductForSeries("Studio")?.series).toBe("Studio");
  });

  it("keeps body color choices ordered for scanning in the UI", () => {
    expect(
      productsForSeries("HYBRID Type-S").map((product) => product.colorName),
    ).toEqual(["白", "墨", "雪"]);
    expect(
      productsForSeries("Studio").map((product) => product.colorName),
    ).toEqual(["墨", "雪"]);
  });
});

describe("keyboard context helpers", () => {
  it("only collapses spacers whose declared width is exactly zero", () => {
    expect(keyClassName(0, "spacer")).toContain("key-zero-width");
    expect(keyClassName(0.25, "spacer")).not.toContain("key-zero-width");
  });

  it("matches the catalog shape and keeps accessible labels in row-major order", () => {
    const contexts = keyContextsForLayout("us");

    expect(contexts).toHaveLength(layouts.us.rows.flat().length);
    expect(contexts.slice(0, 3).map((context) => context.label)).toEqual([
      "Esc Power",
      "1 ! F1",
      "2 @ F2",
    ]);
    expect(contexts[0]).toMatchObject({
      index: 0,
      rowIndex: 0,
      columnIndex: 0,
    });
  });
});
