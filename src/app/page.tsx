"use client";

import { useState } from "react";
import SearchInput from "@/components/SearchInput";
import ResultsList from "@/components/ResultList";
import { SearchResponse } from "@/types/search";

export default function Home() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Nastala chyba pri vyhľadávaní.");
        return;
      }

      setResults(data);
    } catch {
      setError("Nepodarilo sa spojiť so serverom.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 py-20">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Google Search Scraper
        </h1>
        <p className="text-gray-400 text-lg">
          Zadaj kľúčové slovné spojenie a stiahni výsledky
        </p>
      </div>

      <SearchInput onSearch={handleSearch} isLoading={isLoading} />

      {results?.location && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          Detekovaná poloha: <span className="text-white font-medium">{results.location}</span>
        </div>
      )}

      {error && (
        <p className="mt-6 text-red-400 text-sm">{error}</p>
      )}

      {results && <ResultsList data={results} />}
    </main>
  );
}