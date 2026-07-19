import { useState } from 'react';
import { LayoutDashboard, Utensils, Activity, HelpCircle, Droplets, Moon, Scale, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function MetrikKesehatan() {
  const [formData, setFormData] = useState({
    weight: '',
    water: '',
    sleep: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Ubah tipe data string dari input form menjadi angka/float
      const payload = {
        weight: parseFloat(formData.weight),
        water: parseFloat(formData.water),
        sleep: parseFloat(formData.sleep)
      };

      // Tembak endpoint Golang
      await api.post('/metrics', payload);
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      setFormData({ weight: '', water: '', sleep: '' });
    } catch (err) {
      alert(err.response?.data?.error || "Gagal menyimpan data!");
    }
  };

  return (
    <div className="flex h-screen bg-bg-gray overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-gray-100">
            <span className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <span className="text-brand-green">🌱</span> Sejahtera AI
            </span>
          </div>
          <nav className="p-4 space-y-2 mt-4">
            <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-dark rounded-xl font-medium transition-colors">
              <LayoutDashboard size={20} /> Beranda
            </a>
            <a href="/nutrisi" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-dark rounded-xl font-medium transition-colors">
              <Utensils size={20} /> Nutrisi (AI)
            </a>
            <a href="/metrik" className="flex items-center gap-3 px-4 py-3 bg-brand-light text-brand-dark rounded-xl font-medium">
              <Activity size={20} /> Metrik Kesehatan
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-dark rounded-xl font-medium transition-colors">
              <HelpCircle size={20} /> Bantuan
            </a>
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        {/* Ornamen Background Estetik */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-brand-dark to-brand-green z-0 rounded-b-[3rem] opacity-90"></div>

        {/* TOPBAR */}
        <header className="h-20 flex items-center justify-between px-8 sticky top-0 z-10 text-white">
          <h1 className="text-2xl font-bold">Catat Metrik Harian</h1>
          <div className="w-9 h-9 rounded-full bg-white text-brand-green flex items-center justify-center font-bold shadow-sm">IS</div>
        </header>

        <div className="p-8 z-10 max-w-4xl mx-auto w-full mt-4">
          
          <div className="text-center text-white mb-10">
            <h2 className="text-3xl font-bold mb-2">Bagaimana kabarmu hari ini?</h2>
            <p className="text-brand-light opacity-90">Konsistensi adalah kunci. Catat metrik harianmu untuk pantauan AI yang lebih akurat.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid Kartu Input dengan efek Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Kartu Berat Badan */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-lg shadow-gray-200/50 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                  <Scale size={32} />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Berat Badan</h3>
                <p className="text-xs text-gray-500 mb-4">Timbang di pagi hari</p>
                <div className="flex items-end gap-2 w-full">
                  <input type="number" step="0.1" name="weight" required value={formData.weight} onChange={handleChange} placeholder="0.0" className="w-full text-center text-2xl font-bold text-gray-800 bg-white/50 border-b-2 border-gray-200 focus:border-brand-green outline-none py-2 transition-colors" />
                  <span className="text-gray-500 font-medium pb-2">kg</span>
                </div>
              </div>

              {/* Kartu Air */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-lg shadow-gray-200/50 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-cyan-50 text-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                  <Droplets size={32} />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Konsumsi Air</h3>
                <p className="text-xs text-gray-500 mb-4">Target harian: 2.5L</p>
                <div className="flex items-end gap-2 w-full">
                  <input type="number" step="0.1" name="water" required value={formData.water} onChange={handleChange} placeholder="0.0" className="w-full text-center text-2xl font-bold text-gray-800 bg-white/50 border-b-2 border-gray-200 focus:border-brand-green outline-none py-2 transition-colors" />
                  <span className="text-gray-500 font-medium pb-2">Liter</span>
                </div>
              </div>

              {/* Kartu Tidur */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-lg shadow-gray-200/50 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                  <Moon size={32} />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Jam Tidur</h3>
                <p className="text-xs text-gray-500 mb-4">Kualitas istirahat semalam</p>
                <div className="flex items-end gap-2 w-full">
                  <input type="number" step="0.5" name="sleep" required value={formData.sleep} onChange={handleChange} placeholder="0.0" className="w-full text-center text-2xl font-bold text-gray-800 bg-white/50 border-b-2 border-gray-200 focus:border-brand-green outline-none py-2 transition-colors" />
                  <span className="text-gray-500 font-medium pb-2">Jam</span>
                </div>
              </div>

            </div>

            {/* Tombol Simpan */}
            <div className="flex flex-col items-center mt-10">
              <button type="submit" className="px-10 py-4 bg-brand-dark hover:bg-[#0a2e1f] text-white rounded-full font-bold shadow-lg shadow-brand-dark/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                Simpan Metrik Hari Ini
              </button>
              
              {isSaved && (
                <div className="mt-4 flex items-center gap-2 text-brand-green bg-brand-light px-4 py-2 rounded-full animate-bounce">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-bold">Data berhasil dicatat!</span>
                </div>
              )}
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}