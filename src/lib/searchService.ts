import { getJson } from "serpapi";
import { SearchResult, SearchResponse } from "@/types/search";

export async function searchGoogle(query: string, location?: string): Promise<SearchResponse> {
    const params: Record<string, string | number | undefined> = {
        engine: "google",
        q: query,
        num: 10,
        hl: "cs",
        gl: "cz",
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