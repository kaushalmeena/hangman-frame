import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FONT_FOLDER = resolve("public", "fonts");

export const playpenSans400FontData = readFileSync(
  `${FONT_FOLDER}/PlaypenSans-400.ttf`
);

export const playpenSans500FontData = readFileSync(
  `${FONT_FOLDER}/PlaypenSans-500.ttf`
);
