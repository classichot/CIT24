"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CHECKS, type Lang } from "@/lib/model";
import { evaluatePack, kindLabel, type IngestedFile } from "@/lib/ingest";
import { useStore } from "@/lib/store";
import { PageHead, statusCls } from "@/components/PageHead";
import { FlowBar } from "@/components/FlowBar";
import { Dropzone } from "@/components/Dropzone";
import { T, pnd } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function DataPage() {
  const { files, ingestFiles, addJulyGl, unmapped, mappedCount, acceptMap, changeMap, ask, lang, certs, matchCert, unmatchCert, whtCredit, whtUnmatched, mappingLocked, runDetection, detections } = useStore();
  const pack = useMemo(() => evaluatePack(files), [files]);
  const [sel, setSel] = useState<string | null>(null);
  const selected = files.find((f) => f.id === sel) ?? files.find((f) => !f.loadedOk) ?? files[0];
  const july = files.some((f) => f.name.includes("Jul.csv"));
  const requiredReady = pack.requiredOk === pack.requiredTotal;

  return (
    <div>
      <FlowBar />
      <PageHead
        kickerEn="Step 1 · ingestion & mapping"
        kickerTh="ขั้นตอน 1 · นำเข้าและจับคู่ผังบัญชี"
        titleEn="Data & mapping"
        titleTh="ข้อมูลและการจับคู่ผังบัญชี"
        subEn="Drop the close pack. CIT24 classifies each file, scores it, and blocks posting until required evidence is loaded properly."
        subTh="วางชุดปิดภาษี CIT24 จะจัดประเภท ให้คะแนน และไม่บันทึกลงการคำนวณจนกว่าหลักฐานที่จำเป็นจะถูกนำเข้าอย่างถูกต้อง"
        actions={
          <>
            <button className="btn btn-secondary" onClick={runDetection}><T en="Run AI detection" th="ให้ AI ตรวจหารายการ" /></button>
            <button className="btn btn-secondary" onClick={addJulyGl}><T en="Ingest July GL" th="นำเข้าบัญชีแยกประเภท ก.ค." /></button>
            <Link href="/ledger" className={`btn ${requiredReady ? "btn-primary" : "btn-secondary"}`}>
              {requiredReady
                ? <T en="Continue to ledger" th="ไปยังทะเบียนรายการ" />
                : <T en="Continue with exceptions" th="ไปต่อพร้อมข้อยกเว้น" />}
            </Link>
          </>
        }
      />

      <div className="stat-row" style={{ gridTemplateColumns: "repeat(4, 1fr)", borderTop: "2px solid var(--color-divider)" }}>
        <div className="stat-cell">
          <div className="stat-label"><T en="Evidence pack score" th="คะแนนชุดหลักฐาน" /></div>
          <div className="stat-val" style={{ fontSize: 26, color: pack.packScore < 70 ? "var(--color-accent)" : undefined }}>{pack.packScore}</div>
          <div className="stat-hint"><T en="Required 80% · recommended 20%" th="จำเป็น 80% · แนะนำ 20%" /></div>
          <div className="bar-track" style={{ marginTop: 8 }}><div className="bar-fill" style={{ width: `${pack.packScore}%` }} /></div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Required documents" th="เอกสารที่จำเป็น" /></div>
          <div className="stat-val" style={{ fontSize: 26, color: requiredReady ? undefined : "var(--color-accent)" }}>{pack.requiredOk}/{pack.requiredTotal}</div>
          <div className="stat-hint">
            {requiredReady
              ? <T en="Loaded properly (score ≥ 70)" th="นำเข้าถูกต้อง (คะแนน ≥ 70)" />
              : <T en="Missing or below the evidence floor" th="ขาดหรือต่ำกว่าเกณฑ์หลักฐาน" />}
          </div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Accounts mapped" th="บัญชีที่จับคู่แล้ว" /></div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
            <div className="stat-val" style={{ fontSize: 26 }}>{mappedCount}</div>
            <div className="text-muted" style={{ fontSize: 13 }}>/ 428 · {Math.round(mappedCount / 428 * 100)}%</div>
          </div>
          <div className="bar-track" style={{ marginTop: 8 }}><div className="bar-fill" style={{ width: `${mappedCount / 428 * 100}%` }} /></div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="GL lines ingested" th="รายการที่นำเข้า" /></div>
          <div className="stat-val" style={{ fontSize: 26 }}>{july ? "215,847" : "184,392"}</div>
          <div className="stat-hint">{july ? "Jan–Jul 2026 · control totals matched" : "Jan–Jun 2026 · control totals matched"}</div>
        </div>
      </div>

      {!requiredReady && (
        <div className="callout" style={{ margin: "16px 0 0", fontSize: 13 }}>
          <strong><T en="Required pack is not ready." th="ชุดเอกสารที่จำเป็นยังไม่พร้อม" /></strong>{" "}
          {pack.blocking.map((b) => lang === "th" ? b.th : b.en).join(" · ")}
        </div>
      )}

      <div className="split-wide">
        <div>
          <section className="col-pad border-r" style={{ paddingBottom: 20 }}>
            <h5 className="sec-h"><T en="Drop and score" th="วางแล้วให้คะแนน" /></h5>
            <div style={{ marginBottom: 16 }}>
              <Dropzone onFiles={ingestFiles} />
            </div>

            <h5 className="sec-h"><T en="Required document check" th="ตรวจเอกสารที่จำเป็น" /></h5>
            <div className="text-muted" style={{ fontSize: 12, marginBottom: 10, lineHeight: 1.5 }}>
              <T en="A document is loaded properly only when it is present, classified, scored ≥ 70, extraction ≥ 0.85, and not a duplicate." th="เอกสารถือว่านำเข้าถูกต้องเมื่อมีไฟล์ จัดประเภทแล้ว คะแนน ≥ 70 ความเชื่อมั่น ≥ 0.85 และไม่ซ้ำ" />
            </div>
            <div className="doc-grid">
              {pack.slots.filter((s) => s.req.level !== "supporting").map((s) => (
                <div key={s.req.kind} className={`doc-slot${s.loadedOk ? " ok" : " fail"}`}>
                  <div className="slot-kicker">{s.req.level === "required" ? <T en="Required" th="จำเป็น" /> : <T en="Recommended" th="แนะนำ" />}</div>
                  <div className="slot-name">{lang === "th" ? s.req.th : s.req.en}</div>
                  <div className="slot-meta">
                    <span className="text-muted">
                      {s.missing
                        ? <T en="Not loaded" th="ยังไม่มี" />
                        : s.loadedOk
                          ? (s.best?.name ?? "")
                          : <T en="Loaded — quality fail" th="มีไฟล์ — คุณภาพไม่ผ่าน" />}
                    </span>
                    <span className={`score-num${s.best && s.best.score < 70 ? " low" : ""}`}>{s.best ? s.best.score : "—"}</span>
                  </div>
                </div>
              ))}
            </div>

            <h5 className="sec-h"><T en="Ingested sources" th="แหล่งข้อมูลที่นำเข้า" /></h5>
            <div className="table-wrap">
              <table className="table">
              <thead>
                <tr>
                  <th style={{ width: "28%" }}><T en="File" th="ไฟล์" /></th>
                  <th><T en="Type" th="ประเภท" /></th>
                  <th><T en="Period" th="รอบ" /></th>
                  <th className="num"><T en="Score" th="คะแนน" /></th>
                  <th className="num"><T en="Extraction" th="ความเชื่อมั่น" /></th>
                  <th><T en="Status" th="สถานะ" /></th>
                </tr>
              </thead>
              <tbody>
                {files.map((fl) => (
                  <tr
                    key={fl.id}
                    className="clickable"
                    onClick={() => setSel(fl.id)}
                    style={{ background: selected?.id === fl.id ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : undefined }}
                  >
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{fl.name}</td>
                    <td style={{ fontSize: 12 }}>{pnd(lang, kindLabel(fl.kind, lang))}</td>
                    <td style={{ fontSize: 12 }}>{fl.period}</td>
                    <td className="num"><span className={`score-num${fl.score < 70 ? " low" : ""}`}>{fl.score}</span></td>
                    <td className="num" style={{ color: fl.conf < 0.85 ? "var(--color-accent)" : "inherit" }}>{fl.conf.toFixed(2)}</td>
                    <td><span className={statusCls(fl.loadedOk ? fl.status : fl.duplicate ? "Duplicate" : "Quality fail")}>{fl.loadedOk ? fl.status : fl.duplicate ? "Duplicate" : "Quality fail"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            {selected && <FileScoreDetail file={selected} lang={lang} />}
          </section>
          <section className="col-pad border-r" style={{ paddingBottom: 20 }}>
            <h5 className="sec-h"><T en="Withholding-tax credit matching" th="จับคู่เครดิตภาษีหัก ณ ที่จ่าย" /></h5>
            <p className="text-muted" style={{ fontSize: 12, marginBottom: 10 }}>
              <T en="Matched certificates update the PND50 withholding credit in the deterministic engine. Unmatched amounts stay out of payable." th="หนังสือรับรองที่จับคู่แล้วจะอัปเดตเครดิตหัก ณ ที่จ่ายใน ภ.ง.ด.50 ผ่านเครื่องคำนวณ จำนวนที่ยังไม่จับคู่จะไม่เข้ายอดชำระ" />
            </p>
            <div className="stat-row" style={{ gridTemplateColumns: "1fr 1fr 1fr", borderTop: "2px solid var(--color-divider)", marginBottom: 12 }}>
              <div className="stat-cell"><div className="stat-label"><T en="Matched credit" th="เครดิตที่จับคู่แล้ว" /></div><div className="stat-val" style={{ fontSize: 22 }}>{F(whtCredit)}</div></div>
              <div className="stat-cell"><div className="stat-label"><T en="Unmatched" th="ยังไม่จับคู่" /></div><div className="stat-val" style={{ fontSize: 22, color: whtUnmatched ? "var(--color-accent)" : undefined }}>{F(whtUnmatched)}</div></div>
              <div className="stat-cell"><div className="stat-label"><T en="Certificates" th="หนังสือรับรอง" /></div><div className="stat-val" style={{ fontSize: 22 }}>{certs.filter((c) => c.matched).length}/{certs.length}</div></div>
            </div>
            <div className="table-wrap">
              <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th><T en="Payer" th="ผู้จ่าย" /></th>
                  <th><T en="Date" th="วันที่" /></th>
                  <th className="num">THB</th>
                  <th>GL</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {certs.map((c) => (
                  <tr key={c.id}>
                    <td className="mono" style={{ fontSize: 12, fontWeight: 800 }}>{c.id}</td>
                    <td style={{ fontSize: 13 }}>{c.payer}</td>
                    <td style={{ fontSize: 12 }}>{c.date}</td>
                    <td className="num">{F(c.amount)}</td>
                    <td style={{ fontSize: 12 }}>{c.gl ?? "—"}</td>
                    <td>
                      {c.matched
                        ? <button className="btn btn-ghost" style={{ fontSize: 12, padding: "4px 8px" }} onClick={() => unmatchCert(c.id)}><T en="Unmatch" th="ยกเลิกการจับคู่" /></button>
                        : <button className="btn btn-primary" style={{ fontSize: 12, padding: "4px 8px" }} onClick={() => matchCert(c.id)}><T en="Match to GL" th="จับคู่บัญชี" /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </section>
          <section style={{ padding: "4px 0 40px" }}>
            <h5 className="sec-h"><T en="Data-quality controls" th="การควบคุมคุณภาพข้อมูล" /></h5>
            <div className="table-wrap">
              <table className="table">
              <thead>
                <tr>
                  <th style={{ width: "30%" }}><T en="Control" th="การควบคุม" /></th>
                  <th><T en="Finding" th="ผลการตรวจ" /></th>
                  <th className="num"><T en="Exception (THB)" th="ผลต่าง (บาท)" /></th>
                  <th><T en="Result" th="ผล" /></th>
                </tr>
              </thead>
              <tbody>
                {CHECKS.map((ck) => (
                  <tr key={ck.name}>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{ck.name}</td>
                    <td className="text-muted" style={{ fontSize: 12 }}>{ck.detail}</td>
                    <td className="num">{ck.amt ? F(ck.amt) : "—"}</td>
                    <td><span className={statusCls(ck.result)}>{ck.result}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <div className="text-muted" style={{ fontSize: 11, marginTop: 10, maxWidth: "60ch", lineHeight: 1.6 }}>
              <T en="Nothing posts to the tax computation until every control is passed or a documented exception is accepted by the reviewer." th="ไม่มีข้อมูลใดเข้าสู่การคำนวณภาษีจนกว่าการควบคุมทุกข้อจะผ่าน หรือผู้สอบทานยอมรับข้อยกเว้นที่มีเอกสารรองรับ" />
            </div>
          </section>
        </div>
        <aside className="col-aside">
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
            <h5 className="sec-h" style={{ margin: 0, color: "var(--color-accent)" }}><T en="Mapping assistant" th="ผู้ช่วยจับคู่ผังบัญชี" /></h5>
            <span className="tag tag-neutral">AI</span>
          </div>
          <div className="text-muted" style={{ fontSize: 11, lineHeight: 1.5, marginBottom: 12 }}>
            <T en="Suggestions reuse last year's approved mapping. Accepting writes to mapping history; the tax result is still calculated by the rule engine." th="ข้อเสนอแนะอ้างอิงการจับคู่ที่อนุมัติในปีก่อน การยอมรับจะบันทึกในประวัติ ผลทางภาษียังคำนวณโดยเครื่องกฎ" />
          </div>
          <div style={{ borderTop: "2px solid var(--color-divider)" }}>
            {unmapped.map((u) => (
              <div key={u.code} style={{ padding: "12px 0", borderBottom: "1px solid var(--color-divider)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>{u.code}</div>
                  <span className="tag tag-neutral">{u.tag}</span>
                </div>
                <div style={{ fontSize: 12, marginTop: 2 }}>{lang === "th" ? u.nameTh : u.name}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginTop: 6, background: "var(--color-surface)", padding: "7px 9px" }}>
                  <div style={{ fontSize: 12, flex: 1 }}>{u.suggestion}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, flex: "none" }}>{u.conf.toFixed(2)}</div>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <button className="btn btn-primary" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => acceptMap(u.code)}><T en="Accept" th="ยอมรับ" /></button>
                  <button className="btn btn-secondary" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => changeMap(u.code, u.tag === "Permanent" ? "Temporary" : "Permanent")}><T en="Retag P/T" th="สลับ ถาวร/ชั่วคราว" /></button>
                  <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => ask(`How should account ${u.code} be mapped?`)}><T en="Ask CIT24" th="ถาม CIT24" /></button>
                </div>
              </div>
            ))}
          </div>
          {detections.length > 0 && (
            <div className="callout" style={{ marginTop: 14, fontSize: 12 }}>
              <T en="AI queued" th="AI เสนอ" /> {detections.length} <T en="draft adjustments — open mapping to accept." th="รายการร่าง — เปิดหน้าจับคู่เพื่อยอมรับ" />
            </div>
          )}
          {mappingLocked && (
            <div className="callout" style={{ marginTop: 14, fontSize: 12 }}><T en="Mapping is locked for FY2026." th="การจับคู่ถูกล็อกสำหรับปี 2569" /></div>
          )}
        </aside>
      </div>
    </div>
  );
}

function FileScoreDetail({ file, lang }: { file: IngestedFile; lang: Lang }) {
  return (
    <div className="callout" style={{ marginTop: 14, fontSize: 13 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
        <strong>{file.name}</strong>
        <span className={`score-num${file.score < 70 ? " low" : ""}`}>{file.score}/100</span>
      </div>
      <div className="text-muted" style={{ fontSize: 12, marginTop: 4 }}>
        {pnd(lang, kindLabel(file.kind, lang))} · {file.size} · {file.period}
      </div>
      <ul style={{ margin: "8px 0 0", paddingLeft: 18, lineHeight: 1.55 }}>
        {file.issues.length
          ? file.issues.map((i) => <li key={i.en}>{lang === "th" ? i.th : i.en}</li>)
          : <li><T en="No exceptions — eligible to post after reviewer acceptance." th="ไม่มีข้อยกเว้น — พร้อมบันทึกเมื่อผู้สอบทานยอมรับ" /></li>}
      </ul>
    </div>
  );
}
