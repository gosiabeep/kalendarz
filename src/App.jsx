import { useState, useEffect } from "react";

const WEEK = "29.06 – 06.07.2026";
const TODAY = new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" });

const CARDIO_DAYS = [
  { id: "pn", label: "Pn", date: "29.06" },
  { id: "wt", label: "Wt", date: "30.06" },
  { id: "sr", label: "Śr", date: "01.07" },
  { id: "cz", label: "Cz", date: "02.07" },
  { id: "pt", label: "Pt", date: "03.07" },
  { id: "sb", label: "Sb", date: "04.07" },
];

const INITIAL_GOALS = [
  { id: 1, category: "biznes", priority: "high", text: "Potwierdzić makijażystę i stylistę na pokaz w Paryżu (7 lipca)", benefit: "Pokaz jest 7 lipca — masz jeszcze chwilę, ale nie odkładaj za długo.", done: false },
  { id: 2, category: "biznes", priority: "high", text: "Zmontować odcinek YouTube + zapowiedzi Shorts (publikacja środa 19:00)", benefit: "Regularność na YouTube buduje zasięg organiczny — każdy tydzień przerwy cofa algorytm.", done: false },
  { id: 3, category: "biznes", priority: "high", text: "Potwierdzić cenę publikacji 3 zdjęć na portalu Fashion Biznes", benefit: "Zamknięta umowa = widoczność marki w branży fashion bez dalszego przeciągania.", done: false },
  { id: 4, category: "biznes", priority: "high", text: "Umówić współpracę z portalem Kozaczek", benefit: "Nowy kanał dystrybucji treści — każda współpraca to nowa publiczność.", done: false },
  { id: 5, category: "biznes", priority: "critical", text: "Wynegocjować ryczałtową stawkę wynagrodzenia dla mecenasa (DZIŚ — ostatni dzień miesiąca)", benefit: "Nowa stawka od nowego miesiąca = natychmiastowa oszczędność. Jutro będzie za późno.", done: false },
  { id: 12, category: "biznes", priority: "high", text: "Wysłać butelkę szampana do mecenasa", benefit: "Gest który buduje relację — negocjacja ceny nie musi niszczyć atmosfery współpracy.", done: false },
  { id: 6, category: "biznes", priority: "medium", text: "Usunąć artykuły na portalu Onet", benefit: "Kontrola wizerunku online — stare treści mogą działać przeciwko Tobie.", done: false },
  { id: 7, category: "dom", priority: "high", text: "Oczyścić dom ze starych rzeczy i przygotować do najmu", benefit: "Mieszkanie pod najem = pasywny przychód. Każdy dzień opóźnienia to utracone pieniądze.", done: false },
  { id: 11, category: "dom", priority: "critical", text: "✅ Kontakt z ekipą — spotkanie wtorek 30.06 o 20:00 (Michał Narkiewicz, oględziny płotu i ogrodu)", benefit: "Bez zadbanych zewnętrznych przestrzeni trudno wynająć za dobrą stawkę — to pierwsze wrażenie najemcy.", done: true },
  { id: 8, category: "dom", priority: "medium", text: "Budowa Ursus — dopilnowanie montażu mebli (środa 13:00–17:00)", benefit: "Obecność na budowie skraca czas realizacji i eliminuje poprawki.", done: false },
  { id: 9, category: "dom", priority: "low", text: "Umówić przegląd auta", benefit: "Sprawne auto = spokój głowy i bezpieczeństwo na drodze.", done: false },
  { id: 10, category: "życie", priority: "medium", text: "Wyjść do teatru (środa wieczór)", benefit: "Ładowanie baterii poza pracą — satysfakcja życiowa przekłada się na energię w biznesie.", done: false },
];

const CATEGORY_META = {
  biznes: { label: "Biznes", color: "#C8A97E" },
  dom: { label: "Dom & Logistyka", color: "#7EB5C8" },
  życie: { label: "Życie & Energia", color: "#A97EC8" },
};

const PRIORITY_META = {
  critical: { label: "Krytyczny", dot: "#FF4D4D" },
  high: { label: "Wysoki", dot: "#C8A97E" },
  medium: { label: "Średni", dot: "#7EB5C8" },
  low: { label: "Niski", dot: "#888" },
};

export default function App() {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [cardio, setCardio] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [view, setView] = useState("dashboard");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await localStorage.getItem("goals-v2");
        if (r) setGoals(JSON.parse(r));
        const c = await localStorage.getItem("cardio-v1");
        if (c) setCardio(JSON.parse(c));
      } catch {}
      setLoaded(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("goals-v2", JSON.stringify(goals));
  }, [goals, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("cardio-v1", JSON.stringify(cardio));
  }, [cardio, loaded]);

  const toggleGoal = (id) => setGoals((g) => g.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const toggleCardio = (day) => setCardio((c) => ({ ...c, [day]: !c[day] }));

  const donePct = Math.round((goals.filter((g) => g.done).length / goals.length) * 100);
  const cardioDone = CARDIO_DAYS.filter((d) => cardio[d.id]).length;
  const byCategory = Object.keys(CATEGORY_META).reduce((acc, cat) => {
    acc[cat] = goals.filter((g) => g.category === cat);
    return acc;
  }, {});

  const criticalLeft = goals.filter((g) => g.priority === "critical" && !g.done);

  return (
    <div style={s.root}>
      <div style={s.topBar}>
        <div>
          <div style={s.topDate}>{TODAY}</div>
          <div style={s.topWeek}>Tydzień {WEEK}</div>
        </div>
        <div style={s.topBadge}>Gosia</div>
      </div>
      <div style={s.nav}>
        {[["dashboard","📊 Dziś"], ["goals","🎯 Cele"], ["health","💪 Zdrowie"], ["summary","📈 Wyniki"]].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} style={{ ...s.navBtn, ...(view === v ? s.navActive : {}) }}>
            {label}
          </button>
        ))}
      </div>
      <div style={s.content}>
        {view === "dashboard" && (
          <div>
            <div style={s.statsRow}>
              <div style={s.statCard}>
                <div style={s.statNum}>{donePct}%</div>
                <div style={s.statLabel}>Cele tygodnia</div>
                <div style={s.miniBar}><div style={{ ...s.miniBarFill, width: `${donePct}%`, background: "#C8A97E" }} /></div>
              </div>
              <div style={s.statCard}>
                <div style={{ ...s.statNum, color: "#4CAF50" }}>{cardioDone}/6</div>
                <div style={s.statLabel}>Treningi</div>
                <div style={s.miniBar}><div style={{ ...s.miniBarFill, width: `${(cardioDone/6)*100}%`, background: "#4CAF50" }} /></div>
              </div>
              <div style={s.statCard}>
                <div style={{ ...s.statNum, color: "#FF4D4D" }}>{criticalLeft.length}</div>
                <div style={s.statLabel}>Krytyczne</div>
                <div style={s.miniBar}><div style={{ ...s.miniBarFill, width: `${((2-criticalLeft.length)/2)*100}%`, background: "#FF4D4D" }} /></div>
              </div>
            </div>
            <div style={s.sectionTitle}>💪 Trening dziś rano (7:00)</div>
            <div style={s.cardioWeek}>
              {CARDIO_DAYS.map((d) => (
                <div key={d.id} onClick={() => toggleCardio(d.id)} style={{ ...s.cardioDay, ...(cardio[d.id] ? s.cardioDone : {}) }}>
                  <div style={s.cardioDayLabel}>{d.label}</div>
                  <div style={s.cardioDayDate}>{d.date}</div>
                  <div style={s.cardioCheck}>{cardio[d.id] ? "✓" : "○"}</div>
                </div>
              ))}
            </div>
            {criticalLeft.length > 0 && (
              <>
                <div style={s.sectionTitle}>🔴 Krytyczne — niezrealizowane</div>
                {criticalLeft.map((goal) => (
                  <div key={goal.id} style={s.card} onClick={() => toggleGoal(goal.id)}>
                    <div style={s.cardTop}>
                      <div style={{ ...s.check, border: "2px solid #FF4D4D" }} />
                      <div style={s.cardText}>{goal.text}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {criticalLeft.length === 0 && <div style={s.win}>🏆 Wszystkie krytyczne zadania zrealizowane!</div>}
          </div>
        )}
        {view === "goals" && (
          <>
            {Object.entries(byCategory).map(([cat, items]) => (
              <div key={cat} style={s.section}>
                <div style={{ ...s.catHeader, borderColor: CATEGORY_META[cat].color }}>
                  <span style={{ ...s.catLabel, color: CATEGORY_META[cat].color }}>{CATEGORY_META[cat].label}</span>
                  <span style={s.catCount}>{items.filter((i) => i.done).length}/{items.length}</span>
                </div>
                {items.map((goal) => (
                  <div key={goal.id} style={{ ...s.card, ...(goal.done ? s.cardDone : {}) }}>
                    <div style={s.cardTop} onClick={() => setExpandedId(expandedId === goal.id ? null : goal.id)}>
                      <button onClick={(e) => { e.stopPropagation(); toggleGoal(goal.id); }} style={{ ...s.check, ...(goal.done ? s.checkDone : {}) }}>
                        {goal.done && <span style={s.checkMark}>✓</span>}
                      </button>
                      <div style={s.cardBody}>
                        <div style={s.cardPriority}>
                          <span style={{ ...s.dot, background: PRIORITY_META[goal.priority].dot }} />
                          <span style={s.priorityLabel}>{PRIORITY_META[goal.priority].label}</span>
                        </div>
                        <div style={{ ...s.cardText, ...(goal.done ? s.cardTextDone : {}) }}>{goal.text}</div>
                      </div>
                      <span style={s.arrow}>{expandedId === goal.id ? "▲" : "▼"}</span>
                    </div>
                    {expandedId === goal.id && (
                      <div style={s.benefit}>
                        <span style={s.benefitLabel}>💡 Dlaczego to ważne:</span>
                        <span style={s.benefitText}>{goal.benefit}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
        {view === "health" && (
          <div>
            <div style={s.sectionTitle}>💪 Kardio — orbitrek 7:00 rano</div>
            <div style={s.healthInfo}>20 minut. Codziennie rano przed kawą i telefonem.</div>
            <div style={s.cardioWeek}>
              {CARDIO_DAYS.map((d) => (
                <div key={d.id} onClick={() => toggleCardio(d.id)} style={{ ...s.cardioDay, ...(cardio[d.id] ? s.cardioDone : {}) }}>
                  <div style={s.cardioDayLabel}>{d.label}</div>
                  <div style={s.cardioDayDate}>{d.date}</div>
                  <div style={{ ...s.cardioCheck, fontSize: cardio[d.id] ? 18 : 14 }}>{cardio[d.id] ? "✓" : "○"}</div>
                </div>
              ))}
            </div>
            <div style={s.motivBox}>
              <div style={s.motivTitle}>Dlaczego to robisz:</div>
              <div style={s.motivText}>Regularność przez 3 tygodnie zmienia nawyk. Energia pojawia się w trakcie ruchu, nie przed nim.</div>
            </div>
          </div>
        )}
        {view === "summary" && (
          <div>
            <div style={s.sectionTitle}>📈 Realizacja tygodnia</div>
            {Object.entries(byCategory).map(([cat, items]) => {
              const d = items.filter((i) => i.done).length;
              const p = Math.round((d / items.length) * 100);
              return (
                <div key={cat} style={s.summaryRow}>
                  <div style={s.summaryRowTop}>
                    <span style={{ color: CATEGORY_META[cat].color }}>{CATEGORY_META[cat].label}</span>
                    <span style={s.summaryPct}>{p}%</span>
                  </div>
                  <div style={s.bar}><div style={{ ...s.barFill, width: `${p}%`, background: CATEGORY_META[cat].color }} /></div>
                  {items.map((g) => (
                    <div key={g.id} style={s.summaryItem}>
                      <span style={{ color: g.done ? "#4CAF50" : "#444" }}>{g.done ? "✓" : "○"}</span>
                      <span style={{ color: g.done ? "#ccc" : "#555", marginLeft: 8, fontSize: 12 }}>{g.text}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  root: { background: "#0d0d0d", minHeight: "100vh", color: "#e0e0e0", fontFamily: "'Inter', system-ui, sans-serif", maxWidth: 500, margin: "0 auto" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 20px 16px", borderBottom: "1px solid #1a1a1a" },
  topDate: { fontSize: 13, color: "#fff", fontWeight: 600, textTransform: "capitalize" },
  topWeek: { fontSize: 11, color: "#555", marginTop: 2 },
  topBadge: { background: "#C8A97E22", border: "1px solid #C8A97E44", color: "#C8A97E", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 },
  nav: { display: "flex", borderBottom: "1px solid #1a1a1a", overflowX: "auto" },
  navBtn: { flex: 1, minWidth: 70, padding: "12px 4px", background: "none", border: "none", color: "#555", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" },
  navActive: { color: "#C8A97E", borderBottom: "2px solid #C8A97E" },
  content: { padding: "16px 16px 80px" },
  statsRow: { display: "flex", gap: 10, marginBottom: 20 },
  statCard: { flex: 1, background: "#141414", borderRadius: 10, padding: "12px 10px", border: "1px solid #1e1e1e" },
  statNum: { fontSize: 22, fontWeight: 700, color: "#C8A97E", lineHeight: 1 },
  statLabel: { fontSize: 10, color: "#555", marginTop: 4, marginBottom: 8, letterSpacing: 0.5 },
  miniBar: { height: 3, background: "#222", borderRadius: 2, overflow: "hidden" },
  miniBarFill: { height: "100%", borderRadius: 2, transition: "width 0.5s" },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, marginTop: 4 },
  cardioWeek: { display: "flex", gap: 8, marginBottom: 20 },
  cardioDay: { flex: 1, background: "#141414", border: "1px solid #222", borderRadius: 10, padding: "10px 4px", textAlign: "center", cursor: "pointer" },
  cardioDone: { background: "#0d1f0d", border: "1px solid #4CAF50" },
  cardioDayLabel: { fontSize: 11, fontWeight: 700, color: "#888" },
  cardioDayDate: { fontSize: 9, color: "#444", marginTop: 2, marginBottom: 6 },
  cardioCheck: { fontSize: 16, color: "#4CAF50" },
  section: { marginBottom: 24 },
  catHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: "3px solid", paddingLeft: 10, marginBottom: 10 },
  catLabel: { fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" },
  catCount: { fontSize: 11, color: "#555" },
  card: { background: "#141414", borderRadius: 10, marginBottom: 8, overflow: "hidden", border: "1px solid #1e1e1e" },
  cardDone: { opacity: 0.45 },
  cardTop: { display: "flex", alignItems: "flex-start", padding: "14px", gap: 12, cursor: "pointer" },
  check: { width: 22, height: 22, borderRadius: 6, border: "2px solid #333", background: "none", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 },
  checkDone: { background: "#C8A97E", borderColor: "#C8A97E" },
  checkMark: { color: "#000", fontSize: 12, fontWeight: 700 },
  cardBody: { flex: 1 },
  cardPriority: { display: "flex", alignItems: "center", gap: 5, marginBottom: 4 },
  dot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  priorityLabel: { fontSize: 10, color: "#555", letterSpacing: 0.5, textTransform: "uppercase" },
  cardText: { fontSize: 14, color: "#ddd", lineHeight: 1.4 },
  cardTextDone: { textDecoration: "line-through", color: "#444" },
  arrow: { color: "#333", fontSize: 10, marginTop: 4 },
  benefit: { padding: "0 14px 14px 48px" },
  benefitLabel: { fontSize: 11, color: "#C8A97E", display: "block", marginBottom: 4 },
  benefitText: { fontSize: 13, color: "#888", lineHeight: 1.5 },
  healthInfo: { fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.5 },
  motivBox: { background: "#0d1a0d", border: "1px solid #4CAF5033", borderRadius: 10, padding: 16 },
  motivTitle: { fontSize: 11, color: "#4CAF50", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 },
  motivText: { fontSize: 13, color: "#888", lineHeight: 1.6 },
  summaryRow: { marginBottom: 24 },
  summaryRowTop: { display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" },
  summaryPct: { color: "#fff" },
  bar: { height: 4, background: "#1e1e1e", borderRadius: 2, marginBottom: 10, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 2, transition: "width 0.6s ease" },
  summaryItem: { display: "flex", marginBottom: 4 },
  win: { textAlign: "center", padding: 20, color: "#C8A97E", fontSize: 14, fontWeight: 600, border: "1px solid #C8A97E33", borderRadius: 12, marginTop: 16 },
};
