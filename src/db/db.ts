import path from 'path';

import * as dotenv from 'dotenv';
import { MongoClient, ServerApiVersion, Filter, FindOptions, Document, InsertOneOptions, OptionalUnlessRequiredId } from 'mongodb';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface DatabaseConfig {
    uri: string;
    name: string;
}

class Storage {
    private client: MongoClient;
    private databaseConfig: DatabaseConfig;

    constructor(databaseConfig: DatabaseConfig) {
        this.databaseConfig = databaseConfig;

        this.client = new MongoClient(this.databaseConfig.uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });

        this.connect();
    }

    private async connect() {
        await this.client.connect();
    }

    public async findOne<TSchema extends Document>(collectionName: string, filter: Filter<TSchema>, options?: FindOptions) {
        return await this.client.db(this.databaseConfig.name).collection<TSchema>(collectionName).findOne(filter, options);
    }

    public async insertOne<TSchema>(collectionName: string, document: OptionalUnlessRequiredId<TSchema>, options?: InsertOneOptions) {
        return await this.client.db(this.databaseConfig.name).collection(collectionName).insertOne(document, options);
    }
}

export const storage = new Storage({ uri: process.env.DB_CONNECTION_URI!, name: process.env.DB_NAME! });