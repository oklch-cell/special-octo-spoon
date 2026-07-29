"use client";

import { Menu, X, ShoppingCart, User2, LucidePackageCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { Separator, Input, Button } from "@/components/ui";
import { SelectCategory } from "@/components/web";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SideBar() {
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState("");
    const [text, setText] = useState("");

    const router = useRouter();

    const handleClick = () => {
        setOpen(false);
        setText("");
        router.push(`/search?category=${category}&query=${text}`);
    }

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [open]);


    return (
        <div>
            <Button variant="outline" onClick={() => setOpen(true)}><Menu /></Button>
            <div className={`fixed inset-0 ${!open && "hidden"}`} onClick={() => setOpen(false)}>
                <div className="absolute p-5 h-full w-72 bg-white right-0 top-0 border-l-2 border-l-accent flex flex-col gap-5" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-end w-full"><button onClick={() => setOpen(false)}><X /></button></div>
                    <Separator />
                    <div className="flex flex-col gap-2">
                        <SelectCategory setValue={setCategory} widthFull={true} label={false} />
                        <Input placeholder="Search" value={text} onChange={(e) => setText(e.target.value)} />
                        <Button onClick={handleClick}>Search</Button>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-2">
                        <Button onClick={() => setOpen(false)} variant="outline"><Link href="/cart" className="flex items-center gap-5">Cart <ShoppingCart size={16} /></Link></Button>
                        <Button onClick={() => setOpen(false)} variant="outline"><Link href="/user" className="flex items-center gap-5">Profile <User2 size={16} /></Link></Button>
                        <Button onClick={() => setOpen(false)} variant="outline"><Link href="/orders" className="flex items-center gap-5">Orders <LucidePackageCheck size={16} /></Link></Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
