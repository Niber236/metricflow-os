"use client";

import React, { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { BarChart3, Calendar, TrendingUp, Layers, Cpu, ShieldCheck, Target } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { Client, Agency, ClientPerformance } from "@/lib/types";

export default function ClientPortalPage({ params }: { params: React.Usable<{ id: string }> }) {
  const { id } = use(params);
  
  // Utilisation de nos nouveaux Types Stricts au lieu de "any"
  const [client, setClient] = useState<Client | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [performances, setPerformances] = useState<ClientPerformance[]>([]);
  
  // Métriques globales du client
  const [metrics, setMetrics] = useState({ spend: 0, conversions: 0, cpa: 0 });
  
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function fetchPortalData() {
      const { data: clientData } = await supabase.from("agency_clients").select("*").eq("id", id).single();
      if (!clientData) { setLoading(false); return; }
      setClient(clientData);
      
      const { data: agencyData } = await supabase.from("agencies").select("*").eq("id", clientData.agency_id).single();
      if (agencyData) setAgency(agencyData);

      const { data: perfData } = await supabase.from("client_performances").select("*").eq("client_id", id).order("month", { ascending: false });
      
      if (perfData) {
        setPerformances(perfData);
        
        // Calcul des totaux pour le client
        const totalSpend = perfData.reduce((sum, row) => sum + (Number(row.spend) || 0), 0);
        const totalConv = perfData.reduce((sum, row) => sum + (Number(row.conversions) || 0), 0);
        const avgCpa = totalConv > 0 ? (totalSpend / totalConv) : 0;
        
        setMetrics({ spend: totalSpend, conversions: totalConv, cpa: avgCpa });
      }
      setLoading(false);
    }
    fetchPortalData();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center font-black text-white italic animate-pulse tracking-widest">AUTHENTICATION...</div>;
  if (!client || !agency) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-black uppercase">Lien Invalide ou Accès Restreint</div>;

  const isDark = agency.theme_mode === "dark";
  const bgMain = isDark ? "bg-slate-950" : "bg-[#F1F5F9]";
  const bgCard = isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100";
  const textColor = isDark ? "text-white" : "text-slate-900";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const borderColor = isDark ? "border-slate-800" : "border-slate-100";

  // Aggrégation pour le graphique
  const groupedPerformances = Object.values(
    performances.reduce((acc, perf) => {
      if (!acc[perf.month]) {
        acc[perf.month] = { month: perf.month, totalSpend: 0, platformsUsed: [] };
      }
      acc[perf.month].totalSpend += perf.spend;
      if (!acc[perf.month].platformsUsed.includes(perf.platform)) {
        acc[perf.month].platformsUsed.push(perf.platform);
      }
      return acc;
    }, {} as Record<string, { month: string, totalSpend: number, platformsUsed: string[] }>)
  ).sort((a, b) => b.month.localeCompare(a.month));

  const chartData = [...groupedPerformances].map((p) => ({
    month: p.month,
    Budget: p.totalSpend
  }));

  return (
    <div className={`min-h-screen ${bgMain} ${textColor} p-6 md:p-12 font-sans antialiased transition-colors duration-700`}>
      <div className="max-w-[1400px] mx-auto space-y-10">
        
        <header className={`p-8 rounded-[3rem] ${bgCard} border ${borderColor} backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl`}>
            <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center font-black text-3xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}>
                    {client.name?.substring(0,2).toUpperCase() || "CL"}
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={14} className="text-emerald-500"/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Verified Audit by {agency.name}</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter">{client.name}</h1>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="text-center px-8">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Status</p>
                    <p className="font-black text-emerald-500 flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"/> Live Performance</p>
                </div>
            </div>
        </header>

        {/* NOUVEAU BLOC : MÉTRIQUES GLOBALES DU CLIENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-8 rounded-[3rem] ${bgCard} border ${borderColor} shadow-sm flex items-center justify-between`}>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${textMuted}`}>Budget Total Investi</p>
              <h3 className={`text-4xl font-black tracking-tighter ${textColor}`}>{metrics.spend.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</h3>
            </div>
            <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${isDark ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <TrendingUp size={24} />
            </div>
          </div>
          
          <div className={`p-8 rounded-[3rem] ${bgCard} border ${borderColor} shadow-sm flex items-center justify-between`}>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${textMuted}`}>Conversions Générées</p>
              <h3 className={`text-4xl font-black tracking-tighter ${textColor}`}>{metrics.conversions.toLocaleString('fr-FR')}</h3>
            </div>
            <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${isDark ? 'bg-emerald-900/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <Layers size={24} />
            </div>
          </div>

          <div className={`p-8 rounded-[3rem] ${bgCard} border ${borderColor} shadow-sm flex items-center justify-between`}>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${textMuted}`}>CPA Moyen</p>
              <h3 className={`text-4xl font-black tracking-tighter ${textColor}`}>{metrics.cpa.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</h3>
            </div>
            <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${isDark ? 'bg-purple-900/20 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
              <Target size={24} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className={`lg:col-span-2 min-w-0 p-10 rounded-[4rem] ${bgCard} border ${borderColor} shadow-inner`}>
                <h2 className="text-2xl font-black mb-10 flex items-center gap-3 uppercase tracking-tighter">
                    <TrendingUp size={24} className="text-blue-500"/> Analytics Pipeline
                </h2>
                <div className="h-[400px]">
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                              <defs>
                                  <linearGradient id="colorS" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={agency.primary_color} stopOpacity={0.4}/>
                                      <stop offset="95%" stopColor={agency.primary_color} stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} vertical={false}/>
                              <XAxis dataKey="month" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false}/>
                              <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false}/>
                              <Tooltip contentStyle={{backgroundColor: isDark ? '#0f172a' : '#fff', border: 'none', borderRadius: '20px', color: isDark ? '#fff' : '#000'}}/>
                              <Area type="monotone" dataKey="Budget" stroke={agency.primary_color} strokeWidth={5} fill="url(#colorS)" />
                          </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="w-full h-full bg-slate-500/10 animate-pulse rounded-3xl" />
                    )}
                </div>
            </div>

            <div className="space-y-8">
                <div className={`p-10 rounded-[3rem] ${isDark ? 'bg-blue-600' : 'bg-slate-900'} text-white shadow-2xl`}>
                    <Cpu size={32} className="mb-6 opacity-50"/>
                    <h3 className="text-3xl font-black tracking-tight mb-2">Data Engine</h3>
                    <p className="text-sm opacity-70 leading-relaxed">Les flux publicitaires sont synchronisés en continu pour assurer une transparence totale sur vos investissements.</p>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Historique des Investissements</h4>
                    {/* On affiche les perfs par ordre chronologique décroissant */}
                    {groupedPerformances.reverse().slice(0,4).map((p) => (
                        <div key={p.month} className={`p-6 rounded-[2rem] ${bgCard} border ${borderColor} flex justify-between items-center`}>
                            <div>
                              <p className="font-black text-lg">{p.month}</p>
                              <div className="flex gap-1 mt-1">
                                {p.platformsUsed.map((plat) => (
                                  <span key={plat} className="text-[7px] font-black bg-slate-500/10 px-1.5 py-0.5 rounded text-slate-400 uppercase">{plat}</span>
                                ))}
                              </div>
                            </div>
                            <p className="font-black text-xl text-blue-500">{p.totalSpend.toFixed(2)} €</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}