import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="p-5 flex shadow">
                <Link href="/" className="p-2 rounded-full hover:bg-gray-200"><ArrowLeft /></Link>
            </div>
            {children}
        </>
    );
}
