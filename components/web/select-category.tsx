import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field";

const categories = [
    { label: "Select a category", value: null },
    { label: "Cleats", value: "cleats" },
    { label: "Sneakers", value: "sneakers" },
    { label: "Loafers", value: "loafers" },
    { label: "Slip Ons", value: "slip-ons" },
    { label: "Brogues", value: "brogues" },
    { label: "Flip Flops", value: "flip-flops" },
    { label: "Wedges", value: "wedges" },
];

export default function SelectCategory({ setValue, widthFull }: { setValue: (c: string) => void, widthFull: boolean }) {
    return (
        <Field>
            {widthFull && <FieldLabel htmlFor="category">Category</FieldLabel>}
            <Select items={categories} id="category" onValueChange={(value: string | null) => setValue(value!)}>
                <SelectTrigger className={`${widthFull ? "w-full" : "max-w-48 w-full"}`}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                                {category.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </Field>
    );
}
