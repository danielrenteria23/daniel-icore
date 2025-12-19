import { FiCheck, FiInfo } from "react-icons/fi";
import { PMSSyncStatus } from "@/types";

interface PMSSyncStatusBadgeProps {
  status: PMSSyncStatus;
  statusModified?: string;
}

export default function PMSSyncStatusBadge({
  status,
  statusModified,
}: PMSSyncStatusBadgeProps) {
  const isSynced = status === "Synced";

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex items-center justify-center gap-1.5 rounded py-0.5 text-xs font-semibold ${
          isSynced
            ? "bg-synced text-syncedText"
            : "bg-notSynced text-notSyncedText"
        }`}
      >
        {isSynced ? (
          <FiCheck className="h-3 w-3" aria-hidden="true" />
        ) : (
          <FiInfo className="h-3 w-3" aria-hidden="true" />
        )}
        {status}
      </span>
      {statusModified && (
        <span className="text-[10px] text-gray-400">{statusModified}</span>
      )}
    </div>
  );
}
