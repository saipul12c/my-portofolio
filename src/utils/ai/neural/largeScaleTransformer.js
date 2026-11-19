/**
 * largeScaleTransformer.js
 * Jalur 1: True Local Deep Learning Transformer Engine (Transformers.js / ONNX)
 * Menjalankan model Transformer berskala puluhan juta parameter (all-MiniLM-L6-v2 / 384-D)
 * 100% lokal di browser (WebAssembly/WebGPU) secara non-blocking di latar belakang.
 */

import { calculateCosineSimilarity } from './semanticEmbeddings.js';

let transformerPipeline = null;
let transformerStatus = 'idle'; // 'idle' | 'loading' | 'ready' | 'unavailable'
let loadError = null;

// Konfigurasi model default (Super efisien & akurat untuk semantic search portofolio)
const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';

/**
 * Memuat pipeline Transformers.js secara dinamis dan aman
 * Menggunakan lazy import agar tidak memperlambat initial page load
 */
export async function initLargeScaleTransformer(onProgress = null) {
  if (transformerStatus === 'ready') return true;
  if (transformerStatus === 'loading') return false;

  transformerStatus = 'loading';

  try {
    // 1. Deteksi runtime: Coba import dari module lokal atau CDN browser
    let pipelineFn = null;

    if (typeof window !== 'undefined') {
      try {
        // Coba import modul Xenova jika terpasang di node_modules atau browser
        const transformers = await import(/* @vite-ignore */ '@xenova/transformers').catch(() => null);
        if (transformers && transformers.pipeline) {
          pipelineFn = transformers.pipeline;
        } else {
          // Dynamic CDN fallback untuk browser tanpa npm bundle overhead
          const cdnModule = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2').catch(() => null);
          if (cdnModule && cdnModule.pipeline) {
            pipelineFn = cdnModule.pipeline;
          }
        }
      } catch (err) {
        console.warn('Transformers dynamic import failed:', err.message);
      }
    } else {
      // Node.js environment (misal saat testing)
      try {
        const transformers = await import(/* @vite-ignore */ '@xenova/transformers').catch(() => null);
        if (transformers && transformers.pipeline) {
          pipelineFn = transformers.pipeline;
        }
      } catch { /* ignore */ }
    }

    if (!pipelineFn) {
      transformerStatus = 'unavailable';
      return false;
    }

    // 2. Inisialisasi feature-extraction pipeline dengan model ter-quantize (INT8 ~22MB)
    transformerPipeline = await pipelineFn('feature-extraction', MODEL_NAME, {
      quantized: true,
      progress_callback: (p) => {
        if (typeof onProgress === 'function') onProgress(p);
      }
    });

    transformerStatus = 'ready';
    console.log('🚀 [SaipulAI] Large-Scale Transformer Engine (384-D) aktif di browser!');
    return true;
  } catch (error) {
    transformerStatus = 'unavailable';
    loadError = error.message;
    console.warn('⚠️ [SaipulAI] Transformer model unavailable, staying on 256-D Self-Attention Engine:', error.message);
    return false;
  }
}

/**
 * Mengecek apakah Transformer skala besar sudah siap
 */
export function isLargeScaleTransformerReady() {
  return transformerStatus === 'ready' && transformerPipeline !== null;
}

/**
 * Mengambil status saat ini dari Transformer
 */
export function getTransformerStatus() {
  return {
    status: transformerStatus,
    modelName: MODEL_NAME,
    dimensions: 384,
    error: loadError
  };
}

/**
 * Menghitung Dense Embedding 384-Dimensi menggunakan Large-Scale Transformer
 */
export async function computeLargeScaleEmbedding(text) {
  if (!isLargeScaleTransformerReady() || !text) return null;

  try {
    const output = await transformerPipeline(text, {
      pooling: 'mean',
      normalize: true
    });

    // Output tensor ke Float32Array (384-D)
    return new Float32Array(output.data);
  } catch (err) {
    console.warn('Transformer inference error:', err);
    return null;
  }
}

/**
 * Pencarian Semantik Skala Besar menggunakan Transformer Embeddings
 */
export async function largeScaleSemanticSearch(query, documents = [], topK = 3) {
  if (!isLargeScaleTransformerReady()) return null;

  const queryVec = await computeLargeScaleEmbedding(query);
  if (!queryVec) return null;

  const scored = [];
  for (const doc of documents) {
    const docText = typeof doc === 'string' ? doc : (doc.text || doc.title || doc.description || doc.content || '');
    let docVec = doc.largeEmbedding;
    if (!docVec || (docVec.length !== queryVec.length)) {
      docVec = await computeLargeScaleEmbedding(docText);
      if (typeof doc === 'object' && doc !== null && docVec) {
        doc.largeEmbedding = docVec;
      }
    }

    if (docVec) {
      const score = calculateCosineSimilarity(queryVec, docVec);
      scored.push({
        item: doc,
        score,
        text: docText,
        sourceType: 'large_scale_transformer'
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
