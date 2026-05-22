/* global React, ReactDOM, window */
const {
  AppShell, ToastProvider,
  ScreenDworkDashboard, ScreenDworkClients, ScreenDworkOmni,
  ScreenDworkProduct, ScreenDworkTools, ScreenDworkHelpdesk, ScreenDworkCompliance,
  ScreenILead, ScreenDLink, ScreenDAccount
} = window;

const DEFAULT_ROUTE = "ilead/onboarding";

function App() {
  const [route, setRoute] = useState(() => {
    const h = window.location.hash.replace(/^#\/?/, "");
    return h || DEFAULT_ROUTE;
  });
  const [compact, setCompact] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  // hot-key toggle
  useEffect(() => {
    const onToggle = () => setAiOpen(o => !o);
    document.addEventListener("__ai-buddy-toggle", onToggle);
    return () => document.removeEventListener("__ai-buddy-toggle", onToggle);
  }, []);

  // hash sync
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace(/^#\/?/, "");
      if (h) setRoute(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (r) => {
    setRoute(r);
    window.location.hash = "#/" + r;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Tweaks bridge
  useEffect(() => {
    const onMsg = (e) => {
      const t = e.data?.type;
      if (t === "__activate_edit_mode") setTweaksOpen(true);
      else if (t === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // route → screen
  let screen = null;
  const [compass, sub] = route.split("/");
  const screenId = route;
  if (compass === "dwork") {
    if (sub === "dashboard")  screen = <ScreenDworkDashboard onNavigate={navigate} />;
    else if (sub === "bi")       screen = <ScreenAIBuddy />;
    else if (sub === "clients")  screen = <ScreenDworkClients onNavigate={navigate} />;
    else if (sub === "omni")     screen = <ScreenDworkOmni />;
    else if (sub === "product")  screen = <ScreenDworkProduct />;
    else if (sub === "tools")    screen = <ScreenDworkTools />;
    else if (sub === "helpdesk") screen = <ScreenDworkHelpdesk />;
    else screen = <ScreenDworkDashboard onNavigate={navigate} />;
  } else if (compass === "ilead") {
    screen = <ScreenILead screen={screenId} />;
  } else if (compass === "dlink") {
    screen = <ScreenDLink screen={screenId} />;
  } else if (compass === "daccount") {
    screen = <ScreenDAccount screen={screenId} />;
  } else {
    screen = <ScreenDworkDashboard onNavigate={navigate} />;
  }

  return (
    <ToastProvider>
      <AppShell route={route} onNavigate={navigate} compact={compact} setCompact={setCompact}>
        {screen}
      </AppShell>
      {tweaksOpen && <TweaksPanel
        onClose={() => { setTweaksOpen(false); window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); }}
        compact={compact} setCompact={setCompact}
        route={route} setRoute={navigate}
      />}
      <AIBuddyPopover open={aiOpen} onClose={() => setAiOpen(false)} />
    </ToastProvider>
  );
}

// =============== BI AUTOMATION SCREEN (embedded AI Buddy) ===============
function ScreenAIBuddy() {
  return (
    <>
      <PageHeader
        eyebrow="dWork · BI Automation"
        title="AI Buddy"
        sub="Hỏi mọi điều về KH, pipeline, sản phẩm, BMI/ICM, NAC, performance — AI Buddy có ngữ cảnh đầy đủ trên DSB."
        actions={
          <>
            <Button tone="ghost" size="sm" icon="history">Lịch sử hỏi</Button>
            <Button tone="outline" size="sm" icon="dataset">Nguồn dữ liệu</Button>
            <Button tone="primary" size="sm" icon="add">Cuộc trò chuyện mới</Button>
          </>
        }
      />
      <Page wide>
        <div className="grid grid-cols-12 gap-5 h-[calc(100vh-220px)] min-h-[560px]">
          {/* Left rail: history & topics */}
          <aside className="col-span-12 lg:col-span-3 bg-white rounded-2xl ring-1 ring-outline-variant/30 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-outline-variant/30">
              <TextField icon="search" placeholder="Tìm cuộc hỏi…" />
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="px-4 py-3">
                <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Hôm nay</p>
                <ul className="space-y-1">
                  {[
                    "Tóm tắt hiệu suất Q2",
                    "KH P1 cần liên hệ",
                    "Lead close prob > 50%"
                  ].map((t, i) => (
                    <li key={i}>
                      <button className={`w-full text-left text-[12.5px] px-2.5 py-2 rounded-lg flex items-center gap-2 ${i === 0 ? "bg-vnd-primary-50 text-vnd-primary-700 font-semibold" : "hover:bg-surface-container-low text-on-surface-variant"}`}>
                        <Icon name="chat" size={14} /><span className="truncate">{t}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-4 py-3 border-t border-outline-variant/20">
                <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Tuần trước</p>
                <ul className="space-y-1">
                  {[
                    "Skill gap để lên BMI-4",
                    "Sản phẩm bond > 9% yield",
                    "AML alert handling"
                  ].map((t, i) => (
                    <li key={i}>
                      <button className="w-full text-left text-[12.5px] px-2.5 py-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant flex items-center gap-2">
                        <Icon name="chat" size={14} /><span className="truncate">{t}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-4 py-4 border-t border-outline-variant/20">
                <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Topics gợi ý</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Pipeline", "Performance", "Compliance", "Products", "Network", "Training"].map(t => (
                    <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-surface-container-low text-on-surface-variant ring-1 ring-outline-variant/40">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-outline-variant/30 bg-surface-container-low/50">
              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                <Icon name="info" size={13} />
                <span>14 cuộc hỏi tuần này · 3.2 phút/cuộc</span>
              </div>
            </div>
          </aside>

          {/* Main chat embedded */}
          <section className="col-span-12 lg:col-span-9 bg-white rounded-2xl ring-1 ring-outline-variant/30 overflow-hidden">
            <AIBuddyPopover open={true} embedded={true} />
          </section>
        </div>
      </Page>
    </>
  );
}

// =============== TWEAKS PANEL ===============
function TweaksPanel({ onClose, compact, setCompact, route, setRoute }) {
  return (
    <div className="fixed bottom-6 right-6 z-[55] w-[300px] bg-white rounded-2xl shadow-lift ring-1 ring-vnd-primary-900/10 overflow-hidden animate-slide-in">
      <div className="bg-vnd-primary-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="palette" size={18} className="text-vnd-accent-green" />
          <p className="font-display font-semibold text-[13px]">Tweaks</p>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white"><Icon name="close" size={18} /></button>
      </div>
      <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
        <div>
          <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Sidebar</p>
          <Toggle on={compact} onChange={setCompact} label="Compact (icon only)" hint="Thu gọn sidebar còn icon" />
        </div>
        <div>
          <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Đi nhanh đến…</p>
          <div className="space-y-1">
            {[
              { id: "dwork/dashboard", l: "dWork — Dashboard" },
              { id: "dwork/bi", l: "dWork — BI Automation (AI Buddy)" },
              { id: "dwork/clients", l: "dWork — Client Zone" },
              { id: "dwork/omni", l: "dWork — Omnichannel" },
              { id: "dwork/product", l: "dWork — Product Zone" },
              { id: "dwork/tools", l: "dWork — Tool Zone" },
              { id: "dwork/helpdesk", l: "dWork — Helpdesk" },
              { id: "ilead/onboarding", l: "iLead — Onboarding" },
              { id: "ilead/bmi",  l: "iLead — BMI Track" },
              { id: "ilead/icm",  l: "iLead — ICM Track" },
              { id: "ilead/cert", l: "iLead — Cert + IDP" },
              { id: "dlink/ilead",     l: "dLink — iLead Network" },
              { id: "dlink/dwork",     l: "dLink — dWork Network" },
              { id: "daccount/depth", l: "dAccount — Depth" },
              { id: "daccount/kpi", l: "dAccount — KPI Dashboard" },
              { id: "daccount/benchmarks", l: "dAccount — Benchmarks" }
            ].map(r => (
              <button key={r.id} onClick={() => setRoute(r.id)}
                className={`w-full text-left text-[12.5px] px-2.5 py-1.5 rounded-md transition-colors
                  ${route === r.id ? "bg-vnd-primary-50 text-vnd-primary-700 font-semibold" : "hover:bg-surface-container-low text-on-surface-variant"}`}>
                {r.l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
