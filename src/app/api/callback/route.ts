import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const cookieState = req.cookies.get("decap_oauth_state")?.value;

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!code || !state || state !== cookieState) {
    return htmlResponse(renderError("Invalid or expired OAuth state. Please try logging in again."));
  }
  if (!clientId || !clientSecret) {
    return htmlResponse(renderError("Server is missing GITHUB_OAUTH_CLIENT_ID / SECRET."));
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code })
  });
  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return htmlResponse(renderError("GitHub did not return an access token."));
  }

  return htmlResponse(renderSuccess(tokenData.access_token));
}

function htmlResponse(html: string) {
  return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
}

// Decap CMS's popup listens on window.opener via postMessage using this exact protocol.
function renderSuccess(token: string) {
  const payload = JSON.stringify({ token, provider: "github" });
  return `<!doctype html><html><body><script>
    (function() {
      function receiveMessage(message) {
        window.opener.postMessage(
          'authorization:github:success:${escapeForScript(payload)}',
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script></body></html>`;
}

function renderError(message: string) {
  return `<!doctype html><html><body><script>
    window.opener.postMessage('authorization:github:error:${escapeForScript(message)}', "*");
  </script><p>${message}</p></body></html>`;
}

function escapeForScript(str: string) {
  return str.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}
