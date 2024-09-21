"use client";
import { cn } from "@/utils/tailwindUtils";
import { useEffect, useState } from "react";

export function FrameImage() {
  const [imageUrl, setImageUrl] = useState("");
  const [aspectRatio, setAspectRatio] = useState("");
  const [frameUrl, setFrameUrl] = useState("");

  useEffect(() => {
    const frameImageUrl =
      document
        .querySelector("meta[name='fc:frame:image']")
        ?.getAttribute("content") || "";
    const frameAspectRatio =
      document
        .querySelector("meta[name='fc:frame:image:aspect_ratio']")
        ?.getAttribute("content") || "";

    setImageUrl(frameImageUrl);
    setAspectRatio(frameAspectRatio);
    setFrameUrl(typeof window === "undefined" ? "" : window.location.href);
  }, []);

  return (
    <div className="z-10 flex flex-col items-center px-4">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt="FrameImage"
          className={cn(
            "rounded-md border border-[#3D3041]",
            aspectRatio === "1.91:1" ? "max-h-[306px]" : "max-w-[500px]"
          )}
          src={imageUrl}
        />
      ) : (
        <svg
          className="size-20 animate-spin fill-white text-white/50"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      )}
      <a
        href={`https://warpcast.com/~/developers/frames?url=${encodeURIComponent(
          frameUrl
        )}`}
        className="mt-4 flex gap-1 rounded-full bg-white px-3 py-2 font-semibold text-black hover:bg-[#B4B9BD] disabled:opacity-30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path d="M 19.980469 2.9902344 A 1.0001 1.0001 0 0 0 19.869141 3 L 15 3 A 1.0001 1.0001 0 1 0 15 5 L 17.585938 5 L 8.2929688 14.292969 A 1.0001 1.0001 0 1 0 9.7070312 15.707031 L 19 6.4140625 L 19 9 A 1.0001 1.0001 0 1 0 21 9 L 21 4.1269531 A 1.0001 1.0001 0 0 0 19.980469 2.9902344 z M 5 3 C 3.9069372 3 3 3.9069372 3 5 L 3 19 C 3 20.093063 3.9069372 21 5 21 L 19 21 C 20.093063 21 21 20.093063 21 19 L 21 13 A 1.0001 1.0001 0 1 0 19 13 L 19 19 L 5 19 L 5 5 L 11 5 A 1.0001 1.0001 0 1 0 11 3 L 5 3 z" />
        </svg>
        Open in Warpcast Validator
      </a>
    </div>
  );
}
