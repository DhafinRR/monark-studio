import { z } from 'zod'

export const orderItemSchema = z.object({
  type: z.enum(['CATALOG', 'CUSTOM']),
  classification: z.enum(['STANDARD', 'ADDON']),
  description: z.string().min(1).max(500),
  price: z.union([z.string(), z.number()]),
  level: z.enum(['MUDAH', 'SEDANG', 'SULIT', 'SANGAT_SULIT']).optional(),
  sub_level: z.enum(['MINOR', 'MAJOR']).optional(),
  reason: z.string().optional(),
  custom_note: z.string().optional(),
  feature_id: z.string().optional(),
})

export const createOrderSchema = z.object({
  project_title: z.string().max(200).optional(),
  name: z.string().min(1).max(100),
  whatsapp: z.string().min(10).max(20),
  email: z.string().email().optional().or(z.literal('')),
  package_id: z.string().optional(),
  platform: z.string().optional(),
  details: z.string().max(2000).optional(),
  items: z.array(orderItemSchema).max(50),
})

export const createFeatureSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string().max(100),
  description: z.string().max(1000).optional(),
  is_active: z.boolean().default(true),
})

export const updateFeatureSchema = createFeatureSchema.partial()

export const createPortfolioSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  project_url: z.string().url().optional().or(z.literal('')),
  tech_stack_ids: z.array(z.string()).optional(),
  is_featured: z.boolean().default(false),
})

export const updatePortfolioSchema = createPortfolioSchema.partial()

export const aiRequestSchema = z.object({
  action: z.enum(['PARSE_ORDER', 'ANALYZE_ITEM']),
  story: z.string().max(5000).optional().nullable(),
  package_id: z.string().optional().nullable(),
  platform: z.string().optional().nullable(),
  description: z.string().max(500).optional().nullable(),
})
