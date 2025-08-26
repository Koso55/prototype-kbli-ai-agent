import { Document, model, Schema } from "mongoose";
import { KBLIParentDocument } from "./KbliParentModel";
import { KBLIFirstDerivativeDocument } from "./KBLIFirstDerivativeModel";

export interface KBLISecondDerivativeInput {
  ossId: string;
  code: string;
  title: string;
  description: string;
  topParentCode: string;
  directParentCode: string;
  topParentOssId: string;
  directParentOssId: string;
  topParentId: KBLIParentDocument["_id"];
  directParentId: KBLIFirstDerivativeDocument["_id"];
}

export interface KBLISecondDerivativeDocument
  extends KBLISecondDerivativeInput,
    Document {
  createdAt: Date;
  updatedAt: Date;
}

const kbliSecondDerivativeSchema: Schema = new Schema(
  {
    ossId: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    topParentCode: {
      type: String,
      required: true,
    },
    directParentCode: {
      type: String,
      required: true,
    },
    topParentOssId: {
      type: String,
      required: true,
    },
    directParentOssId: {
      type: String,
      required: true,
    },
    topParentId: {
      type: Schema.Types.ObjectId,
      ref: "KBLIParent",
      required: true,
    },
    directParentId: {
      type: Schema.Types.ObjectId,
      ref: "KBLIFirstDerivative",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const KBLISecondDerivativeModel = model<KBLISecondDerivativeDocument>(
  "KBLISecondDerivative",
  kbliSecondDerivativeSchema
);

export default KBLISecondDerivativeModel;
