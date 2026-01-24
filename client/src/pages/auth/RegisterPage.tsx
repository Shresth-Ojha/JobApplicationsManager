import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Mail, Lock, User, Briefcase, ArrowRight, Eye, EyeOff, Star, Shield, Zap } from 'lucide-react';
import { useAuthStore } from "@/store/authStore"
import { authService } from "@/services/authService"
import { applicationService } from "@/services/applicationService"

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

function PasswordStrength({ password }: { password: string }) {
    const checks = [
        { label: '8+ chars', passed: password.length >= 8 },
        { label: 'Uppercase', passed: /[A-Z]/.test(password) },
        { label: 'Lowercase', passed: /[a-z]/.test(password) },
        { label: 'Number', passed: /[0-9]/.test(password) },
        { label: 'Special', passed: /[!@#$%^&*]/.test(password) },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const strengthPercent = (passedCount / checks.length) * 100;
    const strengthColor =
        strengthPercent === 100
            ? 'from-emerald-500 to-green-500'
            : strengthPercent >= 60
                ? 'from-yellow-500 to-orange-500'
                : 'from-red-500 to-pink-600';

    return (
        <div className="space-y-3 mt-2 p-3 bg-white/5 border border-white/5 rounded-lg">
            <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-400">Strength</span>
                <span className={`font-bold ${strengthPercent === 100 ? 'text-emerald-400' : strengthPercent >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {strengthPercent === 100 ? 'Excellent' : strengthPercent >= 60 ? 'Good' : 'Weak'}
                </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${strengthColor} transition-all duration-500`} style={{ width: `${strengthPercent}%` }} />
            </div>
            <div className="flex flex-wrap gap-2">
                {checks.map((check) => (
                    <div key={check.label} className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border ${check.passed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                        {check.passed ? <Check size={10} strokeWidth={3} /> : <div className="w-2.5 h-2.5 rounded-full bg-white/10" />}
                        {check.label}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const isGuest = useAuthStore((state) => state.isGuest);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const password = watch('password');

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setError(null);

        // Get guest applications before registering (if any)
        const guestAppsData = localStorage.getItem('guest-applications');
        const guestApps = guestAppsData ? JSON.parse(guestAppsData) : [];
        const wasGuest = isGuest;

        try {
            const response = await authService.register(
                data.email,
                data.password,
                data.firstName,
                data.lastName,
            );
            login(response.user, response.token);

            // Migrate guest applications to the new account
            if (wasGuest && guestApps.length > 0) {
                for (const app of guestApps) {
                    try {
                        await applicationService.create({
                            companyName: app.companyName,
                            positionTitle: app.positionTitle,
                            jobDescription: app.jobDescription,
                            jobUrl: app.jobUrl,
                            locationCity: app.locationCity,
                            notes: app.notes,
                            status: app.status,
                            priority: app.priority,
                        });
                    } catch (migrationError) {
                        console.error('Failed to migrate application:', migrationError);
                    }
                }
                // Clear guest applications after migration
                localStorage.removeItem('guest-applications');
            }

            navigate('/');
        } catch (err: any) {
            const message = err.response?.data?.error || 'Registration failed. Please try again.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 flex relative overflow-hidden">
            {/* Noise texture overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-0 opacity-[0.08]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Left Panel - Branding & Features (Hidden on mobile) */}
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
                        Elevate Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Career Journey</span>
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Join thousands of ambitious professionals who are taking control of their job search with our intelligent tracking platform.
                    </p>

                    {/* Features List */}
                    <div className="grid gap-6 pt-4">
                        {[
                            { icon: Zap, title: "Smart Tracking", desc: "Automated updates & reminders" },
                            { icon: Shield, title: "Data Privacy", desc: "Your career data is secure" },
                            { icon: Star, title: "Premium Tools", desc: "Analytics & resume insights" }
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

            {/* Right Panel - Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-950 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950/10 to-transparent pointer-events-none"></div>

                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold text-white">Create Account</h2>
                        <p className="text-slate-400">Get started with your free account today</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                                    <input
                                        {...register('firstName')}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-sm"
                                        placeholder="John"
                                    />
                                </div>
                                {errors.firstName && <span className="text-xs text-red-400 pl-1">{errors.firstName.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">Last Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                                    <input
                                        {...register('lastName')}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-sm"
                                        placeholder="Doe"
                                    />
                                </div>
                                {errors.lastName && <span className="text-xs text-red-400 pl-1">{errors.lastName.message}</span>}
                            </div>
                        </div>

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
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full pl-10 pr-10 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-sm"
                                    placeholder="Min. 8 characters"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {password && <PasswordStrength password={password} />}
                            {errors.password && <span className="text-xs text-red-400 pl-1">{errors.password.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                                <input
                                    {...register('confirmPassword')}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="w-full pl-10 pr-10 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-sm"
                                    placeholder="Retype password"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className="text-xs text-red-400 pl-1">{errors.confirmPassword.message}</span>}
                        </div>

                        <div className="pt-2">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    {...register('agreeToTerms')}
                                    type="checkbox"
                                    className="w-4 h-4 mt-0.5 rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-blue-500/20"
                                />
                                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                                    I agree to the <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline">Privacy Policy</a>
                                </span>
                            </label>
                            {errors.agreeToTerms && <p className="text-xs text-red-400 mt-1 pl-7">{errors.agreeToTerms.message}</p>}
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
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                        <p className="text-center text-slate-500 text-sm">
                            Already have an account?{' '}
                            <button onClick={() => navigate('/login')} className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors">
                                Sign in
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
