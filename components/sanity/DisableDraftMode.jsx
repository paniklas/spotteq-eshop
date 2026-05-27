"use client";

import { useVisualEditingEnvironment } from "next-sanity/hooks";
import { useRouter } from "next/navigation";

export function DisableDraftMode() {
  const environment = useVisualEditingEnvironment();
  const router = useRouter();

  // Hide when inside Presentation Tool — it has its own exit button
  if (environment === "presentation") {
    return null;
  }

  const handleClick = async () => {
    await fetch("/api/draft-mode/disable");
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 bg-gray-50 px-4 py-2 text-black"
    >
      Disable Draft Mode
    </button>
  );
}