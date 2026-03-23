import { MessageSquare } from "lucide-react";

interface SupportEmptyStateProps {
  title: string;
  description: string;
}

export function SupportEmptyState({
  title,
  description,
}: SupportEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <MessageSquare className="h-8 w-8 text-slate-400" />
      </div>
      <p className="text-lg font-semibold text-slate-800">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}