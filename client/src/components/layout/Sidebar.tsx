import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Briefcase, Settings, PlusCircle, PieChart } from "lucide-react"
import { useAuthStore } from "@/store/authStore"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Briefcase, label: "Applications", href: "/applications" },
    { icon: PieChart, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
]

export default function Sidebar() {
    const location = useLocation()
    const user = useAuthStore((state) => state.user)

    return (
        <aside className="w-64 border-r bg-card hidden md:flex flex-col">
            <div className="h-16 flex items-center px-6 border-b">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    JobTracker
                </span>
            </div>

            <div className="flex-1 py-6 px-4 space-y-2">
                <div className="mb-6">
                    <Link to="/applications/new">
                        <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md flex items-center justify-center font-medium transition-colors">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Application
                        </button>
                    </Link>
                </div>

                <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-secondary text-secondary-foreground"
                                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                )}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="p-4 border-t">
                <Link to="/profile" className="flex items-center gap-3 p-2 -m-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center font-semibold text-sm text-primary-foreground uppercase">
                        {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">
                            {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                </Link>
            </div>
        </aside>
    )
}
