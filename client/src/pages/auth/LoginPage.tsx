import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Briefcase, Mail, Lock, ArrowRight, Loader2, Zap, Shield, Star, UserCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useAuthStore } from "@/store/authStore"
import { authService } from "@/services/authService"

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const login = useAuthStore((state) => state.login)
    const loginAsGuest = useAuthStore((state) => state.loginAsGuest)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await authService.login(data.email, data.password)
            login(response.user, response.token)
            navigate("/dashboard")
        } catch (err: any) {
            console.error(err)
            const message = err.response?.data?.error || "Login failed. Please try again."
            setError(message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGuestLogin = () => {
        loginAsGuest()
        navigate("/dashboard")
    }

    return (
        <div className="min-h-screen w-full bg-slate-950 flex relative overflow-hidden">
            {/* Noise texture overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-0 opacity-[0.08]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Left Panel - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-slate-900">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 z-0"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>

                {/* Logo & Brand */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
                        <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">CareerFlow</span>
                </div>

                {/* Main Content */}
                <div className="relative z-10 space-y-8 max-w-lg">
                    <h1 className="text-5xl font-bold text-white leading-tight">
                        Welcome Back <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">To Your Dashboard</span>
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Continue tracking your career journey. Your applications, analytics, and insights are waiting for you.
                    </p>

                    {/* Features List */}
                    <div className="grid gap-4 pt-4">
                        {[
                            { icon: Zap, title: "Quick Access", desc: "Jump right back into your workflow" },
                            { icon: Shield, title: "Secure Login", desc: "Your data is always protected" },
                            { icon: Star, title: "Stay Organized", desc: "Never miss an application deadline" }
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <feature.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{feature.title}</h3>
                                    <p className="text-sm text-slate-400">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 pt-8">
                    <p className="text-sm text-slate-500">© 2026 CareerFlow Inc. All rights reserved.</p>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-950 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950/10 to-transparent pointer-events-none"></div>

                <div className="w-full max-w-md space-y-8 relative z-10">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">CareerFlow</span>
                        </div>
                    </div>

                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold text-white">Sign In</h2>
                        <p className="text-slate-400">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                                <input
                                    {...register('email')}
                                    type="email"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-sm"
                                    placeholder="name@company.com"
                                />
                            </div>
                            {errors.email && <span className="text-xs text-red-400 pl-1">{errors.email.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                                <input
                                    {...register('password')}
                                    type="password"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <span className="text-xs text-red-400 pl-1">{errors.password.message}</span>}
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                                <Shield size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                        <p className="text-center text-slate-500 text-sm">
                            Don't have an account?{' '}
                            <button type="button" onClick={() => navigate('/register')} className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors">
                                Create account
                            </button>
                        </p>

                        <div className="relative flex items-center gap-4 py-2">
                            <div className="flex-1 h-px bg-slate-700/50"></div>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">or</span>
                            <div className="flex-1 h-px bg-slate-700/50"></div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGuestLogin}
                            className="w-full py-3 px-6 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 text-slate-300 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <UserCircle size={18} />
                            Continue as Guest
                        </button>
                        <p className="text-center text-slate-600 text-xs">
                            Guest data is stored locally and won't sync across devices
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
