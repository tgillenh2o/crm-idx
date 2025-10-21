export async function onRequestGet() {
  const feedUrl = "https://raw.githubusercontent.com/tgillenwater/crm-idx/main/cf-worker/data/feed.json";

  try {
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch feed");
    }
    const data = await response.json();

    return new Response(
      JSON.stringify({ message: "Cloudflare Function is Live ✅", data }, null, 2),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
