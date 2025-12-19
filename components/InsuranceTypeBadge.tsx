import { InsuranceType } from "@/types";

interface InsuranceTypeBadgeProps {
  type: InsuranceType;
}

export default function InsuranceTypeBadge({ type }: InsuranceTypeBadgeProps) {
  const isPrimary = type === "Primary";

  return (
    <span
      className={`inline-flex items-center justify-center rounded p-1 text-xs font-semibold ${
        isPrimary
          ? "bg-primary text-primaryText"
          : "bg-secondary text-secondaryText"
      }`}
    >
      {type}
    </span>
  );
}
