import mongoose, { FilterQuery } from "mongoose";
import {
  findKbliFileByFilePath,
  KBLIDerivativeSourceFile,
  KBLIDerivativeWithScopeDetailsSourceFile,
  KBLIFirstDerivativeFilePath,
  KBLIFourthDerivativeFilePath,
  KBLIParentFilePath,
  KBLIParentSourceFIle,
  KBLISecondDerivativeFilePath,
  KBLIThirdDerivativeFilePath,
} from "../const/kbliFilePath";
import { CustomError } from "../middlewares";
import {
  KBLIFirstDerivative,
  KBLIFourthDerivative,
  KBLIFourthDerivativeEmbedding,
  KBLIParent,
  KBLISecondDerivative,
  KBLIThirdDerivative,
} from "../models";
import { KBLIFirstDerivativeInput } from "../models/KBLIFirstDerivativeModel";
import { KBLIParentInput } from "../models/KbliParentModel";
import { KBLISecondDerivativeInput } from "../models/KBLISecondDerivativeModel";
import { KBLIThirdDerivativeInput } from "../models/KBLIThirdDerivativeModel";
import { KBLIFourthDerivativeWithScopeDetailsInput } from "../models/KBLIFourthDerivativeModel";
import { getSentenceTransformers } from "../pkg/SentenceTransformers";
import { KBLIFourthDerivativeEmbeddingDocument } from "../models/KBLIFourthDerivativeEmbeddingModel";

/* -------------- PARENT ------------------- */
export const insertManyKBLIParentService = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const parentSourceFile = (await findKbliFileByFilePath(
      KBLIParentFilePath
    )) as KBLIParentSourceFIle[];

    if (!parentSourceFile || parentSourceFile.length < 1) {
      throw new CustomError("File Not Found", "NOTFOUND", 404);
    }

    const parentKbliInput: KBLIParentInput[] = parentSourceFile.map((kbli) => ({
      ossId: kbli.kbliId,
      code: kbli.code,
      title: kbli.title,
      description: kbli.description,
    }));

    const result = await KBLIParent.insertMany(parentKbliInput, {
      ordered: true,
      session,
    });
    await session.commitTransaction();

    return result.length === parentSourceFile.length;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { isDone: false, error };
  } finally {
    session.endSession();
  }
};

export const getAllKbliParentService = async () => {
  return await KBLIParent.find();
};

/* -------------- First Derivative ------------------- */
export const insertManyKBLIFirstDerivativeService = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("starting task of inserting first derivative");
    const firstDerivativeSourceFile = (await findKbliFileByFilePath(
      KBLIFirstDerivativeFilePath
    )) as KBLIDerivativeSourceFile[];

    if (!firstDerivativeSourceFile || firstDerivativeSourceFile.length < 1) {
      throw new CustomError("File Not Found", "NOTFOUND", 404);
    }

    const firstDerivativeKbliInput: KBLIFirstDerivativeInput[] = [];

    for (const kbli of firstDerivativeSourceFile) {
      const directParent = await KBLIParent.findOne({
        ossId: kbli.directParentKbliId,
      });
      if (!directParent) {
        throw new CustomError(
          "DirectParent not found, please check your input again",
          "InvalidParentId",
          400
        );
      }

      const topParent = await KBLIParent.findOne({
        ossId: kbli.topParentKbliId,
      });
      if (!topParent) {
        throw new CustomError(
          "TopParent not found, please check your input again",
          "InvalidParentId",
          400
        );
      }

      firstDerivativeKbliInput.push({
        ossId: kbli.kbliId,
        code: kbli.code,
        title: kbli.title,
        description: kbli.description,
        directParentOssId: kbli.directParentKbliId,
        directParentCode: kbli.directParentCode,
        topParentCode: kbli.topParentCode,
        topParentOssId: kbli.topParentKbliId,
        directParentId: directParent._id as mongoose.Types.ObjectId,
        topParentId: topParent._id as mongoose.Types.ObjectId,
      });
    }

    firstDerivativeKbliInput.sort((a, b) => {
      if (a.topParentCode === b.topParentCode) {
        if (a.directParentCode === b.directParentCode) {
          return a.code.localeCompare(b.code, undefined, { numeric: true });
        }
        return a.directParentCode.localeCompare(b.directParentCode, undefined, {
          numeric: true,
        });
      }
      return a.topParentCode.localeCompare(b.topParentCode, undefined, {
        numeric: true,
      });
    });

    console.log(`inputting to db ${firstDerivativeKbliInput.length} of entry`);
    const result = await KBLIFirstDerivative.insertMany(
      firstDerivativeKbliInput,
      { ordered: true, session }
    );
    console.log(`successfully inserted ${result.length} of entry to db`);

    await session.commitTransaction();

    return {
      isDone: true,
      success: result.length === firstDerivativeSourceFile.length,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { isDone: false, error };
  } finally {
    session.endSession();
  }
};

export const getAllKbliFirstDerivativeService = async () => {
  return await KBLIFirstDerivative.find();
};

/* -------------- Second Derivative ------------------- */
export const insertManyKbliSecondDerivativeService = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("starting task of inserting second derivative");
    const secondDerivativeSourceFile = (await findKbliFileByFilePath(
      KBLISecondDerivativeFilePath
    )) as KBLIDerivativeSourceFile[];

    if (!secondDerivativeSourceFile || secondDerivativeSourceFile.length < 1) {
      throw new CustomError("File Not Found", "NOTFOUND", 404);
    }

    const secondDerivativeInput: KBLISecondDerivativeInput[] = [];

    for (const kbli of secondDerivativeSourceFile) {
      const directParent = await KBLIFirstDerivative.findOne({
        ossId: kbli.directParentKbliId,
      });
      if (!directParent) {
        throw new CustomError(
          "DirectParent not found, please check your input again",
          "InvalidParentId",
          400
        );
      }

      const topParent = await KBLIParent.findOne({
        ossId: kbli.topParentKbliId,
      });
      if (!topParent) {
        throw new CustomError(
          "TopParent not found, please check your input again",
          "InvalidParentId",
          400
        );
      }

      secondDerivativeInput.push({
        ossId: kbli.kbliId,
        code: kbli.code,
        title: kbli.title,
        description: kbli.description,
        directParentOssId: kbli.directParentKbliId,
        directParentCode: kbli.directParentCode,
        topParentCode: kbli.topParentCode,
        topParentOssId: kbli.topParentKbliId,
        directParentId: directParent._id as mongoose.Types.ObjectId,
        topParentId: topParent._id as mongoose.Types.ObjectId,
      });
    }

    secondDerivativeInput.sort((a, b) => {
      if (a.topParentCode === b.topParentCode) {
        if (a.directParentCode === b.directParentCode) {
          return a.code.localeCompare(b.code, undefined, { numeric: true });
        }
        return a.directParentCode.localeCompare(b.directParentCode, undefined, {
          numeric: true,
        });
      }
      return a.topParentCode.localeCompare(b.topParentCode, undefined, {
        numeric: true,
      });
    });

    console.log(`inputting to db ${secondDerivativeInput.length} of entry`);
    const result = await KBLISecondDerivative.insertMany(
      secondDerivativeInput,
      {
        ordered: true,
        session,
      }
    );
    console.log(`successfully inserted ${result.length} of entry to db`);

    await session.commitTransaction();

    return {
      isDone: true,
      success: result.length === secondDerivativeSourceFile.length,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { isDone: false, error };
  } finally {
    session.endSession();
  }
};

export const getAllKbliSecondtDerivativeService = async () => {
  return await KBLISecondDerivative.find();
};

/* -------------- Third Derivative ------------------- */
export const insertManyKbliThirdDerivativeService = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("starting task of inserting third derivative");
    const thirdDerivativeSourceFile = (await findKbliFileByFilePath(
      KBLIThirdDerivativeFilePath
    )) as KBLIDerivativeSourceFile[];

    if (!thirdDerivativeSourceFile || thirdDerivativeSourceFile.length < 1) {
      throw new CustomError("File Not Found", "NOTFOUND", 404);
    }

    const thirdDerivativeInput: KBLIThirdDerivativeInput[] = [];

    console.log(
      "formatting inputs for third derivatives, total of:",
      thirdDerivativeSourceFile.length
    );
    for (const kbli of thirdDerivativeSourceFile) {
      const directParent = await KBLISecondDerivative.findOne({
        ossId: kbli.directParentKbliId,
        code: kbli.directParentCode,
      });
      if (!directParent) {
        throw new CustomError(
          "DirectParent not found, please check your input again",
          "InvalidParentId",
          400
        );
      }

      const topParent = await KBLIParent.findOne({
        ossId: kbli.topParentKbliId,
      });
      if (!topParent) {
        throw new CustomError(
          "TopParent not found, please check your input again",
          "InvalidParentId",
          400
        );
      }

      thirdDerivativeInput.push({
        ossId: kbli.kbliId,
        code: kbli.code,
        title: kbli.title,
        description: kbli.description,
        directParentOssId: kbli.directParentKbliId,
        directParentCode: kbli.directParentCode,
        topParentCode: kbli.topParentCode,
        topParentOssId: kbli.topParentKbliId,
        directParentId: directParent._id as mongoose.Types.ObjectId,
        topParentId: topParent._id as mongoose.Types.ObjectId,
      });
    }

    console.log(
      "sorting through entries.....",
      thirdDerivativeSourceFile.length
    );
    thirdDerivativeInput.sort((a, b) => {
      if (a.topParentCode === b.topParentCode) {
        if (a.directParentCode === b.directParentCode) {
          return a.code.localeCompare(b.code, undefined, { numeric: true });
        }
        return a.directParentCode.localeCompare(b.directParentCode, undefined, {
          numeric: true,
        });
      }
      return a.topParentCode.localeCompare(b.topParentCode, undefined, {
        numeric: true,
      });
    });

    console.log(`inputting to db ${thirdDerivativeInput.length} of entry`);
    const result = await KBLIThirdDerivative.insertMany(thirdDerivativeInput, {
      ordered: true,
      session,
    });
    console.log(`successfully inserted ${result.length} of entry to db`);

    await session.commitTransaction();

    return {
      isDone: true,
      success: result.length === thirdDerivativeSourceFile.length,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { isDone: false, error };
  } finally {
    session.endSession();
  }
};

export const getAllKbliThirdDerivativeService = async () => {
  return await KBLIThirdDerivative.find();
};

/* -------------- Fourth Derivative ------------------- */
export const insertManyKbliFourthDerivativeService = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("starting task of inserting fourth derivative");
    const fourthDerivativeSourceFile = (await findKbliFileByFilePath(
      KBLIFourthDerivativeFilePath
    )) as KBLIDerivativeWithScopeDetailsSourceFile[];

    if (!fourthDerivativeSourceFile || fourthDerivativeSourceFile.length < 1) {
      throw new CustomError("File Not Found", "NOTFOUND", 404);
    }

    const fourthDerivativeInput: KBLIFourthDerivativeWithScopeDetailsInput[] =
      [];

    console.log(
      "formatting inputs for fourth derivatives, total of:",
      fourthDerivativeSourceFile.length
    );
    for (const kbli of fourthDerivativeSourceFile) {
      const directParent = await KBLIThirdDerivative.findOne({
        ossId: kbli.directParentKbliId,
        code: kbli.directParentCode,
      });
      if (!directParent) {
        throw new CustomError(
          "DirectParent not found, please check your input again",
          "InvalidParentId",
          400
        );
      }

      const topParent = await KBLIParent.findOne({
        ossId: kbli.topParentKbliId,
      });
      if (!topParent) {
        throw new CustomError(
          "TopParent not found, please check your input again",
          "InvalidParentId",
          400
        );
      }

      fourthDerivativeInput.push({
        ossId: kbli.kbliId,
        code: kbli.code,
        title: kbli.title,
        description: kbli.description,
        directParentOssId: kbli.directParentKbliId,
        directParentCode: kbli.directParentCode,
        topParentCode: kbli.topParentCode,
        topParentOssId: kbli.topParentKbliId,
        scopes: kbli.scopes,
        regulations: kbli.regulations,
        specialRequirement: kbli.specialRequirement,
        directParentId: directParent._id as mongoose.Types.ObjectId,
        topParentId: topParent._id as mongoose.Types.ObjectId,
      });
    }

    console.log("sorting through entries.....", fourthDerivativeInput.length);
    fourthDerivativeInput.sort((a, b) => {
      if (a.topParentCode === b.topParentCode) {
        if (a.directParentCode === b.directParentCode) {
          return a.code.localeCompare(b.code, undefined, { numeric: true });
        }
        return a.directParentCode.localeCompare(b.directParentCode, undefined, {
          numeric: true,
        });
      }
      return a.topParentCode.localeCompare(b.topParentCode, undefined, {
        numeric: true,
      });
    });

    console.log(`inputting to db ${fourthDerivativeInput.length} of entry`);
    const result = await KBLIFourthDerivative.insertMany(
      fourthDerivativeInput,
      {
        ordered: true,
        session,
      }
    );
    console.log(`successfully inserted ${result.length} of entry to db`);

    await session.commitTransaction();

    return {
      isDone: true,
      success: result.length === fourthDerivativeSourceFile.length,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { isDone: false, error };
  } finally {
    session.endSession();
  }
};

export const getAllKbliFourthDerivativeService = async () => {
  return await KBLIFourthDerivative.find().limit(100);
};

export const addEmbeddingToFourthDerivativesService = async () => {
  try {
    const batchSize = 10;
    let currentObjectId: mongoose.Types.ObjectId | null = null;
    const st = getSentenceTransformers();
    const results: string[] = [];

    while (true) {
      const filterQuery: FilterQuery<KBLIFourthDerivativeEmbeddingDocument> =
        currentObjectId ? { _id: { $gt: currentObjectId } } : {};

      const fourthDerivatives = await KBLIFourthDerivative.find(filterQuery)
        .select("_id title description code topParentCode embeddings")
        .limit(batchSize);

      if (fourthDerivatives.length === 0) {
        console.log("Done, please check the collections");
        break;
      }

      for (const data of fourthDerivatives) {
        const vectorizedText = `Kode Kategori KBLI: ${data.topParentCode}, Nama Turunan KBLI: ${data.title}, Kode Turunan KBLI: ${data.code}, Deskripsi: ${data.description}`;
        const chunks = await st.chunkText(vectorizedText, 100, 20);
        console.log("number of chunks:", chunks.length);
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          console.log(chunk);
          const em = await st.generateEmbeddings(chunk);

          const saved = await KBLIFourthDerivativeEmbedding.create({
            fourthDerivativeId: data._id,
            chunkIndex: i,
            textChunk: chunk,
            embeddings: [...em],
          });

          data.embeddings.push(saved._id as mongoose.Types.ObjectId);
          await data.save();

          results.push((saved._id as mongoose.Types.ObjectId).toString());
        }
      }
      currentObjectId = fourthDerivatives[fourthDerivatives.length - 1]
        ._id as mongoose.Types.ObjectId;
    }

    return results.length;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const cleanupEmbeddingsFromFourthDerivativeService = async () => {
  try {
    return await KBLIFourthDerivative.updateMany({}, { embeddings: [] });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createVectorSearchIndexForKBLIFourthDerivativeService =
  async () => {
    try {
      const db = mongoose.connection.db;
      if (!db)
        throw new CustomError(
          "DB Not connected, please check your config",
          "InvalidDbConnection",
          500
        );

      const collection = db.collection("kblifourthderivativeembeddings");
      const index: mongoose.mongo.SearchIndexDescription = {
        name: "DescriptionSemanticSearch",
        type: "vectorSearch",
        definition: {
          fields: [
            {
              type: "vector",
              numDimensions: 384,
              path: "embeddings",
              similarity: "cosine",
            },
          ],
        },
      };

      const result = await collection.createSearchIndex(index);
      console.log(`New vector index: ${result}`);
      let isQueryable = false;

      while (!isQueryable) {
        const cursor = collection.listSearchIndexes();

        for await (const index of cursor) {
          if (index.name === result) {
            if ((index as any).queryable) {
              console.log(`${result} is ready for querying.`);
              isQueryable = true;
            } else {
              await new Promise((resolve) => setTimeout(resolve, 5000));
            }
          }
        }
      }
      return isQueryable;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

export const semanticSearchFourthDerivativeService = async (query: string) => {
  try {
    const st = getSentenceTransformers();
    const chunks = await st.chunkText(query, 100, 20);
    const vectors: number[][] = [];
    let queryVector: number[] = [];

    for (const chunk of chunks) {
      const embeddingDataArray = await st.generateEmbeddings(chunk);
      const embedding = Array.from(embeddingDataArray);
      vectors.push(embedding);
    }

    if (chunks.length > 1) {
      queryVector = vectors[0].map(
        (_, i) => vectors.reduce((sum, v) => sum + v[i], 0) / vectors.length
      );
    } else {
      queryVector = Array.from(await st.generateEmbeddings(query));
    }

    // buat embedding composite untuk head and tail dari deskripsi kategori
    const pipeline: mongoose.PipelineStage[] = [
      {
        $vectorSearch: {
          index: "DescriptionSemanticSearch",
          path: "embeddings",
          queryVector,
          numCandidates: 2000,
          limit: 5,
        },
      },
      {
        $lookup: {
          from: "kblifourthderivativewithscopedetails",
          foreignField: "_id",
          localField: "fourthDerivativeId",
          as: "fourthDerivativeId",
        },
      },
      {
        $unwind: {
          path: "$fourthDerivativeId",
          preserveNullAndEmptyArrays: true,
        },
      },
      // {
      //   $group:
      //     /**
      //      * _id: The id of the group.
      //      * fieldN: The first field name.
      //      */
      //     {
      //       _id: "$fourthDerivativeId",
      //       fourthDerivative: {
      //         $addToSet: "$fourthDerivativeId",
      //       },
      //     },
      // },
      // {
      //   $unwind:
      //     /**
      //      * path: Path to the array field.
      //      * includeArrayIndex: Optional name for index.
      //      * preserveNullAndEmptyArrays: Optional
      //      *   toggle to unwind null and empty values.
      //      */
      //     {
      //       path: "$fourthDerivative",
      //       preserveNullAndEmptyArrays: true,
      //     },
      // },
      {
        $project: {
          // _id: {
          //   _id: 1,
          //   title: 1,
          //   code: 1,
          //   topParentCode: 1,
          //   description: 1,
          //   ossId: 1,
          // },
          // fourthDerivative: {
          //   _id: 1,
          //   title: 1,
          //   code: 1,
          //   topParentCode: 1,
          //   description: 1,
          //   ossId: 1,
          // },
          _id: 1,
          // chunkIndex: 1,
          // textChunk: 1,
          fourthDerivativeId: {
            _id: 1,
            title: 1,
            description: 1,
          },
          score: { $meta: "vectorSearchScore" },
        },
      },
    ];

    const result = await KBLIFourthDerivativeEmbedding.aggregate(pipeline);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//try simpler and one scope, mungkin lebih ke stau topik dan lebih akurat lagi

// export const addEmbeddingToFourthDerivativesService = async () => {
//   try {
//     const batchSize = 10;
//     let currentObjectId: mongoose.Types.ObjectId | null = null;
//     const st = getSentenceTransformers();
//     const results: string[] = [];

//     while (true) {
//       const filterQuery: FilterQuery<KBLIFourthDerivativeEmbeddingDocument> =
//         currentObjectId ? { _id: { $gt: currentObjectId } } : {};

//       const fourthDerivatives = await KBLIFourthDerivative.find(filterQuery)
//         .select("_id title description topParentCode embeddings")
//         .limit(batchSize);

//       if (fourthDerivatives.length === 0) {
//         console.log("Done, please check the collections");
//         break;
//       }

//       for (const data of fourthDerivatives) {
//         const vectorizedText = `Kode Kategori KBLI: ${data.topParentCode} Nama Turunan KBLI: ${data.title}, Deskripsi: ${data.description}`;
//         const chunks = await st.chunkText(vectorizedText, 100, 0);
//         console.log("number of chunks:", chunks.length);
//         const embeddings: number[] = [];
//         for (let i = 0; i < chunks.length; i++) {
//           const chunk = chunks[i];
//           console.log(chunk);
//           const em = await st.generateEmbeddings(chunk);
//           embeddings.push(...em);
//         }

//         const saved = await KBLIFourthDerivativeEmbedding.create({
//           fourthDerivativeId: data._id,
//           chunkIndex: 0,
//           textChunk: vectorizedText,
//           embeddings,
//         });

//         data.embeddings.push(saved._id as mongoose.Types.ObjectId);
//         await data.save();

//         results.push((saved._id as mongoose.Types.ObjectId).toString());
//       }
//       currentObjectId = fourthDerivatives[fourthDerivatives.length - 1]
//         ._id as mongoose.Types.ObjectId;
//     }

//     return results.length;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };
