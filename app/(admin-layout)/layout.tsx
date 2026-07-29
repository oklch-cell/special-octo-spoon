import { ReactNode } from "react";
import { HeaderAdmin } from "@/components/web";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <HeaderAdmin />
            {children}
        </>
    )
}
