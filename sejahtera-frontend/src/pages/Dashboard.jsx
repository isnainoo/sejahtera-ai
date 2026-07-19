import { 
  LayoutDashboard, Utensils, Activity, HelpCircle, 
  Search, Bell, Settings, Flame, Moon, Droplets, Smile, Dumbbell 
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Data dummy untuk grafik berat badan 7 hari terakhir
const weightData = [
  { day: 'Sen', weight: 66, isCurrent: false },
  { day: 'Sel', weight: 65.8, isCurrent: false },
  { day: 'Rab', weight: 65.5, isCurrent: true },
  { day: 'Kam', weight: 65.5, isCurrent: false },
  { day: 'Jum', weight: 65.3, isCurrent: false },
  { day: 'Sab', weight: 65.0, isCurrent: false },
  { day: 'Min', weight: 65.0, isCurrent: false },
];

export default function Dashboard() {
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
            <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-brand-light text-brand-dark rounded-xl font-medium">
              <LayoutDashboard size={20} /> Beranda
            </a>
            <a href="/nutrisi" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-dark rounded-xl font-medium transition-colors">
              <Utensils size={20} /> Nutrisi (AI)
            </a>
            <a href="Metrik" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-dark rounded-xl font-medium transition-colors">
              <Activity size={20} /> Metrik Kesehatan
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-dark rounded-xl font-medium transition-colors">
              <HelpCircle size={20} /> Bantuan
            </a>
          </nav>
        </div>
        
        <div className="p-4">
          <div className="bg-brand-dark rounded-2xl p-4 text-white">
            <p className="text-xs text-gray-300 mb-1">Akses Penuh</p>
            <button className="w-full py-2 bg-brand-green hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
              Upgrade Premium
            </button>
          </div>
          <button className="flex items-center gap-2 text-red-500 font-medium px-4 py-4 w-full mt-2 hover:bg-red-50 rounded-xl transition-colors">
             Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">Beranda</h1>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari data..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-light outline-none transition-all w-64"
              />
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <Bell size={20} className="hover:text-brand-dark cursor-pointer" />
              <Settings size={20} className="hover:text-brand-dark cursor-pointer" />
              <div className="w-9 h-9 rounded-full bg-brand-green text-white flex items-center justify-center font-bold border-2 border-white shadow-sm">
                IS
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-8">
          
          {/* Baris 1: KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* BMI Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-gray-500 text-sm font-medium mb-1">BMI</p>
              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-bold text-gray-900">22.4</h2>
                <span className="bg-brand-light text-brand-green text-xs font-bold px-2 py-1 rounded-md mb-1">Normal</span>
              </div>
            </div>

            {/* Kalori Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-4 border-brand-green flex items-center justify-center text-brand-green">
                <Flame size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase text-xs">Kalori Hari Ini</p>
                <p className="text-xl font-bold text-gray-900">1,850 <span className="text-sm font-normal text-gray-500">/ 2,200 kcal</span></p>
              </div>
            </div>

            {/* Tidur Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
               <Moon className="absolute right-4 top-4 text-gray-100" size={48} />
               <p className="text-gray-500 text-sm font-medium mb-1">Tidur</p>
               <h2 className="text-3xl font-bold text-gray-900">6.5 <span className="text-lg font-normal text-gray-500">jam</span></h2>
            </div>

            {/* Air Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
               <Droplets className="absolute right-4 top-4 text-brand-light" size={48} />
               <p className="text-gray-500 text-sm font-medium mb-1">Air</p>
               <h2 className="text-3xl font-bold text-gray-900">2.0 <span className="text-lg font-normal text-gray-500">/ 2.6L</span></h2>
            </div>
          </div>

          {/* Baris 2: Makro & Grafik */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* Makro Nutrisi */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
               <div>
                 <div className="flex justify-between items-end mb-4">
                   <h3 className="text-gray-500 text-sm font-bold tracking-wider">MAKRO: PROTEIN</h3>
                   <span className="font-bold text-gray-900">95g / 120g</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-3 mb-8">
                   <div className="bg-brand-green h-3 rounded-full" style={{ width: '79%' }}></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-gray-50 p-4 rounded-xl text-center">
                     <p className="text-gray-500 text-sm mb-1">Lemak</p>
                     <p className="text-xl font-bold">45g</p>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-xl text-center">
                     <p className="text-gray-500 text-sm mb-1">Karb</p>
                     <p className="text-xl font-bold">210g</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Grafik Recharts */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h3 className="font-bold text-gray-900 text-lg">Progress Berat Badan</h3>
                   <p className="text-gray-500 text-sm">Turun 1.5kg dalam 30 hari terakhir</p>
                 </div>
                 <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none">
                   <option>30 Hari Terakhir</option>
                 </select>
               </div>
               <div className="h-48 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weightData}>
                      <Tooltip cursor={{fill: '#f4f7f6'}} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Bar dataKey="weight" radius={[4, 4, 0, 0]} maxBarSize={40}>
                        {weightData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.isCurrent ? '#0F3F2C' : '#68D391'} />
                        ))}
                      </Bar>
                    </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Baris 3: Target Mingguan & Mood Tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
             {/* Target Mingguan */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg mb-6">Target Mingguan</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span className="flex items-center gap-2"><Activity size={16} className="text-brand-green"/> Lari 15km</span>
                      <span className="text-gray-500">12km / 15km</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-brand-green h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span className="flex items-center gap-2"><Dumbbell size={16} className="text-brand-green"/> Latihan Beban</span>
                      <span className="text-gray-500">2 / 3 Sesi</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-brand-green h-2 rounded-full" style={{ width: '66%' }}></div>
                    </div>
                  </div>
                </div>
             </div>

             {/* Mood Tracker */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg mb-2">Mood Tracker</h3>
                <p className="text-gray-500 text-sm mb-6">Bagaimana perasaanmu saat ini?</p>
                
                <div className="flex justify-between mb-6">
                  {['Sedih', 'Biasa', 'Senang', 'Semangat', 'Tenang'].map((mood) => (
                    <div key={mood} className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-colors ${mood === 'Senang' ? 'bg-brand-light border border-brand-green text-brand-dark' : 'hover:bg-gray-50 text-gray-400'}`}>
                      <Smile size={32} className={mood === 'Senang' ? 'text-brand-green' : 'text-gray-400'} />
                      <span className="text-xs font-medium mt-2">{mood}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-brand-light p-4 rounded-xl flex gap-3 text-sm text-brand-dark">
                  <Flame className="text-brand-green shrink-0" size={20} />
                  <p>Mood kamu meningkat 20% dibanding minggu lalu. Pertahankan energi positif ini!</p>
                </div>
             </div>

          </div>

        </div>
      </main>
    </div>
  );
}