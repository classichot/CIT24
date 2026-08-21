"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { PageHead, statusCls } from "@/components/PageHead";
import { T } from "@/lib/i18n";
import { F, pct } from "@/lib/format";
import {
  HOST_DAY_PRESETS,
  HOST_DAYS_DEFAULT,
  HOST_DAYS_MAX,
  HOST_DAYS_MIN,
  HOST_PURPOSES,
  clampHostDays,
  formatHostWhen,
  hostAbsUrl,
  hostPath,
  hostRemaining,
  hostStatus,
  type HostPurpose,
  type HostReview,
} from "@/lib/hostReview";

function statusTag(row: HostReview) {
  const s = hostStatus(row);
  if (s === "live") return <span className="tag tag-accent"><T en="Live" th="ใช้งาน" /></span>;
  if (s === "expired") return <span className="tag tag-outline"><T en="Expired" th="หมดอายุ" /></span>;
  return <span className="tag tag-signal"><T en="Revoked" th="เพิกถอน" /></span>;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function HostPage() {
  const { hostReviews, generateHostReview, revokeHostReview, flash, actor, clients, clientId } = useStore();
  const client = clients.find((c) => c.id === clientId) ?? clients[0];
  const [recipient, setRecipient] = useState("audit.partner@sgv.co.th");
  const [purpose, setPurpose] = useState<HostPurpose>("reviewer");
  const [days, setDays] = useState(HOST_DAYS_DEFAULT);
  const [issued, setIssued] = useState<HostReview | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const live = hostReviews.filter((r) => hostStatus(r) === "live").length;
  const views = hostReviews.reduce((s, r) => s + r.views, 0);

  function onGenerate(e: FormEvent) {
    e.preventDefault();
    const row = generateHostReview({ recipient, purpose, days: clampHostDays(days) });
    if (row) setIssued(row);
  }

  return (
    <div>
      <PageHead
        kickerEn="Controlled share · 3-day default"
        kickerTh="แบ่งปันแบบควบคุม · ค่าเริ่มต้น 3 วัน"
        titleEn="Hosted review"
        titleTh="ลิงก์สอบทานโฮสต์"
        subEn="Generate a frozen tax-close snapshot and issue a guest link. Default life is 3 days. The engine does not recompute on the hosted page."
        subTh="สร้างสแนปช็อตปิดภาษีแล้วออกลิงก์ผู้รับ ค่าเริ่มต้น 3 วัน เครื่องคำนวณจะไม่คิดภาษีใหม่บนหน้าโฮสต์"
      />

      <div className="stat-row" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat-cell">
          <div className="stat-label"><T en="Live links" th="ลิงก์ที่ยังใช้ได้" /></div>
          <div className="stat-val" style={{ fontSize: 22 }}>{live}</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Issued" th="ที่ออกแล้ว" /></div>
          <div className="stat-val" style={{ fontSize: 22 }}>{hostReviews.length}</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Guest views" th="ครั้งที่เปิด" /></div>
          <div className="stat-val" style={{ fontSize: 22 }}>{views}</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Default life" th="อายุเริ่มต้น" /></div>
          <div className="stat-val" style={{ fontSize: 22 }}>3d</div>
        </div>
      </div>

      <div className="split-wide" style={{ borderTop: "2px solid var(--color-divider)" }}>
        <section className="col-pad border-r">
          <h5 className="sec-h"><T en="Generate review link" th="สร้างลิงก์สอบทาน" /></h5>
          <p className="text-muted" style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
            <T
              en={`${client.name} · ${client.period} · issued as ${actor.name}. The pack copies current tax, taxable profit, ETR (current tax ÷ PBT), open material items and completeness checks.`}
              th={`${client.nameTh} · ${client.period} · ออกในนาม ${actor.name} แพ็กคัดลอกภาษีงวดปัจจุบัน กำไรสุทธิทางภาษี ETR (ภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษี) รายการสาระสำคัญที่ยังเปิด และความครบถ้วน`}
            />
          </p>
          <form onSubmit={onGenerate}>
            <div className="field">
              <label><T en="Recipient email" th="อีเมลผู้รับ" /></label>
              <input className="input" type="email" required value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <div className="field">
              <label><T en="Reviewer role" th="บทบาทผู้สอบทาน" /></label>
              <select className="input" value={purpose} onChange={(e) => setPurpose(e.target.value as HostPurpose)}>
                {HOST_PURPOSES.map((p) => (
                  <option key={p.id} value={p.id}>{p.en} · {p.th}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label><T en="Link life (days)" th="อายุลิงก์ (วัน)" /></label>
              <div className="host-presets">
                {HOST_DAY_PRESETS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`btn${days === d ? " btn-primary" : " btn-secondary"}`}
                    onClick={() => setDays(d)}
                  >
                    {d === 3 ? <T en="3 days (default)" th="3 วัน (ค่าเริ่มต้น)" /> : <T en={`${d} day${d === 1 ? "" : "s"}`} th={`${d} วัน`} />}
                  </button>
                ))}
              </div>
              <div className="host-days-row">
                <input
                  className="range"
                  type="range"
                  min={HOST_DAYS_MIN}
                  max={HOST_DAYS_MAX}
                  step={1}
                  value={days}
                  onChange={(e) => setDays(clampHostDays(e.target.value))}
                  aria-label="Link life in days"
                />
                <input
                  className="input host-days-input"
                  type="number"
                  min={HOST_DAYS_MIN}
                  max={HOST_DAYS_MAX}
                  value={days}
                  onChange={(e) => setDays(clampHostDays(e.target.value))}
                />
              </div>
              <div className="text-muted" style={{ fontSize: 12, marginTop: 6 }}>
                <T en={`${HOST_DAYS_MIN}–${HOST_DAYS_MAX} days. Default ${HOST_DAYS_DEFAULT}.`} th={`${HOST_DAYS_MIN}–${HOST_DAYS_MAX} วัน ค่าเริ่มต้น ${HOST_DAYS_DEFAULT}`} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              <button type="submit" className="btn btn-start">
                <T en={`Generate ${days}-day review link`} th={`สร้างลิงก์สอบทาน ${days} วัน`} />
              </button>
              <Link href="/review" className="btn btn-ghost"><T en="Open review desk" th="เปิดโต๊ะสอบทาน" /></Link>
            </div>
          </form>

          {issued && (
            <div className="callout" style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em" }}>{issued.token}</div>
              <div style={{ fontSize: 13, marginTop: 6, wordBreak: "break-all" }}>{hostAbsUrl(issued.token)}</div>
              <div className="text-muted" style={{ fontSize: 12, marginTop: 6 }}>
                <T en={`Expires ${formatHostWhen(issued.expiresAt)} · ${hostRemaining(issued).label} remaining`} th={`หมดอายุ ${formatHostWhen(issued.expiresAt)} · เหลือ ${hostRemaining(issued).label}`} />
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={async () => {
                    const ok = await copyText(hostAbsUrl(issued.token));
                    flash(ok ? "Review URL copied" : hostAbsUrl(issued.token));
                  }}
                >
                  <T en="Copy URL" th="คัดลอก URL" />
                </button>
                <Link href={hostPath(issued.token)} className="btn btn-secondary" target="_blank">
                  <T en="Open hosted page" th="เปิดหน้าโฮสต์" />
                </Link>
              </div>
            </div>
          )}

          <div className="callout" style={{ marginTop: 20, fontSize: 13, lineHeight: 1.65 }}>
            <T
              en="The guest page is public on this origin and does not require a CIT24 login. The snapshot is stored in this browser. A recipient on another device will only see the pack if this workspace is the same origin and storage — this is a controlled-share prototype, not a hosted file server."
              th="หน้าผู้รับเป็นสาธารณะบนโดเมนนี้ ไม่ต้องเข้าสู่ระบบ CIT24 สแนปช็อตเก็บในเบราว์เซอร์นี้ ผู้รับบนเครื่องอื่นจะเห็นแพ็กได้เมื่อเป็นที่เก็บเดียวกัน — นี่คือต้นแบบการแบ่งปันแบบควบคุม ไม่ใช่เซิร์ฟเวอร์ไฟล์"
            />
          </div>
        </section>

        <aside className="col-aside">
          <h5 className="sec-h"><T en="Issued links" th="ลิงก์ที่ออกแล้ว" /></h5>
          {hostReviews.length === 0 ? (
            <p className="text-muted" style={{ fontSize: 13 }}><T en="No review links yet." th="ยังไม่มีลิงก์สอบทาน" /></p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th><T en="To" th="ถึง" /></th>
                    <th><T en="Life" th="อายุ" /></th>
                    <th><T en="Status" th="สถานะ" /></th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {hostReviews.map((r) => {
                    const liveRow = hostStatus(r) === "live";
                    return (
                      <tr key={r.token}>
                        <td className="mono" style={{ fontSize: 11, fontWeight: 800 }}>{r.token}</td>
                        <td style={{ fontSize: 12 }}>{r.recipient}</td>
                        <td style={{ fontSize: 12 }}>{liveRow ? hostRemaining(r).label : `${r.days}d`}</td>
                        <td>{statusTag(r)}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <Link href={hostPath(r.token)} className="btn btn-ghost" style={{ fontSize: 12, padding: "4px 8px" }} target="_blank"><T en="Open" th="เปิด" /></Link>
                            {liveRow && (
                              <button type="button" className="btn btn-ghost" style={{ fontSize: 12, padding: "4px 8px" }} onClick={() => revokeHostReview(r.token)}>
                                <T en="Revoke" th="เพิกถอน" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {issued && (
            <div style={{ marginTop: 20 }}>
              <h5 className="sec-h"><T en="Frozen pack" th="แพ็กที่แช่แข็ง" /></h5>
              <div className="wf-row"><span><T en="Current tax" th="ภาษีงวดปัจจุบัน" /></span><span>{F(issued.pack.currentTax)}</span></div>
              <div className="wf-row"><span><T en="Taxable profit" th="กำไรสุทธิทางภาษี" /></span><span>{F(issued.pack.taxableProfit)}</span></div>
              <div className="wf-row"><span>ETR</span><span>{pct(issued.pack.etr)}</span></div>
              <div className="wf-row"><span><T en="Open items" th="รายการยังเปิด" /></span><span>{issued.pack.openCount}</span></div>
              {issued.pack.materialOpen.map((a) => (
                <div key={a.id} className="stack-row" style={{ fontSize: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontWeight: 700 }}>{a.id}</span>
                    <span className={statusCls(a.status)}>{a.status}</span>
                  </div>
                  <div>{a.name} · {F(a.amt)}</div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
