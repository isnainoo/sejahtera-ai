import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Utensils, Activity, HelpCircle, 
  Droplets, Moon, Scale, CheckCircle2, TrendingUp, Bot, Pencil, X, Save, Calendar, User
} from 'lucide-react';
import api from '../services/api';
import logo from '../assets/logosejahtera.png';

const getInitials = (name) => {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default function MetrikKesehatan() {
  const [formData, setFormData] = useState({ weight: '', water: '', sleep: '' });
  const [history, setHistory] = useState([]);
  const [userName, setUserName] = useState('User Sejahtera');
  const [isSaving, setIsSaving] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ weight: '', water: '', sleep: '' });

  useEffect(() => {
    fetchHistory();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setUserName(res.data.profile?.name || res.data.name || 'User Sejahtera');
    } catch (err) {
      console.error("Gagal menarik data profil:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/metrics');
      setHistory(res.data);
    } catch (err) {
      console.error("Gagal menarik history:", err);
    }
  };

  const handleInputChange = (e, isEdit = false) => {
    if (isEdit) {
      setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        weight: parseFloat(formData.weight),
        water: parseFloat(formData.water),
        sleep: parseFloat(formData.sleep)
      };
      await api.post('/metrics', payload);
      setFormData({ weight: '', water: '', sleep: '' });
      fetchHistory(); 
    } catch (err) {
      alert(err.response?.data?.error || "Gagal menyimpan metrik!");
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditFormData({ weight: item.weight, water: item.water, sleep: item.sleep });
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        weight: parseFloat(editFormData.weight),
        water: parseFloat(editFormData.water),
        sleep: parseFloat(editFormData.sleep)
      };
      await api.put(`/metrics/${id}`, payload);
      setEditingId(null);
      fetchHistory(); 
    } catch (err) {
      alert(err.response?.data?.error || "Gagal mengupdate metrik!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center px-8 border-b border-gray-100 shrink-0">
            <span className="text-xl font-bold text-brand-dark flex items-center gap-3">
              <img src={logo} alt="Logo Sejahtera" className="w-8 h-8 object-contain drop-shadow-sm" /> 
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
            <Link to="/metrik" className="flex items-center gap-3 px-4 py-3 bg-brand-light text-brand-dark rounded-xl font-medium transition-colors">
              <Activity size={20} /> Metrik Kesehatan
            </Link>
            <Link to="/bantuan" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-dark rounded-xl font-medium transition-colors">
              <HelpCircle size={20} /> Bantuan
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto relative bg-gray-50 w-full">
        <div className="absolute top-0 left-0 w-full h-64 md:h-80 bg-gradient-to-br from-brand-dark to-brand-green z-0 rounded-b-[2rem] md:rounded-b-[3rem]"></div>
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="md:hidden"><img src={logo} alt="Logo" className="w-6 h-6 object-contain" /></span>
            Catat Metrik
          </h1>
          <div className="flex items-center gap-4">
             <Link to="/profile" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-sm md:text-base shadow-sm ring-2 ring-brand-light cursor-pointer hover:bg-brand-dark transition-colors">
               {getInitials(userName)}
             </Link>
          </div>
        </header>

        <div className="p-4 md:p-8 z-10 max-w-4xl mx-auto w-full mt-2 md:mt-4 pb-24 md:pb-8 relative">
          <div className="text-center text-white mb-6 md:mb-10 pt-4 md:pt-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Bagaimana kabarmu?</h2>
            <p className="text-xs md:text-sm text-brand-light opacity-90 px-4">Konsistensi adalah kunci. Catat metrik harianmu untuk pantauan AI.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white/90 backdrop-blur-xl border border-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg flex flex-col items-center transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 text-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                  <Scale size={24} className="md:w-8 md:h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm md:text-base">Berat Badan</h3>
                <div className="flex items-end gap-2 w-full mt-2 md:mt-4">
                  <input type="number" step="0.1" name="weight" required value={formData.weight} onChange={handleInputChange} className="w-full text-center text-xl md:text-2xl font-bold text-gray-800 border-b-2 focus:border-brand-green outline-none py-1 md:py-2 bg-transparent" placeholder="0.0" />
                  <span className="text-gray-500 font-medium pb-1 md:pb-2 text-xs md:text-base">kg</span>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-xl border border-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg flex flex-col items-center transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-cyan-50 text-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                  <Droplets size={24} className="md:w-8 md:h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm md:text-base">Air Minum</h3>
                <div className="flex items-end gap-2 w-full mt-2 md:mt-4">
                  <input type="number" step="0.1" name="water" required value={formData.water} onChange={handleInputChange} className="w-full text-center text-xl md:text-2xl font-bold text-gray-800 border-b-2 focus:border-brand-green outline-none py-1 md:py-2 bg-transparent" placeholder="0.0" />
                  <span className="text-gray-500 font-medium pb-1 md:pb-2 text-xs md:text-base">L</span>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-xl border border-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg flex flex-col items-center transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-50 text-indigo-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                  <Moon size={24} className="md:w-8 md:h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm md:text-base">Jam Tidur</h3>
                <div className="flex items-end gap-2 w-full mt-2 md:mt-4">
                  <input type="number" step="0.5" name="sleep" required value={formData.sleep} onChange={handleInputChange} className="w-full text-center text-xl md:text-2xl font-bold text-gray-800 border-b-2 focus:border-brand-green outline-none py-1 md:py-2 bg-transparent" placeholder="0.0" />
                  <span className="text-gray-500 font-medium pb-1 md:pb-2 text-xs md:text-base">Jam</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6 md:mt-8">
              <button type="submit" disabled={isSaving} className="w-full md:w-auto px-8 md:px-10 py-3 md:py-4 bg-brand-dark hover:bg-[#0a2e1f] text-white rounded-xl md:rounded-full font-bold shadow-lg transition-all disabled:opacity-70 text-sm md:text-base">
                {isSaving && !editingId ? 'Menyimpan & Menganalisis AI...' : 'Simpan Metrik Hari Ini'}
              </button>
            </div>
          </form>

          <div className="mt-12 md:mt-20">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 md:mb-6 border-b pb-3 md:pb-4">
              <Calendar className="text-brand-green w-5 h-5 md:w-6 md:h-6" /> Riwayat & Analisis AI
            </h2>

            <div className="space-y-4 md:space-y-8">
              {history.map((item) => {
                const dateString = new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                const isEditing = editingId === item.id;
                
                let aiAnalysis = [];
                try { aiAnalysis = JSON.parse(item.analysis); } catch(e) { }

                return (
                  <div key={item.id} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    
                    <div className="flex justify-between items-center mb-4 md:mb-6 border-b pb-3 md:pb-4">
                      <span className="font-bold text-gray-700 text-xs md:text-base">{dateString}</span>
                      {!isEditing ? (
                         <button onClick={() => startEdit(item)} className="text-gray-500 hover:text-brand-green transition-colors flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm bg-gray-50 px-3 py-1.5 md:py-2 rounded-lg border border-gray-100">
                           <Pencil size={12} className="md:w-4 md:h-4" /> Edit Data
                         </button>
                      ) : (
                         <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm bg-red-50 px-3 py-1.5 md:py-2 rounded-lg border border-red-100">
                           <X size={12} className="md:w-4 md:h-4" /> Batal
                         </button>
                      )}
                    </div>

                    {isEditing ? (
                      <form onSubmit={(e) => handleUpdate(e, item.id)} className="animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6 bg-gray-50 p-3 md:p-4 rounded-xl">
                          <div>
                            <label className="text-[10px] md:text-xs font-bold text-gray-500 block mb-1">Berat (kg)</label>
                            <input type="number" step="0.1" name="weight" value={editFormData.weight} onChange={(e) => handleInputChange(e, true)} className="w-full border rounded-lg p-2 font-bold text-sm" required />
                          </div>
                          <div>
                            <label className="text-[10px] md:text-xs font-bold text-gray-500 block mb-1">Air (L)</label>
                            <input type="number" step="0.1" name="water" value={editFormData.water} onChange={(e) => handleInputChange(e, true)} className="w-full border rounded-lg p-2 font-bold text-sm" required />
                          </div>
                          <div>
                            <label className="text-[10px] md:text-xs font-bold text-gray-500 block mb-1">Tidur (Jam)</label>
                            <input type="number" step="0.5" name="sleep" value={editFormData.sleep} onChange={(e) => handleInputChange(e, true)} className="w-full border rounded-lg p-2 font-bold text-sm" required />
                          </div>
                        </div>
                        <button type="submit" disabled={isSaving} className="w-full py-3 bg-brand-green text-white rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-70 text-xs md:text-sm">
                          {isSaving ? 'Memproses...' : <><Save size={16} /> Update & Analisis Ulang</>}
                        </button>
                      </form>
                    ) : (
                      <>
                        <div className="flex justify-around text-center mb-6 md:mb-8 bg-gray-50 p-3 md:p-4 rounded-xl">
                          <div>
                            <p className="text-gray-400 text-[10px] md:text-xs font-bold mb-0.5 md:mb-1 uppercase">Berat</p>
                            <p className="font-bold text-base md:text-xl text-gray-800">{item.weight} <span className="text-[10px] md:text-sm font-normal">kg</span></p>
                          </div>
                          <div className="w-px bg-gray-200"></div>
                          <div>
                            <p className="text-gray-400 text-[10px] md:text-xs font-bold mb-0.5 md:mb-1 uppercase">Air</p>
                            <p className="font-bold text-base md:text-xl text-gray-800">{item.water} <span className="text-[10px] md:text-sm font-normal">L</span></p>
                          </div>
                          <div className="w-px bg-gray-200"></div>
                          <div>
                            <p className="text-gray-400 text-[10px] md:text-xs font-bold mb-0.5 md:mb-1 uppercase">Tidur</p>
                            <p className="font-bold text-base md:text-xl text-gray-800">{item.sleep} <span className="text-[10px] md:text-sm font-normal">Jam</span></p>
                          </div>
                        </div>

                        <div className="space-y-3 mt-4">
                          <h4 className="text-xs md:text-sm font-bold text-brand-dark flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                            <Bot className="text-brand-green w-4 h-4 md:w-5 md:h-5" /> Analisis AI:
                          </h4>
                          {Array.isArray(aiAnalysis) && aiAnalysis.map((ai, idx) => (
                            <div key={idx} className="bg-brand-light/30 p-3 md:p-4 rounded-xl md:rounded-2xl flex gap-3 md:gap-4 items-start">
                              <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 bg-brand-green/20 text-brand-dark rounded-full flex items-center justify-center mt-0.5 md:mt-1">
                                {ai.icon === 'trend' ? <TrendingUp size={16} className="md:w-5 md:h-5" /> : <CheckCircle2 size={16} className="md:w-5 md:h-5" />}
                              </div>
                              <div>
                                <h3 className="font-bold text-brand-dark mb-0.5 md:mb-1 text-xs md:text-sm">{ai.title}</h3>
                                <p className="text-gray-600 text-[10px] md:text-sm leading-relaxed">{ai.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
              
              {history.length === 0 && (
                <div className="text-center text-gray-400 py-8 md:py-10 bg-white rounded-2xl md:rounded-3xl border border-gray-100 border-dashed text-xs md:text-sm">
                  Belum ada riwayat. Silakan simpan metrik hari ini.
                </div>
              )}
            </div>
          </div>
        </div>
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
        <Link to="/metrik" className="flex flex-col items-center text-brand-green transition-colors">
          <Activity size={20} />
          <span className="text-[10px] font-bold mt-1">Metrik</span>
        </Link>
        <Link to="/bantuan" className="flex flex-col items-center text-gray-400 hover:text-brand-green transition-colors">
          <HelpCircle size={20} />
          <span className="text-[10px] font-medium mt-1">Bantuan</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-gray-400 hover:text-brand-green transition-colors">
          <User size={20} />
          <span className="text-[10px] font-medium mt-1">Profil</span>
        </Link>
      </nav>

    </div>
  );
}