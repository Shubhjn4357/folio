import { Inter } from "next/font/google";
import "../styles.scss"; // Keeping the existing global styles
import { ThemeProvider } from "../context/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shubham Jain | Portfolio",
  description: "A stunning 3D developer portfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
