"use client";

import { useRef, useState, type DragEvent } from "react";
import { T } from "@/lib/i18n";

export function Dropzone({
  onFiles,
}: {
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const depth = useRef(0);

  function take(files: FileList | File[] | null) {
    if (!files || files.length === 0) return;
    onFiles(Array.from(files));
  }

  function enter(e: DragEvent) {
    e.preventDefault();
    depth.current += 1;
    setDrag(true);
  }
  function leave(e: DragEvent) {
    e.preventDefault();
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) setDrag(false);
  }
  function over(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }
  function drop(e: DragEvent) {
    e.preventDefault();
    depth.current = 0;
    setDrag(false);
    take(e.dataTransfer.files);
  }

  return (
    <div
      className={`dropzone${drag ? " drag" : ""}`}
      onClick={(e) => {
        if (e.target === inputRef.current) return;
        inputRef.current?.click();
      }}
      onDragEnter={enter}
      onDragLeave={leave}
      onDragOver={over}
      onDrop={drop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".xlsx,.xls,.csv,.pdf,.zip,.png,.jpg,.jpeg,.tif,.tiff,.heic,.webp"
        onChange={(e) => {
          take(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="dropzone-title">
        {drag
          ? <T en="Drop to score and post" th="วางเพื่อให้คะแนนและบันทึก" />
          : <T en="Drop files here, or click to browse" th="ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือก" />}
      </div>
      <p className="dropzone-hint">
        <T
          en="TB, GL, FAR, WHT, invoices, payroll, PND50/PND51. CSV trial balances and WHT lists are parsed into mapping and the certificate matcher. Weak scans score below the evidence floor."
          th="งบทดลอง บัญชีแยกประเภท ทะเบียนสินทรัพย์ หนังสือรับรอง ใบกำกับ เงินเดือน ภ.ง.ด.50/51 ไฟล์ CSV จะถูกถอดเข้าการจับคู่และระบบหนังสือรับรอง สแกนคุณภาพต่ำจะได้คะแนนต่ำกว่าเกณฑ์"
        />
      </p>
    </div>
  );
}
