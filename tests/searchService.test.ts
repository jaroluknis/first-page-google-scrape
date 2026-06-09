import { searchGoogle } from "@/lib/searchService";

jest.mock("serpapi", () => ({
    getJson: jest.fn(),
}));

import { getJson } from "serpapi";
const mockGetJson = getJson as jest.Mock;

const mockOrganicResults = [
    { title: "Výsledok 1", link: "https://example1.com", snippet: "Popis 1" },
    { title: "Výsledok 2", link: "https://example2.com", snippet: "Popis 2" },
    { title: "Výsledok 3", link: "https://example3.com", snippet: "" },
];

describe("searchGoogle", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("vráti správnu štruktúru výstupu", async () => {
        mockGetJson.mockResolvedValue({ organic_results: mockOrganicResults });

        const result = await searchGoogle("test query");

        expect(result).toHaveProperty("results");
        expect(result).toHaveProperty("query", "test query");
        expect(result).toHaveProperty("totalResults", 3);
    });

    test("každý výsledok má správne polia", async () => {
        mockGetJson.mockResolvedValue({ organic_results: mockOrganicResults });

        const result = await searchGoogle("test query");

        result.results.forEach((r) => {
            expect(r).toHaveProperty("title");
            expect(r).toHaveProperty("url");
            expect(r).toHaveProperty("snippet");
            expect(r).toHaveProperty("position");
        });
    });

    test("prázdna odpoveď vráti prázdne pole", async () => {
        mockGetJson.mockResolvedValue({ organic_results: [] });

        const result = await searchGoogle("test query");

        expect(result.results).toHaveLength(0);
        expect(result.totalResults).toBe(0);
    });

    test("chýbajúci organic_results vráti prázdne pole", async () => {
        mockGetJson.mockResolvedValue({});

        const result = await searchGoogle("test query");

        expect(result.results).toHaveLength(0);
    });

    test("position začína od 1 a je správne zoradená", async () => {
        mockGetJson.mockResolvedValue({ organic_results: mockOrganicResults });

        const result = await searchGoogle("test query");

        expect(result.results[0].position).toBe(1);
        expect(result.results[1].position).toBe(2);
        expect(result.results[2].position).toBe(3);
    });

    test("chýbajúci snippet sa nahradí prázdnym stringom", async () => {
        mockGetJson.mockResolvedValue({ organic_results: mockOrganicResults });

        const result = await searchGoogle("test query");

        expect(result.results[2].snippet).toBe("");
    });
});