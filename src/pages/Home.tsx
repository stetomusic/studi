import { Link } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

const tiles = [
  { to: "/news", label: "News", icon: "📰" },
  { to: "/termine", label: "Termine", icon: "📅" },
  { to: "/stundenplan", label: "Stundenplan", icon: "🗓️" },
  { to: "/mensa", label: "Mensa", icon: "🍽️" },
  { to: "/kontakte", label: "Kontakte", icon: "☎️" },
  { to: "/profil", label: "Profil", icon: "👤" },
];

export default function Home() {
  const { instance } = useMsal();
  const firstName = instance.getActiveAccount()?.name?.split(" ")[0];

  return (
    <section>
      <h1>Hallo{firstName ? `, ${firstName}` : ""}!</h1>
      <p className="muted">Willkommen im Infoportal der PH Burgenland.</p>
      <div className="tiles">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="tile">
            <span className="tile-icon" aria-hidden>{t.icon}</span>
            {t.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
