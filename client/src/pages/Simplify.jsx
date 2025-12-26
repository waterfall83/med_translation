import { useState, useEffect } from "react";
import LanguageSelect from "../components/LanguageSelect";

export default function Simplify() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("spanish");
  const [translatedText, setTranslatedText] = useState({ english: "", translated: "" });
  const [loading, setLoading] = useState(false);

  // Test backend connection on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/ping")
      .then((res) => res.json())
      .then((data) => console.log("Backend says:", data))
      .catch((err) => console.error("Ping failed:", err));
  }, []);

  // Fetch simplified + translated text
  async function handleTranslate() {
    if (!input) return; // ignore empty input
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/simplify?term=${encodeURIComponent(input)}&lang=${language.toLowerCase()}`
      );
      const data = await response.json();
      setTranslatedText(data);
    } catch (err) {
      console.error("Simplify fetch failed:", err);
      setTranslatedText({ english: "Error fetching data", translated: "" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen bg-gray-800 text-white overflow-hidden">
      {/* LEFT PANEL */}
      <div className="flex-1 p-10 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-6">Simplify medical terms</h1>

        <textarea
          className="w-full h-32 p-3 rounded-lg bg-gray-700 focus:outline-none mb-4 resize-none"
          placeholder="Enter a medical term or diagnosis..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex items-center gap-4 mb-6">
          <label className="text-gray-300">Select secondary language:</label>

          <LanguageSelect
            value={language}
            onChange={setLanguage}
            options={[
              "spanish",
              "french",
              "hindi",
              "chinese",
              "arabic",
              "german",
              "portuguese",
              "japanese",
              "italian",
            ]}
          />
        </div>

        <button
          className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold"
          onClick={handleTranslate}
        >
          {loading ? "Simplifying and translating..." : "Simplify"}
        </button>

        {/* SIMPLE TEXT RESULT BELOW BUTTON */}
        {translatedText.english && (
          <div className="mt-4">
            <p><strong>English:</strong> {translatedText.english}</p>
            <p><strong>{language.charAt(0).toUpperCase() + language.slice(1)}:</strong> {translatedText.translated}</p>
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[30%] p-8 pt-24 bg-gray-700 overflow-y-auto scrollbar-hide">
        <h2 className="text-xl font-semibold mb-4">Relevant medical research</h2>
        <div className="bg-gray-600 h-32 rounded-lg mb-6"></div>
        <div className="bg-gray-600 h-32 rounded-lg mb-6"></div>
        <div className="bg-gray-600 h-32 rounded-lg mb-10"></div>

        <h2 className="text-xl font-semibold mb-4">Tutorial videos</h2>
        <div className="bg-gray-600 h-24 rounded-lg mb-6"></div>
        <div className="bg-gray-600 h-24 rounded-lg mb-10"></div>

        <p className="text-gray-400 text-sm">Languages supported: 🇺🇸 🇪🇸 🇫🇷 🇨🇳 🇮🇳</p>
      </div>
    </div>
  );
}
