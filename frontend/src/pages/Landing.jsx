import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiOutlineAcademicCap, 
  HiOutlineBriefcase, 
  HiOutlineShieldCheck, 
  HiOutlineChartBar, 
  HiOutlineUserGroup, 
  HiOutlineClipboardCheck,
  HiOutlineCheckCircle,
  HiOutlineLightningBolt,
  HiOutlineGlobe,
  HiArrowRight
} from 'react-icons/hi';

const features = [
  { 
    icon: HiOutlineAcademicCap, 
    title: 'Student Portal', 
    desc: 'Browse opportunities, apply with one click, and track your application status in real-time.',
    color: 'bg-primary/10 text-primary'
  },
  { 
    icon: HiOutlineBriefcase, 
    title: 'Recruiter Portal', 
    desc: 'Post jobs, define eligibility criteria, and efficiently manage your talent pipeline.',
    color: 'bg-secondary/10 text-secondary'
  },
  { 
    icon: HiOutlineShieldCheck, 
    title: 'Admin Dashboard', 
    desc: 'Approve companies, monitor placements, and maintain oversight of the entire process.',
    color: 'bg-accent/10 text-accent'
  },
  { 
    icon: HiOutlineLightningBolt, 
    title: 'Smart Matching', 
    desc: 'Automatic eligibility verification based on CGPA, branch, and academic requirements.',
    color: 'bg-warning/10 text-warning'
  },
  { 
    icon: HiOutlineChartBar, 
    title: 'Analytics', 
    desc: 'Comprehensive insights and statistics for informed decision making.',
    color: 'bg-info/10 text-info'
  },
  { 
    icon: HiOutlineGlobe, 
    title: 'Secure Platform', 
    desc: 'Enterprise-grade security with role-based access control and JWT authentication.',
    color: 'bg-success/10 text-success'
  },
];

const stats = [
  { value: '500+', label: 'Students Placed' },
  { value: '50+', label: 'Partner Companies' },
  { value: '200+', label: 'Job Postings' },
  { value: '95%', label: 'Success Rate' },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-dark">EduRecruit</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-semibold text-dark hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 gradient-hero"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwRjc2NkUiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                <HiOutlineLightningBolt className="w-4 h-4" />
                Campus Recruitment Platform
              </span>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-dark leading-tight mb-6">
                Transform Your
                <span className="text-primary"> Campus Placements</span>
              </h1>
              <p className="text-lg text-maintext mb-8 max-w-xl">
                EduRecruit connects students with leading employers through a streamlined, 
                transparent recruitment process. Track applications, manage eligibility, 
                and secure your future — all in one powerful platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/25 transition-all group"
                >
                  Start Free
                  <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-dark rounded-xl font-semibold text-lg border-2 border-border hover:border-primary hover:text-primary transition-all"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>

            {/* Right - Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg shadow-dark/5 border border-border hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <p className="text-3xl lg:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-sm text-maintext font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-dark mt-3 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-maintext max-w-2xl mx-auto text-lg">
              A complete recruitment platform designed for students, recruiters, and placement administrators.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group bg-white rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-dark text-xl mb-3">{feature.title}</h3>
                <p className="text-maintext leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Process</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-dark mt-3 mb-4">
              Simple & Streamlined
            </h2>
            <p className="text-maintext max-w-2xl mx-auto text-lg">
              From registration to placement in four easy steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Register', desc: 'Create your profile as a student or recruiter' },
              { step: '02', title: 'Apply', desc: 'Students apply to jobs matching their profile' },
              { step: '03', title: 'Review', desc: 'Recruiters review and shortlist candidates' },
              { step: '04', title: 'Select', desc: 'Final selection and placement confirmation' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-dark text-lg mb-2">{item.title}</h3>
                <p className="text-maintext text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-sidebar">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Recruitment?
            </h2>
            <p className="text-white/70 mb-10 max-w-2xl mx-auto text-lg">
              Join thousands of students and companies already using EduRecruit 
              for seamless campus placements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary-light hover:shadow-xl transition-all group"
              >
                Create Free Account
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
              </div>
              <span className="font-bold text-dark">EduRecruit</span>
            </div>
            <p className="text-sm text-maintext">
              © 2026 EduRecruit — Campus Recruitment Management Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
