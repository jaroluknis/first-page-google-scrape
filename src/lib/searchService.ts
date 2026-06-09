import { getJson } from "serpapi";
import { SearchResult, SearchResponse } from "@/types/search";

/**
 * Fetches the first page of Google organic search results via SerpAPI.
 *
 * Results are always filtered to organic_results only — ads and other
 * SERP features are intentionally excluded.
 *
 * @param query    - Search keyword or phrase entered by the user
 * @param location - Optional location string (e.g. "Bratislava, Slovakia").
 *                   When omitted, SerpAPI uses a default global context.
 * @returns Structured search response with up to 10 results
 *
 * @example
 * const data = await searchGoogle("Next.js tutorial", "Prague, Czech Republic");
 * console.log(data.results[0].title);
 */
export async function searchGoogle(query: string, location?: string): Promise<SearchResponse> {
    const params: Record<string, string | number | undefined> = {
        engine: "google",
        q: query,
        num: 10,
        hl: "cs",  // interface language
        gl: "cz",  // country for results
        api_key: process.env.SERPAPI_KEY ?? "",
    };

    if (location) {
        params.location = location;
    }

    const response = await getJson(params);
    const organicResults = response.organic_results ?? [];

    const results: SearchResult[] = organicResults.map(
        (item: any, index: number) => ({
            title: item.title ?? "",
            url: item.link ?? "",
            snippet: item.snippet ?? "",
            position: index + 1,
        })
    );

    return {
        results,
        query,
        totalResults: results.length,
    };
}
