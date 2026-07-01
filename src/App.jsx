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

const STATUS_META = {
  todo: { label: "Nie rozpoczęte", color: "#444", bg: "#1a1a1a" },
  inprogress: { label: "W toku", color: "#C8A97E", bg: "#1a1308" },
  done: { label: "Zrobione", color: "#4CAF50", bg: "#0d1a0d" },
};

const INITIAL_GOALS = [
  { id: 1, category: "biznes", priority: "high", text: "Potwierdzić makijażystę i stylistę na pokaz w Paryżu (7 lipca)", status: "todo", progress: 0, steps: [{ id: "1a", text: "Sprawdzić kontakt do makijażysty z poprzedniego pokazu", done: false }, { id: "1b", text: "Wysłać wiadomość z datą i szczegółami pokazu", done: false }, { id: "1c", text: "Potwierdzić dostępność i stawkę", done: false }, { id: "1d", text: "Podpisać umowę lub potwierdzenie mailowe", done: false }], aiContext: "Potwierdzam ekipę beauty na pokaz mody w Paryżu 7 lipca. Potrzebuję makijażysty i stylisty." },
  { id: 2, category: "biznes", priority: "high", text: "Zmontować odcinek YouTube + zapowiedzi Shorts (publikacja środa 19:00)", status: "todo", progress: 0, steps: [{ id: "2a", text: "Zebrać materiał wideo z tego tygodnia", done: false }, { id: "2b", text: "Zmontować główny odcinek (do wtorku)", done: false }, { id: "2c", text: "Wyciąć 3 Shorts z najlepszych momentów", done: false }, { id: "2d", text: "Napisać opis i tagi", done: false }, { id: "2e", text: "Zaplanować publikację na środę 19:00", done: false }], aiContext: "Prowadzę kanał YouTube o modzie i biznesie. Publikuję w środy o 19:00." },
  { id: 3, category: "biznes", priority: "high", text: "Potwierdzić cenę publikacji 3 zdjęć na portalu Fashion Biznes", status: "todo", progress: 0, steps: [{ id: "3a", text: "Sprawdzić cennik Fashion Biznes", done: false }, { id: "3b", text: "Skontaktować się z redakcją", done: false }, { id: "3c", text: "Wynegocjować cenę i warunki", done: false }, { id: "3d", text: "Przesłać zdjęcia i potwierdzić termin publikacji", done: false }], aiContext: "Negocjuję cenę publikacji 3 zdjęć na portalu Fashion Biznes. Jestem modelką i businesswoman." },
  { id: 4, category: "biznes", priority: "high", text: "Umówić współpracę z portalem Kozaczek", status: "todo", progress: 0, steps: [{ id: "4a", text: "Znaleźć kontakt do działu współpracy Kozaczek", done: false }, { id: "4b", text: "Przygotować krótką propozycję współpracy", done: false }, { id: "4c", text: "Wysłać wiadomość i umówić call", done: false }, { id: "4d", text: "Ustalić warunki i podpisać umowę", done: false }], aiContext: "Szukam współpracy z portalem Kozaczek jako twórca treści z branży fashion i lifestyle." },
  { id: 5, category: "biznes", priority: "critical", text: "Wynegocjować ryczałtową stawkę wynagrodzenia dla mecenasa", status: "inprogress", progress: 30, steps: [{ id: "5a", text: "Sprawdzić aktualne koszty obsługi prawnej", done: true }, { id: "5b", text: "Określić budżet który chcę osiągnąć", done: true }, { id: "5c", text: "Wysłać propozycję ryczałtu do mecenasa", done: false }, { id: "5d", text: "Przeprowadzić negocjację", done: false }, { id: "5e", text: "Podpisać aneks do umowy z nową stawką", done: false }], aiContext: "Negocjuję ryczałtową stawkę z moim prawnikiem. Chcę zastąpić rozliczenie godzinowe stałą miesięczną opłatą." },
  { id: 12, category: "biznes", priority: "high", text: "Wysłać butelkę szampana do mecenasa", status: "todo", progress: 0, steps: [{ id: "12a", text: "Wybrać dostawcę z dostawą do kancelarii", done: false }, { id: "12b", text: "Zamówić z dedykacją", done: false }], aiContext: "Chcę wysłać szampana jako gest dobrej woli po negocjacjach z moim prawnikiem." },
  { id: 6, category: "biznes", priority: "medium", text: "Usunąć artykuły na portalu Onet", status: "todo", progress: 0, steps: [{ id: "6a", text: "Znaleźć artykuły do usunięcia na Onet", done: false }, { id: "6b", text: "Skontaktować się z redakcją Onet", done: false }, { id: "6c", text: "Złożyć wniosek o usunięcie treści (RODO)", done: false }, { id: "6d", text: "Potwierdzić usunięcie", done: false }], aiContext: "Chcę usunąć artykuły o mnie z portalu Onet. Mogę powołać się na prawo do bycia zapomnianym (RODO)." },
  { id: 7, category: "dom", priority: "high", text: "Oczyścić dom ze starych rzeczy i przygotować do najmu", status: "todo", progress: 0, steps: [{ id: "7a", text: "Zrobić listę rzeczy do wyrzucenia / oddania", done: false }, { id: "7b", text: "Wywieźć lub oddać niepotrzebne rzeczy", done: false }, { id: "7c", text: "Zorganizować sprzątanie generalne", done: false }, { id: "7d", text: "Zrobić zdjęcia do ogłoszenia", done: false }, { id: "7e", text: "Wystawić ogłoszenie o najmu", done: false }], aiContext: "Przygotowuję dom do wynajmu. Potrzebuję go opróżnić i przygotować na najemców." },
  { id: 11, category: "dom", priority: "critical", text: "Naprawa ogrodu i płotu przed najmem", status: "inprogress", progress: 40, steps: [{ id: "11a", text: "Skontaktować się z ekipą remontową", done: true }, { id: "11b", text: "Spotkanie z Michałem Narkiewiczem (wt 30.06 20:00)", done: false }, { id: "11c", text: "Otrzymać wycenę naprawy", done: false }, { id: "11d", text: "Zaakceptować i podpisać zlecenie", done: false }, { id: "11e", text: "Nadzorować realizację prac", done: false }], aiContext: "Naprawiam ogród i płot przed wynajmem domu. Mam już umówione spotkanie z wykonawcą." },
  { id: 8, category: "dom", priority: "medium", text: "Budowa Ursus — dopilnowanie montażu mebli (środa 13:00–17:00)", status: "todo", progress: 0, steps: [{ id: "8a", text: "Potwierdzić godzinę z ekipą montażową", done: false }, { id: "8b", text: "Pojechać na budowę w środę o 13:00", done: false }, { id: "8c", text: "Sprawdzić jakość montażu i zaakceptować", done: false }], aiContext: "Nadzoruję montaż mebli w mieszkaniu mamy w Ursusie. Muszę być na miejscu w środę 13-17." },
  { id: 9, category: "dom", priority: "low", text: "Umówić przegląd auta", status: "todo", progress: 0, steps: [{ id: "9a", text: "Zadzwonić do serwisu", done: false }, { id: "9b", text: "Umówić termin", done: false }], aiContext: "Potrzebuję umówić przegląd techniczny samochodu." },
  { id: 10, category: "życie", priority: "medium", text: "Wyjść do teatru (środa wieczór)", status: "todo", progress: 0, steps: [{ id: "10a", text: "Wybrać spektakl w Warszawie", done: false }, { id: "10b", text: "Kupić bilety online", done: false }], aiContext: "Chcę wybrać się do teatru w środę wieczór w Warszawie." },
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

const AI_MODES = [
  { id: "next", label: "🎯 Następny krok" },
  { id: "template", label: "✉️ Szablon wiadomości" },
  { id: "strategy", label: "🧠 Strategia" },
];

export default function App() {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [cardio, setCardio] = useState({});
  const [view, setView] = useState("dashboard");
  const [expandedId, setExpandedId] = useState(null);
  const [aiMode, setAiMode] = useState("next");
  const [aiResponses, setAiResponses] = useState({});
  const [aiLoading, setAiLoading] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const g = localStorage.getItem("goals-v3");
      if (g) setGoals(JSON.parse(g));
      const c = localStorage.getItem("cardio-v1");
      if (c) setCardio(JSON.parse(c));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => { if (!loaded) return; localStorage.setItem("goals-v3", JSON.stringify(goals)); }, [goals, loaded]);
  useEffect(() => { if (!loaded) return; localStorage.setItem("cardio-v1", JSON.stringify(cardio)); }, [cardio, loaded]);

  const updateGoal = (id, changes) => setGoals((g) => g.map((x) => (x.id === id ? { ...x, ...changes } : x)));
  const toggleStep = (goalId, stepId) => setGoals((g) => g.map((x) => x.id === goalId ? { ...x, steps: x.steps.map((s) => s.id === stepId ? { ...s, done: !s.done } : s) } : x));
  const toggleCardio = (day) => setCardio((c) => ({ ...c, [day]: !c[day] }));

  const donePct = Math.round((goals.filter((g) => g.status === "done").length / goals.length) * 100);
  const inProgressCount = goals.filter((g) => g.status === "inprogress").length;
  const cardioDone = CARDIO_DAYS.filter((d) => cardio[d.id]).length;
  const byCategory = Object.keys(CATEGORY_META).reduce((acc, cat) => { acc[cat] = goals.filter((g) => g.category === cat); return acc; }, {});

  const askAI = async (goal, mode) => {
    const key = `${goal.id}-${mode}`;
    setAiLoading(key);
    const prompts = {
      next: `Jestem Gosia Leitner — polska businesswoman i modelka. Pracuję nad: "${goal.text}". Ukończone kroki: ${goal.steps.filter(s => s.done).map(s => s.text).join(", ") || "brak"}. Pozostałe: ${goal.steps.filter(s => !s.done).map(s => s.text).join(", ")}. Podaj konkretny następny krok który mogę zrobić DZIŚ w 15-30 minut. Max 3 zdania. Po polsku.`,
      template: `Jestem Gosia Leitner — polska businesswoman i modelka. Napisz gotowy szablon wiadomości dla zadania: "${goal.text}". Kontekst: ${goal.aiContext}. Profesjonalny ale ciepły ton. Zostaw [IMIĘ] tam gdzie trzeba. Po polsku.`,
      strategy: `Jestem Gosia Leitner — polska businesswoman i modelka. Zadanie: "${goal.text}". Postęp: ${goal.progress}%. Kontekst: ${goal.aiContext}. Daj strategię w 3-4 punktach jak domknąć to w tym tygodniu. Po polsku.`,
    };
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompts[mode] }] }),
      });
      const data = await res.json();
      setAiResponses(r => ({ ...r, [key]: data.content?.[0]?.text || "Brak odpowiedzi." }));
    } catch {
      setAiResponses(r => ({ ...r, [key]: "Błąd połączenia. Spróbuj ponownie." }));
    }
    setAiLoading(null);
  };

  const GoalCard = ({ goal, cat }) => {
    const isExpanded = expandedId === goal.id;
    const aiKey = `${goal.id}-${aiMode}`;
    const stepsDone = goal.steps.filter(s => s.done).length;
    return (
      <div style={{ ...s.card, ...(goal.status === "done" ? s.cardDone : {}) }}>
        <div style={s.cardTop} onClick={() => setExpandedId(isExpanded ? null : goal.id)}>
          <div style={s.cardBody}>
            <div style={s.cardPriority}>
              <span style={{ ...s.dot, background: PRIORITY_META[goal.priority].dot }} />
              <span style={s.priorityLabel}>{PRIORITY_META[goal.priority].label}</span>
              <span style={{ ...s.statusPill, background: STATUS_META[goal.status].bg, color: STATUS_META[goal.status].color }}>{STATUS_META[goal.status].label}</span>
              <span style={s.stepsBadge}>{stepsDone}/{goal.steps.length} kroków</span>
            </div>
            <div style={s.cardText}>{goal.text}</div>
            <div style={s.progressRow}>
              <div style={s.bar}><div style={{ ...s.barFill, width: `${goal.progress}%`, background: CATEGORY_META[cat].color }} /></div>
              <span style={s.progressPct}>{goal.progress}%</span>
            </div>
          </div>
          <span style={s.arrow}>{isExpanded ? "▲" : "▼"}</span>
        </div>
        {isExpanded && (
          <div style={s.expanded}>
            <div style={s.statusRow}>
              {Object.entries(STATUS_META).map(([key, meta]) => (
                <button key={key} onClick={() => updateGoal(goal.id, { status: key, progress: key === "done" ? 100 : goal.progress })}
                  style={{ ...s.statusBtn, ...(goal.status === key ? { background: meta.bg, color: meta.color, border: `1px solid ${meta.color}` } : {}) }}>
                  {meta.label}
                </button>
              ))}
            </div>
            <div style={s.sliderRow}>
              <span style={s.sliderLabel}>Postęp: {goal.progress}%</span>
              <input type="range" min="0" max="100" value={goal.progress} onChange={(e) => updateGoal(goal.id, { progress: Number(e.target.value) })} style={s.slider} />
            </div>
            <div style={s.stepsTitle}>Kroki do wykonania:</div>
            {goal.steps.map((step) => (
              <div key={step.id} style={s.step} onClick={() => toggleStep(goal.id, step.id)}>
                <div style={{ ...s.stepCheck, ...(step.done ? s.stepCheckDone : {}) }}>{step.done && "✓"}</div>
                <span style={{ ...s.stepText, ...(step.done ? s.stepTextDone : {}) }}>{step.text}</span>
              </div>
            ))}
            <div style={s.aiBox}>
              <div style={s.aiTitle}>🤖 Pomoc AI</div>
              <div style={s.aiModes}>
                {AI_MODES.map(m => (
                  <button key={m.id} onClick={() => setAiMode(m.id)} style={{ ...s.aiModeBtn, ...(aiMode === m.id ? s.aiModeBtnActive : {}) }}>{m.label}</button>
                ))}
              </div>
              <button onClick={() => askAI(goal, aiMode)} style={s.aiAskBtn} disabled={aiLoading === aiKey}>
                {aiLoading === aiKey ? "Myślę..." : "Zapytaj AI →"}
              </button>
              {aiLoading === aiKey && <div style={s.aiLoading}>⏳ Analizuję sytuację...</div>}
              {aiResponses[aiKey] && <div style={s.aiResponse}>{aiResponses[aiKey]}</div>}
            </div>
          </div>
        )}
      </div>
    );
  };

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
        {[["dashboard", "📊 Dziś"], ["goals", "🎯 Cele"], ["health", "💪 Zdrowie"], ["summary", "📈 Wyniki"]].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} style={{ ...s.navBtn, ...(view === v ? s.navActive : {}) }}>{label}</button>
        ))}
      </div>
      <div style={s.content}>
        {view === "dashboard" && (
          <div>
            <div style={s.statsRow}>
              <div style={s.statCard}><div style={s.statNum}>{donePct}%</div><div style={s.statLabel}>Ukończone</div><div style={s.miniBar}><div style={{ ...s.miniBarFill, width: `${donePct}%`, background: "#C8A97E" }} /></div></div>
              <div style={s.statCard}><div style={{ ...s.statNum, color: "#C8A97E" }}>{inProgressCount}</div><div style={s.statLabel}>W toku</div><div style={s.miniBar}><div style={{ ...s.miniBarFill, width: `${(inProgressCount / goals.length) * 100}%`, background: "#C8A97E" }} /></div></div>
              <div style={s.statCard}><div style={{ ...s.statNum, color: "#4CAF50" }}>{cardioDone}/6</div><div style={s.statLabel}>Treningi</div><div style={s.miniBar}><div style={{ ...s.miniBarFill, width: `${(cardioDone / 6) * 100}%`, background: "#4CAF50" }} /></div></div>
            </div>
            <div style={s.sectionTitle}>🔴 Wymagają działania dziś</div>
            {goals.filter(g => g.priority === "critical" && g.status !== "done").map(goal => (
              <div key={goal.id} style={s.dashCard}>
                <div style={s.dashCardTop}>
                  <div style={s.dashCardText}>{goal.text}</div>
                  <div style={{ ...s.statusBadge, color: STATUS_META[goal.status].color }}>{STATUS_META[goal.status].label}</div>
                </div>
                <div style={s.progressRow}>
                  <div style={s.bar}><div style={{ ...s.barFill, width: `${goal.progress}%`, background: "#FF4D4D" }} /></div>
                  <span style={s.progressPct}>{goal.progress}%</span>
                </div>
                <button onClick={() => { setView("goals"); setExpandedId(goal.id); }} style={s.aiQuickBtn}>🤖 Otwórz z pomocą AI →</button>
              </div>
            ))}
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
          </div>
        )}
        {view === "goals" && (
          <>
            {Object.entries(byCategory).map(([cat, items]) => (
              <div key={cat} style={s.section}>
                <div style={{ ...s.catHeader, borderColor: CATEGORY_META[cat].color }}>
                  <span style={{ ...s.catLabel, color: CATEGORY_META[cat].color }}>{CATEGORY_META[cat].label}</span>
                  <span style={s.catCount}>{items.filter(i => i.status === "done").length}/{items.length}</span>
                </div>
                {items.map((goal) => <GoalCard key={goal.id} goal={goal} cat={cat} />)}
              </div>
            ))}
          </>
        )}
        {view === "health" && (
          <div>
            <div style={s.sectionTitle}>💪 Kardio — orbitrek 7:00 rano</div>
            <div style={s.healthInfo}>20 minut. Przed kawą i telefonem.</div>
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
              const avg = Math.round(items.reduce((a, g) => a + g.progress, 0) / items.length);
              return (
                <div key={cat} style={s.summaryRow}>
                  <div style={s.summaryRowTop}><span style={{ color: CATEGORY_META[cat].color }}>{CATEGORY_META[cat].label}</span><span style={s.summaryPct}>{avg}%</span></div>
                  <div style={{ ...s.bar, marginBottom: 10 }}><div style={{ ...s.barFill, width: `${avg}%`, background: CATEGORY_META[cat].color }} /></div>
                  {items.map((g) => (
                    <div key={g.id} style={s.summaryItem}>
                      <span style={{ color: STATUS_META[g.status].color, minWidth: 8 }}>●</span>
                      <span style={{ color: "#888", marginLeft: 8, fontSize: 12, flex: 1 }}>{g.text}</span>
                      <span style={{ color: STATUS_META[g.status].color, fontSize: 11 }}>{g.progress}%</span>
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
  sectionTitle: { fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12, marginTop: 8 },
  dashCard: { background: "#141414", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #2a1a1a" },
  dashCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8 },
  dashCardText: { fontSize: 13, color: "#ddd", lineHeight: 1.4, flex: 1 },
  statusBadge: { fontSize: 10, whiteSpace: "nowrap" },
  progressRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  progressPct: { fontSize: 11, color: "#555", minWidth: 28 },
  aiQuickBtn: { background: "#1a1a2e", border: "1px solid #C8A97E44", color: "#C8A97E", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", width: "100%" },
  cardioWeek: { display: "flex", gap: 8, marginBottom: 16 },
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
  cardDone: { opacity: 0.4 },
  cardTop: { display: "flex", alignItems: "flex-start", padding: "14px", gap: 12, cursor: "pointer" },
  cardBody: { flex: 1 },
  cardPriority: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" },
  dot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  priorityLabel: { fontSize: 10, color: "#555", letterSpacing: 0.5, textTransform: "uppercase" },
  statusPill: { fontSize: 10, borderRadius: 4, padding: "2px 6px" },
  stepsBadge: { fontSize: 10, color: "#555", marginLeft: "auto" },
  cardText: { fontSize: 14, color: "#ddd", lineHeight: 1.4, marginBottom: 8 },
  arrow: { color: "#333", fontSize: 10, marginTop: 4 },
  expanded: { padding: "0 14px 14px" },
  statusRow: { display: "flex", gap: 6, marginBottom: 12 },
  statusBtn: { flex: 1, padding: "6px 4px", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#555", borderRadius: 6, fontSize: 10, cursor: "pointer" },
  sliderRow: { marginBottom: 14 },
  sliderLabel: { fontSize: 11, color: "#888", display: "block", marginBottom: 6 },
  slider: { width: "100%", accentColor: "#C8A97E" },
  stepsTitle: { fontSize: 11, color: "#666", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 },
  step: { display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid #1a1a1a", cursor: "pointer" },
  stepCheck: { width: 18, height: 18, borderRadius: 4, border: "1.5px solid #333", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#4CAF50", marginTop: 1 },
  stepCheckDone: { background: "#4CAF50", borderColor: "#4CAF50", color: "#000" },
  stepText: { fontSize: 13, color: "#bbb", lineHeight: 1.4 },
  stepTextDone: { textDecoration: "line-through", color: "#444" },
  aiBox: { marginTop: 16, background: "#0d0d1a", borderRadius: 10, padding: 14, border: "1px solid #C8A97E22" },
  aiTitle: { fontSize: 12, fontWeight: 700, color: "#C8A97E", marginBottom: 10 },
  aiModes: { display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" },
  aiModeBtn: { padding: "6px 10px", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#666", borderRadius: 6, fontSize: 11, cursor: "pointer" },
  aiModeBtnActive: { background: "#1a1a2e", border: "1px solid #C8A97E", color: "#C8A97E" },
  aiAskBtn: { width: "100%", padding: "10px", background: "#C8A97E", border: "none", color: "#000", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 10 },
  aiLoading: { fontSize: 12, color: "#888", textAlign: "center", padding: "8px 0" },
  aiResponse: { fontSize: 13, color: "#ccc", lineHeight: 1.7, background: "#141414", borderRadius: 8, padding: 12, whiteSpace: "pre-wrap" },
  bar: { height: 4, background: "#1e1e1e", borderRadius: 2, overflow: "hidden", flex: 1 },
  barFill: { height: "100%", borderRadius: 2, transition: "width 0.6s ease" },
  healthInfo: { fontSize: 13, color: "#666", marginBottom: 16 },
  motivBox: { background: "#0d1a0d", border: "1px solid #4CAF5033", borderRadius: 10, padding: 16 },
  motivTitle: { fontSize: 11, color: "#4CAF50", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 },
  motivText: { fontSize: 13, color: "#888", lineHeight: 1.6 },
  summaryRow: { marginBottom: 24 },
  summaryRowTop: { display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" },
  summaryPct: { color: "#fff" },
  summaryItem: { display: "flex", alignItems: "flex-start", marginBottom: 6 },
};
