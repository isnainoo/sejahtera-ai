import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Sparkles, Calendar, Users } from 'lucide-react';
import logo from '../assets/logosejahtera.png';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Password dan Konfirmasi Password tidak cocok!');
      return;
    }
    
    if (formData.password.length < 8) {
      setErrorMsg('Password minimal harus 8 karakter!');
      return;
    }

    if (!formData.age || !formData.gender) {
       setErrorMsg('Mohon lengkapi usia dan jenis kelamin Anda.');
       return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        gender: formData.gender
      };

      await api.post('/auth/register', payload);
      
      setSuccessMsg('Pendaftaran berhasil! Mengalihkan ke halaman login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-dark to-brand-green opacity-95"></div>
      <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-brand-light/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-[#0a2e1f]/40 rounded-full blur-3xl"></div>
      <div className="relative z-10 w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-2xl text-white my-8">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg border border-white/50">
            <img src={logo} alt="Logo Sejahtera" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-sm" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">Buat Akun Sejahtera</h1>
          <p className="text-gray-300 text-center text-xs md:text-sm">Bergabunglah dan mulai perjalanan sehat Anda bersama asisten AI pribadi.</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-medium text-center backdrop-blur-sm animate-fade-in">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-brand-green/20 border border-brand-green/50 rounded-xl text-brand-light text-sm font-medium text-center backdrop-blur-sm animate-fade-in flex items-center justify-center gap-2">
            <Sparkles size={16} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-light transition-colors">
              <User size={20} />
            </div>
            <input 
              type="text" 
              name="name"
              required
              placeholder="Nama Lengkap" 
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-4 outline-none text-white placeholder-gray-400 focus:border-brand-light focus:bg-black/30 transition-all text-sm md:text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-light transition-colors">
                <Calendar size={20} />
              </div>
              <input 
                type="number" 
                name="age"
                required
                min="10"
                max="100"
                placeholder="Usia" 
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-4 outline-none text-white placeholder-gray-400 focus:border-brand-light focus:bg-black/30 transition-all text-sm md:text-base"
              />
            </div>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-light transition-colors">
                <Users size={20} />
              </div>
              <select 
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-4 outline-none text-white placeholder-gray-400 focus:border-brand-light focus:bg-black/30 transition-all text-sm md:text-base appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-gray-800">Jenis Kelamin</option>
                <option value="Laki-laki" className="text-gray-800">Laki-laki</option>
                <option value="Perempuan" className="text-gray-800">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-light transition-colors">
              <Mail size={20} />
            </div>
            <input 
              type="email" 
              name="email"
              required
              placeholder="Alamat Email" 
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-4 outline-none text-white placeholder-gray-400 focus:border-brand-light focus:bg-black/30 transition-all text-sm md:text-base"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-light transition-colors">
              <Lock size={20} />
            </div>
            <input 
              type="password" 
              name="password"
              required
              placeholder="Password (Min. 8 Karakter)" 
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-4 outline-none text-white placeholder-gray-400 focus:border-brand-light focus:bg-black/30 transition-all text-sm md:text-base"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-light transition-colors">
              <Lock size={20} />
            </div>
            <input 
              type="password" 
              name="confirmPassword"
              required
              placeholder="Konfirmasi Password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-4 outline-none text-white placeholder-gray-400 focus:border-brand-light focus:bg-black/30 transition-all text-sm md:text-base"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || successMsg !== ''}
            className="w-full mt-6 py-3 md:py-4 bg-brand-light hover:bg-white text-brand-dark rounded-2xl font-bold shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70 group text-sm md:text-base"
          >
            {isLoading ? 'Memproses Pendaftaran...' : (
              <>
                Daftar Sekarang <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-300">
          Sudah punya akun?{' '}
          <Link autoFocus to="/login" className="font-bold text-brand-light hover:text-white transition-colors underline-offset-4 hover:underline">
            Masuk di sini
          </Link>
        </div>

      </div>
    </div>
  );
}