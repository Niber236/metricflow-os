"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, ShieldCheck, Sparkles, BarChart3, 
  Cpu, Layers, CheckCircle2, Globe, Infinity, Zap 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-white selection:bg-blue-600 relative overflow-x-hidden">
      
      {/* BACKGROUND GLOWS CONFINÉS */}
<div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
  <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
  <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[130px] translate-y-1/3 -translate-x-1/4" />
</div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-slate-950/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-black tracking-tighter uppercase text-xl">MetricFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login/" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors px-4 py-2">
              Connexion
            </Link>
            <Link href="/login?signup=true" className="bg-white text-slate-950 text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-slate-200 transition-all active:scale-95">
              Déployer Core
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-44 pb-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest"
          >
            L'infrastructure Multi-Tenant des Agences de Performance
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
          >
            Pilotez vos clients. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
              Automatisez l'IA.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Connectez vos flux Meta, Google et TikTok Ads. Générez des audits critiques automatisés par intelligence artificielle et offrez un portail marque blanche premium à vos clients.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link href="/login?signup=true" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] text-sm tracking-widest uppercase active:scale-95">
              Démarrer l'essai gratuit <ArrowRight size={16} />
            </Link>
            <a href="#features" className="w-full sm:w-auto border border-white/10 hover:border-white/20 bg-white/5 px-10 py-5 rounded-2xl font-black text-sm tracking-widest uppercase transition-colors text-center">
              Explorer l'architecture
            </a>
          </motion.div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="features" className="py-24 px-6 border-t border-white/5 bg-slate-900/20 relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black tracking-tight">Une infrastructure taillée pour la croissance</h2>
            <p className="text-slate-400 font-medium max-w-xl mx-auto">Tout ce dont votre agence a besoin pour éliminer les rapports manuels obsolètes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* CARDE 1 */}
            <div className="bg-slate-900/40 border border-white/5 p-10 rounded-[2.5rem] space-y-6 hover:border-blue-500/30 transition-colors group">
              <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl inline-block group-hover:bg-blue-500 group-hover:text-white transition-all">
                <Layers size={24} />
              </div>
              <h3 className="text-2xl font-black tracking-tight">Hub Multi-Tenant</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Chaque utilisateur dispose d'une isolation totale de ses bases de données clients. Aucune fuite possible, sécurité d'infrastructure RLS absolue.
              </p>
            </div>

            {/* CARDE 2 */}
            <div className="bg-slate-900/40 border border-white/5 p-10 rounded-[2.5rem] space-y-6 hover:border-indigo-500/30 transition-colors group">
              <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl inline-block group-hover:bg-indigo-50 group-hover:text-white transition-all">
                <Cpu size={24} />
              </div>
              <h3 className="text-2xl font-black tracking-tight">Moteur d'Audit IA</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Analyse cognitive en temps réel de vos KPIs publicitaires. Repérez instantanément les anomalies de CPA et recalibrez vos budgets grâce à l'IA.
              </p>
            </div>

            {/* CARDE 3 */}
            <div className="bg-slate-900/40 border border-white/5 p-10 rounded-[2.5rem] space-y-6 hover:border-purple-500/30 transition-colors group">
              <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl inline-block group-hover:bg-purple-50 group-hover:text-white transition-all">
                <Globe size={24} />
              </div>
              <h3 className="text-2xl font-black tracking-tight">Full Marque Blanche</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Personnalisez le nom, le thème visuel (Midnight ou Studio) et générez des rapports PDF vectoriels exportables aux couleurs de votre agence.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* TRACKING STATUS BANNER */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-[3rem] p-10 md:p-14 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex justify-center md:justify-start items-center gap-2 text-emerald-400 font-mono text-[11px] uppercase tracking-widest font-black">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Synchronisation API temps réel
            </div>
            <h3 className="text-3xl font-black tracking-tight">Prêt à automatiser vos flux de données ?</h3>
            <p className="text-slate-400 text-sm font-medium max-w-xl">
              Déployez votre instance de MetricFlow Core et commencez à centraliser Facebook Ads, Instagram Ads et Google Ads dès aujourd'hui.
            </p>
          </div>
          <Link href="/login?signup=true" className="w-full md:w-auto bg-white text-slate-950 px-10 py-5 rounded-xl font-black uppercase text-xs tracking-widest transition-transform active:scale-95 text-center shrink-0">
            Initialiser mon instance
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
        &copy; 2026 MetricFlow Core Infrastructure. Tous droits réservés.
      </footer>

    </div>
  );
}