import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/authStore"
import { authService } from "@/services/authService"
import { useTheme } from "@/components/theme-provider"
import { Loader2, Moon, Sun, Monitor, User, Shield, Palette } from "lucide-react"

// Schemas
const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
})

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'appearance'>('profile')
    const { user, login } = useAuthStore()
    const { theme, setTheme } = useTheme()

    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // Profile Form
    const { register: registerProfile, handleSubmit: handleProfileSubmit } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
        }
    })

    // Password Form
    const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema)
    })

    const onProfileUpdate = async (data: ProfileFormValues) => {
        setIsLoading(true)
        setSuccessMessage(null)
        setErrorMessage(null)
        try {
            const updated = await authService.updateProfile(data)
            // Update local store - assuming login updates the user state
            // In a real app we might want a dedicated updateUser action
            if (user) {
                // We re-login with existing token but new user data to update store
                // A better way would be adding UpdateUser to store, but this works for now
                const token = useAuthStore.getState().token
                if (token) login(updated.user, token)
            }
            setSuccessMessage("Profile updated successfully")
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || "Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    const onPasswordUpdate = async (data: PasswordFormValues) => {
        setIsLoading(true)
        setSuccessMessage(null)
        setErrorMessage(null)
        try {
            await authService.updatePassword(data.currentPassword, data.newPassword)
            setSuccessMessage("Password changed successfully")
            resetPassword()
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || "Failed to update password")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Settings</h3>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="border-b" />

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-1/4">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        <Button
                            variant={activeTab === 'profile' ? "secondary" : "ghost"}
                            className="justify-start w-full"
                            onClick={() => setActiveTab('profile')}
                        >
                            <User className="mr-2 h-4 w-4" /> Profile
                        </Button>
                        <Button
                            variant={activeTab === 'account' ? "secondary" : "ghost"}
                            className="justify-start w-full"
                            onClick={() => setActiveTab('account')}
                        >
                            <Shield className="mr-2 h-4 w-4" /> Account
                        </Button>
                        <Button
                            variant={activeTab === 'appearance' ? "secondary" : "ghost"}
                            className="justify-start w-full"
                            onClick={() => setActiveTab('appearance')}
                        >
                            <Palette className="mr-2 h-4 w-4" /> Appearance
                        </Button>
                    </nav>
                </aside>

                <div className="flex-1 lg:max-w-2xl">
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg flex items-center text-sm font-medium">
                            <span className="mr-2">✓</span> {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center text-sm font-medium">
                            <span className="mr-2">✕</span> {errorMessage}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Profile</h3>
                                <p className="text-sm text-muted-foreground">
                                    Update your personal information.
                                </p>
                            </div>
                            <div className="border-b" />
                            <form onSubmit={handleProfileSubmit(onProfileUpdate)} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" {...registerProfile("firstName")} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" {...registerProfile("lastName")} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" {...registerProfile("email")} />
                                </div>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Profile
                                </Button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Account Security</h3>
                                <p className="text-sm text-muted-foreground">
                                    Change your password to keep your account secure.
                                </p>
                            </div>
                            <div className="border-b" />
                            <form onSubmit={handlePasswordSubmit(onPasswordUpdate)} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input id="currentPassword" type="password" {...registerPassword("currentPassword")} />
                                    {passwordErrors.currentPassword && <p className="text-xs text-red-500">{passwordErrors.currentPassword.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" type="password" {...registerPassword("newPassword")} />
                                    {passwordErrors.newPassword && <p className="text-xs text-red-500">{passwordErrors.newPassword.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input id="confirmPassword" type="password" {...registerPassword("confirmPassword")} />
                                    {passwordErrors.confirmPassword && <p className="text-xs text-red-500">{passwordErrors.confirmPassword.message}</p>}
                                </div>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Change Password
                                </Button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Appearance</h3>
                                <p className="text-sm text-muted-foreground">
                                    Customize the look and feel of the application.
                                </p>
                            </div>
                            <div className="border-b" />
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div
                                        className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors ${theme === 'light' ? 'border-primary' : 'border-transparent bg-muted/20'}`}
                                        onClick={() => setTheme('light')}
                                    >
                                        <Sun className="h-6 w-6" />
                                        <span className="text-sm font-medium">Light</span>
                                    </div>
                                    <div
                                        className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors ${theme === 'dark' ? 'border-primary' : 'border-transparent bg-muted/20'}`}
                                        onClick={() => setTheme('dark')}
                                    >
                                        <Moon className="h-6 w-6" />
                                        <span className="text-sm font-medium">Dark</span>
                                    </div>
                                    <div
                                        className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors ${theme === 'system' ? 'border-primary' : 'border-transparent bg-muted/20'}`}
                                        onClick={() => setTheme('system')}
                                    >
                                        <Monitor className="h-6 w-6" />
                                        <span className="text-sm font-medium">System</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
