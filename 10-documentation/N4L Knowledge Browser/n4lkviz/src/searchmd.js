import { generateEmbedding } from './embedding.js';

// Split Markdown into overlapping chunks.
function chunkMarkdown(markdown, chunkSize = 150, overlap = 50) {
    const chunks = [];
    const text = markdown.trim();
    const step = chunkSize - overlap;

    for (let start = 0; start < text.length;) {
        let end = Math.min(start + chunkSize, text.length);

        // If this isn't the final chunk, stop at a word boundary.
        if (end < text.length) {
            const boundary = text.lastIndexOf(' ', end);

            if (boundary > start) {
                end = boundary;
            }
        }

        const chunk = text.slice(start, end).trim();

        if (chunk) {
            chunks.push(chunk);
        }

        if (end >= text.length) {
            break;
        }

        // Start the next chunk with the desired overlap.
        start = Math.max(end - overlap, start + 1);

        // Move to the beginning of the next word.
        const nextSpace = text.indexOf(' ', start);

        if (nextSpace !== -1 && nextSpace < end) {
            start = nextSpace + 1;
        }
    }

    return chunks;
}

// Calculate cosine similarity between two vectors.
function cosineSimilarity(a, b) {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Generate embeddings for the Markdown chunks.
export async function prepareMarkdown(markdown) {
    const chunks = chunkMarkdown(markdown);
    const prepared = [];

    for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk);

        prepared.push({
            text: chunk,
            embedding
        });
    }

    return prepared;
}

// Return the 10 most relevant passages for a query.
export async function searchMarkdown(query, preparedChunks, limit = 3) {
    const queryEmbedding = await generateEmbedding(query);

    return preparedChunks
        .map((chunk) => ({
            text: chunk.text,
            similarity: cosineSimilarity(queryEmbedding, chunk.embedding)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
        .map((result) => result.text);
}