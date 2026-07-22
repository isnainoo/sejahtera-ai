import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserPlus, Trash2, Edit2, LogOut, ArrowLeft, 
  Search, ShieldAlert, ShieldCheck, Mail, User, Calendar, 
  UserCheck, RefreshCw, AlertCircle
} from 'lucide-react';
import api from '../services/api';
import logo from '../assets/logosejahtera.png';

export default function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'Laki-laki',
    role: 'user'
  });
  
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Authentication & Role verification
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      navigate('/login');
    } else if (role !== 'admin') {
      navigate('/dashboard');
    } else {
      fetchUsers();
    }
  }, [navigate]);

  // Show auto-dismiss toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Fetch Users list
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data || []);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || 'Gagal mengambil data user', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  // Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    // Validate password
    if (!formData.password || formData.password.length < 8) {
      setFormError('Password wajib diisi dan minimal 8 karakter');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        role: formData.role
      };

      await api.post('/admin/users', payload);
      showToast('User baru berhasil ditambahkan');
      setIsAddModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Terjadi kesalahan saat menambahkan user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit User
  const handleEditUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        role: formData.role
      };

      // Only add password if changed
      if (formData.password) {
        payload.password = formData.password;
      }

      await api.put(`/admin/users/${formData.id}`, payload);
      showToast('Data user berhasil diperbarui');
      setIsEditModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Terjadi kesalahan saat memperbarui user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    setIsSubmitting(true);
    try {
      await api.delete(`/admin/users/${selectedUserId}`);
      showToast('User berhasil dihapus');
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.error || 'Gagal menghapus user', 'error');
      setIsDeleteModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (user) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '', // Leave blank unless changing
      age: user.age,
      gender: user.gender,
      role: user.role
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setSelectedUserId(id);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      password: '',
      age: '',
      gender: 'Laki-laki',
      role: 'user'
    });
    setFormError('');
  };

  // Search filtering
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Math Statistics
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const standardUsersCount = totalUsers - adminCount;
  
  const avgAge = totalUsers > 0 
    ? Math.round(users.reduce((acc, curr) => acc + curr.age, 0) / totalUsers) 
    : 0;

  const maleCount = users.filter(u => u.gender === 'Laki-laki' || u.gender === 'Pria').length;
  const femaleCount = totalUsers - maleCount;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-gray-100">
            <span className="text-xl font-bold text-brand-dark flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain drop-shadow-sm" /> 
              Sejahtera Admin
            </span>
          </div>
          <nav className="p-4 space-y-2 mt-4">
            <a href="/admin" className="flex items-center gap-3 px-4 py-3 bg-brand-light text-brand-dark rounded-xl font-medium">
              <Users size={20} /> Kelola User
            </a>
            <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <ArrowLeft size={20} /> Dashboard User
            </a>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut size={20} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto w-full relative">
        
        {/* Header */}
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <h1 className="text-xl md:text-2xl font-bold text-brand-dark flex items-center gap-2">
            <span className="md:hidden"><img src={logo} alt="Logo" className="w-6 h-6 object-contain" /></span>
            Kelola User
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchUsers}
              className="p-2 text-gray-400 hover:text-brand-dark hover:bg-gray-50 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={20} />
            </button>
            <div className="h-6 w-[1px] bg-gray-200"></div>
            <button 
              onClick={handleLogout}
              className="md:hidden p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Keluar"
            >
              <LogOut size={20} />
            </button>
            <span className="hidden md:inline-block px-3 py-1 bg-brand-light text-brand-dark rounded-full text-xs font-bold uppercase tracking-wider">
              Mode Admin
            </span>
          </div>
        </header>

        {/* Inner Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
          
          {/* Stats Dashboard Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Total Pengguna</p>
              <div className="flex justify-between items-end">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{totalUsers}</h2>
                <div className="p-2 bg-brand-light text-brand-dark rounded-xl">
                  <Users size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Administrator</p>
              <div className="flex justify-between items-end">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{adminCount}</h2>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <ShieldCheck size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Rata-rata Umur</p>
              <div className="flex justify-between items-end">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{avgAge} <span className="text-xs text-gray-400 font-normal">tahun</span></h2>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Calendar size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Pria / Wanita</p>
              <div className="flex justify-between items-end">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{maleCount} / {femaleCount}</h2>
                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                  <UserCheck size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* User Table Header Controls */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari user berdasarkan nama atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all text-sm bg-gray-50/50"
                />
              </div>
              <button
                onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                className="flex items-center justify-center gap-2 bg-[#0F3F2C] hover:bg-[#0a2e1f] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shrink-0"
              >
                <UserPlus size={18} />
                Tambah User
              </button>
            </div>

            {/* Table Content */}
            {isLoading ? (
              <div className="py-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-16 text-center">
                <Users className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 text-sm">Tidak ada data user yang cocok.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="py-4 px-6">Nama</th>
                      <th className="py-4 px-6">Email</th>
                      <th className="py-4 px-6 text-center">Umur</th>
                      <th className="py-4 px-6">Gender</th>
                      <th className="py-4 px-6 text-center">Role</th>
                      <th className="py-4 px-6 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-gray-900">{user.name}</td>
                        <td className="py-4 px-6 text-gray-500">{user.email}</td>
                        <td className="py-4 px-6 text-center">{user.age} tahun</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.gender === 'Laki-laki' || user.gender === 'Pria'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-pink-50 text-pink-600'
                          }`}>
                            {user.gender}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            user.role === 'admin' 
                              ? 'bg-purple-50 text-purple-600' 
                              : 'bg-green-50 text-green-700'
                          }`}>
                            {user.role === 'admin' ? (
                              <>
                                <ShieldCheck size={12} /> admin
                              </>
                            ) : (
                              'user'
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-1.5 text-gray-400 hover:text-brand-green hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit User"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(user.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FLOATING TOASTS */}
      {toast.show && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-white transform transition-all duration-300 scale-100 ${
          toast.type === 'error' 
            ? 'bg-red-600 border-red-500' 
            : 'bg-brand-dark border-brand-green'
        }`}>
          <AlertCircle size={18} />
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* ADD USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-brand-dark text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Tambah User Baru</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/70 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-xs flex items-center gap-2">
                  <ShieldAlert size={14} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Kata Sandi</label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 8 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Umur</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Contoh: 25"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm bg-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Role Akses</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm bg-white"
                >
                  <option value="user">User Biasa</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#0F3F2C] hover:bg-[#0a2e1f] text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-brand-dark text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Edit Data User</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-white/70 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleEditUser} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-xs flex items-center gap-2">
                  <ShieldAlert size={14} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Kata Sandi (Opsional)</label>
                <input
                  type="password"
                  placeholder="Kosongkan jika tidak ingin diubah (min 8 karakter)"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Umur</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Contoh: 25"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm bg-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Role Akses</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm bg-white"
                >
                  <option value="user">User Biasa</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#0F3F2C] hover:bg-[#0a2e1f] text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Perbarui User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE USER CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus User</h3>
            <p className="text-gray-500 text-sm mb-6">
              Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan dan semua data terkait seperti log nutrisi akan dihapus permanen.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2 px-4 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isSubmitting}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
