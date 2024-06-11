import { CirclePlus } from "lucide-react";

interface AddButtonProps {
    onClick: () => void;
}

export function AddButton({ onClick }: AddButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 w-20 h-20 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-blue-700 transition"
            aria-label="Adicionar novo espaço"
        >
        <CirclePlus />
        </button>
    );
}
