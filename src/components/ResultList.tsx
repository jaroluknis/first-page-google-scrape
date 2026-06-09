"use client";

import { SearchResponse } from "@/types/search";
import ResultCard from "./ResultCard";

interface ResultsListProps {
    data: SearchResponse;
}

function downloadJSON(data: SearchResponse) {
    const blob = new Blob([JSON.stringify(data.results, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `search-${data.query}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function downloadCSV(data: SearchResponse) {
    const header = "position,title,url,snippet";
    const rows = data.results.map(
        (r) =>
            `${r.position},"${r.title.replace(/"/g, '""')}","${r.url}","${r.snippet.replace(/"/g, '""')}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `search-${data.query}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function ResultsList({ data }: ResultsListProps) {
    if (data.results.length === 0) {
        return (
            <p className="text-gray-400 mt-8">Pre tento dotaz sa nič nenašlo.</p>
        );
    }

    return (
        <div className="w-full max-w-2xl mt-8">
            <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 text-sm">
                    Nájdených <span className="text-white font-semibold">{data.totalResults}</span> výsledkov pre „{data.query}“
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => downloadJSON(data)}
                        className="px-4 py-2 text-sm rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                    >
                        Stiahnuť JSON
                    </button>
                    <button
                        onClick={() => downloadCSV(data)}
                        className="px-4 py-2 text-sm rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                    >
                        Stiahnuť CSV
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                {data.results.map((result) => (
                    <ResultCard key={result.position} result={result} />
                ))}
            </div>
        </div>
    );
}