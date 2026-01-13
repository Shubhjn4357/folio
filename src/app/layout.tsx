import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "../styles.scss"; // global styles
import { ThemeProvider } from "../context/ThemeContext";
import { CustomCursor, Navbar, Footer } from "@/components";
import ClientLoadingWrapper from "../components/ClientLoadingWrapper";
import { HandTrackingProvider } from '@/components/HandTrackingContext';
import { Analytics } from "@vercel/analytics/next"
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shubham Jain | Portfolio",
  description: "Senior Next.js Developer & Creative Engineer crafting high-performance, immersive 3D web experiences and scalable digital solutions.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Analytics/>
        <ThemeProvider>
          <ClientLoadingWrapper minDuration={1500} />
          <CustomCursor />
          <Navbar />
          <HandTrackingProvider>
            {children}
          </HandTrackingProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}


