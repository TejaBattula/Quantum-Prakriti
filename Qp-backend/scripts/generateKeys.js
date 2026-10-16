import fs from 'node:fs';
import { ml_kem768 } from '@noble/post-quantum/ml-kem.js';

const { publicKey, secretKey } = ml_kem768.keygen();
const b64 = (u8) => Buffer.from(u8).toString('base64');

fs.writeFileSync('mlkem-secret.key', b64(secretKey), { mode: 0o600 });

console.log('\nAdd this to your .env:\n');
console.log(`MLKEM_PUBLIC_KEY=${b64(publicKey)}\n`);
console.log('Secret key saved to mlkem-secret.key. Move it OFF the server and never commit it.\n');