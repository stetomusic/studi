import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Placeholder from "./pages/Placeholder";
import Profile from "./pages/Profile";
import Mensa from "./pages/Mensa";

export default function App() {
  return (
    <>
      <UnauthenticatedTemplate>
        <Login />
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="news" element={<Placeholder title="News" text="Aktuelle Meldungen der PH Burgenland." />} />
            <Route path="termine" element={<Placeholder title="Termine" text="Fristen, Prüfungen und Veranstaltungen." />} />
            <Route path="stundenplan" element={<Placeholder title="Stundenplan" text="Deine Lehrveranstaltungen der Woche." />} />
            <Route path="mensa" element={<Mensa />} />
            <Route path="kontakte" element={<Placeholder title="Kontakte" text="Studienservice, Lehrende und wichtige Stellen." />} />
            <Route path="profil" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthenticatedTemplate>
    </>
  );
}
