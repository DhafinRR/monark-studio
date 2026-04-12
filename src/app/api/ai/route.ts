import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { aiRateLimiter, checkRateLimit, getClientIP } from "@/lib/rate-limit"
import { aiRequestSchema } from "@/lib/validations"
import { badRequest, tooManyRequests, internalError } from "@/lib/api-response"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

/**
 * Extract JSON from AI response that may contain extra text
 */
function extractJSON(text: string): any {
  // Remove markdown code blocks
  let cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim()

  // Try direct parse first
  try { return JSON.parse(cleaned) } catch {}

  // Find first { and last } to extract JSON object
  const start = cleaned.indexOf("{")
  const end = cleaned.lastIndexOf("}")
  if (start !== -1 && end !== -1 && end > start) {
    try { return JSON.parse(cleaned.slice(start, end + 1)) } catch {}
  }

  throw new Error(`Failed to extract JSON from AI response: ${text.substring(0, 100)}`)
}

const DB_MAX_RETRIES = 3
const DB_RETRY_DELAY_MS = 1000

/**
 * Retry wrapper for Prisma queries (handles P1001 connection errors)
 */
async function queryWithRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: any = null
  for (let attempt = 1; attempt <= DB_MAX_RETRIES; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      const isConnectionError = error.code === 'P1001' || error.code === 'P1002' ||
        error.message?.includes("Can't reach database")
      if (!isConnectionError || attempt === DB_MAX_RETRIES) throw error
      console.warn(`DB connection failed (attempt ${attempt}/${DB_MAX_RETRIES}). Retrying in ${DB_RETRY_DELAY_MS * attempt}ms...`)
      await new Promise(resolve => setTimeout(resolve, DB_RETRY_DELAY_MS * attempt))
    }
  }
  throw lastError
}

// Model fallback chain (ordered by preference, all valid per Google docs April 2026)
const MODEL_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
]

/**
 * Generate fallback order data when all AI models are unavailable
 */
function generateFallbackOrder(story: string, packages: any[], package_id?: string) {
  const storyLower = story.toLowerCase()
  let detectedPackage = packages.find(p => p.id === package_id) || packages[0]

  if (storyLower.match(/mobile|aplikasi|android|ios|iphone|seluler/)) {
    detectedPackage = packages.find(p => p.id === 'mobile_app') || detectedPackage
  } else if (storyLower.match(/cms|admin|dashboard|toko|ecommerce|e-commerce/)) {
    detectedPackage = packages.find(p => p.id === 'web_app_cms') || detectedPackage
  } else {
    detectedPackage = packages.find(p => p.id === 'basic_web') || detectedPackage
  }

  return {
    package_id: detectedPackage.id,
    standard_items: detectedPackage.default_features.slice(0, detectedPackage.max_slots).map((feature: string) => ({
      description: feature,
      type: "CATALOG"
    })),
    addon_items: [],
    analysis_summary: `Berdasarkan deskripsi "${story.substring(0, 100)}...", kami merekomendasikan paket ${detectedPackage.name}. Layanan AI sedang tidak tersedia, ini adalah estimasi dasar. Silakan konsultasi via WhatsApp untuk penawaran lebih akurat.`,
    is_fallback: true,
    fallback_note: "Layanan AI sedang sibuk. Data di atas adalah estimasi dasar. Untuk penawaran akurat, silakan hubungi kami via WhatsApp."
  }
}

/**
 * Last-resort static fallback when both AI and DB are unavailable
 */
function generateStaticFallback(story: string) {
  const storyLower = story.toLowerCase()
  let pkgId = "basic_web", pkgName = "Basic Web", floorPrice = 600000
  const features = ["Halaman Home Statis", "Pilihan Halaman About/Layanan", "Integrasi Tombol WhatsApp"]

  if (storyLower.match(/mobile|aplikasi|android|ios|iphone|seluler/)) {
    pkgId = "mobile_app"; pkgName = "Mobile App"; floorPrice = 15000000
  } else if (storyLower.match(/cms|admin|dashboard|toko|ecommerce|e-commerce/)) {
    pkgId = "web_app_cms"; pkgName = "Web App / CMS"; floorPrice = 5000000
  }

  return {
    package_id: pkgId,
    items: [
      { description: `Layanan Inti: ${pkgName}`, classification: "STANDARD", price: floorPrice, custom_note: "", type: "CUSTOM" },
      ...features.map(f => ({ description: f, classification: "STANDARD", price: 0, custom_note: "", type: "CATALOG" }))
    ],
    analysis_summary: `Layanan AI dan database sedang tidak tersedia. Ini adalah estimasi dasar untuk paket ${pkgName}. Silakan konsultasi via WhatsApp untuk penawaran akurat.`,
    is_fallback: true,
    fallback_note: "AI dan database sedang tidak tersedia. Silakan hubungi kami via WhatsApp."
  }
}

/**
 * Try generating content across the model fallback chain with exponential backoff + jitter.
 * Each model gets 2 attempts before moving to the next.
 */
async function generateContentWithModelChain(prompt: string): Promise<any> {
  let lastError: any = null

  for (const modelName of MODEL_CHAIN) {
    const model = genAI.getGenerativeModel({ model: modelName })

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Trying ${modelName} (attempt ${attempt}/2)...`)
        const result = await model.generateContent(prompt)
        return result
      } catch (error: any) {
        lastError = error

        const isRetryable = error.status === 503 || error.status === 429 ||
          error.message?.includes('Service Unavailable') ||
          error.message?.includes('high demand') ||
          error.message?.includes('RESOURCE_EXHAUSTED') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('ECONNRESET') ||
          error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT'

        if (!isRetryable) throw error

        // Exponential backoff with jitter: ~2s, ~4s
        const delay = (2 ** attempt) * 1000 + Math.random() * 1000
        console.warn(`${modelName} returned ${error.status}. Waiting ${Math.round(delay)}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    console.warn(`${modelName} failed after 2 attempts. Trying next model...`)
  }

  throw lastError
}

export async function POST(req: Request) {
  const ip = getClientIP(req)
  const rateCheck = await checkRateLimit(aiRateLimiter, ip)
  if (!rateCheck.allowed) {
    return tooManyRequests(rateCheck.retryAfter!)
  }

  let requestBody: any
  try {
    requestBody = await req.json()
  } catch {
    return badRequest("Invalid request body")
  }

  const parseResult = aiRequestSchema.safeParse(requestBody)
  if (!parseResult.success) {
    return badRequest(`Invalid request: ${parseResult.error.issues.map(i => i.message).join(', ')}`)
  }

  const { story, action, package_id, platform, description } = requestBody

  try {
    if (!process.env.GOOGLE_API_KEY) {
      const packages = await queryWithRetry(() => prisma.pricingPackage.findMany())
      if (action === "PARSE_ORDER") {
        return NextResponse.json(generateFallbackOrder(story || "", packages, package_id))
      }
      return NextResponse.json({ error: "API key belum dikonfigurasi.", fallback: true }, { status: 503 })
    }

    const [packages, catalog, complexityPrices] = await queryWithRetry(() => Promise.all([
      prisma.pricingPackage.findMany(),
      prisma.featureCatalog.findMany({ where: { is_active: true } }),
      prisma.complexityPrice.findMany()
    ]))

    if (action === "ANALYZE_ITEM") {
      return handleAnalyzeItem(description, complexityPrices)
    }

    if (action === "PARSE_ORDER") {
      return handleParseOrder(story, package_id, platform, packages, catalog, complexityPrices)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })

  } catch (error: any) {
    console.error("AI Route Error:", error)

    // All models exhausted - return fallback order for PARSE_ORDER
    if (action === "PARSE_ORDER") {
      try {
        const packages = await queryWithRetry(() => prisma.pricingPackage.findMany())
        return NextResponse.json(generateFallbackOrder(story || "", packages, package_id))
      } catch (dbError) {
        console.error("Database fallback error:", dbError)
        // Last resort: use hardcoded static fallback
        return NextResponse.json(generateStaticFallback(story || ""))
      }
    }

    const isDbError = error.code === 'P1001' || error.code === 'P1002' ||
      error.message?.includes("Can't reach database")

    return NextResponse.json({
      error: isDbError
        ? "Database sedang tidak tersedia. Silakan coba beberapa saat lagi."
        : "Layanan AI sedang sibuk. Silakan coba beberapa saat lagi atau gunakan konsultasi WhatsApp.",
      type: "SERVICE_UNAVAILABLE"
    }, { status: 503 })
  }
}

async function handleAnalyzeItem(description: string, complexityPrices: any[]) {
  const priceList = complexityPrices.map(p =>
    `${p.level}-${p.sub_level}: Rp ${Number(p.price).toLocaleString('id-ID')}`
  ).join(", ")
  const prompt = `
    Anda adalah asisten ahli estimasi proyek software Monark Studio.

    TABEL HARGA KOMPLEKSITAS:
    ${priceList}

    Tugas: Analisis deskripsi "${description}" dan tentukan level kompleksitasnya.
    "reason" berisi penjelasan yang mudah dipahami klien non-teknis tentang MENGAPA fitur ini memiliki tingkat kesulitan tersebut dan jangan terlalu panjang, 50 kata cukup, jangan terlalu teknis dan jangan ada kalimat pemborosan yang tidak penting. 

    BALAS HANYA DENGAN JSON MURNI, tanpa teks lain:
    { "level": "MUDAH/SEDANG/SULIT/SANGAT_SULIT", "sub_level": "MINOR/MAJOR", "reason": "..." }
  `
  const result = await generateContentWithModelChain(prompt)
  const rawText = result.response.text()
  const analysis = extractJSON(rawText)

  const priceRef = complexityPrices.find(p => p.level === analysis.level?.toUpperCase() && p.sub_level === analysis.sub_level?.toUpperCase())

  return NextResponse.json({
    level: analysis.level?.toUpperCase(),
    sub_level: analysis.sub_level?.toUpperCase(),
    price: priceRef ? Number(priceRef.price) : 0,
    reason: analysis.reason
  })
}

async function handleParseOrder(
  story: string,
  package_id: string,
  platform: string,
  packages: any[],
  catalog: any[],
  complexityPrices: any[]
) {
  const selectedPkg = packages.find(p => p.id === package_id) || packages[0]

  // Build complexity price reference for prompt
  const priceRef = complexityPrices.map(p =>
    `${p.level}-${p.sub_level}: Rp ${Number(p.price).toLocaleString('id-ID')}`
  ).join(", ")

  const prompt = `
    Anda adalah sistem AI Monark Studio yang mengubah cerita klien menjadi rincian pesanan teknis.

    KONTEKS PAKET TERPILIH:
    - Nama: ${selectedPkg.name}
    - Floor Price: Rp ${Number(selectedPkg.floor_price).toLocaleString('id-ID')}
    - Maks Slot Fitur Standar: ${selectedPkg.max_slots}
    - Fitur Default Paket: [${selectedPkg.default_features.join(", ")}]
    - Platform Mobile: ${platform || "N/A"}

    KATALOG FITUR TERSEDIA:
    ${catalog.map(f => `- ${f.name} (Kategori: ${f.category}, ID: ${f.id})`).join("\n")}

    TABEL HARGA KOMPLEKSITAS (referensi harga addon):
    ${priceRef}

    ATURAN KETAT:
    1. "standard_items" = HANYA fitur bawaan paket dari daftar "Fitur Default Paket" di atas. Maksimum ${selectedPkg.max_slots} item.
    2. "addon_items" = SEMUA fitur yang diminta klien tapi TIDAK ADA di daftar fitur default. Contoh: CRUD, dashboard, login, portfolio dinamis, manajemen konten, dll.
    3. Setiap addon WAJIB punya "level" dan "sub_level" dari tabel kompleksitas di atas. AI menentukan tingkat kesulitan, sistem yang menentukan harga.
    7. "reason" WAJIB berisi penjelasan yang mudah dipahami klien non-teknis tentang MENGAPA fitur ini memiliki tingkat kesulitan tersebut. Jelaskan dari sisi kebutuhan/kompleksitas fitur, bukan istilah teknis. Contoh: "Fitur autentikasi membutuhkan sistem keamanan tinggi untuk melindungi data pengguna, sehingga tingkat pengerjaannya tergolong sulit." BUKAN: "Membutuhkan backend CRUD + auth middleware".
    4. JANGAN masukkan informasi addon di dalam analysis_summary. Addon HARUS berupa objek di array "addon_items".
    5. analysis_summary hanya berisi ringkasan singkat dalam bahasa ramah klien, tanpa menyebut harga per-item.
    6. PENTING: Fitur dinamis (CRUD, dashboard, login, portfolio management, dll) HARUS masuk "addon_items" untuk paket Basic Web.

    Cerita Klien: "${story}"

    Output HANYA JSON murni (tanpa markdown, tanpa komentar):
    {
      "package_id": "${selectedPkg.id}",
      "standard_items": [
        {
          "description": "Nama fitur standar",
          "type": "CATALOG"
        }
      ],
      "addon_items": [
        {
          "description": "Nama fitur tambahan",
          "level": "MUDAH/SEDANG/SULIT/SANGAT_SULIT",
          "sub_level": "MINOR/MAJOR",
          "reason": "Penjelasan ramah klien mengapa fitur ini memiliki tingkat kesulitan tersebut",
          "type": "CUSTOM"
        }
      ],
      "analysis_summary": "Ringkasan singkat dalam bahasa ramah klien."
    }
  `

  const result = await generateContentWithModelChain(prompt)
  const rawText = result.response.text()
  console.log("=== RAW AI RESPONSE ===")
  console.log(rawText)
  console.log("=== END RAW AI RESPONSE ===")

  const orderData = extractJSON(rawText)

  // Batch resolve addon prices from complexity_price table
  if (orderData.addon_items && Array.isArray(orderData.addon_items)) {
    orderData.addon_items = orderData.addon_items.map((item: any) => {
      const level = item.level?.toUpperCase()
      const subLevel = item.sub_level?.toUpperCase()
      const priceRow = complexityPrices.find(
        (p: any) => p.level === level && p.sub_level === subLevel
      )
      return {
        ...item,
        level,
        sub_level: subLevel,
        price: priceRow ? Number(priceRow.price) : 0
      }
    })
  }

  return NextResponse.json(orderData)
}
