import { useState, useEffect, useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineOfficeBuilding,
  HiOutlineSearch,
  HiOutlineBell,
  HiChevronDown,
  HiOutlineCheck,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

const studentLinks = [
  { to: '/student', icon: HiOutlineHome, label: 'Dashboard', end: true },
  { to: '/student/profile', icon: HiOutlineUser, label: 'My Profile' },
  { to: '/student/jobs', icon: HiOutlineBriefcase, label: 'Browse Jobs' },
  { to: '/student/applications', icon: HiOutlineClipboardList, label: 'Applications' },
];

const companyLinks = [
  { to: '/company', icon: HiOutlineHome, label: 'Dashboard', end: true },
  { to: '/company/post-job', icon: HiOutlineDocumentText, label: 'Post Job' },
  { to: '/company/jobs', icon: HiOutlineBriefcase, label: 'My Jobs' },
];

const adminLinks = [
  { to: '/admin', icon: HiOutlineHome, label: 'Dashboard', end: true },
  { to: '/admin/companies', icon: HiOutlineOfficeBuilding, label: 'Companies' },
  { to: '/admin/jobs', icon: HiOutlineBriefcase, label: 'All Jobs' },
  { to: '/admin/applications', icon: HiOutlineClipboardList, label: 'Applications' },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notifDropdown, setNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const links = user?.role === 'student'
    ? studentLinks
    : user?.role === 'company'
    ? companyLinks
    : adminLinks;

  const roleLabel = user?.role === 'admin' ? 'Administrator' : user?.role === 'company' ? 'Recruiter' : 'Student';
  const roleColor = user?.role === 'admin' ? 'bg-secondary' : user?.role === 'company' ? 'bg-accent' : 'bg-primary';

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        api.get('/notifications'),
        api.get('/notifications/unread-count')
      ]);
      setNotifications(notifRes.data);
      setUnreadCount(countRes.data.count);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAsRead = async (notifId) => {
    try {
      await api.put(`/notifications/${notifId}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === notifId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_status':
        return <HiOutlineClipboardList className="w-5 h-5" />;
      case 'new_job':
        return <HiOutlineBriefcase className="w-5 h-5" />;
      case 'company_approved':
        return <HiOutlineCheckCircle className="w-5 h-5" />;
      case 'new_applicant':
        return <HiOutlineUser className="w-5 h-5" />;
      default:
        return <HiOutlineBell className="w-5 h-5" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-sidebar flex flex-col transform lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ transition: 'transform 0.3s ease' }}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">EduRecruit</h1>
              <p className="text-xs text-white/50">Placement Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <p className="px-4 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">Menu</p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white border-b border-border">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-background transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <HiOutlineX className="w-6 h-6 text-dark" /> : <HiOutlineMenu className="w-6 h-6 text-dark" />}
            </button>

            {/* Search Bar (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-background border border-border text-dark placeholder-maintext focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setNotifDropdown(!notifDropdown);
                    setProfileDropdown(false);
                  }}
                  className="relative p-2.5 rounded-xl hover:bg-background transition-colors"
                >
                  <HiOutlineBell className="w-5 h-5 text-maintext" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-danger text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                <AnimatePresence>
                  {notifDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-96 sm:w-[480px] bg-white rounded-2xl shadow-2xl border border-border overflow-hidden z-[100]"
                    >
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-background/50">
                        <h3 className="font-semibold text-dark">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                          >
                            <HiOutlineCheck className="w-3.5 h-3.5" />
                            Mark all read
                          </button>
                        )}
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-[500px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-12 text-center">
                            <HiOutlineBell className="w-12 h-12 mx-auto text-maintext/30 mb-3" />
                            <p className="text-maintext text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => !notif.read && markAsRead(notif.id)}
                              className={`px-4 py-3 border-b border-border/50 hover:bg-background/50 cursor-pointer transition-colors ${
                                !notif.read ? 'bg-primary/5' : ''
                              }`}
                            >
                              <div className="flex gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                  notif.type === 'application_status' 
                                    ? notif.data?.status === 'Selected' 
                                      ? 'bg-success/10 text-success'
                                      : notif.data?.status === 'Rejected'
                                        ? 'bg-danger/10 text-danger'
                                        : 'bg-info/10 text-info'
                                    : 'bg-primary/10 text-primary'
                                }`}>
                                  {getNotificationIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className={`text-sm ${!notif.read ? 'font-semibold text-dark' : 'text-maintext'}`}>
                                      {notif.title}
                                    </p>
                                    {!notif.read && (
                                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></span>
                                    )}
                                  </div>
                                  <p className="text-xs text-maintext line-clamp-2 mt-0.5">{notif.message}</p>
                                  <p className="text-xs text-maintext/60 mt-1">{formatTime(notif.createdAt)}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-border bg-background/50 text-center">
                          <button
                            onClick={() => {
                              setNotifDropdown(false);
                              navigate(user?.role === 'student' ? '/student/applications' : '/company/jobs');
                            }}
                            className="text-sm text-primary hover:text-primary-dark font-medium"
                          >
                            View all activity
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileDropdown(!profileDropdown);
                    setNotifDropdown(false);
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-background transition-colors"
                >
                  <div className={`w-9 h-9 rounded-xl ${roleColor} flex items-center justify-center text-white font-semibold text-sm shadow-md`}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-dark">{user?.name?.split(' ')[0]}</p>
                    <p className="text-xs text-maintext">{roleLabel}</p>
                  </div>
                  <HiChevronDown className="hidden md:block w-4 h-4 text-maintext" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-border py-2 z-[100]"
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-dark">{user?.name}</p>
                        <p className="text-xs text-maintext truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLogout();
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-danger hover:bg-danger/5 transition-colors flex items-center gap-2"
                        >
                          <HiOutlineLogout className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Click outside to close dropdowns */}
      {(profileDropdown || notifDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setProfileDropdown(false);
            setNotifDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
