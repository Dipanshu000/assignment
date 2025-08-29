import { NextResponse } from "next/server";
import { generateAnswer } from "@/lib/qa";
import { saveExchange } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body?.question?.trim();

    if (!question) {
      return NextResponse.json({ error: "No question provided" }, { status: 400 });
    }

    const answer = await generateAnswer(question);
    
    await saveExchange(question, answer);

    return NextResponse.json({ answer });
  } catch (e: any) {
    console.error("API route error:", e.message || e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}