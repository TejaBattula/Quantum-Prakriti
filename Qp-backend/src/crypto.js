import crypto from 'node:crypto';
import { ml_kem768 } from '@noble/post-quantum/ml-kem.js';

export const ALG = 'ML-KEM-768+HKDF-SHA256+AES-256-GCM';
const INFO = 'contact-form-v1';

const toB64 = (buf) => Buffer.from(buf).toString('base64');
const fromB64 = (s) => new Uint8Array(Buffer.from(s, 'base64'));

const deriveKey = (sharedSecret, salt) =>
  Buffer.from(crypto.hkdfSync('sha256', sharedSecret, salt, INFO, 32));

export function encryptRecord(obj, publicKeyB64) {
  const { cipherText, sharedSecret } = ml_kem768.encapsulate(fromB64(publicKeyB64));

  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = deriveKey(sharedSecret, salt);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(ALG));
  const data = Buffer.concat([cipher.update(JSON.stringify(obj), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  sharedSecret.fill(0);
  key.fill(0);

  return {
    alg: ALG,
    kemCipherText: toB64(cipherText),
    salt: toB64(salt),
    iv: toB64(iv),
    tag: toB64(tag),
    data: toB64(data),
  };
}

export function decryptRecord(rec, secretKeyB64) {
  const sharedSecret = ml_kem768.decapsulate(fromB64(rec.kemCipherText), fromB64(secretKeyB64));
  const key = deriveKey(sharedSecret, Buffer.from(rec.salt, 'base64'));

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(rec.iv, 'base64'));
  decipher.setAAD(Buffer.from(rec.alg));
  decipher.setAuthTag(Buffer.from(rec.tag, 'base64'));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(rec.data, 'base64')),
    decipher.final(),
  ]);

  sharedSecret.fill(0);
  key.fill(0);
  return JSON.parse(plain.toString('utf8'));
}