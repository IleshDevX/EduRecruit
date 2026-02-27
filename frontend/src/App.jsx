import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentJobs from './pages/student/StudentJobs';
import StudentApplications from './pages/student/StudentApplications';

// Company pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import PostJob from './pages/company/PostJob';
import CompanyJobs from './pages/company/CompanyJobs';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminJobs from './pages/admin/AdminJobs';
import AdminApplications from './pages/admin/AdminApplications';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#FDE8D3',
              color: '#2D3A2E',
              borderRadius: '12px',
              border: '1px solid #DAEBE8',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#4CAF50', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#F44336', secondary: '#fff' },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="jobs" element={<StudentJobs />} />
            <Route path="applications" element={<StudentApplications />} />
          </Route>

          {/* Company Routes */}
          <Route
            path="/company"
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CompanyDashboard />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="jobs" element={<CompanyJobs />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="applications" element={<AdminApplications />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
