import { json, error } from '@sveltejs/kit';

const postWebhook = (url: string | undefined, body: object) => {
  if (!url) return null;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
};

export const POST = async ({ request }: { request: Request }) => {
  const { category, message } = await request.json();

  if (!category || !message?.trim()) {
    error(400, 'Missing category or message');
  }

  const text = `[${category}] ${message.trim()}`;

  const results = await Promise.allSettled([
    postWebhook(process.env.SLACK_WEBHOOK_URL, { text }),
    postWebhook(process.env.DISCORD_WEBHOOK_URL, { content: text })
  ].filter(Boolean) as Promise<Response>[]);

  if (results.some((r) => r.status === 'rejected')) {
    error(502, 'Failed to deliver request');
  }

  return json({ ok: true });
};
