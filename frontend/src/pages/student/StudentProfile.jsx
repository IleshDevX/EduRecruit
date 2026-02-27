import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineAcademicCap, 
  HiOutlineDocumentText,
  HiOutlineUpload,
  HiOutlineCheck,
  HiOutlinePencil
} from 'react-icons/hi';

const StudentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    cgpa: '',
    backlogs: '',
    skills: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/student/profile');
      setProfile(res.data);
      setFormData({
        name: res.data.user?.name || '',
        branch: res.data.branch || '',
        cgpa: res.data.cgpa || '',
        backlogs: res.data.backlogs ?? '',
        skills: res.data.skills || '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/student/profile', formData);
      toast.success('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    const formDataFile = new FormData();
    formDataFile.append('resume', file);

    try {
      await api.post('/student/resume', formDataFile, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Resume uploaded successfully!');
      fetchProfile();
    } catch (err) {
      toast.error('Failed to upload resume');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">My Profile</h1>
          <p className="text-maintext mt-1">Manage your profile information</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            <HiOutlinePencil className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-border p-8 shadow-sm text-center"
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-lg shadow-primary/30">
              {profile?.user?.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <h2 className="text-xl font-bold text-dark">{profile?.user?.name || 'Student'}</h2>
            <p className="text-maintext text-sm mb-4">{profile?.user?.email}</p>
            
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                {profile?.branch || 'No Branch'}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-primary">{profile?.cgpa || 'N/A'}</p>
                <p className="text-xs text-maintext">CGPA</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{profile?.backlogs ?? 'N/A'}</p>
                <p className="text-xs text-maintext">Backlogs</p>
              </div>
            </div>
          </motion.div>

          {/* Resume Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-border p-6 shadow-sm mt-6"
          >
            <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
              <HiOutlineDocumentText className="w-5 h-5 text-primary" />
              Resume
            </h3>
            
            {profile?.resumeUrl ? (
              <div className="space-y-3">
                <a
                  href={`http://localhost:5000${profile.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-success/10 border border-success/20 text-success hover:bg-success/20 transition-colors"
                >
                  <HiOutlineCheck className="w-5 h-5" />
                  <span className="text-sm font-medium">Resume Uploaded</span>
                </a>
                <label className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-border rounded-xl text-maintext hover:border-primary hover:text-primary cursor-pointer transition-colors">
                  <HiOutlineUpload className="w-4 h-4" />
                  <span className="text-sm font-medium">Replace Resume</span>
                  <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-xl text-maintext hover:border-primary hover:text-primary cursor-pointer transition-colors">
                <HiOutlineUpload className="w-8 h-8" />
                <span className="text-sm font-medium">Upload Resume (PDF)</span>
                <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
              </label>
            )}
          </motion.div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-border p-8 shadow-sm"
        >
          <h3 className="font-bold text-dark text-lg mb-6">Profile Information</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Full Name</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editing}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-white text-dark placeholder-maintext/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-background disabled:text-maintext transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Email</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
                  <input
                    type="email"
                    value={profile?.user?.email || ''}
                    disabled
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-maintext"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Branch</label>
                <div className="relative">
                  <HiOutlineAcademicCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    disabled={!editing}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-white text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-background disabled:text-maintext transition-all appearance-none"
                  >
                    <option value="">Select Branch</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-dark placeholder-maintext/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-background disabled:text-maintext transition-all"
                  placeholder="e.g., 8.5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Backlogs</label>
                <input
                  type="number"
                  min="0"
                  value={formData.backlogs}
                  onChange={(e) => setFormData({ ...formData, backlogs: e.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-dark placeholder-maintext/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-background disabled:text-maintext transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Skills</label>
              <textarea
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                disabled={!editing}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-dark placeholder-maintext/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-background disabled:text-maintext transition-all resize-none"
                placeholder="e.g., React, Node.js, Python, Machine Learning"
              />
              <p className="text-xs text-maintext mt-1">Separate skills with commas</p>
            </div>

            {editing && (
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 transition-all"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    fetchProfile();
                  }}
                  className="px-6 py-3 bg-background text-maintext rounded-xl font-semibold hover:bg-border transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProfile;
