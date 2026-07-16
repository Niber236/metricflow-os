"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useTheme } from "@/app/theme-context";
import { 
  ArrowLeft, Sparkles, Download, BarChart3, Calendar, 
  Copy, Check, Target, AlertTriangle, Save, Link2, Trash2, Edit2, X, ShieldCheck
} from "lucide-react";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import type { Client, Agency, ClientPerformance } from "@/lib/types";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { motion } from "framer-motion";

export default function ClientPage({ params }: { params: React.Usable<{ id: string }> }) {
  const { id } = React.use(params);
  const { themeMode, primaryColor, agencyName } = useTheme();

  const [client, setClient] = useState<Client | null>(null);
  const [performances, setPerformances] = useState<ClientPerformance[]>([]);
  const [unauthorized, setUnauthorized] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  const [month, setMonth] = useState("2026-05");
  const [platform, setPlatform] = useState("");
  const [spend, setSpend] = useState("");
  const [clicks, setClicks] = useState("");
  const [conversions, setConversions] = useState("");

  const [targetCpa, setTargetCpa] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [report, setReport] = useState("");
  const [reportError, setReportError] = useState<string | null>(null); 
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function verifyAndFetch() {
      if (!id) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setUnauthorized(true); setPageLoading(false); return; }

      const { data: agencyData } = await supabase.from("agencies").select("id").eq("owner_id", user.id).single();
      if (!agencyData) { setUnauthorized(true); setPageLoading(false); return; }

      const { data: clientData, error: clientError } = await supabase
        .from("agency_clients").select("*").eq("id", id).eq("agency_id", agencyData.id).single();
      
      if (clientError || !clientData) { setUnauthorized(true); setPageLoading(false); return; }

      setClient(clientData);
      setNewName(clientData.name);
      
      if (clientData.platform && clientData.platform.length > 0) {
        setPlatform(clientData.platform[0]);
      } else {
        setPlatform("Meta Ads");
      }

      if (clientData.target_cpa) setTargetCpa(clientData.target_cpa.toString());

      const { data: perfData } = await supabase.from("client_performances").select("*").eq("client_id", id).order("month", { ascending: false });
      if (perfData) setPerformances(perfData);
      setPageLoading(false);
    }
    verifyAndFetch();
  }, [id]);

  const handleConnectMeta = () => {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/meta/callback`);
    const scope = encodeURIComponent("ads_management,ads_read,business_management");
    window.location.href = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&state=${id}`;
  };

  const handleUpdateAdAccount = async (adAccountId: string) => {
    if (!client) return;
    setClient({ ...client, meta_ad_account_id: adAccountId });
    await supabase.from("agency_clients").update({ meta_ad_account_id: adAccountId }).eq("id", id);
  };

  const handleSyncMeta = async () => {
    if (!client?.meta_ad_account_id) {
      alert("Veuillez renseigner l'ID du compte publicitaire (ex: act_123456789).");
      return;
    }
    setIsSyncing(true);
    try {
      const [year, m] = month.split("-");
      const startDate = `${year}-${m}-01`;
      const endDate = new Date(Number(year), Number(m), 0).toISOString().split('T')[0];

      const url = `https://graph.facebook.com/v19.0/${client.meta_ad_account_id}/insights?time_range={'since':'${startDate}','until':'${endDate}'}&fields=spend,actions&access_token=${client.meta_access_token}`;
      
      const res = await fetch(url);
      const metaData = await res.json();

      if (metaData.error) throw new Error(metaData.error.message);

      let fetchedSpend = 0;
      let fetchedConversions = 0;

      if (metaData.data && metaData.data.length > 0) {
        fetchedSpend = Number(metaData.data[0].spend || 0);
        const actions = metaData.data[0].actions || [];
        const conv = actions.find((a: any) => a.action_type === 'purchase' || a.action_type === 'lead' || a.action_type === 'offsite_conversion.fb_pixel_purchase');
        if (conv) fetchedConversions = Number(conv.value);
      }

      const newPerfRow = {
        client_id: id,
        month,
        platform: "Meta Ads",
        spend: fetchedSpend,
        clicks: 0,
        conversions: fetchedConversions
      };

      await supabase.from("client_performances").delete().eq("client_id", id).eq("month", month).eq("platform", "Meta Ads");
      const { data: insertData, error: insertError } = await supabase.from("client_performances").insert([newPerfRow]).select().single();

      if (insertError) throw insertError;

      if (insertData) {
        setPerformances((prev) => {
          const filtered = prev.filter(p => !(p.month === month && p.platform === "Meta Ads"));
          return [insertData as ClientPerformance, ...filtered].sort((a, b) => b.month.localeCompare(a.month));
        });
        alert(`Synchronisation réussie ! ${fetchedSpend}€ aspirés depuis Meta.`);
      }
    } catch (err: any) {
      alert("Erreur Sync Meta : " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleInjectData = async (e: React.FormEvent) => {
    e.preventDefault();
    const platformToInject = platform || client?.platform?.[0] || "Meta Ads";

    const newPerfRow = {
      client_id: id,
      month,
      platform: platformToInject,
      spend: Number(spend),
      clicks: Number(clicks),
      conversions: Number(conversions)
    };

    const { data, error } = await supabase.from("client_performances").insert([newPerfRow]).select().single();

    if (error) { alert("Erreur Supabase : " + error.message); return; }

    if (data) {
      setPerformances((prev) => [data as ClientPerformance, ...prev].sort((a, b) => b.month.localeCompare(a.month)));
      setSpend(""); setClicks(""); setConversions("");
    }
  };

  const handleDeleteMonth = async (monthToDelete: string) => {
    if (!confirm(`Es-tu sûr de vouloir purger définitivement les données de ${monthToDelete} ?`)) return;
    const { error } = await supabase.from("client_performances").delete().eq("client_id", id).eq("month", monthToDelete);
    if (error) { alert("Erreur : " + error.message); } 
    else { setPerformances(prev => prev.filter(p => p.month !== monthToDelete)); }
  };

  const handleUpdateClientName = async () => {
    if (!newName.trim()) return;
    const { error } = await supabase.from("agency_clients").update({ name: newName }).eq("id", id);
    if (error) { alert("Erreur : " + error.message); } 
    else { setClient({ ...client!, name: newName }); setIsEditingName(false); }
  };

  const handleDeleteClient = async () => {
    if (!confirm(`⚠️ DANGER : Suppression définitive. Confirmer ?`)) return;
    const { error } = await supabase.from("agency_clients").delete().eq("id", id);
    if (error) { alert("Erreur : " + error.message); } 
    else { window.location.href = "/dashboard"; }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true); setReportError(null); setReport("");
    try {
      const res = await fetch("/api/report", { 
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName: client?.name, stats: performances }) 
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "IA indisponible."); }
      const d = await res.json(); setReport(d.report);
    } catch (err: any) { setReportError(err.message); } 
    finally { setIsGenerating(false); }
  };

  const downloadPDF = async () => {
    const reportElement = document.getElementById('report-container');
    if (!reportElement) {
      alert("Aucun rapport à exporter.");
      return;
    }
    
    setIsDownloading(true);
    try {
      const isDark = themeMode === "dark";
      const dataUrl = await htmlToImage.toPng(reportElement, { quality: 0.95, backgroundColor: isDark ? '#0f172a' : '#ffffff' });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (reportElement.offsetHeight * pdfWidth) / reportElement.offsetWidth;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Audit_MetricFlow_${client?.name || 'Client'}.pdf`);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      alert("Échec de la création du PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (pageLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center italic font-black text-slate-500 animate-pulse text-xs">Vérification...</div>;
  if (unauthorized || !client) return <div className="min-h-screen bg-slate-950 flex justify-center p-6"><AlertTriangle size={32} className="text-red-500"/></div>;

  const isDark = themeMode === "dark";
  const bgMain = isDark ? "bg-slate-950" : "bg-[#F8FAFC]";
  const bgCard = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100";
  const textColor = isDark ? "text-white" : "text-slate-900";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";

  const groupedPerformances = Object.values(
    performances.reduce((acc, perf) => {
      if (!acc[perf.month]) acc[perf.month] = { month: perf.month, totalSpend: 0, totalConversions: 0, platformsUsed: [] };
      acc[perf.month].totalSpend += perf.spend;
      acc[perf.month].totalConversions += perf.conversions;
      if (!acc[perf.month].platformsUsed.includes(perf.platform)) acc[perf.month].platformsUsed.push(perf.platform);
      return acc;
    }, {} as Record<string, any>)
  ).sort((a: any, b: any) => b.month.localeCompare(a.month));

  const chartData = [...groupedPerformances].reverse().map((p: any) => ({
    month: p.month, Budget: p.totalSpend, CPA: p.totalConversions > 0 ? Number((p.totalSpend / p.totalConversions).toFixed(2)) : 0
  }));

  return (
    <div className={`min-h-screen ${bgMain} ${textColor} p-8 font-sans antialiased transition-colors duration-500`}>
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-500 mb-10 font-black transition-colors uppercase text-xs tracking-widest"><ArrowLeft size={16} /> Retour Cockpit</Link>

        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-[10px] font-black tracking-widest text-blue-500 uppercase bg-blue-500/10 px-3 py-1 rounded-full">Dossier : {client.name}</span>
            {isEditingName ? (
                <div className="flex items-center gap-3 mt-4">
                    <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className={`p-3 rounded-xl border-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'} font-black text-4xl outline-none`} autoFocus />
                    <button onClick={handleUpdateClientName} className="bg-emerald-500 text-white p-4 rounded-xl"><Check size={24}/></button>
                    <button onClick={() => setIsEditingName(false)} className="bg-slate-500 text-white p-4 rounded-xl"><X size={24}/></button>
                </div>
            ) : (
                <div className="flex items-center gap-4 mt-4 group">
                    <h1 className={`text-6xl font-black tracking-tighter ${textColor}`}>{client.name}</h1>
                    <button onClick={() => setIsEditingName(true)} className={`opacity-0 group-hover:opacity-100 ${textMuted} transition-all`}><Edit2 size={28}/></button>
                </div>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleDeleteClient} className="bg-red-500/10 text-red-500 px-6 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16}/> Supprimer</button>
            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/portal/${id}`); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className={`${bgCard} border px-6 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:border-blue-500 transition-colors`}>{copied ? <Check size={16} className="text-emerald-500"/> : <Copy size={16}/>} Lien Public</button>
            <button onClick={handleGenerateReport} disabled={isGenerating} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"><Sparkles size={16} className={isGenerating ? "animate-spin" : ""}/> {isGenerating ? "Analyse..." : "Générer Rapport IA"}</button>
            
            {/* BOUTON PDF */}
            {report && (
              <button onClick={downloadPDF} disabled={isDownloading} className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-slate-700 transition-colors disabled:opacity-50">
                <Download size={16} className={isDownloading ? "animate-bounce" : ""} /> {isDownloading ? "Création..." : "Télécharger PDF"}
              </button>
            )}
          </div>
        </header>

        <div className={`p-6 rounded-[2rem] ${bgCard} border mb-8 flex flex-col md:flex-row justify-between items-center gap-4`}>
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <div>
              <p className="font-black text-sm uppercase tracking-tight">Flux d'intégration Meta Ads</p>
              <p className="text-xs text-slate-400 mt-0.5">{client.meta_access_token ? "✓ Connexion API établie." : "Aucun token détecté pour ce dossier."}</p>
            </div>
          </div>
          {client.meta_access_token ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" placeholder="ID du compte (ex: act_12345)" value={client.meta_ad_account_id || ""} onChange={(e) => handleUpdateAdAccount(e.target.value)} className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'} text-xs font-bold outline-none focus:border-blue-500`}/>
              <button onClick={handleSyncMeta} disabled={isSyncing} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 cursor-pointer">
                <Sparkles size={14} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? "Aspiration..." : "Auto-Sync Meta"}
              </button>
            </div>
          ) : (
            <button onClick={handleConnectMeta} className="bg-[#1877F2] text-white px-6 py-3 rounded-xl font-black text-xs uppercase flex items-center gap-2"><Link2 size={14} /> Lier Compte</button>
          )}
        </div>

        {reportError && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-start gap-3 text-red-400 text-sm font-semibold">
            <AlertTriangle className="shrink-0 text-red-500" size={20} />
            <div><p className="font-black uppercase tracking-wider text-xs text-red-500 mb-1">Échec de l'Analyse</p>{reportError}</div>
          </div>
        )}

        {report && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-12">
            
            {/* CONTENEUR DU RAPPORT (Format A4 Corporate) */}
            <div id="report-container" className={`p-12 md:p-16 shadow-2xl border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}>
              
              {/* EN-TÊTE CORPORATE STRICT (Comme sur ton modèle) */}
              <div className="mb-12 border-b-2 border-slate-200/50 pb-8">
                <h1 className="text-5xl font-black tracking-tighter uppercase mb-6" style={{ color: primaryColor }}>
                  {agencyName}
                </h1>
                <div className="text-sm font-black uppercase tracking-widest text-slate-500 space-y-2">
                  <p>DOSSIER CLIENT : {client.name}</p>
                  <p>ÉMIS LE : {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {/* CORPS DE L'AUDIT IA */}
              <div className="whitespace-pre-wrap leading-relaxed text-sm font-medium text-justify">
                {report}
              </div>
              
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 min-w-0 space-y-8">
            <div className={`p-8 rounded-[3rem] ${bgCard} border shadow-sm`}>
                <h2 className="text-xl font-black mb-8 flex items-center gap-2 uppercase tracking-tighter"><BarChart3 size={20} className="text-blue-500"/> Performance Mensuelle</h2>
                <div className="h-[300px] w-full">
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                              <defs><linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/><stop offset="95%" stopColor={primaryColor} stopOpacity={0}/></linearGradient></defs>
                              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#f1f5f9"} vertical={false}/>
                              <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                              <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#fff', borderRadius: '16px', border: 'none' }} />
                              <Area type="monotone" dataKey="Budget" stroke={primaryColor} strokeWidth={4} fill="url(#colorP)" />
                              {Number(targetCpa) > 0 && <ReferenceLine y={Number(targetCpa)} stroke="#ef4444" strokeDasharray="3 3" />}
                          </AreaChart>
                      </ResponsiveContainer>
                    ) : <div className="w-full h-full bg-slate-500/10 animate-pulse rounded-2xl" />}
                </div>
            </div>

            <div className="space-y-4">
                {groupedPerformances.map((perf: any) => {
                    const actualCpa = perf.totalConversions > 0 ? (perf.totalSpend / perf.totalConversions) : 0;
                    return (
                        <div key={perf.month} className={`p-6 rounded-[2rem] border flex justify-between items-center ${bgCard}`}>
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500"><Calendar size={24}/></div>
                                <div>
                                    <h3 className="font-black text-xl">{perf.month}</h3>
                                    <div className="flex gap-1 mt-1">{perf.platformsUsed.map((p:any)=><span key={p} className="text-[8px] font-black uppercase bg-slate-500/10 px-2 py-0.5 rounded text-slate-400">{p}</span>)}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right"><p className="text-[10px] font-black text-slate-500 uppercase">Spend</p><p className="text-2xl font-black">{perf.totalSpend} €</p></div>
                                <div className="text-right"><p className="text-[10px] font-black uppercase text-slate-500">CPA</p><p className="text-2xl font-black text-blue-500">{actualCpa.toFixed(2)} €</p></div>
                                <button onClick={() => handleDeleteMonth(perf.month)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors cursor-pointer"><Trash2 size={20} /></button>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>

          <div className="space-y-6">
            <div className={`p-8 rounded-[3rem] ${bgCard} border shadow-xl`}>
                <h3 className="font-black uppercase text-xs tracking-widest mb-6 text-blue-500">Injection Manuelle</h3>
                <form onSubmit={handleInjectData} className="space-y-4">
                    <input type="month" value={month} onChange={e=>setMonth(e.target.value)} className={`w-full p-4 rounded-xl ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'} border-2 font-bold text-sm outline-none`} required/>
                    <select value={platform} onChange={e=>setPlatform(e.target.value)} className={`w-full p-4 rounded-xl ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'} border-2 font-bold text-sm outline-none`} required>
                        {client.platform?.map((p:string)=><option key={p} value={p}>{p}</option>)}
                    </select>
                    <input type="number" step="0.01" placeholder="Budget (€)" value={spend} onChange={e=>setSpend(e.target.value)} className={`w-full p-4 rounded-xl border-2 font-bold text-sm outline-none`} required/>
                    <div className="grid grid-cols-2 gap-3">
                        <input type="number" placeholder="Clics" value={clicks} onChange={e=>setClicks(e.target.value)} className={`w-full p-4 rounded-xl border-2 font-bold text-sm outline-none`} required/>
                        <input type="number" placeholder="Conv." value={conversions} onChange={e=>setConversions(e.target.value)} className={`w-full p-4 rounded-xl border-2 font-bold text-sm outline-none`} required/>
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all cursor-pointer">Synchroniser</button>
                </form>
            </div>
            
            <div className={`p-8 rounded-[3rem] ${isDark ? 'bg-red-900/10 border-red-900/20' : 'bg-red-50 border-red-100'} border`}>
                <h3 className="font-black uppercase text-[10px] tracking-widest mb-4 text-red-500 flex items-center gap-2"><Target size={14}/> Seuil de rentabilité</h3>
                <div className="flex gap-2">
                    <input type="number" value={targetCpa} onChange={e=>setTargetCpa(e.target.value)} className={`w-full p-3 rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'} border font-black text-sm text-center outline-none`} />
                    <button onClick={async ()=>{await supabase.from("agency_clients").update({target_cpa: Number(targetCpa)}).eq("id", id); alert("CPA sauvé");}} className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 cursor-pointer"><Save size={18}/></button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}