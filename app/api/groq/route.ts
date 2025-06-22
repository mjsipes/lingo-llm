import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    console.log("hitting groq endpoint")
  const { systemPrompt, userPrompt, model = "llama-3.3-70b-versatile" } = await req.json();

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    model,
  });

  return NextResponse.json({
    content: completion.choices[0]?.message?.content || "",
  });
}