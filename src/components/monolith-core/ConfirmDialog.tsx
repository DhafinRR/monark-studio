'use client'

import React from 'react'
import { X, AlertCircle, HelpCircle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'info' | 'warning'
}

/**
 * Premium Minimalist Confirmation Dialog
 * Designed for High-End Admin Experience
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  type = 'info'
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const typeConfig = {
    danger: {
      icon: <AlertCircle className="w-6 h-6 text-red-500" />,
      button: 'bg-red-600 hover:bg-red-700',
      border: 'border-red-100'
    },
    warning: {
      icon: <AlertCircle className="w-6 h-6 text-amber-500" />,
      button: 'bg-amber-600 hover:bg-amber-700',
      border: 'border-amber-100'
    },
    info: {
      icon: <HelpCircle className="w-6 h-6 text-blue-500" />,
      button: 'bg-gray-900 hover:bg-blue-600',
      border: 'border-blue-100'
    }
  }

  const config = typeConfig[type]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Dialog Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-8 pb-4">
           <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-2xl bg-white shadow-xl ${config.border} border`}>
                 {config.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">{title}</h3>
           </div>
           <p className="text-gray-500 text-sm leading-relaxed mb-8">
              {message}
           </p>
        </div>

        <div className="p-6 bg-gray-50 flex items-center gap-3 justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
           >
             {cancelText}
           </button>
           <button 
             onClick={() => {
                onConfirm()
                onClose()
             }}
             className={`px-8 py-3 text-xs font-black uppercase tracking-widest text-white rounded-2xl shadow-xl transition-all transform hover:scale-[1.05] active:scale-95 ${config.button}`}
           >
             {confirmText}
           </button>
        </div>
      </div>
    </div>
  )
}
