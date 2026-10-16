import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    alg: { type: String, required: true },
    kemCipherText: { type: String, required: true },
    salt: { type: String, required: true },
    iv: { type: String, required: true },
    tag: { type: String, required: true },
    data: { type: String, required: true }, // encrypted name/email/subject/message
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', messageSchema);