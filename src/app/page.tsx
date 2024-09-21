import { getFrameMetadata } from "@/lib/frame";
import { getStartingFrame } from "@/screens/Hangman/frames/Starting";
import { Hangman } from "@/screens/Hangman/Hangman";

export async function generateMetadata() {
  const frame = getStartingFrame();
  return {
    other: getFrameMetadata(frame),
  };
}

export default function Home() {
  return <Hangman />;
}
