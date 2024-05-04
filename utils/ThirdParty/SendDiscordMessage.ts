interface DiscordMessage {
  title: string;
  type: "rich";
  message: string;
  description: string;
  url: string;
  timestamp: Date;
  color: number;
  footer: { text: string; icon_url: string };
  thumbnail: { url: string };
  image: { url: string };
  author: { name: string; url: string; icon_url: string };
  fields?: { name: string; value: string; inline: boolean }[];
}

export async function sendMessage({
  embeddedMsgs,
  webhook,
}: {
  embeddedMsgs: DiscordMessage[];
  webhook: string;
}) {
  try {
    const response = await fetch(webhook || process.env.DISCORD_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: embeddedMsgs,
      }),
    });
    if (!response.ok) {
      throw new Error("failed to send message");
    }
  } catch (error) {
    console.log(error);
  }
}
