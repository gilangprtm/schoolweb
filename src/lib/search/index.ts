// ═══════════════════════════════════════════
// Search Module — Public API
// ═══════════════════════════════════════════

export { searchContent, quickSearch } from "./fts";
export type { SearchResult, SearchOptions, SearchSource } from "./fts";
export { chunkText, chunkDocument } from "./chunk";
export type { Chunk, ChunkOptions } from "./chunk";

// Future: Vector embedding support
// export { generateEmbedding, batchEmbed } from "./embed";
// export type { EmbeddingResult } from "./embed";
