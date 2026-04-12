export type OrderHistoryAction = 
  | 'created'
  | 'updated_items'
  | 'updated_status'
  | 'updated_details'
  | 'restored'
  | 'payment_added'
  | 'payment_confirmed'
  | 'invoice_printed'

export interface OrderHistoryEntry {
  timestamp: string
  action: OrderHistoryAction
  user?: string
  description: string
  previous_state?: Record<string, unknown> | null
  new_state?: Record<string, unknown> | null
}

export function createHistoryEntry(
  action: OrderHistoryAction,
  description: string,
  previousState?: Record<string, unknown> | null,
  newState?: Record<string, unknown> | null,
  user?: string
): OrderHistoryEntry {
  return {
    timestamp: new Date().toISOString(),
    action,
    description,
    ...(previousState !== undefined && { previous_state: previousState }),
    ...(newState !== undefined && { new_state: newState }),
    ...(user && { user })
  }
}

export function addHistoryEntry(
  currentHistory: OrderHistoryEntry[] | unknown,
  entry: OrderHistoryEntry
): OrderHistoryEntry[] {
  if (!Array.isArray(currentHistory)) {
    return [entry]
  }
  return [...(currentHistory as OrderHistoryEntry[]), entry]
}

export function getOrderSnapshot(order: {
  name?: string | null
  whatsapp?: string | null
  email?: string | null
  project_title?: string | null
  details?: string | null
  status?: string | null
  total_price?: unknown
  items?: Array<{
    id: string
    description: string
    price: unknown
    classification: string
  }>
}): Record<string, unknown> {
  return {
    name: order.name,
    whatsapp: order.whatsapp,
    email: order.email,
    project_title: order.project_title,
    details: order.details,
    status: order.status,
    total_price: order.total_price,
    items: order.items?.map(item => ({
      id: item.id,
      description: item.description,
      price: item.price,
      classification: item.classification
    }))
  }
}
