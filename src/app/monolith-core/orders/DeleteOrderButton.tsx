'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteOrderButton({ orderId, orderName, redirectUrl, className, children }: { orderId: string, orderName: string, redirectUrl?: string, className?: string, children?: React.ReactNode }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault() // prevent navigating to the order details page if this button is inside a link, though we'll make sure it's outside
    e.stopPropagation()

    if (window.confirm(`Are you sure you want to delete the order from ${orderName}?`)) {
      setIsDeleting(true)
      try {
        const response = await fetch(`/api/order/${orderId}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete order')
        }
        
        if (redirectUrl) {
          router.push(redirectUrl)
        } else {
          router.refresh()
        }
      } catch (error) {
        console.error(error)
        alert('Failed to delete order')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={className || "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"}
      title="Delete Order"
    >
      {children || <Trash2 className="w-5 h-5 flex-shrink-0" />}
    </button>
  )
}
