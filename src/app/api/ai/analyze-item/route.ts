import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

export async function POST(req: Request) {
  try {
    const { description } = await req.json()

    if (!description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Ambil semua kategori yang tersedia di database agar AI tahu apa saja pilihannya
    const availablePrices = await prisma.complexityPrice.findMany({
      select: { level: true, sub_level: true }
    })

    // Format kategori untuk prompt
    const categories = availablePrices.map(p => `${p.level}-${p.sub_level}`).join(", ")

    const prompt = `
      Anda adalah asisten ahli estimasi proyek software. 
      Tugas Anda adalah menganalisis deskripsi fitur berikut dan menentukan tingkat kesulitannya.

      PILIHAN KATEGORI YANG TERSEDIA DI DATABASE KAMI (Level-SubLevel):
      ${categories}

      Deskripsi Fitur: "${description}"

      Harap hanya memilih salah satu dari kombinasi Level dan SubLevel yang tersedia di atas.
      Kembalikan hanya dalam format JSON murni:
      {
        "level": "LEVEL_NAME",
        "sub_level": "SUB_LEVEL_NAME",
        "reason": "Jelaskan alasan level tersebut dengan BAHASA ORANG AWAM/BAHASA SEDERHANA agar klien paham (maksimal 30 kata). Hindari istilah teknis yang rumit."
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Clean JSON if Gemini returns markdown blocks
    const jsonStr = text.replace(/```json|```/g, "").trim()
    const analysis = JSON.parse(jsonStr)

    // Ambil harga dari database berdasarkan hasil AI
    const priceRef = await prisma.complexityPrice.findUnique({
      where: {
        level_sub_level: {
          level: analysis.level,
          sub_level: analysis.sub_level
        }
      }
    })

    return NextResponse.json({
      level: analysis.level,
      sub_level: analysis.sub_level,
      price: priceRef ? priceRef.price : 0,
      reason: analysis.reason
    })

  } catch (error) {
    console.error("Gemini Error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat menganalisis fitur" }, { status: 500 })
  }
}
