import { Moon, Sun, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useAuthStore } from "@/store/authStore"
import { useNavigate } from "react-router-dom"

export default function Topbar() {
    const { theme, setTheme } = useTheme()
    const logout = useAuthStore((state) => state.logout)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <header className="h-16 border-b bg-card px-6 flex items-center justify-end">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    title="Log out"
                    className="text-muted-foreground hover:text-destructive"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Log out</span>
                </Button>
            </div>
        </header>
    )
}
