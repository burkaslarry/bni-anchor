import { MongoClient, type Db } from "mongodb";

function envValue(key: string): string | undefined {
  const raw = process.env[key]?.trim();
  if (!raw) return undefined;
  return raw.replace(/^["']|["']$/g, "");
}

const uri = envValue("MONGODB_URI");
const dbName = envValue("MONGODB_DB") ?? "bni_anchor";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}

export function hasMongo(): boolean {
  return Boolean(uri);
}
