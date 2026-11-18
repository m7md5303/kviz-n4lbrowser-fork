import { pipeline, env } from '@huggingface/transformers';

// Load model files from the local KViz project.
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = '/models/';

let extractor = null;

export async function loadEmbeddingModel() {
    if (!extractor) {
        extractor = await pipeline(
            'feature-extraction',
            'all-MiniLM-L6-v2',
            {
                dtype: 'fp32'
            }
        );
    }

    return extractor;
}

export async function generateEmbedding(text) {
    const model = await loadEmbeddingModel();

    const output = await model(text, {
        pooling: 'mean',
        normalize: true
    });

    return Array.from(output.data);
}