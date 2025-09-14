type StoredTokens = {
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresAt?: string | null;
};

const LS_KEY = "auth_tokens";
const SS_KEY = "auth_tokens_ss";

function getStore(remember: boolean) {
  return remember ? localStorage : sessionStorage;
}

export function saveTokens(tokens: StoredTokens, remember: boolean) {
  const store = getStore(remember);
  store.setItem(remember ? LS_KEY : SS_KEY, JSON.stringify(tokens));
  (remember ? sessionStorage : localStorage).removeItem(
    remember ? SS_KEY : LS_KEY
  );
}

export function readTokens(): { tokens: StoredTokens; remember: boolean } {
  const ls = localStorage.getItem(LS_KEY);
  if (ls) return { tokens: JSON.parse(ls), remember: true };
  const ss = sessionStorage.getItem(SS_KEY);
  if (ss) return { tokens: JSON.parse(ss), remember: false };
  return { tokens: {}, remember: true };
}

export function clearTokens() {
  localStorage.removeItem(LS_KEY);
  sessionStorage.removeItem(SS_KEY);
}
