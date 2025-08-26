import { Document, model, Schema } from "mongoose";
import { KBLIParentDocument } from "./KbliParentModel";
import { KBLISecondDerivativeDocument } from "./KBLISecondDerivativeModel";

export interface KBLIThirdDerivativeInput {
  ossId: string;
  code: string;
  title: string;
  description: string;
  topParentCode: string;
  directParentCode: string;
  topParentOssId: string;
  directParentOssId: string;
  topParentId: KBLIParentDocument["_id"];
  directParentId: KBLISecondDerivativeDocument["_id"];
}

export interface KBLIThirdDerivativeDocument
  extends KBLIThirdDerivativeInput,
    Document {
  createdAt: Date;
  updatedAt: Date;
}

const kbliThirdDerivativeSchema: Schema = new Schema(
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
      ref: "KBLISecondDerivative",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const KBLIThirdDerivativeModel = model<KBLIThirdDerivativeDocument>(
  "KBLIThirdDerivative",
  kbliThirdDerivativeSchema
);

export default KBLIThirdDerivativeModel;
