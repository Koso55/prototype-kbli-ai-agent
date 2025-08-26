// import {
//   AutoTokenizer,
//   AutoModel,
//   PreTrainedTokenizer,
//   PreTrainedModel,
//   PretrainedModelOptions,
// } from "@huggingface/transformers";
//huggingface does not work, trying xenova
import { pipeline, FeatureExtractionPipeline } from "@huggingface/transformers";
// import { FeatureExtractionPipeline, pipeline } from "@xenova/transformers";

class SentenceTransformers {
  private extractor: FeatureExtractionPipeline | null = null;
  // private tokenizer: PreTrainedTokenizer;
  // private model: PreTrainedModel;

  // constructor(tokenizer: PreTrainedTokenizer, model: PreTrainedModel) {
  //   this.tokenizer = tokenizer;
  //   this.model = model;
  // }

  constructor(extractor: FeatureExtractionPipeline) {
    this.extractor = extractor;
  }

  public async chunkText(text: string, chunkSize: number, overlap: number) {
    const words = text.split(" ");
    const chunks: string[] = [];
    let start = 0;

    while (start < words.length) {
      const end = Math.min(start + chunkSize, words.length);
      chunks.push(words.slice(start, end).join(" "));

      if (end === words.length) break;
      start = end - overlap;
    }
    return chunks;
  }

  public async generateEmbeddings(text: string) {
    if (!this.extractor) throw new Error("Pipeline not initialized");
    const output = await this.extractor(text, {
      pooling: "mean",
    });
    return output.data;
  }
}

let instance: SentenceTransformers | null = null;

export const initSentenceTransformers = async () => {
  if (!instance) {
    const extractor = await pipeline(
      "feature-extraction",
      "Xenova/paraphrase-multilingual-MiniLM-L12-v2"
    );
    instance = new SentenceTransformers(extractor);
  }
  return instance;
};

export const getSentenceTransformers = () => {
  if (!instance) {
    throw new Error(
      "SentenceTransformers has not been initialized yet. Call initSentenceTransformers() first."
    );
  }
  return instance;
};
