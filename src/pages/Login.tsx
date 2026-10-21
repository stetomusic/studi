import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

export default function Login() {
  const { instance, inProgress } = useMsal();
  const busy = inProgress !== InteractionStatus.None;

  return (
    <div className="login">
      <div className="login-card">
        <img src="/icon.svg" alt="" width={72} height={72} />
        <h1>studi</h1>
        <p>Das Infoportal für Studierende der PH Burgenland.</p>
        <button className="btn-ms" disabled={busy} onClick={() => instance.loginRedirect(loginRequest)}>
          <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden>
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </svg>
          {busy ? "Anmeldung läuft …" : "Mit Microsoft anmelden"}
        </button>
        <small>Melde dich mit deinem Hochschul-Konto an.</small>
      </div>
    </div>
  );
}
