import { useState } from 'react';
import { LayoutDashboard, Utensils, Activity, HelpCircle, Search, Bell, Settings, ChefHat, Apple } from 'lucide-react';
import api from '../services/api';

export default function Nutrisi() {
  // State untuk Analisis Makanan
  const [foodInput, setFoodInput] = useState('');
  const [foodResult, setFoodResult] = useState(null);
  const [isFoodLoading, setIsFoodLoading] = useState(false);

  // State untuk Rekomendasi Resep
  const [recipeInput, setRecipeInput] = useState('');
  const [recipeResult, setRecipeResult] = useState(null);
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);

  // Handler Analisis Makanan
  const handleAnalyzeFood = async (e) => {
    e.preventDefault();
    setIsFoodLoading(true);
    setFoodResult(null);
    try {
      const response = await api.post('/ai/analyze-food', { food_name: foodInput });
      setFoodResult(response.data);
    } catch (err) {
      alert('Gagal menganalisis makanan. Pastikan backend AI berjalan.');
    } finally {
      setIsFoodLoading(false);
    }
  };

  // Handler Rekomendasi Resep
  const handleGenerateRecipe = async (e) => {
    e.preventDefault();
    setIsRecipeLoading(true);
    setRecipeResult(null);
    try {
      const response = await api.post('/ai/generate-recipe', { ingredients: recipeInput });
      setRecipeResult(response.data);
    } catch (err) {
      alert('Gagal membuat resep. Pastikan backend AI berjalan.');
    } finally {
      setIsRecipeLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-bg-gray overflow-hidden font-sans">
      
      {/* SIDEBAR (Versi Sederhana untuk Navigasi) */}
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
            <a href="/nutrisi" className="flex items-center gap-3 px-4 py-3 bg-brand-light text-brand-dark rounded-xl font-medium">
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
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">Nutrisi & AI</h1>
          <div className="w-9 h-9 rounded-full bg-brand-green text-white flex items-center justify-center font-bold">IS</div>
        </header>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* FITUR 1: ANALISIS MAKANAN */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Apple size={24} /></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Analisis Makanan</h2>
                <p className="text-sm text-gray-500">Hitung kalori & makro otomatis dengan AI</p>
              </div>
            </div>
            
            <form onSubmit={handleAnalyzeFood} className="mb-6">
              <input 
                type="text" 
                required
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
                placeholder="Cth: Sepiring nasi goreng ayam & telur mata sapi" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green outline-none mb-3"
              />
              <button disabled={isFoodLoading} className="w-full py-3 bg-brand-dark hover:bg-[#0a2e1f] text-white rounded-lg font-medium transition-colors disabled:opacity-70">
                {isFoodLoading ? 'Menganalisis...' : 'Analisis Nutrisi'}
              </button>
            </form>

            {foodResult && (
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">Hasil Analisis</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><p className="text-sm text-gray-500">Kalori</p><p className="font-bold text-lg text-orange-500">{foodResult.kalori} kcal</p></div>
                  <div><p className="text-sm text-gray-500">Protein</p><p className="font-bold text-lg">{foodResult.protein}g</p></div>
                  <div><p className="text-sm text-gray-500">Karbohidrat</p><p className="font-bold text-lg">{foodResult.karbohidrat}g</p></div>
                  <div><p className="text-sm text-gray-500">Lemak</p><p className="font-bold text-lg">{foodResult.lemak}g</p></div>
                  <div><p className="text-sm text-gray-500">Serat</p><p className="font-bold text-lg">{foodResult.serat}g</p></div>
                </div>
                <div className="bg-brand-light p-3 rounded-lg text-sm text-brand-dark">
                  <strong>💡 Rekomendasi Menu Berikutnya:</strong> {foodResult.rekomendasi_menu_berikutnya}
                </div>
              </div>
            )}
          </div>

          {/* FITUR 2: REKOMENDASI RESEP */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-50 text-brand-green rounded-xl"><ChefHat size={24} /></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Koki AI</h2>
                <p className="text-sm text-gray-500">Buat resep sehat dari bahan yang ada</p>
              </div>
            </div>

            <form onSubmit={handleGenerateRecipe} className="mb-6">
              <textarea 
                required
                value={recipeInput}
                onChange={(e) => setRecipeInput(e.target.value)}
                placeholder="Cth: Dada ayam, bayam, bawang putih, tomat" 
                rows="3"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green outline-none mb-3 resize-none"
              ></textarea>
              <button disabled={isRecipeLoading} className="w-full py-3 bg-brand-green hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70">
                {isRecipeLoading ? 'Meracik Resep...' : 'Buat Resep Otomatis'}
              </button>
            </form>

            {recipeResult && (
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 max-h-96 overflow-y-auto">
                <h3 className="font-bold text-gray-900 text-xl mb-2">{recipeResult.nama_hidangan}</h3>
                <p className="text-sm text-orange-500 font-bold mb-4">Estimasi: {recipeResult.estimasi_kalori} kcal</p>
                
                <h4 className="font-bold text-sm text-gray-700 mb-2">Bahan Tambahan:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 mb-4 space-y-1">
                  {recipeResult.bahan_tambahan?.map((bahan, i) => <li key={i}>{bahan}</li>)}
                </ul>

                <h4 className="font-bold text-sm text-gray-700 mb-2">Cara Memasak:</h4>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                  {recipeResult.langkah_memasak?.map((langkah, i) => <li key={i}>{langkah}</li>)}
                </ol>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}