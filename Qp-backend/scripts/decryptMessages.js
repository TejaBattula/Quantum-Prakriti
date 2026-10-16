import 'dotenv/config';
import fs from 'node:fs';
import mongoose from 'mongoose';
import ContactMessage from '../src/model.js';
import { decryptRecord } from '../src/crypto.js';

const keyFile = process.argv[2] || 'mlkem-secret.key';
const secretKey = fs.readFileSync(keyFile, 'utf8').trim();

await mongoose.connect(process.env.MONGODB_URI);
const records = await ContactMessage.find().sort({ createdAt: -1 }).lean();

for (const rec of records) {
  try {
    const msg = decryptRecord(rec, secretKey);
    console.log({ id: rec._id.toString(), at: rec.createdAt, ...msg });
  } catch {
    console.log({ id: rec._id.toString(), error: 'could not decrypt' });
  }
}

await mongoose.disconnect();