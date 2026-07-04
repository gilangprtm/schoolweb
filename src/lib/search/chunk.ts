// ═══════════════════════════════════════════
// Recursive Chunking — kb07 implementation
// ═══════════════════════════════════════════

export interface Chunk {
  /** Unique chunk identifier */
  id: string;
  /** The chunk text content */
  content: string;
  /** Source document identifier (e.g., "posts:42") */
  sourceId: string;
  /** Source type (posts, staff, achievements, facilities, pages) */
  sourceType: string;
  /** Position in the original document (0-based chunk index) */
  chunkIndex: number;
  /** Total chunks for this document */
  totalChunks: number;
  /** Character offset start in original text */
  charStart: number;
  /** Character offset end in original text */
  charEnd: number;
}

export interface ChunkOptions {
  /** Maximum characters per chunk (default: 1000) */
  maxChunkSize?: number;
  /** Overlap characters between chunks (default: 200) */
  overlap?: number;
  /** Minimum chunk size before merging with previous (default: 100) */
  minChunkSize?: number;
}

/**
 * Split text into overlapping chunks.
 *
 * Strategy (from kb07 — Recursive Chunking):
 * 1. First try: split by paragraph (\n\n)
 * 2. If paragraph > maxChunkSize: split by sentence (. )
 * 3. If sentence > maxChunkSize: split by fixed char length
 * 4. Add overlap between chunks for context continuity
 */
export function chunkText(
  text: string,
  sourceId: string,
  sourceType: string,
  options: ChunkOptions = {},
): Chunk[] {
  const {
    maxChunkSize = 1000,
    overlap = 200,
    minChunkSize = 100,
  } = options;

  if (!text || text.trim().length === 0) return [];

  // Step 1: Split by paragraphs
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  const chunks: Chunk[] = [];
  let currentChunk = "";
  let charOffset = 0;
  const charPositions: number[] = [0];

  // Step 2: Build chunks, splitting oversized ones
  for (const paragraph of paragraphs) {
    const candidate = currentChunk
      ? currentChunk + "\n\n" + paragraph
      : paragraph;

    if (candidate.length <= maxChunkSize) {
      currentChunk = candidate;
    } else {
      // Save current chunk if not empty
      if (currentChunk.length >= minChunkSize) {
        charPositions.push(charOffset);
        charOffset += currentChunk.length;
      }

      // Split oversized paragraph further
      if (paragraph.length > maxChunkSize) {
        const subChunks = splitOversized(paragraph, maxChunkSize, overlap);
        for (const sub of subChunks) {
          if (currentChunk && currentChunk.length >= minChunkSize) {
            chunks.push(buildDraft(currentChunk, charPositions));
            charPositions.push(charOffset);
          }
          currentChunk = sub;
          charOffset += sub.length;
        }
      } else {
        if (currentChunk && currentChunk.length >= minChunkSize) {
          chunks.push(buildDraft(currentChunk, charPositions));
          charPositions.push(charOffset);
        }
        currentChunk = paragraph;
        charOffset += paragraph.length;
      }
    }
  }

  // Don't forget the last chunk
  if (currentChunk.length >= minChunkSize) {
    chunks.push(buildDraft(currentChunk, charPositions));
  } else if (chunks.length > 0) {
    // Merge small trailing chunk with previous
    chunks[chunks.length - 1] = buildDraft(
      chunks[chunks.length - 1].content + "\n\n" + currentChunk,
      [chunks[chunks.length - 1].charStart],
    );
  }

  // Build final chunks with overlap
  return addOverlap(chunks, sourceId, sourceType, overlap, maxChunkSize);
}

function splitOversized(
  text: string,
  maxSize: number,
  overlap: number,
): string[] {
  // Try sentence splitting first
  const sentences = text.split(/(?<=[.!?])\s+/);
  const result: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (current.length + sentence.length > maxSize && current.length > 0) {
      result.push(current.trim());
      // Keep last sentence as overlap
      const lastSentence = current.split(/(?<=[.!?])\s+/).pop() || "";
      current = lastSentence + " " + sentence;
    } else {
      current = current ? current + " " + sentence : sentence;
    }
  }

  if (current.trim()) result.push(current.trim());

  // If any sentence is still too large, force-split by character
  if (result.some((r) => r.length > maxSize)) {
    return result.flatMap((r) => {
      if (r.length <= maxSize) return [r];
      const forced: string[] = [];
      for (let i = 0; i < r.length; i += maxSize - overlap) {
        forced.push(r.slice(i, i + maxSize));
      }
      return forced;
    });
  }

  return result;
}

function buildDraft(content: string, positions: number[]): Chunk {
  return {
    id: "",
    content: content.trim(),
    sourceId: "",
    sourceType: "",
    chunkIndex: 0,
    totalChunks: 0,
    charStart: positions[positions.length - 1] || 0,
    charEnd: (positions[positions.length - 1] || 0) + content.length,
  };
}

function addOverlap(
  drafts: Chunk[],
  sourceId: string,
  sourceType: string,
  overlap: number,
  maxSize: number,
): Chunk[] {
  if (drafts.length === 0) return [];

  return drafts.map((draft, i) => {
    let content = draft.content;

    // Prepend overlap from previous chunk
    if (i > 0 && overlap > 0) {
      const prev = drafts[i - 1].content;
      const overlapText = prev.slice(-overlap);
      content = overlapText + " " + content;
    }

    // Truncate if too long
    if (content.length > maxSize + overlap) {
      content = content.slice(0, maxSize + overlap);
    }

    return {
      id: `${sourceType}:${sourceId}:chunk${i}`,
      content,
      sourceId,
      sourceType,
      chunkIndex: i,
      totalChunks: drafts.length,
      charStart: draft.charStart,
      charEnd: draft.charEnd,
    };
  });
}

/**
 * Chunk a document for indexing.
 * Returns plain text chunks ready for embedding or FTS indexing.
 */
export function chunkDocument(
  title: string,
  body: string,
  sourceId: string,
  sourceType: string,
  options?: ChunkOptions,
): Chunk[] {
  // Title gets its own chunk (high relevance)
  const titleChunk: Chunk = {
    id: `${sourceType}:${sourceId}:title`,
    content: title,
    sourceId,
    sourceType,
    chunkIndex: -1, // title is special
    totalChunks: 0,
    charStart: 0,
    charEnd: title.length,
  };

  const bodyChunks = chunkText(body, sourceId, sourceType, options);

  // Update totalChunks for all
  const total = bodyChunks.length + 1;
  titleChunk.totalChunks = total;
  for (const chunk of bodyChunks) {
    chunk.totalChunks = total;
  }

  return [titleChunk, ...bodyChunks];
}
