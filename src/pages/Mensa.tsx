import { useEffect, useMemo, useState } from "react";

const MENSA_URL = import.meta.env.VITE_MENSA_URL || "https://mensa.pphb.at/menu.json";
const CACHE_KEY = "studi.mensa.menu";
/** Ab dieser Uhrzeit (Ende Mittagstisch) wird der nächste Tag vorausgewählt */
const SWITCH_HOUR = 14;

type Item = { name: string; details?: string; category: string; label: string; allergens?: string[] };
type Day = { weekday: string; date: string; items: Item[] };
type Week = { start: string; end: string; calendarWeek: number; lunchHours?: string; source?: string; days: Day[] };
type Menu = { location: string; updatedAt: string; allergenLegend: Record<string, string>; weeks: Week[] };

const categoryIcon: Record<string, string> = {
  soup: "🥣",
  traditional: "🍖",
  vegetarian: "🥦",
  weekly: "⭐",
};

function isoDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function readCache(): Menu | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Menu) : null;
  } catch {
    return null;
  }
}

export default function Mensa() {
  const [menu, setMenu] = useState<Menu | null>(readCache);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    fetch(MENSA_URL, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Menu>;
      })
      .then((m) => {
        setMenu(m);
        setError(null);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(m));
        } catch {
          /* Speicher voll oder gesperrt: egal */
        }
      })
      .catch((e) => setError(String(e)));
  }, []);

  const days = useMemo(() => (menu?.weeks ?? []).flatMap((w) => w.days.map((d) => ({ ...d, week: w }))), [menu]);

  // Vorauswahl: heute, nach Mittag der nächste Tag; sonst der nächste Tag mit Plan
  const defaultDate = useMemo(() => {
    const now = new Date();
    const today = isoDate(now);
    const upcoming = days.filter((d) => d.date > today || (d.date === today && now.getHours() < SWITCH_HOUR));
    return (upcoming[0] ?? days[days.length - 1])?.date ?? null;
  }, [days]);

  const today = isoDate(new Date());
  const active = days.find((d) => d.date === (selected ?? defaultDate));
  const visibleDays = days.filter((d) => d.date >= today || d.week === active?.week);

  return (
    <section>
      <h1>Mensa</h1>
      <p className="muted">
        {menu?.location ?? "Mensa Campus Eisenstadt"}
        {active?.week.lunchHours ? ` · Mittagstisch ${active.week.lunchHours}` : ""}
      </p>

      {!menu && !error && <div className="card">Speiseplan wird geladen …</div>}
      {!menu && error && <div className="card">Der Speiseplan konnte gerade nicht geladen werden.</div>}
      {menu && days.length === 0 && <div className="card">Für die nächsten Tage ist noch kein Speiseplan veröffentlicht.</div>}

      {visibleDays.length > 0 && (
        <div className="chips" role="tablist">
          {visibleDays.map((d) => (
            <button
              key={d.date}
              role="tab"
              aria-selected={d.date === active?.date}
              className={"chip" + (d.date === active?.date ? " chip-active" : "")}
              onClick={() => setSelected(d.date)}
            >
              <span>{d.date === today ? "Heute" : d.weekday.slice(0, 2)}</span>
              <small>{new Date(d.date + "T12:00").toLocaleDateString("de-AT", { day: "numeric", month: "numeric" })}</small>
            </button>
          ))}
        </div>
      )}

      {active && (
        <div className="menu-list">
          {active.items.map((item, i) => (
            <article key={i} className="card menu-item">
              <div className="menu-label">
                <span aria-hidden>{categoryIcon[item.category] ?? "🍽️"}</span> {item.label}
              </div>
              <div className="menu-name">{item.name}</div>
              {item.details && <div className="muted">{item.details}</div>}
              {item.allergens && item.allergens.length > 0 && (
                <div className="allergens" title={item.allergens.map((a) => menu?.allergenLegend[a] ?? a).join(", ")}>
                  Allergene: {item.allergens.join(" ")}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {menu && (
        <>
          <button className="btn-secondary" onClick={() => setShowLegend((v) => !v)}>
            {showLegend ? "Allergene ausblenden" : "Allergene erklärt"}
          </button>
          {showLegend && (
            <div className="card">
              <dl className="legend">
                {Object.entries(menu.allergenLegend).map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <p className="muted small">
            Stand {new Date(menu.updatedAt).toLocaleString("de-AT", { dateStyle: "short", timeStyle: "short" })}
            {error ? " (offline, zuletzt gespeicherter Plan)" : ""}
            {active?.week.source && (
              <>
                {" · "}
                <a href={active.week.source} target="_blank" rel="noreferrer">Original-PDF</a>
              </>
            )}
          </p>
        </>
      )}
    </section>
  );
}
