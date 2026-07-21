import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Lock, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru dan konfirmasi tidak cocok!' });
      return;
    }
    
    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password minimal harus 8 karakter!' });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age),
        new_password: formData.newPassword
      };

      const res = await api.post('/auth/reset-password', payload);
      setMessage({ type: 'success', text: res.data.message });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Gagal mereset kata sandi.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-white overflow-hidden">
      
      <div className="hidden lg:flex lg:w-1/2 bg-brand-dark p-12 text-white flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-dark to-[#0a2e1f] opacity-80 z-0"></div>
  
        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Atur Ulang<br />Kata Sandi Anda
          </h1>
          <p className="text-lg text-gray-300">
            Jangan khawatir! Cukup konfirmasi beberapa data dasar Anda, dan buat kata sandi baru untuk kembali mengakses asisten kesehatan AI Anda.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        
        <div className="w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Verifikasi Identitas</h2>
          <p className="text-gray-500 mb-8 text-sm md:text-base">Silakan isi data di bawah ini untuk mereset kata sandi Anda.</p>

          {message.text && (
            <div className={`p-4 rounded-xl mb-6 text-sm flex items-center gap-2 font-medium ${message.type === 'success' ? 'bg-brand-light/30 text-brand-dark border border-brand-green/30' : 'bg-red-50 text-red-600 border border-red-100'}`}>
              {message.type === 'success' && <CheckCircle2 size={18} />} {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Nama Lengkap</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-green transition-colors" size={18} />
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-sm" placeholder="Nama lengkap Anda" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Alamat Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-green transition-colors" size={18} />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-sm" placeholder="nama@email.com" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Usia</label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-green transition-colors" size={18} />
                  <input type="number" name="age" required value={formData.age} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-sm" placeholder="Contoh: 25" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 mt-2"></div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Kata Sandi Baru</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-green transition-colors" size={18} />
                <input type="password" name="newPassword" required value={formData.newPassword} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-sm" placeholder="Minimal 8 karakter" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Konfirmasi Kata Sandi Baru</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-green transition-colors" size={18} />
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-sm" placeholder="Ketik ulang kata sandi baru" />
              </div>
            </div>

            <button type="submit" disabled={isLoading || message.type === 'success'} className="w-full mt-6 py-3.5 bg-brand-dark hover:bg-brand-green text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-70 text-sm">
              {isLoading ? 'Memproses...' : 'Simpan Kata Sandi Baru'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-green transition-colors">
              <ArrowLeft size={16} /> Kembali ke Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}