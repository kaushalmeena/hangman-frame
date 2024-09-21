import { Resvg } from "@resvg/resvg-js";
import { ReactElement } from "react";
import type { SatoriOptions } from "satori";
import satori from "satori";
import sharp from "sharp";

// Limit sharp caching items
sharp.cache({ items: 10 });

// Controls frame image quality -> directly proportional to frame image size
const OUTPUT_FRAME_WIDTH = 900;
const OUTPUT_FRAME_QUALITY = 80;

export async function getFrameImageBuffer(
  element: ReactElement,
  satoriOptions: SatoriOptions,
  outputOptions?: {
    width?: number;
    quality?: number;
  }
) {
  const svg = await satori(element, satoriOptions);

  const renderer = new Resvg(svg, {
    fitTo: { mode: "width", value: outputOptions?.width || OUTPUT_FRAME_WIDTH },
  });
  const pngBuffer = renderer.render().asPng();

  return sharp(pngBuffer)
    .jpeg({ quality: outputOptions?.quality || OUTPUT_FRAME_QUALITY })
    .toBuffer();
}

export async function getBase64FrameImage(
  element: ReactElement,
  satoriOptions: SatoriOptions,
  outputOptions?: {
    width?: number;
    quality?: number;
  }
) {
  const jpegBuffer = await getFrameImageBuffer(
    element,
    satoriOptions,
    outputOptions
  );

  const jpegBase64 = jpegBuffer.toString("base64");

  return `data:image/jpeg;base64,${jpegBase64}`;
}
