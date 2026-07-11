import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Home } from 'lucide-react'

/**
 * Root Not Found Page (Public Facing)
 * Luxury Aesthetic for Monark Studio
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9F7F2] flex flex-col items-center justify-center p-6 text-[#0D2B22] font-sans selection:bg-[#B8926A] selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[120%] border-[1px] border-[#0D2B22] rounded-full rotate-45" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[80%] border-[1px] border-[#0D2B22] rounded-full -rotate-12" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl text-center space-y-12">
        
        {/* Shimmering Logo Placeholder / Branding */}
        <div className="relative w-32 h-32 mb-4 animate-in fade-in duration-1000">
           <Image 
             src="/assets/logo.jpg" 
             alt="Monark Studio Logo" 
             fill
             className="object-contain filter grayscale invert brightness-0"
           />
        </div>

        {/* Error Typography */}
        <div className="space-y-6">
          <h1 className="text-8xl md:text-[12rem] font-serif italic text-[#B8926A] leading-none tracking-tighter animate-in slide-in-from-bottom-8 duration-700">
            404
          </h1>
          <div className="space-y-4 px-4 sm:px-0">
             <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.4em] text-[#0D2B22] opacity-80">
                The Void
             </h2>
             <p className="text-sm md:text-base font-medium leading-relaxed max-w-md mx-auto opacity-50 italic">
                The space you are searching for does not exist within the Monark universe. Let us guide you back to civilization.
             </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <Link 
             href="/" 
             className="px-12 py-5 bg-[#0D2B22] text-[#F9F7F2] font-black uppercase tracking-[0.3em] text-[10px] rounded-full hover:bg-[#B8926A] transition-all shadow-2xl flex items-center gap-3 group"
          >
             <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
             Return Home
          </Link>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="fixed bottom-12 text-center space-y-2 opacity-30 select-none">
        <p className="text-[10px] font-black uppercase tracking-[0.8em]">Monark Studio house</p>
        <p className="text-[9px] font-bold">EST. 2024 • JAKARTA</p>
      </div>
    </div>
  )
}
