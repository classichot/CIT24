"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { T } from "@/lib/i18n";

export function BoiToggle({ variant = "header" }: { variant?: "header" | "block" }) {
  const { boiEnabled, setBoiEnabled } = useStore();
  return (
    <div className={`law-toggle law-toggle-${variant}`} role="group" aria-label="BOI module">
      <span className="law-toggle-kicker"><T en="BOI module" th="โมดูล BOI" zh="BOI 模块" ja="BOIモジュール" /></span>
      <div className="seg">
        <label className="seg-opt" title="BOI off">
          <input type="radio" name={`boi-${variant}`} checked={!boiEnabled} onChange={() => setBoiEnabled(false)} />
          <span><T en="Off" th="ปิด" zh="关" ja="オフ" /></span>
        </label>
        <label className="seg-opt" title="BOI Tax Segregation & Allocation Engine — turns on Complex if needed">
          <input type="radio" name={`boi-${variant}`} checked={boiEnabled} onChange={() => setBoiEnabled(true)} />
          <span><T en="On" th="เปิด" zh="开" ja="オン" /></span>
        </label>
      </div>
      {variant === "block" && (
        <Link href="/boi" className="text-muted" style={{ fontSize: 11 }}>
          <T en="Open BOI desk" th="เปิดโต๊ะ BOI" zh="打开 BOI 工作台" ja="BOIデスクを開く" /> →
        </Link>
      )}
    </div>
  );
}
