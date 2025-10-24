import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

export async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Lên kế hoạch bữa ăn cho tuần tới với các món ăn Việt Nam miền Bắc, Trung, Nam và món người Hoa. Khẩu vị miền Bắc. Đảm bảo các món ăn đa dạng và cân bằng dinh dưỡng. Bao gồm bữa trưa và bữa tối cho mỗi ngày trong tuần. Trong tuần có 2 bữa là cháo, mì, bún, miến, phở hoặc bánh mặn; các bữa còn lại là cơm trắng kèm các món canh, mặn và xào. Trình bày thành thành từng đoạn văn dễ đọc, mỗi ngày một đoạn, mỗi bữa một gạch đầu dòng. Có lời chào đầu tuần và giới thiệu ngắn. Không giải thích. Không nhắc lại khẩu vị và cách nêm nếm. Không dùng Markdown.",
  });

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatIdRaw = process.env.CHAT_ID;

  let chatId;
  if (chatIdRaw !== undefined) {
    const parsed = Number.parseInt(chatIdRaw, 10);
    if (Number.isNaN(parsed)) {
      console.warn("Invalid CHAT_ID; expected integer:", chatIdRaw);
    } else {
      chatId = parsed;
    }
  }

  if (!botToken || !chatId) {
    console.warn("TELEGRAM_BOT_TOKEN or CHAT_ID not set; skipping Telegram send");
  } else {
    const sendChunks = async (text) => {
      const MAX_LEN = 4096;
      for (let i = 0; i < text.length; i += MAX_LEN) {
        const chunk = text.slice(i, i + MAX_LEN);
        const res = await fetch(`https://api.telegram.org/bot${encodeURIComponent(botToken)}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: chunk }),
        });

        if (!res.ok) {
          const errBody = await res.text().catch(() => "");
          console.error("Failed to send Telegram message:", res.status, errBody);
          break;
        }
      }
    };

    try {
      await sendChunks(response.text);
    } catch (err) {
      console.error("Error sending Telegram message:", err);
    }
  }

  return {
    body: response.text,
    statusCode: 200
  }
}
