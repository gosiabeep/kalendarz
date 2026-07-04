import { useState, useEffect } from "react";

const WEEK = "03.07 – 09.07.2026";

const getTimeOfDay = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "day";
  return "evening";
};

const TODAY_STR = new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" });

const CARDIO_DAYS = [
  { id: "cz", label: "Cz", date: "03.07" },
  { id: "pt", label: "Pt", date: "04.07" },
  { id: "sb", label: "Sb", date: "05.07" },
  { id: "nd", label: "Nd", date: "06.07" },
  { id: "pn", label: "Pn", date: "07.07" },
  { id: "wt", label: "Wt", date: "08.07" },
];

const STATUS_META = {
  todo: { label: "Nie rozpoczęte", color: "#444", bg: "#1a1a1a" },
  inprogress: { label: "W toku", color: "#C8A97E", bg: "#1a1308" },
  done: { label: "Zrobione", color: "#4CAF50", bg: "#0d1a0d" },
};

const QUARTERLY_GOALS = [
  { id: "q1", text: "Automatyzacja montażu i publikacji YouTube", value: "16h/2tyg oszczędności", color: "#C8A97E" },
  { id: "q2", text: "Automatyzacja montażu Reels/Shorts", value: "16h/tyg oszczędności", color: "#C8A97E" },
  { id: "q3", text: "Lejek sprzedażowy YouTube + Instagram", value: "7 × 5,500 USD/mies.", color: "#4CAF50" },
  { id: "q4", text: "Zabezpieczyć zakwaterowanie Miami (Chabad network)", value: "oszczędność 3-5k USD/mies.", color: "#7EB5C8" },
  { id: "q5", text: "Opróżnić i zaplombować dom Izabelin", value: "przygotowanie do najmu", color: "#7EB5C8" },
  { id: "q6", text: "Sprzedaż mieszkania Skierniewicka", value: "~700,000 PLN", color: "#A97EC8" },
];

const JAKUB_TASKS = [
  { id: "j1", text: "Podłączenie konta Team Gosia + dostępy GitHub i baza danych", done: false },
  { id: "j2", text: "Kontakt z Nicole — co najpilniejsze", done: true },
  { id: "j3", text: "Zoom Iza Janiak — sprzedaż konsultacji (sobota)", done: false },
  { id: "j4", text: "CRM: priorytetyzacja VIP USA (New York)", done: false },
  { id: "j5", text: "Hasła Proton — spotkanie Warszawa (czwartek 9.07)", done: false },
];

const INITIAL_GOALS = [
  // BIZNES
  { id: 1, category: "biznes", priority: "critical", text: "✈️ Lot Warszawa → Paryż (niedziela 5.07)", status: "todo", progress: 0,
    steps: [{ id: "1a", text: "Sprawdzić dostępne loty 5.07", done: false }, { id: "1b", text: "Kupić bilet", done: false }, { id: "1c", text: "Potwierdzić godzinę vs pokaz 7.07", done: false }],
    aiContext: "Kupuję lot do Paryża na pokaz Stephane Rolland 7 lipca." },
  { id: 2, category: "biznes", priority: "critical", text: "🏨 Potwierdzić hotel w Paryżu (niedziela 5.07)", status: "todo", progress: 0,
    steps: [{ id: "2a", text: "Sprawdzić rezerwację", done: false }, { id: "2b", text: "Potwierdzić daty pobytu", done: false }],
    aiContext: "Hotel w Paryżu na pokaz Stephane Rolland 7 lipca." },
  { id: 3, category: "biznes", priority: "critical", text: "📸 Potwierdzić fotografa — pokaz Stephane Rolland", status: "todo", progress: 0,
    steps: [{ id: "3a", text: "Znaleźć kontakt do fotografa", done: false }, { id: "3b", text: "Potwierdzić dostępność i stawkę", done: false }, { id: "3c", text: "Przesłać szczegóły pokazu", done: false }],
    aiContext: "Fotograf na pokaz Stephane Rolland 7 lipca w Paryżu." },
  { id: 4, category: "biznes", priority: "high", text: "📋 Research: Stephane Rolland + Messika", status: "todo", progress: 0,
    steps: [{ id: "4a", text: "Zebrać info o Stephane Rolland (historia, styl, kolekcje)", done: false }, { id: "4b", text: "Zebrać info o Messika (biżuteria, marka)", done: false }, { id: "4c", text: "Przygotować notatki na pokaz", done: false }],
    aiContext: "Przygotowuję się do pokazu Stephane Rolland i współpracy z Messika." },
  { id: 5, category: "biznes", priority: "high", text: "💅 Makijażysta i stylista na pokaz Paryż", status: "todo", progress: 0,
    steps: [{ id: "5a", text: "Sprawdzić kontakt z poprzedniego pokazu", done: false }, { id: "5b", text: "Wysłać wiadomość z datą", done: false }, { id: "5c", text: "Potwierdzić dostępność i stawkę", done: false }],
    aiContext: "Ekipa beauty na pokaz mody w Paryżu 7 lipca." },
  { id: 6, category: "biznes", priority: "high", text: "📹 YouTube: thumbnail Canva + transkrypcja + karty", status: "inprogress", progress: 20,
    steps: [{ id: "6a", text: "Thumbnail w Canva", done: false }, { id: "6b", text: "Automatyzacja transkrypcji i opisu", done: false }, { id: "6c", text: "Przygotowanie kart", done: false }, { id: "6d", text: "Publikacja środa 19:00", done: false }],
    aiContext: "Przygotowanie odcinka YouTube do publikacji. Kanał o modzie i biznesie." },
  { id: 7, category: "biznes", priority: "high", text: "🎬 Rolki do YouTube (niedziela 5.07)", status: "todo", progress: 0,
    steps: [{ id: "7a", text: "Nagrać materiał", done: false }, { id: "7b", text: "Zmontować Shorts/Reels", done: false }, { id: "7c", text: "Zaplanować publikację", done: false }],
    aiContext: "Rolki i Shorts do YouTube na niedzielę przed wyjazdem do Paryża." },
  { id: 8, category: "biznes", priority: "high", text: "💼 Fashion Biznes — potwierdzić cenę 3 zdjęć", status: "todo", progress: 0,
    steps: [{ id: "8a", text: "Sprawdzić cennik", done: false }, { id: "8b", text: "Skontaktować się z redakcją", done: false }, { id: "8c", text: "Wynegocjować warunki", done: false }],
    aiContext: "Publikacja 3 zdjęć na Fashion Biznes." },
  { id: 9, category: "biznes", priority: "high", text: "🤝 Umówić współpracę Kozaczek", status: "todo", progress: 0,
    steps: [{ id: "9a", text: "Znaleźć kontakt", done: false }, { id: "9b", text: "Wysłać propozycję", done: false }, { id: "9c", text: "Umówić call", done: false }],
    aiContext: "Współpraca z portalem Kozaczek jako twórca fashion/lifestyle." },
  { id: 10, category: "biznes", priority: "high", text: "⚖️ Wynegocjować ryczałt dla mecenasa", status: "inprogress", progress: 30,
    steps: [{ id: "10a", text: "Sprawdzić aktualne koszty", done: true }, { id: "10b", text: "Określić docelowy budżet", done: true }, { id: "10c", text: "Wysłać propozycję", done: false }, { id: "10d", text: "Negocjacja", done: false }, { id: "10e", text: "Podpisać aneks", done: false }],
    aiContext: "Negocjuję ryczałt z prawnikiem zamiast rozliczenia godzinowego." },
  { id: 11, category: "biznes", priority: "medium", text: "🍾 Wysłać szampana do mecenasa", status: "todo", progress: 0,
    steps: [{ id: "11a", text: "Wybrać dostawcę z dostawą do kancelarii", done: false }, { id: "11b", text: "Zamówić z dedykacją", done: false }],
    aiContext: "Szampan jako gest dobrej woli po negocjacjach." },
  { id: 12, category: "biznes", priority: "medium", text: "🗑️ Usunąć artykuły na Onet (RODO)", status: "todo", progress: 0,
    steps: [{ id: "12a", text: "Znaleźć artykuły", done: false }, { id: "12b", text: "Kontakt z redakcją", done: false }, { id: "12c", text: "Złożyć wniosek RODO", done: false }],
    aiContext: "Usunięcie artykułów z Onet na podstawie prawa do bycia zapomnianym." },
  { id: 13, category: "biznes", priority: "medium", text: "🔐 Zmiana haseł + nowy klucz Anthropic API", status: "todo", progress: 0,
    steps: [{ id: "13a", text: "Unieważnić stary klucz Anthropic (console.anthropic.com)", done: false }, { id: "13b", text: "Wygenerować nowy klucz API", done: false }, { id: "13c", text: "Zaktualizować w Vercel Environment Variables", done: false }, { id: "13d", text: "Zmienić hasła: Stripe, Circle, OMG HUB", done: false }],
    aiContext: "Bezpieczeństwo — klucz API był w niezaszyfrowanym mailu." },
  // DOM
  { id: 14, category: "dom", priority: "critical", text: "🌿 Naprawa ogrodu i płotu przed najmem", status: "inprogress", progress: 40,
    steps: [{ id: "14a", text: "Kontakt z ekipą ✓", done: true }, { id: "14b", text: "Spotkanie Michał Narkiewicz (wt 30.06 20:00)", done: false }, { id: "14c", text: "Otrzymać wycenę", done: false }, { id: "14d", text: "Podpisać zlecenie", done: false }, { id: "14e", text: "Nadzorować prace", done: false }],
    aiContext: "Naprawa ogrodu i płotu przed wynajmem domu w Izabelinie." },
  { id: 15, category: "dom", priority: "high", text: "🏠 Oczyścić dom i przygotować do najmu", status: "todo", progress: 0,
    steps: [{ id: "15a", text: "Lista rzeczy do oddania/wyrzucenia", done: true }, { id: "15b", text: "Wywieźć rzeczy", done: true }, { id: "15c", text: "Sprzątanie generalne (kuchnia, salon, hol górny 50%)", done: true }, { id: "15d", text: "Zdjęcia do ogłoszenia", done: false }, { id: "15e", text: "Wystawić ogłoszenie", done: false }],
    aiContext: "Przygotowanie domu w Izabelinie do wynajmu." },
  { id: 16, category: "dom", priority: "high", text: "🔨 Ursus — montaż mebli (śr 13:00–17:00)", status: "todo", progress: 0,
    steps: [{ id: "16a", text: "Potwierdzić godzinę z ekipą", done: false }, { id: "16b", text: "Pojechać na budowę o 13:00", done: false }, { id: "16c", text: "Zaakceptować montaż", done: false }],
    aiContext: "Nadzór montażu mebli w mieszkaniu mamy w Ursusie." },
  { id: 17, category: "dom", priority: "medium", text: "🚗 Umówić przegląd auta", status: "todo", progress: 0,
    steps: [{ id: "17a", text: "Zadzwonić do serwisu", done: false }, { id: "17b", text: "Umówić termin", done: false }],
    aiContext: "Przegląd techniczny samochodu." },
  // PRAWNE
  { id: 18, category: "prawne", priority: "critical", text: "⚖️ Wysłać pełnomocnictwo — kancelaria Rasek (pt 4.07)", status: "todo", progress: 0,
    steps: [{ id: "18a", text: "Sprawdzić czy dokument gotowy", done: false }, { id: "18b", text: "Wysłać do kancelarii Rasek", done: false }],
    aiContext: "Pełnomocnictwo do kancelarii Rasek — deadline piątek 4 lipca." },
  { id: 19, category: "prawne", priority: "critical", text: "⚖️ Wniosek do sądu (przed pt 11.07)", status: "todo", progress: 0,
    steps: [{ id: "19a", text: "Przygotować wniosek", done: false }, { id: "19b", text: "Wysłać przed piątkiem 11.07", done: false }],
    aiContext: "Wniosek do sądu — twardy deadline piątek 11 lipca." },
  { id: 20, category: "prawne", priority: "critical", text: "⚖️ Wypowiedzenie umowy Rzeszów (pt 4.07)", status: "todo", progress: 0,
    steps: [{ id: "20a", text: "Sprawdzić wymagany okres wypowiedzenia", done: false }, { id: "20b", text: "Wysłać wypowiedzenie", done: false }],
    aiContext: "Wypowiedzenie umowy w Rzeszowie — wysyłka w piątek 4 lipca." },
  { id: 21, category: "prawne", priority: "medium", text: "🧬 Wysłanie testu DNA (czwartek 9.07)", status: "todo", progress: 0,
    steps: [{ id: "21a", text: "Przygotować próbkę do wysyłki", done: false }, { id: "21b", text: "Wysłać w czwartek 9.07", done: false }],
    aiContext: "Wysyłka testu DNA." },
  // ŻYCIE
  { id: 22, category: "życie", priority: "high", text: "💅 Paznokcie przed Paryżem (niedziela 5.07)", status: "todo", progress: 0,
    steps: [{ id: "22a", text: "Umówić wizytę", done: false }, { id: "22b", text: "Zrobić paznokcie wieczorem", done: false }],
    aiContext: "Przygotowanie urody przed pokazem w Paryżu." },
  { id: 23, category: "życie", priority: "high", text: "💇‍♀️ Odrost — przed Paryżem (niedziela 5.07)", status: "todo", progress: 0,
    steps: [{ id: "23a", text: "Umówić wizytę u fryzjera", done: false }, { id: "23b", text: "Zrobić odrost", done: false }],
    aiContext: "Odrost przed wyjazdem do Paryża na pokaz." },
  { id: 24, category: "życie", priority: "medium", text: "🎬 Kino Murano (sobota 4.07 rano)", status: "todo", progress: 0,
    steps: [{ id: "24a", text: "Sprawdzić repertuar", done: false }, { id: "24b", text: "Kupić bilet", done: false }],
    aiContext: "Kino Murano w sobotę rano." },
  { id: 25, category: "życie", priority: "medium", text: "🎭 Teatr — środa wieczór", status: "todo", progress: 0,
    steps: [{ id: "25a", text: "Wybrać spektakl", done: false }, { id: "25b", text: "Kupić bilety", done: false }],
    aiContext: "Teatr w środę wieczór w Warszawie." },
  { id: 26, category: "życie", priority: "medium", text: "🕍 Networking Chabad Miami — zakwaterowanie październik", status: "todo", progress: 0,
    steps: [{ id: "26a", text: "Napisać do Rabbi Kellera — odnowić kontakt", done: false }, { id: "26b", text: "Uczestniczyć w wydarzeniach Chabad online", done: false }, { id: "26c", text: "Zidentyfikować 3-5 osób z większymi domami", done: false }, { id: "26d", text: "Zbudować relację przed bezpośrednią prośbą", done: false }, { id: "26e", text: "Przygotować propozycję wartości — sierpień", done: false }],
    aiContext: "Szukam zakwaterowania w Miami od października przez sieć Chabad Sunny Isles." },
];

const CATEGORY_META = {
  biznes: { label: "Biznes", color: "#C8A97E", icon: "💼" },
  dom: { label: "Dom", color: "#7EB5C8", icon: "🏠" },
  prawne: { label: "Prawne", color: "#FF6B6B", icon: "⚖️" },
  życie: { label: "Życie", color: "#A97EC8", icon: "✨" },
};

const PRIORITY_META = {
  critical: { label: "Krytyczny", dot: "#FF4D4D" },
  high: { label: "Wysoki", dot: "#C8A97E" },
  medium: { label: "Średni", dot: "#7EB5C8" },
  low: { label: "Niski", dot: "#555" },
};

const AI_MODES = [
  { id: "next", label: "🎯 Następny krok" },
  { id: "template", label: "✉️ Szablon" },
  { id: "strategy", label: "🧠 Strategia" },
];

export default function App() {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [cardio, setCardio] = useState({});
  const [jakubTasks, setJakubTasks] = useState(JAKUB_TASKS);
  const [expandedId, setExpandedId] = useState(null);
  const [aiMode, setAiMode] = useState("next");
  const [aiResponses, setAiResponses] = useState({});
  const [aiLoading, setAiLoading] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [timeOfDay] = useState(getTimeOfDay());
  const [tomorrowGoals, setTomorrowGoals] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    try {
      const g = localStorage.getItem("goals-v5");
      if (g) setGoals(JSON.parse(g));
      const c = localStorage.getItem("cardio-v2");
      if (c) setCardio(JSON.parse(c));
      const t = localStorage.getItem("tomorrow-v1");
      if (t) setTomorrowGoals(JSON.parse(t));
      const j = localStorage.getItem("jakub-v1");
      if (j) setJakubTasks(JSON.parse(j));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => { if (!loaded) return; localStorage.setItem("goals-v5", JSON.stringify(goals)); }, [goals, loaded]);
  useEffect(() => { if (!loaded) return; localStorage.setItem("cardio-v2", JSON.stringify(cardio)); }, [cardio, loaded]);
  useEffect(() => { if (!loaded) return; localStorage.setItem("tomorrow-v1", JSON.stringify(tomorrowGoals)); }, [tomorrowGoals, loaded]);
  useEffect(() => { if (!loaded) return; localStorage.setItem("jakub-v1", JSON.stringify(jakubTasks)); }, [jakubTasks, loaded]);

  const updateGoal = (id, changes) => setGoals(g => g.map(x => x.id === id ? { ...x, ...changes } : x));
  const toggleStep = (goalId, stepId) => setGoals(g => g.map(x => x.id === goalId ? { ...x, steps: x.steps.map(s => s.id === stepId ? { ...s, done: !s.done } : s) } : x));
  const toggleCardio = (day) => setCardio(c => ({ ...c, [day]: !c[day] }));
  const toggleTomorrow = (id) => setTomorrowGoals(t => t.includes(id) ? t.filter(x => x !== id) : [...t, id]);
  const toggleJakub = (id) => setJakubTasks(j => j.map(x => x.id === id ? { ...x, done: !x.done } : x));

  const doneGoals = goals.filter(g => g.status === "done");
  const donePct = Math.round((doneGoals.length / goals.length) * 100);
  const criticalGoals = goals.filter(g => g.priority === "critical" && g.status !== "done");
  const cardioDone = CARDIO_DAYS.filter(d => cardio[d.id]).length;

  const filteredGoals = activeCategory === "all" ? goals : goals.filter(g => g.category === activeCategory);

  const askAI = async (goal, mode) => {
    const key = `${goal.id}-${mode}`;
    setAiLoading(key);
    const prompts = {
      next: `Jestem Gosia Leitner — polska businesswoman i modelka. Pracuję nad: "${goal.text}". Ukończone: ${goal.steps.filter(s => s.done).map(s => s.text).join(", ") || "brak"}. Pozostałe: ${goal.steps.filter(s => !s.done).map(s => s.text).join(", ")}. Jeden konkretny krok na dziś, max 15 minut. 2-3 zdania. Po polsku.`,
      template: `Jestem Gosia Leitner — polska businesswoman i modelka. Gotowy szablon wiadomości dla: "${goal.text}". Kontekst: ${goal.aiContext}. Profesjonalny, ciepły ton. Po polsku.`,
      strategy: `Jestem Gosia Leitner — polska businesswoman i modelka. Zadanie: "${goal.text}". Postęp: ${goal.progress}%. ${goal.aiContext}. 3 punkty jak domknąć w tym tygodniu. Po polsku.`,
    };
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 800, messages: [{ role: "user", content: prompts[mode] }] }),
      });
      const data = await res.json();
      setAiResponses(r => ({ ...r, [key]: data.content?.[0]?.text || "Brak odpowiedzi." }));
    } catch {
      setAiResponses(r => ({ ...r, [key]: "Błąd połączenia. Spróbuj ponownie." }));
    }
    setAiLoading(null);
  };

  const greeting = timeOfDay === "morning" ? "Dzień dobry" : timeOfDay === "evening" ? "Dobry wieczór" : "Cześć";
  const greetingMsg = timeOfDay === "morning" ? "Co dziś realizujesz?" : timeOfDay === "evening" ? "Czas na podsumowanie dnia." : "Jesteś w środku dnia.";

  const GoalCard = ({ goal }) => {
    const isExpanded = expandedId === goal.id;
    const aiKey = `${goal.id}-${aiMode}`;
    const stepsDone = goal.steps.filter(s => s.done).length;
    const cat = goal.category;
    const isEveningDim = timeOfDay === "evening" && goal.status !== "done";
    return (
      <div style={{ ...s.card, ...(goal.status === "done" ? s.cardDone : {}), ...(isEveningDim ? s.cardEveningDim : {}) }}>
        <div style={s.cardTop} onClick={() => setExpandedId(isExpanded ? null : goal.id)}>
          <div style={s.cardBody}>
            <div style={s.cardMeta}>
              <span style={{ ...s.dot, background: PRIORITY_META[goal.priority].dot }} />
              <span style={{ ...s.statusPill, background: STATUS_META[goal.status].bg, color: STATUS_META[goal.status].color }}>{STATUS_META[goal.status].label}</span>
              <span style={s.stepsBadge}>{stepsDone}/{goal.steps.length}</span>
              {timeOfDay === "evening" && (
                <button onClick={e => { e.stopPropagation(); toggleTomorrow(goal.id); }}
                  style={{ ...s.tomorrowBtn, ...(tomorrowGoals.includes(goal.id) ? s.tomorrowBtnActive : {}) }}>
                  {tomorrowGoals.includes(goal.id) ? "→ jutro ✓" : "→ jutro"}
                </button>
              )}
            </div>
            <div style={{ ...s.cardText, ...(goal.status === "done" ? s.cardTextDone : {}) }}>{goal.text}</div>
            <div style={s.progressRow}>
              <div style={s.bar}><div style={{ ...s.barFill, width: `${goal.progress}%`, background: CATEGORY_META[cat]?.color || "#C8A97E" }} /></div>
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
              <input type="range" min="0" max="100" value={goal.progress} onChange={e => updateGoal(goal.id, { progress: Number(e.target.value) })} style={s.slider} />
            </div>
            <div style={s.stepsTitle}>Kroki:</div>
            {goal.steps.map(step => (
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
              {aiResponses[aiKey] && <div style={s.aiResponse}>{aiResponses[aiKey]}</div>}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={s.root}>
      {/* TOP BAR */}
      <div style={s.topBar}>
        <div style={s.topLeft}>
          <div style={s.greeting}>{greeting}, Gosia</div>
          <div style={s.greetingMsg}>{greetingMsg}</div>
        </div>
        <div style={s.topCenter}>
          <div style={s.dateLabel}>{TODAY_STR}</div>
          <div style={s.weekLabel}>Tydzień {WEEK}</div>
        </div>
        <div style={s.topRight}>
          <div style={s.miniStats}>
            <div style={s.miniStat}>
              <span style={{ ...s.miniStatNum, color: donePct >= 60 ? "#4CAF50" : "#C8A97E" }}>{donePct}%</span>
              <span style={s.miniStatLabel}>zrealizowane</span>
            </div>
            <div style={s.miniStat}>
              <span style={{ ...s.miniStatNum, color: "#FF4D4D" }}>{criticalGoals.length}</span>
              <span style={s.miniStatLabel}>krytyczne</span>
            </div>
            <div style={s.miniStat}>
              <span style={{ ...s.miniStatNum, color: "#4CAF50" }}>{cardioDone}/6</span>
              <span style={s.miniStatLabel}>kardio</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN 3-COLUMN GRID */}
      <div style={s.mainGrid}>
        {/* LEFT */}
        <div style={s.leftPanel}>
          <div style={s.panelTitle}>📅 DZIŚ</div>

          {criticalGoals.length > 0 && (
            <div style={s.criticalBox}>
              <div style={s.criticalLabel}>🔴 TERAZ — KRYTYCZNE</div>
              {criticalGoals.slice(0, 3).map(g => (
                <div key={g.id} style={s.criticalItem}>
                  <div style={s.criticalText}>{g.text}</div>
                  <div style={s.progressRow}>
                    <div style={s.bar}><div style={{ ...s.barFill, width: `${g.progress}%`, background: "#FF4D4D" }} /></div>
                    <span style={s.progressPct}>{g.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={s.cardioBox}>
            <div style={s.cardioTitle}>💪 Kardio 7:00</div>
            <div style={s.cardioRow}>
              {CARDIO_DAYS.map(d => (
                <div key={d.id} onClick={() => toggleCardio(d.id)} style={{ ...s.cardioDay, ...(cardio[d.id] ? s.cardioDone : {}) }}>
                  <div style={s.cardioDayLabel}>{d.label}</div>
                  <div style={s.cardioCheck}>{cardio[d.id] ? "✓" : "○"}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={s.panelTitle}>👨‍💻 JAKUB — DZIŚ</div>
          {jakubTasks.map(task => (
            <div key={task.id} style={s.jakubTask} onClick={() => toggleJakub(task.id)}>
              <div style={{ ...s.stepCheck, ...(task.done ? s.stepCheckDone : {}), width: 14, height: 14, fontSize: 9 }}>{task.done && "✓"}</div>
              <span style={{ ...s.jakubText, ...(task.done ? s.stepTextDone : {}) }}>{task.text}</span>
            </div>
          ))}

          {timeOfDay === "evening" && tomorrowGoals.length > 0 && (
            <div style={s.eveningBox}>
              <div style={s.eveningTitle}>🌙 Na jutro:</div>
              {goals.filter(g => tomorrowGoals.includes(g.id)).map(g => (
                <div key={g.id} style={s.eveningItem}>→ {g.text}</div>
              ))}
            </div>
          )}
        </div>

        {/* CENTER */}
        <div style={s.centerPanel}>
          <div style={s.panelTitle}>🎯 CELE TYGODNIA</div>

          <div style={s.weekProgress}>
            <div style={s.weekProgressBar}>
              <div style={{ ...s.weekProgressFill, width: `${donePct}%` }} />
            </div>
            <div style={s.weekProgressLabel}>
              <span style={{ color: donePct >= 60 ? "#4CAF50" : "#C8A97E" }}>{donePct}% tygodnia</span>
              <span style={{ color: "#555" }}>{doneGoals.length}/{goals.length} zadań</span>
            </div>
          </div>

          {/* Category filter */}
          <div style={s.filterRow}>
            <button onClick={() => setActiveCategory("all")} style={{ ...s.filterBtn, ...(activeCategory === "all" ? s.filterBtnActive : {}) }}>Wszystkie</button>
            {Object.entries(CATEGORY_META).map(([cat, meta]) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ ...s.filterBtn, ...(activeCategory === cat ? { ...s.filterBtnActive, borderColor: meta.color, color: meta.color } : {}) }}>
                {meta.icon} {meta.label}
              </button>
            ))}
          </div>

          {activeCategory === "all" ? (
            Object.entries(CATEGORY_META).map(([cat, meta]) => {
              const items = goals.filter(g => g.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} style={s.catSection}>
                  <div style={{ ...s.catHeader, borderColor: meta.color }}>
                    <span style={s.catIcon}>{meta.icon}</span>
                    <span style={{ ...s.catLabel, color: meta.color }}>{meta.label}</span>
                    <span style={s.catCount}>{items.filter(i => i.status === "done").length}/{items.length}</span>
                  </div>
                  {items.map(goal => <GoalCard key={goal.id} goal={goal} />)}
                </div>
              );
            })
          ) : (
            <div style={s.catSection}>
              {filteredGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={s.rightPanel}>
          <div style={s.panelTitle}>🚀 CELE Q3 (3 MIESIĄCE)</div>
          {QUARTERLY_GOALS.map(qg => (
            <div key={qg.id} style={s.longGoalBox}>
              <div style={{ ...s.longGoalLabel, color: qg.color }}>{qg.text}</div>
              <div style={s.longGoalValue}>{qg.value}</div>
            </div>
          ))}

          <div style={{ ...s.panelTitle, marginTop: 20 }}>📈 WYNIKI</div>
          {Object.entries(CATEGORY_META).map(([cat, meta]) => {
            const items = goals.filter(g => g.category === cat);
            const avg = Math.round(items.reduce((a, g) => a + g.progress, 0) / items.length);
            const done = items.filter(i => i.status === "done").length;
            return (
              <div key={cat} style={s.resultRow}>
                <div style={s.resultTop}>
                  <span style={{ color: meta.color, fontSize: 11 }}>{meta.icon} {meta.label}</span>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{done}/{items.length}</span>
                </div>
                <div style={s.bar}><div style={{ ...s.barFill, width: `${avg}%`, background: meta.color }} /></div>
              </div>
            );
          })}

          <div style={s.resultRow}>
            <div style={s.resultTop}>
              <span style={{ color: "#4CAF50", fontSize: 11 }}>💪 Kardio</span>
              <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{cardioDone}/6</span>
            </div>
            <div style={s.bar}><div style={{ ...s.barFill, width: `${(cardioDone / 6) * 100}%`, background: "#4CAF50" }} /></div>
          </div>

          {donePct >= 60 && (
            <div style={s.winBox}>🏆 {donePct}% — świetny tydzień!</div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  root: { background: "#0a0a0a", minHeight: "100vh", color: "#e0e0e0", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #1a1a1a", background: "#0d0d0d" },
  topLeft: {},
  greeting: { fontSize: 16, fontWeight: 700, color: "#fff" },
  greetingMsg: { fontSize: 11, color: "#555", marginTop: 2 },
  topCenter: { textAlign: "center" },
  dateLabel: { fontSize: 13, color: "#C8A97E", fontWeight: 600, textTransform: "capitalize" },
  weekLabel: { fontSize: 10, color: "#444", marginTop: 2 },
  topRight: {},
  miniStats: { display: "flex", gap: 16 },
  miniStat: { display: "flex", flexDirection: "column", alignItems: "center" },
  miniStatNum: { fontSize: 18, fontWeight: 700, lineHeight: 1 },
  miniStatLabel: { fontSize: 9, color: "#555", marginTop: 2 },
  mainGrid: { display: "grid", gridTemplateColumns: "260px 1fr 240px", gap: 0, flex: 1, height: "calc(100vh - 65px)", overflow: "hidden" },
  leftPanel: { borderRight: "1px solid #1a1a1a", padding: "14px 12px", overflowY: "auto", background: "#0d0d0d" },
  centerPanel: { padding: "14px 18px", overflowY: "auto" },
  rightPanel: { borderLeft: "1px solid #1a1a1a", padding: "14px 12px", overflowY: "auto", background: "#0d0d0d" },
  panelTitle: { fontSize: 9, fontWeight: 700, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 },
  criticalBox: { background: "#1a0808", border: "1px solid #FF4D4D33", borderRadius: 8, padding: 10, marginBottom: 12 },
  criticalLabel: { fontSize: 9, color: "#FF4D4D", fontWeight: 700, letterSpacing: 1, marginBottom: 6 },
  criticalItem: { marginBottom: 6 },
  criticalText: { fontSize: 11, color: "#ddd", lineHeight: 1.4, marginBottom: 3 },
  cardioBox: { background: "#0d1a0d", border: "1px solid #4CAF5033", borderRadius: 8, padding: 8, marginBottom: 12 },
  cardioTitle: { fontSize: 9, color: "#4CAF50", fontWeight: 700, letterSpacing: 1, marginBottom: 6 },
  cardioRow: { display: "flex", gap: 3 },
  cardioDay: { flex: 1, background: "#141414", border: "1px solid #222", borderRadius: 5, padding: "5px 2px", textAlign: "center", cursor: "pointer" },
  cardioDone: { background: "#0d1f0d", border: "1px solid #4CAF50" },
  cardioDayLabel: { fontSize: 8, color: "#888", fontWeight: 700 },
  cardioCheck: { fontSize: 11, color: "#4CAF50", marginTop: 2 },
  jakubTask: { display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 6, cursor: "pointer" },
  jakubText: { fontSize: 11, color: "#777", lineHeight: 1.4 },
  eveningBox: { marginTop: 12, background: "#0d0d1a", border: "1px solid #C8A97E33", borderRadius: 8, padding: 10 },
  eveningTitle: { fontSize: 10, color: "#C8A97E", fontWeight: 700, marginBottom: 6 },
  eveningItem: { fontSize: 11, color: "#777", marginBottom: 3 },
  weekProgress: { marginBottom: 12 },
  weekProgressBar: { height: 5, background: "#1e1e1e", borderRadius: 3, overflow: "hidden", marginBottom: 4 },
  weekProgressFill: { height: "100%", background: "linear-gradient(90deg, #C8A97E, #4CAF50)", borderRadius: 3, transition: "width 0.6s" },
  weekProgressLabel: { display: "flex", justifyContent: "space-between", fontSize: 10 },
  filterRow: { display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" },
  filterBtn: { padding: "4px 8px", background: "#141414", border: "1px solid #2a2a2a", color: "#555", borderRadius: 4, fontSize: 9, cursor: "pointer" },
  filterBtnActive: { background: "#1a1a1a", border: "1px solid #C8A97E", color: "#C8A97E" },
  catSection: { marginBottom: 18 },
  catHeader: { display: "flex", alignItems: "center", gap: 6, borderLeft: "3px solid", paddingLeft: 8, marginBottom: 8 },
  catIcon: { fontSize: 12 },
  catLabel: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", flex: 1 },
  catCount: { fontSize: 10, color: "#555" },
  card: { background: "#111", borderRadius: 8, marginBottom: 5, overflow: "hidden", border: "1px solid #1e1e1e" },
  cardDone: { opacity: 0.4 },
  cardEveningDim: { opacity: 0.65 },
  cardTop: { display: "flex", alignItems: "flex-start", padding: "10px 12px", gap: 8, cursor: "pointer" },
  cardBody: { flex: 1 },
  cardMeta: { display: "flex", alignItems: "center", gap: 5, marginBottom: 4, flexWrap: "wrap" },
  dot: { width: 5, height: 5, borderRadius: "50%", flexShrink: 0 },
  statusPill: { fontSize: 8, borderRadius: 3, padding: "1px 4px" },
  stepsBadge: { fontSize: 8, color: "#444" },
  tomorrowBtn: { fontSize: 8, background: "none", border: "1px solid #333", color: "#555", borderRadius: 3, padding: "1px 5px", cursor: "pointer", marginLeft: "auto" },
  tomorrowBtnActive: { border: "1px solid #C8A97E", color: "#C8A97E" },
  cardText: { fontSize: 12, color: "#ddd", lineHeight: 1.4, marginBottom: 5 },
  cardTextDone: { textDecoration: "line-through", color: "#444" },
  progressRow: { display: "flex", alignItems: "center", gap: 5 },
  progressPct: { fontSize: 9, color: "#555", minWidth: 22 },
  arrow: { color: "#333", fontSize: 9 },
  expanded: { padding: "0 12px 12px" },
  statusRow: { display: "flex", gap: 4, marginBottom: 10 },
  statusBtn: { flex: 1, padding: "4px 4px", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#555", borderRadius: 4, fontSize: 9, cursor: "pointer" },
  sliderRow: { marginBottom: 10 },
  sliderLabel: { fontSize: 9, color: "#888", display: "block", marginBottom: 4 },
  slider: { width: "100%", accentColor: "#C8A97E" },
  stepsTitle: { fontSize: 9, color: "#555", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 },
  step: { display: "flex", alignItems: "flex-start", gap: 7, padding: "5px 0", borderBottom: "1px solid #1a1a1a", cursor: "pointer" },
  stepCheck: { width: 15, height: 15, borderRadius: 3, border: "1.5px solid #333", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#4CAF50" },
  stepCheckDone: { background: "#4CAF50", borderColor: "#4CAF50", color: "#000" },
  stepText: { fontSize: 11, color: "#bbb", lineHeight: 1.4 },
  stepTextDone: { textDecoration: "line-through", color: "#444" },
  aiBox: { marginTop: 12, background: "#0d0d1a", borderRadius: 8, padding: 12, border: "1px solid #C8A97E22" },
  aiTitle: { fontSize: 10, fontWeight: 700, color: "#C8A97E", marginBottom: 8 },
  aiModes: { display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" },
  aiModeBtn: { padding: "4px 8px", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#555", borderRadius: 4, fontSize: 9, cursor: "pointer" },
  aiModeBtnActive: { background: "#1a1a2e", border: "1px solid #C8A97E", color: "#C8A97E" },
  aiAskBtn: { width: "100%", padding: "8px", background: "#C8A97E", border: "none", color: "#000", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", marginBottom: 8 },
  aiResponse: { fontSize: 11, color: "#ccc", lineHeight: 1.6, background: "#141414", borderRadius: 6, padding: 10, whiteSpace: "pre-wrap" },
  bar: { height: 3, background: "#1e1e1e", borderRadius: 2, overflow: "hidden", flex: 1 },
  barFill: { height: "100%", borderRadius: 2, transition: "width 0.5s" },
  longGoalBox: { background: "#141414", borderRadius: 6, padding: 10, marginBottom: 6, border: "1px solid #1e1e1e" },
  longGoalLabel: { fontSize: 11, fontWeight: 600, lineHeight: 1.4, marginBottom: 3 },
  longGoalValue: { fontSize: 10, color: "#555" },
  resultRow: { marginBottom: 10 },
  resultTop: { display: "flex", justifyContent: "space-between", marginBottom: 3 },
  winBox: { textAlign: "center", padding: 10, color: "#C8A97E", fontSize: 11, fontWeight: 600, border: "1px solid #C8A97E33", borderRadius: 8, marginTop: 10 },
};
