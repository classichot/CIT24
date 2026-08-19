"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

const MIN_COL = 72;
const STORAGE_PREFIX = "cit24.table.cols.";

function readStored(key: string | undefined, count: number): number[] | null {
  if (!key || typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== count) return null;
    if (!parsed.every((n) => typeof n === "number" && Number.isFinite(n))) return null;
    return parsed.map((n) => Math.max(MIN_COL, n as number));
  } catch {
    return null;
  }
}

export function ResizableTable({
  columns,
  rows,
  storageKey,
  thClassName,
  tdClassName,
  tdStyle,
}: {
  columns: string[];
  rows: string[][];
  storageKey?: string;
  thClassName?: (col: string, index: number) => string | undefined;
  tdClassName?: (cell: string, rowIndex: number, colIndex: number) => string | undefined;
  tdStyle?: (cell: string, rowIndex: number, colIndex: number) => CSSProperties | undefined;
}) {
  const tableRef = useRef<HTMLTableElement>(null);
  const dragRef = useRef<{ index: number; startX: number; startWidths: number[] } | null>(null);
  const widthsRef = useRef<number[] | null>(null);
  const [widths, setWidths] = useState<number[] | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  widthsRef.current = widths;

  useEffect(() => {
    setWidths(readStored(storageKey, columns.length));
  }, [storageKey, columns.length]);

  function persist(next: number[]) {
    if (!storageKey) return;
    try {
      window.localStorage.setItem(STORAGE_PREFIX + storageKey, JSON.stringify(next));
    } catch {
      /* quota / private mode */
    }
  }

  function measure(): number[] {
    const table = tableRef.current;
    const ths = table?.querySelectorAll("thead th");
    if (!ths?.length) return columns.map(() => MIN_COL);
    return Array.from(ths).map((th) => Math.max(MIN_COL, th.getBoundingClientRect().width));
  }

  function onPointerDown(index: number, e: PointerEvent<HTMLButtonElement>) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const startWidths = widthsRef.current ?? measure();
    dragRef.current = { index, startX: e.clientX, startWidths };
    widthsRef.current = startWidths;
    setWidths(startWidths);
    setDragging(index);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const next = drag.startWidths.slice();
    next[drag.index] = Math.max(MIN_COL, drag.startWidths[drag.index] + (e.clientX - drag.startX));
    widthsRef.current = next;
    setWidths(next);
  }

  function endDrag(e: PointerEvent<HTMLButtonElement>) {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const next = widthsRef.current;
    if (next) persist(next);
  }

  const tableWidth = widths?.reduce((sum, w) => sum + w, 0);

  return (
    <div className={`table-resize-wrap${dragging !== null ? " is-col-resizing" : ""}`}>
      <table
        ref={tableRef}
        className="table table-resizable"
        style={tableWidth ? { tableLayout: "fixed", width: tableWidth } : undefined}
      >
        {widths && (
          <colgroup>
            {widths.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
        )}
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={thClassName?.(col, i)} style={widths ? { width: widths[i] } : undefined}>
                <span className="th-label">{col}</span>
                <button
                  type="button"
                  className={`col-resizer no-print${dragging === i ? " active" : ""}`}
                  aria-label={`Resize ${col} column`}
                  title="Drag to resize column"
                  onPointerDown={(e) => onPointerDown(i, e)}
                  onPointerMove={onPointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className={tdClassName?.(cell, i, j)} style={tdStyle?.(cell, i, j)}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
