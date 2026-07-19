import { useState } from 'react';
import { 
  LayoutDashboard, Utensils, Activity, HelpCircle, 
  Search, Bell, Mail, Phone, MessageCircle, ChevronDown, ChevronUp, BookOpen, Sparkles
} from 'lucide-react';
import logo from '../assets/logosejahtera.png';

export default function Bantuan() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      question: "Bagaimana AI menghitung kalori saya?",
      answer: "AI kami (didukung oleh Google Gemini) memproses deskripsi teks makanan Anda, memecahnya menjadi bahan-bahan penyusun, dan memperkirakan takaran standar. AI kemudian mencocokkannya dengan basis data nutrisi global untuk menghasilkan estimasi kalori dan makronutrisi yang sangat akurat secara instan."
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
      
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-gray-100">
            <span className="text-xl font-bold text-brand-dark flex items-center gap-3">
              <img src={logo} alt="Logo Sejahtera" className="w-8 h-8 object-contain drop-shadow-sm" /> 
              Sejahtera AI
            </span>
          </div>
          <nav className="p-4 space-y-2 mt-4">
            <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <LayoutDashboard size={20} /> Beranda
            </a>
            <a href="/nutrisi" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <Utensils size={20} /> Nutrisi (AI)
            </a>
            <a href="/metrik" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <Activity size={20} /> Metrik Kesehatan
            </a>
            <a href="/bantuan" className="flex items-center gap-3 px-4 py-3 bg-brand-light text-brand-dark rounded-xl font-medium">
              <HelpCircle size={20} /> Bantuan
            </a>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">Pusat Bantuan</h1>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Cari bantuan..." className="pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-full text-sm focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-light outline-none transition-all w-64" />
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <Bell size={20} className="hover:text-brand-dark cursor-pointer" />
              <div className="w-9 h-9 rounded-full bg-brand-green text-white flex items-center justify-center font-bold shadow-sm">IS</div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full pb-24">
          
          <div className="bg-gradient-to-br from-brand-dark to-brand-green rounded-[2rem] p-10 text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <HelpCircle size={300} />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Ada yang bisa kami bantu?</h2>
              <p className="text-gray-200 text-lg leading-relaxed">
                Temukan panduan penggunaan, jawaban atas pertanyaan umum, atau hubungi tim dukungan kami jika Anda mengalami kendala dalam menggunakan Sejahtera AI.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-8">
              
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2 mb-6">
                  <BookOpen className="text-brand-green" size={24} /> Panduan Pengguna
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <div className="w-8 h-8 bg-brand-light text-brand-dark rounded-full flex items-center justify-center font-bold mb-3">1</div>
                    <h4 className="font-bold text-gray-800 mb-2">Isi Metrik Harian</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Catat berat badan, jam tidur, dan air minum Anda setiap pagi di menu Metrik Kesehatan.</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <div className="w-8 h-8 bg-brand-light text-brand-dark rounded-full flex items-center justify-center font-bold mb-3">2</div>
                    <h4 className="font-bold text-gray-800 mb-2">Jurnal Makanan</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Tulis menu sarapan, makan siang, dan malam Anda di menu Nutrisi (AI).</p>
                  </div>
                  <div className="bg-brand-light/30 p-5 rounded-2xl border border-brand-green/20">
                    <div className="w-8 h-8 bg-brand-green text-white rounded-full flex items-center justify-center font-bold mb-3"><Sparkles size={16}/></div>
                    <h4 className="font-bold text-brand-dark mb-2">Cek Dashboard</h4>
                    <p className="text-sm text-brand-dark/80 leading-relaxed">Kembali ke Beranda untuk melihat ringkasan kesehatan cerdas harian Anda dari AI.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-brand-dark mb-6">Pertanyaan Umum (FAQ)</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300">
                      <button 
                        onClick={() => toggleFaq(index)} 
                        className={`w-full text-left px-6 py-4 flex justify-between items-center font-bold transition-colors ${openFaq === index ? 'bg-brand-light/40 text-brand-dark' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        {faq.question}
                        {openFaq === index ? <ChevronUp className="text-brand-green" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
                      </button>
                      <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
                        <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="space-y-6">
              
              <div className="bg-brand-dark text-white rounded-[2rem] p-8 shadow-lg relative overflow-hidden">
                <div className="absolute -bottom-6 -right-6 opacity-20"><MessageCircle size={100} /></div>
                <h3 className="text-xl font-bold mb-2 relative z-10">Tim Support</h3>
                <p className="text-gray-300 text-sm mb-8 relative z-10">Butuh bantuan lebih lanjut? Jangan ragu untuk menghubungi kami melalui kontak di bawah.</p>
                
                <div className="space-y-4 relative z-10">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/20 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-300">WhatsApp / Telepon</p>
                      <p className="font-bold text-lg">+62 857-2799-7883</p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/20 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-300">Email Bantuan</p>
                      <p className="font-bold text-lg">sejahteraai@coba.co</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm text-center">
                <h4 className="font-bold text-gray-800 mb-2">Jam Operasional</h4>
                <p className="text-sm text-gray-500">Senin - Jumat<br/>08.00 - 16.00 WIB</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">Ditangani sesuai jam Operasional</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}