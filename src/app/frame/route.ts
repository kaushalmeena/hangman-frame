import { handleFrameRequest } from "@/screens/Hangman/routeHandlers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return handleFrameRequest(req);
}
