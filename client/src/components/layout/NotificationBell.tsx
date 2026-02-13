import { useState, useEffect, useRef } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { reminderService, type DueReminder } from "@/services/reminderService"
import NotificationPanel from "./NotificationPanel"

export default function NotificationBell() {
    const [reminders, setReminders] = useState<DueReminder[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)

    const fetchReminders = async () => {
        try {
            const data = await reminderService.getDueReminders()
            setReminders(data)
        } catch {
            // Silently fail — don't break the UI for notification errors
        }
    }

    useEffect(() => {
        fetchReminders()
        const interval = setInterval(fetchReminders, 60_000) // Poll every 60s
        return () => clearInterval(interval)
    }, [])

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen])

    const handleAcknowledge = async (id: string) => {
        await reminderService.acknowledgeReminder(id)
        setReminders((prev) => prev.filter((r) => r.id !== id))
    }

    return (
        <div className="relative" ref={panelRef}>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                title="Notifications"
                className="relative"
            >
                <Bell className="h-5 w-5" />
                {reminders.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                        {reminders.length > 9 ? "9+" : reminders.length}
                    </span>
                )}
                <span className="sr-only">Notifications</span>
            </Button>

            {isOpen && (
                <NotificationPanel
                    reminders={reminders}
                    onAcknowledge={handleAcknowledge}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}
