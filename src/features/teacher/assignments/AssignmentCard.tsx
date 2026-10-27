import { Eye, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import CardIcon from "./CardIcon";
import IconBtn from "./IconBtn";
import { fmtDate, type AssignmentItem } from "./types";

interface AssignmentCardProps {
  a: AssignmentItem;
  selected: boolean;
  onToggle: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AssignmentCard({ a, selected, onToggle, onView, onEdit, onDelete }: AssignmentCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter") onToggle();
      }}
      className={cn(
        "group cursor-pointer rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md",
        selected && "ring-2 ring-teal-500",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
          <CardIcon />
        </div>

        <div className="flex items-center gap-1.5">
          {/* hover e dekhay (mobile e sobsomoy) */}
          <div className="flex items-center gap-0.5 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <IconBtn label="View" onClick={onView} icon={<Eye className="h-3.5 w-3.5" />} />
            <IconBtn label="Edit" onClick={onEdit} icon={<Pencil className="h-3.5 w-3.5" />} />
            <IconBtn label="Delete" danger onClick={onDelete} icon={<Trash2 className="h-3.5 w-3.5" />} />
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium",
              a.closed ? "bg-slate-100 text-slate-500" : "bg-green-50 text-green-600",
            )}
          >
            {a.closed ? "Closed" : "Active"}
          </span>
        </div>
      </div>

      <p className="mt-3 line-clamp-1 text-sm font-bold text-slate-900">{a.title}</p>
      <p className="line-clamp-1 text-xs text-slate-500">{a.courseTitle}</p>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>
          {a.graded}/{a.total} graded
        </span>
        <span>Due {fmtDate(a.deadline)}</span>
      </div>
    </div>
  );
}