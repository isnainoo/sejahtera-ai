import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Utensils, Activity, HelpCircle, 
  Search, Bell, Flame, Moon, Droplets, Smile, Dumbbell, Sparkles, BrainCircuit, User
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../services/api';
import logo from '../assets/logosejahtera.png';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  
  const [chartData, setChartData] = useState([]);
  const [latestMetric, setLatestMetric] = useState({ weight: 0, sleep: 0, water: 0, analysis: [] });
  const [latestFood, setLatestFood] = useState({ kalori: 0, protein: 0, karbohidrat: 0, lemak: 0, insight: '' });
  const [profile, setProfile] = useState({ name: '', height: 170, age: 25, gender: 'Laki-laki' }); 
  const [selectedMood, setSelectedMood] = useState(() => {
    return localStorage.getItem('sejahtera_mood') || null;
  });

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    localStorage.setItem('sejahtera_mood', mood);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [metricsRes, foodRes, profileRes] = await Promise.all([
          api.get('/metrics').catch(() => ({ data: [] })),
          api.get('/food-logs').catch(() => ({ data: [] })),
          api.get('/profile').catch(() => ({ data: {} }))
        ]);

        if (profileRes.data) {
          setProfile({
            name: profileRes.data.name || '',
            height: profileRes.data.profile?.height || profileRes.data.height || 170,
            age: profileRes.data.age || 25,
            gender: profileRes.data.gender || 'Laki-laki'
          });
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
          try { if(latestF.analysis) parsedFoodAI = JSON.parse(latestF.analysis); } catch(e){}

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

  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(' ');
    if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const heightInMeter = profile.height / 100;
  const bmiValue = latestMetric.weight > 0 ? (latestMetric.weight / (heightInMeter * heightInMeter)).toFixed(1) : 0;
  
  let bmiStatus = "Normal";
  let bmiColor = "text-brand-green bg-brand-light";
  if (bmiValue > 0 && bmiValue < 18.5) { bmiStatus = "Kurus"; bmiColor = "text-blue-600 bg-blue-50"; }
  else if (bmiValue >= 25 && bmiValue < 30) { bmiStatus = "Berlebih"; bmiColor = "text-orange-600 bg-orange-50"; }
  else if (bmiValue >= 30) { bmiStatus = "Obesitas"; bmiColor = "text-red-600 bg-red-50"; }

  let bmr = 0;
  if (latestMetric.weight > 0) {
    if (profile.gender.toLowerCase() === 'perempuan') {
      bmr = (10 * latestMetric.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;
    } else {
      bmr = (10 * latestMetric.weight) + (6.25 * profile.height) - (5 * profile.age) + 5;
    }
  }
  const tdee = Math.round(bmr * 1.2);
  bmr = Math.round(bmr);

  const proteinPercent = Math.min((latestFood.protein / 120) * 100, 100);
  const isNewUser = chartData.length === 0 && latestFood.kalori === 0;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-gray-100">
            <span className="text-xl font-bold text-brand-dark flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain drop-shadow-sm" /> 
              Sejahtera AI
            </span>
          </div>
          <nav className="p-4 space-y-2 mt-4">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-brand-light text-brand-dark rounded-xl font-medium">
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
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <h1 className="text-xl md:text-2xl font-bold text-brand-dark flex items-center gap-2">
            <span className="md:hidden"><img src={logo} alt="Logo" className="w-6 h-6 object-contain" /></span>
              Beranda
          </h1>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-4 text-gray-500">
              <Link to="/profile" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-green hover:bg-brand-dark transition-colors text-white flex items-center justify-center font-bold text-sm md:text-base shadow-sm ring-2 ring-brand-light">
                {getInitials(profile.name)}
              </Link>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-brand-green"></div>
          </div>
        ) : (
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
            
            <div className="bg-gradient-to-br from-brand-dark to-[#0a2e1f] rounded-2xl md:rounded-[2rem] p-5 md:p-8 text-white shadow-xl mb-4 md:mb-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 blur-sm transform translate-x-1/4 -translate-y-1/4"><BrainCircuit size={200} className="md:w-[300px] md:h-[300px]" /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
                    <Sparkles className="text-brand-light w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-2xl font-bold">Sintesis Kesehatan AI</h2>
                    <p className="text-gray-300 text-xs md:text-sm">Kesimpulan pola makan & aktivitas fisik Anda</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-black/20 rounded-xl md:rounded-2xl p-4 md:p-5 border border-white/10 backdrop-blur-md">
                    <h3 className="font-bold text-brand-light text-sm md:text-base mb-2 md:mb-3 border-b border-white/10 pb-2 flex items-center gap-2">
                      <Utensils size={14} className="md:w-4 md:h-4" /> Gizi & Metabolisme
                    </h3>
                    <p className="text-xs md:text-sm text-gray-200 leading-relaxed">
                      {latestFood.insight !== '' ? latestFood.insight : 'Silakan isi Jurnal Nutrisi hari ini untuk insight AI.'}
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-xl md:rounded-2xl p-4 md:p-5 border border-white/10 backdrop-blur-md">
                    <h3 className="font-bold text-brand-light text-sm md:text-base mb-2 md:mb-3 border-b border-white/10 pb-2 flex items-center gap-2">
                      <Activity size={14} className="md:w-4 md:h-4" /> Fisiologis & Pemulihan
                    </h3>
                    {latestMetric.analysis.length > 0 ? (
                      <ul className="space-y-2 md:space-y-3">
                        {latestMetric.analysis.map((ai, idx) => (
                          <li key={idx} className="text-xs md:text-sm text-gray-200 flex gap-2">
                            <span className="text-brand-green mt-0.5">▪</span> {ai.description}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs md:text-sm text-gray-200 leading-relaxed">Silakan catat Metrik Kesehatan hari ini agar AI dapat mengukur pemulihan Anda.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-6">
              <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">BMI Hari Ini</p>
                <div className="flex flex-col xl:flex-row xl:items-end gap-1 md:gap-2">
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-900">{bmiValue > 0 ? bmiValue : '-'}</h2>
                  {bmiValue > 0 && <span className={`${bmiColor} text-[10px] md:text-xs font-bold px-2 py-1 rounded-md w-fit`}>{bmiStatus}</span>}
                </div>
              </div>
              <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 md:border-4 border-brand-green flex items-center justify-center text-brand-green shrink-0"><Flame size={20} className="md:w-6 md:h-6" /></div>
                <div>
                  <p className="text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-wider">Kalori</p>
                  <p className="text-lg md:text-xl font-bold text-gray-900 leading-tight">{latestFood.kalori} <span className="block xl:inline text-xs md:text-sm font-normal text-gray-500">/ {tdee > 0 ? tdee : 2200}</span></p>
                </div>
              </div>
              <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
                <Moon className="absolute right-2 md:right-4 top-2 md:top-4 text-gray-50 opacity-50 md:opacity-100" size={32} />
                <p className="text-gray-500 text-xs md:text-sm font-medium mb-1 relative z-10">Tidur</p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 relative z-10">{latestMetric.sleep} <span className="text-sm md:text-lg font-normal text-gray-500">jam</span></h2>
              </div>
              <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
                <Droplets className="absolute right-2 md:right-4 top-2 md:top-4 text-brand-light/30 md:text-brand-light" size={32} />
                <p className="text-gray-500 text-xs md:text-sm font-medium mb-1 relative z-10">Air</p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 relative z-10">{latestMetric.water} <span className="text-sm md:text-lg font-normal text-gray-500">/ 2.5L</span></h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
              <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-gray-500 text-xs md:text-sm font-bold uppercase">Makro: Protein</h3>
                    <span className="font-bold text-sm md:text-base text-gray-900">{latestFood.protein}g / 120g</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 md:h-3 mb-6 md:mb-8 overflow-hidden">
                    <div className="bg-brand-green h-full rounded-full transition-all duration-1000" style={{ width: `${proteinPercent}%` }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="bg-gray-50 p-3 md:p-4 rounded-xl text-center border border-gray-100">
                      <p className="text-gray-500 text-xs md:text-sm font-medium">Lemak</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-800">{latestFood.lemak}g</p>
                    </div>
                    <div className="bg-gray-50 p-3 md:p-4 rounded-xl text-center border border-gray-100">
                      <p className="text-gray-500 text-xs md:text-sm font-medium">Karb</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-800">{latestFood.karbohidrat}g</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base md:text-lg mb-4 md:mb-6">Metabolisme (BMR & TDEE)</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between text-xs md:text-sm mb-1 font-medium">
                        <span className="text-gray-500 uppercase">BMR (Istirahat)</span>
                        <span className="font-bold text-gray-900">{bmr > 0 ? bmr : '-'} kcal</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 md:h-2">
                        <div className="bg-blue-400 h-full rounded-full transition-all" style={{ width: bmr > 0 ? '70%' : '0%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs md:text-sm mb-1 font-medium">
                        <span className="text-gray-500 uppercase">TDEE (Total)</span>
                        <span className="font-bold text-brand-green">{tdee > 0 ? tdee : '-'} kcal</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 md:h-2">
                        <div className="bg-brand-green h-full rounded-full transition-all" style={{ width: tdee > 0 ? '100%' : '0%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-brand-light/30 p-3 md:p-4 rounded-xl border border-brand-green/10 flex items-start gap-3">
                  <Activity size={18} className="text-brand-green shrink-0 mt-0.5" />
                  <p className="text-[10px] md:text-xs text-gray-600 leading-relaxed">
                    BMR adalah kalori dasar tanpa aktivitas. TDEE adalah batas kalori harianmu. {latestFood.kalori > 0 && <span>Konsumsi hari ini: <strong className="text-brand-dark">{latestFood.kalori} kcal</strong>.</span>}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 text-base md:text-lg mb-4 md:mb-6">Progress Berat Badan</h3>
                <div className="h-40 md:h-48 w-full">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                        <Tooltip cursor={{fill: '#f4f7f6'}} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                        <Bar dataKey="weight" radius={[4, 4, 0, 0]} maxBarSize={30}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.isCurrent ? '#0F3F2C' : '#68D391'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 text-xs md:text-sm">Belum ada riwayat.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
               <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-base md:text-lg mb-4 md:mb-6">Target Kedisiplinan</h3>
                  {isNewUser ? (
                    <div className="h-full flex flex-col justify-center items-center text-gray-400 pb-4 md:pb-8 opacity-80 text-center">
                      <Dumbbell size={32} className="md:w-10 md:h-10 mb-2 md:mb-3 text-gray-300" />
                      <p className="text-xs md:text-sm font-medium">Belum ada aktivitas terekam.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 md:space-y-6 mt-2 md:mt-4">
                      <div>
                        <div className="flex justify-between text-xs md:text-sm mb-1 md:mb-2 font-medium">
                          <span className="flex items-center gap-1 md:gap-2"><Activity size={14} className="text-brand-green md:w-4 md:h-4"/> Konsistensi Metrik</span>
                          <span className="text-gray-500">{chartData.length} / 7 Hari</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 md:h-2">
                          <div className="bg-brand-green h-full rounded-full transition-all duration-1000" style={{ width: `${(chartData.length / 7) * 100}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs md:text-sm mb-1 md:mb-2 font-medium">
                          <span className="flex items-center gap-1 md:gap-2"><Utensils size={14} className="text-brand-green md:w-4 md:h-4"/> Konsumsi Nutrisi</span>
                          <span className="text-gray-500">{latestFood.kalori > 0 ? 'Tercatat' : 'Belum'}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 md:h-2">
                          <div className={`h-full rounded-full transition-all duration-1000 ${latestFood.kalori > 0 ? 'bg-brand-green w-full' : 'bg-transparent w-0'}`}></div>
                        </div>
                      </div>
                    </div>
                  )}
               </div>

               <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1 md:mb-2">Mood Tracker</h3>
                  <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6">Bagaimana perasaanmu saat ini?</p>
                  
                  <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-between gap-2 md:gap-0 mb-4 md:mb-6">
                    {['Sedih', 'Biasa', 'Senang', 'Semangat', 'Tenang'].map((mood) => (
                      <div 
                        key={mood} 
                        onClick={() => handleMoodSelect(mood)}
                        className={`flex flex-col items-center justify-center p-2 md:p-3 rounded-xl cursor-pointer transition-colors w-[60px] md:w-auto ${selectedMood === mood ? 'bg-brand-light border border-brand-green text-brand-dark shadow-sm' : 'hover:bg-gray-50 text-gray-400'}`}
                      >
                        <Smile size={24} className={`md:w-8 md:h-8 ${selectedMood === mood ? 'text-brand-green' : 'text-gray-300'}`} />
                        <span className="text-[9px] md:text-xs font-medium mt-1 md:mt-2">{mood}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-brand-light/50 border border-brand-light p-3 md:p-4 rounded-xl flex gap-2 md:gap-3 text-xs md:text-sm text-brand-dark items-start">
                    <Flame className="text-brand-green shrink-0 mt-0.5 w-4 h-4 md:w-5 md:h-5" />
                    {isNewUser ? (
                       <p className="leading-relaxed">Halo! Catat data tidur dan makanan pertamamu hari ini agar AI dapat memprediksi energimu.</p>
                    ) : (
                       <p className="leading-relaxed">
                         {selectedMood 
                           ? `Tercatat! Anda merasa "${selectedMood}". Berdasarkan ${latestMetric.sleep > 0 ? latestMetric.sleep + ' jam tidur' : 'datamu'} hari ini, sistem AI menyesuaikan pemulihan untukmu.`
                           : `Berdasarkan data tidur dan kalori hari ini, energi Anda diprediksi cukup baik. Klik ikon di atas untuk membagikan mood Anda.`}
                       </p>
                    )}
                  </div>
               </div>
            </div>

          </div>
        )}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 px-2 pb-safe">
        <Link to="/dashboard" className="flex flex-col items-center text-brand-green transition-colors">
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold mt-1">Beranda</span>
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
        <Link to="/profile" className="flex flex-col items-center text-gray-400 hover:text-brand-green transition-colors">
          <User size={20} />
          <span className="text-[10px] font-medium mt-1">Profil</span>
        </Link>
      </nav>

    </div>
  );
}