import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import type { DueReminder } from "@/services/reminderService"

interface NotificationPanelProps {
    reminders: DueReminder[]
    onAcknowledge: (id: string) => void
}

export default function NotificationPanel({ reminders, onAcknowledge }: NotificationPanelProps) {

    return (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 max-h-[28rem] overflow-y-auto rounded-xl border bg-card shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="border-b px-4 py-3">
                <h3 className="font-semibold text-sm">Follow-up Reminders</h3>
            </div>

            {/* Info Banner */}
            <div className="mx-3 mt-3 mb-2 flex items-start gap-2 rounded-lg border border-border/50 bg-muted/50 px-3 py-2">
                <Info className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Manage reminders by editing your applications
                </p>
            </div>

            {/* Reminder List */}
            {reminders.length === 0 ? (
                <div className="px-4 py-8 text-center">
                    <p className="text-sm text-muted-foreground">🎉 All caught up! No reminders due.</p>
                </div>
            ) : (
                <div className="p-2 space-y-2">
                    {reminders.map((reminder) => (
                        <div
                            key={reminder.id}
                            className="rounded-lg border bg-background p-3 space-y-2.5 transition-colors hover:bg-muted/30"
                        >
                            <p className="text-xs text-muted-foreground">
                                Did you catch-up with this job application?
                            </p>
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium">{reminder.companyName}</p>
                                <p className="text-xs text-muted-foreground">{reminder.positionTitle}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="default"
                                    className="flex-1 text-xs h-8"
                                    onClick={() => onAcknowledge(reminder.id)}
                                >
                                    Will catch-up RIGHT NOW!
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 text-xs h-8"
                                    onClick={() => onAcknowledge(reminder.id)}
                                >
                                    Yes, done mate
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
