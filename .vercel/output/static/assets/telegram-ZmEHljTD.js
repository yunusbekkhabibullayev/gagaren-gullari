var e=`admin_telegram_chat_id`;function t(){return`8898489484:AAFiGx5CYAG7xTobcUMBMr1pVkSIkIUeFJs`}function n(){try{if(typeof window<`u`){let t=localStorage.getItem(e);if(t&&t.trim())return t.trim()}}catch{}return`1165441564`}function r(t){typeof window>`u`||localStorage.setItem(e,t.trim())}async function i(){let e=t();if(!e)return console.warn(`Telegram bot token is missing.`),null;try{let t=await(await fetch(`https://api.telegram.org/bot${e}/getUpdates`)).json();if(t.ok&&Array.isArray(t.result)&&t.result.length>0){let e=t.result[t.result.length-1],n=e?.message?.chat?.id||e?.channel_post?.chat?.id;if(n){let e=String(n);return r(e),e}}}catch(e){console.warn(`Failed to auto detect Telegram Chat ID:`,e)}return null}async function a(e){try{let r=t();if(!r)return console.warn(`Telegram notification skipped: Bot token not provided.`),!1;let a=n();if(a||=await i(),!a)return console.warn(`Telegram bot notification skipped: Chat ID not set yet.`),!1;let o=e.items.map(e=>{let t=e.color?` (${e.color})`:``,n=(e.price*e.qty).toLocaleString(`uz-UZ`);return`• <b>${e.name}</b>${t} x ${e.qty} — ${n} so'm`}).join(`
`),s=e.paymentMethod===`cash`?`💵 Naqd pul (qabul qilganda)`:e.paymentMethod===`card`?`💳 Karta orqali`:`🏦 O'tkazma`,c=e.total.toLocaleString(`uz-UZ`),l=`
🌸 <b>YANGI BUYURTMA #${e.orderId}</b>

👤 <b>Mijoz:</b> ${e.customerName}
📞 <b>Tel:</b> <code>${e.customerPhone}</code>
📍 <b>Shahar/Tuman:</b> ${e.customerCity}
🏠 <b>Manzil:</b> ${e.customerAddress}
💳 <b>To'lov turi:</b> ${s}
${e.note?`📝 <b>Izoh:</b> <i>"${e.note}"</i>\n`:``}
💐 <b>Buyurtma qilingan gullar:</b>
${o}

💰 <b>Jami summa:</b> <b>${c} so'm</b>
⏱ <b>Vaqt:</b> ${new Date().toLocaleTimeString(`uz-UZ`)}
`.trim();return(await(await fetch(`https://api.telegram.org/bot${r}/sendMessage`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({chat_id:a,text:l,parse_mode:`HTML`})})).json()).ok}catch(e){return console.error(`Failed to send Telegram order notification:`,e),!1}}export{a as i,n,r,i as t};