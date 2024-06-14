import { Trash } from "lucide-react";

interface DeleteButtonProps {
  onClick: () => void;
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center p-2 rounded-full text-red-600 bg-white hover:bg-red-100 hover:text-red-700 transition focus:outline-none"
      aria-label="Excluir"
    >
      <Trash size={20} />
    </button>
  );
}
