export type PlaybookRow = {
  topic: { en: string; th: string };
  compliance: { en: string; th: string };
  complex: { en: string; th: string };
};

export const PLAYBOOK_SAME: { en: string; th: string }[] = [
  { en: "Not Corporate / Advisory / Defence — those are roles. Law depth is how much related law CIT24 loads.", th: "ไม่ใช่ องค์กร / ที่ปรึกษา / ต่อสู้คดี — นั่นคือบทบาท ความลึกกฎหมายคือว่า CIT24 โหลดกฎหมายเกี่ยวเนื่องมากน้อยแค่ไหน" },
  { en: "ETR is always current tax ÷ accounting profit before tax. Deferred tax is never in that identity.", th: "ETR เป็นภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษีทางบัญชีเสมอ ไม่ใส่ภาษีรอตัดบัญชีในอัตรานี้" },
  { en: "The TB engine still calculates current tax from the Tax Adjustment Ledger, losses, PND51 and WHT.", th: "เครื่อง TB ยังคำนวณภาษีงวดปัจจุบันจากทะเบียนปรับปรุง ผลขาดทุน ภ.ง.ด.51 และเครดิตหัก ณ ที่จ่าย" },
  { en: "AI proposes and explains. Humans approve. AI cannot mark a regulation obsolete, post a journal, or change a rule version.", th: "AI เสนอและอธิบาย คนอนุมัติ AI ห้ามทำเครื่องหมายกฎหมายล้าสมัย บันทึกบัญชี หรือเปลี่ยนเวอร์ชันกฎ" },
];

export const PLAYBOOK_ROWS: PlaybookRow[] = [
  {
    topic: { en: "Intent", th: "จุดประสงค์" },
    compliance: { en: "Acceptable filing bar — what must be done to file PND51/50 and set current tax defensibly.", th: "เกณฑ์ยื่นที่ยอมรับได้ — สิ่งที่ต้องทำเพื่อยื่น ภ.ง.ด.51/50 และตั้งภาษีงวดปัจจุบันอย่างมีเหตุผล" },
    complex: { en: "Full related-law pack — every instrument that can change the picture (FS, TP, BOI, Pillar Two, obsolete history).", th: "ชุดกฎหมายเกี่ยวเนื่องเต็ม — ทุกฉบับที่อาจเปลี่ยนภาพ (งบการเงิน ราคาโอน BOI เสาหลักสอง ประวัติที่ล้าสมัย)" },
  },
  {
    topic: { en: "When to use", th: "เมื่อไหร่ใช้" },
    compliance: { en: "Ordinary close: no promoted activity in play, no group GMT, no TAS 12 FS pack this period.", th: "ปิดภาษีปกติ: ไม่มีกิจการส่งเสริมในงวด ไม่มี GMT กลุ่ม ไม่ทำชุด ต.บ. 12 ในงวดนี้" },
    complex: { en: "Promoted projects, deferred-tax note, TP/GloBE mapping, uncertain tax treatments, or a law-change review.", th: "มีโครงการส่งเสริม หมายเหตุภาษีรอตัด แผนที่ TP/GloBE ภาษีที่ไม่แน่นอน หรือทบทวนกฎหมายใหม่" },
  },
  {
    topic: { en: "Rule pack", th: "คลังกฎ" },
    compliance: { en: "Core s.65 / 65 bis / 65 ter (material), RD 145, PND51/50, WHT. Complex-only rules are hidden with a count.", th: "แกน ม.65 / 65 ทวิ / 65 ตรี (สาระสำคัญ) พ.ร.ฎ. 145 ภ.ง.ด.51/50 เครดิต ณ ที่จ่าย กฎโหมดครบถูกซ่อนพร้อมนับจำนวน" },
    complex: { en: "Entire versioned pack, including TP s.71 bis/ter, BOI allocation/exemption, FTC, loyalty (obsolete TFRIC 13).", th: "ทั้งแพ็กที่มีเวอร์ชัน รวมราคาโอน ม.71 ทวิ/ตรี ปันส่วน/ยกเว้น BOI เครดิตต่างประเทศ โปรแกรมสะสมแต้ม (TFRIC 13 ล้าสมัย)" },
  },
  {
    topic: { en: "Regulation corpus", th: "คลังกฎหมาย" },
    compliance: { en: "In-force instruments on the filing bar only. Obsolete / superseded history is collapsed.", th: "ฉบับที่ใช้บังคับบนเกณฑ์ยื่นเท่านั้น ประวัติล้าสมัย/ถูกแทนที่ถูกพับไว้" },
    complex: { en: "Full corpus including TFRS 15, TAS 34, TFRIC 23, Pillar Two DT exception, BOI Act, and superseded TFRIC 13.", th: "คลังเต็ม รวม TFRS 15 ต.บ. 34 TFRIC 23 ข้อยกเว้นเสาหลักสอง พ.ร.บ. BOI และ TFRIC 13 ที่ถูกแทนที่" },
  },
  {
    topic: { en: "TAS 12 deferred tax", th: "ภาษีรอตัดบัญชี ต.บ. 12" },
    compliance: { en: "Defaults off. Current tax, PND50 and ETR unchanged. You may still turn TAS 12 on.", th: "ปิดเป็นค่าเริ่มต้น ภาษีงวดปัจจุบัน ภ.ง.ด.50 และ ETR ไม่เปลี่ยน ยังเปิด ต.บ. 12 ได้" },
    complex: { en: "Defaults on. Live DTA and DTL, recoverability, unused FTC, outside-basis exception, tax expense = current + deferred.", th: "เปิดเป็นค่าเริ่มต้น DTA และ DTL สด ความสามารถในการใช้ เครดิตที่ยังไม่ใช้ ข้อยกเว้นฐานภายนอก ค่าใช้จ่ายภาษี = ปัจจุบัน + รอตัด" },
  },
  {
    topic: { en: "BOI module", th: "โมดูล BOI" },
    compliance: { en: "Closed. Promoted and non-promoted tax bases are not mixed on the filing bar.", th: "ปิด ไม่ผสมฐานส่งเสริมกับนอกส่งเสริมบนเกณฑ์ยื่น" },
    complex: { en: "Available as a separate On/Off module: certificate P&L, allocation AI, BOI losses, e-Tax + PND50 annex.", th: "ใช้ได้เป็นโมดูลแยก เปิด/ปิด: กำไรรายบัตร AI ปันส่วน ขาดทุน BOI ชุด e-Tax และเอกสารแนบ ภ.ง.ด.50" },
  },
  {
    topic: { en: "Pillar Two / GMT24", th: "เสาหลักสอง / GMT24" },
    compliance: { en: "Not volunteered. No P2 DTA/DTL. Covered-tax payload is hidden.", th: "ไม่เสนอให้เอง ไม่มี DTA/DTL จากเสาหลักสอง ซ่อนเพย์โหลดภาษีครอบคลุม" },
    complex: { en: "Exception shown: no P2 DTA/DTL. GMT24 covered-tax feed and TP GloBE mapping are visible.", th: "แสดงข้อยกเว้น: ไม่มี DTA/DTL จากเสาหลักสอง เห็นข้อมูล GMT24 และการจับคู่ GloBE จาก TP" },
  },
  {
    topic: { en: "Copilot", th: "ผู้ช่วย" },
    compliance: { en: "Answers from the bar pack. Will not volunteer TAS 12 DTL, TFRIC 23, TAS 34 or Pillar Two unless asked.", th: "ตอบจากชุดเกณฑ์ยื่น จะไม่เสนอ DTL ต.บ. 12 TFRIC 23 ต.บ. 34 หรือเสาหลักสอง ถ้าไม่ได้ถาม" },
    complex: { en: "Full corpus. Warns if a cited instrument is obsolete or superseded.", th: "คลังเต็ม เตือนถ้าฉบับที่อ้างล้าสมัยหรือถูกแทนที่" },
  },
  {
    topic: { en: "What switching does", th: "การสลับทำอะไร" },
    compliance: { en: "Hides Complex-only screens and rules. Turns TAS 12 off (if the period can be mutated). Closes BOI.", th: "ซ่อนหน้าและกฎเฉพาะโหมดครบ ปิด ต.บ. 12 (ถ้างวดแก้ได้) ปิด BOI" },
    complex: { en: "Shows the full pack. Turns TAS 12 on by default. BOI stays off until you open that module.", th: "แสดงชุดเต็ม เปิด ต.บ. 12 เป็นค่าเริ่มต้น BOI ยังปิดจนกว่าจะเปิดโมดูลนั้น" },
  },
];

export const PLAYBOOK_STEPS: { n: string; en: string; th: string }[] = [
  { n: "1", en: "Start in Compliance for the ordinary close.", th: "เริ่มที่เกณฑ์ขั้นต่ำสำหรับปิดภาษีปกติ" },
  { n: "2", en: "Run Review related laws if a statute or TAS may have changed.", th: "กดตรวจกฎหมายที่เกี่ยวข้อง ถ้ากฎหมายหรือ ต.บ. อาจเปลี่ยน" },
  { n: "3", en: "Switch to Complex only when the alert or the file needs TAS 12, TP, BOI or obsolete history.", th: "สลับเป็นครบทุกกฎหมายเมื่อการแจ้งเตือนหรือแฟ้มต้องการ ต.บ. 12 ราคาโอน BOI หรือประวัติล้าสมัย" },
  { n: "4", en: "Open the BOI module separately if there is a promotion certificate — do not treat BOI as one add-back.", th: "เปิดโมดูล BOI แยกถ้ามีบัตรส่งเสริม — อย่าถือว่า BOI เป็นรายการบวกกลับรายการเดียว" },
];
