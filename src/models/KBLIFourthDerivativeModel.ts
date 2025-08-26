import { Document, model, Schema } from "mongoose";
import { KBLIParentDocument } from "./KbliParentModel";
import { KBLIThirdDerivativeDocument } from "./KBLIThirdDerivativeModel";
import { KBLIFourthDerivativeEmbeddingDocument } from "./KBLIFourthDerivativeEmbeddingModel";

export interface KBLIReqObgData {
  title: string;
  timeframe: string;
}

export interface KBLIAuthParamData {
  parameter: string;
  authority: string;
}

export interface KBLIPermitData {
  type: string;
  title: string;
}

export interface KBLIDerivativeScopeDataGeneralInfo {
  scale: string;
  totalArea: string;
  riskLevel: string;
  permit: string;
  validityPeriod: string;
  timeframe: string;
}

export interface KBLIDerivativeScopeData {
  generalInfo: KBLIDerivativeScopeDataGeneralInfo;
  requirements: KBLIReqObgData[];
  obligations: KBLIReqObgData[];
  authorityParams: KBLIAuthParamData[];
  permits: KBLIPermitData[];
}

export interface KBLIDerivativeScope {
  title: string;
  scopes: KBLIDerivativeScopeData[];
}

export interface KBLIScopeRegulationData {
  id: string;
  title: string;
  description: string;
}

export interface KBLIFourthDerivativeWithScopeDetailsInput {
  ossId: string;
  code: string;
  title: string;
  description: string;
  topParentCode: string;
  directParentCode: string;
  topParentOssId: string;
  directParentOssId: string;
  topParentId: KBLIParentDocument["_id"];
  directParentId: KBLIThirdDerivativeDocument["_id"];
  specialRequirement: string[];
  scopes: KBLIDerivativeScope[];
  regulations: KBLIScopeRegulationData[];
}

export interface KBLIFourthDerivativeWithScopeDetailsDocument
  extends KBLIFourthDerivativeWithScopeDetailsInput,
    Document {
  embeddings: KBLIFourthDerivativeEmbeddingDocument["_id"][];
  createdAt: Date;
  updatedAt: Date;
}

const kbliReqObgDataSchema = new Schema({
  title: { type: String },
  timeframe: { type: String },
});

const authorityParameterSchema = new Schema({
  parameter: { type: String },
  authority: { type: String },
});

const permitSchema = new Schema({
  type: { type: String },
  title: { type: String },
});

const generalInfoSchema = new Schema({
  scale: String,
  totalArea: String,
  riskLevel: String,
  permit: String,
  validityPeriod: String,
  timeframe: String,
});

const scopesDataSchema = new Schema({
  generalInfo: generalInfoSchema,
  requirements: [kbliReqObgDataSchema],
  obligations: [kbliReqObgDataSchema],
  authorityParams: [authorityParameterSchema],
  permits: [permitSchema],
});

const savedScopeDetailsSchema = new Schema({
  title: { type: String },
  scopes: [scopesDataSchema],
});

const scopeRegulationSchema = new Schema({
  id: { type: String },
  title: { type: String },
  description: { type: String },
});

const kbliFourthDerivativeWithScopeDetailsSchema = new Schema(
  {
    ossId: { type: String, unique: true },
    code: { type: String },
    title: { type: String },
    description: { type: String },
    topParentCode: { type: String },
    directParentCode: { type: String },
    topParentOssId: { type: String },
    directParentOssId: { type: String },
    topParentId: {
      type: Schema.Types.ObjectId,
      ref: "KBLIParent",
      required: true,
    },
    directParentId: {
      type: Schema.Types.ObjectId,
      ref: "KBLIThirdDerivative",
      required: true,
    },
    specialRequirement: [{ type: String }],
    scopes: [savedScopeDetailsSchema],
    regulations: [scopeRegulationSchema],
    embeddings: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: true }
);

const KBLIFourthDerivativeWithScopeDetails =
  model<KBLIFourthDerivativeWithScopeDetailsDocument>(
    "KBLIFourthDerivativeWithScopeDetails",
    kbliFourthDerivativeWithScopeDetailsSchema
  );

export default KBLIFourthDerivativeWithScopeDetails;
