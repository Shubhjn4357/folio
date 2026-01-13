import { ReactNode } from "react";
import { CustomCursor, Navbar, Footer, HandGestureGuideModal } from "@/components";
import { HandTrackingProvider } from '@/components/HandTrackingContext';
import ClientLoadingWrapper from "@/components/ClientLoadingWrapper";

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <HandTrackingProvider>
            <ClientLoadingWrapper minDuration={1500} />
            <CustomCursor />
            <HandGestureGuideModal />
            <Navbar />
            {children}
            <Footer />
        </HandTrackingProvider>
    );
}
