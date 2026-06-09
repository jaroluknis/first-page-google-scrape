import { NextRequest, NextResponse } from "next/server";
import { searchGoogle } from "@/lib/searchService";
import { getLocationFromIP } from "@/lib/geoService";

/**
 * GET /api/search?q=<query>
 *
 * Returns the first page of Google organic search results for the given query.
 * When the USE_GEOLOCATION env variable is set to "true", the caller's IP
 * address is resolved to a city/country and passed to SerpAPI so results are
 * geographically relevant.
 *
 * @param request - Incoming Next.js request; must include query param `q`
 * @returns 200 SearchResponse JSON | 400 if `q` is missing | 500 on error
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
        return NextResponse.json(
            { error: "Parameter 'q' is required" },
            { status: 400 }
        );
    }

    try {
        let location: string | undefined = undefined;

        const useGeo = process.env.USE_GEOLOCATION === "true";

        if (useGeo) {
            // x-forwarded-for may contain a comma-separated list of IPs when
            // the request passes through multiple proxies — we only need the first
            const ip =
                request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
                request.headers.get("x-real-ip") ??
                "8.8.8.8";

            location = await getLocationFromIP(ip);
        }

        const data = await searchGoogle(query.trim(), location);

        return NextResponse.json({
            ...data,
            location: location ?? null,
        });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { error: "Failed to fetch search results" },
            { status: 500 }
        );
    }
}
