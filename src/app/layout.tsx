import { Toaster } from 'sonner';
import type { Metadata } from "next";
import { Montserrat, DM_Sans } from "next/font/google";
import "./globals.css";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";

// IMPORTAMOS NUESTRAS FUENTES PREMIUM
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["700", "800", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Emotia",
  description: "Plataforma inteligente de regalos experienciales",
  icons: {
    icon: '/logo/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${montserrat.variable} ${dmSans.variable} antialiased`}
        style={{ fontFamily: "'DM Sans', sans-serif" }} // Fuerza la fuente base
      >
        <StackProvider app={stackServerApp}>
          <StackTheme>
            {children}
          </StackTheme>
        </StackProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}