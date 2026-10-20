import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { EventType, PublicClientApplication, type AuthenticationResult } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { isAuthConfigured, msalConfig } from "./authConfig";
import App from "./App";
import ConfigMissing from "./pages/ConfigMissing";
import "./styles.css";

const root = createRoot(document.getElementById("root")!);

async function start() {
  if (!isAuthConfigured) {
    root.render(<ConfigMissing />);
    return;
  }

  const msal = new PublicClientApplication(msalConfig);
  await msal.initialize();

  // Nach dem Redirect von Microsoft das angemeldete Konto als aktiv setzen
  const result = await msal.handleRedirectPromise();
  if (result?.account) msal.setActiveAccount(result.account);
  if (!msal.getActiveAccount() && msal.getAllAccounts().length > 0) {
    msal.setActiveAccount(msal.getAllAccounts()[0]);
  }
  msal.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      if (payload.account) msal.setActiveAccount(payload.account);
    }
  });

  root.render(
    <StrictMode>
      <MsalProvider instance={msal}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MsalProvider>
    </StrictMode>,
  );
}

start().catch((err) => {
  console.error(err);
  root.render(<p style={{ padding: 24 }}>Die App konnte nicht gestartet werden: {String(err)}</p>);
});
