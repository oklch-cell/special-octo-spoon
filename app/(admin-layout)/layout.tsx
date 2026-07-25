import { ReactNode } from "react";
import Header from "@/components/web/header-admin";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            {children}
        </>
    )
}
