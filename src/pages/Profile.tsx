import { useMsal } from "@azure/msal-react";

export default function Profile() {
  const { instance } = useMsal();
  const account = instance.getActiveAccount();

  return (
    <section>
      <h1>Profil</h1>
      <div className="card">
        <dl>
          <dt>Name</dt>
          <dd>{account?.name ?? "–"}</dd>
          <dt>E-Mail / Benutzername</dt>
          <dd>{account?.username ?? "–"}</dd>
        </dl>
      </div>
      <button className="btn-secondary" onClick={() => instance.logoutRedirect({ account })}>
        Abmelden
      </button>
    </section>
  );
}
