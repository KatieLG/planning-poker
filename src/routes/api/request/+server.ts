import { json, error } from '@sveltejs/kit';

const CATEGORY_EMOJI: Record<string, string> = {
  Feature: '🚀',
  Bug: '🐛',
  'Easter egg': '🥚',
  Other: '📝'
};

const postWebhook = (url: string | undefined, body: object) => {
  if (!url) return null;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
};

const slackPayload = (category: string, message: string) => ({
  attachments: [
    {
      color: '#6366f1',
      title: `${CATEGORY_EMOJI[category] ?? '📝'} ${category}`,
      text: message,
      footer: 'Planning Poker',
      mrkdwn_in: ['text']
    }
  ]
});

const discordPayload = (category: string, message: string) => ({
  embeds: [
    {
      title: `${CATEGORY_EMOJI[category] ?? '📝'} ${category}`,
      description: message,
      footer: { text: 'Planning Poker' },
      color: 0x6366f1
    }
  ]
});

export const POST = async ({ request }: { request: Request }) => {
  const { category, message } = await request.json();

  if (!category || !message?.trim()) {
    error(400, 'Missing category or message');
  }

  const trimmed = message.trim();

  const results = await Promise.allSettled(
    [
      postWebhook(process.env.SLACK_WEBHOOK_URL, slackPayload(category, trimmed)),
      postWebhook(process.env.DISCORD_WEBHOOK_URL, discordPayload(category, trimmed))
    ].filter(Boolean) as Promise<Response>[]
  );

  if (results.some((r) => r.status === 'rejected')) {
    error(502, 'Failed to deliver request');
  }

  return json({ ok: true });
};
