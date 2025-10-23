import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Lên kế hoạch bữa ăn cho tuần tới với các món ăn Việt Nam khẩu vị miền Bắc. Trong tuần có ít nhất một bữa là cháo, bún, miến, phở hoặc các món bánh. Bao gồm bữa sáng, bữa trưa và bữa tối cho mỗi ngày trong tuần. Đảm bảo các món ăn đa dạng và cân bằng dinh dưỡng. Trình bày kế hoạch dưới dạng bảng với các cột cho ngày trong tuần, bữa sáng, bữa trưa và bữa tối.",
  });
  return {
    body: response.text,
    statusCode: 200
  }
}
