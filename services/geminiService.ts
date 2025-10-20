
import { GoogleGenAI } from "@google/genai";

export const generateDescription = async (productName: string, category: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API key for Gemini is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `ช่วยเขียนคำอธิบายสินค้าที่น่าสนใจและดึงดูดลูกค้าสำหรับ "${productName}" ซึ่งอยู่ในหมวดหมู่ "${category}" ความยาวไม่เกิน 2-3 ประโยค สั้นๆ กระชับ และใช้ภาษาที่เป็นกันเอง`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating description:", error);
    return "เกิดข้อผิดพลาดในการสร้างคำอธิบายด้วย AI";
  }
};
