import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Utensils, Activity, HelpCircle, 
  User, Mail, Calendar, Users, Ruler, Lock, ShieldCheck, Save, Sparkles, CheckCircle2, LogOut,
  Eye, EyeOff 
} from 'lucide-react';
import api from '../services/api';
import logo from '../assets/logosejahtera.png';

export default function Profile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPass, setIsSavingPass] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passMessage, setPassMessage] = useState({ type: '', text: '' });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    height: ''
  });

  const [passData, setPassData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const res = await api.get('/profile');
      const data = res.data;
      setFormData({
        name: data.name || '',
        email: data.email || '',
        age: data.age || '',
        gender: data.gender || '',
        height: data.profile?.height || data.height || ''
      });
    } catch (err) {
      console.error("Gagal menarik data profil:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
    setPassMessage({ type: '', text: '' });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseFloat(formData.height)
      };
      
      await api.put('/profile', payload);
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Gagal memperbarui profil.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (passData.newPassword !== passData.confirmPassword) {
      setPassMessage({ type: 'error', text: 'Password baru dan konfirmasi tidak cocok!' });
      return;
    }
    if (passData.newPassword.length < 8) {
      setPassMessage({ type: 'error', text: 'Password minimal 8 karakter!' });
      return;
    }

    setIsSavingPass(true);
    try {
      await api.put('/profile/password', {
        old_password: passData.oldPassword,
        new_password: passData.newPassword
      });
      setPassMessage({ type: 'success', text: 'Password berhasil diubah!' });
      setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassMessage({ type: 'error', text: err.response?.data?.error || 'Gagal mengubah password.' });
    } finally {
      setIsSavingPass(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(' ');
    if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center px-8 border-b border-gray-100 shrink-0">
            <span className="text-xl font-bold text-brand-dark flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain drop-shadow-sm" /> 
              Sejahtera AI
            </span>
          </div>
          <nav className="p-4 space-y-2 mt-4 flex-1">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <LayoutDashboard size={20} /> Beranda
            </Link>
            <Link to="/nutrisi" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <Utensils size={20} /> Nutrisi (AI)
            </Link>
            <Link to="/metrik" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <Activity size={20} /> Metrik Kesehatan
            </Link>
            <Link to="/bantuan" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <HelpCircle size={20} /> Bantuan
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto w-full relative">
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <h1 className="text-xl md:text-2xl font-bold text-brand-dark flex items-center gap-2">
            <span className="md:hidden"><img src={logo} alt="Logo" className="w-6 h-6 object-contain" /></span>
             Pengaturan Profile
          </h1>
          
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-sm md:text-base shadow-sm ring-2 ring-brand-light cursor-pointer">
               {getInitials(formData.name)}
             </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-green"></div>
          </div>
        ) : (
          <div className="p-4 md:p-8 max-w-5xl mx-auto w-full pb-24 md:pb-8">
            <div className="bg-gradient-to-br from-brand-dark to-brand-green rounded-2xl md:rounded-[2rem] p-6 md:p-8 text-white shadow-xl mb-6 md:mb-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                <ShieldCheck size={200} />
              </div>
              <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 bg-white/20 backdrop-blur-md rounded-full border-4 border-white/30 flex items-center justify-center text-3xl md:text-5xl font-bold shadow-lg shrink-0">
                {getInitials(formData.name)}
              </div>
              <div className="relative z-10 text-center md:text-left">
                <h2 className="text-2xl md:text-4xl font-bold mb-2">{formData.name || 'Pengguna'}</h2>
                <p className="text-brand-light text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
                  <Mail size={16} /> {formData.email}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 text-xs md:text-sm">
                User Aktif
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6 border-b pb-4">Informasi Dasar</h3>
                
                {message.text && (
                  <div className={`p-4 rounded-xl mb-6 text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-brand-light/30 text-brand-dark border border-brand-green/30' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {message.type === 'success' && <CheckCircle2 size={18} />} {message.text}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="text-xs md:text-sm font-bold text-gray-500 mb-1 block">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-green text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-bold text-gray-500 mb-1 block">Alamat Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-green text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs md:text-sm font-bold text-gray-500 mb-1 block">Usia (Tahun)</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="number" name="age" required value={formData.age} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-green text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-bold text-gray-500 mb-1 block">Jenis Kelamin</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select name="gender" required value={formData.gender} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-green text-sm appearance-none">
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-bold text-gray-500 mb-1 block">Tinggi Badan (cm)</label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input type="number" name="height" required value={formData.height} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-green text-sm" placeholder="Contoh: 170" />
                    </div>
                  </div>
                  <button type="submit" disabled={isSaving} className="w-full mt-4 py-3 bg-brand-dark hover:bg-brand-green text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                    {isSaving ? 'Menyimpan...' : <><Save size={18} /> Simpan Perubahan</>}
                  </button>
                </form>
              </div>

              <div className="flex flex-col gap-6 md:gap-8">
                <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm h-fit">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6 border-b pb-4">Keamanan Akun</h3>
                  {passMessage.text && (
                    <div className={`p-4 rounded-xl mb-6 text-sm flex items-center gap-2 ${passMessage.type === 'success' ? 'bg-brand-light/30 text-brand-dark border border-brand-green/30' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                      {passMessage.type === 'success' && <CheckCircle2 size={18} />} {passMessage.text}
                    </div>
                  )}
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                      <label className="text-xs md:text-sm font-bold text-gray-500 mb-1 block">Password Saat Ini</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type={showOldPassword ? "text" : "password"} 
                          name="oldPassword" 
                          required 
                          value={passData.oldPassword} 
                          onChange={handlePassChange} 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-10 outline-none focus:border-brand-green text-sm" 
                          placeholder="Masukkan password lama" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowOldPassword(!showOldPassword)} 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-green focus:outline-none"
                        >
                          {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-bold text-gray-500 mb-1 block">Password Baru</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-green" size={18} />
                        <input 
                          type={showNewPassword ? "text" : "password"} 
                          name="newPassword" 
                          required 
                          value={passData.newPassword} 
                          onChange={handlePassChange} 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-10 outline-none focus:border-brand-green text-sm" 
                          placeholder="Minimal 8 karakter" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowNewPassword(!showNewPassword)} 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-green focus:outline-none"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-bold text-gray-500 mb-1 block">Konfirmasi Password Baru</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-green" size={18} />
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          name="confirmPassword" 
                          required 
                          value={passData.confirmPassword} 
                          onChange={handlePassChange} 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-10 outline-none focus:border-brand-green text-sm" 
                          placeholder="Ketik ulang password baru" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-green focus:outline-none"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" disabled={isSavingPass} className="w-full mt-4 py-3 bg-white border-2 border-brand-green text-brand-dark hover:bg-brand-light/30 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                      {isSavingPass ? 'Memproses...' : <><ShieldCheck size={18} /> Perbarui Password</>}
                    </button>
                  </form>
                </div>

                <div className="bg-red-50/40 rounded-2xl md:rounded-[2rem] p-6 md:p-8 border border-red-100 shadow-sm h-fit">
                  <button onClick={handleLogout} className="w-full py-3 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    <LogOut size={18} /> Keluar Akun
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 px-2 pb-safe">
        <Link to="/dashboard" className="flex flex-col items-center text-gray-400 hover:text-brand-green transition-colors">
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-medium mt-1">Beranda</span>
        </Link>
        <Link to="/nutrisi" className="flex flex-col items-center text-gray-400 hover:text-brand-green transition-colors">
          <Utensils size={20} />
          <span className="text-[10px] font-medium mt-1">Nutrisi</span>
        </Link>
        <Link to="/metrik" className="flex flex-col items-center text-gray-400 hover:text-brand-green transition-colors">
          <Activity size={20} />
          <span className="text-[10px] font-medium mt-1">Metrik</span>
        </Link>
        <Link to="/bantuan" className="flex flex-col items-center text-gray-400 hover:text-brand-green transition-colors">
          <HelpCircle size={20} />
          <span className="text-[10px] font-medium mt-1">Bantuan</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-brand-green transition-colors">
          <User size={20} />
          <span className="text-[10px] font-bold mt-1">Profil</span>
        </Link>
      </nav>

    </div>
  );
}