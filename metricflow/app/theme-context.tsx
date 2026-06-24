"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState("light");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [agencyName, setAgencyName] = useState("");
  const [agency, setAgency] = useState<any>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const refreshSettings = async () => {
    setLoadingSettings(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setAgency(null);
      setAgencyName("");
      setLoadingSettings(false);
      return;
    }

    const { data: agencyData } = await supabase
      .from("agencies")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (agencyData) {
      setAgency(agencyData);
      setAgencyName(agencyData.name);
      setPrimaryColor(agencyData.primary_color);
      setThemeMode(agencyData.theme_mode || "light");
      localStorage.setItem("metricflow-theme", agencyData.theme_mode || "light");
    } else {
      setAgency(null);
      setAgencyName("");
    }
    setLoadingSettings(false);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("metricflow-theme");
    if (savedTheme) setThemeMode(savedTheme);

    // NETTOYAGE ET SYNCHRONISATION AUTOMATIQUE DES SESSIONS MULTI-COMPTES
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        await refreshSettings();
      } else if (event === "SIGNED_OUT") {
        // Clear absolu de la mémoire React pour éviter les fuites de données
        setAgency(null);
        setAgencyName("");
        setPrimaryColor("#3b82f6");
        setThemeMode("light");
        localStorage.removeItem("metricflow-theme");
        setLoadingSettings(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, primaryColor, setPrimaryColor, agencyName, setAgencyName, agency, loadingSettings, refreshSettings }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);