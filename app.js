// app.js
import express from 'express';
import s3routes from './routes/s3Routes.js';
import config from './config.js';

const app = express();

app.use(s3routes)

// 서버 시작
const port = config.port;
app.listen(port, () => {
  console.log(`서버가 ${port}번 포트에서 실행 중입니다.`);
});
