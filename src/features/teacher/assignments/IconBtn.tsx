import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IconBtnProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
}

export default function IconBtn({ label, icon, onClick, danger }: IconBtnProps) {
  return (
    <button
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "rounded-md p-1.5 transition",
        danger
          ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
          : "text-slate-400 hover:bg-slate-100 hover:text-slate-700",
      )}
    >
      {icon}
    </button>
  );
}