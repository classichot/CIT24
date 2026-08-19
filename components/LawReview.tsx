"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { useStore } from "@/lib/store";
import {
  explainLawAlertPrompt,
  severityCls,
  severityLabel,
  visibleLawAlerts,
  type LawAlert,
} from "@/lib/lawReview";
import { T } from "@/lib/i18n";

export function LawReviewButton({ compact = false, goToCorpus = false }: { compact?: boolean; goToCorpus?: boolean }) {
  const router = useRouter();
  const { runLawReview, setLawReviewOpen, unreadLawAlertCount } = useStore();
  return (
    <button
      type="button"
      className="btn btn-secondary"
      style={compact ? { fontSize: 13, padding: "6px 10px" } : undefined}
      onClick={() => {
        runLawReview();
        setLawReviewOpen(true);
        if (goToCorpus) router.push("/corpus?review=1");
      }}
    >
      <Sparkles size={compact ? 14 : 16} color="var(--color-accent)" />
      <T en="Review related laws" th="ตรวจกฎหมายที่เกี่ยวข้อง" zh="审查相关法规" ja="関連法令を審査" />
      {unreadLawAlertCount > 0 && <span className="law-alert-badge">{unreadLawAlertCount}</span>}
    </button>
  );
}

export function LawAlertBanner() {
  const { unreadLawAlertCount } = useStore();
  if (unreadLawAlertCount <= 0) return null;
  return (
    <div className="callout" style={{ marginTop: 16, fontSize: 13, display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
      <span className="law-alert-badge">{unreadLawAlertCount}</span>
      <T
        en={`${unreadLawAlertCount} unread law alert${unreadLawAlertCount === 1 ? "" : "s"} — AI proposed only.`}
        th={`การแจ้งเตือนกฎหมายที่ยังไม่อ่าน ${unreadLawAlertCount} รายการ — AI เสนอเท่านั้น`}
        zh={`${unreadLawAlertCount} 条未读法规提醒 — 仅 AI 提议。`}
        ja={`未読の法令アラート ${unreadLawAlertCount}件 — AI提案のみ。`}
      />
      <Link href="/corpus?review=1"><T en="Review related laws" th="ตรวจกฎหมายที่เกี่ยวข้อง" zh="审查相关法规" ja="関連法令を審査" /></Link>
    </div>
  );
}

export function LawAlertStrip() {
  const { lawAlerts, unreadLawAlertCount, setLawReviewOpen } = useStore();
  const n = visibleLawAlerts(lawAlerts).length;
  if (n === 0) return null;
  return (
    <div className="callout" style={{ marginTop: 16, fontSize: 13 }}>
      <T
        en={`${n} law alert${n === 1 ? "" : "s"}${unreadLawAlertCount ? ` · ${unreadLawAlertCount} unread` : ""} — open the corpus to act. AI cannot mark a regulation obsolete.`}
        th={`การแจ้งเตือนกฎหมาย ${n} รายการ${unreadLawAlertCount ? ` · ยังไม่อ่าน ${unreadLawAlertCount}` : ""} — เปิดคลังกฎหมายเพื่อดำเนินการ AI ทำเครื่องหมายล้าสมัยไม่ได้`}
        zh={`${n} 条法规提醒${unreadLawAlertCount ? ` · ${unreadLawAlertCount} 未读` : ""}。打开法规库处理。AI 不得标记过时。`}
        ja={`法令アラート${n}件${unreadLawAlertCount ? ` · 未読${unreadLawAlertCount}` : ""}。コーパスで対応。AIは失効にできない。`}
      />
      {" "}
      <Link href="/corpus?review=1" onClick={() => setLawReviewOpen(true)}>
        <T en="Open alerts" th="เปิดการแจ้งเตือน" zh="打开提醒" ja="アラートを開く" />
      </Link>
    </div>
  );
}

function AlertBody({ a, lang }: { a: LawAlert; lang: string }) {
  const th = lang === "th";
  return (
    <>
      <div style={{ fontSize: 13, lineHeight: 1.55, marginTop: 6 }}>{th ? a.whatsNewTh : a.whatsNew}</div>
      {(a.affectedRules.length > 0 || a.affectedPages.length > 0) && (
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {a.affectedRules.slice(0, 8).map((id) => (
            <Link key={id} href="/rules" className="tag tag-neutral">{id}</Link>
          ))}
          {a.affectedPages.slice(0, 6).map((p) => (
            <Link key={p} href={p} className="tag tag-outline">{p}</Link>
          ))}
        </div>
      )}
      <div style={{ marginTop: 8, fontSize: 12 }}>
        <strong><T en="Human action" th="สิ่งที่คนต้องทำ" zh="人工操作" ja="人の対応" />.</strong>{" "}
        {th ? a.actionTh : a.action}
      </div>
    </>
  );
}

export function LawAlertPanel({ onSelectCorpus }: { onSelectCorpus?: (id: string) => void }) {
  const {
    lawReviewOpen, setLawReviewOpen, lawAlerts, dismissLawAlert, markLawAlertsRead, ask, lang,
  } = useStore();
  const rows = visibleLawAlerts(lawAlerts);

  useEffect(() => {
    if (lawReviewOpen) markLawAlertsRead();
  }, [lawReviewOpen, lawAlerts, markLawAlertsRead]);

  if (!lawReviewOpen) return null;

  return (
    <div className="panel" style={{ marginTop: 16 }}>
      <div className="panel-head">
        <div>
          <h5><T en="Related-law alerts" th="การแจ้งเตือนกฎหมายที่เกี่ยวข้อง" zh="相关法规提醒" ja="関連法令アラート" /></h5>
          <div className="text-muted" style={{ fontSize: 11, marginTop: 2 }}>
            <T
              en="AI classified the corpus against related / new law. Propose only — it cannot mark a regulation obsolete, change an approved adjustment, post a journal, submit a return, or change a rule version."
              th="AI จำแนกคลังกับกฎหมายที่เกี่ยวข้อง/ใหม่ เสนอเท่านั้น — ทำเครื่องหมายล้าสมัย แก้รายการที่อนุมัติ บันทึกบัญชี ยื่นแบบ หรือเปลี่ยนเวอร์ชันกฎไม่ได้"
              zh="AI 对照相关/新法分类法规库。仅提议 — 不得标记过时、更改已批准调整、过账、申报或改规则版本。"
              ja="AIが関連・新法とコーパスを分類。提案のみ。失効標記・承認済調整の変更・仕訳・申告・ルール版の変更は不可。"
            />
          </div>
        </div>
        <button className="icon-btn" type="button" onClick={() => setLawReviewOpen(false)} aria-label="Close law alerts">
          <X size={16} />
        </button>
      </div>
      <div className="panel-body" style={{ paddingTop: 8 }}>
        {rows.length === 0 ? (
          <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>
            <T en="No open law alerts. Run Review related laws after corpus or rule-pack changes." th="ไม่มีการแจ้งเตือนที่เปิดอยู่ กดตรวจกฎหมายที่เกี่ยวข้องหลังคลังหรือชุดกฎเปลี่ยน" />
          </p>
        ) : rows.map((a) => (
          <div key={a.id} className="law-alert-row">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span className={severityCls(a.severity)}>{severityLabel(a.severity, lang)}</span>
              <span className="mono" style={{ fontSize: 11, fontWeight: 800 }}>{a.id}</span>
              {a.corpusId !== "BAR" ? (
                onSelectCorpus ? (
                  <button type="button" className="btn btn-ghost" style={{ fontSize: 13, padding: 0 }} onClick={() => onSelectCorpus(a.corpusId)}>
                    {a.cite}
                  </button>
                ) : (
                  <Link href={`/corpus?id=${a.corpusId}`}>{a.cite}</Link>
                )
              ) : (
                <span style={{ fontWeight: 700, fontSize: 13 }}>{a.cite}</span>
              )}
              <span className="text-muted" style={{ fontSize: 12 }}>{lang === "th" ? a.titleTh : a.title}</span>
            </div>
            <AlertBody a={a} lang={lang} />
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: 12 }}
                onClick={() => ask(explainLawAlertPrompt(a))}
              >
                <T en="Explain in Copilot" th="ให้ Copilot อธิบาย" zh="让 Copilot 解释" ja="Copilotで説明" />
              </button>
              <button type="button" className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => dismissLawAlert(a.id)}>
                <T en="Dismiss" th="ปิดรายการ" zh="关闭" ja="却下" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
