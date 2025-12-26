import { useState } from "react";
import LanguageSelect from "../components/LanguageSelect"; // adjust path if needed

export default function Simplify() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("spanish"); // default

  const[translatedText, setTranslatedText] = useState({english: "", translated: ""});
  const[loading, setLoading] = useState(false);

  async function handleTranslate() {
    setLoading(true);
    // TODO: Call Gemini API here and update translatedText state
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
            options={["spanish", "french", "hindi", "chinese", "arabic", "german", "portuguese", "japanese", "italian"]}
          />
        </div>

        <button
          className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold"
          onClick={handleTranslate}
        >
          {loading ? "Simplifying and translating..." : "Simplify"}
        </button>
      </div>

      {/* TODO: fix this ui */}
      {translatedText.english && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <h3 className="font-semibold">English:</h3>
          <p>{translatedText.english}</p>

          <h3 className="font-semibold mt-2">{language}:</h3>
          <p>{translatedText.translated}</p>
        </div>
    )}

      {/* RIGHT PANEL */}
      <div className="w-[30%] p-8 pt-24 bg-gray-700 overflow-y-auto scrollbar-hide">
        {/* pt-24 pushes content below the navbar */}
        <h2 className="text-xl font-semibold mb-4">Relevant medical research</h2>
        <div className="bg-gray-600 h-32 rounded-lg mb-6"></div>
        <div className="bg-gray-600 h-32 rounded-lg mb-6"></div>
        <div className="bg-gray-600 h-32 rounded-lg mb-10"></div>

        <h2 className="text-xl font-semibold mb-4">Tutorial videos</h2>
        <div className="bg-gray-600 h-24 rounded-lg mb-6"></div>
        <div className="bg-gray-600 h-24 rounded-lg mb-10"></div>

        <p className="text-gray-400 text-sm">
          Languages supported: 🇺🇸 🇪🇸 🇫🇷 🇨🇳 🇮🇳
        </p>
      </div>
    </div>
  );
}
