import { ReactNode } from "react";
import { CustomCursor, Navbar, Footer } from "@/components";
import ShaderBackground from "@/components/ShaderBackground";
import ClientLoadingWrapper from "@/components/ClientLoadingWrapper";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ClientLoadingWrapper minDuration={800} />
      <ShaderBackground />
      <CustomCursor />
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </>
  );
}
