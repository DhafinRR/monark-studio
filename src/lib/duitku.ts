import crypto from 'crypto'

// ─── CONFIG ─────────────────────────────────────────────
const MERCHANT_CODE = process.env.DUITKU_MERCHANT_CODE || ''
const API_KEY = process.env.DUITKU_API_KEY || ''
const IS_SANDBOX = process.env.DUITKU_IS_SANDBOX === 'true'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

const DUITKU_BASE = IS_SANDBOX
  ? 'https://sandbox.duitku.com/webapi'
  : 'https://passport.duitku.com/webapi'

// ─── TYPES ──────────────────────────────────────────────
export interface DuitkuPaymentMethod {
  paymentMethod: string
  paymentName: string
  paymentImage: string
  totalFee: string
}

export interface DuitkuInquiryRequest {
  merchantOrderId: string
  paymentAmount: number
  paymentMethod: string
  productDetails: string
  email: string
  phoneNumber?: string
  customerVaName: string
  expiryPeriod?: number // minutes
  itemDetails?: Array<{
    name: string
    price: number
    quantity: number
  }>
}

export interface DuitkuInquiryResponse {
  merchantCode: string
  reference: string
  paymentUrl: string
  vaNumber?: string
  qrString?: string
  amount: string
  statusCode: string
  statusMessage: string
}

export interface DuitkuCallbackParams {
  merchantCode: string
  amount: string
  merchantOrderId: string
  productDetail?: string
  additionalParam?: string
  paymentCode?: string
  resultCode: string
  merchantUserId?: string
  reference: string
  signature: string
  publisherOrderId?: string
  spUserHash?: string
  settlementDate?: string
  issuerCode?: string
}

export interface DuitkuCheckResponse {
  merchantOrderId: string
  reference: string
  amount: string
  fee: string
  statusCode: string
  statusMessage: string
}

// ─── SIGNATURE HELPERS ──────────────────────────────────

/**
 * Generate MD5 hash — used for inquiry & callback signatures
 */
function md5(data: string): string {
  return crypto.createHash('md5').update(data).digest('hex')
}

/**
 * Generate SHA256 hash — used for getPaymentMethod signature
 */
function sha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * Inquiry signature: MD5(merchantCode + merchantOrderId + paymentAmount + apiKey)
 */
function createInquirySignature(merchantOrderId: string, paymentAmount: number): string {
  return md5(MERCHANT_CODE + merchantOrderId + paymentAmount + API_KEY)
}

/**
 * Callback signature: MD5(merchantCode + amount + merchantOrderId + apiKey)
 */
function createCallbackSignature(amount: string, merchantOrderId: string): string {
  return md5(MERCHANT_CODE + amount + merchantOrderId + API_KEY)
}

/**
 * Check transaction signature: MD5(merchantCode + merchantOrderId + apiKey)
 */
function createCheckSignature(merchantOrderId: string): string {
  return md5(MERCHANT_CODE + merchantOrderId + API_KEY)
}

/**
 * Payment method signature: SHA256(merchantCode + paymentAmount + datetime + apiKey)
 */
function createPaymentMethodSignature(paymentAmount: number, datetime: string): string {
  return sha256(MERCHANT_CODE + paymentAmount + datetime + API_KEY)
}

// ─── API FUNCTIONS ──────────────────────────────────────

/**
 * Get available payment methods from Duitku
 */
export async function getPaymentMethods(amount: number): Promise<DuitkuPaymentMethod[]> {
  const datetime = new Date().toISOString().replace('T', ' ').substring(0, 19)
  const signature = createPaymentMethodSignature(amount, datetime)

  const response = await fetch(`${DUITKU_BASE}/api/merchant/paymentmethod/getpaymentmethod`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchantcode: MERCHANT_CODE,
      amount: amount,
      datetime: datetime,
      signature: signature
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ Message: 'Unknown error' }))
    throw new Error(`Duitku getPaymentMethod failed: ${response.status} ${error.Message || ''}`)
  }

  const data = await response.json()
  
  if (data.responseCode !== '00') {
    throw new Error(`Duitku getPaymentMethod error: ${data.responseMessage}`)
  }

  return data.paymentFee || []
}

/**
 * Create a transaction (inquiry) on Duitku
 */
export async function createTransaction(params: DuitkuInquiryRequest): Promise<DuitkuInquiryResponse> {
  const signature = createInquirySignature(params.merchantOrderId, params.paymentAmount)

  const callbackUrl = `${BASE_URL}/api/payment/callback`
  const returnUrl = `${BASE_URL}/api/payment/return`

  const body: Record<string, unknown> = {
    merchantCode: MERCHANT_CODE,
    paymentAmount: params.paymentAmount,
    paymentMethod: params.paymentMethod,
    merchantOrderId: params.merchantOrderId,
    productDetails: params.productDetails,
    email: params.email,
    phoneNumber: params.phoneNumber || '',
    customerVaName: params.customerVaName,
    callbackUrl: callbackUrl,
    returnUrl: returnUrl,
    signature: signature,
    expiryPeriod: params.expiryPeriod || 1440, // default 24 hours
    additionalParam: '',
    merchantUserInfo: '',
  }

  // Add item details if provided
  if (params.itemDetails && params.itemDetails.length > 0) {
    body.itemDetails = params.itemDetails
  }

  const response = await fetch(`${DUITKU_BASE}/api/merchant/v2/inquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ Message: 'Unknown error' }))
    throw new Error(`Duitku inquiry failed: ${response.status} ${error.Message || ''}`)
  }

  const data: DuitkuInquiryResponse = await response.json()
  
  if (data.statusCode !== '00') {
    throw new Error(`Duitku inquiry error: ${data.statusMessage}`)
  }

  return data
}

/**
 * Verify callback signature from Duitku
 */
export function verifyCallback(params: DuitkuCallbackParams): boolean {
  const expectedSignature = createCallbackSignature(params.amount, params.merchantOrderId)
  return params.signature === expectedSignature
}

/**
 * Check transaction status on Duitku
 */
export async function checkTransaction(merchantOrderId: string): Promise<DuitkuCheckResponse> {
  const signature = createCheckSignature(merchantOrderId)

  const response = await fetch(`${DUITKU_BASE}/api/merchant/transactionStatus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchantCode: MERCHANT_CODE,
      merchantOrderId: merchantOrderId,
      signature: signature
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ Message: 'Unknown error' }))
    throw new Error(`Duitku check failed: ${response.status} ${error.Message || ''}`)
  }

  return await response.json()
}

/**
 * Generate a unique merchant order ID for Duitku
 * Format: MNK-{timestamp}-{random}
 */
export function generateMerchantOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = crypto.randomBytes(3).toString('hex').toUpperCase()
  return `MNK-${timestamp}-${random}`
}

/**
 * Generate WhatsApp payment link message
 */
export function generateWhatsAppPaymentMessage(params: {
  clientName: string
  projectName: string
  label: string
  amount: number
  paymentUrl: string
  vaNumber?: string
  paymentMethod?: string
  expiryDate?: Date
}): string {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(params.amount)

  let message = `Halo ${params.clientName}! 👋\n\n`
  message += `Berikut adalah detail pembayaran untuk project *${params.projectName}*:\n\n`
  message += `📋 *${params.label}*\n`
  message += `💰 Nominal: *${formattedAmount}*\n`

  if (params.paymentMethod) {
    message += `🏦 Metode: ${params.paymentMethod}\n`
  }

  if (params.vaNumber) {
    message += `🔢 No. VA: \`${params.vaNumber}\`\n`
  }

  if (params.expiryDate) {
    const expiryFormatted = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(params.expiryDate)
    message += `⏰ Bayar sebelum: ${expiryFormatted}\n`
  }

  message += `\n🔗 Link Pembayaran:\n${params.paymentUrl}\n`
  message += `\nSilakan klik link di atas untuk melakukan pembayaran. Terima kasih! 🙏`

  return message
}
