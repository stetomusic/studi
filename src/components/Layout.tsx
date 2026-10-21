import { NavLink, Outlet } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

const tabs = [
  { to: "/", label: "Start", icon: "🏠" },
  { to: "/news", label: "News", icon: "📰" },
  { to: "/termine", label: "Termine", icon: "📅" },
  { to: "/stundenplan", label: "Plan", icon: "🗓️" },
  { to: "/profil", label: "Profil", icon: "👤" },
];

export default function Layout() {
  const { instance } = useMsal();
  const account = instance.getActiveAccount();

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">studi</span>
        <span className="who">{account?.name}</span>
      </header>
      <main className="content">
        <Outlet />
      </main>
      <nav className="tabbar">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.to === "/"} className="tab">
            <span aria-hidden>{t.icon}</span>
            <span>{t.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
