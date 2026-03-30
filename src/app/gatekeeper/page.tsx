'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Gatekeeper() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (res.ok) {
        window.location.href = '/monolith-core'
      } else {
        setError('Sys_Err: 401')
      }
    } catch (err) {
      setError('Sys_Err: 500')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono">
      <form onSubmit={handleAccess} className="w-full max-w-sm p-8 flex flex-col items-center">
        {/* Intentionally obscure minimal design */}
        <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <div className="w-2 h-2 rounded-full bg-neutral-700 animate-pulse" />
        </div>

        <div className="w-full space-y-4">
          <input 
            type="text" 
            placeholder="ID" 
            className="w-full bg-neutral-900/50 border border-neutral-800 text-neutral-300 text-center text-sm p-3 rounded-md focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all placeholder:text-neutral-700"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="off"
            spellCheck="false"
          />
          <input 
            type="password" 
            placeholder="KEY" 
            className="w-full bg-neutral-900/50 border border-neutral-800 text-neutral-300 text-center text-sm p-3 rounded-md focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all placeholder:text-neutral-700 tracking-[0.2em]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-xs font-bold py-3 px-4 rounded-md transition-all uppercase tracking-widest mt-6 disabled:opacity-50"
          >
            {loading ? '...' : 'Access'}
          </button>
        </div>

        {error && (
          <p className="mt-6 text-[10px] text-red-900 font-bold uppercase tracking-widest">{error}</p>
        )}
      </form>
    </div>
  )
}
