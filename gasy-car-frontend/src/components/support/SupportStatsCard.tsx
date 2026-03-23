import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

export interface SupportStatItem {
  label: string;
  value: number | string;
  valueClassName?: string;
}

interface SupportStatsCardsProps {
  items: SupportStatItem[];
}

export function SupportStatsCards({ items }: SupportStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="rounded-3xl border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p
              className={`mt-2 text-3xl font-bold text-slate-900 ${
                item.valueClassName ?? ""
              }`}
            >
              {item.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}