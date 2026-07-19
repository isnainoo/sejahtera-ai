import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Utensils, Activity, HelpCircle, 
  Search, Bell, Settings, Flame, Moon, Droplets, Smile, Dumbbell, Sparkles, BrainCircuit
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../services/api';
import logo from '../assets/logosejahtera.png';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [latestMetric, setLatestMetric] = useState({ weight: 0, sleep: 0, water: 0, analysis: [] });
  const [latestFood, setLatestFood] = useState({ kalori: 0, protein: 0, karbohidrat: 0, lemak: 0, insight: '' });
  const [profile, setProfile] = useState({ height: 170 }); 
  
  const [selectedMood, setSelectedMood] = useState(() => {
    return localStorage.getItem('sejahtera_mood') || null;
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [metricsRes, foodRes, profileRes] = await Promise.all([
          api.get('/metrics').catch(() => ({ data: [] })),
          api.get('/food-logs').catch(() => ({ data: [] })),
          api.get('/profile').catch(() => ({ data: {} }))
        ]);

        if (profileRes.data && profileRes.data.height) {
          setProfile(profileRes.data);
        }

        const metrics = metricsRes.data;
        if (metrics && metrics.length > 0) {
          const formattedChart = [...metrics].reverse().slice(-7).map((item, index, arr) => {
            const dateObj = new Date(item.date);
            return {
              day: dateObj.toLocaleDateString('id-ID', { weekday: 'short' }),
              weight: item.weight,
              isCurrent: index === arr.length - 1
            };
          });
          setChartData(formattedChart);

          const latestM = metrics[0];
          let parsedMetricAnalysis = [];
          try { parsedMetricAnalysis = JSON.parse(latestM.analysis); } catch(e){}
          
          setLatestMetric({
            weight: latestM.weight,
            sleep: latestM.sleep,
            water: latestM.water,
            analysis: parsedMetricAnalysis
          });
        }

        const foods = foodRes.data;
        if (foods && foods.length > 0) {
          const latestF = foods[0];
          let parsedFoodAI = { summary: { total_kalori: 0, total_protein: 0, total_karbohidrat: 0, total_lemak: 0, insight: '' } };
          try { 
            if(latestF.analysis) parsedFoodAI = JSON.parse(latestF.analysis); 
          } catch(e){}

          setLatestFood({
            kalori: parsedFoodAI.summary?.total_kalori || 0,
            protein: parsedFoodAI.summary?.total_protein || 0,
            karbohidrat: parsedFoodAI.summary?.total_karbohidrat || 0,
            lemak: parsedFoodAI.summary?.total_lemak || 0,
            insight: parsedFoodAI.summary?.insight || 'Belum ada analisis nutrisi.'
          });
        }
      } catch (error) {
        console.error("Gagal menarik data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const heightInMeter = profile.height / 100;
  const bmiValue = latestMetric.weight > 0 ? (latestMetric.weight / (heightInMeter * heightInMeter)).toFixed(1) : 0;
  
  let bmiStatus = "Normal";
  let bmiColor = "text-brand-green bg-brand-light";
  if (bmiValue > 0 && bmiValue < 18.5) { bmiStatus = "Kurus"; bmiColor = "text-blue-600 bg-blue-50"; }
  else if (bmiValue >= 25 && bmiValue < 30) { bmiStatus = "Berlebih"; bmiColor = "text-orange-600 bg-orange-50"; }
  else if (bmiValue >= 30) { bmiStatus = "Obesitas"; bmiColor = "text-red-600 bg-red-50"; }

  const proteinPercent = Math.min((latestFood.protein / 120) * 100, 100);

  const isNewUser = chartData.length === 0 && latestFood.kalori === 0;

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    localStorage.setItem('sejahtera_mood', mood);
  };
  
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-gray-100">
            <span className="text-xl font-bold text-brand-dark flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain drop-shadow-sm" /> 
              Sejahtera AI
            </span>
          </div>
          <nav className="p-4 space-y-2 mt-4">
            <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-brand-light text-brand-dark rounded-xl font-medium">
              <LayoutDashboard size={20} /> Beranda
            </a>
            <a href="/nutrisi" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <Utensils size={20} /> Nutrisi (AI)
            </a>
            <a href="/metrik" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <Activity size={20} /> Metrik Kesehatan
            </a>
            <a href="/bantuan" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <HelpCircle size={20} /> Bantuan
            </a>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">Beranda</h1>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Cari data..." className="pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-full text-sm focus:bg-white focus:border-brand-green focus:ring-2 outline-none transition-all w-64" />
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <Bell size={20} className="hover:text-brand-dark cursor-pointer" />
              <div className="w-9 h-9 rounded-full bg-brand-green text-white flex items-center justify-center font-bold shadow-sm">IS</div>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
          </div>
        ) : (
          <div className="p-8 max-w-7xl mx-auto w-full">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <p className="text-gray-500 text-sm font-medium mb-1">BMI Hari Ini</p>
                <div className="flex items-end gap-2">
                  <h2 className="text-4xl font-bold text-gray-900">{bmiValue > 0 ? bmiValue : '-'}</h2>
                  {bmiValue > 0 && <span className={`${bmiColor} text-xs font-bold px-2 py-1 rounded-md mb-1`}>{bmiStatus}</span>}
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-4 border-brand-green flex items-center justify-center text-brand-green shrink-0"><Flame size={24} /></div>
                <div>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Kalori Hari Ini</p>
                  <p className="text-xl font-bold text-gray-900">{latestFood.kalori} <span className="text-sm font-normal text-gray-500">/ 2,200 kcal</span></p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
                <Moon className="absolute right-4 top-4 text-gray-100" size={48} />
                <p className="text-gray-500 text-sm font-medium mb-1">Tidur Terakhir</p>
                <h2 className="text-3xl font-bold text-gray-900">{latestMetric.sleep} <span className="text-lg font-normal text-gray-500">jam</span></h2>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
                <Droplets className="absolute right-4 top-4 text-brand-light" size={48} />
                <p className="text-gray-500 text-sm font-medium mb-1">Air Terakhir</p>
                <h2 className="text-3xl font-bold text-gray-900">{latestMetric.water} <span className="text-lg font-normal text-gray-500">/ 2.5L</span></h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Makro: Protein</h3>
                    <span className="font-bold text-gray-900">{latestFood.protein}g / 120g</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-8 overflow-hidden">
                    <div className="bg-brand-green h-3 rounded-full transition-all duration-1000" style={{ width: `${proteinPercent}%` }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                      <p className="text-gray-500 text-sm font-medium">Lemak</p>
                      <p className="text-2xl font-bold text-gray-800">{latestFood.lemak}g</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                      <p className="text-gray-500 text-sm font-medium">Karb</p>
                      <p className="text-2xl font-bold text-gray-800">{latestFood.karbohidrat}g</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg mb-6">Progress Berat Badan</h3>
                <div className="h-48 w-full">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <Tooltip cursor={{fill: '#f4f7f6'}} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <Bar dataKey="weight" radius={[4, 4, 0, 0]} maxBarSize={40}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.isCurrent ? '#0F3F2C' : '#68D391'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 text-sm">Belum ada riwayat berat badan.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-dark to-[#0a2e1f] rounded-[2rem] p-8 text-white shadow-xl mb-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 blur-sm transform translate-x-1/4 -translate-y-1/4"><BrainCircuit size={300} /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <Sparkles className="text-brand-light" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Sintesis Kesehatan AI</h2>
                    <p className="text-gray-300 text-sm">Kesimpulan cerdas dari pola makan & aktivitas fisik Anda hari ini</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/20 rounded-2xl p-5 border border-white/10 backdrop-blur-md">
                    <h3 className="font-bold text-brand-light mb-3 border-b border-white/10 pb-2 flex items-center gap-2">
                      <Utensils size={16} /> Gizi & Metabolisme
                    </h3>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {latestFood.insight !== '' ? latestFood.insight : 'Silakan isi Jurnal Nutrisi hari ini untuk mendapatkan insight pencernaan dan metabolisme AI.'}
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-2xl p-5 border border-white/10 backdrop-blur-md">
                    <h3 className="font-bold text-brand-light mb-3 border-b border-white/10 pb-2 flex items-center gap-2">
                      <Activity size={16} /> Fisiologis & Pemulihan
                    </h3>
                    {latestMetric.analysis.length > 0 ? (
                      <ul className="space-y-3">
                        {latestMetric.analysis.map((ai, idx) => (
                          <li key={idx} className="text-sm text-gray-200 flex gap-2">
                            <span className="text-brand-green mt-0.5">▪</span> {ai.description}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-200 leading-relaxed">Silakan catat Metrik Kesehatan hari ini agar AI dapat mengukur tingkat pemulihan tubuh Anda.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-lg mb-6">Target Kedisiplinan</h3>
                  {isNewUser ? (
                    <div className="h-full flex flex-col justify-center items-center text-gray-400 pb-8 opacity-80">
                      <Dumbbell size={40} className="mb-3 text-gray-300" />
                      <p className="text-sm font-medium">Belum ada aktivitas terekam.</p>
                      <p className="text-xs">Mulai isi data harian Anda untuk melacak target!</p>
                    </div>
                  ) : (
                    <div className="space-y-6 mt-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2 font-medium">
                          <span className="flex items-center gap-2"><Activity size={16} className="text-brand-green"/> Konsistensi Metrik Fisik</span>
                          <span className="text-gray-500">{chartData.length} / 7 Hari</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-brand-green h-2 rounded-full transition-all duration-1000" style={{ width: `${(chartData.length / 7) * 100}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2 font-medium">
                          <span className="flex items-center gap-2"><Utensils size={16} className="text-brand-green"/> Konsumsi Nutrisi Harian</span>
                          <span className="text-gray-500">{latestFood.kalori > 0 ? 'Tercatat Hari Ini' : 'Belum Tercatat'}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className={`h-2 rounded-full transition-all duration-1000 ${latestFood.kalori > 0 ? 'bg-brand-green w-full' : 'bg-transparent w-0'}`}></div>
                        </div>
                      </div>
                    </div>
                  )}
               </div>

               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Mood Tracker</h3>
                  <p className="text-gray-500 text-sm mb-6">Bagaimana perasaanmu saat ini?</p>
                  
                  <div className="flex justify-between mb-6">
                    {['Sedih', 'Biasa', 'Senang', 'Semangat', 'Tenang'].map((mood) => (
                      <div 
                        key={mood} 
                        onClick={() => handleMoodSelect(mood)}
                        className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-colors ${selectedMood === mood ? 'bg-brand-light border border-brand-green text-brand-dark shadow-sm' : 'hover:bg-gray-50 text-gray-400'}`}
                      >
                        <Smile size={32} className={selectedMood === mood ? 'text-brand-green' : 'text-gray-300'} />
                        <span className="text-xs font-medium mt-2">{mood}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-brand-light/50 border border-brand-light p-4 rounded-xl flex gap-3 text-sm text-brand-dark">
                    <Flame className="text-brand-green shrink-0 mt-0.5" size={20} />
                    {isNewUser ? (
                       <p>Halo! Catat data tidur dan jurnal makanan pertamamu hari ini agar AI dapat mulai memprediksi tingkat energimu.</p>
                    ) : (
                       <p>
                         {selectedMood 
                           ? `Tercatat! Anda merasa "${selectedMood}". Berdasarkan ${latestMetric.sleep > 0 ? latestMetric.sleep + ' jam tidur' : 'datamu'} hari ini, sistem AI kami sedang menyesuaikan rekomendasi pemulihan untukmu.`
                           : `Berdasarkan data tidur dan kalori hari ini, energi Anda diprediksi cukup baik. Klik ikon di atas untuk membagikan mood Anda.`}
                       </p>
                    )}
                  </div>
               </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}