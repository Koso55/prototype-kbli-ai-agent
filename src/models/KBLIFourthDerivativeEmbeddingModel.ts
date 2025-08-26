import { Document, model, Schema } from "mongoose";
import { KBLIFourthDerivativeWithScopeDetailsDocument } from "./KBLIFourthDerivativeModel";

export interface KBLIFourthDerivativeEmbeddingInput {
  fourthDerivativeId: KBLIFourthDerivativeWithScopeDetailsDocument["_id"];
  chunkIndex: number;
  textChunk: string;
  embeddings: number[];
}

export interface KBLIFourthDerivativeEmbeddingDocument
  extends KBLIFourthDerivativeEmbeddingInput,
    Document {
  createdAt: Date;
  updatedAt: Date;
}

const KBLIFourthDerivativeEmbeddingsSchema = new Schema(
  {
    fourthDerivativeId: {
      type: Schema.Types.ObjectId,
      ref: "KBLIFourthDerivativeWithScopeDetails",
      index: 1,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    textChunk: {
      type: String,
      required: true,
    },
    embeddings: [
      {
        type: Number,
        required: true,
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const KBLIFourthDerivativeEmbedding =
  model<KBLIFourthDerivativeEmbeddingDocument>(
    "KBLIFourthDerivativeEmbedding",
    KBLIFourthDerivativeEmbeddingsSchema
  );

export default KBLIFourthDerivativeEmbedding;
