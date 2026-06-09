import { NextRequest, NextResponse } from "next/server";
import { searchGoogle } from "@/lib/searchService";
import { getLocationFromIP } from "@/lib/geoService";

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