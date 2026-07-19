import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    age: '',
    gender: 'Laki-laki',
    height: '',
    weight: '',
    activity_level: 'Ringan',
    sleep_target: '7',
    health_target: 'Menjaga Berat Badan',
    diet_preference: 'Umum / Semua Makanan'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        sleep_target: parseFloat(formData.sleep_target)
      };

      await api.post('/profile', payload);
      
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Gagal menyimpan data profil.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-gray flex flex-col items-center py-12 px-4">
      <div className="flex items-center gap-2 mb-8 text-brand-dark font-bold text-xl">
        <CheckCircle className="text-brand-green" />
        <span>Sejahtera AI</span>
      </div>

      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Halo, Mulai Perjalanan Sehatmu</h1>
        <p className="text-gray-500 mb-8">Lengkapi data di bawah ini agar Sejahtera AI dapat memberikan rekomendasi kesehatan yang dipersonalisasi untuk Anda.</p>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Umur (Tahun)</label>
              <input type="number" name="age" required value={formData.age} onChange={handleChange} placeholder="25" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green outline-none bg-gray-50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green outline-none bg-gray-50">
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi Badan (cm)</label>
              <input type="number" name="height" required value={formData.height} onChange={handleChange} placeholder="170" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green outline-none bg-gray-50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Berat Badan (kg)</label>
              <input type="number" name="weight" required value={formData.weight} onChange={handleChange} placeholder="65" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green outline-none bg-gray-50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Tidur (Jam/Malam)</label>
              <input type="number" step="0.5" name="sleep_target" required value={formData.sleep_target} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green outline-none bg-gray-50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Aktivitas Fisik</label>
              <select name="activity_level" value={formData.activity_level} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green outline-none bg-gray-50">
                <option value="Tidak Aktif">Tidak Aktif (Banyak duduk)</option>
                <option value="Ringan">Ringan (Olahraga 1-3x seminggu)</option>
                <option value="Sedang">Sedang (Olahraga 3-5x seminggu)</option>
                <option value="Berat">Berat (Olahraga setiap hari)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Kesehatan</label>
              <select name="health_target" value={formData.health_target} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green outline-none bg-gray-50">
                <option value="Menurunkan Berat Badan">Menurunkan Berat Badan</option>
                <option value="Menjaga Berat Badan">Menjaga Berat Badan</option>
                <option value="Menambah Massa Otot">Menambah Massa Otot</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferensi Diet</label>
              <select name="diet_preference" value={formData.diet_preference} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green outline-none bg-gray-50">
                <option value="Umum / Semua Makanan">Umum / Semua Makanan</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Keto">Keto</option>
              </select>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-8 py-3 float-right border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0F3F2C] hover:bg-brand-green focus:outline-none transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
            </button>
            <div className="clear-both"></div>
          </div>
        </form>
      </div>
    </div>
  );
}