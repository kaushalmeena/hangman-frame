import { FrameImage } from "@/components/FrameImage";

export function Hangman() {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#061523]">
      <div className="absolute top-[-260px] h-[308px] w-[95%] bg-[#ABD7D8] opacity-50 blur-[250px]" />
      <FrameImage />
    </div>
  );
}
