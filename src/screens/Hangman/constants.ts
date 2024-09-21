import { BASE_URL } from "@/constants/config";

export const FRAME_ENDPOINT = `${BASE_URL}/frame`;

export const FRAMES = {
  STARTING: "1",
  GUESSING: "2",
} as const;

const FRAME_FOLDER_PATH = `${BASE_URL}/images`;

export const FRAME_IMAGE_URLS = {
  STARTING: `${FRAME_FOLDER_PATH}/starting.png`,
  GUESSING_BG: `${FRAME_FOLDER_PATH}/guessing-bg.png`,
};
