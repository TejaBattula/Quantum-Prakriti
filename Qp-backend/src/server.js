import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { encryptRecord } from './crypto.js';
import ContactMessage from './model.js';

const { PORT = 5000, MONGODB_URI, CORS_ORIGIN, MLKEM_PUBLIC_KEY } = process.env;

if (!MONGODB_URI || !MLKEM_PUBLIC_KEY) {
  console.error('Missing MONGODB_URI or MLKEM_PUBLIC_KEY in .env');
  process.exit(1);
}

const app = express();
app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, methods: ['POST'] }));
app.use(express.json({ limit: '20kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, subject, message }) {
  const isStr = (v, max) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
  if (!isStr(name, 100)) return 'Invalid name';
  if (!isStr(email, 200) || !EMAIL_RE.test(email)) return 'Invalid email';
  if (!isStr(subject, 200)) return 'Invalid subject';
  if (!isStr(message, 5000)) return 'Invalid message';
  return null;
}

app.post('/api/contact', limiter, async (req, res) => {
  try {
    const error = validate(req.body || {});
    if (error) return res.status(400).json({ error });

    const { name, email, subject, message } = req.body;
    const record = encryptRecord(
      {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      },
      MLKEM_PUBLIC_KEY
    );

    await ContactMessage.create(record);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Contact error:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });