"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RULES, RULE_FAMILIES, rulesForLawMode, complexRuleCount, type RuleFamily } from "@/lib/rules";
import { corpusForLawMode, corpusForRule, corpusStats, corpusStatusCls, isCorpusStale, statusLabel } from "@/lib/corpus";
import { useStore } from "@/lib/store";
import { PageHead, riskCls } from "@/components/PageHead";
import { LawAlertStrip, LawReviewButton } from "@/components/LawReview";
import { T, pick } from "@/lib/i18n";

export default function RulesPage() {
  const { impactRan, runImpact, lang, corpus, lawMode } = useStore();
  const [q, setQ] = useState("");
  const [fam, setFam] = useState<RuleFamily | "all">("all");
  const [sel, setSel] = useState("RULE-65T-04");
  const pack = rulesForLawMode(lawMode);
  const visibleCorpus = corpusForLawMode(corpus, lawMode);
  const stats = corpusStats(visibleCorpus);
  const extraRules = lawMode === "compliance" ? complexRuleCount() : 0;
  const rows = useMemo(() => pack.filter((r) => {
    const okF = fam === "all" || r.family === fam;
    const blob = (r.id + r.name + r.sec + r.logic).toLowerCase();
    return okF && (!q || blob.includes(q.toLowerCase()));
  }), [q, fam, pack]);
  const rule = pack.find((r) => r.id === sel) ?? rows[0] ?? pack[0];
  const grounded = corpusForRule(rule, corpus);
  const staleRule = grounded ? isCorpusStale(grounded.status) : false;

  return (
    <div>
      <PageHead
        kickerEn="Versioned Thai CIT rule library"
        kickerTh="คลังกฎภาษีนิติบุคคลที่ระบุเวอร์ชัน"
        kickerZh="带版本的泰国企业所得税规则库"
        kickerJa="版管理されたタイ法人税ルール庫"
        titleEn="Rule library & Tax Law Impact Engine"
        titleTh="คลังกฎและเครื่องมือผลกระทบกฎหมายภาษี"
        titleZh="规则库与税法影响引擎"
        titleJa="ルール庫と税法インパクトエンジン"
        subEn={lawMode === "compliance"
          ? `${pack.length} compliance-bar rules — s.65, s.65 bis/ter, RD 145, PND51/50, WHT. ${extraRules} further rules in Complex mode.`
          : `${RULES.length} coded rules covering s.65 ter, s.65 bis, RD 145, rates, credits, PND51/50, TP and BOI — not a single generic non-deductible switch.`}
        subTh={lawMode === "compliance"
          ? `${pack.length} กฎเกณฑ์ขั้นต่ำ — ม.65 ม.65 ทวิ/ตรี พ.ร.ฎ. 145 ภ.ง.ด.51/50 เครดิต ณ ที่จ่าย อีก ${extraRules} กฎในโหมดครบทุกกฎหมาย`
          : `${RULES.length} กฎที่ลงรหัส ครอบคลุม ม.65 ตรี ม.65 ทวิ พ.ร.ฎ. 145 อัตรา เครดิต ภ.ง.ด.51/50 ราคาโอน และ BOI — ไม่ใช่สวิตช์ “หักไม่ได้” ก้อนเดียว`}
        subZh={`${RULES.length} 条已编码规则，覆盖第65条之三、第65条之二、第145号法令、税率、抵免、PND51/50、转让定价与BOI。`}
        subJa={`${RULES.length}件の実装ルール。65条の3、65条の2、勅令145、税率、控除、PND51/50、移転価格、BOIをカバー。`}
        actions={
          <>
            <LawReviewButton compact />
            <button className="btn btn-primary" onClick={runImpact}><T en="Run impact engine" th="รันเครื่องมือผลกระทบ" zh="运行影响引擎" ja="インパクトエンジン実行" /></button>
          </>
        }
      />

      <div className="callout" style={{ marginTop: 16, fontSize: 13 }}>
        <T
          en={`${pack.length} rules grounded in ${stats.total} instruments${lawMode === "complex" ? ` — ${stats.stale} obsolete` : ""}.`}
          th={`${pack.length} กฎยึด ${stats.total} ฉบับกฎหมาย${lawMode === "complex" ? ` — ล้าสมัย ${stats.stale} ฉบับ` : ""}`}
          zh={`${pack.length} 条规则依据 ${stats.total} 部法规${lawMode === "complex" ? ` — ${stats.stale} 部已过时` : ""}。`}
          ja={`${pack.length}ルールは${stats.total}法令に根拠${lawMode === "complex" ? ` — 失効${stats.stale}件` : ""}。`}
        />
        {extraRules > 0 && (
          <>
            {" "}
            <T en={`${extraRules} further rules in Complex mode.`} th={`อีก ${extraRules} กฎในโหมดครบทุกกฎหมาย`} zh={`完整模式另有 ${extraRules} 条规则。`} ja={`コンプレックスにさらに${extraRules}件。`} />
          </>
        )}
        {" "}
        <Link href="/corpus"><T en="Open regulation corpus" th="เปิดคลังกฎหมาย" zh="打开法规库" ja="法令コーパスを開く" /></Link>
      </div>

      <LawAlertStrip />

      <div style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--color-divider)", flexWrap: "wrap", alignItems: "center" }}>
        <input className="input" style={{ maxWidth: 320 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder={pick(lang, { en: "Search id, section, name…", th: "ค้นหารหัส มาตรา ชื่อ…", zh: "搜索编号、条文、名称…", ja: "ID・条文・名称を検索…" })} />
        <div className="seg" style={{ flexWrap: "wrap" }}>
          <label className="seg-opt">
            <input type="radio" name="rf" checked={fam === "all"} onChange={() => setFam("all")} />
            <T en="All" th="ทั้งหมด" zh="全部" ja="すべて" />
          </label>
          {RULE_FAMILIES.map((f) => (
            <label key={f.id} className="seg-opt">
              <input type="radio" name="rf" checked={fam === f.id} onChange={() => setFam(f.id)} />
              {pick(lang, f)}
            </label>
          ))}
        </div>
        <span className="text-muted" style={{ fontSize: 12, marginLeft: "auto" }}>{rows.length} / {pack.length}</span>
      </div>

      <div className="split-wide">
        <section className="col-pad border-r">
          <div className="table-wrap">
            <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th><T en="Rule" th="กฎ" zh="规则" ja="ルール" /></th>
                <th><T en="Section" th="มาตรา" zh="条文" ja="条文" /></th>
                <th>Ver</th>
                <th><T en="Effective" th="มีผล" zh="生效" ja="効力" /></th>
                <th><T en="Risk" th="ความเสี่ยง" zh="风险" ja="リスク" /></th>
                <th className="num"><T en="Clients" th="ลูกค้า" zh="客户" ja="顧客" /></th>
                <th><T en="Tests" th="ทดสอบ" zh="测试" ja="テスト" /></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="clickable" onClick={() => setSel(r.id)} style={{ background: r.id === sel ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : undefined }}>
                  <td style={{ fontSize: 11, fontWeight: 800 }}>{r.id}</td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</td>
                  <td style={{ fontSize: 12 }}>{r.sec}</td>
                  <td>{r.version}</td>
                  <td style={{ fontSize: 12 }}>{r.effective}</td>
                  <td><span className={riskCls(r.risk)}>{r.risk}</span></td>
                  <td className="num">{r.clients}</td>
                  <td style={{ fontSize: 12 }}>{r.tests}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </section>
        <aside className="col-aside">
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: "var(--color-accent)" }}>{rule.id} · {rule.version}</div>
          <h4 style={{ margin: "6px 0 4px" }}>{rule.name}</h4>
          <div className="text-muted" style={{ fontSize: 12 }}>{rule.sec} · {pick(lang, RULE_FAMILIES.find((f) => f.id === rule.family) ?? { en: rule.family, th: rule.family })} · {rule.effective}</div>
          {grounded && (
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              <Link href={`/corpus?id=${grounded.id}`} className="tag tag-accent">{grounded.cite}</Link>
              <span className={corpusStatusCls(grounded.status)}>{statusLabel(grounded.status, lang)}</span>
            </div>
          )}
          {staleRule && grounded && (
            <div className="callout" style={{ fontSize: 13, marginTop: 10 }}>
              <T
                en={`Rule grounded in obsolete regulation (${grounded.id} · ${grounded.cite}). Update the corpus or the rule pack before relying on this logic.`}
                th={`กฎยึดกฎหมายที่ล้าสมัย (${grounded.id} · ${grounded.cite}) อัปเดตคลังกฎหมายหรือชุดกฎก่อนใช้`}
                zh={`规则依据已过时法规（${grounded.id} · ${grounded.cite}）。依赖此前请更新法规库或规则包。`}
                ja={`失効法令（${grounded.id} · ${grounded.cite}）に根拠。適用前にコーパスかルールを更新。`}
              />
            </div>
          )}
          <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>{rule.logic}</p>
          {rule.formula && (
            <div className="mono" style={{ fontSize: 12, background: "var(--color-surface)", padding: 10, marginTop: 8 }}>{rule.formula}</div>
          )}
          <div className="wf-row"><span><T en="Required evidence" th="หลักฐานที่ต้องมี" zh="所需证据" ja="必要な証憑" /></span><span style={{ textAlign: "right", maxWidth: "55%" }}>{rule.evidence}</span></div>
          <div className="wf-row"><span><T en="Test cases" th="กรณีทดสอบ" zh="测试用例" ja="テストケース" /></span><span>{rule.tests}</span></div>
          <div className="wf-row"><span><T en="Tax-team approval" th="การอนุมัติของทีมภาษี" zh="税务团队批准" ja="税務チーム承認" /></span><span>Approved · pack 2026.2</span></div>
          <a href={rule.legalUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-block"><T en="Open legal reference" th="เปิดแหล่งกฎหมาย" zh="打开法律依据" ja="法令参照を開く" /></a>
          {impactRan && (
            <div style={{ background: "var(--color-surface)", padding: 12, marginTop: 8 }}>
              <div style={{ fontWeight: 800 }}><T en="Impact · RULE-65T-04 v4 draft" th="ผลกระทบ · RULE-65T-04 v4 ฉบับร่าง" zh="影响 · RULE-65T-04 v4 草案" ja="インパクト · RULE-65T-04 v4草案" /></div>
              <div className="text-muted" style={{ fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
                <T en="6 entities · 11 adjustments · estimated tax impact THB 1.42m. 2 filed returns require review. Actions: recompute entertainment ceilings, notify reviewers, freeze mapping on 6210-00." th="6 กิจการ · 11 รายการ · ผลกระทบภาษีประมาณ 1.42 ล้านบาท แบบที่ยื่นแล้ว 2 ฉบับต้องทบทวน: คำนวณเพดานค่ารับรองใหม่ แจ้งผู้สอบทาน ล็อกการจับคู่บัญชี 6210-00" zh="6 个主体 · 11 项调整 · 预计税负影响 142 万泰铢。已申报的 2 份申报表需复核。" ja="6事業体 · 11調整 · 税額影響約142万THB。提出済申告2件の見直しが必要。" />
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
