"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { LangToggle } from "@/components/LangToggle";
import { statusCls } from "@/components/PageHead";
import { T } from "@/lib/i18n";
import { F, pct } from "@/lib/format";
import {
  formatHostWhen,
  hostRemaining,
  hostStatus,
} from "@/lib/hostReview";

export default function HostedReviewPage() {
  const { token } = useParams<{ token: string }>();
  const { ready, hostReviews, bumpHostView, addHostNote, lang } = useStore();
  const row = hostReviews.find((r) => r.token === token);
  const status = row ? hostStatus(row) : null;
  const bumped = useRef(false);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!ready || !row || bumped.current) return;
    if (hostStatus(row) !== "live") return;
    bumped.current = true;
    bumpHostView(row.token);
  }, [ready, row, bumpHostView]);

  function onNote(e: FormEvent) {
    e.preventDefault();
    if (!row) return;
    const ok = addHostNote(row.token, note, "Guest reviewer");
    if (ok) {
      setNote("");
      setSaved(true);
    }
  }

  if (!ready) {
    return <div className="host-guest" />;
  }

  if (!row) {
    return (
      <div className="host-guest">
        <header className="host-guest-bar">
          <Link href="/" className="login-mark" style={{ fontSize: 28 }}>CIT24<span /></Link>
          <LangToggle />
        </header>
        <main className="host-guest-body">
          <h1><T en="Review link not on this device" th="ไม่พบลิงก์สอบทานบนเครื่องนี้" /></h1>
          <p className="text-muted" style={{ fontSize: 15, lineHeight: 1.65, maxWidth: 520 }}>
            <T
              en="CIT24 stores hosted review packs in this browser. Ask the issuer to open the same workspace, or generate a new 3-day link from Hosted review."
              th="CIT24 เก็บแพ็กสอบทานโฮสต์ในเบราว์เซอร์นี้ ให้ผู้ออกเปิดพื้นที่ทำงานเดียวกัน หรือสร้างลิงก์ 3 วันใหม่จากหน้าลิงก์สอบทานโฮสต์"
            />
          </p>
        </main>
      </div>
    );
  }

  if (status !== "live") {
    return (
      <div className="host-guest">
        <header className="host-guest-bar">
          <div className="login-mark" style={{ fontSize: 28 }}>CIT24<span /></div>
          <LangToggle />
        </header>
        <main className="host-guest-body">
          <div className="login-kicker-ghost">{row.token}</div>
          <h1>
            {status === "revoked"
              ? <T en="This review link was revoked" th="ลิงก์สอบทานนี้ถูกเพิกถอนแล้ว" />
              : <T en="This review link has expired" th="ลิงก์สอบทานนี้หมดอายุแล้ว" />}
          </h1>
          <p className="text-muted" style={{ fontSize: 15, lineHeight: 1.65, maxWidth: 520 }}>
            <T
              en={`Issued ${formatHostWhen(row.createdAt)} · expired ${formatHostWhen(row.expiresAt)}. Ask the issuer to generate a new 3-day hosted review.`}
              th={`ออกเมื่อ ${formatHostWhen(row.createdAt)} · หมดอายุ ${formatHostWhen(row.expiresAt)} ให้ผู้ออกสร้างลิงก์สอบทานโฮสต์ 3 วันใหม่`}
            />
          </p>
        </main>
      </div>
    );
  }

  const remain = hostRemaining(row);
  const brief = lang === "th" ? row.pack.briefTh : row.pack.briefEn;
  const entity = lang === "th" ? row.entityTh : row.entity;

  return (
    <div className="host-guest">
      <header className="host-guest-bar">
        <div>
          <div className="login-mark" style={{ fontSize: 28 }}>CIT24<span /></div>
          <div className="login-kicker-ghost" style={{ marginTop: 8 }}>
            <T en="Hosted 3-day review" th="การสอบทานโฮสต์ 3 วัน" />
          </div>
        </div>
        <LangToggle />
      </header>

      <main className="host-guest-body">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ marginBottom: 6 }}>{entity}</h1>
            <p className="text-muted" style={{ fontSize: 13 }}>
              {row.tin} · {row.period} · {row.token} · <T en={`expires in ${remain.label}`} th={`หมดอายุใน ${remain.label}`} />
            </p>
          </div>
          <span className="tag tag-accent"><T en={`${row.days}-day link · live`} th={`ลิงก์ ${row.days} วัน · ใช้งาน`} /></span>
        </div>

        <div className="stat-row" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginTop: 24 }}>
          <div className="stat-cell">
            <div className="stat-label"><T en="Current tax" th="ภาษีงวดปัจจุบัน" /></div>
            <div className="stat-val" style={{ fontSize: 22 }}>{F(row.pack.currentTax)}</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label"><T en="Taxable profit" th="กำไรสุทธิทางภาษี" /></div>
            <div className="stat-val" style={{ fontSize: 22 }}>{F(row.pack.taxableProfit)}</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">ETR</div>
            <div className="stat-val" style={{ fontSize: 22 }}>{pct(row.pack.etr)}</div>
            <div className="stat-hint"><T en="Current tax ÷ PBT" th="ภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษี" /></div>
          </div>
          <div className="stat-cell">
            <div className="stat-label"><T en="Payable" th="ยอดที่ต้องชำระ" /></div>
            <div className="stat-val" style={{ fontSize: 22 }}>{F(row.pack.payable)}</div>
          </div>
        </div>

        <p className="callout" style={{ fontSize: 14, lineHeight: 1.7, marginTop: 20 }}>{brief}</p>

        <div className="split-wide" style={{ marginTop: 8, borderTop: "2px solid var(--color-divider)" }}>
          <section className="col-pad border-r">
            <h5 className="sec-h"><T en="Material items still open" th="รายการสาระสำคัญที่ยังเปิด" /></h5>
            {row.pack.materialOpen.length === 0 ? (
              <p className="text-muted" style={{ fontSize: 13 }}><T en="No material items remain open in this snapshot." th="ไม่มีรายการสาระสำคัญค้างในสแนปช็อตนี้" /></p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th><T en="Item" th="รายการ" /></th>
                      <th className="num">THB</th>
                      <th><T en="Status" th="สถานะ" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {row.pack.materialOpen.map((a) => (
                      <tr key={a.id}>
                        <td className="mono" style={{ fontSize: 11, fontWeight: 800 }}>{a.id}</td>
                        <td style={{ fontSize: 13 }}>{a.name}</td>
                        <td className="num">{F(a.amt)}</td>
                        <td><span className={statusCls(a.status)}>{a.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <h5 className="sec-h" style={{ marginTop: 24 }}><T en="Reviewer notes" th="บันทึกผู้สอบทาน" /></h5>
            {row.notes.length === 0 && (
              <p className="text-muted" style={{ fontSize: 13 }}><T en="No notes on this pack yet." th="ยังไม่มีบันทึกบนแพ็กนี้" /></p>
            )}
            {row.notes.map((n, i) => (
              <div key={`${n.when}-${i}`} className="callout" style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700 }}>{n.who} · {formatHostWhen(n.when)}</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>{n.text}</div>
              </div>
            ))}
            <form onSubmit={onNote} style={{ marginTop: 12 }}>
              <div className="field">
                <label><T en="Add a review note" th="เพิ่มบันทึกสอบทาน" /></label>
                <textarea className="input" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary"><T en="Record note" th="บันทึก" /></button>
              {saved && <span className="text-muted" style={{ fontSize: 12, marginLeft: 10 }}><T en="Note stored on this pack." th="บันทึกแล้วบนแพ็กนี้" /></span>}
            </form>
          </section>
          <aside className="col-aside">
            <h5 className="sec-h"><T en="Completeness" th="ความครบถ้วน" /></h5>
            {row.pack.checks.map((c) => (
              <div key={c.id} className="wf-row">
                <span>{lang === "th" ? c.th : c.en}</span>
                <span className={c.ok ? "tag tag-neutral" : "tag tag-outline"}>{c.ok ? <T en="Done" th="ครบ" /> : <T en="Open" th="ยังเปิด" />}</span>
              </div>
            ))}
            <div className="callout" style={{ fontSize: 12, marginTop: 16, lineHeight: 1.65 }}>
              <T
                en={`Watermarked guest view · issued by ${row.actor} (${row.role}) for ${row.recipient}. ${row.views} recorded open${row.views === 1 ? "" : "s"}. This page does not approve, post or file.`}
                th={`มุมมองผู้รับมีลายน้ำ · ออกโดย ${row.actor} (${row.role}) สำหรับ ${row.recipient} บันทึกการเปิด ${row.views} ครั้ง หน้านี้ไม่อนุมัติ บันทึก หรือยื่นแบบ`}
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
