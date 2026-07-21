import { Link } from 'react-router-dom';
import { 
  ArrowRight, BrainCircuit, Activity, Utensils, 
  Sparkles, HeartPulse, ChevronRight, ShieldCheck 
} from 'lucide-react';
import logo from '../assets/logosejahtera.png';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden selection:bg-brand-green selection:text-white">
      
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo Sejahtera" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-sm" />
            <span className="text-xl md:text-2xl font-bold text-brand-dark tracking-tight">Sejahtera AI</span>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <Link to="/login" className="text-sm md:text-base font-bold text-gray-600 hover:text-brand-green transition-colors px-2 md:px-4">
              Masuk
            </Link>
            <Link to="/register" className="text-sm md:text-base font-bold bg-brand-dark hover:bg-brand-green text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl shadow-lg transition-all flex items-center gap-2">
              Daftar <ArrowRight size={18} className="hidden md:block" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        <div className="absolute top-20 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-brand-light/40 rounded-full blur-[80px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-brand-green/10 rounded-full blur-[60px] -z-10"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-light/30 border border-brand-green/20 text-brand-dark font-bold text-xs md:text-sm mb-6 md:mb-8 animate-fade-in">
            Revolusi Gaya Hidup Sehat dengan AI
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6 md:mb-8 tracking-tight">
            Asisten Kesehatan <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-dark">Pintar</span> di Genggamanmu.
          </h1>
          
          <p className="text-base md:text-xl text-gray-600 leading-relaxed mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            Sejahtera AI menganalisis pola makan, aktivitas fisik, dan kualitas tidur Anda secara personal. Dapatkan rekomendasi harian yang didukung oleh kecerdasan buatan kelas dunia.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-brand-green hover:bg-[#0a2e1f] text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-green/20 transition-all flex items-center justify-center gap-2 group">
              Mulai Perjalananmu <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mengapa Memilih Sejahtera AI?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Kami merancang setiap fitur untuk memudahkan Anda mencapai target kesehatan tanpa perlu menghitung kalori secara manual.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-[#F8FAFC] p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <BrainCircuit size={28} className="text-brand-green" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Analisis AI Hiper-Personal</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Tidak ada lagi perhitungan manual. AI kami menghitung kalori, makronutrisi, dan memberikan sintesis harian berdasarkan usia, kelamin, dan aktivitas Anda.
              </p>
            </div>

            <div className="bg-[#F8FAFC] p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Utensils size={28} className="text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Jurnal & Koki Cerdas</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Cukup ketik menu makan Anda dalam bahasa sehari-hari. Bingung mau masak apa? Sebutkan bahan di kulkas, dan Koki AI akan membuat resep instan.
              </p>
            </div>

            <div className="bg-[#F8FAFC] p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Activity size={28} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Pemantauan Holistik</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Catat berat badan, konsumsi air minum, dan jam tidur Anda. AI akan menghubungkan titik-titik tersebut untuk memprediksi tingkat pemulihan energi Anda.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-brand-dark to-[#0a2e1f] rounded-[3rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 blur-sm transform translate-x-1/4 -translate-y-1/4"><HeartPulse size={300} className="text-brand-light" /></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Siap Mengubah Pola Hidupmu?</h2>
            <p className="text-gray-300 text-base md:text-lg mb-10 max-w-2xl mx-auto">
              Bergabunglah hari ini dan rasakan bedanya memiliki asisten gizi pribadi di saku Anda.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-brand-light hover:bg-white text-brand-dark rounded-full font-bold text-lg shadow-lg transition-transform hover:scale-105">
              Buat Akun Sekarang <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 py-10 mt-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-6 h-6 object-contain grayscale opacity-50" />
            <span className="font-bold text-gray-400">Sejahtera AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400 font-medium">
            <span className="flex items-center gap-1"><ShieldCheck size={16}/> Privasi Data Aman</span>
          </div>
        </div>
      </footer>

    </div>
  );
}