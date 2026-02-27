import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('Welcome back!');
      if (user.role === 'student') navigate('/student');
      else if (user.role === 'company') navigate('/company');
      else if (user.role === 'admin') navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">EduRecruit</span>
          </Link>

          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Welcome Back to<br />
              <span className="text-primary-light">Campus Recruitment</span>
            </h1>
            <p className="text-white/60 text-lg max-w-md">
              Sign in to access your dashboard and manage your recruitment journey.
            </p>
          </div>

          {/* Footer */}
          <p className="text-white/40 text-sm">
            © 2026 EduRecruit. All rights reserved.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -right-16 w-64 h-64 bg-secondary/10 rounded-full blur-2xl"></div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-dark">EduRecruit</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-dark">Sign in to your account</h2>
            <p className="text-maintext mt-2">Enter your credentials to continue</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-dark/5 border border-border p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Email Address</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-white text-dark placeholder-maintext/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border bg-white text-dark placeholder-maintext/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-maintext hover:text-dark transition-colors"
                  >
                    {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-maintext">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:text-primary-dark transition-colors">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
