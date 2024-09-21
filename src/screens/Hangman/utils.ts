import { FRAME_STATE_ENCRYPTION_KEY } from "@/constants/config";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { fetchRandomWord } from "./fetchers";
import { GameState, GameStatus } from "./types";

export const decodeGameState = (encodedState?: string) => {
  if (!encodedState) return "";

  try {
    const [iv, text] = encodedState.split(":");

    const initialVector = Buffer.from(iv, "hex");
    const encryptedBuffer = Buffer.from(text, "hex");

    const decipher = createDecipheriv(
      "aes-256-cbc",
      Buffer.from(FRAME_STATE_ENCRYPTION_KEY!),
      initialVector
    );

    const decrypted = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final(),
    ]);

    return decrypted.toString();
  } catch (err) {
    console.log("[ERROR] [decodeGameState]", err);
    return "";
  }
};

const INITIAL_VECTOR_LENGTH = 16;

export const encodeGameState = (decodedState?: string | null) => {
  if (!decodedState) return "";

  try {
    const initialVector = randomBytes(INITIAL_VECTOR_LENGTH);
    const decodedBuffer = Buffer.from(decodedState);

    const encipher = createCipheriv(
      "aes-256-cbc",
      Buffer.from(FRAME_STATE_ENCRYPTION_KEY!),
      initialVector
    );

    const encrypted = Buffer.concat([
      encipher.update(decodedBuffer),
      encipher.final(),
    ]);

    return initialVector.toString("hex") + ":" + encrypted.toString("hex");
  } catch (err) {
    console.log("[ERROR] [encodeGameState]", err);
    return "";
  }
};

export const getNextGameState = async (
  currState?: string | null,
  input?: string
): Promise<GameState> => {
  if (!currState) {
    const word = await fetchRandomWord();
    return {
      nextGameState: `${word}||`,
      word,
      rightGuesses: "",
      wrongGuesses: "",
      status: "GAME_CONTINUE",
    };
  }

  const [word, rightGuesses, wrongGuesses] = currState.split("|");

  if (!input) {
    return {
      nextGameState: currState,
      word,
      rightGuesses,
      wrongGuesses,
      status: "GAME_CONTINUE",
    };
  }

  const inputLetter = input[0].toLowerCase();

  let _rightGuesses = rightGuesses || "";
  let _wrongGuesses = wrongGuesses || "";
  let _status: GameStatus = "GAME_CONTINUE";

  const correctLetters = word.split("");

  const isGuessCorrect = correctLetters.indexOf(inputLetter) > -1;

  if (isGuessCorrect) {
    _rightGuesses += inputLetter;
    if (correctLetters.every((v) => _rightGuesses.indexOf(v) > -1)) {
      _status = "GAME_WON";
    } else {
      _status = "RIGHT_GUESS";
    }
  } else {
    _wrongGuesses += inputLetter;
    if (_wrongGuesses.length === 6) {
      _status = "GAME_LOST";
    } else {
      _status = "WRONG_GUESS";
    }
  }

  return {
    nextGameState:
      _status === "GAME_WON" || _status === "GAME_LOST"
        ? ""
        : `${word}|${_rightGuesses}|${_wrongGuesses}`,
    word,
    rightGuesses: _rightGuesses,
    wrongGuesses: _wrongGuesses,
    status: _status,
  };
};
