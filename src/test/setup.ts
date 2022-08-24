import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';

let mongo: any;

declare global {
  var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper');
jest.setTimeout(600000);

process.env.STRIPE_SECRET_KEY =
  'sk_test_51LaGzYLUCuKOBkeUJtqfCbxUqmyuGYRvx6AEc0wFXp4LmhzqhLQ86Yk0kMPj6wwiK4QeTbZlcMnbhrVSofMwKVfy00pjqdG4pq';

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWT payload. { id, email }
  const userId = id || new mongoose.Types.ObjectId().toHexString();
  const email = 'test@test.com';

  // Create the JWT!
  const token = jwt.sign({ id: userId, email }, process.env.JWT_KEY!);

  // Build the session object
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
