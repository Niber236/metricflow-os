"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Database, AlertTriangle, ArrowDown, Code2, Zap, Rocket, Users, Target, ListTodo, Map, Palette, Lock } from "lucide-react";
import Link from "next/link";

export default function PitchDeck() {
  return (
    <div className="h-screen w-full bg-slate-950 text-white overflow-y-scroll snap-y snap-mandatory font-sans scroll-smooth">
      
      {/* SLIDE 1 : TITRE & INTRO */}
      <section className="h-screen w-full snap-center flex flex-col items-center justify-center p-10 relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center z-10">
          <span className="text-blue-500 font-black tracking-widest uppercase text-sm mb-4 block">Soutenance RNCP 5</span>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6">MetricFlow OS</h1>
          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto mb-12 leading-relaxed">
            Infrastructure Multi-Tenant de centralisation de données publicitaires et d'audit IA.
          </p>
        </motion.div>
        <div className="absolute bottom-10 animate-bounce text-slate-500">
          <ArrowDown size={32} />
        </div>
      </section>

      {/* SLIDE 2 : LE DÉVELOPPEUR (RÔLE FULL-STACK) */}
      <section className="h-screen w-full snap-center flex flex-col items-center justify-center p-10 bg-slate-900/40 relative">
        <div className="max-w-4xl w-full z-10 space-y-12">
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="p-4 bg-purple-500/10 text-purple-500 rounded-2xl"><Users size={32}/></div>
            <h2 className="text-5xl font-black tracking-tight">Développement & Ingénierie</h2>
          </div>
          <div className="p-10 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
            <h3 className="text-4xl font-black text-white mb-2">Bernis</h3>
            <p className="text-blue-400 font-black uppercase text-sm tracking-widest mb-8">Lead Ingénieur Full-Stack & DevOps</p>
            <ul className="space-y-5 text-slate-300 text-lg leading-relaxed">
              <li><strong className="text-emerald-400">Back-End & Infra :</strong> Modélisation PostgreSQL relationnelle (MCD), sécurisation stricte par Row Level Security (RLS) et création de middlewares d'interception avec Next.js.</li>
              <li><strong className="text-blue-400">Front-End & UX :</strong> Conception des interfaces avec React 19, typage strict TypeScript, styling modulaire Utility-First via TailwindCSS, et gestion d'état global avec Context API.</li>
              <li><strong className="text-purple-400">Intégration API & IA :</strong> Implémentation du flux OAuth 2.0 complexe pour l'aspiration de données Meta Ads, et intégration du SDK Google GenAI (Gemini) avec Prompt Engineering déterministe.</li>
              <li><strong className="text-yellow-400">Performances :</strong> Ingénierie d'export PDF 100% côté client (Base64/Canvas) pour ne pas surcharger le serveur, et optimisation de la Data Visualisation asynchrone (Recharts).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SLIDE 3 : PROBLÉMATIQUE & SOLUTION */}
      <section className="h-screen w-full snap-center flex flex-col items-center justify-center p-10 relative">
        <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-6xl w-full z-10 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center"><AlertTriangle size={32}/></div>
            <h2 className="text-4xl font-black">Le Problème Métier</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Les agences de marketing digital perdent des dizaines d'heures par mois sur des reportings manuels chronophages. Les données sont fragmentées entre plusieurs régies (Meta, Google), entraînant des temps de réaction trop lents face aux baisses de rentabilité, une sous-optimisation des budgets et un manque de clarté pour le client final.
            </p>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center"><Zap size={32}/></div>
            <h2 className="text-4xl font-black">La Solution Technique</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              MetricFlow OS est une plateforme centralisée SaaS Multi-Tenant. Elle permet l'aspiration automatisée des statistiques via Graph API, offre un portail client interactif géré dynamiquement en marque blanche, et intègre un auditeur IA embarqué (Gemini) capable de repérer les anomalies de conversion et de rentabilité instantanément.
            </p>
          </div>
        </div>
      </section>

      {/* SLIDE 4 : TECH STACK EN PROFONDEUR */}
      <section className="h-screen w-full snap-center flex flex-col items-center justify-center p-10 bg-slate-900/40">
        <div className="max-w-7xl w-full text-center space-y-12">
          <h2 className="text-5xl font-black mb-10"><Code2 className="inline-block mr-4 text-blue-500" size={48}/>Maîtrise de la Stack Technique</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl">
              <h3 className="text-2xl font-black mb-4 text-white">Next.js 16 (App Router) & TypeScript</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Le cœur de l'infrastructure exploite le paradigme <strong>Backend-For-Frontend (BFF)</strong>. Les <strong>Route Handlers</strong> (`/api/`) exécutent la logique métier critique (appels IA, échanges de jetons) de serveur à serveur, garantissant l'invisibilité totale des clés privées. Le typage <strong>TypeScript</strong> strict a été imposé sur tous les schémas de données pour bloquer les crashs silencieux lors des calculs financiers.
              </p>
            </div>
            
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl">
              <h3 className="text-2xl font-black mb-4 text-emerald-500">Supabase (PostgreSQL & JWT)</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Au-delà d'un simple stockage, la sécurité est poussée au niveau du moteur SQL via le <strong>Row Level Security (RLS)</strong>. La base de données déchiffre elle-même le jeton <strong>JWT</strong> de session à chaque requête. Ce choix d'architecture backend garantit une étanchéité absolue de la donnée (Multi-Tenant) entre les agences, empêchant toute falsification de requêtes côté client.
              </p>
            </div>
            
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl">
              <h3 className="text-2xl font-black mb-4 text-blue-400">React 19, TailwindCSS & Recharts</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Le DOM est optimisé via des composants fonctionnels asynchrones. L'approche <strong>Utility-First</strong> de Tailwind permet une compilation CSS au plus proche de 0 octet inutilisé. L'état global est géré via le <strong>Context API</strong> pour propager la marque blanche (couleurs/noms) instantanément sans rechargement. Les données sont rendues visuellement par la librairie Recharts.
              </p>
            </div>
            
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl">
              <h3 className="text-2xl font-black mb-4 text-purple-400">Écosystème API (Meta & Google IA)</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Construction d'un pipeline <strong>OAuth 2.0</strong> robuste avec la Graph API de Meta pour obtenir et prolonger des Access Tokens dynamiques (`long-lived`). Pour l'analytique, le <strong>Google GenAI SDK</strong> (Gemini 2.5) est bridé par un Prompt Engineering technique forçant des retours JSON ou du texte brut déterministe pour une intégration front-end et PDF parfaite.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SLIDE 5 : MARQUE BLANCHE & ÉTAT GLOBAL */}
      <section className="h-screen w-full snap-center flex flex-col items-center justify-center p-10 relative">
        <div className="max-w-6xl w-full z-10 space-y-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center"><Palette size={32}/></div>
            <h2 className="text-5xl font-black tracking-tight">Ingénierie de la Marque Blanche</h2>
          </div>
          <p className="text-xl text-slate-300 leading-relaxed max-w-5xl mb-6">
            L'objectif technique : Permettre à chaque agence de personnaliser l'interface globale (couleur principale, nom, thème clair/sombre) de manière réactive, sans impacter les temps de chargement serveur.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl">
              <h3 className="text-xl font-black text-white mb-4">1. React Context API (Global State)</h3>
              <p className="text-base text-slate-400 leading-relaxed">
                J'ai rejeté le passage de propriétés (Prop-Drilling). Un <strong>ThemeProvider</strong> enveloppe l'arbre React complet. À la connexion de l'utilisateur, une seule requête asynchrone hydrate le Context avec les préférences de la base de données. Ces données sont mises en cache pour éviter la surcharge réseau.
              </p>
            </div>
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl">
              <h3 className="text-xl font-black text-white mb-4">2. Injection DOM & Rendu Conditionnel</h3>
              <p className="text-base text-slate-400 leading-relaxed">
                Les valeurs du contexte sont exploitées via un Hook personnalisé (`useTheme()`). Elles sont injectées dynamiquement dans les objets via l'attribut <code>style={`{{ backgroundColor: primaryColor }}`}</code>, écrasant les classes Tailwind par défaut et garantissant une modification visuelle instantanée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 6 : SÉCURITÉ 360° (MIDDLEWARE + RLS) */}
      <section className="h-screen w-full snap-center flex flex-col items-center justify-center p-10 bg-slate-900/40 relative">
        <div className="max-w-6xl w-full z-10 space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center"><Lock size={32}/></div>
            <h2 className="text-5xl font-black tracking-tight">Sécurité Défensive de l'Infrastructure</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl h-full">
                <h3 className="text-2xl font-black text-emerald-400 mb-4">Couche 1 : Edge Middleware</h3>
                <p className="text-base text-slate-400 leading-relaxed mb-6">
                  Le fichier <code>proxy.ts</code> s'exécute sur l'Edge Network de Next.js, avant même le montage du composant React. Il intercepte les headers HTTP et vérifie la présence du cookie <code>sb-metricflow-auth</code>. Sans cookie, le middleware force une redirection 307 immédiate vers le login, empêchant le "flash" d'une page privée (FOUC) pour une sécurité UX parfaite.
                </p>
                <code className="block text-sm font-mono bg-slate-900 p-4 rounded-xl text-blue-300">if (!hasSession) redirect('/login');</code>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl h-full">
                <h3 className="text-2xl font-black text-emerald-400 mb-4">Couche 2 : PostgreSQL RLS</h3>
                <p className="text-base text-slate-400 leading-relaxed mb-6">
                  Le middleware n'étant pas inviolable (un cookie peut être créé artificiellement), la sécurité finale est déléguée au moteur de la base de données. Les requêtes utilisent le <strong>Row Level Security</strong> : PostgreSQL déchiffre la signature cryptographique du jeton JWT pour autoriser l'accès aux seules lignes qui appartiennent au <code>auth.uid()</code> de l'utilisateur.
                </p>
                <code className="block text-sm font-mono bg-slate-900 p-4 rounded-xl text-purple-300">USING (owner_id = auth.uid())</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 7 : RÉTROSPECTIVE (RÉUSSITES / CHALLENGES / APPRENTISSAGES) */}
      <section className="h-screen w-full snap-center flex flex-col items-center justify-center p-10 relative">
        <div className="max-w-7xl w-full space-y-12">
          <h2 className="text-5xl font-black tracking-tight text-center"><Target className="inline-block mr-4 text-red-500" size={48}/>Rétrospective du Projet</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-slate-900 border border-emerald-500/20 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-black text-emerald-500 mb-6">Réussites Techniques</h3>
              <p className="text-base text-slate-400 leading-relaxed">
                La mise en place du pipeline d'authentification OAuth Meta fonctionne parfaitement sur le backend. L'implémentation de la génération PDF côté client (html-to-image) a permis de diviser les coûts de traitement serveur par 10 par rapport à une approche SSR classique.
              </p>
            </div>
            <div className="p-10 bg-slate-900 border border-red-500/20 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-black text-red-500 mb-6">Défis & Résolutions</h3>
              <p className="text-base text-slate-400 leading-relaxed">
                Le passage du projet vers un typage strict (`Implicit Any` désactivé) a causé de nombreuses erreurs de build en production (Vercel). La gestion asynchrone des variables temporelles pour l'expiration des tokens d'API a exigé la création de flux de re-génération côté Route Handlers.
              </p>
            </div>
            <div className="p-10 bg-slate-900 border border-blue-500/20 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-black text-blue-500 mb-6">Apprentissages Métier</h3>
              <p className="text-base text-slate-400 leading-relaxed">
                L'importance de séparer la logique d'état visuelle (UI) de l'intégrité backend. La structuration initiale du schéma relationnel (MCD) est l'étape la plus critique du projet, car elle conditionne 80% des politiques de sécurité (RLS) et des performances des requêtes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 8 : ROADMAP (PROCHAINES ÉTAPES) */}
      <section className="h-screen w-full snap-center flex flex-col items-center justify-center p-10 bg-slate-900/40">
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><ListTodo size={32}/></div>
          <h2 className="text-5xl font-black tracking-tight mb-8">Roadmap de Scalabilité</h2>
          <ul className="text-2xl text-slate-300 leading-relaxed space-y-6 max-w-2xl mx-auto text-left list-disc pl-6 font-medium">
            <li>Intégration du SDK Stripe pour l'automatisation de la facturation Multi-Tenant.</li>
            <li>Développement d'une infrastructure de Webhooks pour gérer le cycle de vie des abonnements des agences (SaaS).</li>
            <li>Conception d'un connecteur d'API parallèle pour l'aspiration des KPIs Google Ads.</li>
            <li>Mise en place de tests unitaires (Jest) automatisés au sein d'une pipeline CI/CD (GitHub Actions).</li>
          </ul>
        </div>
      </section>

      {/* SLIDE 9 : DÉMO */}
      <section className="h-screen w-full snap-center flex flex-col items-center justify-center p-10 relative">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <h2 className="text-7xl font-black mb-8 z-10">Live Démo</h2>
        <p className="text-xl text-slate-400 mb-12 z-10 text-center max-w-2xl">
          Fin de la présentation architecturale. Passage à la démonstration de l'interface et du système en direct.
        </p>
        <Link href="/login" target="_blank" className="z-10 bg-white text-slate-950 px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center gap-4">
          <Rocket size={24} /> Lancer MetricFlow OS
        </Link>
      </section>

    </div>
  );
}