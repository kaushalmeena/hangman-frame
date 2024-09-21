import { playpenSans400FontData, playpenSans500FontData } from "@/assets/fonts";
import { Frame } from "@/lib/frame";
import { getBase64FrameImage } from "@/lib/image";
import { SVGProps } from "react";
import { FRAME_IMAGE_URLS, FRAMES } from "../constants";
import { GameStatus } from "../types";

function HangmanDrawing({
  wrongCount = 6,
  lineColor = "black",
  ...restProps
}: SVGProps<SVGSVGElement> & { wrongCount?: number; lineColor?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 298.232 291"
      fill={lineColor}
      {...restProps}
    >
      <path d="M48 0h5v289h-5Z" />
      <path d="m91.627.247 3.535 3.535-43.651 43.652-3.536-3.535zM298.233 286.001v5H.001v-5Z" />
      <path d="M48 0h187v5H48Z" />
      <path d="M230 1h5v49h-5Z" />
      {wrongCount > 0 && (
        <circle
          name="head"
          cx={27.5}
          cy={27.5}
          r={25}
          fill="none"
          stroke={lineColor}
          strokeWidth={5}
          transform="translate(204.5 45.247)"
        />
      )}
      {wrongCount > 1 && <path name="torso" d="M230 98h5v73h-5Z" />}
      {wrongCount > 2 && (
        <path
          name="left-hand"
          d="m229.965 98.247 3.536 3.536-39.598 39.598-3.536-3.536Z"
        />
      )}
      {wrongCount > 3 && (
        <path
          name="right-hand"
          d="m231.5 101.781 3.535-3.535 39.598 39.598-3.536 3.535Z"
        />
      )}
      {wrongCount > 4 && (
        <path
          name="left-leg"
          d="m231.965 165.247 3.535 3.535-39.597 39.598-3.536-3.535Z"
        />
      )}
      {wrongCount > 5 && (
        <path
          name="right-leg"
          d="m234.803 167.015 36.063 36.063a2.5 2.5 0 0 1-3.536 3.535l-36.062-36.062c-.977-.977 2.559-4.512 3.535-3.536Z"
        />
      )}
    </svg>
  );
}

function HangmanLetter({
  letter,
  status,
  guessed,
}: {
  letter: string;
  status: GameStatus;
  guessed: boolean;
}) {
  if (status === "GAME_LOST") {
    return (
      <span key={letter} style={{ color: guessed ? "#229954bf" : "#cb4335bf" }}>
        {letter}
      </span>
    );
  }
  if (status === "GAME_WON") {
    return (
      <span key={letter} style={{ color: "#229954bf" }}>
        {letter}
      </span>
    );
  }
  return (
    <span key={letter} style={{ color: "#cb4335bf" }}>
      {guessed ? letter : "_"}
    </span>
  );
}

const getHeadingText = (status: GameStatus) => {
  if (status === "GAME_LOST") {
    return "~YOU LOST~";
  }
  if (status === "GAME_WON") {
    return "~YOU WON~";
  }
  if (status === "RIGHT_GUESS") {
    return "~RIGHT GUESS~";
  }
  if (status === "WRONG_GUESS") {
    return "~WRONG GUESS~";
  }
  return "~KEEP GUESSING~";
};

const getAlphabetColor = ({
  isRightGuess,
  isWrongGuess,
}: {
  isRightGuess: boolean;
  isWrongGuess: boolean;
}) => {
  if (isRightGuess) {
    return "#2299544d";
  }
  if (isWrongGuess) {
    return "#cb43354d";
  }
  return "#000000bf";
};

const ALPHABETS = "abcdefghijklmnopqrstuvwxyz".split("");

export const getGuessingFrameImage = async ({
  word,
  rightGuesses,
  wrongGuesses,
  status,
}: {
  word: string;
  rightGuesses: string;
  wrongGuesses: string;
  status: GameStatus;
}) => {
  const rightGuessSet = new Set(rightGuesses.split(""));
  const wrongGuessSet = new Set(wrongGuesses.split(""));

  const letters = word.split("");

  const headingText = getHeadingText(status);

  const component = (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${FRAME_IMAGE_URLS.GUESSING_BG})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        color: "#000000bf",
      }}
    >
      <div style={{ display: "flex", height: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 375,
            height: "100%",
          }}
        >
          <HangmanDrawing
            lineColor="#000000bf"
            wrongCount={wrongGuesses.length}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0px 20px",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              marginTop: 36,
              fontSize: 36,
            }}
          >
            {headingText}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 5,
              marginTop: 90,
              height: 115,
              fontSize: 45,
              fontFamily: "PlaypenSans 500",
              lineHeight: "42px",
              textTransform: "uppercase",
            }}
          >
            {letters.map((letter) => (
              <HangmanLetter
                key={letter}
                letter={letter}
                status={status}
                guessed={rightGuessSet.has(letter)}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 70,
              fontSize: 42,
              lineHeight: "40px",
              textTransform: "uppercase",
            }}
          >
            {ALPHABETS.map((alphabet) => (
              <span
                key={alphabet}
                style={{
                  color: getAlphabetColor({
                    isRightGuess: rightGuessSet.has(alphabet),
                    isWrongGuess: wrongGuessSet.has(alphabet),
                  }),
                }}
              >
                {alphabet}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return getBase64FrameImage(component, {
    width: 955,
    height: 500,
    fonts: [
      {
        name: "PlaypenSans 400",
        data: playpenSans400FontData,
        weight: 400,
        style: "normal",
      },
      {
        name: "PlaypenSans 500",
        data: playpenSans500FontData,
        weight: 500,
        style: "normal",
      },
    ],
  });
};

export const getGuessingFrame = ({
  image,
  postUrl,
  state,
  status,
}: {
  image: string;
  postUrl: string;
  state?: string | object;
  status: GameStatus;
}) => {
  const frame: Frame = {
    version: "vNext",
    ogImage: FRAME_IMAGE_URLS.STARTING,
    image,
    imageAspectRatio: "1.91:1",
    inputText: "Enter alphabet",
    buttons: [
      {
        label:
          status === "GAME_LOST" || status === "GAME_WON"
            ? "Play Again"
            : "Submit",
        action: "post",
        target: `${postUrl}&f=${FRAMES.GUESSING}`,
      },
    ],
    state,
    postUrl,
  };

  return frame;
};
