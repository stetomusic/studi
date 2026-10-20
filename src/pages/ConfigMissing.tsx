export default function ConfigMissing() {
  return (
    <div className="login">
      <div className="login-card">
        <h1>Anmeldung noch nicht eingerichtet</h1>
        <p>
          Es fehlen <code>VITE_ENTRA_CLIENT_ID</code> und/oder <code>VITE_ENTRA_TENANT_ID</code>.
          Lege eine Datei <code>.env.local</code> nach dem Muster von <code>.env.example</code> an
          (Details im README).
        </p>
      </div>
    </div>
  );
}
