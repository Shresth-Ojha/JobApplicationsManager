import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { setLoading, setError, setUser } from '../store/slices/authSlice';
import { useAuthError, useAuthLoading } from '../hooks/useAuthSelectors';
import { apiClient } from '../services/api';
import { Check, X, Mail, Lock, User, Briefcase, ArrowRight, Eye, EyeOff } from 'lucide-react';

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
    { label: 'At least 8 characters', passed: password.length >= 8 },
    { label: 'Uppercase letter', passed: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', passed: /[a-z]/.test(password) },
    { label: 'Number', passed: /[0-9]/.test(password) },
    { label: 'Special character', passed: /[!@#$%^&*]/.test(password) },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const strengthPercent = (passedCount / checks.length) * 100;
  const strengthColor =
    strengthPercent === 100
      ? 'from-green-500 to-green-400'
      : strengthPercent >= 60
        ? 'from-yellow-500 to-yellow-400'
        : 'from-red-500 to-red-400';

  return (
    <div className="space-y-4 mt-4 p-4 bg-white/5 border border-white/10 rounded-xl">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Password Strength</span>
          <span className={`text-xs font-bold ${strengthPercent === 100 ? 'text-green-400' : strengthPercent >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
            {strengthPercent === 100 ? '🔒 Strong' : strengthPercent >= 60 ? '⚡ Good' : '⚠️ Weak'}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className={`h-full bg-gradient-to-r ${strengthColor} transition-all duration-500`} style={{ width: `${strengthPercent}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-2">
            {check.passed ? (
              <Check size={16} className="text-green-400 flex-shrink-0" />
            ) : (
              <X size={16} className="text-gray-500 flex-shrink-0" />
            )}
            <span className={`text-xs font-medium ${check.passed ? 'text-green-300' : 'text-gray-400'}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useAuthLoading();
  const error = useAuthError();
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
    dispatch(setLoading(true));
    try {
      const response = await apiClient.register(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
      );
      if (response.success && response.data) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        dispatch(setUser(response.data.user));
        navigate('/');
      }
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Registration failed. Please try again.';
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium animated gradient orbs background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Premium split design container */}
        <div className="space-y-0">
          {/* Top gradient accent bar */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-t-3xl shadow-lg shadow-blue-500/50"></div>

          {/* Main glassmorphic card */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 rounded-b-3xl border border-white/20 shadow-2xl shadow-black/20 p-8 md:p-10 space-y-8">

            {/* Header section with logo */}
            <div className="text-center space-y-5">
              {/* Animated logo badge */}
              <div className="flex justify-center">
                <div className="p-4 bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 rounded-2xl shadow-xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all transform hover:scale-105 duration-300">
                  <Briefcase className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Brand name with gradient text */}
              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-white bg-clip-text text-transparent drop-shadow-lg">
                  CareerFlow
                </h1>
                <p className="text-gray-300 text-sm font-light tracking-widest uppercase letter-spacing">
                  Start Your Journey Today
                </p>
              </div>
            </div>

            {/* Welcome message card */}
            <div className="bg-gradient-to-r from-blue-500/15 to-cyan-500/15 border border-white/15 rounded-2xl p-5 space-y-2 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white">Create Your Account</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Join thousands of professionals managing their career effortlessly.
              </p>
            </div>

            {/* Form section */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-gray-200 text-sm font-semibold block uppercase tracking-wider">
                    First Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-15 transition duration-300 blur"></div>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition duration-300" />
                      <input
                        {...register('firstName')}
                        type="text"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-white/30 focus:bg-white/10 transition duration-300"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  {errors.firstName && (
                    <p className="text-sm text-red-400 font-medium flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-gray-200 text-sm font-semibold block uppercase tracking-wider">
                    Last Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-15 transition duration-300 blur"></div>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition duration-300" />
                      <input
                        {...register('lastName')}
                        type="text"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-white/30 focus:bg-white/10 transition duration-300"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  {errors.lastName && (
                    <p className="text-sm text-red-400 font-medium flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email field */}
              <div className="space-y-3">
                <label className="text-gray-200 text-sm font-semibold block uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-15 transition duration-300 blur"></div>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition duration-300" />
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-white/30 focus:bg-white/10 transition duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                {errors.email && (
                  <p className="text-sm text-red-400 font-medium flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-3">
                <label className="text-gray-200 text-sm font-semibold block uppercase tracking-wider">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-15 transition duration-300 blur"></div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition duration-300" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-white/30 focus:bg-white/10 transition duration-300"
                      placeholder="••••••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-gray-400 hover:text-white transition focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                {password && <PasswordStrength password={password} />}
                {errors.password && (
                  <p className="text-sm text-red-400 font-medium flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm password field */}
              <div className="space-y-3">
                <label className="text-gray-200 text-sm font-semibold block uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-15 transition duration-300 blur"></div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition duration-300" />
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-white/30 focus:bg-white/10 transition duration-300"
                      placeholder="••••••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 text-gray-400 hover:text-white transition focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400 font-medium flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  {...register('agreeToTerms')}
                  type="checkbox"
                  className="w-5 h-5 rounded bg-white/5 border border-white/20 text-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer accent-blue-500 mt-0.5"
                />
                <span className="text-sm text-gray-300 group-hover:text-gray-200 transition">
                  I agree to the <span className="text-blue-300 hover:text-blue-200 font-semibold">Terms of Service</span> and <span className="text-blue-300 hover:text-blue-200 font-semibold">Privacy Policy</span>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-400 font-medium flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  {errors.agreeToTerms.message}
                </p>
              )}

              {/* Error notification */}
              {error && (
                <div className="p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm font-medium animate-pulse">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">❌</span>
                    <div>
                      <p className="font-semibold">Registration Failed</p>
                      <p className="text-red-200 mt-1 text-xs">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Create account button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-3.5 px-6 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-[1.02] active:scale-95 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group uppercase tracking-wider text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition transform" />
                  </>
                )}
              </button>
            </form>

            {/* Elegant divider */}
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="relative px-4 text-gray-400 text-xs font-bold uppercase bg-gradient-to-br from-white/10 to-white/5 rounded-full">
                Already have an account?
              </span>
            </div>

            {/* Sign in button */}
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 px-6 border-2 border-white/30 hover:border-white/50 text-white font-bold rounded-xl hover:bg-white/10 transition duration-300 backdrop-blur-sm uppercase tracking-wider text-sm"
            >
              Sign In Instead
            </button>
          </div>

          {/* Bottom gradient accent bar */}
          <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-b-3xl shadow-lg shadow-cyan-500/50"></div>
        </div>

        {/* Footer section */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-gray-500 text-xs font-light tracking-widest uppercase">
            © 2026 CareerFlow. All Rights Reserved
          </p>
          <p className="text-gray-600 text-xs font-light">
            Your secure job application tracker
          </p>
        </div>
      </div>
    </div>
  );
}
