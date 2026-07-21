import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Utensils, Activity, HelpCircle, 
  Coffee, Sun, Moon, ChefHat, Sparkles, ChevronRight, ActivitySquare, Pencil, X, Save, User
} from 'lucide-react';
import api from '../services/api';
import logo from '../assets/logosejahtera.png';

const getInitials = (name) => {
  if (!name) return 'US';
  const words = name.trim().split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default function Nutrisi() {
  const [formData, setFormData] = useState({ breakfast: '', lunch: '', dinner: '' });
  const [history, setHistory] = useState([]);
  const [userName, setUserName] = useState('User Sejahtera');
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ breakfast: '', lunch: '', dinner: '' });
  const [kokiInput, setKokiInput] = useState('');
  const [kokiResult, setKokiResult] = useState(() => {
    const savedRecipe = localStorage.getItem('lastGeneratedRecipe');
    return savedRecipe ? JSON.parse(savedRecipe) : null;
  });
  
  const [isKokiLoading, setIsKokiLoading] = useState(false);

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
      const res = await api.get('/food-logs');
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

    if (!formData.breakfast && !formData.lunch && !formData.dinner) {
      alert("Harap isi setidaknya satu sesi makan sebelum menyimpan!");
      return;
    }

    setIsSaving(true);
    try {
      await api.post('/food-logs', formData);
      setFormData({ breakfast: '', lunch: '', dinner: '' });
      fetchHistory();
    } catch (err) {
      alert("Gagal memproses data dengan AI");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put(`/food-logs/${id}`, editFormData);
      setEditingId(null);
      fetchHistory();
    } catch (err) {
      alert("Gagal mengupdate data");
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditFormData({ breakfast: item.breakfast, lunch: item.lunch, dinner: item.dinner });
  };

  const handleKokiSubmit = async (e) => {
    e.preventDefault();
    setIsKokiLoading(true);
    try {
      const res = await api.post('/ai/generate-recipe', { ingredients: kokiInput });
      
      setKokiResult(res.data);
      localStorage.setItem('lastGeneratedRecipe', JSON.stringify(res.data));
      
    } catch (err) {
      alert("Gagal membuat resep");
    } finally {
      setIsKokiLoading(false);
    }
  };

  const handleClearRecipe = () => {
    setKokiResult(null);
    setKokiInput('');
    localStorage.removeItem('lastGeneratedRecipe');
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
            <Link to="/nutrisi" className="flex items-center gap-3 px-4 py-3 bg-brand-light text-brand-dark rounded-xl font-medium transition-colors">
              <Utensils size={20} /> Nutrisi (AI)
            </Link>
            <Link to="/metrik" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <Activity size={20} /> Metrik Kesehatan
            </Link>
            <Link to="/bantuan" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-dark rounded-xl font-medium transition-colors">
              <HelpCircle size={20} /> Bantuan
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto w-full relative">
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <h1 className="text-xl md:text-2xl font-bold text-brand-dark flex items-center gap-2">
             <span className="md:hidden"><img src={logo} alt="Logo" className="w-6 h-6 object-contain" /></span>
             Nutrisi & AI
          </h1>
          <div className="flex items-center gap-4">
             <Link to="/profile" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-sm md:text-base shadow-sm ring-2 ring-brand-light cursor-pointer hover:bg-brand-dark transition-colors">
               {getInitials(userName)}
             </Link>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6 md:space-y-8 pb-24 md:pb-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8">
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-brand-light/30 rounded-full blur-2xl md:blur-3xl -mr-10 -mt-10"></div>
              
              <div className="flex items-center gap-3 mb-4 md:mb-6 relative">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-brand-light flex items-center justify-center text-brand-green shrink-0">
                  <ActivitySquare size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-brand-dark">Jurnal AI Harian</h2>
                  <p className="text-xs md:text-sm text-gray-500">Catat 3 sesi makan untuk dianalisis</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 relative">
                <div className="flex items-center bg-gray-50/80 rounded-xl md:rounded-2xl p-1 md:p-2 border border-gray-100 transition-all focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-light">
                  <div className="w-8 md:w-10 flex justify-center text-amber-500"><Coffee size={18} className="md:w-5 md:h-5" /></div>
                  <input type="text" name="breakfast" placeholder="Pagi (cth: 2 roti, 1 telur)" value={formData.breakfast} onChange={handleInputChange} className="flex-1 bg-transparent py-2 md:py-3 px-2 outline-none text-gray-700 text-xs md:text-sm" />
                </div>
                <div className="flex items-center bg-gray-50/80 rounded-xl md:rounded-2xl p-1 md:p-2 border border-gray-100 transition-all focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-light">
                  <div className="w-8 md:w-10 flex justify-center text-orange-500"><Sun size={18} className="md:w-5 md:h-5" /></div>
                  <input type="text" name="lunch" placeholder="Siang (cth: Nasi, dada ayam)" value={formData.lunch} onChange={handleInputChange} className="flex-1 bg-transparent py-2 md:py-3 px-2 outline-none text-gray-700 text-xs md:text-sm" />
                </div>
                <div className="flex items-center bg-gray-50/80 rounded-xl md:rounded-2xl p-1 md:p-2 border border-gray-100 transition-all focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-light">
                  <div className="w-8 md:w-10 flex justify-center text-indigo-500"><Moon size={18} className="md:w-5 md:h-5" /></div>
                  <input type="text" name="dinner" placeholder="Malam (cth: Salad sayur, apel)" value={formData.dinner} onChange={handleInputChange} className="flex-1 bg-transparent py-2 md:py-3 px-2 outline-none text-gray-700 text-xs md:text-sm" />
                </div>
                <button type="submit" disabled={isSaving} className="w-full mt-2 md:mt-4 py-3 md:py-4 bg-brand-dark hover:bg-brand-green text-white rounded-xl md:rounded-2xl font-bold shadow-lg shadow-brand-green/20 transition-all flex justify-center items-center gap-2 disabled:opacity-70 text-sm md:text-base">
                  {isSaving && !editingId ? 'Menganalisis...' : <><Sparkles size={16} /> Simpan Harian</>}
                </button>
              </form>
            </div>

            <div className="bg-gradient-to-br from-brand-dark to-[#0a2e1f] p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-lg text-white relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 opacity-10"><ChefHat size={120} className="md:w-[150px] md:h-[150px]" /></div>
              
              <div className="flex items-center gap-3 mb-4 md:mb-6 relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm shrink-0">
                  <ChefHat size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold">Koki AI Pribadi</h2>
                  <p className="text-xs md:text-sm text-gray-300">Buat resep sehat dari bahan yang ada</p>
                </div>
              </div>

              <form onSubmit={handleKokiSubmit} className="space-y-3 md:space-y-4 relative z-10">
                <textarea 
                  rows="3" 
                  required 
                  placeholder="Bahan-bahan... (cth: Ayam, bayam, tomat)" 
                  value={kokiInput} 
                  onChange={(e) => setKokiInput(e.target.value)} 
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-4 outline-none placeholder-gray-400 text-white focus:border-brand-light transition-colors resize-none text-xs md:text-sm"
                />
                <button type="submit" disabled={isKokiLoading} className="w-full py-3 md:py-4 bg-brand-green hover:bg-green-600 text-white rounded-xl md:rounded-2xl font-bold shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70 text-sm md:text-base">
                  {isKokiLoading ? 'Meracik Resep...' : 'Buat Resep'}
                </button>
              </form>

              {kokiResult && (
                <div className="mt-4 md:mt-6 p-4 md:p-5 bg-white/10 backdrop-blur-lg rounded-xl md:rounded-2xl border border-white/20 animate-fade-in text-xs md:text-sm relative">
                  
                  <button 
                    onClick={handleClearRecipe}
                    className="absolute top-3 right-3 text-white/50 hover:text-white bg-white/5 hover:bg-white/20 p-1 rounded-md transition-colors"
                    title="Hapus Resep"
                  >
                    <X size={16} />
                  </button>

                  <h3 className="font-bold text-brand-light text-base md:text-lg mb-1 md:mb-2 pr-6">{kokiResult.nama_hidangan}</h3>
                  <p className="text-[10px] md:text-xs text-gray-300 mb-2 md:mb-3 border-b border-white/20 pb-2">Est. Kalori: <span className="font-bold text-white">{kokiResult.estimasi_kalori} kcal</span></p>
                  
                  <p className="font-bold mb-1">Bahan Tambahan:</p>
                  <ul className="list-disc pl-4 mb-2 md:mb-3 text-gray-200">
                    {kokiResult.bahan_tambahan?.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  
                  <p className="font-bold mb-1">Langkah Memasak:</p>
                  <ol className="list-decimal pl-4 text-gray-200">
                    {kokiResult.langkah_memasak?.map((l, i) => <li key={i}>{l}</li>)}
                  </ol>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 md:mt-10">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-4 md:mb-6">Riwayat & Analisis Harian</h2>
            
            <div className="space-y-6 md:space-y-8">
              {history.map((item) => {
                const dateString = new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                const isEditing = editingId === item.id;
                
                let ai = { meals: {}, summary: {} };
                try { 
                  if(item.analysis && !item.analysis.includes("error")) {
                    ai = JSON.parse(item.analysis); 
                  }
                } catch(e) {}

                return (
                  <div key={item.id} className="bg-white rounded-2xl md:rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    
                    <div className="px-4 md:px-8 py-3 md:py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                      <span className="font-bold text-gray-700 text-xs md:text-base">{dateString}</span>
                      {!isEditing ? (
                         <button onClick={() => startEdit(item)} className="text-gray-500 hover:text-brand-green flex items-center gap-1 md:gap-2 text-[10px] md:text-sm bg-white border border-gray-200 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl transition-all shadow-sm">
                           <Pencil size={12} className="md:w-3 md:h-3" /> Edit
                         </button>
                      ) : (
                         <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-700 flex items-center gap-1 md:gap-2 text-[10px] md:text-sm bg-white border border-red-200 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl transition-all shadow-sm">
                           <X size={12} className="md:w-3 md:h-3" /> Batal
                         </button>
                      )}
                    </div>

                    <div className="p-4 md:p-8">
                      {isEditing ? (
                        <form onSubmit={(e) => handleUpdate(e, item.id)} className="animate-fade-in space-y-3 md:space-y-4 max-w-2xl mx-auto">
                           <div className="space-y-2 md:space-y-3">
                             <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Makan Pagi</label>
                             <input type="text" name="breakfast" value={editFormData.breakfast} onChange={(e) => handleInputChange(e, true)} className="w-full bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl p-2 md:p-3 outline-none focus:border-brand-green text-xs md:text-sm"/>
                             
                             <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Makan Siang</label>
                             <input type="text" name="lunch" value={editFormData.lunch} onChange={(e) => handleInputChange(e, true)} className="w-full bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl p-2 md:p-3 outline-none focus:border-brand-green text-xs md:text-sm"/>
                             
                             <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Makan Malam</label>
                             <input type="text" name="dinner" value={editFormData.dinner} onChange={(e) => handleInputChange(e, true)} className="w-full bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl p-2 md:p-3 outline-none focus:border-brand-green text-xs md:text-sm"/>
                           </div>
                           <button type="submit" disabled={isSaving} className="w-full py-3 md:py-4 mt-2 bg-brand-green text-white rounded-lg md:rounded-xl font-bold flex justify-center items-center gap-2 text-xs md:text-base">
                             {isSaving ? 'Memproses...' : <><Save size={16} /> Update Data Harian</>}
                           </button>
                        </form>
                      ) : (
                        <div className="flex flex-col xl:flex-row gap-6 md:gap-10">
                          
                          <div className="xl:w-1/3 space-y-4 md:space-y-6">
                            {['breakfast', 'lunch', 'dinner'].map((session) => (
                              <div key={session} className="relative pl-4 md:pl-6 border-l-2 border-brand-light">
                                <div className="absolute -left-[7px] md:-left-[9px] top-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-brand-green border-2 md:border-4 border-white"></div>
                                <h4 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                  {session === 'breakfast' ? 'Makan Pagi' : session === 'lunch' ? 'Makan Siang' : 'Makan Malam'}
                                </h4>
                                <p className="text-gray-800 font-medium leading-relaxed text-xs md:text-base">{item[session] || '-'}</p>
                                
                                {ai.meals && ai.meals[session === 'breakfast' ? 'pagi' : session === 'lunch' ? 'siang' : 'malam'] && (
                                  <div className="mt-1 md:mt-2 flex gap-2 md:gap-3 text-[10px] md:text-xs font-bold text-brand-dark">
                                    <span className="bg-brand-light/50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md">{ai.meals[session === 'breakfast' ? 'pagi' : session === 'lunch' ? 'siang' : 'malam'].kalori} kcal</span>
                                    <span className="bg-blue-50 text-blue-600 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md">Pro: {ai.meals[session === 'breakfast' ? 'pagi' : session === 'lunch' ? 'siang' : 'malam'].protein}g</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="xl:w-2/3 bg-brand-dark rounded-2xl md:rounded-[1.5rem] p-4 md:p-6 text-white shadow-xl shadow-brand-dark/20 flex flex-col justify-between">
                            
                            {ai.summary ? (
                              <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
                                  <div className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4 backdrop-blur-sm border border-white/10">
                                    <p className="text-gray-300 text-[10px] md:text-xs mb-1">Total Kalori</p>
                                    <p className="text-lg md:text-2xl font-bold text-brand-light">{ai.summary.total_kalori || 0}</p>
                                  </div>
                                  <div className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4 backdrop-blur-sm border border-white/10">
                                    <p className="text-gray-300 text-[10px] md:text-xs mb-1">Protein (g)</p>
                                    <p className="text-base md:text-xl font-bold">{ai.summary.total_protein || 0}</p>
                                  </div>
                                  <div className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4 backdrop-blur-sm border border-white/10">
                                    <p className="text-gray-300 text-[10px] md:text-xs mb-1">Karb (g)</p>
                                    <p className="text-base md:text-xl font-bold">{ai.summary.total_karbohidrat || 0}</p>
                                  </div>
                                  <div className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4 backdrop-blur-sm border border-white/10">
                                    <p className="text-gray-300 text-[10px] md:text-xs mb-1">Lemak (g)</p>
                                    <p className="text-base md:text-xl font-bold">{ai.summary.total_lemak || 0}</p>
                                  </div>
                                </div>
                                
                                <div className="bg-brand-green/30 border border-brand-green/50 p-3 md:p-4 rounded-xl mb-4 md:mb-6 flex gap-2 md:gap-3 items-start">
                                  <Sparkles className="text-brand-light shrink-0 mt-0.5 md:mt-1 w-4 h-4 md:w-5 md:h-5" />
                                  <p className="text-xs md:text-sm leading-relaxed text-gray-100">{ai.summary.insight || "Data analisis sedang disiapkan..."}</p>
                                </div>

                                <div>
                                  <h4 className="text-xs md:text-sm font-bold text-brand-light mb-2 md:mb-3">🍽️ Rekomendasi Menu Besok</h4>
                                  <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                                    {ai.summary.rekomendasi_besok?.map((rek, idx) => (
                                      <div key={idx} className="flex-1 bg-black/20 rounded-md md:rounded-lg p-2 md:p-3 text-[10px] md:text-xs border border-white/5 flex items-center gap-1.5 md:gap-2">
                                        <ChevronRight size={12} className="text-brand-green shrink-0" /> {rek}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="h-full flex items-center justify-center text-gray-400 text-xs md:text-sm py-4">
                                <p>Analisis AI belum tersedia untuk log ini.</p>
                              </div>
                            )}

                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {history.length === 0 && (
                <div className="text-center text-gray-400 py-10 md:py-16 bg-white rounded-2xl md:rounded-3xl border border-gray-100 border-dashed">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Utensils size={20} className="md:w-6 md:h-6" />
                  </div>
                  <p className="font-medium text-sm md:text-base">Jurnal nutrisi harian masih kosong.</p>
                  <p className="text-xs md:text-sm mt-1">Silakan catat 3 sesi makan Anda hari ini!</p>
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
        <Link to="/nutrisi" className="flex flex-col items-center text-brand-green">
          <Utensils size={20} />
          <span className="text-[10px] font-bold mt-1">Nutrisi</span>
        </Link>
        <Link to="/metrik" className="flex flex-col items-center text-gray-400 hover:text-brand-green transition-colors">
          <Activity size={20} />
          <span className="text-[10px] font-medium mt-1">Metrik</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-gray-400 hover:text-brand-green transition-colors">
          <User size={20} />
          <span className="text-[10px] font-medium mt-1">Profil</span>
        </Link>
      </nav>

    </div>
  );
}