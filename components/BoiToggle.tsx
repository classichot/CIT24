"use client";

import { useStore } from "@/lib/store";
import { T } from "@/lib/i18n";

export function BoiToggle({ variant = "header" }: { variant?: "header" | "block" }) {
  const { lawMode, boiEnabled, setBoiEnabled } = useStore();
  const locked = lawMode !== "complex";
  return (
    <div className={`law-toggle law-toggle-${variant}${locked ? " is-locked" : ""}`} role="group" aria-label="BOI module">
      <span className="law-toggle-kicker"><T en="BOI module" th="โมดูล BOI" zh="BOI 模块" ja="BOIモジュール" /></span>
      <div className="seg">
        <label className="seg-opt" title={locked ? "Switch Law depth to Complex first" : "BOI off"}>
          <input type="radio" name={`boi-${variant}`} checked={!boiEnabled} disabled={locked} onChange={() => setBoiEnabled(false)} />
          <span><T en="Off" th="ปิด" zh="关" ja="オフ" /></span>
        </label>
        <label className="seg-opt" title={locked ? "Switch Law depth to Complex first" : "BOI Tax Segregation & Allocation Engine"}>
          <input type="radio" name={`boi-${variant}`} checked={boiEnabled} disabled={locked} onChange={() => setBoiEnabled(true)} />
          <span><T en="On" th="เปิด" zh="开" ja="オン" /></span>
        </label>
      </div>
    </div>
  );
}
