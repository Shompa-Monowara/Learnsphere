import { useEffect, useState } from "react";
import { api, getErrorMessage } from "@/services/api";
import type { AssignmentItem, CourseOption, SubmissionItem } from "./types";

export interface AssignmentsData {
  assignments: AssignmentItem[];
  courses: CourseOption[];
  subs: SubmissionItem[];
}

/* Assignments + submissions ek shathe load kore. reload() dile abar fetch hoy */
export function useTeacherAssignments() {
  const [data, setData] = useState<AssignmentsData>({ assignments: [], courses: [], subs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    Promise.all([
      api.get<{ assignments: AssignmentItem[]; courses: CourseOption[] }>("/teacher/assignments"),
      api.get<{ submissions: SubmissionItem[] }>("/teacher/submissions"),
    ])
      .then(([a, s]) => {
        if (!alive) return;
        setData({
          assignments: a.data.assignments ?? [],
          courses: a.data.courses ?? [],
          subs: s.data.submissions ?? [],
        });
        setError("");
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        setError(getErrorMessage(e));
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [tick]);

  const reload = () => setTick((t) => t + 1);

  return { data, loading, error, reload };
}