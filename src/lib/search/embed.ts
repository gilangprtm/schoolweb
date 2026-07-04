// ═══════════════════════════════════════════
// Embedding Utility — pgvector-ready placeholder
// ═══════════════════════════════════════════

/**
 * Embedding generation utility.
 *
 * CURRENT: Placeholder — using TF-IDF-like term frequency as a simple
 * sparse vector for prototyping without an external embedding API.
 *
 * PRODUCTION PATH (choose one):
 * 1. OpenAI text-embedding-3-small ($0.02/1M tokens) — best quality
 * 2. BGE-M3 via HuggingFace Inference API (free tier available)
 * 3. Local model via transformers.js (runs in Node.js, no API key needed)
 * 4. Cohere Embed (free tier: 1000 req/month)
 *
 * Schema ready for pgvector:
 * ```sql
 * CREATE EXTENSION IF NOT EXISTS vector;
 * CREATE TABLE document_embeddings (
 *   id SERIAL PRIMARY KEY,
 *   chunk_id TEXT NOT NULL UNIQUE,
 *   source_type TEXT NOT NULL,
 *   source_id TEXT NOT NULL,
 *   embedding vector(768), -- or 1536 for OpenAI
 *   content TEXT NOT NULL,
 *   metadata JSONB DEFAULT '{}',
 *   created_at TIMESTAMP DEFAULT NOW()
 * );
 * CREATE INDEX ON document_embeddings
 *   USING ivfflat (embedding vector_cosine_ops);
 * ```
 */

export interface EmbeddingResult {
  chunkId: string;
  embedding: number[];
  model: string;
  dimensions: number;
}

export interface EmbeddingOptions {
  /** Model name (e.g., "text-embedding-3-small", "bge-m3") */
  model?: string;
  /** Embedding dimensions (default: 768) */
  dimensions?: number;
}

/**
 * Generate embedding for a single text.
 *
 * Placeholder implementation: generates a simple term-frequency vector.
 * Replace with actual API call for production.
 */
export async function generateEmbedding(
  text: string,
  options: EmbeddingOptions = {},
): Promise<EmbeddingResult> {
  const { dimensions = 768 } = options;

  // Placeholder: TF-IDF-inspired sparse embedding
  // In production, replace with:
  //   const response = await openai.embeddings.create({
  //     model: "text-embedding-3-small",
  //     input: text,
  //   });
  //   return { embedding: response.data[0].embedding, ... };

  const embedding = tfidfEmbed(text, dimensions);

  return {
    chunkId: "",
    embedding,
    model: "tf-idf-placeholder",
    dimensions,
  };
}

/**
 * Generate embeddings for multiple texts in batch.
 */
export async function batchEmbed(
  texts: string[],
  options: EmbeddingOptions = {},
): Promise<EmbeddingResult[]> {
  return Promise.all(texts.map((text, i) => generateEmbedding(text, options)));
}

/**
 * Cosine similarity between two vectors.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector dimension mismatch: ${a.length} vs ${b.length}`);
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

/**
 * Simple TF-IDF inspired embedding.
 * This is a placeholder — NOT for production. Use a real embedding model.
 *
 * The placeholder creates a sparse vector where:
 * - Each token's position is hashed to a dimension index
 * - Value is proportional to term frequency
 * - Dimension size is configurable (default: 768)
 */
function tfidfEmbed(text: string, dimensions: number): number[] {
  const tokens = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 1);

  const vector = new Array(dimensions).fill(0);
  const termFreq = new Map<string, number>();

  // Count term frequencies
  for (const token of tokens) {
    termFreq.set(token, (termFreq.get(token) || 0) + 1);
  }

  // Hash terms to dimensions
  const maxFreq = Math.max(...termFreq.values(), 1);
  for (const [token, freq] of termFreq) {
    const idx = hashToken(token, dimensions);
    vector[idx] += freq / maxFreq; // Normalize by max frequency
  }

  // L2 normalize
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) {
      vector[i] /= norm;
    }
  }

  return vector;
}

/**
 * Simple hash function for token → dimension index mapping.
 */
function hashToken(token: string, dimensions: number): number {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash) % dimensions;
}
