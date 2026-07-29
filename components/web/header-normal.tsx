import Link from "next/link";
import { ShoppingCart, User2, LucidePackageCheck } from "lucide-react";
import { SearchBar } from "./search-bar";
import { SideBar } from "@/components/web/sidebar";

export function Header() {

    return (
        <nav className="p-5 flex items-center justify-between shadow">
            <div>
                <Link href="/" className="text-3xl font-medium">Quick<span
                    className="font-bold text-blue-500">Cart</span></Link>
            </div>
            <div className="hidden lg:block">
                <div className="flex gap-2 items-center">
                    <SearchBar />
                </div>
            </div>
            <div className="hidden lg:block">
                <div className="flex items-center gap-4">
                    <Link href="/cart" className="p-2 rounded-full hover:bg-gray-200"><ShoppingCart /></Link>
                    <Link href="/user" className="p-2 rounded-full hover:bg-gray-200"><User2 /></Link>
                    <Link href="/orders" className="p-2 rounded-full hover:bg-gray-200"><LucidePackageCheck /></Link>
                </div>
            </div>
            <div className="lg:hidden">
                <SideBar />
            </div>
        </nav>
    );
}
