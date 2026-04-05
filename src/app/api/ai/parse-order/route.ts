import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback or mock if no API key is provided during dev
      // It's better to show an error so the user knows they need an API key
      console.warn("GEMINI_API_KEY is not set. Using fallback logic.");
      return NextResponse.json({
        packageType: "basic_web",
        details: prompt + "\n\n(Catatan: Ini adalah hasil fallback karena GEMINI_API_KEY belum dikonfigurasi).",
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemPrompt = `
      Kamu adalah AI asisten dari Monark Studio. Tugasmu adalah menganalisis pesan pengguna yang awam mengenai kebutuhan digital mereka (seperti membuat website, aplikasi, atau CMS).
      
      Pilih SATU dari 3 paket berikut yang paling cocok dengan kebutuhan mereka:
      1. "basic_web": Untuk website sederhana, landing page, profile perusahaan yang hanya butuh informasi statis.
      2. "web_app_cms": Untuk website yang butuh sistem manajemen konten (CMS), e-commerce sederhana, atau aplikasi web interaktif.
      3. "mobile_app": Untuk aplikasi mobile (Android/iOS) atau sistem yang sangat kompleks.

      Balas hanya dengan JSON berstruktur:
      {
        "packageType": "basic_web" | "web_app_cms" | "mobile_app",
        "details": "Ringkasan profesional dari kebutuhan pengguna (3-5 kalimat)."
      }
      
      Pesan pengguna:
      "${prompt}"
    `;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text().trim();
    
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      // Fallback regex extraction if parsing completely fails despite mimeType
      const match = text.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error("Format respons AI tidak valid.");
    }

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("AI Parse Error:", error);
    return NextResponse.json(
      { error: "Failed to parse requirements", details: error.message },
      { status: 500 }
    );
  }
}
