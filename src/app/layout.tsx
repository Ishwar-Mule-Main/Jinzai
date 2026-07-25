import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Poppins, Merriweather, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ResumeForge — Build a resume that gets you hired",
  description:
    "Free AI-powered resume & CV builder. Choose from 6 professionally designed templates that auto-optimize to your content. Generate AI summaries, export to PDF, ATS-friendly.",
  keywords: ["resume builder", "CV maker", "resume templates", "ATS resume", "AI resume", "free resume builder"],
  authors: [{ name: "ResumeForge" }],
  openGraph: {
    title: "ResumeForge — Build a resume that gets you hired",
    description: "AI-powered resume builder with 6 auto-optimizing templates.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable} ${merriweather.variable} ${playfair.variable} ${jetbrains.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Toaster />
        <SonnerToaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
