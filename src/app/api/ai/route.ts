import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { aiRateLimiter, checkRateLimit, getClientIP } from "@/lib/rate-limit"
import { aiRequestSchema } from "@/lib/validations"
import { badRequest, tooManyRequests, internalError } from "@/lib/api-response"

const PROVIDERS = [
  {
    name: 'groq',
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
    apiKey: () => process.env.GROQ_API_KEY,
    model: 'openai/gpt-oss-120b',
  },
  {
    name: 'cerebras',
    baseUrl: 'https://api.cerebras.ai/v1/chat/completions',
    apiKey: () => process.env.CEREBRAS_API_KEY,
    model: 'gpt-oss-120b',
  },
]

function extractJSON(text: string): any {
  let cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim()

  try { return JSON.parse(cleaned) } catch {}

  const start = cleaned.indexOf("{")
  const end = cleaned.lastIndexOf("}")
  if (start !== -1 && end !== -1 && end > start) {
    try { return JSON.parse(cleaned.slice(start, end + 1)) } catch {}
  }

  throw new Error(`Failed to extract JSON from AI response: ${text.substring(0, 100)}`)
}

const DB_MAX_RETRIES = 3
const DB_RETRY_DELAY_MS = 1000

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

async function generateContent(prompt: string): Promise<string> {
  let lastError: any = null

  for (const provider of PROVIDERS) {
    const apiKey = provider.apiKey()
    if (!apiKey) {
      console.warn(`${provider.name}: API key not configured, skipping`)
      continue
    }

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Trying ${provider.name}/${provider.model} (attempt ${attempt}/2)...`)

        const res = await fetch(provider.baseUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: provider.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_completion_tokens: 4096,
          }),
        })

        if (!res.ok) {
          const errorBody = await res.text().catch(() => '')
          throw Object.assign(new Error(`HTTP ${res.status}: ${errorBody}`), { status: res.status })
        }

        const data = await res.json()
        return data.choices[0].message.content
      } catch (error: any) {
        lastError = error

        const status = error.status || 0
        const isRetryable = status === 503 || status === 429 ||
          error.message?.includes('Service Unavailable') ||
          error.message?.includes('high demand') ||
          error.message?.includes('RESOURCE_EXHAUSTED') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('ECONNRESET') ||
          error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT'

        if (!isRetryable) {
          console.warn(`${provider.name}: Non-retryable error, skipping provider:`, error.message)
          break
        }

        const delay = (2 ** attempt) * 1000 + Math.random() * 1000
        console.warn(`${provider.name} unavailable (${error.message}). Waiting ${Math.round(delay)}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    console.warn(`${provider.name} failed after 2 attempts. Trying next provider...`)
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
    if (!process.env.GROQ_API_KEY && !process.env.CEREBRAS_API_KEY) {
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

    if (action === "PARSE_ORDER") {
      try {
        const packages = await queryWithRetry(() => prisma.pricingPackage.findMany())
        return NextResponse.json(generateFallbackOrder(story || "", packages, package_id))
      } catch (dbError) {
        console.error("Database fallback error:", dbError)
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
  const rawText = await generateContent(prompt)
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
  let selectedPkg = packages.find(p => p.id === package_id)

  if (!selectedPkg) {
    const storyLower = story.toLowerCase()

    if (platform && ['ANDROID', 'IOS', 'BOTH'].includes(platform.toUpperCase())) {
      selectedPkg = packages.find(p => p.id === 'mobile_app')
    }

    if (!selectedPkg && storyLower.match(/mobile|aplikasi|android|ios|iphone|seluler|app store|play store|smartphone/i)) {
      selectedPkg = packages.find(p => p.id === 'mobile_app')
    }

    if (!selectedPkg && storyLower.match(/cms|admin|dashboard|toko|ecommerce|e-commerce|manajemen konten|crud|login|database|sistem informasi/i)) {
      selectedPkg = packages.find(p => p.id === 'web_app_cms')
    }

    if (!selectedPkg) {
      selectedPkg = packages.find(p => p.id === 'basic_web') || packages[0]
    }
  }

  let adjustedFloorPrice = Number(selectedPkg.floor_price)
  if (selectedPkg.id === 'mobile_app' && platform?.toUpperCase() === 'BOTH') {
    adjustedFloorPrice = Number(selectedPkg.floor_price) * 1.8
  }

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

  const rawText = await generateContent(prompt)
  console.log("=== RAW AI RESPONSE ===")
  console.log(rawText)
  console.log("=== END RAW AI RESPONSE ===")

  const orderData = extractJSON(rawText)

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

  const finalPlatform = selectedPkg.id === 'mobile_app' ? platform : 'WEB'
  orderData.platform = finalPlatform
  orderData.floor_price = adjustedFloorPrice

  return NextResponse.json(orderData)
}
