import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Simplify from "./pages/Simplify";
import Interact from "./pages/Interact";

function Navbar({ isHome }) {
  // When on home, keep navbar relative (normal flow)
  // On other pages, keep it fixed at the top
  const base = "w-full flex justify-between items-center px-8 py-4 bg-gray-900 z-10";
  const pos = isHome ? "relative" : "fixed top-0 left-0";
  return (
    <nav className={`${base} ${pos}`}>
      <h1 className="text-2xl font-semibold text-white">med_app</h1>
      <div className="space-x-6">
        <Link to="/" className="text-white hover:text-gray-300">
          Home
        </Link>
        <Link to="/simplify" className="text-white hover:text-gray-300">
          Simplify
        </Link>
        <Link to="/interact" className="text-white hover:text-gray-300">
          Interact
        </Link>
        <Link to="/about" className="text-white hover:text-gray-300">
          About
        </Link>
      </div>
    </nav>
  );
}

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <Navbar isHome={isHome} />

      <div
        className={
          isHome
            ? "min-h-[100dvh] bg-neutral-900" // homepage controls its own dark background
            : "min-h-screen" // no background here—each page handles it
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simplify" element={<Simplify />} />
          <Route path="/interact" element={<Interact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
