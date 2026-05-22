/* global window */
// Mock data for DSB prototype. All names/values fictional.

const ADVISOR = {
  name: "Nguyễn Hoàng Anh",
  shortName: "Hoàng Anh",
  initials: "NA",
  role: "Senior Financial Advisor · Region South",
  bmiLevel: "BMI-3 · Trusted Advisor",
  icmScore: 782,
  avatarHue: 215,
  team: "Saigon Tower · Squad 04",
};

const COMPASSES = [
  { id: "ilead", label: "iLead", question: "Học gì để giỏi hơn?", icon: "school", color: "#8B2E8F" },
  { id: "dwork", label: "dWork", question: "Hôm nay làm gì với KH nào?", icon: "rocket_launch", color: "#0077ED" },
  { id: "dlink", label: "dLink", question: "Cần ai để làm tốt hơn?", icon: "hub", color: "#00C97D" },
  { id: "daccount", label: "dAccount", question: "Đang ở đâu, tạo ra gì?", icon: "trending_up", color: "#FF8C33" }
];

const NAV = {
  ilead: [
    { id: "ilead/onboarding", label: "Onboarding",  icon: "rocket_launch",   sub: "30-60-90 ngày · Mentor" },
    { id: "ilead/bmi",  label: "BMI Track",   icon: "psychology",       sub: "Sống Nền+Nếp · EB+PoA" },
    { id: "ilead/icm",  label: "ICM Track",   icon: "school",           sub: "SC+PSC · F→L→H" },
    { id: "ilead/cert", label: "Cert + IDP",  icon: "workspace_premium", sub: "Lộ trình · Roadmap · Migration" }
  ],
  dwork: [
    { id: "dwork/dashboard", label: "Dashboard", icon: "dashboard", sub: "Cockpit hằng ngày" },
    { id: "dwork/bi", label: "BI Automation", icon: "auto_awesome", sub: "Chat AI Buddy · hệ thống" },
          { id: "dwork/clients", label: "Client Zone", icon: "diversity_3", sub: "Pipeline · Profile" },
    { id: "dwork/omni", label: "Omnichannel", icon: "forum", sub: "OM · DM · Workflow" },
    { id: "dwork/product", label: "Product Zone", icon: "inventory_2", sub: "Portfolio · AFA" }
  ],
  dlink: [
    { id: "dlink/ilead",     label: "iLead Network",   icon: "school",   sub: "Mentor · Coach · Peer · Training" },
    { id: "dlink/dwork",     label: "dWork Network",   icon: "hub",      sub: "GTM · VCO · Peer CA/CSA" }
  ],
  daccount: [
    { id: "daccount/depth", label: "Depth", icon: "stacked_bar_chart", sub: "BMI · ICM" },
    { id: "daccount/kpi", label: "KPI Dashboard", icon: "monitoring", sub: "Value · Traditional" },
    { id: "daccount/benchmarks", label: "Benchmarks", icon: "leaderboard", sub: "My Position · Top" }
  ]
};

const PIPELINE_STAGES = [
  { id: "identify", label: "Nhận dạng", count: 28, value: "—", tint: "bg-vnd-neutral-100", accent: "border-vnd-neutral-950/10" },
  { id: "bant", label: "BANT Qualify", count: 14, value: "8.4 tỷ", tint: "bg-vnd-primary-50", accent: "border-vnd-primary-200" },
  { id: "approach", label: "Tiếp cận", count: 9, value: "12.1 tỷ", tint: "bg-vnd-primary-50", accent: "border-vnd-primary-200" },
  { id: "schedule", label: "Đặt lịch hẹn", count: 6, value: "6.8 tỷ", tint: "bg-amber-50", accent: "border-amber-200" },
  { id: "advise", label: "Gặp tư vấn", count: 5, value: "9.2 tỷ", tint: "bg-amber-50", accent: "border-amber-200" },
  { id: "propose", label: "Đề xuất mở TK", count: 3, value: "4.6 tỷ", tint: "bg-emerald-50", accent: "border-emerald-200" }
];

const LEADS = [
  { id: "L-2841", name: "Lê Văn Việt", company: "Công ty CP Hạ tầng Việt", value: 500, currency: "M", source: "Referral · Anh Tuấn", stage: "advise", priority: "P1", lastTouch: "2 giờ trước", avatarSeed: "LV", tag: "Hot", note: "Quan tâm gói Tích sản 5 năm + bảo hiểm nhân thọ.", phone: "+84 90 218 4419", nac: true, days: 2 },
  { id: "L-2840", name: "Trần Ngọc Nhi", company: "Boutique 21 — Quận 1", value: 1250, currency: "M", source: "Hội thảo VPBank", stage: "propose", priority: "P1", lastTouch: "Hôm qua", avatarSeed: "TN", tag: "VIP", note: "Đã ký LOI. Đang review phụ lục hợp đồng.", phone: "+84 93 778 0011", nac: true, days: 1 },
  { id: "L-2838", name: "Phạm Quốc Bảo", company: "Bảo Logistics JSC", value: 320, currency: "M", source: "Inbound · Zalo", stage: "bant", priority: "P2", lastTouch: "3 ngày", avatarSeed: "PB", tag: null, note: "Đang xác minh ngân sách & timeline.", phone: "+84 96 224 1188", nac: false, days: 5 },
  { id: "L-2835", name: "Hoàng Thị Mai", company: "Mai Education Group", value: 880, currency: "M", source: "Network · CA team", stage: "schedule", priority: "P1", lastTouch: "Sáng nay", avatarSeed: "HM", tag: "Hot", note: "Đã chốt khung 09:30 thứ Sáu.", phone: "+84 90 511 2299", nac: true, days: 0 },
  { id: "L-2831", name: "Đỗ Trung Kiên", company: "Cá nhân — Founder", value: 410, currency: "M", source: "Webinar Q2", stage: "approach", priority: "P2", lastTouch: "Tuần trước", avatarSeed: "DK", tag: null, note: "Đang gửi sample portfolio.", phone: "+84 91 880 4521", nac: false, days: 9 },
  { id: "L-2828", name: "Vũ Hà Linh", company: "Linh & Cộng sự", value: 240, currency: "M", source: "Lead Gen · TikTok", stage: "identify", priority: "P3", lastTouch: "Chưa liên hệ", avatarSeed: "VL", tag: null, note: "Mới import từ campaign tháng này.", phone: "+84 97 612 8843", nac: false, days: 12 },
  { id: "L-2827", name: "Nguyễn Thanh Hà", company: "Hà Beauty Chain", value: 660, currency: "M", source: "Referral · Chị Nhi", stage: "approach", priority: "P1", lastTouch: "Hôm qua", avatarSeed: "NH", tag: "Hot", note: "Chuẩn bị tài liệu mở TK con.", phone: "+84 90 999 1212", nac: true, days: 1 },
  { id: "L-2825", name: "Lý Minh Quân", company: "Quân Architecture", value: 180, currency: "M", source: "Cold outreach", stage: "identify", priority: "P3", lastTouch: "Chưa liên hệ", avatarSeed: "LQ", tag: null, note: "—", phone: "+84 93 045 2210", nac: false, days: 14 },
  { id: "L-2824", name: "Bùi Thu Trang", company: "Trang Pharma", value: 540, currency: "M", source: "Inbound · website", stage: "bant", priority: "P2", lastTouch: "2 ngày", avatarSeed: "BT", tag: null, note: "Cần xác nhận khẩu vị rủi ro.", phone: "+84 96 778 0099", nac: false, days: 4 },
  { id: "L-2821", name: "Tô Anh Khoa", company: "Khoa Trading Co.", value: 210, currency: "M", source: "Network · Mentor", stage: "identify", priority: "P3", lastTouch: "Chưa liên hệ", avatarSeed: "TK", tag: null, note: "—", phone: "+84 98 221 4400", nac: false, days: 16 }
];

const ACTIVE_CLIENTS = [
  {
    id: "C-1142", name: "Lê Văn Việt", company: "Hạ tầng Việt JSC", cadence: "P1 · Daily",
    initials: "LV", segment: "Private Wealth", joinedAt: "Q3/2023",
    nav: 4820, pnlYtd: 14.6, roi: 12.4, benchmark: 9.1,
    flags: { missedCall: true, pendingReply: false }, owners: ["Hoàng Anh", "Trần Quân"],
    phone: "+84 90 218 4419", email: "viet.le@hatangviet.vn"
  },
  {
    id: "C-1138", name: "Trần Ngọc Nhi", company: "Boutique 21", cadence: "P1 · Daily",
    initials: "TN", segment: "Mass Affluent", joinedAt: "Q1/2024",
    nav: 1280, pnlYtd: 8.2, roi: 7.4, benchmark: 9.1,
    flags: { missedCall: false, pendingReply: true }, owners: ["Hoàng Anh"],
    phone: "+84 93 778 0011", email: "nhi.tran@boutique21.vn"
  },
  {
    id: "C-1130", name: "Phạm Quốc Bảo", company: "Bảo Logistics", cadence: "P2 · Weekly",
    initials: "PB", segment: "Mass Affluent", joinedAt: "Q4/2023",
    nav: 980, pnlYtd: 6.0, roi: 6.2, benchmark: 9.1,
    flags: { missedCall: false, pendingReply: false }, owners: ["Hoàng Anh", "Lê Khánh"],
    phone: "+84 96 224 1188", email: "bao.pham@baologistics.com"
  },
  {
    id: "C-1124", name: "Hoàng Thị Mai", company: "Mai Education", cadence: "P3 · Bi-weekly",
    initials: "HM", segment: "Private Wealth", joinedAt: "Q2/2022",
    nav: 6420, pnlYtd: 19.2, roi: 11.8, benchmark: 9.1,
    flags: { missedCall: false, pendingReply: false }, owners: ["Hoàng Anh"],
    phone: "+84 90 511 2299", email: "mai.h@maiedu.vn"
  },
  {
    id: "C-1118", name: "Đỗ Trung Kiên", company: "Founder · Tech", cadence: "P2 · Weekly",
    initials: "DK", segment: "Emerging Affluent", joinedAt: "Q3/2024",
    nav: 540, pnlYtd: -2.1, roi: -1.4, benchmark: 9.1,
    flags: { missedCall: true, pendingReply: true }, owners: ["Hoàng Anh"],
    phone: "+84 91 880 4521", email: "kien.do@gmail.com"
  },
  {
    id: "C-1109", name: "Nguyễn Thanh Hà", company: "Hà Beauty Chain", cadence: "P1 · Daily",
    initials: "NH", segment: "Private Wealth", joinedAt: "Q4/2022",
    nav: 8950, pnlYtd: 22.1, roi: 13.6, benchmark: 9.1,
    flags: { missedCall: false, pendingReply: false }, owners: ["Hoàng Anh", "Trần Quân"],
    phone: "+84 90 999 1212", email: "ha.nguyen@habeauty.vn"
  }
];

const INTERACTIONS = [
  { id: 1, when: "Hôm nay · 09:42", channel: "Call", channelIcon: "call", owner: "Hoàng Anh", title: "Gọi xác nhận lịch ký hợp đồng", outcome: "Confirmed", note: "Khách OK 14:30 thứ Sáu tại Highlands Lê Lợi.", pending: false },
  { id: 2, when: "Hôm qua · 17:12", channel: "Zalo", channelIcon: "chat", owner: "Hoàng Anh", title: "Gửi sample portfolio Q4", outcome: "Sent", note: "Đã gửi file PDF + voice 2 phút giải thích allocation.", pending: false },
  { id: 3, when: "2 ngày trước · 11:00", channel: "Email", channelIcon: "mail", owner: "Trần Quân (CA)", title: "Phản hồi yêu cầu báo cáo P&L", outcome: "Replied", note: "Đã gửi P&L tháng 10 + giải thích phần giảm.", pending: false },
  { id: 4, when: "3 ngày trước · 14:30", channel: "Meeting", channelIcon: "videocam", owner: "Hoàng Anh", title: "Họp review danh mục quý 3", outcome: "Completed · 48 min", note: "Đồng thuận tăng allocation bond từ 20% → 28%.", pending: false },
  { id: 5, when: "5 ngày trước · 10:00", channel: "Zalo", channelIcon: "chat", owner: "Hoàng Anh", title: "Hỏi thăm sau buổi gặp", outcome: "Pending reply", note: "Đang đợi feedback của khách về proposal V2.", pending: true }
];

const ALLOCATION = [
  { label: "Equity VN", pct: 36, color: "#0077ED" },
  { label: "Bond/Fixed Income", pct: 24, color: "#00C97D" },
  { label: "Mutual Fund", pct: 18, color: "#FFB020" },
  { label: "Insurance — Linked", pct: 12, color: "#8B2E8F" },
  { label: "Cash & Equivalent", pct: 10, color: "#727784" }
];

const COURSES = [
  { id: "C-401", title: "Tư vấn Đầu tư Có Trách nhiệm", category: "Chuyên môn cốt lõi", duration: "6h 20m", level: "Intermediate", required: true, progress: 64, tag: "Required", instructor: "Dr. Phạm Quỳnh" },
  { id: "C-402", title: "AML & Suspicious Transaction Reporting", category: "Compliance", duration: "3h 00m", level: "Foundational", required: true, progress: 100, tag: "Required", instructor: "Lê Hồng Phong" },
  { id: "C-403", title: "Behavioral Finance for Advisors", category: "Kỹ năng tư vấn", duration: "4h 45m", level: "Advanced", required: false, progress: 22, tag: "Recommended", instructor: "Nguyễn Bảo Châu" },
  { id: "C-404", title: "Sản phẩm Bảo hiểm Liên kết Đầu tư 2026", category: "Sản phẩm", duration: "2h 15m", level: "Foundational", required: false, progress: 0, tag: "New", instructor: "Trần Đức Minh" },
  { id: "C-405", title: "Discovery Conversation — Master Class", category: "Kỹ năng tư vấn", duration: "5h 00m", level: "Advanced", required: false, progress: 48, tag: "Recommended", instructor: "Cathy Lin" },
  { id: "C-406", title: "Portfolio Rebalancing Strategy", category: "Chuyên môn cốt lõi", duration: "3h 30m", level: "Intermediate", required: false, progress: 0, tag: "Recommended", instructor: "Đỗ Thanh Hà" }
];

const SKILL_GAPS = [
  { skill: "Investment Planning", current: 78, target: 90, delta: 12 },
  { skill: "Behavioral Coaching", current: 62, target: 85, delta: 23 },
  { skill: "Tax Optimization (VN)", current: 54, target: 80, delta: 26 },
  { skill: "Estate & Legacy", current: 41, target: 75, delta: 34 },
  { skill: "Insurance Linked Products", current: 71, target: 85, delta: 14 },
  { skill: "Compliance & AML", current: 92, target: 95, delta: 3 }
];

const CERTS = [
  { code: "CFP®", name: "Certified Financial Planner", issued: "2022 · Renewed 2025", status: "active", expires: "Q3/2028" },
  { code: "IFP", name: "Investment Foundation Program", issued: "2021", status: "active", expires: "Lifetime" },
  { code: "AML-2", name: "Advanced AML Specialist", issued: "2024", status: "active", expires: "Q1/2027" },
  { code: "LIC", name: "Life Insurance Consultant", issued: "2023", status: "renew", expires: "Q4/2025 — sắp hết hạn" }
];

const BADGES = [
  { name: "Discovery Pro", earned: true, tier: "Gold" },
  { name: "Onboarding Speedster", earned: true, tier: "Silver" },
  { name: "AML Sentinel", earned: true, tier: "Gold" },
  { name: "Behavioral Coach", earned: false, tier: "Bronze" },
  { name: "Portfolio Architect", earned: false, tier: "Silver" },
  { name: "Mentor of the Quarter", earned: true, tier: "Platinum" }
];

const NETWORK_PEOPLE = [
  { id: "P-01", name: "Trần Quân", role: "Client Advisor · CA", strength: 92, channel: "Co-owner C-1142", avatar: "TQ", tag: "Peer" },
  { id: "P-02", name: "Lê Khánh", role: "Senior Advisor · BMI-4", strength: 78, channel: "Mentor", avatar: "LK", tag: "Mentor" },
  { id: "P-03", name: "Phạm Quỳnh", role: "Product Specialist · Bond", strength: 64, channel: "Expert", avatar: "PQ", tag: "Expert" },
  { id: "P-04", name: "Nguyễn Bảo Châu", role: "Behavioral Finance", strength: 48, channel: "Trainer", avatar: "BC", tag: "Expert" },
  { id: "P-05", name: "Đỗ Thanh Hà", role: "Compliance Officer", strength: 70, channel: "Support", avatar: "TH", tag: "Support" },
  { id: "P-06", name: "Lý Khắc Anh", role: "Region Director", strength: 32, channel: "Leadership", avatar: "KA", tag: "Leader" },
  { id: "P-07", name: "Hồ Mỹ Linh", role: "Mass Affluent Advisor", strength: 56, channel: "Peer", avatar: "ML", tag: "Peer" },
  { id: "P-08", name: "Vũ Đức Tâm", role: "Insurance Expert", strength: 60, channel: "Expert", avatar: "VT", tag: "Expert" }
];

const KPI_VALUE = [
  { name: "Client Satisfaction (NPS)", value: 64, target: 60, unit: "", trend: 8, kind: "value" },
  { name: "Retention Rate 12T", value: 96.4, target: 94, unit: "%", trend: 1.2, kind: "value" },
  { name: "Portfolio Quality Score", value: 8.6, target: 8.0, unit: "/10", trend: 0.4, kind: "value" },
  { name: "Time-to-Onboard", value: 4.2, target: 5.0, unit: " ngày", trend: -0.6, kind: "value" }
];
const KPI_TRAD = [
  { name: "Doanh số YTD", value: 18.4, target: 22.0, unit: " tỷ", trend: 12.2, kind: "trad" },
  { name: "AUM phụ trách", value: 184.2, target: 200, unit: " tỷ", trend: 6.8, kind: "trad" },
  { name: "Số hợp đồng mới", value: 42, target: 50, unit: "", trend: 4, kind: "trad" },
  { name: "Số KH active", value: 128, target: 130, unit: "", trend: 6, kind: "trad" }
];

const OM_LIST = [
  { id: "OM-882", client: "Lê Văn Việt", initials: "LV", workflow: "Q4 Reactivation · Wealth", channel: "Email + Zalo", step: "3/5", due: "Hôm nay 15:00", state: "due", kind: "OM" },
  { id: "OM-879", client: "Trần Ngọc Nhi", initials: "TN", workflow: "Onboard Follow-up D+14", channel: "Email", step: "2/4", due: "Mai", state: "ok", kind: "OM" },
  { id: "DM-771", client: "Phạm Quốc Bảo", initials: "PB", workflow: "Direct — Question reply", channel: "Zalo", step: "—", due: "Pending 2h", state: "pending", kind: "DM" },
  { id: "OM-868", client: "Hoàng Thị Mai", initials: "HM", workflow: "Annual Review Kick-off", channel: "Email + Call", step: "1/6", due: "Thứ Sáu", state: "ok", kind: "OM" },
  { id: "OM-866", client: "Đỗ Trung Kiên", initials: "DK", workflow: "Risk Re-profile Campaign", channel: "Zalo", step: "4/5", due: "Quá hạn 1d", state: "overdue", kind: "OM" },
  { id: "DM-770", client: "Nguyễn Thanh Hà", initials: "NH", workflow: "Direct — Schedule call", channel: "Call", step: "—", due: "Today 17:00", state: "due", kind: "DM" }
];

const TOOLS = [
  { id: "agenda", title: "Agenda Builder", desc: "Soạn agenda cho buổi gặp KH theo template hoặc tuỳ biến", icon: "list_alt", color: "vnd-primary-500" },
  { id: "recorder", title: "Session Recorder", desc: "Tóm tắt cuộc gặp: notes, action items, follow-up", icon: "mic", color: "vnd-accent-green" },
  { id: "report", title: "Report Generator", desc: "Tạo báo cáo tuỳ chỉnh theo KH hoặc danh mục", icon: "summarize", color: "vnd-primary-700" },
  { id: "sim", title: "Portfolio Simulator", desc: "Mô phỏng kịch bản danh mục đầu tư / bảo hiểm", icon: "ssid_chart", color: "anvie-primary" },
  { id: "compliance", title: "Compliance Check", desc: "Kiểm tra tính phù hợp với hồ sơ KH", icon: "fact_check", color: "vnd-warning" },
  { id: "templates", title: "Templates", desc: "Email, script cuộc gọi, proposal deck", icon: "auto_awesome_mosaic", color: "pti-primary" },
  { id: "calc", title: "Calculators", desc: "FV/PV, bảo hiểm nhân thọ, retirement", icon: "calculate", color: "vnd-primary-500" }
];

const PRODUCTS = [
  { id: "P-INV-21", name: "VPF Tích sản 5 năm", category: "Investment Fund", risk: "Trung bình", aum: "1,820 tỷ", yield: "9.4% YTD", trend: "up", recommended: true },
  { id: "P-INS-04", name: "Manulife Heritage Linked", category: "Insurance Linked", risk: "Thấp - TB", aum: "—", yield: "Phí 2%", trend: "flat", recommended: true },
  { id: "P-BND-12", name: "VIB Trái phiếu Doanh nghiệp 24T", category: "Bond", risk: "Trung bình", aum: "640 tỷ", yield: "8.2% p.a", trend: "up", recommended: false },
  { id: "P-EQT-08", name: "VietCap Growth Equity Basket", category: "Equity Basket", risk: "Cao", aum: "320 tỷ", yield: "16.1% YTD", trend: "up", recommended: false },
  { id: "P-INV-29", name: "VinaCapital Balanced Fund", category: "Mutual Fund", risk: "Trung bình", aum: "2,140 tỷ", yield: "11.2% YTD", trend: "up", recommended: true },
  { id: "P-INS-09", name: "Sunlife Edu Future", category: "Insurance Linked", risk: "Thấp", aum: "—", yield: "Phí 1.4%", trend: "flat", recommended: false }
];

const TASKS = [
  { id: "T-01", title: "Gọi xác nhận buổi gặp 14:30 với Lê Văn Việt", project: "Pipeline · Advise", priority: "P1", due: "09:30", done: false, nac: true },
  { id: "T-02", title: "Gửi proposal V2 cho Trần Ngọc Nhi", project: "Onboarding · Step 5", priority: "P1", due: "11:00", done: false, nac: true },
  { id: "T-03", title: "Review compliance check — Bảo Logistics", project: "Compliance", priority: "P2", due: "13:00", done: false, nac: false },
  { id: "T-04", title: "Callback missed call — Đỗ Trung Kiên", project: "Active · DK", priority: "P1", due: "14:00", done: false, nac: true },
  { id: "T-05", title: "Soạn agenda họp annual review — H.M Education", project: "Tool · Agenda", priority: "P2", due: "16:00", done: true, nac: false },
  { id: "T-06", title: "Log interaction Zalo — Tô Anh Khoa", project: "Lead · Identify", priority: "P3", due: "17:30", done: false, nac: false }
];

const ONBOARD_STEPS = [
  { id: 1, key: "intake", label: "Tiếp nhận hồ sơ", state: "done", note: "CMND/CCCD + thông tin liên hệ", actor: "Hoàng Anh", at: "T2 09:15" },
  { id: 2, key: "ekyc", label: "eKYC", state: "done", note: "Đã xác minh khuôn mặt + liveness", actor: "Auto", at: "T2 09:42" },
  { id: 3, key: "aml", label: "AML / PEP Check", state: "done", note: "Sạch · Watchlist clear", actor: "Compliance Bot", at: "T2 10:11", gate: true },
  { id: 4, key: "risk", label: "Risk Profiling", state: "current", note: "Đang chờ KH hoàn thành bảng câu hỏi (12/20)", actor: "KH thực hiện", at: "Đang chạy", gate: true },
  { id: 5, key: "contract", label: "Ký hợp đồng", state: "pending", note: "—", actor: "—", at: "—" },
  { id: 6, key: "account", label: "Cấp tài khoản", state: "pending", note: "—", actor: "Ops team", at: "—" },
  { id: 7, key: "handoff", label: "Handoff sang CA", state: "pending", note: "—", actor: "Trần Quân (CA)", at: "—" }
];

const ANNOUNCEMENTS = [
  { id: 1, level: "info", title: "Sản phẩm mới: Sunlife Edu Future 2026", body: "Tài liệu training đã có trên iLead · Course Library.", at: "Sáng nay" },
  { id: 2, level: "warn", title: "Chứng chỉ LIC sắp hết hạn", body: "Đăng ký renewal trước 30/11 để giữ trạng thái active.", at: "2 ngày" },
  { id: 3, level: "info", title: "Cập nhật chính sách AML Q4", body: "Threshold giao dịch nội địa giảm xuống 350M.", at: "Tuần trước" }
];

window.DSB_DATA = {
  ADVISOR, COMPASSES, NAV, PIPELINE_STAGES, LEADS, ACTIVE_CLIENTS, INTERACTIONS, ALLOCATION,
  COURSES, SKILL_GAPS, CERTS, BADGES, NETWORK_PEOPLE, KPI_VALUE, KPI_TRAD, OM_LIST, TOOLS,
  PRODUCTS, TASKS, ONBOARD_STEPS, ANNOUNCEMENTS
};
