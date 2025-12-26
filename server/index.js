import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/ping", (req, res) => {
  res.json({ ok: true });
});

// Mock /api/simplify route
app.get("/api/simplify", (req, res) => {
  const term = req.query.term || "No term provided";
  const lang = (req.query.lang || "spanish").toLowerCase(); // force lowercase

  // Simple mock simplification
  const simplified = term
    .replace(/hypertension/gi, "high blood pressure")
    .replace(/diabetes/gi, "high sugar levels")
    .replace(/myocardial infarction/gi, "heart attack");

  // Mock translations
  const translations = {
    spanish: "traducción simulada al español",
    french: "traduction simulée en français",
    hindi: "हिंदी में अनुकरण अनुवाद",
    chinese: "中文模拟翻译",
    arabic: "ترجمة تجريبية للعربية",
    german: "simulierte Übersetzung auf Deutsch",
    portuguese: "tradução simulada em português",
    japanese: "日本語の模擬翻訳",
    italian: "traduzione simulata in italiano",
  };

  res.json({
    english: simplified,
    translated: translations[lang] || "simulated translation",
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
