// Telegram Bot Integration Service

const CHAT_ID_STORAGE_KEY = "admin_telegram_chat_id";

// Helper: Dynamically fetch latest bot token
function getBotToken(): string {
  return (import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string) || "";
}

export function getSavedTelegramChatId(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(CHAT_ID_STORAGE_KEY) ||
    (import.meta.env?.VITE_TELEGRAM_CHAT_ID as string) ||
    null
  );
}

export function saveTelegramChatId(chatId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAT_ID_STORAGE_KEY, chatId.trim());
}

/**
 * Tries to auto-detect chat_id from recent bot messages (/start)
 */
export async function autoDetectTelegramChatId(): Promise<string | null> {
  const token = getBotToken();
  if (!token) {
    console.warn("Telegram bot token is missing.");
    return null;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const json = await res.json();
    if (json.ok && Array.isArray(json.result) && json.result.length > 0) {
      // Find latest message chat ID
      const lastUpdate = json.result[json.result.length - 1];
      const chatId =
        lastUpdate?.message?.chat?.id || lastUpdate?.channel_post?.chat?.id;
      if (chatId) {
        const idStr = String(chatId);
        saveTelegramChatId(idStr);
        return idStr;
      }
    }
  } catch (err) {
    console.warn("Failed to auto detect Telegram Chat ID:", err);
  }
  return null;
}

export type OrderNotificationPayload = {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  paymentMethod: string;
  note?: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: Array<{
    name: string;
    color?: string;
    qty: number;
    price: number;
  }>;
};

export async function sendTelegramOrderNotification(
  payload: OrderNotificationPayload
) {
  try {
    const token = getBotToken();
    if (!token) {
      console.warn("Telegram notification skipped: Bot token not provided.");
      return false;
    }

    // 1. Get or auto-detect chat_id
    let chatId = getSavedTelegramChatId();
    if (!chatId) {
      chatId = await autoDetectTelegramChatId();
    }

    if (!chatId) {
      console.warn("Telegram bot notification skipped: Chat ID not set yet.");
      return false;
    }

    // 2. Format items list
    const itemsList = payload.items
      .map((item) => {
        const colorStr = item.color ? ` (${item.color})` : "";
        const itemTotal = (item.price * item.qty).toLocaleString("uz-UZ");
        return `• <b>${item.name}</b>${colorStr} x ${item.qty} — ${itemTotal} so'm`;
      })
      .join("\n");

    const paymentText =
      payload.paymentMethod === "cash"
        ? "💵 Naqd pul (qabul qilganda)"
        : payload.paymentMethod === "card"
          ? "💳 Karta orqali"
          : "🏦 O'tkazma";

    const formattedTotal = payload.total.toLocaleString("uz-UZ");

    // 3. Construct Telegram Message
    const message = `
🌸 <b>YANGI BUYURTMA #${payload.orderId}</b>

👤 <b>Mijoz:</b> ${payload.customerName}
📞 <b>Tel:</b> <code>${payload.customerPhone}</code>
📍 <b>Shahar/Tuman:</b> ${payload.customerCity}
🏠 <b>Manzil:</b> ${payload.customerAddress}
💳 <b>To'lov turi:</b> ${paymentText}
${payload.note ? `📝 <b>Izoh:</b> <i>"${payload.note}"</i>\n` : ""}
💐 <b>Buyurtma qilingan gullar:</b>
${itemsList}

💰 <b>Jami summa:</b> <b>${formattedTotal} so'm</b>
⏱ <b>Vaqt:</b> ${new Date().toLocaleTimeString("uz-UZ")}
`.trim();

    // 4. Send API HTTP POST to Telegram Bot
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await res.json();
    return data.ok;
  } catch (err) {
    console.error("Failed to send Telegram order notification:", err);
    return false;
  }
}