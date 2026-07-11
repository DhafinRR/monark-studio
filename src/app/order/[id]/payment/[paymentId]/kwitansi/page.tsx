'use client'

import { useEffect, useState } from 'react'
import KwitansiReceipt from '@/components/order-client/KwitansiReceipt'

interface Payment {
    id: string
    amount: number
    payment_method?: string
    notes?: string
    paid_at?: string
    created_at: string
}

interface Order {
    id: string
    project_title?: string
    name: string
    whatsapp: string
    email?: string
    payments?: Payment[]
}

interface PageProps {
    params: { id: string; paymentId: string }
}

export default function ClientKwitansiPage({ params }: PageProps) {
    const { id, paymentId } = params
    const [order, setOrder] = useState<Order | null>(null)
    const [payment, setPayment] = useState<Payment | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/order/${id}`)
                if (!res.ok) throw new Error('Order not found')
                const data = await res.json()
                setOrder(data)
                const found = data.payments?.find((p: Payment) => p.id === paymentId) || null
                setPayment(found)
            } catch (err) {
                console.error('Failed to load kwitansi data', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id, paymentId])

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    if (!order || !payment) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <p>Data kwitansi tidak ditemukan.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex items-start justify-center pt-8 print:bg-white print:pt-0">
            <div className="shadow-2xl print:shadow-none">
                <KwitansiReceipt
                    paymentId={payment.id}
                    amount={Number(payment.amount)}
                    customerName={order.name}
                    projectTitle={order.project_title}
                    paidAt={payment.paid_at || payment.created_at}
                    paymentMethod={payment.payment_method}
                />
            </div>
        </div>
    )
}
