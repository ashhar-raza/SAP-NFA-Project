// auth.jsx
import axios from "axios";

// ⚡ OAuth 2.0 Client Credentials
const CLIENT_ID = "sb-nfadb!t514376";
const CLIENT_SECRET = "33cbe06b-ae19-42ec-bacb-438ee6ac13ce$SFx9nENSckMd6agdGKeR_oZBfztzt_yyeu2C2pNyVkI=";
const TOKEN_URL = "https://b201b415trial.authentication.us10.hana.ondemand.com/oauth/token";

export const fetchToken = async () => {
  const cachedToken = localStorage.getItem("oauth_token");
  const tokenExpiry = localStorage.getItem("oauth_token_expiry");
  const now = Date.now();

  if (cachedToken && tokenExpiry && now < tokenExpiry - 60000) {
    return cachedToken;
  }

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  // Use btoa in browser instead of Buffer
  const authHeader = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  try {
    const response = await axios.post(TOKEN_URL, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${authHeader}`
      }
    });

    const token = response.data.access_token;
    const expiresIn = response.data.expires_in * 1000; // milliseconds
    const expiryTime = now + expiresIn;

    localStorage.setItem("oauth_token", token);
    localStorage.setItem("oauth_token_expiry", expiryTime);

    return token;
  } catch (error) {
    console.error("Failed to fetch OAuth token:", error.response?.data || error.message);
    throw error;
  }
};

export const getToken = () => {
  const token = localStorage.getItem("oauth_token");
  const expiry = localStorage.getItem("oauth_token_expiry");
  if (!token || !expiry) return null;
  return Date.now() < expiry ? token : null;
};
