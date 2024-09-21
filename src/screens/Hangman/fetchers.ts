import { getRandomInteger } from "@/utils/numberUtils";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const TOTAL_WORD_COUNT = 1022;

const WORDS_FILE_PATH = "./src/assets/words.txt";

export const fetchRandomWord = async () => {
  const wordIndex = getRandomInteger(0, TOTAL_WORD_COUNT - 1);

  const fs = createReadStream(WORDS_FILE_PATH);

  const rl = createInterface({
    input: fs,
    crlfDelay: Infinity,
  });

  let currIndex = 0;

  for await (const word of rl) {
    if (currIndex === wordIndex) {
      rl.close();
      fs.close();
      return word;
    }
    currIndex += 1;
  }

  rl.close();
  fs.close();

  return "";
};
