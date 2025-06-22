import OpenAI from "openai";
import { NextRequest } from "next/server";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  const { text, voice = "coral" } = await req.json();

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: voice,
    input: text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  
  return new Response(buffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": buffer.length.toString(),
    },
  });
}