"use client";

import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SelectCategory from "./select-category";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
    const [category, setCategory] = useState("");
    const [text, setText] = useState("");
    const router = useRouter();

    const handleClick = () => {
        console.log(category, text);
        setText("");
        router.push(`/search?category=${category}&q=${text}`);
    }

    return (
        <>
            <SelectCategory setValue={setCategory} widthFull={false} label={false} />
            <ButtonGroup className="flex">
                <Input placeholder="Search" value={text} onChange={e => setText(e.target.value)} className="focus-visible:ring-0 flex-1 md:w-100 lg:w-120" />
                <Button onClick={handleClick} className="border-2 border-black cursor-pointer"><Search /></Button>
            </ButtonGroup>
        </>
    )
}
