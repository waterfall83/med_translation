
import { useEffect, useState } from "react";

const subheadings = [
  "simplify medical diagnoses",
  "translate medical language",
  "access relevant medical articles",
  "AI-powered assistance"
];

export default function Home() {
  const [currentText, setCurrentText] = useState(""); // shown on screen rn
  const [index, setIndex] = useState(0); // index indicating which subheading
  const [subIndex, setSubIndex] = useState(0); // subindex indicating how many letters displayed
  const [deleting, setDeleting] = useState(false); // whether you are typing (true) or backspacing (false)

  // typewriter effect
  useEffect(() => {
  const speed = deleting ? 50 : 150;
  const pauseDelay = 1000; // 1 second pause after fully typed

  let timeout;

  if (!deleting && subIndex === subheadings[index].length) {
    // finished typing, wait before deleting
    timeout = setTimeout(() => setDeleting(true), pauseDelay);
  } else if (deleting && subIndex === 0) {
    // finished deleting, move to next word
    setDeleting(false);
    setIndex((prev) => (prev + 1) % subheadings.length);
  } else {
    // continue typing or deleting
    timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
      setCurrentText(subheadings[index].substring(0, subIndex + (deleting ? -1 : 1)));
    }, speed);
  }

  return () => clearTimeout(timeout);
}, [subIndex, index, deleting]);


  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-900 text-center overflow-hidden px-4">
      <h1
        className="text-white text-6xl font-extrabold mb-4"
        style={{ fontFamily: "'Lucida Console', 'Courier New', monospace" }}
      >
        med_app
      </h1>

      {/* subheading w/ typewriter effect */}
      <h2
        className="text-gray-400 text-2xl h-8 mb-8"
        style={{ fontFamily: "'Lucida Console', 'Courier New', monospace" }}
      >
        {currentText}
        <span className="border-r-2 border-gray-400 animate-pulse ml-1"></span>
      </h2>

      {/* start button */}
      <button className="bg-gray-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-600 transition">
        Get Started
      </button>
    </div>
  )
}