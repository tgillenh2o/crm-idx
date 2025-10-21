export async function onRequestGet(context) {
  const IDX_FEED_URL = "https://raw.githubusercontent.com/tgillenh2o/crm-idx/main/cf-worker/data/feed.json";

  try {
    const response = await fetch(IDX_FEED_URL);
    if (!response.ok) {
      return new Response("Failed to fetch feed", { status: 500 });
    }

    const feed = await response.json();
    return new Response(JSON.stringify(feed, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
