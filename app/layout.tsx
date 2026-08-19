import type { Metadata, Viewport } from "next";
import { StoreProvider } from "@/lib/store";
import { ThemeWrap } from "@/components/ThemeWrap";
import "./globals.css";

export const metadata: Metadata = {
  title: "CIT24 — Thai Corporate Tax Operating System",
  description: "AI-assisted Thai corporate income tax provision and compliance. Upload accounting records once. CIT24 creates the provision, PND51, PND50 and a defensible evidence trail.",
  applicationName: "CIT24",
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
};

export const viewport: Viewport = {
  themeColor: "#f3f2f2",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ThemeWrap>{children}</ThemeWrap>
        </StoreProvider>
      </body>
    </html>
  );
}
