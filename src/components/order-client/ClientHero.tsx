'use client'

import { Calendar, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ClientHeroProps {
  invoiceNumber: string
  projectTitle?: string
  customerName: string
  status: string
  createdAt: string
  orderId: string
}

export default function ClientHero({
  invoiceNumber,
  projectTitle,
  customerName,
  status,
  createdAt,
  orderId
}: ClientHeroProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'secondary'
      case 'PENDING': return 'outline'
      case 'ACTIVE': return 'default'
      case 'ON_PROGRESS': return 'default'
      case 'DONE': return 'default'
      case 'CANCELLED': return 'destructive'
      default: return 'secondary'
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <section className="mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-4">
            <Badge variant={getStatusVariant(status)} className="font-black uppercase tracking-widest text-[9px] h-5">
              {status.replace('_', ' ')}
            </Badge>
            <span className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">
              Order ID #{(orderId || '').substring(0, 8)}
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
            {projectTitle || invoiceNumber}
          </h1>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="opacity-40 text-sm" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {formatDate(createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="opacity-40 text-sm" />
              <span className="text-xs font-semibold uppercase tracking-wider underline decoration-dotted underline-offset-4">
                {customerName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
