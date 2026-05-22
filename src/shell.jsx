/* global React, window */
const { COMPASSES, NAV, ADVISOR, ANNOUNCEMENTS } = window.DSB_DATA;

// --- AppShell ---
function AppShell({ route, onNavigate, compact, setCompact, children }) {
  const [compassId, screenId] = route.includes("/") ? route.split("/") : [route, null];
  const compass = COMPASSES.find(c => c.id === compassId) || COMPASSES[1];
  const subNav = NAV[compass.id] || [];
  const activeScreen = screenId ? (compass.id + "/" + screenId) : (subNav[0]?.id || compass.id);

  return (
    <div className="flex min-h-screen bg-surface-container-low">
      <Sidebar
        route={route}
        compassId={compass.id}
        onNavigate={onNavigate} compact={compact} setCompact={setCompact}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar compact={compact} setCompact={setCompact} />
        <SecondaryNav compass={compass} subNav={subNav} active={activeScreen} onNavigate={onNavigate} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

// =============== SIDEBAR ===============
const TOP_NAV = [
  { id: "dwork/dashboard", label: "Dashboard", icon: "dashboard", sub: "Cockpit hằng ngày" }
];
const DASHBOARD_NAV = { id: "dwork/dashboard", label: "Dashboard", icon: "dashboard", sub: "Cockpit hằng ngày" };
const UTILITY_NAV = [
  { id: "dwork/tools",    label: "Toolbox", icon: "build",         sub: "Agenda · Simulator" },
  { id: "dwork/helpdesk", label: "Library", icon: "menu_book",     sub: "Helpdesk · Q&A" }
];
function Sidebar({ route, compassId, onNavigate, compact, setCompact }) {
  const isUtility = UTILITY_NAV.some(u => u.id === route);
  const isDashboard = route === DASHBOARD_NAV.id;
  const isTop     = TOP_NAV.some(u => u.id === route);
  const renderItem = (u) => {
    const active = route === u.id;
    return (
      <a key={u.id}
        href="#" onClick={(e) => { e.preventDefault(); onNavigate(u.id); }}
        title={compact ? u.label : ""}
        className={`flex items-center gap-4 rounded-lg transition-all
          ${compact ? "h-11 justify-center" : "py-2.5 px-4"}
          ${active
            ? "bg-vnd-primary-50 text-vnd-primary-500 font-bold translate-x-1"
            : "text-on-surface-variant hover:bg-surface-container-high"}`}
      >
        <Icon name={u.icon} size={22} filled={active} weight={active ? 500 : 400} />
        {!compact && <span className="text-[15px] font-medium">{u.label}</span>}
      </a>
    );
  };
  return (
    <aside
      className={`hidden md:flex flex-col h-screen sticky top-0 left-0 bg-surface-container border-r border-outline-variant/60 z-30 transition-[width] duration-200
        ${compact ? "w-[76px]" : "w-64"}`}
    >
      {/* Brand */}
      <div className={`flex items-center gap-4 px-4 pt-6 pb-6 ${compact ? "justify-center px-2" : ""}`}>
        <div className="w-10 h-10 bg-vnd-primary-900 rounded-lg flex items-center justify-center text-white font-display font-bold text-[22px] flex-shrink-0 leading-none">D</div>
        {!compact && (
          <div className="min-w-0">
            <p className="font-display font-bold text-headline-md text-vnd-primary-900 leading-none">DSB</p>
            <p className="text-[11px] text-on-surface-variant opacity-70 mt-1 truncate">Dynamic Service Blueprint</p>
          </div>
        )}
      </div>

      {/* Primary nav */}
      <nav className={`flex-1 ${compact ? "px-2" : "px-4"} space-y-1 overflow-y-auto scrollbar-thin pt-1`}>
        {/* Dashboard (above iLead) */}
        <div className="space-y-1">
          <a key={DASHBOARD_NAV.id}
            href="#" onClick={(e) => { e.preventDefault(); onNavigate(DASHBOARD_NAV.id); }}
            title={compact ? DASHBOARD_NAV.label : ""}
            className={`flex items-center gap-4 rounded-lg transition-all
              ${compact ? "h-11 justify-center" : "py-2.5 px-4"}
              ${isDashboard
                ? "bg-vnd-primary-50 text-vnd-primary-500 font-bold translate-x-1"
                : "text-on-surface-variant hover:bg-surface-container-high"}`}
          >
            <Icon name={DASHBOARD_NAV.icon} size={22} filled={isDashboard} weight={isDashboard ? 500 : 400} />
            {!compact && <span className="text-[15px] font-medium">{DASHBOARD_NAV.label}</span>}
          </a>

          {COMPASSES.map(c => {
            const active = !isUtility && !isDashboard && c.id === compassId;
            return (
              <a key={c.id}
                href="#" onClick={(e) => { e.preventDefault(); onNavigate(c.id); }}
                title={compact ? c.label : ""}
                className={`flex items-center gap-4 rounded-lg transition-all
                  ${compact ? "h-11 justify-center" : "py-2.5 px-4"}
                  ${active
                    ? "bg-vnd-primary-50 text-vnd-primary-500 font-bold translate-x-1"
                    : "text-on-surface-variant hover:bg-surface-container-high"}`}
              >
                <Icon name={c.icon} size={22} filled={active} weight={active ? 500 : 400} />
                {!compact && <span className="text-[15px] font-medium">{c.label}</span>}
              </a>
            );
          })}
        </div>

        {/* Utility — Toolbox & Library */}
        <div className={`pt-3 mt-3 ${compact ? "" : "border-t border-outline-variant/40"}`}>
          {compact && <div className="h-px bg-outline-variant/40 mx-2 mb-2" />}
          <div className="space-y-1">
            {UTILITY_NAV.map(u => {
              const active = route === u.id;
              return (
                <a key={u.id}
                  href="#" onClick={(e) => { e.preventDefault(); onNavigate(u.id); }}
                  title={compact ? u.label : ""}
                  className={`flex items-center gap-4 rounded-lg transition-all
                    ${compact ? "h-11 justify-center" : "py-2.5 px-4"}
                    ${active
                      ? "bg-vnd-primary-50 text-vnd-primary-500 font-bold translate-x-1"
                      : "text-on-surface-variant hover:bg-surface-container-high"}`}
                >
                  <Icon name={u.icon} size={22} filled={active} weight={active ? 500 : 400} />
                  {!compact && <span className="text-[15px] font-medium">{u.label}</span>}
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom utilities */}
      <div className={`border-t border-outline-variant/50 ${compact ? "px-2 py-3" : "px-4 py-4"} space-y-1`}>
        <button onClick={() => setCompact(!compact)}
          title={compact ? "Mở rộng" : "Thu gọn"}
          className={`flex items-center gap-4 rounded-lg transition-all text-on-surface-variant hover:bg-surface-container-high
            ${compact ? "w-full h-10 justify-center" : "py-2 px-4 w-full"}`}>
          <Icon name={compact ? "right_panel_open" : "right_panel_close"} size={20} />
          {!compact && <span className="text-[14px]">Thu gọn</span>}
        </button>
        <a href="#" className={`flex items-center gap-4 rounded-lg transition-all text-on-surface-variant hover:bg-surface-container-high
          ${compact ? "w-full h-10 justify-center" : "py-2 px-4"}`}>
          <Icon name="help" size={20} />
          {!compact && <span className="text-[14px]">Hỗ trợ</span>}
        </a>
        <a href="#" className={`flex items-center gap-4 rounded-lg transition-all text-on-surface-variant hover:bg-surface-container-high
          ${compact ? "w-full h-10 justify-center" : "py-2 px-4"}`}>
          <Icon name="logout" size={20} />
          {!compact && <span className="text-[14px]">Đăng xuất</span>}
        </a>
      </div>
    </aside>
  );
}

// =============== TOP BAR ===============
function TopBar({ compact, setCompact }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  return (
    <header className="bg-surface-container-lowest shadow-sm h-16 z-20 sticky top-0">
      <div className="flex justify-between items-center w-full px-gutter max-w-[1440px] mx-auto h-16">
        <div className="flex items-center gap-unit-8">
          <button className="md:hidden w-9 h-9 rounded-lg hover:bg-surface-container-low text-on-surface-variant flex items-center justify-center" onClick={() => setCompact(!compact)}>
            <Icon name="menu" size={20} />
          </button>
          <span className="md:hidden font-display font-bold text-headline-md text-vnd-primary-900">DSB</span>
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng, lead, sản phẩm…"
              className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-[13px] w-72 lg:w-96 focus:ring-2 focus:ring-vnd-primary-500 outline-none placeholder:text-on-surface-variant/70"
            />
            <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <kbd className="hidden lg:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-on-surface-variant bg-white border border-outline-variant/40 rounded px-1.5 py-0.5">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 ml-4 border-l border-outline-variant pl-6">
            {/* AI Buddy entry */}
            <button onClick={() => setAiOpen(true)} title="AI Buddy — hỏi mọi thông tin trong hệ thống"
              className="group inline-flex items-center gap-2 h-9 pl-2 pr-3 rounded-full bg-gradient-to-r from-vnd-primary-700 via-vnd-primary-500 to-vnd-accent-green text-white shadow-soft hover:shadow-brand transition-all active:scale-[.97]">
              <span className="relative w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                <Icon name="auto_awesome" size={14} className="text-white" filled />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-vnd-accent-green ring-2 ring-white animate-pulse-soft"></span>
              </span>
              <span className="text-[12.5px] font-display font-semibold hidden sm:inline">AI Buddy</span>
              <span className="hidden lg:inline text-[10px] font-mono opacity-80 bg-white/10 rounded px-1.5 py-0.5">⌘J</span>
            </button>

            <div className="relative">
              <button onClick={() => setNotifOpen(o => !o)}
                className="relative text-on-surface-variant hover:text-vnd-primary-500 transition-colors w-8 h-8 flex items-center justify-center">
                <Icon name="notifications" size={22} filled={notifOpen} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-vnd-danger rounded-full border-2 border-white"></span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-[360px] bg-white rounded-2xl shadow-lift ring-1 ring-outline-variant/40 overflow-hidden animate-fade-in z-30">
                  <div className="px-4 py-3 border-b border-outline-variant/40 flex items-center justify-between">
                    <p className="font-display font-semibold text-vnd-primary-900">Thông báo</p>
                    <button className="text-[11px] font-medium text-vnd-primary-700 hover:underline">Đánh dấu đã đọc</button>
                  </div>
                  <ul className="max-h-[420px] overflow-y-auto scrollbar-thin divide-y divide-outline-variant/20">
                    {ANNOUNCEMENTS.map(a => (
                      <li key={a.id} className="px-4 py-3 hover:bg-surface-container-low flex gap-3 cursor-pointer">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                          ${a.level === "warn" ? "bg-amber-50 text-amber-700" : "bg-vnd-primary-50 text-vnd-primary-700"}`}>
                          <Icon name={a.level === "warn" ? "warning" : "campaign"} size={16} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-on-surface">{a.title}</p>
                          <p className="text-[12px] text-on-surface-variant mt-0.5">{a.body}</p>
                          <p className="text-[10.5px] text-on-surface-variant/70 mt-1 font-mono">{a.at}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button className="text-on-surface-variant hover:text-vnd-primary-500 transition-colors w-8 h-8 flex items-center justify-center">
              <Icon name="settings" size={22} />
            </button>
            <button className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden flex items-center justify-center" title={ADVISOR.name}>
              <Avatar initials={ADVISOR.initials} size={32} tone="blue" />
            </button>
          </div>
        </div>
      </div>
      <AIBuddyPopover open={aiOpen} onClose={() => setAiOpen(false)} />
    </header>
  );
}

// =============== AI BUDDY POPOVER ===============
const AI_SUGGESTIONS = [
  { icon: "trending_up",  text: "Tóm tắt hiệu suất Q2 của tôi so với region" },
  { icon: "campaign",     text: "KH nào có NAC alert chưa xử lý hôm nay?" },
  { icon: "inventory_2",  text: "Sản phẩm bond yield > 9% kỳ hạn ≤ 24T?" },
  { icon: "people",       text: "Lead nào trong pipeline có cơ hội close > 50% tuần này?" },
  { icon: "school",       text: "Tôi nên ưu tiên skill gap nào để lên BMI-4?" },
  { icon: "warning",      text: "Tôi có vướng compliance nào không?" }
];

function AIBuddyPopover({ open, onClose, embedded = false }) {
  const [thread, setThread] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [thread, busy]);

  // ⌘J / Ctrl+J hot-key
  useEffect(() => {
    if (embedded) return;
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        // toggle via parent (we expect onClose to be a no-op when closed; we just dispatch event)
        document.dispatchEvent(new CustomEvent("__ai-buddy-toggle"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [embedded]);

  const send = (text) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setThread(t => [...t, { role: "user", text: q }]);
    setInput("");
    setBusy(true);
    setTimeout(() => {
      const reply = mockReply(q);
      setThread(t => [...t, reply]);
      setBusy(false);
    }, 900);
  };

  if (!open && !embedded) return null;

  const body = (
    <div className={`flex flex-col ${embedded ? "h-full" : "h-[640px]"} ${embedded ? "" : "bg-white"}`}>
      {/* Head */}
      {!embedded && (
        <div className="px-5 py-4 border-b border-outline-variant/40 flex items-center justify-between bg-gradient-to-r from-vnd-primary-900 via-vnd-primary-700 to-vnd-primary-500 text-white relative overflow-hidden">
          <div className="absolute -top-8 -right-10 w-44 h-44 rounded-full bg-vnd-accent-green/30 blur-3xl"></div>
          <div className="relative flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
              <Icon name="auto_awesome" size={16} filled />
            </span>
            <div>
              <p className="font-display font-semibold text-[14px]">AI Buddy</p>
              <p className="text-[10.5px] text-white/70">Trợ lý dữ liệu hệ thống DSB · Beta</p>
            </div>
          </div>
          <button onClick={onClose} className="relative w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"><Icon name="close" size={18} /></button>
        </div>
      )}

      {/* Conversation */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 py-5 space-y-4 bg-surface-container-low/40">
        {thread.length === 0 && (
          <div className="text-center py-2">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-vnd-primary-700 to-vnd-accent-green text-white items-center justify-center mb-3 shadow-brand">
              <Icon name="auto_awesome" size={28} filled />
            </div>
            <p className="font-display text-title-md text-vnd-primary-900">Xin chào, tôi là AI Buddy</p>
            <p className="text-[12.5px] text-on-surface-variant mt-1 max-w-md mx-auto">Hỏi tôi bất kỳ điều gì về KH, pipeline, sản phẩm, BMI/ICM, NAC… Tôi truy cập trực tiếp dữ liệu DSB.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5 text-left">
              {AI_SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s.text)}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white ring-1 ring-outline-variant/30 hover:ring-vnd-primary-300 hover:bg-vnd-primary-50/50 transition-all text-left group">
                  <span className="w-8 h-8 rounded-lg bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center flex-shrink-0">
                    <Icon name={s.icon} size={16} />
                  </span>
                  <span className="text-[12.5px] text-on-surface font-medium leading-snug">{s.text}</span>
                  <Icon name="arrow_forward" size={14} className="text-on-surface-variant/0 group-hover:text-vnd-primary-500 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        )}

        {thread.map((m, i) => (
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] bg-vnd-primary-500 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-[13.5px] leading-relaxed shadow-xs">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex gap-2.5">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-vnd-primary-700 to-vnd-accent-green text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Icon name="auto_awesome" size={14} filled />
              </span>
              <div className="max-w-[85%]">
                <div className="bg-white ring-1 ring-outline-variant/30 rounded-2xl rounded-tl-sm px-4 py-3 text-[13.5px] leading-relaxed text-on-surface space-y-2.5">
                  {m.intro && <p>{m.intro}</p>}
                  {m.kpis && (
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {m.kpis.map((k, j) => (
                        <div key={j} className="rounded-lg bg-surface-container-low p-2.5 text-center">
                          <p className="text-[9.5px] uppercase tracking-wider text-on-surface-variant font-bold">{k.l}</p>
                          <p className={`font-display font-bold text-headline-sm mt-0.5 font-mono ${k.tone === "green" ? "text-emerald-700" : k.tone === "red" ? "text-red-700" : "text-vnd-primary-900"}`}>{k.v}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {m.list && (
                    <ul className="space-y-1.5 text-[12.5px]">
                      {m.list.map((it, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center flex-shrink-0 text-[9px] font-bold mt-0.5">{j + 1}</span>
                          <span><span className="font-semibold">{it.title}</span>{it.note && <span className="text-on-surface-variant"> — {it.note}</span>}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {m.text && <p>{m.text}</p>}
                  {m.followups && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.followups.map((f, j) => (
                        <button key={j} onClick={() => send(f)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-vnd-primary-50 text-vnd-primary-700 hover:bg-vnd-primary-100 font-medium">{f}</button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-on-surface-variant/70 font-mono mt-1.5">AI Buddy · vừa xong</p>
              </div>
            </div>
          )
        ))}

        {busy && (
          <div className="flex gap-2.5">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-vnd-primary-700 to-vnd-accent-green text-white flex items-center justify-center flex-shrink-0">
              <Icon name="auto_awesome" size={14} filled />
            </span>
            <div className="bg-white ring-1 ring-outline-variant/30 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-vnd-primary-500 animate-pulse-soft"></span>
                <span className="w-2 h-2 rounded-full bg-vnd-primary-500 animate-pulse-soft" style={{ animationDelay: "0.2s" }}></span>
                <span className="w-2 h-2 rounded-full bg-vnd-primary-500 animate-pulse-soft" style={{ animationDelay: "0.4s" }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="px-4 py-3 border-t border-outline-variant/40 bg-white">
        <div className="flex items-end gap-2 bg-surface-container-low rounded-2xl ring-1 ring-outline-variant/30 focus-within:ring-2 focus-within:ring-vnd-primary-500 px-3 py-2 transition-all">
          <textarea
            rows="1" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Hỏi AI Buddy về dữ liệu hệ thống…"
            className="flex-1 bg-transparent outline-none text-[13.5px] resize-none py-1.5 max-h-32 placeholder:text-on-surface-variant/70" />
          <div className="flex items-center gap-1">
            <Button size="icon" tone="ghost" icon="mic" />
            <Button size="icon" tone="primary" icon="send" onClick={() => send()} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 text-[10.5px] text-on-surface-variant flex-wrap">
          <span className="inline-flex items-center gap-1"><Icon name="info" size={11} /> AI Buddy có thể sai. Luôn kiểm tra dữ liệu nhạy cảm trước khi hành động.</span>
          <span className="ml-auto flex items-center gap-2">
            <ChipToggle icon="dataset">Dữ liệu KH</ChipToggle>
            <ChipToggle icon="show_chart">Pipeline</ChipToggle>
            <ChipToggle icon="psychology">Insight</ChipToggle>
          </span>
        </div>
      </div>
    </div>
  );

  if (embedded) return body;

  return (
    <div className="fixed inset-0 z-[55] animate-fade-in">
      <div className="absolute inset-0 bg-vnd-primary-950/30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute top-20 right-6 w-[440px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-lift overflow-hidden animate-slide-in">
        {body}
      </div>
    </div>
  );
}

function mockReply(q) {
  const lower = q.toLowerCase();
  if (lower.includes("q2") || lower.includes("hiệu suất")) {
    return {
      role: "ai",
      intro: "Tóm tắt hiệu suất Quý 2/2026 của bạn so với region South:",
      kpis: [
        { l: "Doanh số", v: "18.4 tỷ", tone: "green" },
        { l: "AUM", v: "184 tỷ", tone: "green" },
        { l: "ICM", v: "+24", tone: "green" }
      ],
      text: "Bạn đang xếp #7/84 advisors region South (Top 8.3%). Vượt 12% so với target được giao, +14.2% so với Q1. Điểm yếu duy nhất: cycle days +0.6 ngày.",
      followups: ["So sánh chi tiết với Top 3", "KH nào kéo cycle dài?", "Plan cải thiện Q3"]
    };
  }
  if (lower.includes("nac") || lower.includes("alert")) {
    return {
      role: "ai",
      intro: "Hôm nay bạn có 18 KH có NAC alert chưa xử lý:",
      list: [
        { title: "P1 (6 KH)", note: "Cần liên hệ trong 24h" },
        { title: "P2 (12 KH)", note: "Theo dõi trong tuần" }
      ],
      text: "Ưu tiên cao: Lê Văn Việt (missed call 08:42), Đỗ Trung Kiên (pending reply 2 ngày), Trần Ngọc Nhi (quá hạn cadence P1).",
      followups: ["Mở danh sách P1", "Soạn outreach hàng loạt", "Lý do KH idle"]
    };
  }
  if (lower.includes("bond") || lower.includes("sản phẩm")) {
    return {
      role: "ai",
      intro: "3 sản phẩm bond yield > 9% kỳ hạn ≤ 24T phù hợp:",
      list: [
        { title: "VIB Trái phiếu DN 24T", note: "8.2% p.a — vẫn dưới 9%" },
        { title: "VPF Tích sản 5 năm", note: "9.4% YTD (mix) — kỳ hạn dài hơn" }
      ],
      text: "Lưu ý: trong AFA hiện tại không có bond pure < 24T với yield > 9%. Đề xuất combo VIB 24T + VPF tích sản.",
      followups: ["KH nào phù hợp combo này?", "Compare risk", "Tạo proposal mẫu"]
    };
  }
  if (lower.includes("pipeline") || lower.includes("lead") || lower.includes("close")) {
    return {
      role: "ai",
      intro: "4 lead trong pipeline có cơ hội close > 50% tuần này:",
      list: [
        { title: "Lê Văn Việt (L-2841)", note: "Stage: Gặp tư vấn · 500M · prob 78%" },
        { title: "Trần Ngọc Nhi (L-2840)", note: "Stage: Đề xuất mở TK · 1.25 tỷ · prob 85%" },
        { title: "Hoàng Thị Mai (L-2835)", note: "Stage: Đặt lịch hẹn · 880M · prob 62%" },
        { title: "Nguyễn Thanh Hà (L-2827)", note: "Stage: Tiếp cận · 660M · prob 55%" }
      ],
      followups: ["Mở Pipeline view", "Next action từng lead", "Tổng weighted value"]
    };
  }
  if (lower.includes("skill") || lower.includes("bmi") || lower.includes("học")) {
    return {
      role: "ai",
      intro: "Để lên BMI-4 vào Q2/2027, tôi đề xuất ưu tiên 3 skill gap:",
      list: [
        { title: "Estate & Legacy", note: "Gap −34 điểm · cần 36h, 2 khoá" },
        { title: "Tax Optimization VN", note: "Gap −26 điểm · cần 24h, 2 khoá" },
        { title: "Behavioral Coaching", note: "Gap −23 điểm · 18h, 1 khoá" }
      ],
      text: "Estate là gap lớn nhất. Đề xuất lộ trình 12 tuần kết hợp khoá học + case study + mentor session với Trần Hồng Vân.",
      followups: ["Tạo plan 12 tuần", "Đăng ký khoá Estate", "Đặt lịch mentor"]
    };
  }
  if (lower.includes("compliance") || lower.includes("aml") || lower.includes("kyc")) {
    return {
      role: "ai",
      text: "Hiện tại bạn có 1 cảnh báo Compliance: Chứng chỉ LIC hết hạn Q4/2025, cần đăng ký renewal trước 30/11. Tất cả KH trong portfolio đều có KYC valid và AML clear.",
      followups: ["Đăng ký renewal LIC", "Audit trail 7 ngày"]
    };
  }
  return {
    role: "ai",
    text: "Mình đã hiểu câu hỏi của bạn. Trong phiên prototype này, mình demo phản hồi cho một số chủ đề: hiệu suất Q2, NAC alert, sản phẩm bond, pipeline lead, skill gap, compliance. Bạn thử các gợi ý phía trên nhé.",
    followups: AI_SUGGESTIONS.slice(0, 3).map(s => s.text)
  };
}

// =============== SECONDARY HORIZONTAL NAV ===============
function SecondaryNav({ compass, subNav, active, onNavigate }) {
  return (
    <nav className="bg-surface-container-lowest border-b border-outline-variant/30 sticky top-16 z-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="max-w-[1440px] mx-auto px-gutter flex items-center h-12 gap-unit-8">
        {subNav.map((item, i) => {
          const isActive = item.id === active;
          return (
            <span key={item.id} className="contents">
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
                className={`font-display font-medium relative flex items-center h-full transition-colors text-[14px]
                  ${isActive ? "text-vnd-primary-500" : "text-on-surface-variant hover:text-vnd-primary-500"}`}>
                {item.label}
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-vnd-primary-500"></span>}
              </a>
              {i < subNav.length - 1 && <div className="w-px h-4 bg-outline-variant"></div>}
            </span>
          );
        })}
        <div className="ml-auto pl-4 flex items-center gap-2 text-[11.5px] text-on-surface-variant">
          <Icon name={compass.icon} size={14} style={{ color: compass.color }} />
          <span><span className="font-semibold text-vnd-primary-900">{compass.label}</span> · {compass.question}</span>
        </div>
      </div>
    </nav>
  );
}

// =============== PageHeader & Page (unchanged API; sticky offset adjusts below SecondaryNav) ===============
function PageHeader({ eyebrow, title, sub, actions, tabs, tabValue, onTab, sticky = false }) {
  return (
    <div className={`bg-white border-b border-outline-variant/40 ${sticky ? "sticky top-[112px] z-10" : ""}`}>
      <div className="px-8 pt-6 pb-3 flex items-start justify-between gap-6 flex-wrap max-w-[1440px] mx-auto">
        <div>
          {eyebrow && <p className="text-[11px] uppercase tracking-[0.14em] font-bold text-vnd-primary-500/80">{eyebrow}</p>}
          <h1 className="font-display text-headline-lg text-vnd-primary-900 mt-1">{title}</h1>
          {sub && <p className="text-body-md text-on-surface-variant mt-1 max-w-3xl">{sub}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
      {tabs && tabs.length > 0 && (
        <div className="px-8 max-w-[1440px] mx-auto">
          <Tabs value={tabValue} onChange={onTab} tabs={tabs} />
        </div>
      )}
    </div>
  );
}

function Page({ children, className = "", wide = false }) {
  return (
    <div className={`px-8 py-6 ${wide ? "" : "max-w-[1440px]"} mx-auto ${className}`}>{children}</div>
  );
}

Object.assign(window, { AppShell, Sidebar, TopBar, SecondaryNav, PageHeader, Page, AIBuddyPopover, mockReply, AI_SUGGESTIONS });
