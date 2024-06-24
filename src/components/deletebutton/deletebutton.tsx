import { Trash } from "lucide-react";

interface DeleteButtonProps {
  onClick: () => void;
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex border-[1px] items-center justify-center p-2 rounded-full text-red-600  transition"
      aria-label="Excluir"
    >
      <Trash size={20} />
    </button>
  );
}
