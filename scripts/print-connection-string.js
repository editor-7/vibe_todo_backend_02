const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const uri = process.env.MONGO_URL || process.env.MONGO_URI;
if (!uri) {
  console.error('.env에 MONGO_URL 또는 MONGO_URI가 없습니다.');
  process.exit(1);
}

console.log('\n=== MongoDB Compass 연결 문자열 (아래 한 줄을 복사해서 Compass에 붙여넣기) ===\n');
console.log(uri);
console.log('\n');
