"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EMPTY_DRAFT, ONBOARD_STEPS, PACK_DOCS, tinOk, type EngagementDraft } from "@/lib/onboard";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { T } from "@/lib/i18n";

export default function OnboardPage() {
  const { addEngagement, clients, clientId, lang } = useStore();
  const router = useRouter();
  const [draft, setDraft] = useState<EngagementDraft>(EMPTY_DRAFT);
  const [err, setErr] = useState("");
  const current = clients.find((c) => c.id === clientId);
  const justAdded = Boolean(current?.custom);

  function set<K extends keyof EngagementDraft>(k: K, v: EngagementDraft[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
    setErr("");
  }

  function submit() {
    if (!draft.name.trim()) {
      setErr("Legal name is required.");
      return;
    }
    if (!tinOk(draft.tin)) {
      setErr("TIN must be 13 digits.");
      return;
    }
    const id = addEngagement(draft);
    if (!id) return;
    setDraft(EMPTY_DRAFT);
    router.push("/data");
  }

  return (
    <div>
      <PageHead
        kickerEn="Advisory · client onboarding"
        kickerTh="ที่ปรึกษา · รับลูกค้าเข้าแพลตฟอร์ม"
        titleEn="Add a new engagement"
        titleTh="เพิ่มงานบริการลูกค้า"
        subEn="Capture identity and tax profile, then drop the close pack. The picture below is the whole path from first file to PND50."
        subTh="บันทึกตัวตนและโปรไฟล์ภาษี แล้ววางชุดปิดภาษี ภาพด้านล่างคือเส้นทางทั้งชุดจากไฟล์แรกถึง ภ.ง.ด.50"
        actions={
          <>
            <Link href="/clients" className="btn btn-secondary"><T en="Portfolio" th="พอร์ตลูกค้า" /></Link>
            <button className="btn btn-primary" onClick={submit}><T en="Create engagement" th="สร้างงานบริการ" /></button>
          </>
        }
      />

      {justAdded && current && (
        <div className="callout" style={{ marginTop: 16, fontSize: 13 }}>
          <strong>{current.name}</strong>{" "}
          <T en={`is open (TIN ${current.tin}). Drop the close pack next. The live calculation engine still uses the Siam Precision Parts demo ledger until this pack is posted.`} th={`เปิดอยู่ (เลขผู้เสียภาษี ${current.tin}) ขั้นถัดไปคือวางชุดปิดภาษี เครื่องคำนวณยังใช้ทะเบียนตัวอย่าง สยามพรีซิชั่น จนกว่าชุดนี้จะถูกบันทึก`} />
          {" "}<Link href="/data"><T en="Go to Data & mapping" th="ไปข้อมูลและการจับคู่" /> →</Link>
        </div>
      )}

      <h5 className="sec-h" style={{ marginTop: 20 }}><T en="The whole process" th="กระบวนการทั้งชุด" /></h5>
      <div className="onboard-map">
        {ONBOARD_STEPS.map((s) => (
          <Link key={s.id} href={s.href} className={`onboard-step${s.href === "/onboard" ? " on" : ""}`}>
            <div className="onboard-n">{s.n}</div>
            <div className="onboard-title"><T en={s.en} th={s.th} /></div>
            <div className="onboard-do"><T en={s.doEn} th={s.doTh} /></div>
          </Link>
        ))}
      </div>

      <div className="split-wide" style={{ marginTop: 8 }}>
        <section className="col-pad border-r">
          <h5 className="sec-h"><T en="1–3 · Open the file" th="1–3 · เปิดแฟ้ม" /></h5>
          {err && <div className="callout" style={{ marginBottom: 12, fontSize: 13 }}>{err}</div>}
          <div className="form-grid">
            <label className="field">
              <span><T en="Legal name (English)" th="ชื่อทางกฎหมาย (อังกฤษ)" /></span>
              <input className="input" value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="Example Manufacturing Co., Ltd." />
            </label>
            <label className="field">
              <span><T en="Legal name (Thai)" th="ชื่อทางกฎหมาย (ไทย)" /></span>
              <input className="input" value={draft.nameTh} onChange={(e) => set("nameTh", e.target.value)} placeholder="บริษัท … จำกัด" />
            </label>
            <label className="field">
              <span><T en="TIN (13 digits)" th="เลขประจำตัวผู้เสียภาษี (13 หลัก)" /></span>
              <input className="input" inputMode="numeric" maxLength={13} value={draft.tin} onChange={(e) => set("tin", e.target.value.replace(/\D/g, "").slice(0, 13))} placeholder="0105XXXXXXXXX" />
            </label>
            <label className="field">
              <span><T en="Period" th="รอบบัญชี" /></span>
              <input className="input" value={draft.period} onChange={(e) => set("period", e.target.value)} placeholder="FY2026" />
            </label>
            <label className="field" style={{ gridColumn: "1 / -1" }}>
              <span><T en="Accounting period label" th="ป้ายรอบบัญชี" /></span>
              <input className="input" value={draft.fyLabel} onChange={(e) => set("fyLabel", e.target.value)} placeholder="1 Jan – 31 Dec 2026" />
            </label>
          </div>

          <h5 className="sec-h" style={{ marginTop: 18 }}><T en="Tax profile" th="โปรไฟล์ภาษี" /></h5>
          <div className="text-muted" style={{ fontSize: 12, marginBottom: 8 }}><T en="Rate profile" th="อัตราภาษี" /></div>
          <div className="seg" style={{ marginBottom: 12, flexWrap: "wrap" }}>
            {([["normal", "Normal 20%", "ทั่วไป 20%"], ["sme", "SME", "SME"], ["listed", "Listed / financial", "จดทะเบียน / สถาบันการเงิน"]] as const).map(([id, en, th]) => (
              <label key={id} className="seg-opt">
                <input type="radio" name="rate" checked={draft.rateProfile === id} onChange={() => set("rateProfile", id)} />
                <span><T en={en} th={th} /></span>
              </label>
            ))}
          </div>
          <div className="text-muted" style={{ fontSize: 12, marginBottom: 8 }}><T en="PND51 method" th="วิธี ภ.ง.ด.51" /></div>
          <div className="seg" style={{ marginBottom: 12, flexWrap: "wrap" }}>
            <label className="seg-opt">
              <input type="radio" name="pnd51" checked={draft.pnd51Method === "67bis1"} onChange={() => set("pnd51Method", "67bis1")} />
              <span><T en="s.67 bis (1) estimated annual" th="ม.67 ทวิ (1) ประมาณการทั้งปี" /></span>
            </label>
            <label className="seg-opt">
              <input type="radio" name="pnd51" checked={draft.pnd51Method === "67bis2"} onChange={() => set("pnd51Method", "67bis2")} />
              <span><T en="s.67 bis (2) actual six-month" th="ม.67 ทวิ (2) กำไรจริงหกเดือน" /></span>
            </label>
          </div>
          <div className="text-muted" style={{ fontSize: 12, marginBottom: 8 }}>BOI</div>
          <div className="seg" style={{ marginBottom: 16 }}>
            <label className="seg-opt">
              <input type="radio" name="boi" checked={!draft.boi} onChange={() => set("boi", false)} />
              <span><T en="No promotion" th="ไม่มีบัตรส่งเสริม" /></span>
            </label>
            <label className="seg-opt">
              <input type="radio" name="boi" checked={draft.boi} onChange={() => set("boi", true)} />
              <span><T en="Promoted — open BOI module after create" th="มีส่งเสริม — เปิดโมดูล BOI หลังสร้าง" /></span>
            </label>
          </div>

          <h5 className="sec-h"><T en="People (segregation of duties)" th="ผู้เกี่ยวข้อง (แยกหน้าที่)" /></h5>
          <div className="form-grid">
            <label className="field">
              <span><T en="Tax preparer" th="ผู้จัดทำภาษี" /></span>
              <input className="input" value={draft.preparer} onChange={(e) => set("preparer", e.target.value)} placeholder="Nattaya P." />
            </label>
            <label className="field">
              <span><T en="Reviewer" th="ผู้สอบทาน" /></span>
              <input className="input" value={draft.reviewer} onChange={(e) => set("reviewer", e.target.value)} placeholder="Kanit S." />
            </label>
            <label className="field" style={{ gridColumn: "1 / -1" }}>
              <span><T en="Approver / CFO" th="ผู้อนุมัติ / CFO" /></span>
              <input className="input" value={draft.cfo} onChange={(e) => set("cfo", e.target.value)} placeholder="Pornthip R." />
            </label>
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={submit}>
            <T en="Create engagement and open Data & mapping" th="สร้างงานแล้วไปข้อมูลและการจับคู่" />
          </button>
        </section>

        <aside className="col-aside">
          <h5 className="sec-h"><T en="4 · Close pack you will drop" th="4 · ชุดปิดที่จะวาง" /></h5>
          <div className="text-muted" style={{ fontSize: 12, marginBottom: 10, lineHeight: 1.5 }}>
            <T en="A file counts only when classified, scored ≥ 70, extraction ≥ 0.85, and not a duplicate. Required first; recommended next; BOI only if promoted." th="ไฟล์นับเมื่อจัดประเภท คะแนน ≥ 70 ความเชื่อมั่น ≥ 0.85 และไม่ซ้ำ จำเป็นก่อน แนะนำตาม บัตร BOI เมื่อมีส่งเสริม" />
          </div>
          {PACK_DOCS.map((d) => (
            <div key={d.kind} className="stack-row" style={{ fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontWeight: 700 }}>{lang === "th" ? d.th : d.en}</span>
                <span className={d.level === "required" ? "tag tag-outline" : "tag tag-neutral"}>
                  {d.level === "required" ? <T en="Required" th="จำเป็น" /> : d.level === "recommended" ? <T en="Recommended" th="แนะนำ" /> : <T en="If needed" th="ถ้ามี" />}
                </span>
              </div>
              <div className="text-muted" style={{ fontSize: 11, marginTop: 2 }}>{lang === "th" ? d.needTh : d.need}</div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
