import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simulador de Previdência Privada",
  description: "Planeje sua aposentadoria com nosso simulador inteligente. Calcule contribuições, projeções e renda futura de forma simples e eficiente.",
  keywords: ["previdência privada", "aposentadoria", "simulador", "investimento", "planejamento financeiro"],
  authors: [{ name: "Simulador Previdência" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={openSans.className}>
        {children}
      </body>
    </html>
  );
}
