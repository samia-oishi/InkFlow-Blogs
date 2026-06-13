import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'inkflow';

let cachedClient = null;
let cachedDb = null;

export function hasMongoConfig() {
  return Boolean(uri);
}

export async function getDb() {
  if (!uri) {
    throw new Error('Missing MONGODB_URI. Add your MongoDB Atlas connection string to .env.local.');
  }

  if (cachedClient && cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();

  cachedClient = client;
  cachedDb = client.db(dbName);

  return cachedDb;
}

export async function blogsCollection() {
  const db = await getDb();
  return db.collection('blogs');
}

export async function profilesCollection() {
  const db = await getDb();
  return db.collection('profiles');
}
