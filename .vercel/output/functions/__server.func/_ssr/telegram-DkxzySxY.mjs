//#region node_modules/.nitro/vite/services/ssr/assets/telegram-DkxzySxY.js
var CHAT_ID_STORAGE_KEY = "admin_telegram_chat_id";
function getBotToken() {
	return "8898489484:AAFiGx5CYAG7xTobcUMBMr1pVkSIkIUeFJs";
}
function getSavedTelegramChatId() {
	try {
		if (typeof window !== "undefined") {
			const fromStorage = localStorage.getItem(CHAT_ID_STORAGE_KEY);
			if (fromStorage && fromStorage.trim()) return fromStorage.trim();
		}
	} catch (e) {}
	return "1165441564";
}
function saveTelegramChatId(chatId) {
	if (typeof window === "undefined") return;
	localStorage.setItem(CHAT_ID_STORAGE_KEY, chatId.trim());
}
/**
* Tries to auto-detect chat_id from recent bot messages (/start)
*/
async function autoDetectTelegramChatId() {
	const token = getBotToken();
	if (!token) {
		console.warn("Telegram bot token is missing.");
		return null;
	}
	try {
		const json = await (await fetch(`https://api.telegram.org/bot${token}/getUpdates`)).json();
		if (json.ok && Array.isArray(json.result) && json.result.length > 0) {
			const lastUpdate = json.result[json.result.length - 1];
			const chatId = lastUpdate?.message?.chat?.id || lastUpdate?.channel_post?.chat?.id;
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
async function sendTelegramOrderNotification(payload) {
	try {
		const token = getBotToken();
		if (!token) {
			console.warn("Telegram notification skipped: Bot token not provided.");
			return false;
		}
		let chatId = getSavedTelegramChatId();
		if (!chatId) chatId = await autoDetectTelegramChatId();
		if (!chatId) {
			console.warn("Telegram bot notification skipped: Chat ID not set yet.");
			return false;
		}
		const itemsList = payload.items.map((item) => {
			const colorStr = item.color ? ` (${item.color})` : "";
			const itemTotal = (item.price * item.qty).toLocaleString("uz-UZ");
			return `• <b>${item.name}</b>${colorStr} x ${item.qty} — ${itemTotal} so'm`;
		}).join("\n");
		const paymentText = payload.paymentMethod === "cash" ? "💵 Naqd pul (qabul qilganda)" : payload.paymentMethod === "card" ? "💳 Karta orqali" : "🏦 O'tkazma";
		const formattedTotal = payload.total.toLocaleString("uz-UZ");
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
⏱ <b>Vaqt:</b> ${(/* @__PURE__ */ new Date()).toLocaleTimeString("uz-UZ")}
`.trim();
		return (await (await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chat_id: chatId,
				text: message,
				parse_mode: "HTML"
			})
		})).json()).ok;
	} catch (err) {
		console.error("Failed to send Telegram order notification:", err);
		return false;
	}
}
//#endregion
export { sendTelegramOrderNotification as i, getSavedTelegramChatId as n, saveTelegramChatId as r, autoDetectTelegramChatId as t };
