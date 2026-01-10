import { useState, useEffect } from "react";
import LanguageSelect from "../components/LanguageSelect";

export default function Simplify() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("spanish");
  const [translatedText, setTranslatedText] = useState({ english: "", translated: "" });
  const [loading, setLoading] = useState(false);
  const [pubmedArticles, setPubmedArticles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/ping")
      .then((res) => res.json())
      .then((data) => console.log("Backend says:", data))
      .catch((err) => console.error("Ping failed:", err));
  }, []);

  async function handleTranslate() {
    if (!input) return;
    setLoading(true);

    try {
      // 1. Simplify and translate
      const response = await fetch(
        `http://localhost:5000/api/simplify?term=${encodeURIComponent(input)}&lang=${language.toLowerCase()}`
      );

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setTranslatedText({
        english: data.english || "",
        translated: data.translated || ""
      });

      // 2. Fetch PubMed articles
      try {
        const pubResp = await fetch(
          `http://localhost:5000/api/pubmed?term=${encodeURIComponent(input)}`
        );
        const pubData = await pubResp.json();
        const filtered = pubData.filter(a => a.title && a.title.length > 5);

        // add link to PubMed and mini summary if available
        const articlesWithLinks = filtered.map(a => ({
          ...a,
          link: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(input)}`,
          summary: a.summary || "" // placeholder if backend adds abstract later
        }));

        setPubmedArticles(articlesWithLinks);
      } catch (err) {
        console.error("PubMed fetch failed:", err);
        setPubmedArticles([]);
      }

    } catch (err) {
      console.error("Simplify fetch failed:", err);
      setTranslatedText({ english: "Error fetching data", translated: "" });
      setPubmedArticles([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen bg-gray-800 text-white overflow-hidden">
      
      {/* LEFT PANEL - Independently Scrollable */}
      <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide">
        <div className="p-10 pt-24 w-full max-w-4xl mx-auto"> 
          <h1 className="text-4xl font-bold mb-6">Simplify medical terms</h1>

          <textarea
            className="w-full h-32 p-3 rounded-lg bg-gray-700 focus:outline-none mb-4 resize-none border border-gray-700"
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
                "spanish", "french", "hindi", "chinese", "arabic",
                "german", "portuguese", "japanese", "italian",
              ]}
            />
          </div>

          <button
            className="bg-sky-800 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            onClick={handleTranslate}
            disabled={loading}
          >
            {loading ? "Simplifying and translating..." : "Simplify"}
          </button>

          {/* RESULTS AREA */}
          {translatedText.english && (
            <div className="mt-8 p-6 bg-gray-700 rounded-lg border border-gray-600 shadow-xl">
              <div className="mb-4">
                <h3 className="text-lg text-gray-400 font-bold mb-1">English</h3>
                <p className="text-lg text-gray-100 leading-relaxed">{translatedText.english}</p>
              </div>
              <hr className="border-gray-600 my-4" />
              <div>
                <h3 className="text-lg text-gray-400 font-bold mb-1">
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </h3>
                <p className="text-lg text-gray-100 leading-relaxed">{translatedText.translated}</p>
              </div>
            </div>
          )}
          
          <div className="h-20" />
        </div>
      </div>

      {/* RIGHT PANEL - Independently Scrollable */}
      <div className="w-[30%] p-8 pt-24 bg-gray-900 border-l border-gray-900 overflow-y-auto scrollbar-hide">
        <h2 className="text-xl font-semibold mb-4">Relevant medical research</h2>
        {pubmedArticles.length > 0 ? (
          pubmedArticles.map((a, i) => (
            <div key={i} className="bg-gray-800 h-32 rounded-lg mb-6 p-4 overflow-hidden">
              <a href={a.link} target="_blank" className="text-white font-semibold hover:underline">
                {a.title}
              </a>
              {a.summary && (
                <p className="text-gray-300 text-sm mt-2">{a.summary}</p>
              )}
            </div>
          ))
        ) : (
          <>
            <div className="bg-gray-800 h-32 rounded-lg mb-6"></div>
            <div className="bg-gray-800 h-32 rounded-lg mb-6"></div>
            <div className="bg-gray-800 h-32 rounded-lg mb-10"></div>
          </>
        )}

        <h2 className="text-xl font-semibold mb-4">Tutorial videos</h2>
        <div className="bg-gray-800 h-24 rounded-lg mb-6"></div>
        <div className="bg-gray-800 h-24 rounded-lg mb-10"></div>

        <p className="text-gray-400 text-sm">Languages supported: 🇺🇸 🇪🇸 🇫🇷 🇨🇳 🇮🇳</p>
      </div>
    </div>
  );
}
