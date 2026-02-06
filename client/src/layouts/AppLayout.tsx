import { Outlet, Navigate, useLocation } from "react-router-dom"
import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"
import GuestBanner from "@/components/GuestBanner"
import { useAuthStore } from "@/store/authStore"

export default function AppLayout() {
    const token = useAuthStore((state) => state.token)
    const location = useLocation()

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return (
        <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden premium-texture">
            {/* Guest Banner - Full Width */}
            <GuestBanner />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Topbar />

                    <main className="flex-1 p-6 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}

