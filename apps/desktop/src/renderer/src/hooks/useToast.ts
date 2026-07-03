import { useState } from "react";

export function useToast(): { toast: string | null; showToast: (text: string) => void } {
  const [toast, setToast] = useState<string | null>(null);

  function showToast(text: string): void {
    setToast(text);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  return { toast, showToast };
}
