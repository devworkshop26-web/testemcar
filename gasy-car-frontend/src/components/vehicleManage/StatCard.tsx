import React from "react";
import { cn } from "@/lib/utils";

type StatVariant =
  | "blue"
  | "green"
  | "purple"
  | "amber"
  | "soft-blue"
  | "soft-green"
  | "soft-purple"
  | "soft-amber"
  | "soft-gray";

interface StatCardProps {
  label: string;
  value: string | number;
  variant?: StatVariant;
  icon?: React.ReactNode;
  suffix?: string;
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const variantStyles: Record<
  StatVariant,
  { bg: string; text: string; border: string }
> = {
  /* ===== Variants existants ===== */
  blue: {
    bg: "bg-stat-blue",
    text: "text-stat-blue-text",
    border: "border-stat-blue-text/20",
  },
  green: {
    bg: "bg-stat-green",
    text: "text-stat-green-text",
    border: "border-stat-green-text/20",
  },
  purple: {
    bg: "bg-stat-purple",
    text: "text-stat-purple-text",
    border: "border-stat-purple-text/20",
  },
  amber: {
    bg: "bg-stat-amber",
    text: "text-stat-amber-text",
    border: "border-stat-amber-text/20",
  },

  /* ===== Variants SOFT (premium) ===== */
  "soft-blue": {
    bg: "bg-blue-50/70",
    text: "text-blue-700",
    border: "border-blue-200/60",
  },
  "soft-green": {
    bg: "bg-emerald-50/70",
    text: "text-emerald-700",
    border: "border-emerald-200/60",
  },
  "soft-purple": {
    bg: "bg-violet-50/70",
    text: "text-violet-700",
    border: "border-violet-200/60",
  },
  "soft-amber": {
    bg: "bg-amber-50/70",
    text: "text-amber-700",
    border: "border-amber-200/60",
  },
  "soft-gray": {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
  },
};

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  variant = "blue",
  icon,
  suffix,
}) => {
  // 🔒 Sécurité absolue (aucun crash possible)
  const styles = variantStyles[variant] ?? variantStyles["soft-gray"];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 transition-all duration-300",
        "hover:shadow-md hover:-translate-y-0.5",
        styles.bg,
        styles.border
      )}
    >
      {/* Icon */}
      {icon && (
        <div className={cn("mb-3", styles.text)}>
          {icon}
        </div>
      )}

      {/* Label */}
      <p className={cn("text-sm font-medium opacity-80", styles.text)}>
        {label}
      </p>

      {/* Value */}
      <p className={cn("text-2xl sm:text-3xl font-bold mt-1", styles.text)}>
        {value}
        {suffix && (
          <span className="text-lg ml-1 font-medium opacity-70">
            {suffix}
          </span>
        )}
      </p>

      {/* Decorative bubble */}
      <div
        className={cn(
          "pointer-events-none absolute -right-6 -bottom-6 w-28 h-28 rounded-full opacity-10",
          styles.text,
          "bg-current"
        )}
      />
    </div>
  );
};

export default StatCard;
