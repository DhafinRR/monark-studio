import Link from 'next/link'
import { ArrowLeft, User, MessageCircle, AlertCircle, FileText } from 'lucide-react'
import prisma from '@/lib/prisma'
import OrderDetailClient from '@/components/monolith-core/OrderDetailClient'
import ClientLink from '@/components/monolith-core/ClientLink'
import { Decimal } from '@prisma/client/runtime/library'

function serializeOrder(order: any) {
  const serializeItem = (item: any) => ({
    ...item,
    price: item.price instanceof Decimal ? item.price.toString() : item.price
  })

  const serializePackage = (pkg: any) => pkg ? {
    ...pkg,
    floor_price: pkg.floor_price instanceof Decimal ? pkg.floor_price.toString() : pkg.floor_price
  } : null

  return {
    ...order,
    total_price: order.total_price instanceof Decimal ? order.total_price.toString() : order.total_price,
    items: order.items?.map(serializeItem) || [],
    pricing_package: serializePackage(order.pricing_package),
    invoice: order.invoice ? {
      ...order.invoice,
      amount: order.invoice.amount instanceof Decimal ? order.invoice.amount.toString() : order.invoice.amount
    } : null,
    payments: order.payments?.map((p: any) => ({
      ...p,
      amount: p.amount instanceof Decimal ? p.amount.toString() : p.amount
    })) || []
  }
}

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      invoice: true,
      pricing_package: true,
      payments: {
        orderBy: { created_at: 'desc' }
      }
    }
  })
  return order ? serializeOrder(order) : null
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    return (
      <div className="max-w-6xl mx-auto pb-20 p-4">
        <div className="bg-white rounded-xl border p-10 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Order tidak ditemukan</h1>
          <p className="text-gray-500 mb-4">Order dengan ID ini tidak ada di database.</p>
          <Link href="/monolith-core/orders" className="text-blue-600 hover:underline">
            Kembali ke daftar order
          </Link>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    ACTIVE: 'bg-blue-100 text-blue-700',
    ON_PROGRESS: 'bg-purple-100 text-purple-700',
    DONE: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/monolith-core/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
          <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{order.pricing_package?.name || 'Custom Project'}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[order.status]}`}>
              {order.status}
            </span>
          </div>
          <p className="text-gray-500 text-sm italic">ID: {order.id.slice(0, 8)}...</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left & Center - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <OrderDetailClient order={order} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Client Link Card */}
          <ClientLink orderId={order.id} />

          {/* Client Card */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#B8926A] flex items-center gap-2">
              <User className="w-4 h-4" /> Client
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Name</label>
                <p className="font-bold text-lg text-gray-900">{order.name}</p>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">WhatsApp</label>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-700">{order.whatsapp}</p>
                  <a href={`https://wa.me/${order.whatsapp}`} target="_blank" className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
              {order.email && (
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Email</label>
                  <p className="font-medium text-gray-700">{order.email}</p>
                </div>
              )}
            </div>
          </section>

          {/* Notes Card */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#B8926A] flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Description
            </h2>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm italic text-gray-600 whitespace-pre-wrap">
                {order.details || 'Tidak ada deskripsi.'}
              </p>
            </div>
          </section>

          {/* Edit Link */}
          <Link 
            href={`/monolith-core/orders/${order.id}/edit`}
            className="block w-full px-4 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 text-sm text-center"
          >
            <FileText className="w-4 h-4" />
            Edit Items & Harga
          </Link>
        </div>
      </div>
    </div>
  )
}
