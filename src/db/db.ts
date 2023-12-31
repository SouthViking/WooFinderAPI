import path from 'path';

import * as dotenv from 'dotenv';
import {
    MongoClient,
    ServerApiVersion,
    Filter,
    FindOptions,
    Document,
    InsertOneOptions,
    OptionalUnlessRequiredId,
    UpdateFilter,
    UpdateOptions,
    DeleteOptions,
    WithTransactionCallback,
    TransactionOptions,
} from 'mongodb';

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

    private getCollection<TSchema extends Document>(collectionName: string) {
        return this.client.db(this.databaseConfig.name).collection<TSchema>(collectionName);
    }

    public async findOne<TSchema extends Document>(collectionName: string, filter: Filter<TSchema>, options?: FindOptions) {
        return await this.getCollection<TSchema>(collectionName).findOne(filter, options);
    }

    public async find<TSchema extends Document>(collectionName: string, filter: Filter<TSchema>, options?: FindOptions) {
        return await this.getCollection<TSchema>(collectionName).find(filter, options);
    }

    public async insertOne<TSchema extends Document>(collectionName: string, document: OptionalUnlessRequiredId<TSchema>, options?: InsertOneOptions) {
        return await this.getCollection<TSchema>(collectionName).insertOne(document, options);
    }

    public async updateOne<TSchema extends Document>(collectionName: string, filter: Filter<TSchema>, update: UpdateFilter<TSchema> | Partial<TSchema>, options?: UpdateOptions) {
        return await this.getCollection<TSchema>(collectionName).updateOne(filter, update, options);
    }

    public async deleteOne<TSchema extends Document>(collectionName: string, filter: Filter<TSchema>, options?: DeleteOptions) {
        return await this.getCollection<TSchema>(collectionName).deleteOne(filter, options);
    }

    public async deleteMany<TSchema extends Document>(collectionName: string, filter: Filter<TSchema>, options?: DeleteOptions) {
        return await this.getCollection<TSchema>(collectionName).deleteMany(filter, options);
    }

    public async withTransaction<T = any>(callback: WithTransactionCallback<T>, options?: TransactionOptions) {
        const session = this.client.startSession();

        try {
            await session.withTransaction<T>(callback, options);

        } finally {
            await session.endSession();
        }

    }
}

export const storage = new Storage({ uri: process.env.DB_CONNECTION_URI!, name: process.env.DB_NAME! });