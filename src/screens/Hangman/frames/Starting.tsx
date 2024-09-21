import { Frame } from "@/lib/frame";
import { FRAME_ENDPOINT, FRAME_IMAGE_URLS } from "../constants";

export const getStartingFrame = ({
  postUrl = FRAME_ENDPOINT,
  state,
}: {
  postUrl?: string;
  state?: string | object;
} = {}) => {
  const frame: Frame = {
    version: "vNext",
    image: FRAME_IMAGE_URLS.STARTING,
    imageAspectRatio: "1.91:1",
    buttons: [
      {
        label: "Play",
        action: "post",
      },
    ],
    state,
    postUrl,
  };

  return frame;
};
