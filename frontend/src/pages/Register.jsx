import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineEye, 
  HiOutlineEyeOff,
  HiOutlineUser,
  HiOutlineOfficeBuilding,
  HiOutlineAcademicCap,
  HiOutlineBriefcase
} from 'react-icons/hi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    companyName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role, companyName } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (role === 'company' && !companyName) {
      toast.error('Please enter company name');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
        role,
        companyName: role === 'company' ? companyName : undefined,
      });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent"></div>
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
              Join EduRecruit<br />
              <span className="text-primary-light">Start Your Journey</span>
            </h1>
            <p className="text-white/60 text-lg max-w-md">
              Create your account and connect with top opportunities or find the best talent.
            </p>
            
            {/* Features */}
            <div className="space-y-3 pt-4">
              {[
                { icon: HiOutlineAcademicCap, text: 'Students: Access exclusive job listings' },
                { icon: HiOutlineBriefcase, text: 'Companies: Post jobs and find talent' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/70">
                  <item.icon className="w-5 h-5 text-primary-light" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/40 text-sm">
            © 2026 EduRecruit. All rights reserved.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -right-16 w-64 h-64 bg-accent/10 rounded-full blur-2xl"></div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md py-8"
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
            <h2 className="text-2xl font-bold text-dark">Create your account</h2>
            <p className="text-maintext mt-2">Get started in just a few steps</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-dark/5 border border-border p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-3">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'student', label: 'Student', icon: HiOutlineAcademicCap },
                    { value: 'company', label: 'Recruiter', icon: HiOutlineOfficeBuilding },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: option.value })}
                      className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 font-medium transition-all ${
                        formData.role === option.value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-maintext hover:border-primary/50'
                      }`}
                    >
                      <option.icon className="w-5 h-5" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Full Name</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-white text-dark placeholder-maintext/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {formData.role === 'company' && (
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Company Name</label>
                  <div className="relative">
                    <HiOutlineOfficeBuilding className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Your Company"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-white text-dark placeholder-maintext/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Email Address</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Confirm Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-white text-dark placeholder-maintext/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
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
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-maintext">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-primary-dark transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
