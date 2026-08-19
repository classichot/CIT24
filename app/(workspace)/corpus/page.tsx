"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RULES, rulesForLawMode, complexRuleCount } from "@/lib/rules";
import {
  CORPUS_KINDS,
  corpusForLawMode,
  corpusStatusCls,
  isCorpusActive,
  isCorpusStale,
  kindLabel,
  linkedRules,
  statusLabel,
  type CorpusKind,
} from "@/lib/corpus";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { LawAlertPanel, LawReviewButton } from "@/components/LawReview";
import { pick, T } from "@/lib/i18n";

type StatusFilter = "all" | "in-force" | "obsolete";

export default function CorpusRoute() {
  return (
    <Suspense fallback={<div className="page-head"><h2>Regulation corpus</h2></div>}>
      <CorpusPage />
    </Suspense>
  );
}

function CorpusPage() {
  const search = useSearchParams();
  const {
    corpus, lang, canMutate, readOnly, locked, markCorpusObsolete, reinstateCorpus,
    linkCorpusSuccessor, addCorpusInstrument, actor, lawMode, setLawReviewOpen,
  } = useStore();
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState<StatusFilter>("all");
  const [kindF, setKindF] = useState<CorpusKind | "all">("all");
  const [sel, setSel] = useState(search.get("id") || "TAS-12");
  const [adding, setAdding] = useState(false);
  const [note, setNote] = useState("");
  const [successor, setSuccessor] = useState("");
  const [draft, setDraft] = useState({
    cite: "",
    title: "",
    titleTh: "",
    kind: "statute" as CorpusKind,
    effectiveFrom: "2026-01-01",
    summary: "",
  });

  useEffect(() => {
    if (search.get("review") === "1") setLawReviewOpen(true);
    const deep = search.get("id");
    if (deep) setSel(deep);
  }, [search, setLawReviewOpen]);

  const visible = useMemo(() => corpusForLawMode(corpus, lawMode), [corpus, lawMode]);
  const hiddenN = corpus.length - visible.length;
  const pack = rulesForLawMode(lawMode);
  const extraRules = lawMode === "compliance" ? complexRuleCount() : 0;

  const rows = useMemo(() => visible.filter((c) => {
    if (statusF === "in-force" && !isCorpusActive(c.status)) return false;
    if (statusF === "obsolete" && !isCorpusStale(c.status)) return false;
    if (kindF !== "all" && c.kind !== kindF) return false;
    if (!q) return true;
    const blob = `${c.id} ${c.cite} ${c.title} ${c.titleTh} ${c.summary}`.toLowerCase();
    return blob.includes(q.toLowerCase());
  }), [visible, statusF, kindF, q]);

  const inst = visible.find((c) => c.id === sel) ?? corpus.find((c) => c.id === sel) ?? rows[0] ?? visible[0];
  const instOffBar = !!(inst && !visible.some((c) => c.id === inst.id));
  const rules = inst ? linkedRules(inst, pack) : [];
  const successorRow = inst?.supersededBy ? corpus.find((c) => c.id === inst.supersededBy) : undefined;
  const candidates = corpus.filter((c) => c.id !== inst?.id);
  const stale = visible.filter((c) => isCorpusStale(c.status)).length;
  const lockedMsg = readOnly
    ? pick(lang, { en: "Audit-defence is read-only.", th: "โหมดต่อสู้คดีอ่านอย่างเดียว", zh: "稽查应对为只读。", ja: "調査対応は読取専用です。" })
    : locked
      ? pick(lang, { en: "Period locked — CFO must reopen.", th: "ล็อกงวดแล้ว — CFO ต้องเปิดใหม่", zh: "期间已锁定，须由 CFO 重开。", ja: "期間ロック中。CFOの再開が必要。" })
      : "";

  function submitAdd() {
    const id = addCorpusInstrument(draft);
    if (id) {
      setSel(id);
      setAdding(false);
      setDraft({ cite: "", title: "", titleTh: "", kind: "statute", effectiveFrom: "2026-01-01", summary: "" });
    }
  }

  return (
    <div>
      <PageHead
        kickerEn="Legal source of truth"
        kickerTh="แหล่งกฎหมายที่เป็นจริง"
        kickerZh="法律事实来源"
        kickerJa="法令のソース・オブ・トゥルース"
        titleEn="Regulation corpus"
        titleTh="คลังกฎหมายภาษี"
        titleZh="税法法规库"
        titleJa="税法コーパス"
        subEn={lawMode === "compliance"
          ? `${visible.length} in-force instruments for the compliance bar. ${hiddenN} further instruments (including obsolete history) in Complex mode.`
          : `${corpus.length} instruments ground the ${RULES.length}-rule pack. Mark superseded or repealed law obsolete; Copilot cannot. TAS 12 / ETR math is unchanged.`}
        subTh={`${corpus.length} ฉบับเป็นฐานของคลัง ${RULES.length} กฎ ทำเครื่องหมายกฎหมายที่ถูกแทนที่หรือยกเลิก — Copilot ทำไม่ได้ ต.บ. 12 / ETR ไม่เปลี่ยน`}
        subZh={`${corpus.length} 部法规支撑 ${RULES.length} 条规则。过时法规由人工标记；Copilot 不能。TAS 12 / ETR 计算不变。`}
        subJa={`${corpus.length}件の法令が${RULES.length}ルールを根拠づける。失効は人が記録。Copilot不可。TAS 12 / ETRは不変。`}
        actions={
          <>
            <LawReviewButton />
            <button className="btn btn-primary" onClick={() => setAdding((v) => !v)} disabled={!canMutate}>
              {adding
                ? <T en="Cancel" th="ยกเลิก" zh="取消" ja="取消" />
                : <T en="Add instrument" th="เพิ่มกฎหมาย" zh="新增法规" ja="法令を追加" />}
            </button>
          </>
        }
      />

      <div className="callout" style={{ marginTop: 16, fontSize: 13 }}>
        <T
          en={`${pack.length} rules grounded in ${visible.length} instruments${lawMode === "complex" ? ` — ${stale} obsolete` : ""}. ${actor.role} may update status; AI cannot mark a regulation obsolete.`}
          th={`${pack.length} กฎยึด ${visible.length} ฉบับ — ${lawMode === "complex" ? `ล้าสมัย ${stale} ฉบับ ` : ""}${actor.role} อัปเดตสถานะได้ AI ทำเครื่องหมายล้าสมัยไม่ได้`}
          zh={`${pack.length} 条规则依据 ${visible.length} 部法规。${actor.role} 可更新状态；AI 不得标记过时。`}
          ja={`${pack.length}ルールは${visible.length}法令に根拠。${actor.role}が更新可。AIは失効にできない。`}
        />
        {hiddenN > 0 && (
          <>
            {" "}
            <T en={`${hiddenN} further instruments in Complex mode (obsolete / related law).`} th={`อีก ${hiddenN} ฉบับในโหมดครบทุกกฎหมาย (ล้าสมัย / กฎหมายเกี่ยวเนื่อง)`} zh={`完整模式另有 ${hiddenN} 部法规（含过时与相关法）。`} ja={`コンプレックスにさらに${hiddenN}件（失効・関連法）。`} />
          </>
        )}
        {extraRules > 0 && (
          <>
            {" "}
            <T en={`${extraRules} further rules in Complex mode.`} th={`อีก ${extraRules} กฎในโหมดครบทุกกฎหมาย`} zh={`完整模式另有 ${extraRules} 条规则。`} ja={`コンプレックスにさらに${extraRules}件のルール。`} />
          </>
        )}
      </div>

      <LawAlertPanel onSelectCorpus={(id) => { setSel(id); setNote(""); }} />

      {adding && (
        <div className="panel" style={{ marginTop: 16 }}>
          <div className="panel-head"><h5><T en="Add instrument" th="เพิ่มกฎหมาย" zh="新增法规" ja="法令を追加" /></h5></div>
          <div className="panel-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field"><label>Cite</label><input className="input" value={draft.cite} onChange={(e) => setDraft({ ...draft, cite: e.target.value })} placeholder="e.g. Revenue Code s.70" /></div>
            <div className="field">
              <label><T en="Kind" th="ประเภท" zh="类型" ja="種別" /></label>
              <select className="input" value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as CorpusKind })}>
                {CORPUS_KINDS.map((k) => <option key={k.id} value={k.id}>{pick(lang, k)}</option>)}
              </select>
            </div>
            <div className="field"><label><T en="Title" th="ชื่อ" /></label><input className="input" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
            <div className="field"><label><T en="Title (TH)" th="ชื่อภาษาไทย" /></label><input className="input" value={draft.titleTh} onChange={(e) => setDraft({ ...draft, titleTh: e.target.value })} /></div>
            <div className="field"><label><T en="Effective from" th="มีผลตั้งแต่" /></label><input className="input" value={draft.effectiveFrom} onChange={(e) => setDraft({ ...draft, effectiveFrom: e.target.value })} placeholder="YYYY-MM-DD or FY2026" /></div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label><T en="Summary (what it does for CIT)" th="สรุป (ผลต่อภาษีนิติบุคคล)" /></label>
              <textarea className="input" value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <button className="btn btn-primary" type="button" onClick={submitAdd}><T en="Save to corpus" th="บันทึกลงคลัง" zh="保存到法规库" ja="コーパスに保存" /></button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--color-divider)", flexWrap: "wrap", alignItems: "center" }}>
        <input className="input" style={{ maxWidth: 280 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder={pick(lang, { en: "Search cite, title…", th: "ค้นหาเลข ชื่อ…", zh: "搜索文号、标题…", ja: "引用・名称を検索…" })} />
        <div className="seg">
          {(lawMode === "complex" ? (["all", "in-force", "obsolete"] as StatusFilter[]) : (["all", "in-force"] as StatusFilter[])).map((k) => (
            <label key={k} className="seg-opt">
              <input type="radio" name="cs" checked={statusF === k} onChange={() => setStatusF(k)} />
              {k === "all" ? <T en="All" th="ทั้งหมด" zh="全部" ja="すべて" /> : k === "in-force" ? <T en="In force" th="ใช้บังคับ" zh="现行" ja="施行中" /> : <T en="Obsolete" th="ล้าสมัย" zh="过时" ja="失効" />}
            </label>
          ))}
        </div>
        <div className="seg" style={{ flexWrap: "wrap" }}>
          <label className="seg-opt">
            <input type="radio" name="ck" checked={kindF === "all"} onChange={() => setKindF("all")} />
            <T en="Any kind" th="ทุกประเภท" zh="全部类型" ja="全種別" />
          </label>
          {CORPUS_KINDS.map((k) => (
            <label key={k.id} className="seg-opt">
              <input type="radio" name="ck" checked={kindF === k.id} onChange={() => setKindF(k.id)} />
              {pick(lang, k)}
            </label>
          ))}
        </div>
        <span className="text-muted" style={{ fontSize: 12, marginLeft: "auto" }}>{rows.length} / {visible.length}</span>
      </div>

      <div className="split-wide">
        <section className="col-pad border-r">
          <div className="table-wrap">
            <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th><T en="Cite" th="อ้างอิง" zh="文号" ja="引用" /></th>
                <th><T en="Title" th="ชื่อ" zh="标题" ja="名称" /></th>
                <th><T en="Kind" th="ประเภท" zh="类型" ja="種別" /></th>
                <th><T en="Status" th="สถานะ" zh="状态" ja="状態" /></th>
                <th><T en="Effective" th="มีผล" zh="生效" ja="効力" /></th>
                <th className="num"><T en="Rules" th="กฎ" zh="规则" ja="ルール" /></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => {
                const n = linkedRules(c, pack).length;
                return (
                  <tr key={c.id} className="clickable" onClick={() => { setSel(c.id); setNote(""); setSuccessor(c.supersededBy ?? ""); }} style={{ background: c.id === inst?.id ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : undefined }}>
                    <td style={{ fontSize: 11, fontWeight: 800 }}>{c.id}</td>
                    <td style={{ fontSize: 12 }}>{c.cite}</td>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{lang === "th" ? c.titleTh : c.title}</td>
                    <td style={{ fontSize: 12 }}>{kindLabel(c.kind, lang)}</td>
                    <td><span className={corpusStatusCls(c.status)}>{statusLabel(c.status, lang)}</span></td>
                    <td style={{ fontSize: 12 }}>{c.effectiveFrom}</td>
                    <td className="num">{n}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </section>
        {inst && (
          <aside className="col-aside">
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: "var(--color-accent)" }}>{inst.id} · {kindLabel(inst.kind, lang)} · TH</div>
              <h4 style={{ margin: "6px 0 4px" }}>{lang === "th" ? inst.titleTh : inst.title}</h4>
              <div className="text-muted" style={{ fontSize: 12 }}>{inst.cite} · {inst.effectiveFrom}</div>
              <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span className={corpusStatusCls(inst.status)}>{statusLabel(inst.status, lang)}</span>
                <span className="tag tag-neutral"><T en="Reviewed" th="ทบทวน" /> {inst.lastReviewed}</span>
                {inst.bar === "complex" && <span className="tag tag-outline"><T en="Complex" th="ครบทุกกฎหมาย" zh="完整" ja="コンプレックス" /></span>}
              </div>
            </div>
            {instOffBar && (
              <div className="callout" style={{ fontSize: 13 }}>
                <T
                  en="This instrument is outside the compliance bar (related / obsolete law). Switch Law depth to Complex to manage it in the list. Human may still update status here; AI cannot."
                  th="ฉบับนี้อยู่นอกเกณฑ์ขั้นต่ำ (กฎหมายเกี่ยวเนื่อง / ล้าสมัย) สลับความลึกเป็นครบทุกกฎหมายเพื่อจัดการในรายการ คนอัปเดตสถานะได้ AI ทำไม่ได้"
                  zh="该法规不在合规栏（相关/过时法）。切换到完整模式以在列表中管理。人工仍可改状态；AI 不能。"
                  ja="コンプライアンスバー外（関連・失効法）。一覧で扱うにはコンプレックスへ。状態更新は人のみ。"
                />
              </div>
            )}
            {isCorpusStale(inst.status) && (
              <div className="callout" style={{ fontSize: 13 }}>
                <strong><T en="Obsolete / superseded" th="ล้าสมัย / ถูกแทนที่" zh="过时 / 已被取代" ja="失効 / 承継" /></strong>
                <div style={{ marginTop: 6 }}>{inst.obsoleteNote || (lang === "th" ? inst.summaryTh : inst.summary)}</div>
                {successorRow && (
                  <div style={{ marginTop: 8 }}>
                    <T en="Successor:" th="ฉบับแทนที่:" zh="后继：" ja="承継：" />{" "}
                    <button type="button" className="btn btn-ghost" onClick={() => setSel(successorRow.id)}>{successorRow.id} · {successorRow.cite}</button>
                  </div>
                )}
              </div>
            )}
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>{lang === "th" ? inst.summaryTh : inst.summary}</p>
            {inst.cit24Use.note && <div className="text-muted" style={{ fontSize: 12 }}>{inst.cit24Use.note}</div>}
            <div>
              <h5 className="sec-h"><T en="CIT24 use" th="การใช้ใน CIT24" zh="CIT24 用法" ja="CIT24での用法" /></h5>
              <div className="wf-row"><span><T en="Linked rules" th="กฎที่โยง" zh="关联规则" ja="リンクルール" /></span><span>{rules.length}</span></div>
              {rules.map((r) => (
                <div key={r.id} className="wf-row">
                  <Link href="/rules">{r.id}</Link>
                  <span className="text-muted" style={{ fontSize: 12, textAlign: "right", maxWidth: "55%" }}>{r.sec}</span>
                </div>
              ))}
              {inst.cit24Use.pages.length > 0 && (
                <div className="wf-row">
                  <span><T en="Pages" th="หน้าจอ" zh="页面" ja="画面" /></span>
                  <span style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-end" }}>
                    {inst.cit24Use.pages.map((p) => <Link key={p} href={p} className="tag tag-neutral">{p}</Link>)}
                  </span>
                </div>
              )}
              {inst.cit24Use.engineHooks.map((h) => (
                <div key={h} className="wf-row"><span><T en="Engine" th="เครื่องคำนวณ" zh="引擎" ja="エンジン" /></span><span className="mono" style={{ fontSize: 11, textAlign: "right", maxWidth: "60%" }}>{h}</span></div>
              ))}
              {inst.cit24Use.engineHooks.length === 0 && (
                <div className="text-muted" style={{ fontSize: 12 }}><T en="Not engine-backed (library / disclosure only)." th="ยังไม่ผูกเครื่องคำนวณ (คลัง / เปิดเผยเท่านั้น)" zh="尚未接入引擎。" ja="エンジン未接続。" /></div>
              )}
            </div>
            {inst.legalUrl && (
              <a href={inst.legalUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-block">
                <T en="Open legal reference" th="เปิดแหล่งกฎหมาย" zh="打开法律依据" ja="法令参照を開く" />
              </a>
            )}
            <div>
              <h5 className="sec-h"><T en="Update when obsolete" th="อัปเดตเมื่อล้าสมัย" zh="过时更新" ja="失効時の更新" /></h5>
              {!canMutate && <p className="text-muted" style={{ fontSize: 12 }}>{lockedMsg}</p>}
              <div className="field" style={{ marginBottom: 8 }}>
                <label><T en="Link successor" th="โยงฉบับแทนที่" zh="关联后继" ja="承継をリンク" /></label>
                <select className="input" value={successor} onChange={(e) => setSuccessor(e.target.value)} disabled={!canMutate}>
                  <option value="">{pick(lang, { en: "— none —", th: "— ไม่มี —", zh: "— 无 —", ja: "— なし —" })}</option>
                  {candidates.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.cite}</option>)}
                </select>
              </div>
              <div className="field" style={{ marginBottom: 8 }}>
                <label><T en="Note" th="หมายเหตุ" zh="备注" ja="メモ" /></label>
                <textarea className="input" value={note} onChange={(e) => setNote(e.target.value)} disabled={!canMutate} placeholder={pick(lang, { en: "Superseded, repealed, or amended — why", th: "ถูกแทนที่ ยกเลิก หรือแก้ไข — เหตุผล", zh: "被取代、废止或修订的原因", ja: "承継・廃止・改正の理由" })} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {isCorpusStale(inst.status) ? (
                  <button className="btn btn-primary" type="button" disabled={!canMutate} onClick={() => reinstateCorpus(inst.id)}>
                    <T en="Reinstate" th="กลับมาใช้บังคับ" zh="恢复有效" ja="施行に戻す" />
                  </button>
                ) : (
                  <button className="btn btn-primary" type="button" disabled={!canMutate} onClick={() => markCorpusObsolete(inst.id, { supersededBy: successor || undefined, note: note || undefined })}>
                    <T en="Mark obsolete" th="ทำเครื่องหมายล้าสมัย" zh="标记过时" ja="失効にする" />
                  </button>
                )}
                <button className="btn btn-secondary" type="button" disabled={!canMutate || !successor} onClick={() => linkCorpusSuccessor(inst.id, successor)}>
                  <T en="Link successor" th="โยงฉบับแทนที่" zh="关联后继" ja="承継をリンク" />
                </button>
              </div>
              <p className="text-muted" style={{ fontSize: 11, marginTop: 8 }}>
                <T en="Human only. Copilot will refuse to mark a regulation obsolete." th="มนุษย์เท่านั้น Copilot จะปฏิเสธการทำเครื่องหมายกฎหมายล้าสมัย" zh="仅限人工。Copilot 会拒绝将法规标为过时。" ja="人のみ。Copilotは失効操作を拒否します。" />
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
