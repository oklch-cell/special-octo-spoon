import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <main className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin" />
        </main>
    )
}
