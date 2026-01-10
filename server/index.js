import 'dotenv/config';
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/api/ping", (req, res) => {
  res.json({ ok: true });
});

// main simplify route
app.get("/api/simplify", async (req, res) => {
  const term = req.query.term;
  const lang = req.query.lang || "spanish";

  try {
    const result = await simplifyAndTranslate(term, lang);
    res.json(result);
  } catch (err) {
    console.error("❌ Error in /api/simplify:", err.message);
    res.json({
      english: "Could not simplify at this time.",
      translated: ""
    });
  }
});

// gemini simplify & translate function
async function simplifyAndTranslate(medicalTerm, lang) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `
        You are a medical interpreter. 
        Step 1: Convert the input medical term into a simple, 2-4 word English phrase a young adult would understand.
        Step 2: Translate that SIMPLE English phrase into ${lang}.
        
        Format your output exactly like this:
        Simple English: [simplified term]
        ${lang.charAt(0).toUpperCase() + lang.slice(1)} Translation: [translation of the simplified term]

        Examples:
        Input: "hypertension"
        Output: 
        Simple English: high blood pressure
        ${lang.charAt(0).toUpperCase() + lang.slice(1)} Translation: presión arterial alta

        Input: "tachycardia"
        Output:
        Simple English: fast heart beat
        ${lang.charAt(0).toUpperCase() + lang.slice(1)} Translation: latido del corazón rápido

        Input: "myocardial infarction"
        Output:
        Simple English: heart attack
        ${lang.charAt(0).toUpperCase() + lang.slice(1)} Translation: ataque al corazón

        Input: "diaphoretic"
        Output:
        Simple English: excessive sweating
        ${lang.charAt(0).toUpperCase() + lang.slice(1)} Translation: sudoración excesiva
      `
    });

    const result = await model.generateContent(medicalTerm);
    const text = result.response.text();

    const englishMatch = text.match(/Simple English:\s*(.+)/i);
    const translatedMatch = text.match(
      new RegExp(`${lang.charAt(0).toUpperCase() + lang.slice(1)} Translation:\\s*(.+)`, "i")
    );

    return {
      english: englishMatch ? englishMatch[1].trim() : "",
      translated: translatedMatch ? translatedMatch[1].trim() : ""
    };

  } catch (err) {
    console.error("❌ Error in simplifyAndTranslate:", err.message);
    return { english: "Could not simplify at this time.", translated: "" };
  }
}

// pubmed route
app.get("/api/pubmed", async (req, res) => {
  const term = req.query.term;
  if (!term) return res.json([]);

  try {
    // combine synonyms and restrict to title/abstract
    const query = `("${term}"[tiab] OR "high blood pressure"[tiab])`;

    // search pubmed IDs
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=10&retmode=json&sort=relevance`;
    const searchResp = await fetch(searchUrl);
    const searchData = await searchResp.json();
    const ids = searchData.esearchresult.idlist.join(",");
    if (!ids) return res.json([]);

    // fetch article details (title + abstract)
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids}&retmode=xml`;
    const fetchResp = await fetch(fetchUrl);
    const xml = await fetchResp.text();

    // extract titles and abstracts
    const articles = [...xml.matchAll(/<ArticleTitle>(.*?)<\/ArticleTitle>[\s\S]*?<AbstractText.*?>([\s\S]*?)<\/AbstractText>/g)]
      .map(m => ({
        title: m[1].trim(),
        abstract: m[2].replace(/\s+/g, ' ').trim()
      }));

    // filter for relevance using gemini
    const relevantArticles = [];
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `
        You are a medical research assistant.
        For each article abstract provided, answer:
        "Is this article about [high blood pressure / hypertension]? 
        If yes, give a 1-2 sentence summary. If no, skip."
        Return results as JSON array of objects:
        [{"title": "...", "summary": "..."}, ...]
      `
    });

    const abstractsText = articles.map(a => `${a.title}\n${a.abstract}`).join("\n\n");
    const result = await model.generateContent(abstractsText);
    const text = result.response.text();

    // try parsing JSON from LLM output
    let parsed = [];
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.warn("Could not parse PubMed relevance JSON, returning raw titles.");
      parsed = articles.map(a => ({ title: a.title, summary: "" }));
    }

    res.json(parsed);

  } catch (err) {
    console.error("PubMed fetch failed:", err);
    res.json([]);
  }
});

// start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
