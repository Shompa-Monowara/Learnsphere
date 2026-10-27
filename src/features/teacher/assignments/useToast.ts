import { useState } from "react";

/* Chhoto message dekhay, 2.5 second pore nijei muche jay */
export function useToast() {
  const [toast, setToast] = useState("");

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  };

  return { toast, flash };
}