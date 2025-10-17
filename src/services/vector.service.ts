import { QdrantClient } from "@qdrant/js-client-rest";

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const DEFAULT_QDRANT_VECTOR_SIZE = 384; // default for all-MiniLM-L6-v2

export type SegmentPayload = {
  text: string;
  start_time: number;
  end_time: number;
};
export type VectorPoint = {
  id: number;
  vector: number[];
  payload: SegmentPayload;
};

const qdrantClient = new QdrantClient({
  url: QDRANT_URL!,
  apiKey: QDRANT_API_KEY!,
});

export const initVectorCollection = async (
  collectionName: string,
  vectorSize: number
) => {
  try {
    const isCollectionExists = await qdrantClient.collectionExists(
      collectionName
    );
    if (!isCollectionExists.exists) {
      await qdrantClient.createCollection(collectionName, {
        vectors: {
          size: vectorSize,
          distance: "Cosine",
        },
      });
    }
    console.log("✅ Qdrant collection is ready: ", collectionName);
  } catch (error) {
    console.error("❌ Failed to initialize Qdrant collection: ", error);
    throw new Error("Qdrant initialization error");
  }
};

export const storeVectorPoints = async (
  collectionName: string,
  vectors: VectorPoint[]
) => {
  try {
    await initVectorCollection(
      collectionName,
      vectors[0]?.vector.length || DEFAULT_QDRANT_VECTOR_SIZE
    );
    await qdrantClient.upsert(collectionName, { points: vectors });
    console.log(
      "✅ Successfully stored vector points in collection: ",
      collectionName
    );
  } catch (error) {
    console.error("❌ Failed to store vector points: ", error);
    throw new Error("Failed to store vector points");
  }
};

export const searchSimilarVectors = async (
  collectionName: string,
  vector: number[]
) => {
  try {
    const result = await qdrantClient.search(collectionName, { vector });
    console.log(
      "✅ Successfully searched similar vectors in collection: ",
      collectionName,
      " Results: ",
      result
    );
    return result;
  } catch (error) {
    console.error("❌ Failed to search similar vectors: ", error);
    throw new Error("Failed to search similar vectors");
  }
};

export const deleteVectorCollection = async (collectionName: string) => {
  try {
    await qdrantClient.deleteCollection(collectionName);
    console.log("✅ Successfully deleted Qdrant collection: ", collectionName);
  } catch (error) {
    console.error("❌ Failed to delete Qdrant collection: ", error);
  }
};
