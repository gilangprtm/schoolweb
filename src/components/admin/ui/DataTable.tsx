"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react"

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
  pageSize?: number
}

export function DataTable<T>({
  columns, data, onRowClick, emptyMessage = "Tidak ada data", pageSize = 10,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)

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

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card py-16 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground ${
                    col.sortable ? "cursor-pointer select-none hover:text-foreground transition-colors" : ""
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      sortKey === col.key
                        ? (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)
                        : <ChevronsUpDown className="h-3 w-3 text-muted-foreground/30" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.map((item, i) => (
              <tr
                key={i}
                className={`${onRowClick ? "cursor-pointer" : ""} hover:bg-muted/20 transition-colors`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-foreground/80">
                    {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Menampilkan {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, sorted.length)} dari {sorted.length} data
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...")
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`e${i}`} className="w-8 h-8 inline-flex items-center justify-center text-xs text-muted-foreground">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      safePage === p
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}