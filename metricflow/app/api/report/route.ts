import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    // CORRECTION : On extrait les données depuis 'request', pas 'response'
    const { clientName, stats } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "La variable d'environnement GEMINI_API_KEY est manquante" }, { status: 500 });
    }

    // Initialisation du SDK officiel Google Gen AI
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
      Tu es un directeur de stratégie d'acquisition de haut niveau pour une agence de marketing digital. 
      Rédige une analyse de performance pour notre client "${clientName}" basée sur les données suivantes :
      ${JSON.stringify(stats)}

      ### DIRECTIVES STRICTES DE RÉDACTION :
      1. TON & POSTURE : Adopte un ton corporate, expert, analytique et constructif. Tu dois inspirer la confiance et l'autorité.
      2. VOUVOIEMENT OBLIGATOIRE : Adresse-toi au client exclusivement en utilisant "vous". Le tutoiement est strictement interdit.
      3. VOCABULAIRE PRO : Supprime toute expression familière, ironique ou condescendante (pas de métaphores comme "dînette", "chewing-gum", "avion", etc.). Remplace-les par des termes techniques précis (ex: volume statistiquement insuffisant, phase d'apprentissage non finalisée).
      4. CLARTÉ : Reste direct. Entre immédiatement dans le vif du sujet, pas d'introduction inutile comme "Voici le rapport".

      ### STRUCTURE DE L'ANALYSE (Garde ces titres exacts dans le texte) :
      ANALYSE DE RENTABILITE
      (Fais un résumé clair des dépenses globales, du volume de conversions et calcule le CPA moyen. Si le budget est trop faible pour que l'algorithme apprenne, explique-le de manière scientifique et rigoureuse).

      DIAGNOSTIC TACTIQUE
      (Identifie les anomalies. Si le taux de conversion par clic est anormalement haut, explique avec diplomatie mais fermeté que le protocole de tracking (Pixel/API de conversion) présente des doublons techniques qui doivent être audités).

      FEUILLE DE ROUTE (MOIS PROCHAIN)
      (Donne 3 actions concrètes et prioritaires, rédigées sous forme de conseils stratégiques pour optimiser les campagnes, diversifier les créas et stabiliser la donnée).
    `;

    // Appel au modèle de dernière génération
     const responseAI = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Utilise ton modèle actif
      contents: prompt,
    });

    const text = responseAI.text;

    return NextResponse.json({ report: text });
  } catch (error: any) {
    // Crucial pour voir exactement pourquoi ça coince dans ton terminal Linux
    console.error("[METRICFLOW_API_ERROR]:", error);
    return NextResponse.json({ error: "Erreur de génération : " + error.message }, { status: 500 });
  }
}