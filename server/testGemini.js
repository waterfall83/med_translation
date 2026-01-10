import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function simplifyAndTranslate(medicalTerm) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `
        You are a medical interpreter. 
        Step 1: Convert the input medical term into a simple, 2-4 word English phrase a young adult would understand.
        Step 2: Translate that SIMPLE English phrase into Spanish.
        
        Format your output exactly like this:
        Simple English: [simplified term]
        Spanish Translation: [translation of the simplified term]

        Examples of what the english output should look like:
        Input: "hypertension"
        Output: 
        Simple English: high blood pressure
        Spanish Translation: presión arterial alta

        Input: "tachycardia"
        Output:
        Simple English: fast heart beat
        Spanish Translation: latido del corazón rápido

        Input: "myocardial infarction"
        Output:
        Simple English: heart attack
        Spanish Translation: ataque al corazón
      `
    });

    const result = await model.generateContent(medicalTerm);
    console.log(`--- Result for: ${medicalTerm} ---`);
    console.log(result.response.text());
    
  } catch (err) {
    console.error("Error:", err.message);
  }
}

// example usage
simplifyAndTranslate("hypertension"); 
// expected: simple english: high blood pressure | spanish: presión arterial alta

simplifyAndTranslate("tachycardia"); 
// expected: simple english: fast heart beat | spanish: latido del corazón rápido

simplifyAndTranslate("myocardial infarction");