"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/theme-context";
import type { Client } from "@/lib/types";
import { 
  PlusCircle, Building2, ArrowRight, LogOut,
  Cpu, Sparkles, Activity, Settings, X, Terminal, Moon, Sun, ArrowLeft,
  TrendingUp, Target, Layers
} from "lucide-react";


const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
} as const;

export default function DashboardPage() {
  const { 
    themeMode, setThemeMode, 
    primaryColor, setPrimaryColor, 
    agencyName, setAgencyName, 
    agency, loadingSettings, refreshSettings 
  } = useTheme();
  
  // ADIEU LE ANY
  const [clients, setClients] = useState<Client[]>([]);
  const [globalMetrics, setGlobalMetrics] = useState({ spend: 0, conversions: 0, cpa: 0 });
  const [loadingClients, setLoadingClients] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchClients() {
      setLoadingClients(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      if (agency) {
        const { data: clientsData } = await supabase
          .from("agency_clients")
          .select("*")
          .eq("agency_id", agency.id)
          .order("created_at", { ascending: false });

        if (clientsData && clientsData.length > 0) {
          setClients(clientsData as Client[]);
          
          const clientIds = clientsData.map(c => c.id);
          const { data: perfData } = await supabase
            .from("client_performances")
            .select("spend, conversions")
            .in("client_id", clientIds);

          if (perfData) {
            const totalSpend = perfData.reduce((sum, row) => sum + (Number(row.spend) || 0), 0);
            const totalConv = perfData.reduce((sum, row) => sum + (Number(row.conversions) || 0), 0);
            const avgCpa = totalConv > 0 ? (totalSpend / totalConv) : 0;

            setGlobalMetrics({
              spend: totalSpend,
              conversions: totalConv,
              cpa: avgCpa
            });
          }
        } else {
          setClients([]);
          setGlobalMetrics({ spend: 0, conversions: 0, cpa: 0 });
        }
      } else {
        setClients([]);
      }
      setLoadingClients(false);
    }
    if (!loadingSettings) {
      fetchClients();
    }
  }, [agency, loadingSettings, router]);

  const handleCreateAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSettingsLoading(false);
        return;
      }

      const { data, error } = await supabase.from("agencies").insert([{ 
        name: agencyName, 
        primary_color: primaryColor, 
        owner_id: user.id, 
        theme_mode: "light" 
      }]).select().single();
      
      if (error) {
        alert("Erreur Base de données Supabase : " + error.message);
        setSettingsLoading(false);
        return;
      }
      
      if (data) {
        await refreshSettings();
        window.location.reload();
      }
    } catch (err: any) {
      alert("Erreur système critique : " + err.message);
    }
    setSettingsLoading(false);
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agency) return;
    setSettingsLoading(true);
    
    const { error } = await supabase
      .from("agencies")
      .update({ name: agencyName, primary_color: primaryColor, theme_mode: themeMode })
      .eq("id", agency.id);
      
    if (!error) {
      localStorage.setItem("metricflow-theme", themeMode);
      await refreshSettings();
      setIsSettingsOpen(false);
    }
    setSettingsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "sb-metricflow-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("metricflow-theme");
    window.location.href = "/login"; 
  };

  if (loadingSettings || (agency && loadingClients)) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center italic font-black text-slate-400 animate-pulse">
      INITIALISATION DU COCKPIT...
    </div>
  );

  if (!agency) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans antialiased relative overflow-hidden flex flex-col justify-center items-center px-6">
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
        </div>
        
        <div className="absolute top-8 left-8 z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white font-black transition-colors uppercase text-xs tracking-widest">
            <ArrowLeft size={14} /> Accueil
          </Link>
        </div>

        <div className="absolute top-8 right-8 z-10">
          <button onClick={handleLogout} className="inline-flex items-center gap-2 text-red-400 hover:text-red-500 font-black transition-colors uppercase text-xs tracking-widest cursor-pointer">
            <LogOut size={14} /> Déconnexion
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-slate-900/40 border border-white/5 p-12 rounded-[3rem] shadow-2xl max-w-md w-full backdrop-blur-xl relative z-10 text-center space-y-8"
        >
          <div className="space-y-3">
            <div className="bg-blue-500/10 text-blue-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
              <Building2 size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">MetricFlow Core</h1>
            <p className="text-slate-400 text-xs font-medium">
              Configurez l'infrastructure initiale de votre agence.
            </p>
          </div>
          
          <form onSubmit={handleCreateAgency} className="space-y-6 text-left">
            <input 
              type="text" 
              placeholder="Nom de l'agence" 
              value={agencyName} 
              onChange={e => setAgencyName(e.target.value)} 
              className="w-full p-5 bg-slate-950 border border-white/10 rounded-2xl font-bold text-white outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-800" 
              required 
            />
            <button 
              type="submit" 
              disabled={settingsLoading} 
              className="w-full bg-white text-slate-950 p-5 rounded-2xl font-black uppercase tracking-widest text-xs disabled:opacity-50 hover:bg-slate-200 transition-all active:scale-95"
            >
              {settingsLoading ? "Déploiement en cours..." : "Déployer l'infrastructure"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const isDark = themeMode === "dark";
  const bgMain = isDark ? "bg-slate-950" : "bg-[#F1F5F9]";
  const bgCard = isDark ? "bg-slate-900/50" : "bg-white";
  const textColor = isDark ? "text-white" : "text-slate-900";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const borderColor = isDark ? "border-slate-800" : "border-slate-100";

  return (
    <div className={`min-h-screen ${bgMain} font-sans antialiased ${textColor} transition-colors duration-500`}>
      
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4">
        <div className={`${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-white/40'} backdrop-blur-xl p-4 pl-6 pr-4 rounded-3xl border shadow-sm flex justify-between items-center max-w-[1600px] mx-auto`}>
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: primaryColor }} />
            <span className={`font-black tracking-tighter uppercase text-lg ${textColor}`}>{agencyName}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSettingsOpen(true)} className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'} px-4 py-3 rounded-xl transition-all`}>
              <Settings size={16} /> Config
            </button>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 p-3"><LogOut size={20}/></button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={() => setIsSettingsOpen(false)} className="fixed inset-0 bg-black z-50 backdrop-blur-md" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className={`fixed top-0 right-0 bottom-0 w-full max-w-md ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} z-50 shadow-2xl p-10 border-l flex flex-col`}>
              <div className="flex justify-between items-center mb-10">
                <h2 className={`text-2xl font-black uppercase tracking-tighter ${textColor}`}>Configuration Agence</h2>
                <button onClick={() => setIsSettingsOpen(false)} className={textMuted}><X/></button>
              </div>

              <form onSubmit={handleUpdateSettings} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Interface visuelle</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setThemeMode("light")} className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${themeMode === 'light' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}>
                      <Sun size={18}/> Studio
                    </button>
                    <button type="button" onClick={() => setThemeMode("dark")} className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${themeMode === 'dark' ? 'border-blue-500 bg-slate-800 text-white' : 'border-slate-100 text-slate-400'}`}>
                      <Moon size={18}/> Midnight
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Nom de l'entité</label>
                  <input type="text" value={agencyName} onChange={e => setAgencyName(e.target.value)} className={`w-full p-5 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'} border-2 rounded-2xl font-bold ${textColor}`} />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Couleur de marque</label>
                    <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-full h-16 rounded-2xl cursor-pointer" />
                </div>

                <button type="submit" disabled={settingsLoading} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-blue-700 transition-all">
                  {settingsLoading ? "Mise à jour..." : "Appliquer les changements"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1600px] mx-auto space-y-12">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-950'} rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-2xl`}>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
              <div>
                <span className="inline-block py-2 px-5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-8 backdrop-blur-md">
                  White Label : {agencyName}
                </span>
                <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-none mb-4">
                  Cockpit <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Directionnel.</span>
                </h1>
              </div>
              <Link href="/add-client" className="bg-white text-slate-950 px-12 py-6 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.15)] uppercase tracking-widest text-sm">
                <PlusCircle size={22}/> Nouveau Client
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className={`p-8 rounded-[3rem] ${bgCard} border ${borderColor} shadow-sm flex items-center justify-between`}>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${textMuted}`}>Dossiers Actifs</p>
                <h3 className={`text-4xl font-black tracking-tighter ${textColor}`}>{clients.length}</h3>
              </div>
              <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${isDark ? 'bg-indigo-900/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                <Building2 size={24} />
              </div>
            </div>

            <div className={`p-8 rounded-[3rem] ${bgCard} border ${borderColor} shadow-sm flex items-center justify-between`}>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${textMuted}`}>Budget Total Géré</p>
                <h3 className={`text-4xl font-black tracking-tighter ${textColor}`}>{globalMetrics.spend.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</h3>
              </div>
              <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${isDark ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <TrendingUp size={24} />
              </div>
            </div>
            
            <div className={`p-8 rounded-[3rem] ${bgCard} border ${borderColor} shadow-sm flex items-center justify-between`}>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${textMuted}`}>Volume Conversions</p>
                <h3 className={`text-4xl font-black tracking-tighter ${textColor}`}>{globalMetrics.conversions.toLocaleString('fr-FR')}</h3>
              </div>
              <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${isDark ? 'bg-emerald-900/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                <Layers size={24} />
              </div>
            </div>

            <div className={`p-8 rounded-[3rem] ${bgCard} border ${borderColor} shadow-sm flex items-center justify-between`}>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${textMuted}`}>CPA Moyen Global</p>
                <h3 className={`text-4xl font-black tracking-tighter ${textColor}`}>{globalMetrics.cpa.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</h3>
              </div>
              <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${isDark ? 'bg-purple-900/20 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                <Target size={24} />
              </div>
            </div>
            
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-800 text-blue-400' : 'bg-white text-blue-600'} shadow-sm`}><Activity size={24}/></div>
                <h2 className={`text-3xl font-black tracking-tighter ${textColor}`}>Portefeuille Actif</h2>
              </div>

              <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clients.map((client) => (
                  <motion.div key={client.id} variants={itemVariants} whileHover={{ y: -8 }}>
                    <Link href={`/client/${client.id}`} className={`block p-10 rounded-[3rem] ${bgCard} border ${borderColor} shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group`}>
                      <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: primaryColor }} />
                      <div className="flex justify-between items-start mb-12">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`}>
                          {client.name?.substring(0, 2).toUpperCase() || "CL"}
                        </div>
                        <ArrowRight className={`${textMuted} group-hover:text-blue-500 group-hover:translate-x-2 transition-all`} />
                      </div>
                      <h3 className={`text-3xl font-black tracking-tighter mb-4 ${textColor}`}>{client.name}</h3>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="space-y-10">
                <div className="flex items-center gap-4">
                    <Terminal size={24} className="text-blue-500"/>
                    <h2 className={`text-2xl font-black tracking-tighter ${textColor}`}>System Status</h2>
                </div>
                <div className={`p-8 rounded-[3rem] ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border shadow-xl`}>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Infrastructure Online</span>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}