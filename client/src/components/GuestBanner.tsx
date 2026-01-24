import { X } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"

export default function GuestBanner() {
    const [isDismissed, setIsDismissed] = useState(false)
    const isGuest = useAuthStore((state) => state.isGuest)
    const navigate = useNavigate()

    if (!isGuest || isDismissed) return null

    return (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20 px-4 py-2.5">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-amber-400 font-medium">👋 You're using guest mode</span>
                    <span className="text-slate-400 hidden sm:inline">
                        Your data is stored locally and won't sync across devices.
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate('/register')}
                        className="px-3 py-1.5 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-md transition-colors"
                    >
                        Create Account
                    </button>
                    <button
                        onClick={() => setIsDismissed(true)}
                        className="p-1 text-slate-500 hover:text-slate-400 transition-colors"
                        aria-label="Dismiss"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}
