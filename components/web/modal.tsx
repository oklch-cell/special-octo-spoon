import React, {ReactNode} from "react";

export default function Modal({ children, open, onClose }: { children: ReactNode, open: boolean, onClose: () => void }) {
    return (
        <div onClick={onClose} className={`fixed inset-0 flex items-center justify-center ${ open ? "" : "hidden" }`}>
            <div onClick={e => e.stopPropagation()} className="p-5 border border-accent shadow rounded-lg">
                {children}
            </div>
        </div>
    )
}
