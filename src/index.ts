// Copyright (C) 2022 Rie Takahashi

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

const GCP_API_URL = "https://storage.googleapis.com/storage/v1/b/discord/o/";

const ALLOWED_HOSTS = [
  "cdn.discordapp.com",
  "discordapp.com",
  "discordapp.net",
  "discord.com",
];

const makeGcpUrl = (path: string) => GCP_API_URL + encodeURIComponent(path);

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);

  const cdnUrl = url.searchParams.get("url");

  if (!cdnUrl) return new Response("404 Not Found", { status: 404 });

  let _cdnUrl: URL;

  try {
    _cdnUrl = new URL(cdnUrl);
  } catch {
    return new Response("403 Invalid Host", { status: 403 });
  }

  if (!ALLOWED_HOSTS.includes(_cdnUrl.hostname)) {
    return new Response("403 Host Not Allowed", { status: 403 });
  }

  let cdnPath = `${_cdnUrl.protocol}//${_cdnUrl.host}${_cdnUrl.pathname}`.split(
    /discordapp\.com|discord\.com|discordapp\.net/
  )[1];

  if (!cdnPath.startsWith("/assets/")) {
    if (cdnPath.startsWith("/guilds/")) {
      cdnPath = cdnPath.replace(
        /\/([\w\d-]+)\/(\d+)\/(\w+)\/(\w+)\.\w+$/,
        "/$1/$2/$3/$4"
      );
    } else {
      cdnPath = cdnPath.replace(
        /\/([\w\d-]+)\/(\d+)\/(\w+)\.\w+$/,
        "/$1/$2/$3"
      );
    }
  }

  cdnPath = cdnPath.replace(/^\//, "");

  const gcpUrl = makeGcpUrl(cdnPath);

  let finalUrl: URL;

  try {
    finalUrl = new URL(gcpUrl);
  } catch {
    return new Response("403 Host Not Allowed", { status: 403 });
  }

  const gcpResponse = await fetch(finalUrl.toString());

  if (!gcpResponse.ok) {
    return new Response("404 Asset Not Found", { status: 404 });
  }

  const json = await gcpResponse.json().catch(() => {});

  if (!json) {
    return new Response("404 Asset Not Found", { status: 404 });
  }

  return new Response(JSON.stringify(json, null, 4), {
    headers: { "content-type": "application/json" },
  });
}
