import { NextRequest, NextResponse } from "next/server";

/**
 * Minimal self-hosted OAuth provider for Decap CMS's "github" backend, so
 * authentication works when the CMS is served from Vercel instead of Netlify.
 * Requires GITHUB_OAUTH_CLIENT_ID / GITHUB_OAUTH_CLIENT_SECRET env vars,
 * set from a GitHub OAuth App you create (see README "Connecting the CMS").
 */
export async function GET(req: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "GITHUB_OAUTH_CLIENT_ID is not configured" }, { status: 500 });
  }

  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/callback`;
  const state = crypto.randomUUID();

  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo,user");
  authorizeUrl.searchParams.set("state", state);

  const res = NextResponse.redirect(authorizeUrl.toString());
  res.cookies.set("decap_oauth_state", state, { httpOnly: true, maxAge: 600, path: "/" });
  return res;
}
