"use client";

import { ButtonGroup, Button, Input } from "@/components/ui";
import { Search } from "lucide-react";
import { SelectCategory } from "./select-category";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [category, setCategory] = useState("");
  const [text, setText] = useState("");
  const router = useRouter();

  const handleClick = () => {
    console.log(category, text);
    setText("");
    router.push(`/search?category=${category}&query=${text}`);
  };

  return (
    <>
      <SelectCategory setValue={setCategory} widthFull={false} label={false} />
      <ButtonGroup className="flex">
        <Input
          placeholder="Search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="focus-visible:ring-0 flex-1 md:w-100 lg:w-120"
        />
        <Button
          onClick={handleClick}
          className="border-2 border-black cursor-pointer"
        >
          <Search />
        </Button>
      </ButtonGroup>
    </>
  );
}
