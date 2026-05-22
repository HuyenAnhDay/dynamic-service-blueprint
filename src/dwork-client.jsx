/* global React, window */
const { PIPELINE_STAGES, LEADS, ACTIVE_CLIENTS, INTERACTIONS, ALLOCATION, ONBOARD_STEPS } = window.DSB_DATA;

// ============== CLIENT ZONE WRAPPER ==============
function ScreenDworkClients({ onNavigate }) {
  const [stage, setStage] = useState("pipeline"); // pipeline | profile
  const [profileId, setProfileId] = useState(null);

  return (
    <>
      <PageHeader
        eyebrow="dWork · Client Zone"
        title="Khách hàng & Pipeline"
        sub="Quản lý cơ hội theo Pipeline và xem 360° hồ sơ Active Clients."
        actions={
          <>
            <Button tone="ghost" size="sm" icon="filter_list">Bộ lọc</Button>
            <Button tone="outline" size="sm" icon="upload_file">Import lead</Button>
            <Button tone="primary" size="sm" icon="add">Lead mới</Button>
          </>
        }
        tabs={[
          { id: "pipeline", label: "Pipeline view", icon: "stacks", count: LEADS.length },
          { id: "profile",  label: "Profile view",  icon: "diversity_3", count: ACTIVE_CLIENTS.length }
        ]}
        tabValue={stage} onTab={setStage}
      />
      {stage === "pipeline" && <LeadKanban onNavigate={onNavigate} />}
      {stage === "profile"  && <ActiveClients onOpen={setProfileId} />}
      <ClientProfileDrawer id={profileId} onClose={() => setProfileId(null)} />
    </>
  );
}

// ============== LEAD KANBAN ==============
function LeadKanban() {
  const [board, setBoard] = useState(() => {
    const map = {};
    PIPELINE_STAGES.forEach(s => map[s.id] = LEADS.filter(l => l.stage === s.id));
    return map;
  });
  const [dragId, setDragId] = useState(null);
  const [filter, setFilter] = useState({ priority: "all", hot: false, owner: "me" });
  const [detail, setDetail] = useState(null);
  const toast = useToast();

  const onDragStart = (lead) => (e) => {
    setDragId(lead.id);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const onDrop = (stageId) => (e) => {
    e.preventDefault();
    setBoard(prev => {
      const next = { ...prev };
      let moved = null;
      for (const k of Object.keys(next)) {
        const idx = next[k].findIndex(l => l.id === dragId);
        if (idx >= 0) { moved = { ...next[k][idx], stage: stageId }; next[k] = next[k].filter(l => l.id !== dragId); }
      }
      if (moved) next[stageId] = [moved, ...next[stageId]];
      return next;
    });
    setDragId(null);
    toast?.("Đã chuyển stage", { tone: "success", icon: "swap_horiz" });
  };

  const totalValue = Object.values(board).flat().reduce((s, l) => s + l.value, 0);

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <FilterBar>
          <ChipToggle active={filter.priority === "all"} onClick={() => setFilter(f => ({ ...f, priority: "all" }))}>Tất cả</ChipToggle>
          <ChipToggle active={filter.priority === "P1"} onClick={() => setFilter(f => ({ ...f, priority: "P1" }))} icon="circle">P1</ChipToggle>
          <ChipToggle active={filter.priority === "P2"} onClick={() => setFilter(f => ({ ...f, priority: "P2" }))} icon="circle">P2</ChipToggle>
          <ChipToggle active={filter.hot} onClick={() => setFilter(f => ({ ...f, hot: !f.hot }))} icon="local_fire_department">Hot only</ChipToggle>
          <div className="w-px h-5 bg-outline-variant mx-1"></div>
          <ChipToggle active={filter.owner === "me"} onClick={() => setFilter(f => ({ ...f, owner: "me" }))} icon="person">Của tôi</ChipToggle>
          <ChipToggle active={filter.owner === "team"} onClick={() => setFilter(f => ({ ...f, owner: "team" }))} icon="groups">Cả team</ChipToggle>
        </FilterBar>
        <div className="flex items-center gap-3 text-[12.5px]">
          <span className="text-on-surface-variant">Pipeline value:</span>
          <span className="font-display font-bold text-vnd-primary-900 text-headline-sm font-mono">{(totalValue / 1000).toFixed(2)} tỷ</span>
          <span className="w-px h-4 bg-outline-variant"></span>
          <Button tone="ghost" size="sm" icon="dashboard">Kanban</Button>
          <Button tone="ghost" size="sm" icon="view_list">List</Button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 min-w-0 overflow-x-auto pb-4 scrollbar-thin">
        {PIPELINE_STAGES.map((s, idx) => {
          const cards = (board[s.id] || []).filter(l =>
            (filter.priority === "all" || l.priority === filter.priority) &&
            (!filter.hot || l.tag === "Hot")
          );
          return (
            <div key={s.id} className="min-w-[260px] flex flex-col"
              onDragOver={onDragOver} onDrop={onDrop(s.id)}>
              <div className={`px-3 py-2.5 rounded-t-xl border ${s.accent} ${s.tint}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white/70 text-[11px] font-bold text-vnd-primary-900 flex items-center justify-center font-mono">{idx + 1}</span>
                    <p className="font-display font-semibold text-[13px] text-vnd-primary-900">{s.label}</p>
                  </div>
                  <span className="text-[11px] font-mono text-on-surface-variant bg-white/70 rounded-md px-1.5 py-0.5">{cards.length}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1 font-mono">{s.value}</p>
              </div>
              <div className={`flex-1 min-h-[400px] p-2 space-y-2 bg-surface-container-low/60 rounded-b-xl border border-t-0 ${s.accent}`}>
                {cards.map(l => (
                  <article
                    key={l.id} draggable
                    onClick={() => setDetail(l)}
                    onDragStart={onDragStart(l)}
                    className={`kanban-card bg-white rounded-lg p-3 ring-1 ring-outline-variant/30 hover:shadow-lift hover:ring-vnd-primary-300 cursor-grab transition-all ${dragId === l.id ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar initials={l.avatarSeed} size={28} tone={["blue","green","amber","purple","slate","rose"][LEADS.indexOf(l) % 6]} />
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-semibold text-on-surface truncate">{l.name}</p>
                          <p className="text-[10.5px] text-on-surface-variant truncate">{l.company}</p>
                        </div>
                      </div>
                      <PriorityPill level={l.priority} />
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="font-mono text-[12.5px] font-bold text-vnd-primary-900">
                        {l.value >= 1000 ? `${(l.value/1000).toFixed(2)}T` : `${l.value}M`}
                      </span>
                      {l.tag === "Hot" && <Badge tone="red" size="xs" icon="local_fire_department">Hot</Badge>}
                      {l.tag === "VIP" && <Badge tone="purple" size="xs" icon="diamond">VIP</Badge>}
                    </div>
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-outline-variant/30">
                      <span className="text-[10.5px] text-on-surface-variant truncate">{l.source}</span>
                      <span className="text-[10.5px] text-on-surface-variant font-mono">{l.lastTouch}</span>
                    </div>
                  </article>
                ))}
                <button className="w-full py-2 rounded-lg border border-dashed border-outline-variant/60 text-[11.5px] text-on-surface-variant hover:bg-white hover:border-vnd-primary-500 hover:text-vnd-primary-700 transition-colors">
                  + Thêm lead
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <LeadDetailModal lead={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

function LeadDetailModal({ lead, onClose }) {
  if (!lead) return null;
  return (
    <Modal open={!!lead} onClose={onClose} title={lead.name} sub={`${lead.company} · ${lead.id}`}
      size="lg"
      footer={
        <>
          <Button tone="ghost" onClick={onClose}>Đóng</Button>
          <Button tone="outline" icon="event">Đặt lịch</Button>
          <Button tone="primary" icon="arrow_forward">Chuyển stage tiếp</Button>
        </>
      }>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-7 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <PriorityPill level={lead.priority} />
            <Badge tone="blue" size="sm" icon="source">{lead.source}</Badge>
            {lead.tag === "Hot" && <Badge tone="red" size="sm" icon="local_fire_department">Hot lead</Badge>}
            {lead.nac && <Badge tone="amber" size="sm" icon="campaign">NAC Alert</Badge>}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">Ghi chú gần nhất</p>
            <p className="text-[14px] text-on-surface mt-1.5">{lead.note}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <KV label="SĐT" value={lead.phone} icon="call" />
            <KV label="Last touch" value={lead.lastTouch} icon="schedule" />
            <KV label="Giá trị dự kiến" value={`${lead.value >= 1000 ? (lead.value/1000).toFixed(2)+" tỷ" : lead.value+" tr"}`} icon="payments" />
            <KV label="Nguồn" value={lead.source} icon="route" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mb-2">Action ngắn</p>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" tone="outline" icon="call">Gọi</Button>
              <Button size="sm" tone="outline" icon="chat">Zalo</Button>
              <Button size="sm" tone="outline" icon="mail">Email</Button>
              <Button size="sm" tone="outline" icon="event">Đặt lịch hẹn</Button>
              <Button size="sm" tone="soft" icon="auto_awesome">AI: soạn outreach</Button>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-5">
          <div className="rounded-xl bg-surface-container-low p-4">
            <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mb-3">Stage hiện tại</p>
            <ol className="space-y-2">
              {PIPELINE_STAGES.map((s, i) => {
                const idx = PIPELINE_STAGES.findIndex(x => x.id === lead.stage);
                const done = i < idx, current = i === idx;
                return (
                  <li key={s.id} className={`flex items-center gap-2.5 text-[12.5px]
                    ${current ? "text-vnd-primary-900 font-semibold" : done ? "text-emerald-700" : "text-on-surface-variant"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                      ${current ? "bg-vnd-primary-500 text-white" : done ? "bg-emerald-500 text-white" : "bg-surface-container-high text-on-surface-variant"}`}>
                      {done ? <Icon name="check" size={12} /> : i + 1}
                    </span>
                    <span className="flex-1">{s.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function KV({ label, value, icon }) {
  return (
    <div className="rounded-lg bg-surface-container-low/80 p-3">
      <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold flex items-center gap-1.5">
        {icon && <Icon name={icon} size={12} />}{label}
      </p>
      <p className="text-[13.5px] font-semibold text-on-surface mt-1">{value}</p>
    </div>
  );
}

// ============== ONBOARDING STEPPER ==============
function OnboardingStepper() {
  const [activeCase, setActiveCase] = useState(0);
  const cases = [
    { client: "Trần Ngọc Nhi", id: "ON-441", progress: 57, current: "Risk Profiling", since: "2 ngày" },
    { client: "Phạm Quốc Bảo", id: "ON-440", progress: 28, current: "AML/PEP Check", since: "5 ngày" },
    { client: "Hoàng Thị Mai", id: "ON-438", progress: 86, current: "Cấp tài khoản", since: "Hôm nay" }
  ];
  return (
    <div className="px-8 py-6 grid grid-cols-12 gap-5">
      <Card className="col-span-12 lg:col-span-3 p-3">
        <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold px-3 mb-2">Onboard đang chạy · 3</p>
        <ul className="space-y-1">
          {cases.map((c, i) => (
            <li key={c.id}>
              <button onClick={() => setActiveCase(i)}
                className={`w-full text-left p-3 rounded-xl transition-all
                  ${activeCase === i ? "bg-vnd-primary-50 ring-1 ring-vnd-primary-200" : "hover:bg-surface-container-low"}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-semibold text-on-surface">{c.client}</span>
                  <Badge tone={activeCase === i ? "blue" : "neutral"} size="xs">{c.id}</Badge>
                </div>
                <p className="text-[11px] text-on-surface-variant mb-2">Đang: {c.current} · {c.since}</p>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-vnd-primary-500 rounded-full transition-all" style={{ width: c.progress + "%" }}></div>
                </div>
                <p className="text-[10.5px] font-mono text-on-surface-variant mt-1">{c.progress}% · 4/7 bước</p>
              </button>
            </li>
          ))}
          <li>
            <button className="w-full p-3 rounded-xl border border-dashed border-outline-variant text-[12px] text-on-surface-variant hover:border-vnd-primary-500 hover:text-vnd-primary-700">
              <Icon name="add" size={14} className="inline mr-1" />Khởi tạo onboard mới
            </button>
          </li>
        </ul>
      </Card>

      <Card className="col-span-12 lg:col-span-9 p-7">
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-vnd-primary-500/80 font-bold">Onboarding · ON-441</p>
            <h2 className="font-display text-headline-md text-vnd-primary-900 mt-1">Trần Ngọc Nhi · Boutique 21</h2>
            <p className="text-[13px] text-on-surface-variant mt-1">Bắt đầu 14/05/2026 · SLA còn 3 ngày · 4/7 bước hoàn tất</p>
          </div>
          <div className="flex gap-2">
            <Button tone="outline" size="sm" icon="description">Hồ sơ KH</Button>
            <Button tone="primary" size="sm" icon="check_circle">Đánh dấu hoàn tất bước</Button>
          </div>
        </div>

        {/* Stepper visual */}
        <ol className="grid grid-cols-7 mb-8">
          {ONBOARD_STEPS.map((s, i) => {
            const state = s.state;
            const styles = {
              done: { circle: "bg-emerald-500 text-white", bar: "bg-emerald-500", text: "text-emerald-700" },
              current: { circle: "bg-vnd-primary-500 text-white ring-4 ring-vnd-primary-200 animate-pulse-soft", bar: "bg-surface-container-high", text: "text-vnd-primary-900" },
              pending: { circle: "bg-surface-container-high text-on-surface-variant", bar: "bg-surface-container-high", text: "text-on-surface-variant" }
            }[state];
            return (
              <li key={s.id} className="relative flex flex-col items-center text-center pb-1">
                {i < ONBOARD_STEPS.length - 1 && (
                  <span className={`absolute top-4 left-1/2 right-[-50%] h-0.5 ${i < ONBOARD_STEPS.findIndex(x => x.state === "current") ? "bg-emerald-500" : "bg-surface-container-high"}`}></span>
                )}
                <span className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-[12px] ${styles.circle}`}>
                  {state === "done" ? <Icon name="check" size={16} weight={600} /> : s.id}
                </span>
                <span className={`mt-2 text-[11px] font-semibold leading-tight max-w-[100px] ${styles.text}`}>{s.label}</span>
                {s.gate && <Badge tone="amber" size="xs" className="mt-1.5" icon="security">Gate</Badge>}
              </li>
            );
          })}
        </ol>

        {/* Step detail */}
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-7 rounded-2xl ring-1 ring-vnd-primary-200 bg-vnd-primary-50/60 p-5">
            <div className="flex items-center gap-3 mb-3">
              <Badge tone="blue" size="sm" icon="bolt">Đang xử lý</Badge>
              <h4 className="font-display text-title-md text-vnd-primary-900">Bước 4 · Risk Profiling</h4>
            </div>
            <p className="text-[13px] text-on-surface mb-4">KH đang hoàn thành bộ câu hỏi xác định khẩu vị rủi ro (20 câu).</p>
            <div className="rounded-xl bg-white p-4 ring-1 ring-outline-variant/30">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12.5px] font-semibold">Tiến độ KH thực hiện</p>
                <span className="font-mono text-[12px] font-bold text-vnd-primary-700">12/20 câu</span>
              </div>
              <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-vnd-primary-500 rounded-full" style={{ width: "60%" }}></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {["Risk Tolerance","Time Horizon","Liquidity Need"].map((c, i) => (
                  <div key={c} className="text-center rounded-lg bg-surface-container-low p-2">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">{c}</p>
                    <p className="font-display font-bold text-[14px] text-vnd-primary-900 mt-1">{["Trung bình","8 năm","Thấp"][i]}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" tone="primary" icon="send">Nhắc KH hoàn thành</Button>
              <Button size="sm" tone="ghost" icon="open_in_new">Mở form KH</Button>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 space-y-3">
            <div className="rounded-2xl ring-1 ring-outline-variant/30 p-5">
              <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mb-3">Compliance Gates</p>
              <ul className="space-y-2.5">
                {[
                  { label: "eKYC", state: "done", note: "Liveness pass" },
                  { label: "AML / PEP", state: "done", note: "Watchlist clear" },
                  { label: "Risk Profile", state: "current", note: "60% hoàn tất" },
                  { label: "Source of funds", state: "pending", note: "Pending" }
                ].map((g, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full
                      ${g.state === "done" ? "bg-emerald-500" : g.state === "current" ? "bg-vnd-primary-500 animate-pulse-soft" : "bg-outline-variant"}`}></span>
                    <span className="flex-1 text-[12.5px] font-medium">{g.label}</span>
                    <span className="text-[11px] text-on-surface-variant">{g.note}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-vnd-primary-900 text-white p-5">
              <p className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">Handoff dự kiến</p>
              <p className="font-display text-title-md mt-1">Trần Quân (CA)</p>
              <p className="text-[11.5px] text-white/70 mt-1">17/05/2026 · sau khi hoàn tất bước 7</p>
              <Button size="xs" tone="ghost" className="bg-white/10 text-white mt-3" icon="forward">Chuyển sớm</Button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-7">
          <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mb-3">Lịch sử các bước</p>
          <ol className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/40">
            {ONBOARD_STEPS.map(s => (
              <li key={s.id} className="relative">
                <span className={`absolute -left-[18px] top-1 w-3 h-3 rounded-full ring-4 ring-white
                  ${s.state === "done" ? "bg-emerald-500" : s.state === "current" ? "bg-vnd-primary-500" : "bg-outline-variant"}`}></span>
                <div className="flex items-center justify-between text-[13px]">
                  <p>
                    <span className="font-semibold text-on-surface">{s.label}</span>
                    <span className="text-on-surface-variant ml-2 text-[12px]">— {s.note}</span>
                  </p>
                  <span className="font-mono text-[11.5px] text-on-surface-variant">{s.at}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Card>
    </div>
  );
}

// ============== ACTIVE CLIENTS LIST ==============
function ActiveClients({ onOpen }) {
  const [q, setQ] = useState("");
  const [seg, setSeg] = useState("all");
  const [sortKey, setSortKey] = useState("nav");
  const [sortAsc, setSortAsc] = useState(false);

  const items = useMemo(() => {
    let list = ACTIVE_CLIENTS.filter(c =>
      (!q || c.name.toLowerCase().includes(q.toLowerCase()) || c.company.toLowerCase().includes(q.toLowerCase())) &&
      (seg === "all" || c.segment === seg)
    );
    list = list.slice().sort((a, b) => {
      const A = a[sortKey], B = b[sortKey];
      const cmp = typeof A === "number" ? A - B : String(A).localeCompare(String(B));
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [q, seg, sortKey, sortAsc]);

  const Th = ({ k, children, right }) => (
    <th className={`pb-3 text-[10.5px] uppercase tracking-wider font-semibold text-on-surface-variant ${right ? "text-right" : ""}`}>
      <button className="inline-flex items-center gap-1 hover:text-vnd-primary-700"
        onClick={() => { setSortKey(k); setSortAsc(s => sortKey === k ? !s : false); }}>
        {children}
        {sortKey === k && <Icon name={sortAsc ? "arrow_upward" : "arrow_downward"} size={12} />}
      </button>
    </th>
  );

  return (
    <div className="px-8 py-6">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <TextField icon="search" placeholder="Tìm KH, công ty…" value={q} onChange={e => setQ(e.target.value)} className="w-72" />
        <FilterBar>
          <ChipToggle active={seg === "all"} onClick={() => setSeg("all")}>Tất cả</ChipToggle>
          <ChipToggle active={seg === "Private Wealth"} onClick={() => setSeg("Private Wealth")} icon="diamond">Private Wealth</ChipToggle>
          <ChipToggle active={seg === "Mass Affluent"} onClick={() => setSeg("Mass Affluent")} icon="account_balance">Mass Affluent</ChipToggle>
          <ChipToggle active={seg === "Emerging Affluent"} onClick={() => setSeg("Emerging Affluent")} icon="trending_up">Emerging</ChipToggle>
        </FilterBar>
        <div className="ml-auto flex items-center gap-2 text-[12.5px] text-on-surface-variant">
          <span>{items.length} KH</span>
          <span className="w-px h-4 bg-outline-variant"></span>
          <Button tone="ghost" size="sm" icon="view_list">List</Button>
          <Button tone="ghost" size="sm" icon="grid_view">Grid</Button>
        </div>
      </div>

      <Card padded={false} className="overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-surface-container-low">
            <tr className="text-left">
              <th className="pb-3 pt-3 pl-5 text-[10.5px] uppercase tracking-wider font-semibold text-on-surface-variant">Khách hàng</th>
              <Th k="segment">Segment</Th>
              <Th k="cadence">Cadence</Th>
              <th className="pb-3 pt-3 text-[10.5px] uppercase tracking-wider font-semibold text-on-surface-variant">Flags</th>
              <Th k="nav" right>NAV (tr)</Th>
              <Th k="pnlYtd" right>P&L YTD</Th>
              <Th k="roi" right>ROI vs BM</Th>
              <th className="pb-3 pt-3 pr-5 text-right text-[10.5px] uppercase tracking-wider font-semibold text-on-surface-variant">Owners</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {items.map((c, i) => (
              <tr key={c.id} className="hover:bg-vnd-primary-50/40 cursor-pointer group" onClick={() => onOpen(c.id)}>
                <td className="py-3 pl-5">
                  <div className="flex items-center gap-3">
                    <Avatar initials={c.initials} size={36} tone={["blue","green","amber","purple","slate","rose"][i % 6]} />
                    <div>
                      <p className="font-display font-semibold text-on-surface">{c.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{c.company} · {c.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3"><Badge tone={c.segment === "Private Wealth" ? "purple" : c.segment === "Mass Affluent" ? "blue" : "green"} size="sm">{c.segment}</Badge></td>
                <td className="py-3 text-on-surface-variant">{c.cadence}</td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    {c.flags.missedCall && <span title="Missed call" className="w-6 h-6 rounded-md bg-red-50 text-red-600 flex items-center justify-center"><Icon name="phone_missed" size={14} /></span>}
                    {c.flags.pendingReply && <span title="Pending reply" className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center"><Icon name="schedule" size={14} /></span>}
                    {!c.flags.missedCall && !c.flags.pendingReply && <span className="text-on-surface-variant/60 text-[12px]">—</span>}
                  </div>
                </td>
                <td className="py-3 text-right font-mono font-semibold text-vnd-primary-900">{c.nav.toLocaleString("vi-VN")}</td>
                <td className={`py-3 text-right font-mono font-semibold ${c.pnlYtd >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                  {c.pnlYtd >= 0 ? "+" : ""}{c.pnlYtd}%
                </td>
                <td className={`py-3 text-right font-mono ${c.roi - c.benchmark >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                  {c.roi - c.benchmark >= 0 ? "+" : ""}{(c.roi - c.benchmark).toFixed(1)}pp
                </td>
                <td className="py-3 pr-5 text-right">
                  <div className="inline-flex -space-x-1.5">
                    {c.owners.slice(0, 2).map((o, j) => (
                      <span key={j} className="w-6 h-6 rounded-full bg-vnd-primary-100 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-vnd-primary-900">
                        {o.split(" ").slice(-1)[0][0]}
                      </span>
                    ))}
                    {c.owners.length > 2 && <span className="w-6 h-6 rounded-full bg-surface-container-high ring-2 ring-white text-[10px] flex items-center justify-center text-on-surface-variant">+{c.owners.length-2}</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ============== CLIENT PROFILE DRAWER (4 tabs) ==============
function ClientProfileDrawer({ id, onClose }) {
  const client = ACTIVE_CLIENTS.find(c => c.id === id);
  const [tab, setTab] = useState("dgo");
  const [logOpen, setLogOpen] = useState(null);
  const toast = useToast();
  if (!client) return null;
  return (
    <Drawer open={!!client} onClose={onClose} width={920}>
      {/* Header */}
      <div className="bg-mesh-blue px-7 pt-6 pb-5 border-b border-outline-variant/40">
        <div className="flex items-start gap-4">
          <Avatar initials={client.initials} size={64} tone="blue" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-headline-md text-vnd-primary-900">{client.name}</h2>
              <Badge tone="purple" size="sm">{client.segment}</Badge>
              <Badge tone="blue" size="sm" icon="schedule">Cadence {client.cadence}</Badge>
              {client.flags.missedCall && <Badge tone="red" size="sm" icon="phone_missed">Missed call</Badge>}
              {client.flags.pendingReply && <Badge tone="amber" size="sm" icon="schedule">Pending reply</Badge>}
            </div>
            <p className="text-[13px] text-on-surface-variant mt-1">{client.company} · KH từ {client.joinedAt} · ID {client.id}</p>
            <div className="flex items-center gap-4 mt-2 text-[12px] text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5"><Icon name="call" size={14} />{client.phone}</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="mail" size={14} />{client.email}</span>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/70 hover:bg-white text-on-surface-variant flex items-center justify-center">
            <Icon name="close" size={20} />
          </button>
        </div>
        {/* Communication toolbar */}
        <div className="flex items-center gap-2 mt-5 flex-wrap">
          <Button tone="primary" size="sm" icon="call" onClick={() => setLogOpen("call")}>Gọi</Button>
          <Button tone="outline" size="sm" icon="chat" onClick={() => setLogOpen("zalo")}>Zalo</Button>
          <Button tone="outline" size="sm" icon="mail" onClick={() => setLogOpen("email")}>Email</Button>
          <Button tone="outline" size="sm" icon="videocam" onClick={() => setLogOpen("video")}>Video</Button>
          <Button tone="outline" size="sm" icon="event" onClick={() => setLogOpen("schedule")}>Schedule</Button>
          <span className="ml-auto inline-flex items-center gap-2 text-[12px] text-on-surface-variant">
            <Icon name="info" size={14} /> Action sẽ tự log vào Interaction History
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-7 border-b border-outline-variant/40">
        <Tabs value={tab} onChange={setTab} tabs={[
          { id: "dgo", label: "DGO", icon: "shield_person" },
          { id: "dinvest", label: "Dinvest", icon: "show_chart" },
          { id: "dlink", label: "Dlink", icon: "hub" },
          { id: "daccount", label: "Daccount", icon: "account_balance_wallet" }
        ]} />
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-7 py-6 bg-surface-container-low">
        {tab === "dgo" && <TabDgo client={client} />}
        {tab === "dinvest" && <TabDinvest client={client} />}
        {tab === "dlink" && <TabDlink client={client} />}
        {tab === "daccount" && <TabDaccount client={client} />}
      </div>

      {/* Log modal */}
      <Modal open={!!logOpen} onClose={() => setLogOpen(null)}
        title={`Log ${logOpen?.toUpperCase()} — ${client.name}`}
        sub="Template tự sinh theo context NAC · điền thêm ghi chú để hoàn tất"
        footer={
          <>
            <Button tone="ghost" onClick={() => setLogOpen(null)}>Huỷ</Button>
            <Button tone="primary" icon="check" onClick={() => { setLogOpen(null); toast?.("Đã log tương tác", { tone: "success", icon: "check_circle" }); }}>Lưu & log</Button>
          </>
        }>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Outcome" defaultValue="Completed" icon="check" />
            <TextField label="Thời lượng" defaultValue="12 min" icon="schedule" />
          </div>
          <div>
            <p className="text-[12px] font-semibold mb-1">Template gợi ý theo NAC</p>
            <div className="flex gap-2 flex-wrap">
              <ChipToggle active>Catch-up tuần</ChipToggle>
              <ChipToggle>Review danh mục</ChipToggle>
              <ChipToggle>Update sản phẩm mới</ChipToggle>
              <ChipToggle>Birthday wish</ChipToggle>
            </div>
          </div>
          <TextField as="textarea" label="Ghi chú" rows="5" defaultValue="Đã trao đổi về phân bổ Q4. KH quan tâm tăng tỉ trọng bond. Hẹn callback thứ Sáu 14:30 để chốt." inputClassName="min-h-[100px] py-2" />
          <label className="flex items-center gap-2 text-[12.5px]">
            <input type="checkbox" defaultChecked className="rounded border-outline-variant" />
            <span>Tự gắn với cadence {client.cadence}</span>
          </label>
        </div>
      </Modal>
    </Drawer>
  );
}

function TabDgo({ client }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-8 bg-white">
        <SectionTitle sub="Đánh giá năng lực đầu tư hiện tại">Investment Track · BMI/Depth</SectionTitle>
        <div className="grid grid-cols-3 gap-4">
          {[
            { l: "Investment Maturity", v: "Level 3", sub: "Trusted Investor", c: "blue" },
            { l: "Depth Score", v: "7.6", sub: "/10 · vs avg 6.4", c: "green" },
            { l: "Knowledge Index", v: "82%", sub: "Top 22% segment", c: "purple" }
          ].map((s,i) => (
            <div key={i} className={`rounded-xl p-4 ring-1 ring-outline-variant/30 bg-${s.c === "blue" ? "vnd-primary-50" : s.c === "green" ? "emerald-50" : "fuchsia-50"}/40`}>
              <p className="text-[10.5px] uppercase tracking-wider text-on-surface-variant font-semibold">{s.l}</p>
              <p className="font-display font-bold text-headline-md text-vnd-primary-900 mt-1">{s.v}</p>
              <p className="text-[11.5px] text-on-surface-variant mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mt-6 mb-3">IDP — Investment Development Plan</p>
        <ol className="space-y-2.5">
          {[
            { goal: "Tích sản giáo dục con (15 năm)", target: "8 tỷ", progress: 32 },
            { goal: "Retirement Fund (20 năm)", target: "20 tỷ", progress: 18 },
            { goal: "Quỹ khẩn cấp (12 tháng chi tiêu)", target: "1.2 tỷ", progress: 84 }
          ].map((g, i) => (
            <li key={i} className="rounded-xl ring-1 ring-outline-variant/30 p-3 bg-white">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[13px] font-semibold">{g.goal}</p>
                <span className="font-mono text-[12px] text-on-surface-variant">Mục tiêu {g.target}</span>
              </div>
              <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-vnd-primary-500 rounded-full" style={{ width: g.progress + "%" }}></div>
              </div>
              <p className="text-[10.5px] font-mono text-on-surface-variant mt-1">{g.progress}% hoàn thành</p>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="col-span-12 lg:col-span-4 bg-white">
        <SectionTitle sub="Trạng thái xác thực & tuân thủ">Passport Compliance</SectionTitle>
        <ul className="space-y-2.5">
          {[
            { k: "KYC", state: "valid", note: "Cập nhật 12/2025" },
            { k: "AML", state: "valid", note: "Clear watchlist" },
            { k: "PEP", state: "valid", note: "Non-PEP" },
            { k: "Risk Profile", state: "expiring", note: "Hết hạn sau 32 ngày" },
            { k: "FATCA", state: "valid", note: "Non-US person" }
          ].map((p, i) => (
            <li key={i} className="flex items-center gap-3 p-3 rounded-xl ring-1 ring-outline-variant/30">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center
                ${p.state === "valid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                <Icon name={p.state === "valid" ? "verified" : "warning"} size={16} />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold">{p.k}</p>
                <p className="text-[11.5px] text-on-surface-variant">{p.note}</p>
              </div>
              <Badge tone={p.state === "valid" ? "green" : "amber"} size="xs">{p.state === "valid" ? "Active" : "Renew"}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function TabDinvest({ client }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-7 bg-white">
        <SectionTitle sub="Customer Journey Stage hiện tại">Trading Activity</SectionTitle>
        <div className="flex items-center justify-between mb-4">
          <Badge tone="green" size="md" icon="bolt">CJ Stage: Maturing Investor</Badge>
          <span className="font-mono text-[12px] text-on-surface-variant">Chuyển stage: 6 tháng trước</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          <Stat label="Giao dịch 30d" value="14" sub="+3 so kỳ trước" tone="blue" icon="swap_horiz" />
          <Stat label="Volume YTD" value={`${(client.nav * 2.4).toFixed(0)} tr`} sub="vs benchmark +12%" tone="green" icon="trending_up" />
          <Stat label="Win rate" value="62%" sub="14/22 trades" tone="purple" icon="emoji_events" />
        </div>
        <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mb-2">Transaction History (gần đây)</p>
        <table className="w-full text-[12.5px]">
          <thead className="text-[10.5px] uppercase text-on-surface-variant border-b border-outline-variant/30">
            <tr className="text-left"><th className="py-2">Ngày</th><th>Sản phẩm</th><th>Loại</th><th className="text-right">Số tiền</th></tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {[
              { d: "14/05", p: "VPF Tích sản 5 năm", t: "BUY", v: "+120 tr" },
              { d: "10/05", p: "VIB Trái phiếu DN 24T", t: "BUY", v: "+200 tr" },
              { d: "02/05", p: "VietCap Equity Basket", t: "SELL", v: "−85 tr" },
              { d: "28/04", p: "Sunlife Edu Future", t: "Premium", v: "−18 tr" }
            ].map((tx, i) => (
              <tr key={i} className="hover:bg-surface-container-low">
                <td className="py-2 font-mono text-on-surface-variant">{tx.d}</td>
                <td>{tx.p}</td>
                <td><Badge tone={tx.t === "BUY" ? "green" : tx.t === "SELL" ? "red" : "neutral"} size="xs">{tx.t}</Badge></td>
                <td className={`text-right font-mono font-semibold ${tx.v.startsWith("+") ? "text-emerald-700" : "text-red-700"}`}>{tx.v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="col-span-12 lg:col-span-5 bg-white">
        <SectionTitle sub="Hành vi giao dịch theo tuần">Activity Snapshot</SectionTitle>
        <BarChart
          data={[3,5,2,6,8,4,7,6,9,7,8,11].map((v, i) => ({ value: v, label: ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"][i], highlight: i === 11 }))}
          height={200}
        />
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-surface-container-low p-3">
            <p className="text-[10.5px] uppercase tracking-wider text-on-surface-variant font-semibold">Avg holding</p>
            <p className="font-display font-bold text-title-md text-vnd-primary-900 mt-0.5">14.6 tháng</p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-3">
            <p className="text-[10.5px] uppercase tracking-wider text-on-surface-variant font-semibold">Behavior bias</p>
            <p className="font-display font-bold text-title-md text-vnd-primary-900 mt-0.5">Loss-averse · Low</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TabDlink({ client }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-5 bg-white">
        <SectionTitle sub="CareBy team chăm sóc khách hàng">CareBy Owners</SectionTitle>
        <ul className="space-y-2">
          {client.owners.map((o, i) => (
            <li key={o} className="flex items-center gap-3 p-3 rounded-xl ring-1 ring-outline-variant/30">
              <Avatar name={o} size={36} tone={i === 0 ? "blue" : "green"} />
              <div className="flex-1">
                <p className="text-[13px] font-semibold">{o}</p>
                <p className="text-[11.5px] text-on-surface-variant">{i === 0 ? "Lead Advisor" : "Client Advisor (CA)"}</p>
              </div>
              <Badge tone={i === 0 ? "blue" : "green"} size="xs">{i === 0 ? "Primary" : "Support"}</Badge>
            </li>
          ))}
        </ul>
        <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mt-5 mb-2">Relationship Quality</p>
        <div className="rounded-xl bg-mesh-blue p-4 ring-1 ring-vnd-primary-100">
          <div className="flex items-end gap-4">
            <ProgressRing value={86} size={72} thickness={8} label="86" sub="Score" />
            <div className="flex-1">
              <p className="font-display text-title-md text-vnd-primary-900">Strong</p>
              <p className="text-[11.5px] text-on-surface-variant mt-1">12 tương tác tích cực trong 30 ngày · NPS 9/10 quý gần nhất.</p>
            </div>
          </div>
        </div>
        <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mt-5 mb-2">COI Declaration</p>
        <div className="rounded-xl ring-1 ring-emerald-200 bg-emerald-50/60 p-3">
          <p className="text-[12.5px] text-emerald-800 inline-flex items-center gap-1.5">
            <Icon name="verified_user" size={14} /> No conflict of interest declared · Last updated Q1/2026
          </p>
        </div>
      </Card>

      <Card className="col-span-12 lg:col-span-7 bg-white">
        <SectionTitle sub="Log đầy đủ theo channel · owner · nội dung"
          action={<Button tone="ghost" size="sm" icon="filter_list">Lọc</Button>}>
          Interaction History
        </SectionTitle>
        <ol className="relative pl-7 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/40">
          {INTERACTIONS.map(i => (
            <li key={i.id} className="relative">
              <span className={`absolute -left-[20px] top-1 w-5 h-5 rounded-full ring-4 ring-white flex items-center justify-center
                ${i.pending ? "bg-amber-100 text-amber-700" : "bg-vnd-primary-100 text-vnd-primary-700"}`}>
                <Icon name={i.channelIcon} size={11} />
              </span>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-on-surface">{i.title}</p>
                  <p className="text-[11.5px] text-on-surface-variant mt-0.5">{i.note}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-on-surface-variant">
                    <span className="inline-flex items-center gap-1"><Icon name="person" size={12} />{i.owner}</span>
                    <span className="font-mono">{i.when}</span>
                  </div>
                </div>
                <Badge tone={i.pending ? "amber" : "green"} size="sm">{i.outcome}</Badge>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function TabDaccount({ client }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-7 bg-white">
        <SectionTitle sub="Tài sản đang quản lý">Portfolio Overview</SectionTitle>
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="rounded-xl ring-1 ring-outline-variant/30 p-4">
            <p className="text-[10.5px] uppercase tracking-wider text-on-surface-variant font-semibold">NAV</p>
            <p className="font-display font-bold text-headline-md text-vnd-primary-900 mt-1 font-mono">{client.nav.toLocaleString("vi-VN")}<span className="text-[12px] text-on-surface-variant ml-1">tr</span></p>
          </div>
          <div className="rounded-xl ring-1 ring-outline-variant/30 p-4">
            <p className="text-[10.5px] uppercase tracking-wider text-on-surface-variant font-semibold">P&L YTD</p>
            <p className={`font-display font-bold text-headline-md mt-1 font-mono ${client.pnlYtd >= 0 ? "text-emerald-700" : "text-red-700"}`}>
              {client.pnlYtd >= 0 ? "+" : ""}{client.pnlYtd}%
            </p>
          </div>
          <div className="rounded-xl ring-1 ring-outline-variant/30 p-4">
            <p className="text-[10.5px] uppercase tracking-wider text-on-surface-variant font-semibold">ROI vs Benchmark</p>
            <p className={`font-display font-bold text-headline-md mt-1 font-mono ${client.roi - client.benchmark >= 0 ? "text-emerald-700" : "text-red-700"}`}>
              {client.roi - client.benchmark >= 0 ? "+" : ""}{(client.roi - client.benchmark).toFixed(1)}pp
            </p>
          </div>
        </div>
        <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mb-3">Asset Allocation</p>
        <div className="flex items-center gap-6">
          <DonutChart data={ALLOCATION} size={160} thickness={20} centerValue={`${client.nav.toLocaleString("vi-VN")}`} centerLabel="tr · NAV" />
          <ul className="flex-1 space-y-2">
            {ALLOCATION.map(a => (
              <li key={a.label} className="flex items-center gap-2 text-[12.5px]">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: a.color }}></span>
                <span className="flex-1">{a.label}</span>
                <span className="font-mono text-on-surface-variant w-12 text-right">{a.pct}%</span>
                <span className="font-mono text-on-surface w-20 text-right">{Math.round(client.nav * a.pct / 100).toLocaleString("vi-VN")} tr</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card className="col-span-12 lg:col-span-5 bg-white">
        <SectionTitle sub="Sản phẩm KH đang nắm giữ">Portfolio Detail</SectionTitle>
        <ul className="space-y-2.5">
          {[
            { name: "VPF Tích sản 5 năm", type: "Fund · Bond mix", value: 1240, pnl: 8.4 },
            { name: "VietCap Equity Basket", type: "Equity · Growth", value: 980, pnl: 16.2 },
            { name: "VIB Trái phiếu DN 24T", type: "Bond", value: 760, pnl: 4.1 },
            { name: "Manulife Heritage Linked", type: "Insurance linked", value: 540, pnl: 2.6 },
            { name: "Cash + Money Market", type: "Liquidity", value: 320, pnl: 0.5 }
          ].map((p, i) => (
            <li key={i} className="flex items-center gap-3 p-3 rounded-xl ring-1 ring-outline-variant/30 hover:bg-surface-container-low">
              <span className="w-9 h-9 rounded-lg bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center">
                <Icon name={i === 0 ? "savings" : i === 1 ? "stacked_line_chart" : i === 2 ? "request_quote" : i === 3 ? "shield" : "payments"} size={18} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate">{p.name}</p>
                <p className="text-[11px] text-on-surface-variant">{p.type}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[12.5px] font-semibold text-vnd-primary-900">{p.value} tr</p>
                <p className={`text-[11px] font-mono ${p.pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>{p.pnl >= 0 ? "+" : ""}{p.pnl}%</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

Object.assign(window, { ScreenDworkClients });
