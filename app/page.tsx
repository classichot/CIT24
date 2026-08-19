"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Scale, Shield } from "lucide-react";
import { useStore } from "@/lib/store";
import { ModeToggle } from "@/components/ModeToggle";
import type { ProductMode } from "@/lib/model";

export default function LoginPage() {
  const { login, authed, ready, mode: sessionMode } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("kanit@7l-advisory.com");
  const [password, setPassword] = useState("demo1234");
  const [mode, setMode] = useState<ProductMode>("advisor");

  useEffect(() => {
    if (ready && authed) {
      router.replace(sessionMode === "advisor" ? "/clients" : sessionMode === "defence" ? "/evidence" : "/overview");
    }
  }, [ready, authed, sessionMode, router]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    login(mode);
    router.push(mode === "advisor" ? "/clients" : mode === "defence" ? "/evidence" : "/overview");
  }

  return (
    <div className="login-split">
      <section className="login-pane login-hero">
        <header className="login-pane-head">
          <div>
            <div className="login-mark">
              CIT24<span />
            </div>
            <span className="login-kicker">Thai corporate tax operating system</span>
          </div>
        </header>
        <div className="login-pane-body">
          <h1 className="login-headline">
            Upload accounting records once. CIT24 creates the provision, PND51, PND50 and a defensible evidence trail.
          </h1>
          <p className="login-lede">
            An AI-assisted Thai Corporate Tax Operating System — not a PND50 form generator. AI extracts, classifies and explains. A deterministic rule engine calculates. Every figure drills down: return field → adjustment → GL → evidence → legal rule → approval.
          </p>
        </div>
        <footer className="login-pane-foot">
          <div className="login-stats">
            <div>
              <strong>฿17.2m</strong>
              <span>Demo current tax</span>
            </div>
            <div>
              <strong>14</strong>
              <span>Adjustments</span>
            </div>
            <div>
              <strong>13d</strong>
              <span>PND51 due</span>
            </div>
          </div>
        </footer>
      </section>

      <section className="login-pane login-auth">
        <header className="login-pane-head">
          <div className="login-kicker-ghost">Sign in</div>
          <ModeToggle compact />
        </header>
        <div className="login-pane-body">
          <form className="login-card" onSubmit={onSubmit}>
            <h2>Choose operating mode</h2>
            <p className="text-muted login-card-note">
              The calculation engine never changes with the mode. Corporate, advisory and audit-defence share one ledger, one rule pack and one trail.
            </p>
            <div className="login-modes" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
              <button type="button" className={`login-mode${mode === "corporate" ? " on" : ""}`} onClick={() => { setMode("corporate"); setEmail("pornthip@siamprecision.co.th"); }}>
                <Building2 size={18} />
                <strong>Corporate</strong>
                <span>Single-entity tax close, quarterly provision, period lock.</span>
              </button>
              <button type="button" className={`login-mode${mode === "advisor" ? " on" : ""}`} onClick={() => { setMode("advisor"); setEmail("kanit@7l-advisory.com"); }}>
                <Scale size={18} />
                <strong>Advisory</strong>
                <span>Multi-client workspace, reviewer workload, white-label packs.</span>
              </button>
              <button type="button" className={`login-mode${mode === "defence" ? " on" : ""}`} onClick={() => { setMode("defence"); setEmail("audit.partner@sgv.co.th"); }}>
                <Shield size={18} />
                <strong>Audit defence</strong>
                <span>RD request tracker, evidence room, controlled sharing.</span>
              </button>
            </div>
            <div className="field">
              <label>Work email</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
            </div>
            <div className="field">
              <label>Password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
            <button className="btn btn-primary btn-block" type="submit">
              Enter {mode === "advisor" ? "advisory workspace" : mode === "defence" ? "evidence room" : "group workspace"} <ArrowRight size={18} />
            </button>
          </form>
        </div>
        <footer className="login-pane-foot login-meta">
          <span>SSO · MFA · entity-level ACL · PDPA</span>
          <span>Demo / demo1234</span>
        </footer>
      </section>
    </div>
  );
}
