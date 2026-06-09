/**
 * Represents a single organic search result from Google.
 */
export interface SearchResult {
  /** Page title */
  title: string
  /** Full URL of the result */
  url: string
  /** Short description shown under the title in search results */
  snippet: string
  /** 1-based position in the results list */
  position: number
}

/**
 * Full response returned by the search API endpoint.
 */
export interface SearchResponse {
  /** List of organic search results */
  results: SearchResult[]
  /** The original search query */
  query: string
  /** Number of results returned */
  totalResults: number
  /** Detected location based on IP address, null if geolocation is disabled */
  location?: string | null
}
