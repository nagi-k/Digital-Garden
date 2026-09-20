const crypto = require('crypto');

const randomData = process.argv[2];
const difficulty = parseInt(process.argv[3] || '4', 10);
const threads = parseInt(process.argv[4] || '1', 10);
const thread = parseInt(process.argv[5] || '0', 10);

const c = Math.floor(difficulty / 2);
const l = difficulty % 2 !== 0;

function check(hashBuf) {
  for (let a = 0; a < c; a++) {
    if (hashBuf[a] !== 0) return false;
  }
  if (l && (hashBuf[c] >> 4) !== 0) return false;
  return true;
}

let nonce = thread;
while (true) {
  const hash = crypto.createHash('sha256').update(randomData + nonce).digest();
  if (check(hash)) {
    const hashHex = hash.toString('hex');
    console.log(JSON.stringify({ hash: hashHex, nonce }));
    process.exit(0);
  }
  nonce += threads;
}
