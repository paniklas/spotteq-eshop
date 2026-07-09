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
      className="fixed bottom-4 right-4 bg-gray-50 px-4 py-2 text-black z-50 rounded-lg cursor-pointer shadow-md hover:bg-gray-100 transition-colors"
    >
      Disable Draft Mode
    </button>
  );
}