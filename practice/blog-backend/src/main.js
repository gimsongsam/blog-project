require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

// const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('@koa/cors');
// import cors from 'cors';

import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';
// import createFakeData from './createFakeData';

// 비구조화 할당을 통해 process.env 내부 값에 대한 레퍼런스 만들기
// 환경변수에 접근하기
const { PORT, MONGO_URI } = process.env;

// mongoose를 이용하여 서버와 데이터베이스 연결하기
mongoose
    .connect(MONGO_URI, {useNewUrlParser: true})
    .then(() => {
        console.log('Connected to MongoDB');
        // createFakeData();
    })
    .catch(e => {
        console.error(e);
    });

const app = new Koa();
const router = new Router();

// cors 설정
app.use(cors({
    // origin: '*',
    // credentials: false,
}));

app.proxy = true

// 라우터 설정
router.use('/api', api.routes()); // api 라우트 적용

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());
// 라우터 적용 전에 JWT 미들웨어 적용
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// PORT가 지정되어 있지 않다면 4000을 사용
const port = PORT || 4000;
app.listen(port, () => {
    console.log('Listening to port %d', port);
});