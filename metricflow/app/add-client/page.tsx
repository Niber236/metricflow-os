"use client";
// Test auto-pa
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Layers, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme-context";

// On a bien mis Facebook Ads comme tu l'as demandé.
const AVAILABLE_PLATFORMS = ["Facebook Ads", "Instagram Ads", "Google Ads", "TikTok Ads", "LinkedIn Ads"];

export default function AddClientPage() {
  // Branchement au hub global des paramètres
  const { themeMode, primaryColor, agency } = useTheme();
  const router = useRouter();

  const [name, setName] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [targetCpa, setTargetCpa] = useState("");
  const [loading, setLoading] = useState(false);

  const isDark = themeMode === "dark";
  const bgMain = isDark ? "bg-slate-950" : "bg-[#F1F5F9]";
  const bgCard = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100";
  const textColor = isDark ? "text-white" : "text-slate-900";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agency) return;
    if (selectedPlatforms.length === 0) {
        alert("Sélectionne au moins un canal d'acquisition.");
        return;
    }

    setLoading(true);
    const { error } = await supabase.from("agency_clients").insert([{
      agency_id: agency.id,
      name,
      platform: selectedPlatforms,
      target_cpa: targetCpa ? Number(targetCpa) : null
    }]);

    if (error) {
      alert("Erreur lors de la création : " + error.message);
      setLoading(false);
    } else {
      router.push("/dashboard"); // Retourne au cockpit instantanément
    }
  };

  // Sécurité pendant que le Context se charge
  if (!agency) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-500 font-black uppercase tracking-widest animate-pulse text-xs">
      Initialisation du module...
    </div>
  );

  return (
    <div className={`min-h-screen ${bgMain} ${textColor} p-8 font-sans antialiased transition-colors duration-500`}>
      <div className="max-w-3xl mx-auto pt-10">
        
        <Link href="/" className={`inline-flex items-center gap-2 ${textMuted} hover:text-blue-500 mb-10 font-black transition-colors uppercase text-xs tracking-widest`}>
          <ArrowLeft size={16} /> Retour Cockpit
        </Link>

        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className={`p-10 md:p-14 rounded-[3rem] ${bgCard} border shadow-2xl relative overflow-hidden`}
        >
            {/* Ligne de couleur de la marque blanche */}
            <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: primaryColor }} />
            
            <div className="flex items-center gap-5 mb-12">
                <div className={`p-5 rounded-[2rem] ${isDark ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <UserPlus size={36} />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Nouveau Client</h1>
                    <p className={textMuted + " font-medium mt-1 text-sm"}>Connectez un nouveau dossier à l'entité {agency.name}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">
                        Nom de l'entreprise / Client
                    </label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="Ex: Kodex Studio" 
                        className={`w-full p-5 rounded-2xl ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'} border-2 font-bold outline-none focus:border-blue-500 transition-colors`} 
                        required 
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <Layers size={14}/> Canaux d'acquisition
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {AVAILABLE_PLATFORMS.map(p => {
                            const isSelected = selectedPlatforms.includes(p);
                            return (
                                <button 
                                    type="button" 
                                    key={p} 
                                    onClick={() => togglePlatform(p)} 
                                    className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all border-2 ${isSelected ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/20' : isDark ? 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800'}`}
                                >
                                    {p}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">
                        Target CPA Global / Seuil Tolérance (Optionnel)
                    </label>
                    <input 
                        type="number" 
                        step="0.01" 
                        value={targetCpa} 
                        onChange={e => setTargetCpa(e.target.value)} 
                        placeholder="Ex: 15.50" 
                        className={`w-full p-5 rounded-2xl ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'} border-2 font-bold outline-none focus:border-blue-500 transition-colors`} 
                    />
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        <Save size={18} /> {loading ? "Déploiement du dossier..." : "Initialiser le Client"}
                    </button>
                </div>
            </form>
        </motion.div>
      </div>
    </div>
  );
}