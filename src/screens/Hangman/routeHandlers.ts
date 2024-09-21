import {
  getDecodedFrameState,
  getFrameMessage,
  getFrameResponse,
} from "@/lib/frame";
import { NextRequest, NextResponse } from "next/server";
import { FRAME_ENDPOINT, FRAMES } from "./constants";
import { getGuessingFrame, getGuessingFrameImage } from "./frames/Guessing";
import { getStartingFrame } from "./frames/Starting";
import { DecodedFrameState } from "./types";
import { decodeGameState, encodeGameState, getNextGameState } from "./utils";
import { isAlphabetic } from "@/utils/stringUtils";

export const handleFrameRequest = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const body = await req.json();

  const { isValid, message } = await getFrameMessage(body);
  if (!isValid || !message) {
    return new Response("Invalid request", { status: 400 });
  }

  const framePage = searchParams.get("f") || FRAMES.GUESSING;
  const frameReferrer = searchParams.get("r") || "";

  const farcasterState = message.data.frameActionBody.state || "";
  const farcasterInputText = message.data.frameActionBody.inputText || "";

  const inputText = farcasterInputText
    ? Buffer.from(farcasterInputText, "base64").toString()
    : "";

  const state = farcasterState
    ? Buffer.from(farcasterState, "base64").toString()
    : "";

  const baseSearchParams = new URLSearchParams({
    r: frameReferrer,
  });

  const framePostUrl = `${FRAME_ENDPOINT}?${baseSearchParams}`;
  let frameState: DecodedFrameState = getDecodedFrameState(state);

  if (framePage === FRAMES.STARTING) {
    const frame = getStartingFrame({
      postUrl: framePostUrl,
      state: frameState,
    });
    return getFrameResponse(frame);
  }

  if (framePage === FRAMES.GUESSING) {
    if (inputText && !isAlphabetic(inputText)) {
      return NextResponse.json(
        { message: "Please enter valid alphabet" },
        { status: 400 }
      );
    }
    const currGameState = decodeGameState(frameState.gameState);

    const { nextGameState, word, rightGuesses, wrongGuesses, status } =
      await getNextGameState(currGameState, inputText);

    const encodedState = encodeGameState(nextGameState);

    frameState = { ...frameState, gameState: encodedState };

    const image = await getGuessingFrameImage({
      word,
      rightGuesses,
      wrongGuesses,
      status,
    });
    const frame = getGuessingFrame({
      image,
      postUrl: framePostUrl,
      state: frameState,
      status,
    });
    return getFrameResponse(frame);
  }

  return new Response("Invalid request", { status: 400 });
};
