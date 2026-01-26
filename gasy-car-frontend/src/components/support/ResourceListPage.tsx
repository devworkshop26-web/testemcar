"use client";

import { ReactNode, useMemo, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

type Column = {
  key: string;
  header: string;
  render?: (row: any) => ReactNode;
};

interface ResourceListPageProps {
  title: string;
  description?: string;
  createLabel?: string;
  columns: Column[];
  data: any[];
  onCreateClick?: () => void;
  onEditRow?: (row: any) => void;
  onDeleteRow?: (row: any) => void;
}

export function ResourceListPage({
  title,
  description,
  createLabel,
  columns,
  data,
  onCreateClick,
  onEditRow,
  onDeleteRow,
}: ResourceListPageProps) {
  const [query, setQuery] = useState("");

  const hasActions = Boolean(onEditRow || onDeleteRow);

  const filteredData = useMemo(() => {
    if (!query.trim()) return data;
    const lower = query.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lower),
      ),
    );
  }, [data, query]);

  return (
    <section className="w-full space-y-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-gray-500 sm:text-base">
              {description}
            </p>
          )}
        </div>

        {createLabel && (
          <button
            type="button"
            onClick={onCreateClick}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
          >
            <Plus className="h-4 w-4" />
            <span>{createLabel}</span>
          </button>
        )}
      </div>

      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <p className="text-xs text-gray-400 sm:text-sm">
            {filteredData.length} élément(s) affiché(s)
          </p>
        </div>

        {/* MOBILE */}
        <div className="space-y-3 sm:hidden">
          {filteredData.map((row, idx) => (
            <div
              key={row.id ?? idx}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm"
            >
              <div className="grid grid-cols-1 gap-3">
                {columns.map((col) => (
                  <div key={col.key}>
                    <span className="text-xs font-semibold uppercase text-gray-500">
                      {col.header}
                    </span>
                    <div className="text-sm text-gray-800">
                      {col.render ? col.render(row) : String(row[col.key])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {col.header}
                  </th>
                ))}

                {hasActions && (
                  <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredData.map((row, idx) => (
                <tr key={row.id ?? idx} className="hover:bg-gray-50/60">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="whitespace-nowrap px-3 py-3 text-gray-700"
                    >
                      {col.render ? col.render(row) : String(row[col.key])}
                    </td>
                  ))}

                  {hasActions && (
                    <td className="px-3 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-900"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          {onEditRow && (
                            <DropdownMenuItem onClick={() => onEditRow(row)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                          )}

                          {onDeleteRow && (
                            <DropdownMenuItem
                              onClick={() => onDeleteRow(row)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
