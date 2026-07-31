import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Poppins, Merriweather, Playfair_Display, JetBrains_Mono, Plus_Jakarta_Sans, DM_Sans, Lora, Source_Sans_3, Roboto, Montserrat, Crimson_Text, Space_Grotesk, Work_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AppProviders } from "@/components/app-providers";
import { Analytics } from "@vercel/analytics/next";
import { PageViewTracker } from "@/components/page-view-tracker";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const merriweather = Merriweather({ variable: "--font-merriweather", subsets: ["latin"], weight: ["300", "400", "700", "900"] });
const playfair = Playfair_Display({ variable: "--font-playfair-display", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
// Premium fonts
const plusJakarta = Plus_Jakarta_Sans({ variable: "--font-plus-jakarta", subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["400", "500", "700"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const sourceSans = Source_Sans_3({ variable: "--font-source-sans", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"], weight: ["300", "400", "500", "700"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const crimsonText = Crimson_Text({ variable: "--font-crimson-text", subsets: ["latin"], weight: ["400", "600", "700"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const workSans = Work_Sans({ variable: "--font-work-sans", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Jinzai — 人材 Talent Hub | Build a resume that gets you hired",
  description:
    "Jinzai (人材) is a premier AI-powered resume builder and job seeker hub by Domain Expansion. 72 templates, AI rewriting, ATS optimization, web profiles, and one-click export.",
  keywords: ["resume builder", "CV maker", "resume templates", "ATS resume", "AI resume", "Jinzai", "人材", "Domain Expansion", "job seeker hub", "free resume builder"],
  authors: [{ name: "Domain Expansion" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Jinzai — 人材 Talent Hub",
    description: "AI-powered resume builder and job seeker hub by Domain Expansion.",
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable} ${merriweather.variable} ${playfair.variable} ${jetbrains.variable} ${plusJakarta.variable} ${dmSans.variable} ${lora.variable} ${sourceSans.variable} ${roboto.variable} ${montserrat.variable} ${crimsonText.variable} ${spaceGrotesk.variable} ${workSans.variable} ${manrope.variable} antialiased bg-background text-foreground`}
      >
        <AppProviders>
          {children}
          <PageViewTracker />
        </AppProviders>
        <Toaster />
        <SonnerToaster richColors position="bottom-right" />
        <Analytics />
      </body>
    </html>
  );
}
