import {
  FARCASTER_HUBS_API_KEY,
  FARCASTER_HUBS_ENDPOINT,
} from "@/constants/config";
import JSURL from "jsurl";
import { Frame, FrameActionPayload, ValidatedFrameMessage } from "./types";

export async function getFrameMessage(body: FrameActionPayload) {
  if (!body) {
    throw new Error("No body found for validating frame message");
  }

  const response = await fetch(
    `${FARCASTER_HUBS_ENDPOINT}/v1/validateMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "x-api-key": FARCASTER_HUBS_API_KEY!,
      },
      body: Buffer.from(body.trustedData.messageBytes, "hex"),
    }
  );

  const data = await response.json();

  if (data?.valid) {
    return {
      isValid: true,
      message: data.message as ValidatedFrameMessage,
    };
  } else {
    return {
      isValid: false,
      message: undefined,
    };
  }
}

export function getFrameMetadata(frame: Frame) {
  const metadata: Record<string, string> = {
    "og:image": frame.ogImage || frame.image,
    "fc:frame": frame.version,
    "fc:frame:image": frame.image,
    "fc:frame:post_url": frame.postUrl,
  };

  if (frame.imageAspectRatio) {
    metadata[`fc:frame:image:aspect_ratio`] = frame.imageAspectRatio;
  }

  if (frame.inputText) {
    metadata[`fc:frame:input:text`] = frame.inputText;
  }

  if (frame.state) {
    metadata[`fc:frame:state`] =
      typeof frame.state === "object"
        ? getEncodedFrameState(frame.state)
        : frame.state;
  }

  frame.buttons?.forEach((button, index) => {
    metadata[`fc:frame:button:${index + 1}`] = button.label;
    metadata[`fc:frame:button:${index + 1}:action`] = button.action;
    if ("target" in button) {
      metadata[`fc:frame:button:${index + 1}:target`] = button.target || "";
    }
    if ("post_url" in button) {
      metadata[`fc:frame:button:${index + 1}:post_url`] = button.post_url || "";
    }
  });

  frame.accepts?.forEach((accept) => {
    metadata[`of:accepts:${accept.id}`] = accept.version;
  });

  return metadata;
}

export function getFrameHtml(
  frame: Frame,
  options: {
    ogTitle?: string;
    title?: string;
    htmlBody?: string;
    htmlHead?: string;
  } = {}
) {
  const html = `<!DOCTYPE html>
    <html>
      <head>
        <title>${options.title ?? "Airstack Frame"}</title>
        ${
          options.ogTitle
            ? `<meta property="og:title" content="${options.ogTitle}"/>`
            : ""
        }
        ${getFrameHtmlHead(frame)}
        ${options.htmlHead || ""}
      </head>
      <body>
        ${options.htmlBody || ""}
      </body>
    </html>`;

  return html;
}

export function getFrameHtmlHead(frame: Frame) {
  const metadata = getFrameMetadata(frame);

  const tags = Object.entries(metadata)
    .map(([key, value]) => {
      return value ? `<meta name="${key}" content="${value}"/>` : null;
    })
    .filter(Boolean) as string[];

  return tags.join("");
}

export function getHTMLResponse(html: string | undefined) {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST",
    },
    status: 200,
  });
}

export function getImageResponse(image: Buffer, maxAge = 604800) {
  return new Response(image, {
    status: 200,
    headers: {
      "content-type": "image/jpeg",
      "cache-control": `public, immutable, no-transform, max-age=${maxAge}`,
    },
  });
}

export function getFrameResponse(frame: Frame) {
  const html = getFrameHtml(frame);
  return getHTMLResponse(html);
}

export function getEncodedFrameState(stateObj?: object) {
  if (!stateObj || Object.keys(stateObj).length === 0) return "";
  return JSURL.stringify(stateObj);
}

export function getDecodedFrameState(stateStr?: string) {
  if (!stateStr) return {};
  return JSURL.tryParse(stateStr, {});
}
