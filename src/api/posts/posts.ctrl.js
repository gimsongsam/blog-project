import Post from '../../models/post'
import mongoose from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

export const checkObjectId = (ctx, next) => {
    const {id} = ctx.params; // id값을 추출하기
    if(!ObjectId.isValid(id)){ // id값이 없다면
        console.log('hello');
        ctx.status = 400; // Bad Request
        return;
    }
    return next(); // 다음 테스크 실행
};

/*
    POST /api/posts
    {
        title: '제목',
        body: '내용',
        tags: ['태그1', '태그2']
    }
*/
export const write = async ctx => {
    const schema = Joi.object().keys({
        // 객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string().required(), // required()가 있으면 필수 항목
        body: Joi.string().required(),
        tags: Joi.array()
            .items(Joi.string())
            .required(), // 문자열로 이루어진 배열
    });

    // 검증하고 나서 검증 실패인 경우 에러 처리
    const result = schema.validate(ctx.request.body);
    if(result.error){
        // console.log('test');
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }

    const { title, body, tags } = ctx.request.body;
    const post = new Post({ // 반환값이 Promise 이므로 async/await 사용이 가능하다.
        title,
        body,
        tags,
    });
    try{
        await post.save();
        ctx.body = post;
    } catch (e){
        ctx.throw(500, e);
    }
};
// 함수의 반환값이 Promise이다.

/*
    GET /api/posts
*/
export const list = async ctx => {
    try {
        const posts = await Post.find().exec();
        ctx.body = posts;
    } catch (e){
        ctx.throw(500, e);
    }
};

/*
    GET /api/posts/:id
*/

export const read = async ctx => {
    const {id} = ctx.params;
    try{
        const post = await Post.findById(id).exec();
        if (!post){
            ctx.status = 404; // Not Found
            return;
        }
        ctx.body = post;
    }catch (e){
        ctx.throw(500, e);
    }
};

/*
    DELETE / api/posts/:id
*/
export const remove = async ctx => {
    const { id } = ctx.params;
    try{
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204; // No Content (성공하기는 했지만 응답할 데이터는 없음)
    } catch (e){
        ctx.throw(500, e);
    }
};

/*
    PATCH /api/posts/:id
    {
        title: '수정',
        body: '수정 내용',
        tags: ['수정', '태그']
    }
*/
export const update = async ctx => {
    const { id } = ctx.params;
    try{
        console.log('error');
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true, // 이 값을 설정하면 업데이트된 데이터를 반환합니다.
            // false일 때는 업데이트되기 전의 데이터를 반환합니다.
        }).exec();
        if (!post){
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch (e){
        ctx.throw(500, e);
    }
};



// write에서 사용한 schema와 비슷한데, required()가 없습니다.
// const schema = Joi.object().keys({
//     title: Joi.string(),
//     body: Joi.string(),
//     tags: Joi.array().items(Joi.string()),
// })

// // 검증하고 나서 검증 실패인 경우 에러 처리
// const result = schema.validate(ctx.request.body);
// if(result.error){
//     ctx.status = 400; // Bad Request
//     ctx.body = result.error;
//     return;
// }