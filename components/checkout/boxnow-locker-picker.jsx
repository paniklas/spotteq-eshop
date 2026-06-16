"use client";

import { useState, useEffect, useRef, memo } from "react";

const WIDGET_ORIGIN = "widget-v5.boxnow.";

function BoxNowLockerPicker({ partnerId, postalCode, onSelect }) {
  const [selected, setSelected] = useState(null);

  // onSelect is stable (useCallback in parent) so no sync effect needed —
  // the ref is initialized once and never goes stale.
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    function handleMessage(event) {
      if (!event.origin.includes(WIDGET_ORIGIN)) return;

      const data = event.data;
      if (!data?.boxnowLockerId) return;

      const info = {
        lockerId: data.boxnowLockerId,
        lockerName: data.boxnowLockerName ?? data.boxnowLockerAddressLine1 ?? "",
        lockerAddress: [
          data.boxnowLockerAddressLine1,
          data.boxnowLockerPostalCode,
          data.boxnowLockerCity,
        ]
          .filter(Boolean)
          .join(", "),
      };

      setSelected(info);
      onSelectRef.current(info);
    }

    window.addEventListener("message", handleMessage, false);
    return () => window.removeEventListener("message", handleMessage, false);
  }, []);

  const iframeSrc = `https://widget-v5.boxnow.gr?partnerId=${partnerId}&gps=yes${
    postalCode ? `&zip=${postalCode}` : ""
  }`;

  return (
    <div className="mt-3 space-y-2">
      {selected && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm">
          <p className="font-medium text-green-800">{selected.lockerName}</p>
          {selected.lockerAddress && (
            <p className="text-green-700">{selected.lockerAddress}</p>
          )}
          <button
            type="button"
            className="mt-1 text-xs text-green-600 underline"
            onClick={() => {
              setSelected(null);
              onSelectRef.current({ lockerId: "", lockerName: "", lockerAddress: "" });
            }}
          >
            Change locker
          </button>
        </div>
      )}

      {/* Keep iframe in DOM when a locker is selected so it doesn't reload on "Change locker" */}
      <iframe
        src={iframeSrc}
        className={`w-full rounded-md border border-gray-200 ${selected ? "hidden" : "min-h-125"}`}
        title="BoxNow locker selector"
        allow="geolocation"
      />
    </div>
  );
}

export default memo(BoxNowLockerPicker);
