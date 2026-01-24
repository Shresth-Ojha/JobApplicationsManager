import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { setLoading, setError, setUser } from '../store/slices/authSlice';
import { useAuthError, useAuthLoading } from '../hooks/useAuthSelectors';
import { apiClient } from '../services/api';
import { Mail, Lock, Briefcase, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useAuthLoading();
  const error = useAuthError();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    dispatch(setLoading(true));
    try {
      const response = await apiClient.login(data.email, data.password);
      if (response.success && response.data) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        dispatch(setUser(response.data.user));
        navigate('/');
      }
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Login failed. Please try again.';
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
                  Master Your Job Search
                </p>
              </div>
            </div>

            {/* Welcome message card */}
            <div className="bg-gradient-to-r from-blue-500/15 to-cyan-500/15 border border-white/15 rounded-2xl p-5 space-y-2 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white">Welcome Back</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Sign in to your account and continue managing your job applications with confidence.
              </p>
            </div>

            {/* Form section */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Email field with icon */}
              <div className="space-y-3">
                <label className="text-gray-200 text-sm font-semibold block uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  {/* Gradient glow on hover */}
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
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400 font-medium flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password field with icon */}
              <div className="space-y-3">
                <label className="text-gray-200 text-sm font-semibold block uppercase tracking-wider">
                  Password
                </label>
                <div className="relative group">
                  {/* Gradient glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-15 transition duration-300 blur"></div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition duration-300" />
                    <input
                      {...register('password')}
                      type="password"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-white/30 focus:bg-white/10 transition duration-300"
                      placeholder="••••••••••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-400 font-medium flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Error notification */}
              {error && (
                <div className="p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm font-medium animate-pulse">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">❌</span>
                    <div>
                      <p className="font-semibold">Login Failed</p>
                      <p className="text-red-200 mt-1 text-xs">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sign in button with animation */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-3.5 px-6 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-[1.02] active:scale-95 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group uppercase tracking-wider text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition transform" />
                  </>
                )}
              </button>
            </form>

            {/* Elegant divider */}
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="relative px-4 text-gray-400 text-xs font-bold uppercase bg-gradient-to-br from-white/10 to-white/5 rounded-full">
                Don't have an account?
              </span>
            </div>

            {/* Register button */}
            <button
              onClick={() => navigate('/register')}
              className="w-full py-3.5 px-6 border-2 border-white/30 hover:border-white/50 text-white font-bold rounded-xl hover:bg-white/10 transition duration-300 backdrop-blur-sm uppercase tracking-wider text-sm"
            >
              Create Account
            </button>

            {/* Premium demo credentials card */}
            <div className="relative p-5 bg-gradient-to-br from-amber-500/15 to-orange-500/15 border border-amber-500/40 rounded-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-10 transition duration-300"></div>
              <div className="relative space-y-4">
                <p className="text-amber-300 text-xs font-bold uppercase tracking-widest drop-shadow">🎯 Demo Credentials</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="text-gray-300 font-semibold">Email:</span>
                    <code className="text-amber-200 font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-amber-500/20">newuser@example.com</code>
                  </div>
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="text-gray-300 font-semibold">Password:</span>
                    <code className="text-amber-200 font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-amber-500/20">Password123!</code>
                  </div>
                </div>
              </div>
            </div>
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
