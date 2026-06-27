"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"

export interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  emptyMessage?: string
}

export function DataTable<T>({
  columns, data, onRowClick, emptyMessage = "Tidak ada data",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = String((a as Record<string, unknown>)[sortKey] ?? "")
        const bv = String((b as Record<string, unknown>)[sortKey] ?? "")
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
      })
    : data

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white py-16 text-center">
        <p className="text-sm text-neutral-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 ${
                  col.sortable ? "cursor-pointer select-none hover:text-neutral-700" : ""
                }`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    sortKey === col.key
                      ? (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)
                      : <ChevronsUpDown className="h-3 w-3 text-neutral-300" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {sorted.map((item, i) => (
            <tr
              key={i}
              className={`${onRowClick ? "cursor-pointer" : ""} hover:bg-neutral-50 transition-colors`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-neutral-700">
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
