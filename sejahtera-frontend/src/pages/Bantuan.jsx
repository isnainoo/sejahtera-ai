import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Utensils, Activity, HelpCircle, 
  Search, Bell, Mail, Phone, MessageCircle, ChevronDown, ChevronUp, BookOpen, Sparkles, User
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

export default function Bantuan() {
  const [openFaq, setOpenFaq] = useState(0);
  const [userName, setUserName] = useState('User Sejahtera');

  useEffect(() => {
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

  const faqs = [
    {
      question: "Bagaimana AI menghitung kalori saya?",
      answer: "AI kami memproses deskripsi teks makanan Anda, memecahnya menjadi bahan-bahan penyusun, dan memperkirakan takaran standar. AI kemudian mencocokkannya dengan basis data nutrisi global untuk menghasilkan estimasi kalori dan makronutrisi yang sangat akurat secara instan."
    },
    {
      question: "Apakah data metrik kesehatan saya aman?",
      answer: "Sangat aman. Data berat badan, jam tidur, dan konsumsi air Anda disimpan secara aman di database tersendiri dan hanya digunakan sebagai konteks untuk memberikan analisis personalisasi oleh AI. Kami tidak pernah membagikan data Anda kepada pihak ketiga."
    },
    {
      question: "Bagaimana cara kerja fitur Koki AI?",
      answer: "Anda cukup memasukkan daftar bahan makanan yang ada di kulkas Anda. Koki AI akan meracik resep masakan yang logis, sehat, dan dilengkapi dengan estimasi kalori serta langkah-langkah memasaknya."
    },
    {
      question: "Saya salah memasukkan data, bagaimana cara mengeditnya?",
      answer: "Anda dapat menuju ke halaman Nutrisi (AI) atau Metrik Kesehatan, gulir ke bagian 'Riwayat', lalu klik tombol 'Edit' pada hari yang ingin Anda perbaiki. Sistem akan otomatis menganalisis ulang data baru Anda."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
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
            <Link to="/metrik" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <Activity size={20} /> Metrik Kesehatan
            </Link>
            <Link to="/bantuan" className="flex items-center gap-3 px-4 py-3 bg-brand-light text-brand-dark rounded-xl font-medium transition-colors">
              <HelpCircle size={20} /> Bantuan
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto w-full relative">
        
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <h1 className="text-xl md:text-2xl font-bold text-brand-dark flex items-center gap-2">
            <span className="md:hidden"><img src={logo} alt="Logo" className="w-6 h-6 object-contain" /></span>
              Pusat Bantuan
          </h1>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-4 text-gray-500">
              <Link to="/profile" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-green hover:bg-brand-dark transition-colors text-white flex items-center justify-center font-bold text-sm md:text-base shadow-sm ring-2 ring-brand-light cursor-pointer">
                {getInitials(userName)}
              </Link>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full pb-24 md:pb-8">
          <div className="bg-gradient-to-br from-brand-dark to-brand-green rounded-2xl md:rounded-[2rem] p-6 md:p-10 text-white shadow-xl mb-6 md:mb-10 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <HelpCircle size={200} className="md:w-[300px] md:h-[300px]" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">Ada yang bisa kami bantu?</h2>
              <p className="text-gray-200 text-xs md:text-lg leading-relaxed">
                Temukan panduan penggunaan, jawaban atas pertanyaan umum, atau hubungi tim dukungan kami jika Anda mengalami kendala dalam menggunakan Sejahtera AI.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <div className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg md:text-xl font-bold text-brand-dark flex items-center gap-2 mb-4 md:mb-6">
                  <BookOpen className="text-brand-green w-5 h-5 md:w-6 md:h-6" /> Panduan Pengguna
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="bg-gray-50 p-4 md:p-5 rounded-2xl border border-gray-100">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-brand-light text-brand-dark rounded-full flex items-center justify-center font-bold mb-2 md:mb-3 text-xs md:text-base">1</div>
                    <h4 className="font-bold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Isi Metrik Harian</h4>
                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Catat berat badan, jam tidur, dan air minum Anda setiap pagi di menu Metrik Kesehatan.</p>
                  </div>
                  <div className="bg-gray-50 p-4 md:p-5 rounded-2xl border border-gray-100">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-brand-light text-brand-dark rounded-full flex items-center justify-center font-bold mb-2 md:mb-3 text-xs md:text-base">2</div>
                    <h4 className="font-bold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Jurnal Makanan</h4>
                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Tulis menu sarapan, makan siang, dan malam Anda di menu Nutrisi (AI).</p>
                  </div>
                  <div className="bg-brand-light/30 p-4 md:p-5 rounded-2xl border border-brand-green/20">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-brand-green text-white rounded-full flex items-center justify-center font-bold mb-2 md:mb-3"><Sparkles size={14} className="md:w-4 md:h-4" /></div>
                    <h4 className="font-bold text-brand-dark mb-1 md:mb-2 text-sm md:text-base">Cek Dashboard</h4>
                    <p className="text-xs md:text-sm text-brand-dark/80 leading-relaxed">Kembali ke Beranda untuk melihat ringkasan kesehatan cerdas harian Anda dari AI.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg md:text-xl font-bold text-brand-dark mb-4 md:mb-6">Pertanyaan Umum (FAQ)</h3>
                <div className="space-y-3 md:space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-100 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300">
                      <button 
                        onClick={() => toggleFaq(index)} 
                        className={`w-full text-left px-4 md:px-6 py-3 md:py-4 flex justify-between items-center font-bold transition-colors text-xs md:text-base ${openFaq === index ? 'bg-brand-light/40 text-brand-dark' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        {faq.question}
                        {openFaq === index ? <ChevronUp className="text-brand-green shrink-0 w-4 h-4 md:w-5 md:h-5" /> : <ChevronDown className="text-gray-400 shrink-0 w-4 h-4 md:w-5 md:h-5" />}
                      </button>
                      <div className={`px-4 md:px-6 overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-60 py-3 md:py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="space-y-4 md:space-y-6">
              
              <div className="bg-brand-dark text-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 shadow-lg relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 opacity-20"><MessageCircle size={80} className="md:w-[100px] md:h-[100px]" /></div>
                <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 relative z-10">Tim Support</h3>
                <p className="text-gray-300 text-xs md:text-sm mb-6 md:mb-8 relative z-10">Butuh bantuan lebih lanjut? Jangan ragu untuk menghubungi kami melalui kontak di bawah.</p>
                
                <div className="space-y-3 md:space-y-4 relative z-10">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 hover:bg-white/20 transition-colors cursor-pointer">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-green rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                      <Phone size={16} className="md:w-5 md:h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs text-gray-300">WhatsApp / Telepon</p>
                      <p className="font-bold text-sm md:text-lg">+62 857-2799-7883</p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 hover:bg-white/20 transition-colors cursor-pointer">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-green rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                      <Mail size={16} className="md:w-5 md:h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs text-gray-300">Email Bantuan</p>
                      <p className="font-bold text-sm md:text-lg">sejahteraai@coba.co</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm text-center">
                <h4 className="font-bold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Jam Operasional</h4>
                <p className="text-xs md:text-sm text-gray-500">Senin - Jumat<br/>08.00 - 16.00 WIB</p>
                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100">
                  <p className="text-[10px] md:text-xs text-gray-400">Ditangani sesuai jam Operasional</p>
                </div>
              </div>

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
        <Link to="/metrik" className="flex flex-col items-center text-gray-400 hover:text-brand-green transition-colors">
          <Activity size={20} />
          <span className="text-[10px] font-medium mt-1">Metrik</span>
        </Link>
        <Link to="/bantuan" className="flex flex-col items-center text-brand-green transition-colors">
          <HelpCircle size={20} />
          <span className="text-[10px] font-bold mt-1">Bantuan</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-gray-400 hover:text-brand-green transition-colors">
          <User size={20} />
          <span className="text-[10px] font-medium mt-1">Profil</span>
        </Link>
      </nav>

    </div>
  );
}