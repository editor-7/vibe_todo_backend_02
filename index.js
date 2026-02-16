const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todosRouter = require('./routers/todos');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);
app.options('*', cors());

const MONGO_URI = process.env.MONGO_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/todo';

// 연결 대상 확인 (비밀번호 제외하고 호스트만 표시)
const isAtlas = MONGO_URI.includes('mongodb+srv://') && MONGO_URI.includes('mongodb.net');
if (isAtlas) {
  console.log('DB 연결 대상: Atlas (cluster0.wsuv9mb.mongodb.net) → todo DB');
} else {
  console.log('DB 연결 대상: localhost:27017 → todo DB (.env의 MONGO_URL을 Atlas 주소로 바꾸면 Atlas에 저장됩니다)');
}

app.get('/', function (req, res) {
  res.send('서버가 동작 중입니다.');
});

// Atlas 연결 여부 확인용 (브라우저에서 http://localhost:5000/api/db-info 로 확인 가능)
app.get('/api/db-info', function (req, res) {
  const host = mongoose.connection.host || '';
  const name = mongoose.connection.name || 'todo';
  const isAtlasConnected = host.includes('mongodb.net');
  res.json({
    connectedTo: isAtlasConnected ? 'Atlas' : 'localhost',
    host: host,
    database: name,
    message: isAtlasConnected ? '데이터가 MongoDB Atlas 클라우드에 저장됩니다.' : '데이터가 로컬 MongoDB에 저장됩니다.',
  });
});

app.use('/api/todos', todosRouter);

mongoose
  .connect(MONGO_URI)
  .then(function () {
    console.log('MongoDB 연결성공 (데이터는 위 "DB 연결 대상"에 표시된 곳에 저장됩니다)');
    app.listen(PORT, function () {
      console.log('서버가 포트 ' + PORT + '에서 실행 중입니다.');
    });
  })
  .catch(function (err) {
    console.error('MongoDB 연결 실패:', err.message);
    process.exit(1);
  });
