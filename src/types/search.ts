export interface SearchResult {
  title: string
  url: string
  snippet: string
  position: number
}

export interface SearchResponse {
  results: SearchResult[]
  query: string
  totalResults: number
  location?: string | null
}