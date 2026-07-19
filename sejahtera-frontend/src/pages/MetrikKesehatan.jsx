import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Utensils, Activity, HelpCircle, 
  Droplets, Moon, Scale, CheckCircle2, TrendingUp, Bot, Pencil, X, Save, Calendar
} from 'lucide-react';
import api from '../services/api';
import logo from '../assets/logosejahtera.png';

export default function MetrikKesehatan() {
  const [formData, setFormData] = useState({ weight: '', water: '', sleep: '' });
  const [history, setHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ weight: '', water: '', sleep: '' });

  useEffect(() => {
    fetchHistory();
  }, []);

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
    <div className="flex h-screen bg-bg-gray overflow-hidden font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-gray-100">
            <span className="text-xl font-bold text-brand-dark flex items-center gap-3">
              <img src={logo} alt="Logo Sejahtera" className="w-8 h-8 object-contain drop-shadow-sm" /> 
              Sejahtera AI
            </span>
          </div>
          <nav className="p-4 space-y-2 mt-4">
            <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium">
              <LayoutDashboard size={20} /> Beranda
            </a>
            <a href="/nutrisi" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium">
              <Utensils size={20} /> Nutrisi (AI)
            </a>
            <a href="/metrik" className="flex items-center gap-3 px-4 py-3 bg-brand-light text-brand-dark rounded-xl font-medium">
              <Activity size={20} /> Metrik Kesehatan
            </a>
            <a href="bantuan" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-dark rounded-xl font-medium transition-colors">
              <HelpCircle size={20} /> Bantuan
            </a>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto relative bg-gray-50 pb-20">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-brand-dark to-brand-green z-0 rounded-b-[3rem]"></div>

        <header className="h-20 flex items-center justify-between px-8 sticky top-0 z-10 text-white">
          <h1 className="text-2xl font-bold">Catat Metrik Harian</h1>
          <div className="w-9 h-9 rounded-full bg-white text-brand-green flex items-center justify-center font-bold">IS</div>
        </header>

        <div className="p-8 z-10 max-w-4xl mx-auto w-full mt-4">
          
          <div className="text-center text-white mb-10">
            <h2 className="text-3xl font-bold mb-2">Bagaimana kabarmu hari ini?</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/90 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-lg flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4"><Scale size={32} /></div>
                <h3 className="font-bold text-gray-800">Berat Badan</h3>
                <div className="flex items-end gap-2 w-full mt-4">
                  <input type="number" step="0.1" name="weight" required value={formData.weight} onChange={handleInputChange} className="w-full text-center text-2xl font-bold text-gray-800 border-b-2 focus:border-brand-green outline-none py-2" />
                  <span className="text-gray-500 font-medium pb-2">kg</span>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-lg flex flex-col items-center">
                <div className="w-16 h-16 bg-cyan-50 text-cyan-500 rounded-2xl flex items-center justify-center mb-4"><Droplets size={32} /></div>
                <h3 className="font-bold text-gray-800">Air</h3>
                <div className="flex items-end gap-2 w-full mt-4">
                  <input type="number" step="0.1" name="water" required value={formData.water} onChange={handleInputChange} className="w-full text-center text-2xl font-bold text-gray-800 border-b-2 focus:border-brand-green outline-none py-2" />
                  <span className="text-gray-500 font-medium pb-2">L</span>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-lg flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4"><Moon size={32} /></div>
                <h3 className="font-bold text-gray-800">Tidur</h3>
                <div className="flex items-end gap-2 w-full mt-4">
                  <input type="number" step="0.5" name="sleep" required value={formData.sleep} onChange={handleInputChange} className="w-full text-center text-2xl font-bold text-gray-800 border-b-2 focus:border-brand-green outline-none py-2" />
                  <span className="text-gray-500 font-medium pb-2">Jam</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button type="submit" disabled={isSaving} className="px-10 py-4 bg-brand-dark hover:bg-[#0a2e1f] text-white rounded-full font-bold shadow-lg transition-all disabled:opacity-70">
                {isSaving && !editingId ? 'Menyimpan & Menganalisis AI...' : 'Simpan Metrik Hari Ini'}
              </button>
            </div>
          </form>

          <div className="mt-20">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6 border-b pb-4">
              <Calendar className="text-brand-green" size={24} /> Riwayat & Analisis AI
            </h2>

            <div className="space-y-8">
              {history.map((item) => {
                const dateString = new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                const isEditing = editingId === item.id;
                
                let aiAnalysis = [];
                try { aiAnalysis = JSON.parse(item.analysis); } catch(e) { }

                return (
                  <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                      <span className="font-bold text-gray-700">{dateString}</span>
                      {!isEditing ? (
                         <button onClick={() => startEdit(item)} className="text-gray-400 hover:text-brand-green transition-colors flex items-center gap-2 text-sm bg-gray-50 px-3 py-1.5 rounded-lg">
                           <Pencil size={16} /> Edit Data
                         </button>
                      ) : (
                         <button onClick={() => setEditingId(null)} className="text-red-400 hover:text-red-600 transition-colors flex items-center gap-2 text-sm bg-red-50 px-3 py-1.5 rounded-lg">
                           <X size={16} /> Batal
                         </button>
                      )}
                    </div>

                    {isEditing ? (
                      <form onSubmit={(e) => handleUpdate(e, item.id)} className="animate-fade-in">
                        <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-xl">
                          <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">Berat (kg)</label>
                            <input type="number" step="0.1" name="weight" value={editFormData.weight} onChange={(e) => handleInputChange(e, true)} className="w-full border rounded-lg p-2 font-bold" required />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">Air (L)</label>
                            <input type="number" step="0.1" name="water" value={editFormData.water} onChange={(e) => handleInputChange(e, true)} className="w-full border rounded-lg p-2 font-bold" required />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">Tidur (Jam)</label>
                            <input type="number" step="0.5" name="sleep" value={editFormData.sleep} onChange={(e) => handleInputChange(e, true)} className="w-full border rounded-lg p-2 font-bold" required />
                          </div>
                        </div>
                        <button type="submit" disabled={isSaving} className="w-full py-3 bg-brand-green text-white rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-70">
                          {isSaving ? 'Menyimpan Ulang...' : <><Save size={18} /> Update & Analisis Ulang</>}
                        </button>
                      </form>
                    ) : (
                      <>
                        <div className="flex justify-around text-center mb-8 bg-gray-50 p-4 rounded-xl">
                          <div>
                            <p className="text-gray-400 text-xs font-bold mb-1 uppercase">Berat</p>
                            <p className="font-bold text-xl text-gray-800">{item.weight} <span className="text-sm font-normal">kg</span></p>
                          </div>
                          <div className="w-px bg-gray-200"></div>
                          <div>
                            <p className="text-gray-400 text-xs font-bold mb-1 uppercase">Air</p>
                            <p className="font-bold text-xl text-gray-800">{item.water} <span className="text-sm font-normal">L</span></p>
                          </div>
                          <div className="w-px bg-gray-200"></div>
                          <div>
                            <p className="text-gray-400 text-xs font-bold mb-1 uppercase">Tidur</p>
                            <p className="font-bold text-xl text-gray-800">{item.sleep} <span className="text-sm font-normal">Jam</span></p>
                          </div>
                        </div>

                        <div className="space-y-3 mt-4">
                          <h4 className="text-sm font-bold text-brand-dark flex items-center gap-2 mb-3">
                            <Bot className="text-brand-green" size={18} /> Analisis AI:
                          </h4>
                          {Array.isArray(aiAnalysis) && aiAnalysis.map((ai, idx) => (
                            <div key={idx} className="bg-brand-light/30 p-4 rounded-2xl flex gap-4 items-start">
                              <div className="w-10 h-10 shrink-0 bg-brand-green/20 text-brand-dark rounded-full flex items-center justify-center mt-1">
                                {ai.icon === 'trend' ? <TrendingUp size={20} /> : <CheckCircle2 size={20} />}
                              </div>
                              <div>
                                <h3 className="font-bold text-brand-dark mb-1">{ai.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{ai.description}</p>
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
                <div className="text-center text-gray-400 py-10">
                  Belum ada riwayat. Silakan simpan metrik hari ini.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}