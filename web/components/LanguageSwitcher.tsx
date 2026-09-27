"use client";
import { useState } from "react";

export default function LanguageSwitcher() {
  const [lang, setLang] = useState(() =>
    typeof window !== "undefined" ? (localStorage.getItem("lang") ?? "en") : "en"
  );
  function change(v: string) {
    setLang(v);
    localStorage.setItem("lang", v);
    document.documentElement.lang = v;
    document.documentElement.dir = v === "ar" ? "rtl" : "ltr";
  }
  return (
    <select aria-label="Language" className="rounded border p-1 text-sm" value={lang} onChange={(e) => change(e.target.value)}>
      <option value="en">EN</option><option value="fr">FR</option><option value="sw">SW</option><option value="ar">AR</option>
    </select>
  );
}
