import { ReactNode } from "react";
import { Header } from "@/components/web";

export default function NormalLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            {children}
        </>
    )
}
