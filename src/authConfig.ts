import { type Configuration, LogLevel, type RedirectRequest } from "@azure/msal-browser";

const clientId = import.meta.env.VITE_ENTRA_CLIENT_ID ?? "";
const tenantId = import.meta.env.VITE_ENTRA_TENANT_ID ?? "";
const redirectUri = import.meta.env.VITE_ENTRA_REDIRECT_URI || window.location.origin + "/";

/** true, sobald Client-ID und Tenant-ID gesetzt sind */
export const isAuthConfigured = Boolean(clientId && tenantId);

export const msalConfig: Configuration = {
  auth: {
    clientId,
    // Nur Konten aus dem Mandanten der PH Burgenland zulassen
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
    postLogoutRedirectUri: redirectUri,
  },
  cache: {
    cacheLocation: "localStorage",
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        if (level === LogLevel.Error) console.error(message);
        else if (level === LogLevel.Warning) console.warn(message);
      },
    },
  },
};

/** Scopes für die Anmeldung. User.Read erlaubt später das Profil aus Microsoft Graph. */
export const loginRequest: RedirectRequest = {
  scopes: ["openid", "profile", "email", "User.Read"],
};
