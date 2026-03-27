import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "6281322639234";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Halo,%20saya%20tertarik%20dengan%20jasa%20Anda`;

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-white font-semibold text-sm shadow-lg hover:scale-105 transition-transform"
    >
      <MessageCircle size={20} fill="white" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
