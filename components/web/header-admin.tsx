import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function HeaderAdmin() {
    return (
        <nav className="flex items-center justify-between p-5 shadow">
            <Link href="/" className="p-2 rounded-full hover:bg-gray-200"><ArrowLeft /></Link>
            <div className="flex items-center gap-4">
                <Link href="/admin/products/add">Add Product</Link>
                <Link href="/admin/products">Products</Link>
                <Link href="/admin/orders">Orders</Link>
            </div>
        </nav>
    );
}
