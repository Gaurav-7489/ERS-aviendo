import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

export default function Dashboard() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classId, setClassId] = useState('');
  const [joining, setJoining] = useState(false);
  const [toast, setToast] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', department: '', bio: '' });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const r = await api.get('/users/me');
      setMe(r.data);
      setProfilePic(r.data.profile?.picture || null);
      setCoverPic(r.data.profile?.cover || null);
      setProfileData({
        name: r.data.profile?.name || '',
        department: r.data.profile?.department || '',
        bio: r.data.profile?.bio || '',
      });
    } catch (e) {
      showToast('Failed to load user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(''), 5000);
  };

  const joinClassroom = async () => {
    if (!classId) return showToast('Enter a classroom ID!', 'error');
    setJoining(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return showToast('No token found. Please login again.', 'error');

      const res = await api.post(
        '/api/classroom/join',
        { classId },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setClassId('');
      showToast(res.data.msg);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.msg || 'Failed to join classroom', 'error');
    } finally {
      setJoining(false);
    }
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      // Upload to server
      const formData = new FormData();
      formData.append('profilePic', file);
      try {
        await api.post('/users/upload-profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Profile picture updated!');
      } catch (err) {
        showToast('Failed to upload profile picture', 'error');
      }
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPic(URL.createObjectURL(file));
      // Upload to server
      const formData = new FormData();
      formData.append('coverPic', file);
      try {
        await api.post('/users/upload-cover', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Cover picture updated!');
      } catch (err) {
        showToast('Failed to upload cover picture', 'error');
      }
    }
  };

  const saveProfileData = async () => {
    try {
      await api.put('/users/update-profile', profileData);
      showToast('Profile saved!');
      setEditMode(false);
      fetchUser();
    } catch (err) {
      console.error(err);
      showToast('Failed to save profile', 'error');
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  if (!me) return <div className="p-6 text-gray-500">Login and fill profile to see dashboard</div>;

  const firstTimeSetup = !profileData.name || !profileData.department;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6">
      {/* Background shapes */}
      <motion.div className="absolute w-96 h-96 bg-indigo-200 rounded-full opacity-20 -top-32 -left-32"
        animate={{ rotate: [0, 20, -20, 0], x: [0, 50, -50, 0], y: [0, 30, -30, 0] }}
        transition={{ repeat: Infinity, duration: 40, ease: 'easeInOut' }}
      />
      <motion.div className="absolute w-80 h-80 bg-pink-200 rounded-full opacity-20 -bottom-40 -right-40"
        animate={{ rotate: [0, -25, 25, 0], x: [0, -40, 40, 0], y: [0, -20, 20, 0] }}
        transition={{ repeat: Infinity, duration: 35, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Profile Card */}
        <motion.div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        >
          {/* Cover Image */}
          <div className="h-44 w-full relative cursor-pointer group">
            {coverPic ? (
              <img src={coverPic} alt="Cover" className="w-full h-full object-cover rounded-t-3xl" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center rounded-t-3xl text-white font-bold text-lg">
                Click to add cover
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleCoverUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-60 rounded-t-3xl transition"></div>
          </div>

          {/* Profile Picture */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-36 h-36 rounded-full border-6 border-white bg-purple-500 flex items-center justify-center text-white text-5xl font-bold shadow-xl overflow-hidden cursor-pointer group">
            {profilePic ? <img src={profilePic} alt="Profile" className="w-full h-full object-cover" /> : (profileData.name?.[0] || me.email[0])}
            <input type="file" accept="image/*" onChange={handleProfileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-60 rounded-full transition"></div>
          </div>

          {/* Profile Info */}
          <div className="pt-28 pb-6 px-6 space-y-4">
            {/* First-time setup */}
            {firstTimeSetup || editMode ? (
              <div className="space-y-4">
                <input
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  placeholder="Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
                <input
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  placeholder="Department"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                />
                <textarea
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  placeholder="Bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                />
                <button
                  onClick={saveProfileData}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Save Profile
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-800">{profileData.name}</h2>
                <p className="text-gray-500">{profileData.department}</p>
                <p className="text-gray-600 italic">{profileData.bio || 'No bio yet...'}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  <div className="bg-indigo-50 p-4 rounded-xl shadow transition">
                    <p className="text-sm text-gray-500">CGPA</p>
                    <p className="text-lg font-semibold">{me.profile?.cgpa || '—'}</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-xl shadow transition">
                    <p className="text-sm text-gray-500">Last Exam</p>
                    <p className="text-lg font-semibold">{me.profile?.lastExamScore || '—'}</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-xl shadow transition">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-semibold">{me.email}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Edit Profile
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Join Classroom Section */}
        <motion.div className="p-6 bg-gray-50 rounded-xl shadow-md max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Join a Classroom</h3>
          <input
            placeholder="Enter Classroom ID"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <button
            onClick={joinClassroom}
            disabled={joining}
            className={`w-full py-3 rounded-lg font-semibold text-white ${joining ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {joining ? 'Joining...' : 'Join Classroom'}
          </button>
        </motion.div>
      </div>

      {/* Toast Messages */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className={`fixed bottom-5 right-5 px-5 py-3 rounded-xl shadow-lg z-50 text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
