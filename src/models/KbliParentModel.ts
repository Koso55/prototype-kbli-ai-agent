import { Document, model, Schema } from "mongoose";

export interface KBLIParentInput {
  ossId: string;
  code: string;
  title: string;
  description: string;
}

export interface KBLIParentDocument extends KBLIParentInput, Document {
  createdAt: Date;
  updatedAt: Date;
}

const kbliParentSchema: Schema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

const KBLIParentModel = model<KBLIParentDocument>(
  "KBLIParent",
  kbliParentSchema
);

export default KBLIParentModel;
