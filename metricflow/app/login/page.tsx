"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, ArrowLeft, Sparkles, AlertTriangle } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Écoute les changements de l'URL pour basculer automatiquement entre Login et Inscription
  useEffect(() => {
    setIsSignUp(searchParams.get("signup") === "true");
    setErrorMsg(null); // Reset l'erreur au changement de mode
  }, [searchParams]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        // FLOW INCRIPTION
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        // Si Supabase est configuré sans confirmation d'email, il connecte direct
        if (data?.session) {
          document.cookie = `sb-metricflow-auth=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax; Secure`;
          window.location.href = "/dashboard";
        } else {
          alert("Compte créé ! Vérifiez votre boîte mail pour valider votre inscription.");
          setLoading(false);
        }
      } else {
        // FLOW CONNEXION
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        if (data?.session) {
          document.cookie = `sb-metricflow-auth=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax; Secure`;
        }
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      // TRADUCTION DES ERREURS SUPABASE EN FRANÇAIS PRO
      if (err.message === "Invalid login credentials") {
        setErrorMsg("Identifiants invalides. Vérifiez votre e-mail ou votre mot de passe.");
      } else if (err.message === "User already registered") {
        setErrorMsg("Cet e-mail est déjà lié à une infrastructure MetricFlow.");
      } else if (err.message === "Password should be at least 6 characters") {
        setErrorMsg("Le mot de passe doit contenir au moins 6 caractères.");
      } else {
        setErrorMsg(err.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased relative overflow-hidden flex flex-col justify-center items-center px-6">
      
      {/* BACKGROUND GLOWS CONFINÉS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      {/* BOUTON RETOUR */}
      <div className="absolute top-8 left-8 z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white font-black transition-colors uppercase text-xs tracking-widest">
          <ArrowLeft size={14} /> Retour à l'architecture
        </Link>
      </div>

      {/* CARDE D'ACCÈS DIRECTIONNEL DYNAMIQUE */}
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/40 border border-white/5 p-8 md:p-12 rounded-[3rem] backdrop-blur-xl shadow-2xl space-y-8 relative z-10"
      >
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Sparkles size={20} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase transition-all">
            {isSignUp ? "Créer l'agence" : "MetricFlow"}
          </h1>
          <p className="text-slate-400 text-xs font-medium">
            {isSignUp 
              ? "Initialisez vos accès pour déployer votre instance Core." 
              : "Connectez-vous pour piloter votre univers directionnel."}
          </p>
        </div>

        {/* LE BANDEAU D'ERREUR PREMIUM (REMPLACE L'ALERT NAVIGATEUR) */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 text-red-400 text-xs font-semibold leading-relaxed"
            >
              <AlertTriangle size={18} className="shrink-0 text-red-500" />
              <div>{errorMsg}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              Adresse E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com" 
                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-800 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-800 text-white"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-950 font-black uppercase text-xs tracking-widest py-4 rounded-xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Traitement en cours..." : isSignUp ? "Déployer mon infrastructure" : "Entrer dans l'univers"} 
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="text-center pt-2">
          {isSignUp ? (
            <Link href="/login" className="text-[11px] font-bold text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-wider">
              Vous avez déjà un compte ? Connectez-vous
            </Link>
          ) : (
            <Link href="/login?signup=true" className="text-[11px] font-bold text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-wider">
              Pas encore de compte ? Créer votre agence
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// WRAPPER DE SÉCURITÉ POUR NEXT.JS
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-mono text-xs">CHARGEMENT CORE...</div>}>
      <LoginContent />
    </Suspense>
  );
}