import { ThemeProvider } from "@/app/theme-context";
import "./globals.css"; 

export const metadata = {
  title: "MetricFlow Core",
  description: "Système directionnel d'acquisition global",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}