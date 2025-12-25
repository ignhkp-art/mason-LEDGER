module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    experience,
    portfolio,
    tradingPlatform,
    contactPlatform,
    contactHandle,
    otherPlatform,
    timestamp
  } = req.body || {};

  // Basic validation / sanitation
  if (
    !experience || typeof experience !== 'string' ||
    !portfolio || typeof portfolio !== 'string' ||
    !tradingPlatform || typeof tradingPlatform !== 'string' ||
    !contactPlatform || typeof contactPlatform !== 'string' ||
    !contactHandle || typeof contactHandle !== 'string' ||
    !timestamp || typeof timestamp !== 'string'
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Format time nicely for Telegram
  const submittedAt = new Date(timestamp).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const message =
`📩 New Mason Ledger Application

🕒 Submitted: ${submittedAt}

🧠 Experience: ${experience}
💼 Portfolio: ${portfolio}
📊 Trading Platform: ${tradingPlatform}
📞 Contact Platform: ${contactPlatform}
👤 Contact Handle: ${contactHandle}
${otherPlatform ? `🔧 Other Platform: ${otherPlatform}` : ''}
`;

  const telegramURL =
    `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`;

  try {
    const tgRes = await fetch(telegramURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TG_CHAT_ID,
        text: message
      })
    });

    if (!tgRes.ok) {
      const errorText = await tgRes.text();
      console.error('Telegram API error:', errorText);
      throw new Error('Telegram API failed');
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send Telegram message' });
  }
};
