import { SearchResult } from "@/types/search";

interface ResultCardProps {
    result: SearchResult;
}

export default function ResultCard({ result }: ResultCardProps) {
    return (
        <div className="w-full p-5 rounded-xl bg-gray-800 border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-gray-500">#{result.position}</span>
                <span className="text-xs text-green-400 truncate">{result.url}</span>
            </div>
            <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 font-semibold text-lg hover:underline line-clamp-1"
            >
                {result.title}
            </a>
            <p className="mt-1 text-gray-400 text-sm line-clamp-2">{result.snippet}</p>
        </div>
    );
}