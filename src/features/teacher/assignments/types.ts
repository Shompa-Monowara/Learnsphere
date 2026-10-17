export interface AssignmentItem {
  id: string;
  title: string;
  instructions: string;
  attachments: string[];
  courseId: string;
  courseTitle: string;
  deadline: string | null;
  totalMarks: number;
  total: number;
  graded: number;
  enrolled: number;
  closed: boolean;
}

export interface SubmissionItem {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  totalMarks: number;
  studentName: string;
  studentEmail: string;
  fileName: string;
  fileUrl: string;
  text: string;
  submittedAt: string | null;
  score: number | null;
  feedback: string;
  graded: boolean;
  progress: number | null;
}

export interface CourseOption {
  id: string;
  title: string;
}

export type SubFilter = "all" | "pending" | "graded";

export const fmtDate = (iso: string | null): string =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    : "—";

/* "Oct 10, 2026 · 9:14 PM" */
export const fmtDateTime = (iso: string | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${date} · ${time}`;
};

export const initials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "S";

/* <input type="date"> er jonno YYYY-MM-DD (local) */
export const toDateInput = (iso: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export const fileNameFromUrl = (url: string): string => {
  const last = url.split("?")[0].split("/").pop() ?? "file";
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
};