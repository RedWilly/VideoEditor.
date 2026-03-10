import { MongoClient } from "mongodb";
import { webEnv } from "@opencut/env/web";

let _client: MongoClient | null = null;

function getMongoClient() {
	if (!_client) {
		_client = new MongoClient(webEnv.MONGODB_URI);
	}

	return _client;
}

export const client = getMongoClient();
export const db = client.db(webEnv.MONGODB_DB_NAME);
