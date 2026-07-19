import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Menembak API Golang yang sudah kita buat
      const response = await api.post('/auth/login', { email, password });
      
      // Simpan token ke localStorage
      localStorage.setItem('token', response.data.token);
      
      // Arahkan ke Dashboard (atau halaman Onboarding jika baru pertama kali)
      navigate('/dashboard'); 
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-gray">
      {/* Sisi Kiri - Banner Hijau (Sembunyi di layar kecil) */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-dark p-12 text-white flex-col justify-center relative overflow-hidden">
        {/* Efek gradien/glow ringan sesuai desain */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-dark to-[#0a2e1f] opacity-80 z-0"></div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Pantau Kesehatan Anda Secara Holistik
          </h1>
          <p className="text-lg text-gray-300">
            Wujudkan hidup lebih sehat dengan analisis cerdas AI untuk nutrisi, metrik tubuh, dan gaya hidup Anda.
          </p>
        </div>
      </div>

      {/* Sisi Kanan - Form Login */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang Kembali</h2>
          <p className="text-gray-500 mb-8">Silakan masukkan detail akun Anda untuk melanjutkan perjalanan kesehatan.</p>

          {errorMsg && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-colors bg-gray-50"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
                <a href="#" className="text-sm text-brand-green hover:underline font-medium">Lupa Kata Sandi?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-colors bg-gray-50"
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded" />
              <label className="ml-2 block text-sm text-gray-700">Ingat saya di perangkat ini</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0F3F2C] hover:bg-[#0a2e1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Memproses...' : 'Masuk →'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun? <a href="/register" className="font-semibold text-brand-green hover:underline">Daftar Sekarang</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}