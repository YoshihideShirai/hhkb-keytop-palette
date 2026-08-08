import { queryElement } from "./utils/dom";

export const elements = {
  keyboard: queryElement<HTMLDivElement>("#keyboard"),
  palette: queryElement<HTMLDivElement>("#palette"),
  modelSeries: queryElement<HTMLDivElement>("#modelSeries"),
  bodyColors: queryElement<HTMLDivElement>("#bodyColors"),
  presetsToggle: queryElement<HTMLButtonElement>("#presetsToggle"),
  presetContainer: queryElement<HTMLDivElement>("#presets"),
  selectedSwatch: queryElement<HTMLSpanElement>("#selectedSwatch"),
  selectionText: queryElement<HTMLSpanElement>("#selectionText"),
  customColor: queryElement<HTMLInputElement>("#customColor"),
  customColorValue: queryElement<HTMLOutputElement>("#customColorValue"),
  resetButton: queryElement<HTMLButtonElement>("#resetButton"),
  saveButton: queryElement<HTMLButtonElement>("#saveButton"),
  loadButton: queryElement<HTMLButtonElement>("#loadButton"),
  downloadPresetButton: queryElement<HTMLButtonElement>(
    "#downloadPresetButton",
  ),
  uploadPresetButton: queryElement<HTMLButtonElement>("#uploadPresetButton"),
  uploadPresetInput: queryElement<HTMLInputElement>("#uploadPresetInput"),
  xShareButton: queryElement<HTMLButtonElement>("#xShareButton"),
  shareButton: queryElement<HTMLButtonElement>("#shareButton"),
  menuButton: queryElement<HTMLButtonElement>("#menuButton"),
  headerMenu: queryElement<HTMLDivElement>("#headerMenu"),
  toastElement: queryElement<HTMLDivElement>("#toast"),
};
